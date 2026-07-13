import * as THREE from "three";
import { LruByteCache } from "./lruByteCache";
import { decodeGeometryRow, type MeshoptDecoderLike } from "./meshDecode";
import { meshCellKey } from "./mortonCell";
import { MeshParquetSource } from "./meshParquet";
import { planMeshCells, type MeshCellRecord, type MeshPlanInput } from "./meshPlanner";
import { cellVoxelBox, type MeshEncodingSpec, type MeshGridSpec } from "./meshSpec";

/**
 * Imperative orchestration of one mesh collection: plan → fetch → decode →
 * scene-graph reconciliation. Deliberately NOT a React component (mirrors
 * `BrickResidencyManager`): the React layer owns lifecycle and feeds
 * camera-settle events; everything render-cadence lives here behind plain
 * method calls, so nothing re-renders per streaming batch (P17).
 *
 * Concern boundaries: SQL/grants live in `MeshParquetSource`; byte-encoding
 * in `meshDecode`; cell selection in `meshPlanner`; this class owns only the
 * THREE objects, the LRU and in-flight bookkeeping.
 */

const DEFAULT_CACHE_BYTES = 192 * 1024 * 1024;
const DEFAULT_MAX_INDICES = 12_000_000; // ~4M triangles resident per collection
const DEFAULT_MAX_CELLS = 2048;

export type MeshMaterialConfig = {
  color: readonly number[] | null | undefined;
  wireframe: boolean;
  opacity: number;
};

export type MeshPlanView = Pick<
  MeshPlanInput,
  "voxelFrustum" | "cameraVoxelPos" | "pxPerVoxelAtUnitDistance" | "lodBias"
>;

export class MeshCollectionManager {
  /** Mounted by the React layer via `<primitive>`; children managed here. */
  readonly group = new THREE.Group();

  private readonly material: THREE.MeshStandardMaterial;
  private readonly cache: LruByteCache<THREE.Group>;
  private cells: MeshCellRecord[] | null = null;
  private planned = new Map<string, MeshCellRecord>();
  private fetching = false;
  private pendingPlan: MeshPlanView | null = null;
  private decoderPromise: Promise<MeshoptDecoderLike | null> | null = null;
  private disposed = false;

  constructor(
    private readonly opts: {
      grid: MeshGridSpec;
      encoding: MeshEncodingSpec;
      source: MeshParquetSource;
      /** Resolves the meshopt decoder; only awaited when the codec needs it. */
      loadDecoder: () => Promise<MeshoptDecoderLike | null>;
      onInvalidate: () => void;
      maxCacheBytes?: number;
      maxIndices?: number;
    },
  ) {
    this.group.matrixAutoUpdate = false;
    this.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.72, 0.72, 0.76),
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    this.cache = new LruByteCache<THREE.Group>(
      opts.maxCacheBytes ?? DEFAULT_CACHE_BYTES,
      (_key, cellGroup) => this.disposeCellGroup(cellGroup),
    );
  }

  setMaterialConfig({ color, wireframe, opacity }: MeshMaterialConfig): void {
    if (color && color.length >= 3) {
      this.material.color.setRGB(color[0] / 255, color[1] / 255, color[2] / 255);
    }
    this.material.wireframe = wireframe;
    this.material.opacity = opacity;
    this.material.transparent = opacity < 1;
    this.material.needsUpdate = true;
  }

  /** Load the per-cell index (one aggregate query, memoized by the source). */
  async ensureIndex(): Promise<void> {
    if (this.cells) return;
    const cells = await this.opts.source.loadCellIndex();
    if (this.disposed) return;
    this.cells = cells;
  }

  /**
   * Re-plan against a camera view (call at camera-settle cadence, never per
   * frame). Reconciles resident cells synchronously; missing cells stream in
   * one batched query. A plan arriving mid-fetch replaces the queued one —
   * only the LATEST view is ever fetched next.
   */
  updatePlan(view: MeshPlanView): void {
    if (this.disposed || !this.cells) return;

    const plan = planMeshCells({
      cells: this.cells,
      grid: this.opts.grid,
      maxIndices: this.opts.maxIndices ?? DEFAULT_MAX_INDICES,
      maxCells: DEFAULT_MAX_CELLS,
      ...view,
    });

    this.planned = new Map(plan.cells.map((cell) => [meshCellKey(cell.level, cell.cell), cell]));
    this.cache.protect(this.planned.keys());

    // Drop no-longer-planned cells from the scene (they stay cached).
    for (const child of [...this.group.children]) {
      if (!this.planned.has(child.name)) this.group.remove(child);
    }
    // Mount already-decoded cells instantly.
    const missing: MeshCellRecord[] = [];
    for (const [key, cell] of this.planned) {
      const cached = this.cache.get(key);
      if (cached) {
        if (cached.parent !== this.group) this.group.add(cached);
      } else {
        missing.push(cell);
      }
    }
    this.opts.onInvalidate();

    if (missing.length > 0) {
      this.pendingPlan = view;
      void this.drainFetches();
    }
  }

  private async drainFetches(): Promise<void> {
    if (this.fetching) return;
    this.fetching = true;
    try {
      while (!this.disposed && this.pendingPlan) {
        this.pendingPlan = null;
        const wanted = [...this.planned.values()].filter(
          (cell) => !this.cache.has(meshCellKey(cell.level, cell.cell)),
        );
        if (wanted.length === 0) continue;
        const level = wanted[0].level; // one level per plan by construction
        const rows = await this.opts.source.fetchCellRows(
          level,
          wanted.map((cell) => cell.cell),
        );
        if (this.disposed) return;

        const decoder =
          this.opts.encoding.codec === "MESHOPT" ? await this.ensureDecoder() : null;
        if (this.disposed) return;

        // Group rows per cell; a cell renders as the union of its fragments.
        const byCell = new Map<number, typeof rows>();
        for (const row of rows) {
          const list = byCell.get(row.cell) ?? [];
          list.push(row);
          byCell.set(row.cell, list);
        }

        for (const [cell, cellRows] of byCell) {
          const key = meshCellKey(level, cell);
          const cellGroup = new THREE.Group();
          cellGroup.name = key;
          let bytes = 0;
          for (const row of cellRows) {
            try {
              const decoded = decodeGeometryRow(
                row,
                this.opts.encoding,
                cellVoxelBox(this.opts.grid, level, cell),
                decoder,
              );
              const geometry = new THREE.BufferGeometry();
              geometry.setAttribute("position", new THREE.BufferAttribute(decoded.positions, 3));
              if (decoded.normals) {
                geometry.setAttribute("normal", new THREE.BufferAttribute(decoded.normals, 3));
              }
              geometry.setIndex(new THREE.BufferAttribute(decoded.indices, 1));
              if (!decoded.normals) geometry.computeVertexNormals();
              const mesh = new THREE.Mesh(geometry, this.material);
              mesh.matrixAutoUpdate = false;
              cellGroup.add(mesh);
              bytes += decoded.bytes;
            } catch (error) {
              console.warn(`[mesh] dropping malformed fragment in cell ${key}:`, error);
            }
          }
          if (cellGroup.children.length === 0) continue;
          this.cache.set(key, cellGroup, bytes);
          // Mount only if the cell is still part of the CURRENT plan (a
          // replan may have raced the fetch; the cache keeps it either way).
          if (this.planned.has(key)) this.group.add(cellGroup);
        }
        this.opts.onInvalidate();
      }
    } catch (error) {
      console.error("[mesh] geometry fetch failed:", error);
    } finally {
      this.fetching = false;
    }
  }

  private ensureDecoder(): Promise<MeshoptDecoderLike | null> {
    if (!this.decoderPromise) this.decoderPromise = this.opts.loadDecoder();
    return this.decoderPromise;
  }

  private disposeCellGroup(cellGroup: THREE.Group): void {
    // The overlay-geometry lesson (P13): three never disposes for you.
    for (const child of cellGroup.children) {
      if (child instanceof THREE.Mesh) child.geometry.dispose();
    }
    cellGroup.parent?.remove(cellGroup);
  }

  dispose(): void {
    this.disposed = true;
    this.cache.clear();
    this.group.clear();
    this.material.dispose();
  }
}
