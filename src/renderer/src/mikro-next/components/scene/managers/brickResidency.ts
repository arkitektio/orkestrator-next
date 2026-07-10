import type { Chunk, DataType } from "zarrita";
import type { StoreApi } from "zustand/vanilla";
import { perfMonitor } from "./perfMonitor";
import { FRAME_UPLOAD_BUDGET, shouldContinueDrain } from "./uploadBudget";
import { qualityGovernor } from "../core/qualityGovernor";
import { getMax3DTextureSize, type SceneRenderer } from "../render/gpu/sceneRenderer";
import { getChunkWorker } from "../../../../lib/zarr/runner";
import { workerPool } from "../../../workers/pool";
import { MAX_LAYER_POOL_BYTES, getInitialVolumeTextureBudgetBytes } from "../core/lodPlanning";
import { resolveLayerDataRange } from "../core/dataRange";
import { resolveCollapsedSelection } from "../core/selection";
import { decodeEmptyValue, encodeEmptyValue } from "../glsl/brickTraversal";
import { ByteBudgetChunkCache } from "../zarr/caches/byteBudgetChunkCache";
import { BrickPoolState } from "../core/octree/brickPoolState";
import type { BrickArray, RepackChunk } from "../core/octree/brickRepack";
import { assessPoolViability } from "../core/octree/poolViability";
import type { RepackDispatcher } from "../core/octree/repackDispatcher";
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

// Per-frame texSubImage3D budget lives in ./uploadBudget (bytes + bricks +
// WALL-CLOCK cap — the time cap is what keeps integrated GPUs smooth, P19).
const PAGE_TEXTURE_MAX_EXTENT = 2048;
const MIN_POOL_HEADROOM_SLOTS = 64;
// In-flight fetch count, residency-bump throttle and upload time budget are
// TIER-scaled — read from the quality governor's profile at use sites (P19).

/** Byte cap for decoded chunks held for repacking (the runner's default
 * cache is count-bounded and can pin GBs of plane-chunked SABs). Sized above
 * a typical plane-chunked working set, scaled down on low-RAM machines
 * (8 GiB Macs hit GC pauses with the full 512 MB alongside the atlases). */
const DECODED_CHUNK_CACHE_BYTES = (() => {
  const nav =
    typeof navigator !== "undefined"
      ? (navigator as Navigator & { deviceMemory?: number })
      : undefined;
  const memoryGiB = nav?.deviceMemory;
  return typeof memoryGiB === "number" && memoryGiB > 0 && memoryGiB <= 8
    ? 256 * 1024 * 1024
    : 512 * 1024 * 1024;
})();

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
  renderer: SceneRenderer;
  viewerStore: StoreApi<ViewerState>;
  sceneStore: StoreApi<SceneState>;
  invalidate: () => void;
  /** Runs `repackBrick` off the UI thread (worker pool; sync in tests). */
  repack: RepackDispatcher;
};

export type ResidentBrickInfo = {
  level: number;
  coords: Vec3;
  empty: boolean;
};

export type BrickSystemStats = {
  bricksFetched: number;
  chunkRequests: number;
  /** Bytes of FIRST-SEEN chunks only — approximates unique decode volume
   * (cache hits and shared in-flight awaits are not re-counted). */
  bytesDecoded: number;
  fetchMs: number;
  repackMs: number;
  uploadMs: number;
  bricksUploaded: number;
  bytesUploaded: number;
  emptyBricks: number;
  evictions: number;
  staleDrops: number;
  fetchErrors: number;
};

export class BrickResidencyManager {
  private readonly pools = new Map<string, LayerBrickPool>();
  private readonly chunkCache = new ByteBudgetChunkCache(DECODED_CHUNK_CACHE_BYTES);
  /** In-flight decoded-chunk promises, shared across bricks: without this,
   * N concurrent bricks touching the same plane chunk decode it N times
   * (observed 73× fetch amplification on plane-chunked SPIM data). */
  private readonly inFlightChunks = new Map<string, Promise<Chunk<DataType>>>();
  /** Chunk fetches outlive individual brick aborts (shared!); this cancels
   * them all on dispose. */
  private readonly fetchAbort = new AbortController();
  private disposed = false;
  private lastResidencyBumpAt = 0;
  readonly stats: BrickSystemStats = {
    bricksFetched: 0,
    chunkRequests: 0,
    bytesDecoded: 0,
    fetchMs: 0,
    repackMs: 0,
    uploadMs: 0,
    bricksUploaded: 0,
    bytesUploaded: 0,
    emptyBricks: 0,
    evictions: 0,
    staleDrops: 0,
    fetchErrors: 0,
  };
  /** Chunk keys already counted toward bytesDecoded. */
  private readonly countedChunkKeys = new Set<string>();
  /** Layers already warned about a non-viable pool (one warning per layer). */
  private readonly warnedUnviable = new Set<string>();

  constructor(private readonly deps: Deps) {}

  /** Structured snapshot for the DebugPanel's copyable report. */
  buildDebugReport(): Record<string, unknown> {
    return {
      stats: { ...this.stats, chunkCacheBytes: this.chunkCache.sizeBytes },
      pools: [...this.pools.values()].map((pool) => {
        const residentByLevel: Record<number, number> = {};
        for (const key of pool.pool.keys()) {
          const { level } = parseNodeKey(key);
          residentByLevel[level] = (residentByLevel[level] ?? 0) + 1;
        }
        return {
          layerId: pool.layerId,
          mode: pool.mode,
          spec: {
            payload: pool.spec.payload,
            border: pool.spec.border,
            stored: pool.spec.stored,
            channels: pool.spec.channelCount,
          },
          levels: pool.geometry.levels.map((level) => ({
            spatialShape: level.spatialShape,
            spatialChunks: level.spatialChunks,
            scale: level.scale,
            dtype: level.dtype,
            storeId: level.storeId,
          })),
          atlas: {
            kind: pool.atlas.kind,
            size: pool.atlas.size,
            slotGrid: pool.atlas.slotGrid,
            capacity: pool.atlas.capacity,
            bytes: pool.atlas.backing.byteLength,
          },
          pageTableSize: pool.pageTable.layout.size,
          slotsUsed: pool.pool.size,
          residentByLevel,
          emptyBricks: pool.emptyValues.size,
          inFlight: pool.inFlight.size,
          uploadQueue: pool.queue.length,
          pendingFetch: pool.pendingFetch.length,
          protectedKeys: pool.protectedKeys.size,
          dataRange: [pool.minValue, pool.maxValue],
          sliceSignature: pool.sliceSignature,
        };
      }),
    };
  }

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
      if (emptyValue !== undefined) {
        // The GPU only has the 8-bit page-table encoding of this value; mirror
        // the same encode→decode round-trip so the CPU march matches the
        // rendered image (OCTREE_RENDERER.md P11).
        return decodeEmptyValue(encodeEmptyValue(emptyValue, pool), pool);
      }

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
      try {
        this.reconcileLayer(layer, plan, planCount);
      } catch (error) {
        // Contain per-layer failures (e.g. an atlas allocation error): one bad
        // layer must not abort reconciliation of the remaining layers.
        console.warn(`[bricks] reconcile failed for ${layerId}`, error);
      }
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
    // the tier profile's maxInflightBricks run concurrently; the rest wait
    // in pendingFetch.
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
    const maxInflight = qualityGovernor.getProfile().maxInflightBricks;
    while (pool.inFlight.size < maxInflight && pool.pendingFetch.length > 0) {
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

    // Hard stop (defense in depth — nodePlanTracker refuses such layers before
    // any plan exists): the coarsest-grid slot floor below OVERRIDES the byte
    // budget by design (P16), so a no-pyramid layer would otherwise attempt a
    // multi-GB atlas allocation here (an uncaught RangeError that also aborts
    // reconciliation of the remaining layers). See P18.
    const viability = assessPoolViability(geometry, spec);
    if (!viability.viable) {
      if (!this.warnedUnviable.has(layer.id)) {
        this.warnedUnviable.add(layer.id);
        console.warn(
          `[bricks] refusing pool for ${layer.id}: coarsest-level floor ` +
            `${(viability.floorBytes / (1024 * 1024)).toFixed(0)} MB exceeds ` +
            `${(viability.capBytes / (1024 * 1024)).toFixed(0)} MB budget (no usable pyramid?)`,
        );
      }
      const state = this.deps.viewerStore.getState();
      if (!state.unplannableLayers[layer.id]) {
        state.setUnplannableLayers({
          ...state.unplannableLayers,
          [layer.id]: {
            mode: plan.mode,
            floorBytes: viability.floorBytes,
            capBytes: viability.capBytes,
          },
        });
      }
      return null;
    }

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
    const budgetShare = Math.min(
      MAX_LAYER_POOL_BYTES,
      getInitialVolumeTextureBudgetBytes() / planCount,
    );
    const coarsestGrid = brickGridForLevel(geometry, spec, geometry.levels.length - 1);
    const maxTextureExtent = Math.min(
      PAGE_TEXTURE_MAX_EXTENT,
      getMax3DTextureSize(this.deps.renderer),
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
    // Pool LIFECYCLE event (not streaming progress): this is what layer
    // components re-render on — see viewerStore.poolsVersion.
    this.deps.viewerStore.getState().bumpPoolsVersion();
    return pool;
  }

  /**
   * Decoded-chunk fetch with in-flight sharing: every brick wanting the same
   * chunk awaits ONE decode. Deliberately not bound to a brick's abort
   * signal — a shared result may still serve other bricks (or the cache);
   * the manager-level signal cancels everything on dispose.
   */
  private fetchChunkShared(
    arr: Parameters<typeof getChunkWorker>[0],
    storeId: string,
    chunkCoords: number[],
    priority: number,
  ): Promise<Chunk<DataType>> {
    const key = `${storeId}:${chunkCoords.join(",")}`;
    const existing = this.inFlightChunks.get(key);
    if (existing) return existing;

    const promise = getChunkWorker(arr, chunkCoords, {
      pool: workerPool,
      priority,
      signal: this.fetchAbort.signal,
      useSharedArrayBuffer: true,
      cache: this.chunkCache,
    })
      .then((chunk) => {
        if (!this.countedChunkKeys.has(key)) {
          this.countedChunkKeys.add(key);
          this.stats.bytesDecoded += (chunk.data as { byteLength?: number }).byteLength ?? 0;
        }
        return chunk as Chunk<DataType>;
      })
      .finally(() => {
        this.inFlightChunks.delete(key);
      });
    this.inFlightChunks.set(key, promise);
    return promise;
  }

  private async fetchBrick(pool: LayerBrickPool, node: PlannedNode): Promise<void> {
    const controller = new AbortController();
    pool.inFlight.set(node.key, controller);
    const fetchStartedAt = performance.now();

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
            this.fetchChunkShared(arr, level.storeId, chunkCoords, node.level).then((chunk) => ({
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

      this.stats.chunkRequests += fetches.length;
      this.stats.fetchMs += performance.now() - fetchStartedAt;

      const stored = pool.spec.stored;
      const elementCount = stored[0] * stored[1] * stored[2] * pool.spec.channelCount;

      // Repack runs OFF the UI thread (worker pool); SAB-backed chunks travel
      // zero-copy, the output brick comes back as a transferable. repackMs is
      // wall time (queue + worker), not main-thread time.
      const repackStartedAt = performance.now();
      const result = await this.deps.repack.repack({
        kind: pool.atlas.kind,
        elementCount,
        input: {
          spec: pool.spec,
          level,
          axes: pool.geometry.axes,
          brickBox: nodeVoxelBox(pool.geometry, pool.spec, node.level, node.coords),
          fetchBox: fetchVoxelBox(pool.geometry, pool.spec, node.level, node.coords),
          fixedOffsets: pool.fixedOffsets,
          chunks,
        },
      });
      this.stats.repackMs += performance.now() - repackStartedAt;
      if (controller.signal.aborted || this.disposed) return;
      this.stats.bricksFetched += 1;

      pool.queue.push({
        key: node.key,
        level: node.level,
        coords: node.coords,
        data: result.data,
        uniformValue: result.uniformValue,
        bytes: result.data.byteLength,
      });
      pool.queuedKeys.add(node.key);
      this.deps.invalidate(); // demand frameloop: get a frame to drain uploads
    } catch (error) {
      if (!controller.signal.aborted) {
        this.stats.fetchErrors += 1;
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
    const drainStartedAt = performance.now();
    const profile = qualityGovernor.getProfile();
    const budget = { ...FRAME_UPLOAD_BUDGET, maxMs: profile.uploadBudgetMs };
    let bytes = 0;
    let bricks = 0;
    let uploadedAny = false;

    for (const pool of this.pools.values()) {
      while (
        pool.queue.length > 0 &&
        // Time-capped alongside bytes/bricks (P19): on integrated GPUs a
        // single texSubImage3D can cost >15 ms — without the wall-clock cap a
        // full batch stalls the frame for hundreds of ms. The ms cap is
        // tier-scaled (slower GPUs get a smaller slice of the frame).
        shouldContinueDrain(
          { bytes, bricks, elapsedMs: performance.now() - drainStartedAt },
          budget,
        )
      ) {
        const pending = pool.queue.shift()!;
        pool.queuedKeys.delete(pending.key);
        // Stale bricks (plan moved on before upload) are dropped, not mapped.
        if (!pool.protectedKeys.has(pending.key)) {
          this.stats.staleDrops += 1;
          continue;
        }

        if (pending.uniformValue !== null) {
          // Encode the uniform value 8-bit-quantized in R (see brickTraversal).
          const encoded = encodeEmptyValue(pending.uniformValue, pool);
          setPageEntry(pool.pageTable, pending.level, pending.coords, [encoded, 0, 0], PAGE_FLAG_EMPTY);
          pool.emptyValues.set(pending.key, pending.uniformValue);
          this.stats.emptyBricks += 1;
          uploadedAny = true;
          continue;
        }

        const acquired = pool.pool.acquire(pending.key, pool.protectedKeys);
        if (!acquired) continue; // every slot protected: keep coarse, drop fine

        if (acquired.evictedKey) {
          const evicted = parseNodeKey(acquired.evictedKey);
          setPageEntry(pool.pageTable, evicted.level, evicted.coords, null, PAGE_FLAG_UNMAPPED);
          this.stats.evictions += 1;
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
        this.stats.bricksUploaded += 1;
        this.stats.bytesUploaded += pending.bytes;
        uploadedAny = true;
      }

      flushPageTable(this.deps.renderer, pool.pageTable);
    }

    if (uploadedAny) this.stats.uploadMs += performance.now() - drainStartedAt;
    if (bricks > 0) perfMonitor.markUpload(bricks, bytes); // no-op unless recording

    // "Streaming" (work anywhere in the pipeline) counts as ACTIVITY for the
    // quality governor: frames rendered while bricks load use the tier's
    // cheaper profile, and the edge back to false snaps quality up (P19).
    const streaming = [...this.pools.values()].some(
      (pool) => pool.queue.length > 0 || pool.inFlight.size > 0 || pool.pendingFetch.length > 0,
    );
    qualityGovernor.setStreaming(streaming);

    if (uploadedAny) {
      // Throttle version bumps while streaming — every bump re-renders the
      // React consumers (layer components, overlay, DebugPanel). The final
      // batch always bumps so consumers settle on the complete state.
      const now = performance.now();
      if (!streaming || now - this.lastResidencyBumpAt > profile.residencyBumpMs) {
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
    // Pool lifecycle event — layer components must drop their pool handle.
    this.deps.viewerStore.getState().bumpPoolsVersion();
  }

  dispose(): void {
    this.disposed = true;
    this.fetchAbort.abort();
    this.inFlightChunks.clear();
    for (const pool of this.pools.values()) this.disposePool(pool);
    this.pools.clear();
    // Don't leave the governor thinking a torn-down scene is still streaming.
    qualityGovernor.setStreaming(false);
  }
}
