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
import { resolveFixedDimIndex } from "../core/selection";
import { decodeEmptyValue, encodeEmptyValue } from "../glsl/brickTraversal";
import { ByteBudgetChunkCache } from "../zarr/caches/byteBudgetChunkCache";
import { BrickPoolState } from "../core/octree/brickPoolState";
import type { BrickArray, RepackChunk } from "../core/octree/brickRepack";
import { assessPoolViability } from "../core/octree/poolViability";
import type { RepackDispatcher } from "../core/octree/repackDispatcher";
import { brickSlotBytes, resolveBrickSpec, type BrickSpec } from "../core/octree/brickSpec";
import {
  buildLayerLevelGeometry,
  buildLevelSources,
  hasPhasorSlabs,
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
import {
  adjacentSlabBrickZ,
  type LayerNodePlan,
  type PlannedNode,
} from "../core/octree/nodePlanning";
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
  createGpuRepacker,
  isGpuRepackEnabled,
  type GpuFlushOutcome,
  type GpuRepacker,
} from "../render/bricks/gpu/computeRepack";
import {
  runGpuRepackSelfTest,
  type GpuRepackSelfTestResult,
} from "../render/bricks/gpu/computeRepackSelfTest";
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

/** A decoded chunk plus its shared-cache key (doubles as the GPU-buffer key). */
type GpuQueuedChunk = RepackChunk & { cacheKey: string };

type PendingBrick = {
  key: string;
  level: number;
  coords: Vec3;
  /** CPU path: the repacked brick ready for upload. Null on the GPU path. */
  data: BrickArray | null;
  uniformValue: number | null;
  bytes: number;
  /** GPU path: raw decoded chunks; the repack runs as a compute dispatch at
   * drain time, once a slot is acquired. */
  gpu: { chunks: GpuQueuedChunk[] } | null;
};

/** Identifies a dispatched brick across the async min/max readback; every
 * field is re-validated against the CURRENT mapping when the readback lands. */
type GpuBrickToken = { layerId: string; key: string; slotIndex: number };

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
  /** True once any slot was written by the GPU repack kernel: the CPU atlas
   * mirror no longer reflects atlas contents, so `sampleResident` must not
   * read it (probes degrade to null until the Phase D chunk-cache probe). */
  atlasMirrorStale: boolean;
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
  /** GPU-repacked bricks (compute dispatch instead of worker + upload). */
  gpuBricks: number;
  /** Wall time from batch submit to min/max readback (overlaps rendering —
   * not main-thread time; compare against repackMs+uploadMs per brick). */
  gpuRepackMs: number;
  uploadMs: number;
  /** WALL-CLOCK ms from "plan enqueued work while idle" to "pipeline drained"
   * (queue+inFlight+pendingFetch empty) — the honest time-to-sharp number.
   * fetchMs/repackMs are SUMS across concurrent bricks and overstate wall
   * time; judge streaming changes against this, not those. */
  timeToSharpMs: number;
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
    gpuBricks: 0,
    gpuRepackMs: 0,
    uploadMs: 0,
    timeToSharpMs: 0,
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
  /** undefined = not yet attempted; null = unavailable (WebGL2 backend or
   * disabled via the localStorage kill switch) — the CPU worker path then
   * handles every brick. */
  private gpuRepacker: GpuRepacker<GpuBrickToken> | null | undefined;
  /** Wall-clock start of the current streaming burst (null = idle). Set when
   * a reconcile enqueues work while idle; NOT reset by mid-burst replans, so
   * timeToSharpMs measures interaction → fully-sharp. */
  private streamStartedAt: number | null = null;
  /** Last few timeToSharpMs values (newest last) for variance eyeballing. */
  private readonly timeToSharpRing: number[] = [];

  constructor(private readonly deps: Deps) {}

  private ensureGpuRepacker(): GpuRepacker<GpuBrickToken> | null {
    if (this.gpuRepacker === undefined) {
      this.gpuRepacker = isGpuRepackEnabled()
        ? createGpuRepacker<GpuBrickToken>(this.deps.renderer)
        : null;
    }
    return this.gpuRepacker;
  }

  /** Dev-only (DebugPanel): GPU↔CPU repack parity check on the live renderer. */
  runGpuRepackSelfTest(): Promise<GpuRepackSelfTestResult> {
    return runGpuRepackSelfTest(this.deps.renderer);
  }

  /** Debug-report probe: every channel slab's raw value at two fixed voxels
   * (volume center and quarter point), read from the atlas CPU mirror via
   * `sampleResident`. Null entries = nothing resident there (or the mirror is
   * stale on the GPU-repack path). */
  private probeChannelSlabs(
    pool: LayerBrickPool,
  ): { voxel: Vec3; values: (number | null)[] }[] {
    const [sx, sy, sz] = pool.geometry.levels[0].spatialShape;
    const voxels: Vec3[] = [
      [Math.floor(sx / 2), Math.floor(sy / 2), Math.floor(sz / 2)],
      [Math.floor(sx / 4), Math.floor(sy / 4), Math.floor(sz / 4)],
    ];
    return voxels.map((voxel) => ({
      voxel,
      values: Array.from({ length: pool.spec.channelCount }, (_, channel) =>
        this.sampleResident(pool.layerId, voxel, 0, channel),
      ),
    }));
  }

  /** Structured snapshot for the DebugPanel's copyable report. */
  buildDebugReport(): Record<string, unknown> {
    return {
      stats: { ...this.stats, chunkCacheBytes: this.chunkCache.sizeBytes },
      timeToSharpRing: this.timeToSharpRing.map((ms) => Math.round(ms)),
      gpuRepack:
        this.gpuRepacker === undefined
          ? "not-attempted"
          : this.gpuRepacker === null
            ? "unavailable"
            : this.gpuRepacker.ready()
              ? "ready"
              : "pending-or-broken",
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
          // Raw atlas values per channel slab at two fixed voxels (CPU mirror
          // of the shader's channel tap). Identical values across channels of
          // a multi-channel layer at both probes = the slabs hold the same
          // data (repack/fetch); differing values = slabs are fine and a
          // wrong channel on screen is a shader/uniform bug.
          channelSlabProbe: this.probeChannelSlabs(pool),
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
      // GPU-repacked slots never touch the CPU mirror — reading it would
      // return stale zeros, which is worse than no reading. Phase D replaces
      // this path with a decoded-chunk-cache read.
      if (pool.atlasMirrorStale) return null;

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

    // Time-to-sharp: start the wall clock when a reconcile enqueues work
    // while the pipeline is idle (drainUploads stops it on the drained edge).
    if (this.streamStartedAt === null) {
      const hasWork = [...this.pools.values()].some(
        (pool) =>
          pool.pendingFetch.length > 0 || pool.inFlight.size > 0 || pool.queue.length > 0,
      );
      if (hasWork) this.streamStartedAt = performance.now();
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
      levels = buildLevelSources(
        layer.lens.dataset.dataArrays,
        layer.lens.dataset.dims.length,
        viewerState.getArrayForStoreId,
      );
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
      if (existing.sliceSignature !== plan.sliceSignature) {
        this.flushPool(existing, plan.sliceSignature, layer, levels);
      }
      return existing;
    }
    if (existing) {
      this.disposePool(existing);
      this.pools.delete(layer.id);
    }

    const layout = buildPageTableLayout(geometry, spec.payload, PAGE_TEXTURE_MAX_EXTENT);
    if (!layout) return null;

    // A phasor layer's slabs are derived (g, s ∈ [-1, 1] and a mean photon
    // count), so its atlas is float regardless of the source dtype.
    const atlasKind = hasPhasorSlabs(geometry)
      ? "r32f"
      : atlasKindForDtype(geometry.levels[0].dtype);
    const bytesPerVoxel = atlasKind === "r8" ? 1 : 4;
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

    const gpuRepacker = this.ensureGpuRepacker();
    const atlas = createBrickAtlas({
      spec,
      dtype: geometry.levels[0].dtype,
      kind: atlasKind,
      desiredSlots,
      maxExtent: maxTextureExtent,
      filter: spec.border > 0 ? "linear" : "nearest",
      // A phasor layer never repacks on the GPU (the kernel cannot reduce), so
      // it has no use for the storage-binding usage flag either.
      computeStorage: gpuRepacker !== null && !hasPhasorSlabs(geometry),
    });
    const pageTable = createPageTableTexture(layout);

    if (gpuRepacker && atlas.kind === "r32f") {
      // Create the backend GPUTexture (with STORAGE_BINDING) now, so compute
      // dispatches never race the first draw's lazy texture creation.
      (
        this.deps.renderer as unknown as { initTexture?: (texture: unknown) => void }
      ).initTexture?.(atlas.texture);
    }

    const { fixedChunkCoords, fixedOffsets } = this.computeFixedIndices(layer, geometry, levels);

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
      atlasMirrorStale: false,
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

  /** Zarr chunk coords (dims order) for every chunk a brick's fetch touches —
   * spatial chunks × channel chunks, collapsed dims fixed. Shared by
   * `fetchBrick` and the adjacent-slab prefetch so the two enumerate
   * IDENTICAL chunk keys (a prefetched key must be the key the real fetch
   * asks for, or the warm cache never hits). */
  private enumerateBrickChunkCoords(
    pool: LayerBrickPool,
    levelIndex: number,
    brickCoords: Vec3,
  ): {
    spatial: Vec3;
    channelChunk: number;
    phasorChunk: number;
    chunkCoords: number[];
  }[] {
    const level = pool.geometry.levels[levelIndex];
    const { xPos, yPos, zPos, intensityPos, phasorPos } = pool.geometry.axes;
    const spatialChunks = chunksTouchingBrick(pool.geometry, pool.spec, levelIndex, brickCoords);
    const channelsPerChunk =
      intensityPos !== -1 ? Math.max(1, level.chunks[intensityPos] ?? 1) : 1;
    const channelChunkCount =
      intensityPos !== -1
        ? Math.ceil(pool.geometry.channelSlabCount / channelsPerChunk)
        : 1;

    // A reduced phasor axis is fetched WHOLE — every chunk along it, because the
    // repack needs every bin of the profile. (Contrast the collapsed dims, which
    // contribute one fixed chunk coord each.)
    const phasorBins = pool.geometry.phasorBins;
    const binsPerChunk =
      phasorPos !== -1 ? Math.max(1, level.chunks[phasorPos] ?? 1) : 1;
    const phasorChunkCount =
      phasorPos !== -1 && phasorBins > 0 ? Math.ceil(phasorBins / binsPerChunk) : 1;

    const out: {
      spatial: Vec3;
      channelChunk: number;
      phasorChunk: number;
      chunkCoords: number[];
    }[] = [];
    for (const spatial of spatialChunks) {
      for (let channelChunk = 0; channelChunk < channelChunkCount; channelChunk++) {
        for (let phasorChunk = 0; phasorChunk < phasorChunkCount; phasorChunk++) {
          out.push({
            spatial,
            channelChunk,
            phasorChunk,
            chunkCoords: pool.geometry.dims.map((_, d) => {
              if (d === xPos) return spatial[0];
              if (d === yPos) return spatial[1];
              if (d === zPos) return spatial[2];
              if (d === intensityPos) return channelChunk;
              if (d === phasorPos && phasorBins > 0) return phasorChunk;
              return pool.fixedChunkCoords[d];
            }),
          });
        }
      }
    }
    return out;
  }

  private async fetchBrick(pool: LayerBrickPool, node: PlannedNode): Promise<void> {
    const controller = new AbortController();
    pool.inFlight.set(node.key, controller);
    const fetchStartedAt = performance.now();

    try {
      const level = pool.geometry.levels[node.level];
      const arr = this.deps.viewerStore.getState().getArrayForStoreId(level.storeId);

      const fetches: Promise<GpuQueuedChunk>[] = this.enumerateBrickChunkCoords(
        pool,
        node.level,
        node.coords,
      ).map(({ spatial, channelChunk, phasorChunk, chunkCoords }) =>
        this.fetchChunkShared(arr, level.storeId, chunkCoords, node.level).then((chunk) => ({
          coords: spatial,
          channelChunk,
          phasorChunk,
          data: chunk.data as BrickArray,
          shape: chunk.shape,
          stride: chunk.stride,
          // Same key as fetchChunkShared — the GPU chunk-buffer cache
          // mirrors the decoded-chunk cache's identity.
          cacheKey: `${level.storeId}:${chunkCoords.join(",")}`,
        })),
      );
      const chunks = await Promise.all(fetches);
      if (controller.signal.aborted || this.disposed) return;

      this.stats.chunkRequests += fetches.length;
      this.stats.fetchMs += performance.now() - fetchStartedAt;

      const stored = pool.spec.stored;
      const elementCount = stored[0] * stored[1] * stored[2] * pool.spec.channelCount;

      let pending: PendingBrick;
      const gpuRepacker = this.ensureGpuRepacker();
      // The GPU repack kernel is a strided COPY — it cannot reduce a phasor
      // axis. A layer with a phasor node therefore always takes the CPU worker
      // path (a follow-up can teach the compute kernel the DFT).
      const reducesPhasor = hasPhasorSlabs(pool.geometry);
      if (!reducesPhasor && gpuRepacker?.ready() && gpuRepacker.supports(pool.atlas, chunks)) {
        // GPU path: the repack IS the upload (a compute dispatch straight
        // into the atlas slot at drain time) — only chunk handles queue here.
        pending = {
          key: node.key,
          level: node.level,
          coords: node.coords,
          data: null,
          uniformValue: null,
          bytes: elementCount * 4, // r32f stored brick
          gpu: { chunks },
        };
      } else {
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
            slabs: pool.geometry.slabs,
            phasorBins: pool.geometry.phasorBins,
            brickBox: nodeVoxelBox(pool.geometry, pool.spec, node.level, node.coords),
            fetchBox: fetchVoxelBox(pool.geometry, pool.spec, node.level, node.coords),
            fixedOffsets: pool.fixedOffsets,
            chunks,
          },
        });
        this.stats.repackMs += performance.now() - repackStartedAt;
        if (controller.signal.aborted || this.disposed) return;
        pending = {
          key: node.key,
          level: node.level,
          coords: node.coords,
          data: result.data,
          uniformValue: result.uniformValue,
          bytes: result.data.byteLength,
          gpu: null,
        };
      }
      this.stats.bricksFetched += 1;

      pool.queue.push(pending);
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

        if (pending.gpu) {
          // Compute repack straight into the slot. The page entry goes
          // RESIDENT optimistically — content is correct either way; the
          // min/max readback demotes uniform bricks to EMPTY a few frames
          // later (applyGpuOutcome).
          this.gpuRepacker!.dispatch({
            atlas: pool.atlas,
            input: {
              spec: pool.spec,
              level: pool.geometry.levels[pending.level],
              axes: pool.geometry.axes,
              // Always plain channel slabs here: a phasor layer never reaches
              // the GPU kernel (it cannot reduce — see fetchBrick).
              slabs: pool.geometry.slabs,
              phasorBins: pool.geometry.phasorBins,
              brickBox: nodeVoxelBox(pool.geometry, pool.spec, pending.level, pending.coords),
              fetchBox: fetchVoxelBox(pool.geometry, pool.spec, pending.level, pending.coords),
              fixedOffsets: pool.fixedOffsets,
              chunks: pending.gpu.chunks,
            },
            chunkKeys: pending.gpu.chunks.map((chunk) => chunk.cacheKey),
            slotCoords: acquired.slot.coords,
            token: { layerId: pool.layerId, key: pending.key, slotIndex: acquired.slot.index },
          });
          this.stats.gpuBricks += 1;
          pool.atlasMirrorStale = true;
        } else {
          writeBrickToAtlas(this.deps.renderer, pool.atlas, acquired.slot.coords, pending.data!);
        }
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

    // Submit this frame's compute-repack batch (before R3F renders, so the
    // page entries flushed above and the brick contents land in the same
    // frame). The min/max readback resolves asynchronously.
    const gpuFlush = this.gpuRepacker ? this.gpuRepacker.flush() : null;
    if (gpuFlush) {
      const flushStartedAt = performance.now();
      void gpuFlush.then((outcome) => {
        this.stats.gpuRepackMs += performance.now() - flushStartedAt;
        this.applyGpuOutcome(outcome);
      });
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

    // Pipeline drained: stop the time-to-sharp clock started by reconcileAll,
    // then use the idle workers to warm the chunk cache for adjacent z slabs.
    if (!streaming && this.streamStartedAt !== null) {
      this.stats.timeToSharpMs = performance.now() - this.streamStartedAt;
      this.streamStartedAt = null;
      this.timeToSharpRing.push(this.stats.timeToSharpMs);
      if (this.timeToSharpRing.length > 5) this.timeToSharpRing.shift();
      this.prefetchAdjacentSlabs();
    }

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

  /**
   * Min/max-readback continuation for a GPU repack batch: EMPTY demotion of
   * uniform bricks and unmapping of failed dispatches. Lands a few frames
   * after the dispatch, so every token re-validates against the CURRENT slot
   * mapping — an evicted/remapped/flushed brick is silently skipped.
   */
  private applyGpuOutcome(outcome: GpuFlushOutcome<GpuBrickToken>): void {
    if (this.disposed) return;
    const touchedPools = new Set<LayerBrickPool>();

    for (const result of outcome.results) {
      if (result.uniformValue === null) continue;
      const pool = this.resolveGpuToken(result.token);
      if (!pool) continue;
      const { level, coords } = parseNodeKey(result.token.key);
      // Uniform brick: the same EMPTY demotion the CPU path applies before
      // acquiring a slot — just deferred to the readback; the slot frees up.
      const encoded = encodeEmptyValue(result.uniformValue, pool);
      setPageEntry(pool.pageTable, level, coords, [encoded, 0, 0], PAGE_FLAG_EMPTY);
      pool.pool.release(result.token.key);
      pool.emptyValues.set(result.token.key, result.uniformValue);
      this.stats.emptyBricks += 1;
      touchedPools.add(pool);
    }

    for (const token of outcome.failed) {
      const pool = this.resolveGpuToken(token);
      if (!pool) continue;
      const { level, coords } = parseNodeKey(token.key);
      // The dispatch never wrote the slot: unmap it and requeue the fetch.
      // A failed batch marks the repacker broken, so the retry repacks on
      // the CPU path.
      setPageEntry(pool.pageTable, level, coords, null, PAGE_FLAG_UNMAPPED);
      pool.pool.release(token.key);
      this.stats.fetchErrors += 1;
      if (pool.protectedKeys.has(token.key)) {
        pool.pendingFetch.unshift({ key: token.key, level, coords, role: "target", priority: 0 });
        this.startNextFetches(pool);
      }
      touchedPools.add(pool);
    }

    if (touchedPools.size > 0) {
      for (const pool of touchedPools) flushPageTable(this.deps.renderer, pool.pageTable);
      this.deps.viewerStore.getState().bumpResidencyVersion();
      this.deps.invalidate();
    }
  }

  /** The pool for a GPU token, iff the brick still occupies the slot it was
   * dispatched into (nothing evicted, remapped, flushed, or disposed since). */
  private resolveGpuToken(token: GpuBrickToken): LayerBrickPool | null {
    const pool = this.pools.get(token.layerId);
    if (!pool) return null;
    const slot = pool.pool.slotOf(token.key);
    if (!slot || slot.index !== token.slotIndex) return null;
    return pool;
  }

  /** One prefetch marker per layer: `sliceSignature|slabZ` last prefetched. */
  private readonly prefetchedSlabMarker = new Map<string, string>();

  /**
   * z±1 adjacent-slab prefetch — decoded-chunk-cache warmth ONLY (no atlas
   * slots, no page-table writes, no residency interaction). Runs exclusively
   * on the streaming→idle edge, so it can never compete with visible fetches;
   * within the worker pool its tasks sort BELOW everything visible
   * (priority −1 vs node levels ≥ 0), so a new plan mid-prefetch jumps the
   * queue naturally. A later scrub to the neighbor slab then costs
   * repack+upload instead of network+decode. Capped by chunk count and
   * (promoted) bytes so plane-chunked datasets can't evict the CURRENT slab
   * out of the byte-budgeted chunk cache.
   */
  private prefetchAdjacentSlabs(): void {
    const PREFETCH_MAX_CHUNKS = 32;
    const PREFETCH_MAX_BYTES = 64 * 1024 * 1024;
    const state = this.deps.viewerStore.getState();
    let chunksIssued = 0;
    let bytesIssued = 0;

    for (const pool of this.pools.values()) {
      if (pool.mode !== "2D" || pool.geometry.axes.zPos === -1) continue;
      const plan = state.nodePlans[pool.layerId];
      if (!plan || plan.mode !== "2D" || plan.slabZ === null || plan.slabZ === undefined) {
        continue;
      }
      const marker = `${pool.sliceSignature}|${plan.slabZ}`;
      if (this.prefetchedSlabMarker.get(pool.layerId) === marker) continue;
      this.prefetchedSlabMarker.set(pool.layerId, marker);

      const baseLevel = pool.geometry.levels[0];
      const issued = new Set<string>();

      for (const node of plan.nodes) {
        if (node.level !== plan.targetLevel) continue;
        const level = pool.geometry.levels[node.level];
        // Promoted footprint (uint8 stays 1 B/voxel, everything else → f32).
        const chunkBytes =
          level.chunks.reduce((total, extent) => total * Math.max(1, extent), 1) *
          (pool.atlas.kind === "r8" ? 1 : 4);
        let arr: ReturnType<typeof state.getArrayForStoreId>;
        try {
          arr = state.getArrayForStoreId(level.storeId);
        } catch {
          continue;
        }

        for (const dz of [1, -1]) {
          const brickZ = adjacentSlabBrickZ(
            plan.slabZ,
            dz,
            baseLevel.scale[2],
            level.scale[2],
            level.spatialShape[2],
            pool.spec.payload[2],
            baseLevel.spatialShape[2],
          );
          // Same brick as the current slab = already resident; skip.
          if (brickZ === null || brickZ === node.coords[2]) continue;

          const coords: Vec3 = [node.coords[0], node.coords[1], brickZ];
          for (const { chunkCoords } of this.enumerateBrickChunkCoords(pool, node.level, coords)) {
            const key = `${level.storeId}:${chunkCoords.join(",")}`;
            if (issued.has(key)) continue;
            if (chunksIssued >= PREFETCH_MAX_CHUNKS || bytesIssued + chunkBytes > PREFETCH_MAX_BYTES) {
              return;
            }
            issued.add(key);
            chunksIssued += 1;
            bytesIssued += chunkBytes;
            // Fire-and-forget: results land in the chunk cache; failures
            // (abort on dispose, transient network) are non-events here.
            void this.fetchChunkShared(arr, level.storeId, chunkCoords, -1).catch(() => {});
          }
        }
      }
    }
  }

  /**
   * Fixed (collapsed) indices for every non-spatial, non-channel, non-phasor
   * dim of a layer: the scene-wide dim-slider selection when present, else the
   * lens slice's collapsed default. Computed at pool CREATION and recomputed on
   * every signature FLUSH — a flushed pool that kept its old indices would
   * refetch exactly the slice it just invalidated (the t-slider's data
   * would never change).
   *
   * A phasor axis is NOT collapsed: the repack reduces every one of its bins
   * (`brickRepack.reduceChunks`), so pinning one index here would hand it a
   * single bin and the DFT would read a constant.
   */
  private computeFixedIndices(
    layer: LayerState,
    geometry: LayerLevelGeometry,
    levels: LevelSource[],
  ): { fixedChunkCoords: number[]; fixedOffsets: number[] } {
    const dims = layer.lens.dataset.dims;
    const { xPos, yPos, zPos, intensityPos, phasorPos } = geometry.axes;
    const sliceMap = layer.lens.slices.reduce<Record<string, (typeof layer.lens.slices)[number]>>(
      (acc, slice) => {
        acc[slice.dim] = slice;
        return acc;
      },
      {},
    );
    const dimSelections = this.deps.viewerStore.getState().dimSelections;
    const fixedChunkCoords = dims.map(() => 0);
    const fixedOffsets = dims.map(() => 0);
    dims.forEach((dim, d) => {
      if (d === xPos || d === yPos || d === zPos || d === intensityPos) return;
      if (d === phasorPos && geometry.phasorBins > 0) return;
      const fixedIndex = resolveFixedDimIndex(
        sliceMap[dim],
        dimSelections[dim],
        levels[0].shape[d] ?? 1,
      );
      const chunkExtent = Math.max(1, levels[0].chunks[d] ?? 1);
      fixedChunkCoords[d] = Math.floor(fixedIndex / chunkExtent);
      fixedOffsets[d] = fixedIndex % chunkExtent;
    });
    return { fixedChunkCoords, fixedOffsets };
  }

  private flushPool(
    pool: LayerBrickPool,
    nextSliceSignature: string,
    layer: LayerState,
    levels: LevelSource[],
  ): void {
    for (const controller of pool.inFlight.values()) controller.abort();
    pool.inFlight.clear();
    pool.pendingFetch = [];
    pool.queue = [];
    pool.queuedKeys.clear();
    pool.emptyValues.clear();
    pool.pool.clear();
    clearPageTable(pool.pageTable);
    pool.sliceSignature = nextSliceSignature;
    // The signature changed because the SELECTION changed (slices or a dim
    // slider) — the collapsed indices must follow, or the refetch reproduces
    // the flushed data.
    const { fixedChunkCoords, fixedOffsets } = this.computeFixedIndices(
      layer,
      pool.geometry,
      levels,
    );
    pool.fixedChunkCoords = fixedChunkCoords;
    pool.fixedOffsets = fixedOffsets;
  }

  private disposePool(pool: LayerBrickPool): void {
    for (const controller of pool.inFlight.values()) controller.abort();
    pool.inFlight.clear();
    this.prefetchedSlabMarker.delete(pool.layerId);
    disposeBrickAtlas(pool.atlas);
    disposePageTable(pool.pageTable);
    // Pool lifecycle event — layer components must drop their pool handle.
    this.deps.viewerStore.getState().bumpPoolsVersion();
  }

  dispose(): void {
    this.disposed = true;
    this.fetchAbort.abort();
    this.inFlightChunks.clear();
    this.gpuRepacker?.dispose();
    this.gpuRepacker = null;
    for (const pool of this.pools.values()) this.disposePool(pool);
    this.pools.clear();
    // Don't leave the governor thinking a torn-down scene is still streaming.
    qualityGovernor.setStreaming(false);
  }
}
