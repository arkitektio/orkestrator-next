import * as THREE from "three";
import { LruByteCache } from "./lruByteCache";
import { buildFabriksCellIndex, type FabriksCellEntry, type FabriksCellIndex, type FabriksCellRow } from "./fabriksCatalogs";
import type { FabriksCollection, FabriksTransportStats } from "./fabriksCollection";
import type { MeshoptDecoderLike } from "./fabriksDecode";
import { groupByRowGroup, planFabriksCells, type FabriksPlanInput } from "./fabriksPlanner";

/**
 * Imperative orchestration of one fabriks collection: plan → fetch → decode →
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
 *
 * Debug consumers (DebugPanel) read `stats` / `buildDebugReport()` and steer
 * the planner through `setPlanConfig` — the `BrickResidencyManager.stats`
 * pattern, so the octree and mesh panels share one idiom.
 */

const DEFAULT_CACHE_BYTES = 192 * 1024 * 1024;
const DEFAULT_MAX_CELLS = 2048;

/** The debug overlay's child name; the reconcile loop must never treat it as a cell. */
const CELL_BOXES_NAME = "__fabriks-cell-boxes__";

export type FabriksMaterialConfig = {
  color: readonly number[] | null | undefined;
  wireframe: boolean;
  opacity: number;
};

/** Camera-derived inputs per plan. Budgets live in `FabriksPlanConfig`. */
export type FabriksPlanView = Pick<
  FabriksPlanInput,
  "frustum" | "cameraPosition" | "focalPixels"
>;

/** Runtime planner knobs, adjustable from the debug panel between settles. */
export type FabriksPlanConfig = {
  /** Screen-space error a cell may carry before it is refined, in pixels. */
  pixelBudget: number;
  /** Cap on planned cells. Exhausting it coarsens; it never drops a region. */
  maxCells: number;
  /** Ignore camera settles (the last plan keeps rendering) — for inspecting a
   * plan from other angles without replanning it away. */
  frozen: boolean;
};

/**
 * Counters over the manager's lifetime, mutated in place — never a store
 * write at streaming cadence (P17). All `…Ms` are main-thread sums; `streamMs`
 * brackets `readFetchGroup` (network + parse + decode together — the
 * transport's own `fetchMs` isolates the network share), `buildMs` brackets
 * BufferGeometry assembly and `normalsMs` the `computeVertexNormals` share of
 * it. `completeMs` is the wall clock from a plan to its last mounted cell —
 * the mesh twin of the brick stats' `timeToSharpMs`, and the number to judge
 * streaming by.
 */
export type FabriksManagerStats = {
  plans: number;
  planMs: number;
  streamMs: number;
  buildMs: number;
  normalsMs: number;
  decodedCells: number;
  fetchErrors: number;
  /** Drains stopped by a superseding replan (or disposal) mid-work. */
  abortedDrains: number;
  completeMs: number;
};

/** One plan's shape, kept for the debug panel after the plan itself is consumed. */
export type FabriksPlanSummary = {
  cellCount: number;
  /** Selected cells per level, e.g. `{ 2: 8, 1: 41 }`. */
  byLevel: Record<number, number>;
  totalIndices: number;
  coarsenedRegions: number;
};

export class FabriksCollectionManager {
  /** Mounted by the React layer via `<primitive>`; children managed here. */
  readonly group = new THREE.Group();

  readonly stats: FabriksManagerStats = {
    plans: 0,
    planMs: 0,
    streamMs: 0,
    buildMs: 0,
    normalsMs: 0,
    decodedCells: 0,
    fetchErrors: 0,
    abortedDrains: 0,
    completeMs: 0,
  };

  private readonly material: THREE.MeshStandardMaterial;
  private readonly cache: LruByteCache<THREE.Mesh>;
  private index: FabriksCellIndex | null = null;
  private planned = new Map<string, string>();
  private plannedEntries: readonly FabriksCellEntry[] = [];
  private lastPlan: FabriksPlanSummary | null = null;
  private previousKeys: ReadonlySet<string> = new Set();
  private decoderPromise: Promise<MeshoptDecoderLike | null> | null = null;
  /** Bumped per plan; a drain whose generation is stale abandons its work. */
  private generation = 0;
  private draining = false;
  private pendingView: FabriksPlanView | null = null;
  private disposed = false;
  private planConfig: FabriksPlanConfig;
  /** The camera inputs of the newest settle, replayed when a knob changes. */
  private lastView: FabriksPlanView | null = null;
  private planStartedAt = 0;
  private showCellBoxes = false;
  private cellBoxes: THREE.LineSegments | null = null;

  constructor(
    private readonly opts: {
      collection: FabriksCollection;
      /** Voxel → world for this layer; the index is built in world space. */
      voxelToWorld: THREE.Matrix4;
      loadDecoder: () => Promise<MeshoptDecoderLike | null>;
      onInvalidate: () => void;
      /** Streaming-cadence stats signal for debug consumers; throttle at the
       * subscriber, not here (the manager stays render-cadence-blind). */
      onStatsChanged?: () => void;
      maxCacheBytes?: number;
      maxCells?: number;
    },
  ) {
    this.group.matrixAutoUpdate = false;
    this.planConfig = {
      pixelBudget: 1,
      maxCells: opts.maxCells ?? DEFAULT_MAX_CELLS,
      frozen: false,
    };
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

  setMaterialConfig({ color, wireframe, opacity }: FabriksMaterialConfig): void {
    if (color && color.length >= 3) {
      this.material.color.setRGB(color[0] / 255, color[1] / 255, color[2] / 255);
    }
    this.material.wireframe = wireframe;
    this.material.opacity = opacity;
    this.material.transparent = opacity < 1;
    this.material.needsUpdate = true;
  }

  getPlanConfig(): Readonly<FabriksPlanConfig> {
    return this.planConfig;
  }

  /**
   * Adjust planner knobs between settles. A change replans against the last
   * settle's camera immediately (unless frozen), so a slider drag shows its
   * effect without waiting for the next camera move; unfreezing replays the
   * settles that were ignored.
   */
  setPlanConfig(partial: Partial<FabriksPlanConfig>): void {
    const previous = this.planConfig;
    this.planConfig = { ...previous, ...partial };
    if (this.disposed) return;
    const thawed = previous.frozen && !this.planConfig.frozen;
    const changed =
      this.planConfig.pixelBudget !== previous.pixelBudget ||
      this.planConfig.maxCells !== previous.maxCells;
    if ((thawed || changed) && !this.planConfig.frozen && this.lastView) {
      this.runPlan(this.lastView);
    }
  }

  /** Draw the current plan's cell boxes (voxel-space, colored by level). */
  setShowCellBoxes(show: boolean): void {
    this.showCellBoxes = show;
    this.rebuildCellBoxes();
    this.opts.onInvalidate();
  }

  getShowCellBoxes(): boolean {
    return this.showCellBoxes;
  }

  /** Load the spatial index. One whole-file read; no geometry is opened. */
  async ensureIndex(): Promise<void> {
    if (this.index || this.disposed) return;
    const rows: FabriksCellRow[] = await this.opts.collection.loadCellCatalog();
    if (this.disposed) return;
    this.index = buildFabriksCellIndex(rows, this.opts.collection.manifest, this.opts.voxelToWorld);
  }

  updatePlan(view: FabriksPlanView): void {
    // Recorded even when frozen or index-less, so a thaw (or a late index)
    // replans against the newest camera rather than a stale one.
    this.lastView = view;
    if (!this.index || this.disposed || this.planConfig.frozen) return;
    this.runPlan(view);
  }

  private runPlan(view: FabriksPlanView): void {
    const index = this.index;
    if (!index || this.disposed) return;

    const planStart = performance.now();
    const plan = planFabriksCells({
      index,
      maxCells: this.planConfig.maxCells,
      pixelBudget: this.planConfig.pixelBudget,
      previousKeys: this.previousKeys,
      ...view,
    });
    this.previousKeys = plan.keys;
    this.planned = new Map(plan.cells.map((cell) => [cell.key, cell.key]));
    this.plannedEntries = plan.cells;
    this.lastPlan = {
      cellCount: plan.cells.length,
      byLevel: plan.cells.reduce<Record<number, number>>((acc, cell) => {
        acc[cell.level] = (acc[cell.level] ?? 0) + 1;
        return acc;
      }, {}),
      totalIndices: plan.totalIndices,
      coarsenedRegions: plan.coarsenedRegions,
    };
    this.cache.protect(this.planned.keys());

    // Drop no-longer-planned cells from the scene; they stay cached. The
    // debug overlay is not a cell and never reconciles away.
    for (const child of [...this.group.children]) {
      if (child === this.cellBoxes) continue;
      if (!this.planned.has(child.name)) this.group.remove(child);
    }
    // Mount already-decoded cells instantly.
    for (const key of this.planned.keys()) {
      const cached = this.cache.get(key);
      if (cached && cached.parent !== this.group) this.group.add(cached);
    }
    this.rebuildCellBoxes();
    this.stats.plans++;
    this.stats.planMs += performance.now() - planStart;
    this.planStartedAt = planStart;
    this.opts.onInvalidate();
    this.opts.onStatsChanged?.();

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
        if (missing.length === 0) {
          this.stats.completeMs = performance.now() - this.planStartedAt;
          this.opts.onStatsChanged?.();
          continue;
        }

        const decoder = this.opts.collection.manifest.encoding.codec === "MESHOPT"
          ? await this.ensureDecoder()
          : null;
        if (this.isStale(generation)) return this.abandon();

        // Near-first: `missing` preserves the plan's ordering, so the closest
        // cell's row group is fetched first.
        for (const group of groupByRowGroup(missing)) {
          if (this.isStale(generation)) return this.abandon();
          const streamStart = performance.now();
          let decoded;
          try {
            decoded = await this.opts.collection.readFetchGroup(group, decoder);
          } catch (error) {
            this.stats.fetchErrors++;
            this.opts.onStatsChanged?.();
            console.error(
              `[fabriks] failed to read level ${group.level} part ${group.part} row group ${group.rowGroup}:`,
              error,
            );
            continue;
          }
          this.stats.streamMs += performance.now() - streamStart;
          if (this.isStale(generation)) return this.abandon();

          const buildStart = performance.now();
          for (const [key, cell] of decoded) {
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.BufferAttribute(cell.positions, 3));
            geometry.setAttribute("objectOrdinal", new THREE.BufferAttribute(cell.objectOrdinals, 1));
            geometry.setIndex(new THREE.BufferAttribute(cell.indices, 1));
            // fabriks carries no normals column — the surface is watertight per
            // cell, so computing them here is the intended path, not a fallback.
            const normalsStart = performance.now();
            geometry.computeVertexNormals();
            this.stats.normalsMs += performance.now() - normalsStart;

            const mesh = new THREE.Mesh(geometry, this.material);
            mesh.name = key;
            mesh.matrixAutoUpdate = false;
            this.cache.set(key, mesh, cell.bytes);
            // Mount only if still planned: a replan may have raced this fetch,
            // and the cache absorbs the result either way.
            if (this.planned.has(key)) this.group.add(mesh);
          }
          this.stats.buildMs += performance.now() - buildStart;
          this.stats.decodedCells += decoded.size;
          this.opts.onInvalidate();
          this.opts.onStatsChanged?.();
        }
        this.stats.completeMs = performance.now() - this.planStartedAt;
        this.opts.onStatsChanged?.();
      }
    } finally {
      this.draining = false;
    }
  }

  /** A drain from a superseded plan stops rather than mounting stale work. */
  private isStale(generation: number): boolean {
    return this.disposed || generation !== this.generation;
  }

  private abandon(): void {
    this.stats.abortedDrains++;
    this.opts.onStatsChanged?.();
  }

  /** One paste-able snapshot for DebugPanel and the octree debug report. */
  buildDebugReport(): {
    planConfig: FabriksPlanConfig;
    stats: FabriksManagerStats;
    lastPlan: FabriksPlanSummary | null;
    mountedCells: number;
    cache: { cells: number; bytes: number };
    transport: FabriksTransportStats | null;
    catalog: { cells: number; levels: number[]; roots: number } | null;
  } {
    const overlay = this.cellBoxes ? 1 : 0;
    return {
      planConfig: { ...this.planConfig },
      stats: { ...this.stats },
      lastPlan: this.lastPlan ? { ...this.lastPlan, byLevel: { ...this.lastPlan.byLevel } } : null,
      mountedCells: this.group.children.length - (this.cellBoxes?.parent === this.group ? overlay : 0),
      cache: { cells: this.cache.size, bytes: this.cache.bytes },
      transport: this.opts.collection.transportStats(),
      catalog: this.index
        ? {
            cells: this.index.cells.length,
            levels: [...this.index.levels],
            roots: this.index.roots.length,
          }
        : null,
    };
  }

  private ensureDecoder(): Promise<MeshoptDecoderLike | null> {
    if (!this.decoderPromise) this.decoderPromise = this.opts.loadDecoder();
    return this.decoderPromise;
  }

  /**
   * The plan's cell boxes as ONE LineSegments (never a helper per cell), in
   * the collection's VOXEL space — the catalog's exact geometry bounds — so
   * the group's voxel→world matrix places them like the meshes themselves.
   */
  private rebuildCellBoxes(): void {
    if (this.cellBoxes) {
      this.group.remove(this.cellBoxes);
      this.cellBoxes.geometry.dispose();
      (this.cellBoxes.material as THREE.Material).dispose();
      this.cellBoxes = null;
    }
    if (!this.showCellBoxes || this.plannedEntries.length === 0 || this.disposed) return;

    // 12 edges a box, two vertices an edge: corner pairs differing in one bit.
    const EDGES: Array<[number, number]> = [];
    for (let corner = 0; corner < 8; corner++) {
      for (const bit of [1, 2, 4]) {
        if ((corner & bit) === 0) EDGES.push([corner, corner | bit]);
      }
    }
    const positions = new Float32Array(this.plannedEntries.length * EDGES.length * 2 * 3);
    const colors = new Float32Array(positions.length);
    const color = new THREE.Color();
    let cursor = 0;
    for (const entry of this.plannedEntries) {
      color.setHSL((entry.level * 0.31 + 0.05) % 1, 0.85, 0.55);
      for (const [a, b] of EDGES) {
        for (const corner of [a, b]) {
          positions[cursor] = corner & 1 ? entry.bboxMax[0] : entry.bboxMin[0];
          positions[cursor + 1] = corner & 2 ? entry.bboxMax[1] : entry.bboxMin[1];
          positions[cursor + 2] = corner & 4 ? entry.bboxMax[2] : entry.bboxMin[2];
          colors[cursor] = color.r;
          colors[cursor + 1] = color.g;
          colors[cursor + 2] = color.b;
          cursor += 3;
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    this.cellBoxes = new THREE.LineSegments(geometry, material);
    this.cellBoxes.name = CELL_BOXES_NAME;
    this.cellBoxes.matrixAutoUpdate = false;
    this.group.add(this.cellBoxes);
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
    if (this.cellBoxes) {
      this.cellBoxes.geometry.dispose();
      (this.cellBoxes.material as THREE.Material).dispose();
      this.cellBoxes = null;
    }
    this.group.clear();
    this.material.dispose();
    this.opts.collection.release();
  }
}
