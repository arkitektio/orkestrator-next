import * as THREE from "three";
import { LruByteCache } from "./lruByteCache";
import { buildMailleCellIndex, type MailleCellIndex, type MailleCellRow } from "./mailleCatalogs";
import type { MailleCollection } from "./mailleCollection";
import type { MeshoptDecoderLike } from "./mailleDecode";
import { groupByRowGroup, planMailleCells, type MaillePlanInput } from "./maillePlanner";

/**
 * Imperative orchestration of one maille collection: plan → fetch → decode →
 * scene-graph reconciliation.
 *
 * Deliberately NOT a React component (mirroring `BrickResidencyManager`): the
 * React layer owns lifecycle and feeds camera-settle events, and everything at
 * render cadence lives here behind plain method calls, so nothing re-renders
 * per streaming batch (OCTREE_RENDERER.md P17).
 *
 * Two properties worth naming, because both were absent from the DuckDB mesh
 * path this replaces:
 *
 *  - **Superseded work is abandoned.** Every drain carries a generation; a
 *    replan bumps it, and a stale drain stops at its next await instead of
 *    decoding and mounting a batch nobody asked for.
 *  - **Fetching is per ROW GROUP, not per cell.** The cell catalog's locator
 *    means several planned cells routinely live in one row group, and a row
 *    group is the smallest thing the reader can fetch.
 */

const DEFAULT_CACHE_BYTES = 192 * 1024 * 1024;
const DEFAULT_MAX_CELLS = 2048;

export type MailleMaterialConfig = {
  color: readonly number[] | null | undefined;
  wireframe: boolean;
  opacity: number;
};

export type MaillePlanView = Pick<
  MaillePlanInput,
  "frustum" | "cameraPosition" | "focalPixels" | "pixelBudget"
>;

export class MailleCollectionManager {
  /** Mounted by the React layer via `<primitive>`; children managed here. */
  readonly group = new THREE.Group();

  private readonly material: THREE.MeshStandardMaterial;
  private readonly cache: LruByteCache<THREE.Mesh>;
  private index: MailleCellIndex | null = null;
  private planned = new Map<string, string>();
  private previousKeys: ReadonlySet<string> = new Set();
  private decoderPromise: Promise<MeshoptDecoderLike | null> | null = null;
  /** Bumped per plan; a drain whose generation is stale abandons its work. */
  private generation = 0;
  private draining = false;
  private pendingView: MaillePlanView | null = null;
  private disposed = false;

  constructor(
    private readonly opts: {
      collection: MailleCollection;
      /** Voxel → world for this layer; the index is built in world space. */
      voxelToWorld: THREE.Matrix4;
      loadDecoder: () => Promise<MeshoptDecoderLike | null>;
      onInvalidate: () => void;
      maxCacheBytes?: number;
      maxCells?: number;
    },
  ) {
    this.group.matrixAutoUpdate = false;
    this.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.72, 0.72, 0.76),
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    this.cache = new LruByteCache<THREE.Mesh>(
      opts.maxCacheBytes ?? DEFAULT_CACHE_BYTES,
      (_key, mesh) => this.disposeMesh(mesh),
    );
  }

  setMaterialConfig({ color, wireframe, opacity }: MailleMaterialConfig): void {
    if (color && color.length >= 3) {
      this.material.color.setRGB(color[0] / 255, color[1] / 255, color[2] / 255);
    }
    this.material.wireframe = wireframe;
    this.material.opacity = opacity;
    this.material.transparent = opacity < 1;
    this.material.needsUpdate = true;
  }

  /** Load the spatial index. One whole-file read; no geometry is opened. */
  async ensureIndex(): Promise<void> {
    if (this.index || this.disposed) return;
    const rows: MailleCellRow[] = await this.opts.collection.loadCellCatalog();
    if (this.disposed) return;
    this.index = buildMailleCellIndex(rows, this.opts.collection.manifest, this.opts.voxelToWorld);
  }

  updatePlan(view: MaillePlanView): void {
    if (!this.index || this.disposed) return;

    const plan = planMailleCells({
      index: this.index,
      maxCells: this.opts.maxCells ?? DEFAULT_MAX_CELLS,
      previousKeys: this.previousKeys,
      ...view,
    });
    this.previousKeys = plan.keys;
    this.planned = new Map(plan.cells.map((cell) => [cell.key, cell.key]));
    this.cache.protect(this.planned.keys());

    // Drop no-longer-planned cells from the scene; they stay cached.
    for (const child of [...this.group.children]) {
      if (!this.planned.has(child.name)) this.group.remove(child);
    }
    // Mount already-decoded cells instantly.
    for (const key of this.planned.keys()) {
      const cached = this.cache.get(key);
      if (cached && cached.parent !== this.group) this.group.add(cached);
    }
    this.opts.onInvalidate();

    // A replan invalidates whatever the previous drain was doing.
    this.generation++;
    this.pendingView = view;
    void this.drain();
  }

  private async drain(): Promise<void> {
    if (this.draining) return;
    this.draining = true;
    try {
      while (!this.disposed && this.pendingView) {
        this.pendingView = null;
        const generation = this.generation;
        const index = this.index;
        if (!index) break;

        const missing = [...this.planned.keys()]
          .filter((key) => !this.cache.has(key))
          .map((key) => index.byKey.get(key))
          .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined);
        if (missing.length === 0) continue;

        const decoder = this.opts.collection.manifest.encoding.codec === "MESHOPT"
          ? await this.ensureDecoder()
          : null;
        if (this.isStale(generation)) return;

        // Near-first: `missing` preserves the plan's ordering, so the closest
        // cell's row group is fetched first.
        for (const group of groupByRowGroup(missing)) {
          if (this.isStale(generation)) return;
          let decoded;
          try {
            decoded = await this.opts.collection.readFetchGroup(group, decoder);
          } catch (error) {
            console.error(
              `[maille] failed to read level ${group.level} part ${group.part} row group ${group.rowGroup}:`,
              error,
            );
            continue;
          }
          if (this.isStale(generation)) return;

          for (const [key, cell] of decoded) {
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.BufferAttribute(cell.positions, 3));
            geometry.setAttribute("objectOrdinal", new THREE.BufferAttribute(cell.objectOrdinals, 1));
            geometry.setIndex(new THREE.BufferAttribute(cell.indices, 1));
            // maille carries no normals column — the surface is watertight per
            // cell, so computing them here is the intended path, not a fallback.
            geometry.computeVertexNormals();

            const mesh = new THREE.Mesh(geometry, this.material);
            mesh.name = key;
            mesh.matrixAutoUpdate = false;
            this.cache.set(key, mesh, cell.bytes);
            // Mount only if still planned: a replan may have raced this fetch,
            // and the cache absorbs the result either way.
            if (this.planned.has(key)) this.group.add(mesh);
          }
          this.opts.onInvalidate();
        }
      }
    } finally {
      this.draining = false;
    }
  }

  /** A drain from a superseded plan stops rather than mounting stale work. */
  private isStale(generation: number): boolean {
    return this.disposed || generation !== this.generation;
  }

  private ensureDecoder(): Promise<MeshoptDecoderLike | null> {
    if (!this.decoderPromise) this.decoderPromise = this.opts.loadDecoder();
    return this.decoderPromise;
  }

  private disposeMesh(mesh: THREE.Mesh): void {
    // three never disposes GPU buffers for you, and a streaming layer is
    // exactly the unbounded leak OCTREE_RENDERER.md P13 warns about.
    mesh.geometry.dispose();
    mesh.removeFromParent();
  }

  dispose(): void {
    this.disposed = true;
    this.generation++;
    this.cache.clear();
    this.group.clear();
    this.material.dispose();
    this.opts.collection.release();
  }
}
