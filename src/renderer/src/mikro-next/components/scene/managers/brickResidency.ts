import * as THREE from "three";
import type { StoreApi } from "zustand/vanilla";
import { getChunkWorker } from "../../../../lib/zarr/runner";
import { workerPool } from "../../../workers/pool";
import { getInitialVolumeTextureBudgetBytes } from "../core/lodPlanning";
import { resolveLayerDataRange } from "../core/dataRange";
import { resolveCollapsedSelection } from "../core/selection";
import { encodeEmptyValue } from "../glsl/brickTraversal";
import { BrickPoolState } from "../core/octree/brickPoolState";
import { repackBrick, type BrickArray, type RepackChunk } from "../core/octree/brickRepack";
import { brickSlotBytes, resolveBrickSpec, type BrickSpec } from "../core/octree/brickSpec";
import {
  buildLayerLevelGeometry,
  type LayerLevelGeometry,
  type LevelSource,
  type Vec3,
} from "../core/octree/levelGeometry";
import {
  brickGridForLevel,
  chunksTouchingBrick,
  fetchVoxelBox,
  nodeKey,
  nodeVoxelBox,
  parseNodeKey,
  totalBrickCount,
} from "../core/octree/nodeAddress";
import type { LayerNodePlan, PlannedNode } from "../core/octree/nodePlanning";
import {
  PAGE_FLAG_EMPTY,
  PAGE_FLAG_RESIDENT,
  PAGE_FLAG_UNMAPPED,
  buildPageTableLayout,
} from "../core/octree/pageTableLayout";
import type { LayerState } from "../core/layerModel";
import type { SceneState } from "../store/sceneStore";
import type { ViewerState } from "../store/viewerStore";
import {
  atlasKindForDtype,
  createBrickAtlas,
  disposeBrickAtlas,
  writeBrickToAtlas,
  type BrickAtlas,
} from "../render/bricks/gpu/brickAtlas";
import {
  clearPageTable,
  createPageTableTexture,
  disposePageTable,
  flushPageTable,
  setPageEntry,
  type PageTableTexture,
} from "../render/bricks/gpu/pageTableTexture";

/**
 * CPU-side octree residency: subscribes to `viewerStore.nodePlans`, fetches
 * the planned bricks' zarr chunks through the worker pool, repacks them into
 * stored bricks, and drains a byte-budgeted upload queue into the per-layer
 * brick atlas + page table each frame.
 *
 * Owned by `BrickSystemProvider` (needs the WebGLRenderer); a plain class
 * like `CanvasContext`, referenced from the store by handle only.
 */

const FRAME_UPLOAD_BUDGET_BYTES = 16 * 1024 * 1024;
const FRAME_UPLOAD_BUDGET_BRICKS = 24;
const PAGE_TEXTURE_MAX_EXTENT = 2048;
const MIN_POOL_HEADROOM_SLOTS = 64;
/** Concurrent brick fetches per layer — bounds worker-task fan-out and the
 * per-fetch main-thread overhead when a plan wants hundreds of bricks. */
const MAX_INFLIGHT_BRICKS = 12;
/** Residency bumps are throttled while streaming (they re-render consumers). */
const RESIDENCY_BUMP_INTERVAL_MS = 150;

type PendingBrick = {
  key: string;
  level: number;
  coords: Vec3;
  data: BrickArray;
  uniformValue: number | null;
  bytes: number;
};

export type LayerBrickPool = {
  layerId: string;
  mode: "2D" | "3D";
  sliceSignature: string;
  /** Structural identity: levels + spec + mode; a change rebuilds the pool. */
  structureSignature: string;
  geometry: LayerLevelGeometry;
  spec: BrickSpec;
  atlas: BrickAtlas;
  pageTable: PageTableTexture;
  pool: BrickPoolState;
  protectedKeys: Set<string>;
  inFlight: Map<string, AbortController>;
  /** Plan nodes waiting for a free fetch slot (refreshed per reconcile). */
  pendingFetch: PlannedNode[];
  queue: PendingBrick[];
  /** Keys currently in `queue` (O(1) membership for reconcile). */
  queuedKeys: Set<string>;
  /** Uniform bricks: page-mapped EMPTY, no slot; value = the uniform fill. */
  emptyValues: Map<string, number>;
  /** Per-dim fixed chunk coords / in-chunk offsets for non-spatial dims. */
  fixedChunkCoords: number[];
  fixedOffsets: number[];
  /** Layer data range (raw value space) — shader normalization + EMPTY encode. */
  minValue: number;
  maxValue: number;
};

type Deps = {
  renderer: THREE.WebGLRenderer;
  viewerStore: StoreApi<ViewerState>;
  sceneStore: StoreApi<SceneState>;
  invalidate: () => void;
};

export type ResidentBrickInfo = {
  level: number;
  coords: Vec3;
  empty: boolean;
};

export class BrickResidencyManager {
  private readonly pools = new Map<string, LayerBrickPool>();
  private disposed = false;
  private lastResidencyBumpAt = 0;

  constructor(private readonly deps: Deps) {}

  /** Subscribe to node plans; returns the unsubscribe handle. */
  start(): () => void {
    const { viewerStore } = this.deps;
    let lastPlans = viewerStore.getState().nodePlans;
    const unsubscribe = viewerStore.subscribe((state) => {
      if (state.nodePlans !== lastPlans) {
        lastPlans = state.nodePlans;
        this.reconcileAll(state.nodePlans);
      }
    });
    this.reconcileAll(viewerStore.getState().nodePlans);
    return unsubscribe;
  }

  getLayerPool(layerId: string): LayerBrickPool | null {
    return this.pools.get(layerId) ?? null;
  }

  snapshotResidency(): Record<string, ResidentBrickInfo[]> {
    const result: Record<string, ResidentBrickInfo[]> = {};
    for (const [layerId, pool] of this.pools) {
      const entries: ResidentBrickInfo[] = [];
      for (const key of pool.pool.keys()) {
        const { level, coords } = parseNodeKey(key);
        entries.push({ level, coords, empty: false });
      }
      for (const key of pool.emptyValues.keys()) {
        const { level, coords } = parseNodeKey(key);
        entries.push({ level, coords, empty: true });
      }
      result[layerId] = entries;
    }
    return result;
  }

  /**
   * CPU mirror of the shader's `sampleBrickEx`: raw value of the finest
   * resident brick at or coarser than desiredLevel, read from the atlas
   * backing store (probes, CPU raymarching). Null when nothing is resident.
   */
  sampleResident(
    layerId: string,
    baseVoxel: Vec3,
    desiredLevel: number,
    channel: number,
  ): number | null {
    const pool = this.pools.get(layerId);
    if (!pool) return null;
    const { geometry, spec, atlas } = pool;

    for (let level = Math.max(0, desiredLevel); level < geometry.levels.length; level++) {
      const { scale, spatialShape } = geometry.levels[level];
      const levelVoxel: Vec3 = [
        Math.min(Math.max(baseVoxel[0] / scale[0], 0), spatialShape[0] - 1e-3),
        Math.min(Math.max(baseVoxel[1] / scale[1], 0), spatialShape[1] - 1e-3),
        Math.min(Math.max(baseVoxel[2] / scale[2], 0), spatialShape[2] - 1e-3),
      ];
      const brick: Vec3 = [
        Math.floor(levelVoxel[0] / spec.payload[0]),
        Math.floor(levelVoxel[1] / spec.payload[1]),
        Math.floor(levelVoxel[2] / spec.payload[2]),
      ];
      const key = nodeKey(level, brick);

      const emptyValue = pool.emptyValues.get(key);
      if (emptyValue !== undefined) return emptyValue;

      const slot = pool.pool.slotOf(key);
      if (!slot) continue;

      const clampedChannel = Math.min(Math.max(channel, 0), spec.channelCount - 1);
      const texel: Vec3 = [
        slot.coords[0] * atlas.slotSize[0] +
          spec.border +
          Math.floor(levelVoxel[0] - brick[0] * spec.payload[0]),
        slot.coords[1] * atlas.slotSize[1] +
          spec.border +
          Math.floor(levelVoxel[1] - brick[1] * spec.payload[1]),
        slot.coords[2] * atlas.slotSize[2] +
          spec.border +
          Math.floor(levelVoxel[2] - brick[2] * spec.payload[2]) +
          clampedChannel * spec.stored[2],
      ];
      const index = (texel[2] * atlas.size[1] + texel[1]) * atlas.size[0] + texel[0];
      return atlas.backing[index];
    }
    return null;
  }

  private reconcileAll(plans: Record<string, LayerNodePlan>): void {
    if (this.disposed) return;
    const layers = this.deps.sceneStore.getState().layers;

    // Dispose pools whose layer or plan vanished.
    for (const [layerId, pool] of [...this.pools]) {
      if (!plans[layerId] || !layers.find((l) => l.id === layerId)) {
        this.disposePool(pool);
        this.pools.delete(layerId);
      }
    }

    const planCount = Math.max(1, Object.keys(plans).length);
    for (const [layerId, plan] of Object.entries(plans)) {
      const layer = layers.find((l) => l.id === layerId);
      if (!layer) continue;
      this.reconcileLayer(layer, plan, planCount);
    }
  }

  private reconcileLayer(layer: LayerState, plan: LayerNodePlan, planCount: number): void {
    const pool = this.ensurePool(layer, plan, planCount);
    if (!pool) return;

    const planKeys = new Set(plan.nodes.map((node) => node.key));

    // Everything in the plan is protected; the coarsest level stays pinned so
    // the shader's fallback of last resort survives any eviction pressure.
    const protectedKeys = new Set(planKeys);
    for (const key of pool.pool.keys()) {
      if (parseNodeKey(key).level === pool.geometry.levels.length - 1) {
        protectedKeys.add(key);
      }
    }
    pool.protectedKeys = protectedKeys;
    pool.pool.touch(planKeys);

    // Cancel fetches that fell out of the plan.
    for (const [key, controller] of [...pool.inFlight]) {
      if (!planKeys.has(key)) {
        controller.abort();
        pool.inFlight.delete(key);
      }
    }
    pool.queue = pool.queue.filter((pending) => planKeys.has(pending.key));
    pool.queuedKeys = new Set(pool.queue.map((pending) => pending.key));

    // Fetch every planned node that isn't resident yet — coarse levels first
    // (they are the fallback), then plan priority (near-first). Only
    // MAX_INFLIGHT_BRICKS run concurrently; the rest wait in pendingFetch.
    pool.pendingFetch = plan.nodes
      .filter(
        (node) =>
          !pool.pool.has(node.key) &&
          !pool.emptyValues.has(node.key) &&
          !pool.inFlight.has(node.key) &&
          !pool.queuedKeys.has(node.key),
      )
      .sort((a, b) => b.level - a.level || a.priority - b.priority);
    this.startNextFetches(pool);
  }

  private startNextFetches(pool: LayerBrickPool): void {
    while (pool.inFlight.size < MAX_INFLIGHT_BRICKS && pool.pendingFetch.length > 0) {
      const node = pool.pendingFetch.shift()!;
      if (
        !pool.protectedKeys.has(node.key) ||
        pool.pool.has(node.key) ||
        pool.emptyValues.has(node.key) ||
        pool.inFlight.has(node.key) ||
        pool.queuedKeys.has(node.key)
      ) {
        continue;
      }
      void this.fetchBrick(pool, node);
    }
  }

  private ensurePool(
    layer: LayerState,
    plan: LayerNodePlan,
    planCount: number,
  ): LayerBrickPool | null {
    const viewerState = this.deps.viewerStore.getState();

    let levels: LevelSource[];
    try {
      levels = layer.lens.dataset.dataArrays.map((dataArray) => {
        const arr = viewerState.getArrayForStoreId(dataArray.store.id);
        return {
          shape: arr.shape,
          chunks: arr.chunks,
          dtype: String(arr.dtype),
          storeId: dataArray.store.id,
          scaleFactors: dataArray.scaleFactors ?? undefined,
        };
      });
    } catch {
      return null;
    }

    const geometry = buildLayerLevelGeometry(layer.lens.dataset.dims, layer, levels);
    if (!geometry) return null;
    const spec = resolveBrickSpec(geometry, plan.mode);

    const structureSignature = JSON.stringify({
      mode: plan.mode,
      payload: spec.payload,
      border: spec.border,
      channels: spec.channelCount,
      levels: levels.map((l) => ({ shape: l.shape, chunks: l.chunks, dtype: l.dtype, storeId: l.storeId })),
    });

    const existing = this.pools.get(layer.id);
    if (existing && existing.structureSignature === structureSignature) {
      if (existing.sliceSignature !== plan.sliceSignature) this.flushPool(existing, plan.sliceSignature);
      return existing;
    }
    if (existing) {
      this.disposePool(existing);
      this.pools.delete(layer.id);
    }

    const layout = buildPageTableLayout(geometry, spec.payload, PAGE_TEXTURE_MAX_EXTENT);
    if (!layout) return null;

    const bytesPerVoxel = atlasKindForDtype(geometry.levels[0].dtype) === "r8" ? 1 : 4;
    const slotBytes = brickSlotBytes(spec, bytesPerVoxel);
    const budgetShare = getInitialVolumeTextureBudgetBytes() / planCount;
    const coarsestGrid = brickGridForLevel(geometry, spec, geometry.levels.length - 1);
    const gl = this.deps.renderer.getContext() as WebGL2RenderingContext;
    const maxTextureExtent = Math.min(
      PAGE_TEXTURE_MAX_EXTENT,
      gl.getParameter(gl.MAX_3D_TEXTURE_SIZE) as number,
    );
    // The pool can never need more slots than the pyramid has bricks — cap
    // there so small datasets get small atlases (the budget share only binds
    // for genuinely large pyramids).
    const maxUsefulSlots = totalBrickCount(geometry, spec);
    const minSlots = Math.min(
      maxUsefulSlots,
      coarsestGrid[0] * coarsestGrid[1] * coarsestGrid[2] + MIN_POOL_HEADROOM_SLOTS,
    );
    const desiredSlots = Math.min(
      maxUsefulSlots,
      Math.max(minSlots, Math.floor(budgetShare / slotBytes)),
    );

    const atlas = createBrickAtlas({
      spec,
      dtype: geometry.levels[0].dtype,
      desiredSlots,
      maxExtent: maxTextureExtent,
      filter: spec.border > 0 ? "linear" : "nearest",
    });
    const pageTable = createPageTableTexture(layout);

    // Fixed (collapsed) indices for every non-spatial, non-channel dim.
    const dims = layer.lens.dataset.dims;
    const { xPos, yPos, zPos, intensityPos } = geometry.axes;
    const sliceMap = layer.lens.slices.reduce<Record<string, (typeof layer.lens.slices)[number]>>(
      (acc, slice) => {
        acc[slice.dim] = slice;
        return acc;
      },
      {},
    );
    const fixedChunkCoords = dims.map(() => 0);
    const fixedOffsets = dims.map(() => 0);
    dims.forEach((dim, d) => {
      if (d === xPos || d === yPos || d === zPos || d === intensityPos) return;
      const fixedIndex = resolveCollapsedSelection(sliceMap[dim], levels[0].shape[d] ?? 1);
      const chunkExtent = Math.max(1, levels[0].chunks[d] ?? 1);
      fixedChunkCoords[d] = Math.floor(fixedIndex / chunkExtent);
      fixedOffsets[d] = fixedIndex % chunkExtent;
    });

    const [minValue, maxValue] = resolveLayerDataRange(layer, geometry.levels[0].dtype);

    const pool: LayerBrickPool = {
      layerId: layer.id,
      mode: plan.mode,
      sliceSignature: plan.sliceSignature,
      structureSignature,
      geometry,
      spec,
      atlas,
      pageTable,
      pool: new BrickPoolState(atlas.slotGrid),
      protectedKeys: new Set(),
      inFlight: new Map(),
      pendingFetch: [],
      queue: [],
      queuedKeys: new Set(),
      emptyValues: new Map(),
      fixedChunkCoords,
      fixedOffsets,
      minValue,
      maxValue,
    };
    this.pools.set(layer.id, pool);
    return pool;
  }

  private async fetchBrick(pool: LayerBrickPool, node: PlannedNode): Promise<void> {
    const controller = new AbortController();
    pool.inFlight.set(node.key, controller);

    try {
      const level = pool.geometry.levels[node.level];
      const arr = this.deps.viewerStore.getState().getArrayForStoreId(level.storeId);
      const { xPos, yPos, zPos, intensityPos } = pool.geometry.axes;

      const spatialChunks = chunksTouchingBrick(pool.geometry, pool.spec, node.level, node.coords);
      const channelsPerChunk =
        intensityPos !== -1 ? Math.max(1, level.chunks[intensityPos] ?? 1) : 1;
      const channelChunkCount =
        intensityPos !== -1 ? Math.ceil(pool.spec.channelCount / channelsPerChunk) : 1;

      const fetches: Promise<RepackChunk>[] = [];
      for (const spatial of spatialChunks) {
        for (let channelChunk = 0; channelChunk < channelChunkCount; channelChunk++) {
          const chunkCoords = pool.geometry.dims.map((_, d) => {
            if (d === xPos) return spatial[0];
            if (d === yPos) return spatial[1];
            if (d === zPos) return spatial[2];
            if (d === intensityPos) return channelChunk;
            return pool.fixedChunkCoords[d];
          });
          fetches.push(
            getChunkWorker(arr, chunkCoords, {
              pool: workerPool,
              priority: node.level,
              signal: controller.signal,
              useSharedArrayBuffer: true,
            }).then((chunk) => ({
              coords: spatial,
              channelChunk,
              data: chunk.data as BrickArray,
              shape: chunk.shape,
              stride: chunk.stride,
            })),
          );
        }
      }
      const chunks = await Promise.all(fetches);
      if (controller.signal.aborted || this.disposed) return;

      const stored = pool.spec.stored;
      const elementCount = stored[0] * stored[1] * stored[2] * pool.spec.channelCount;
      const output: BrickArray =
        pool.atlas.kind === "r8" ? new Uint8Array(elementCount) : new Float32Array(elementCount);

      const result = repackBrick({
        spec: pool.spec,
        level,
        axes: pool.geometry.axes,
        brickBox: nodeVoxelBox(pool.geometry, pool.spec, node.level, node.coords),
        fetchBox: fetchVoxelBox(pool.geometry, pool.spec, node.level, node.coords),
        fixedOffsets: pool.fixedOffsets,
        chunks,
        output,
      });

      pool.queue.push({
        key: node.key,
        level: node.level,
        coords: node.coords,
        data: output,
        uniformValue: result.uniformValue,
        bytes: output.byteLength,
      });
      pool.queuedKeys.add(node.key);
      this.deps.invalidate(); // demand frameloop: get a frame to drain uploads
    } catch (error) {
      if (!controller.signal.aborted) {
        console.warn(`[bricks] fetch failed for ${pool.layerId} ${node.key}`, error);
      }
    } finally {
      pool.inFlight.delete(node.key);
      if (!this.disposed) this.startNextFetches(pool);
    }
  }

  /** Called from the provider's useFrame: bounded texture uploads per frame. */
  drainUploads(): void {
    if (this.disposed) return;
    let bytes = 0;
    let bricks = 0;
    let uploadedAny = false;

    for (const pool of this.pools.values()) {
      while (
        pool.queue.length > 0 &&
        bytes < FRAME_UPLOAD_BUDGET_BYTES &&
        bricks < FRAME_UPLOAD_BUDGET_BRICKS
      ) {
        const pending = pool.queue.shift()!;
        pool.queuedKeys.delete(pending.key);
        // Stale bricks (plan moved on before upload) are dropped, not mapped.
        if (!pool.protectedKeys.has(pending.key)) continue;

        if (pending.uniformValue !== null) {
          // Encode the uniform value 8-bit-quantized in R (see brickTraversal).
          const encoded = encodeEmptyValue(pending.uniformValue, pool);
          setPageEntry(pool.pageTable, pending.level, pending.coords, [encoded, 0, 0], PAGE_FLAG_EMPTY);
          pool.emptyValues.set(pending.key, pending.uniformValue);
          uploadedAny = true;
          continue;
        }

        const acquired = pool.pool.acquire(pending.key, pool.protectedKeys);
        if (!acquired) continue; // every slot protected: keep coarse, drop fine

        if (acquired.evictedKey) {
          const evicted = parseNodeKey(acquired.evictedKey);
          setPageEntry(pool.pageTable, evicted.level, evicted.coords, null, PAGE_FLAG_UNMAPPED);
        }

        writeBrickToAtlas(this.deps.renderer, pool.atlas, acquired.slot.coords, pending.data);
        setPageEntry(
          pool.pageTable,
          pending.level,
          pending.coords,
          acquired.slot.coords,
          PAGE_FLAG_RESIDENT,
        );
        bytes += pending.bytes;
        bricks += 1;
        uploadedAny = true;
      }

      flushPageTable(this.deps.renderer, pool.pageTable);
    }

    if (uploadedAny) {
      // Throttle version bumps while streaming — every bump re-renders the
      // React consumers (layer components, overlay, DebugPanel). The final
      // batch always bumps so consumers settle on the complete state.
      const streaming =
        [...this.pools.values()].some(
          (pool) => pool.queue.length > 0 || pool.inFlight.size > 0 || pool.pendingFetch.length > 0,
        );
      const now = performance.now();
      if (!streaming || now - this.lastResidencyBumpAt > RESIDENCY_BUMP_INTERVAL_MS) {
        this.lastResidencyBumpAt = now;
        this.deps.viewerStore.getState().bumpResidencyVersion();
      }
      this.deps.invalidate();
    } else if ([...this.pools.values()].some((pool) => pool.queue.length > 0)) {
      // Budget exhausted with work left: keep the demand frameloop running.
      this.deps.invalidate();
    }
  }

  private flushPool(pool: LayerBrickPool, nextSliceSignature: string): void {
    for (const controller of pool.inFlight.values()) controller.abort();
    pool.inFlight.clear();
    pool.pendingFetch = [];
    pool.queue = [];
    pool.queuedKeys.clear();
    pool.emptyValues.clear();
    pool.pool.clear();
    clearPageTable(pool.pageTable);
    pool.sliceSignature = nextSliceSignature;
  }

  private disposePool(pool: LayerBrickPool): void {
    for (const controller of pool.inFlight.values()) controller.abort();
    pool.inFlight.clear();
    disposeBrickAtlas(pool.atlas);
    disposePageTable(pool.pageTable);
  }

  dispose(): void {
    this.disposed = true;
    for (const pool of this.pools.values()) this.disposePool(pool);
    this.pools.clear();
  }
}
