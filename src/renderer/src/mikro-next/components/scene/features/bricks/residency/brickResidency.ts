import type { Chunk, DataType } from "zarrita";
import type { StoreApi } from "zustand/vanilla";
import { perfMonitor } from "../../../platform/perf/perfMonitor";
import { coldOpenTimeline } from "../../../platform/perf/coldOpenTimeline";
import {
  DRAIN_PUMP_MS,
  FRAME_UPLOAD_BUDGET,
  MAX_STALE_QUEUE,
  gpuFlushUploadBytes,
  partitionUploadQueue,
  resolveDrainPolicy,
  resolveStreamFrameAction,
  shouldContinueDrain,
  shouldContinueStaleDrain,
  shouldDispatchFetch,
} from "../../../platform/quality/uploadBudget";
import { qualityGovernor } from "../../../platform/quality/qualityGovernor";
import { getMax3DTextureSize, type SceneRenderer } from "../../../platform/gpu/sceneRenderer";
import {
  createCacheKey,
  getChunkWorker,
  readArrayMetadataCached,
} from "../../../../../../lib/zarr/runner/index";
import { workerPool } from "../../../../../workers/pool";
import { INTERACTIVE_FETCH_PRIORITY } from "@/lib/zarr/pool/types";
import { getInitialVolumeTextureBudgetBytes } from "../../../platform/quality/lodPlanning";
import { resolveLayerDataRange, serverHistogramRange } from "../../../platform/model/dataRange";
import { resolveFixedDimIndex } from "../../../platform/coords/selection";
import {
  decodeEmptyValue,
  encodeEmptyTexel,
  encodeEmptyValue,
  encodeOccupancyTexel,
  type EmptyValueBits,
} from "../octree/brickEncoding";
import { ChunkRefRegistry } from "../octree/chunkRefRegistry";
import { ByteBudgetChunkCache } from "@/lib/zarr/caches/byteBudgetChunkCache";
import {
  BrickPoolState,
  selectTrimCandidates,
  type ProtectedKeys,
} from "../octree/brickPoolState";
import type { BrickArray, RepackChunk } from "../octree/brickRepack";
import { assessPoolViability } from "../octree/poolViability";
import { buildPoolKey, buildStructureSignature, poolValueSemantics } from "../octree/poolKey";
import {
  MIN_POOL_HEADROOM_SLOTS,
  getDecodedChunkCacheBytes,
  resolvePoolBudget,
} from "../octree/poolBudget";
import {
  isOccHierarchyEnabled,
  isOccObservedRangeEnabled,
} from "../gpu/shaderFlags";
import {
  aggregateIfComplete,
  parentCellsOf,
} from "../octree/occupancyAggregate";
import type { RepackDispatcher } from "../octree/repackDispatcher";
import { brickSlotBytes, resolveBrickSpec, type BrickSpec } from "../octree/brickSpec";
import {
  buildLayerLevelGeometry,
  buildLevelSources,
  hasPhasorSlabs,
  type LayerLevelGeometry,
  type LevelSource,
  type Vec3,
} from "../../../platform/coords/levelGeometry";
import {
  brickGridForLevel,
  chunksTouchingBrick,
  fetchVoxelBox,
  nodeKey,
  nodeVoxelBox,
  parseNodeKey,
  totalBrickCount,
} from "../octree/nodeAddress";
import { createNodeKeyMemo, type NodeKeyMemo } from "../octree/nodeKeyMemo";
import {
  adjacentSlabBrickZ,
  compareFetchOrder,
  type LayerNodePlan,
  type PlannedNode,
} from "../octree/nodePlanning";
import {
  PAGE_FLAG_EMPTY,
  PAGE_FLAG_RESIDENT,
  PAGE_FLAG_UNMAPPED,
  buildPageTableLayout,
} from "../octree/pageTableLayout";
import type { LayerState } from "../../../platform/model/layerModel";
import type { SceneState } from "../../../platform/stores/sceneStore";
import type { ViewerState } from "../../../platform/stores/viewerStore";
import { atlasBytesPerVoxel, atlasKindForGeometry } from "../octree/atlasFormat";
import {
  createBrickAtlas,
  disposeBrickAtlas,
  mirrorBrickToBacking,
  writeBrickToAtlas,
  type BrickAtlas,
} from "../gpu/brickAtlas";
import {
  createGpuRepacker,
  isGpuRepackEnabled,
  type GpuFlushOutcome,
  type GpuRepacker,
} from "../gpu/computeRepack";
import {
  createGpuSkeletonizer,
  type GpuSkeletonizer,
} from "../../annotations/enhancers/shared/gpu/computeSkeleton";
import {
  runGpuSkeletonSelfTest,
  type GpuSkeletonSelfTestResult,
} from "../../annotations/enhancers/shared/gpu/computeSkeletonSelfTest";
import {
  runGpuRepackSelfTest,
  type GpuRepackSelfTestResult,
} from "../gpu/computeRepackSelfTest";
import {
  clearPageTable,
  createPageTableTexture,
  disposePageTable,
  ensureAggregate,
  flushPageTable,
  setAggregateEntry,
  setPageEntry,
  type PageTableTexture,
} from "../gpu/pageTableTexture";

/**
 * CPU-side octree residency: subscribes to `viewerStore.nodePlans`, fetches
 * the planned bricks' zarr chunks through the worker pool, repacks them into
 * stored bricks, and drains a byte-budgeted upload queue into the per-layer
 * brick atlas + page table each frame.
 *
 * Owned by `BrickSystemProvider` (needs the renderer); a plain class
 * like `CanvasContext`, referenced from the store by handle only.
 */

// Per-frame texSubImage3D budget lives in ./uploadBudget (bytes + bricks +
// WALL-CLOCK cap — the time cap is what keeps integrated GPUs smooth, P19).
const PAGE_TEXTURE_MAX_EXTENT = 2048;
// In-flight fetch count, residency-bump throttle and upload time budget are
// TIER-scaled — read from the quality governor's profile at use sites (P19).

const DECODED_CHUNK_CACHE_BYTES = getDecodedChunkCacheBytes();

/** The range occupancy texels are quantized against — the pool range unless
 * the observed-range flag promoted a tighter one (see `occObservedRange`).
 * MUST be the range the shader's `uOccDecodeMin/Range` uniforms hold. */
const occEncodeRangeOf = (pool: LayerBrickPool): { minValue: number; maxValue: number } => ({
  minValue: pool.occEncodeMin,
  maxValue: pool.occEncodeMax,
});

/** Encode work a drain still owes a pool: the two-drain occupancy-range
 * promotion (either phase) or a pending auto-range EMPTY re-encode. The
 * drain idle-latch must NOT clear while any of these is set, or the second
 * drain of the promotion protocol never runs under the demand frame loop
 * (exported for the vitest matrix). */
export const hasPendingEncodeWork = (pool: {
  occReencodePending: boolean;
  autoRangeEncodeDirty: boolean;
}): boolean => pool.occReencodePending || pool.autoRangeEncodeDirty;

/**
 * Whether a DRAINED-EDGE occupancy-range promotion is worth a sidecar
 * rewrite: the observed union escaped the encode range, or tightened to
 * under 80% of it. The escape epsilon is relative to the OBSERVED span —
 * an epsilon on the (possibly tiny, post-first-promotion) encode span
 * turned every union growth during a cold load into an escape, cascading
 * 10-40 promotions per load. Pure, exported for the vitest matrix.
 */
export const occPromotionWorthwhile = (pool: {
  occObservedInitialized: boolean;
  occObservedMin: number;
  occObservedMax: number;
  occEncodeMin: number;
  occEncodeMax: number;
}): boolean => {
  if (!pool.occObservedInitialized) return false;
  const observedSpan = pool.occObservedMax - pool.occObservedMin;
  if (!(observedSpan > 0)) return false;
  const encodeSpan = Math.max(pool.occEncodeMax - pool.occEncodeMin, 1e-6);
  const eps = observedSpan * 0.01;
  const escaped =
    pool.occObservedMin < pool.occEncodeMin - eps ||
    pool.occObservedMax > pool.occEncodeMax + eps;
  const tightened = observedSpan < encodeSpan * 0.8;
  return escaped || tightened;
};

/** A decoded chunk plus its shared-cache key (doubles as the GPU-buffer key). */
type GpuQueuedChunk = RepackChunk & { cacheKey: string };

type PendingBrick = {
  key: string;
  level: number;
  coords: Vec3;
  /** CPU path: the repacked brick ready for upload. Null on the GPU path. */
  data: BrickArray | null;
  uniformValue: number | null;
  /** Raw brick [min, max] from the repack scan (occupancy sidecar). Null on
   * the GPU path — its min/max arrives with the async readback. */
  range: [number, number] | null;
  bytes: number;
  /** GPU path: raw decoded chunks; the repack runs as a compute dispatch at
   * drain time, once a slot is acquired. */
  gpu: { chunks: GpuQueuedChunk[] } | null;
  /** Drains this PLANNED brick found every slot protected (defer-retry). */
  acquireRetries?: number;
};

/** Frames a planned brick waits for a free slot before being dropped. A
 * replan or eviction can free slots any moment, so retrying from the queue
 * is far cheaper than the old drop-and-refetch (which redid the fetch/repack
 * every 200 ms for as long as the plan overshot capacity). The planner's
 * coarsest reservation makes overshoot rare; this makes it cheap. */
const MAX_ACQUIRE_RETRIES = 30;

/** Identifies a dispatched brick across the async min/max readback; every
 * field is re-validated against the CURRENT mapping when the readback lands. */
type GpuBrickToken = { poolKey: string; key: string; slotIndex: number };

/** `acquire()` sentinel treating every occupant as protected: the acquisition
 * succeeds only into a FREE slot, never by eviction — how out-of-plan bricks
 * are allowed to land without displacing planned ones. */
const FREE_SLOTS_ONLY: ProtectedKeys = { has: () => true };

/** Rate limit for auto-range `poolsVersion` bumps: during early float-layer
 * streaming, range moves can land several times per frame and each bump
 * re-renders the layer components + levels editor. */
const AUTO_RANGE_BUMP_MS = 150;

/** Per-layer derivation feeding `ensurePool` — side-effect free, so layers can
 * be grouped by `poolKey` before anything is allocated. */
type PoolDerivation = {
  /** The layer this was derived from. Any member of the group works for the
   * pool-wide fields (they are equal by construction — that is what the key
   * asserts); it is kept for `computeFixedIndices` and warnings. */
  layer: LayerState;
  mode: "2D" | "3D";
  levels: readonly LevelSource[];
  geometry: LayerLevelGeometry;
  spec: BrickSpec;
  structureSignature: string;
  sliceSignature: string;
  dataRange: readonly [number, number];
  /** What a slot's contents mean; decides the EMPTY code width. */
  valueSemantics: "intensity" | "labelIds";
  poolKey: string;
};

export type LayerBrickPool = {
  /** Content address (see `buildPoolKey`) — the map key. NOT a layer id: every
   * layer whose data, slicing and value range match shares this one pool. */
  poolKey: string;
  /**
   * How wide an EMPTY (uniform) brick's value is encoded in its page entry —
   * 8 bits for intensities, 24 for label ids. Derived from the pool key's
   * `valueSemantics`, so every member agrees by construction, and carried here
   * because both the write path and the CPU mirror need it at every call.
   */
  emptyBits: EmptyValueBits;
  /** Layer ids currently backed by this pool. Refcount: the pool is disposed
   * when the last member leaves. Never empty for a live pool. */
  members: Set<string>;
  mode: "2D" | "3D";
  sliceSignature: string;
  /** Structural identity: levels + spec + slabs + mode. Distinct from
   * `poolKey`, which additionally pins the slice and the value range — a pool
   * whose structure still matches can be FLUSHED in place (atlas reused)
   * instead of rebuilt. */
  structureSignature: string;
  geometry: LayerLevelGeometry;
  spec: BrickSpec;
  atlas: BrickAtlas;
  pageTable: PageTableTexture;
  pool: BrickPoolState;
  protectedKeys: Set<string>;
  /** Resident coarsest-level keys — maintained incrementally so reconcile can
   * pin them without walking (and string-parsing) the whole pool per replan. */
  coarsestResident: Set<string>;
  inFlight: Map<string, AbortController>;
  /** Plan nodes waiting for a free fetch slot (refreshed per reconcile), in
   * REVERSE dispatch order — startNextFetches pops from the tail (O(1); a
   * shift-consumed queue was O(n²) across a large plan). */
  pendingFetch: PlannedNode[];
  /** Bounded per-key retry counts for failed fetches of still-planned bricks
   * (self-heal without waiting for the next replan). Cleared per reconcile. */
  fetchRetries: Map<string, number>;
  queue: PendingBrick[];
  /** Keys currently in `queue` (O(1) membership for reconcile). */
  queuedKeys: Set<string>;
  /** Uniform bricks: page-mapped EMPTY, no slot; value = the uniform fill. */
  emptyValues: Map<string, number>;
  /** Raw `[min, max]` of every RESIDENT brick (from the repack min/max scan /
   * GPU readback) — backs the occupancy sidecar's re-encode when the pool
   * range moves (quantization is relative to the range, exactly like
   * `emptyValues`). Entries are dropped on evict; bounded by slot count. */
  brickRanges: Map<string, [number, number]>;
  /** Per-dim fixed chunk coords / in-chunk offsets for non-spatial dims. */
  fixedChunkCoords: number[];
  fixedOffsets: number[];
  /** Layer data range (raw value space) — shader normalization + EMPTY encode. */
  minValue: number;
  maxValue: number;
  /** Float layers with no server value histogram would normalize against the
   * dtype fallback `[0,1]`, saturating any data valued >1 to white. When true,
   * `minValue`/`maxValue` are instead derived from a running min/max over the
   * per-brick ranges the repack pipeline already computes (auto-contrast). */
  autoRange: boolean;
  /** A range move requires re-encoding every EMPTY page entry (they store the
   * value quantized against the pool range). Marked here and applied ONCE per
   * drain frame — early float streaming can move the range several times per
   * frame, and each immediate rewrite re-uploaded page-table regions. */
  autoRangeEncodeDirty: boolean;
  /** True once a non-degenerate brick has seeded the real auto-range, so the
   * first update replaces the provisional `[0,1]` seed instead of unioning. */
  autoRangeInitialized: boolean;
  /** Occupancy OBSERVED-range encoding (`orkestrator.occObservedRange`,
   * captured at pool creation): quantize the occupancy sidecar against the
   * running union of every landed brick range instead of the pool (dtype)
   * range — on dim integer data the dtype-range encoding collapses to a few
   * codes and MIP maximum-culling never fires. `occEncodeMin/Max` is the
   * range the sidecar texels are CURRENTLY encoded against (the shader's
   * `uOccDecodeMin/Range` must always equal it — the lockstep invariant);
   * `occObserved*` is the running union that PROMOTES into it via a
   * DRAINED-EDGE two-drain protocol (the drain flush loop promotes only
   * when the pipeline is quiet AND `occPromotionWorthwhile`: blank all
   * texels + promote + bump, then `occReencodePending` → re-encode next
   * drain) so there is never a frame where texels are encoded against a
   * range the shader uniforms don't hold — blanked texels are the "never
   * skip" sentinel under ANY uniforms, and promotion happens at most ONCE
   * per stream burst (per-brick promotion cascaded 10-40 sidecar rewrites
   * + off-cadence frames per cold load). Flag off: `occEncode*` mirrors
   * the pool range (bit-identical to the legacy single-range behavior). */
  occObservedRange: boolean;
  occObservedMin: number;
  occObservedMax: number;
  occObservedInitialized: boolean;
  occEncodeMin: number;
  occEncodeMax: number;
  occReencodePending: boolean;
  /** Hierarchical occupancy (R4, `orkestrator.occHierarchy`, captured at
   * pool creation). `measuredRanges` holds every brick's raw measured
   * [min,max] (uniform bricks as [v,v]) and — unlike `brickRanges` —
   * SURVIVES EVICTION: ranges are statements about the data, invalidated
   * only by a pool flush. `aggregateRanges` holds the written level-h
   * aggregates (key = nodeKey(h, cell)) so promotions can blank/re-encode
   * them without re-checking completeness. See occupancyAggregate.ts. */
  occHierarchy: boolean;
  measuredRanges: Map<string, readonly [number, number]>;
  aggregateRanges: Map<string, readonly [number, number]>;
  /** Keys whose slot was written by the GPU repack kernel: the CPU atlas
   * mirror never sees those writes, so `sampleResident` must read THESE bricks
   * from the decoded chunk cache instead (`sampleChunkCacheSync`). Scoped
   * per brick — CPU-uploaded bricks keep the fast mirror read. */
  gpuStaleKeys: Set<string>;
  /** Min target level across the member plans, from the last reconcile. Bricks
   * FINER than this are unreachable by the shader (its residency walk starts at
   * the desired level and moves coarser), so they are trimmed from the pool and
   * refused entry by the stale drain. */
  minTargetLevel: number;
  /** Which repack path the LAST fetched brick took, with the reason when it
   * fell back to the CPU (debug report only): "gpu", "cpu:phasor",
   * "cpu:no-repacker", "cpu:pending"/"cpu:broken", "cpu:unsupported:<kind>". */
  lastRepackPath: string | null;
  /** Per-level `nodeKey` memo for the CPU probe walk — see nodeKeyMemo.ts.
   * Garbage avoidance only; it caches no residency and needs no invalidation. */
  nodeKeys: NodeKeyMemo;
};

type Deps = {
  viewerStore: StoreApi<ViewerState>;
  sceneStore: StoreApi<SceneState>;
  /** Runs `repackBrick` off the UI thread (worker pool; sync in tests). */
  repack: RepackDispatcher;
  /** Live camera-gesture state (viewStore.cameraMoving) — read by the
   * streaming render-cadence gate and its off-frame pump at FIRE time, so a
   * gesture that starts after a timer was armed still drains under the
   * trickle policy. Optional: absent (tests) reads as not interacting. */
  isInteracting?: () => boolean;
};

export type ResidentBrickInfo = {
  level: number;
  coords: Vec3;
  empty: boolean;
};

export type BrickSystemStats = {
  /** Bricks whose fetch completed AND entered the upload queue (bricks
   * discarded by the staleness checkpoint count as `staleFetches` instead). */
  bricksFetched: number;
  chunkRequests: number;
  /** Bytes of FIRST-SEEN chunks only — approximates unique decode volume
   * (cache hits and shared in-flight awaits are not re-counted). */
  bytesDecoded: number;
  fetchMs: number;
  repackMs: number;
  /** GPU-repacked bricks (compute dispatch instead of worker + upload). */
  gpuBricks: number;
  /** NOT A COST. Sum over flushes of submit→min/max-readback LATENCY. One flush
   * is submitted per drainUploads (i.e. per frame) and flushes OVERLAP, so this
   * double-counts wall time and is not additive with anything. It also excludes
   * every synchronous part of the submit path — the chunk writeBuffer, params
   * packing, encoder recording and queue.submit all run before the first await
   * inside flush(), so they land in `uploadMs`. Do NOT divide it by gpuBricks:
   * a batch of one brick bills a full submit→map round trip (~1.5 vsync) and
   * reads as "24 ms per brick" when the real main-thread cost is `uploadMs`.
   * For the honest per-brick cost use uploadMs; for pipeline health use
   * timeToSharpMs; for the worst single round trip use gpuRepackLatencyMaxMs. */
  gpuRepackLatencyMsSum: number;
  /** Longest single submit→readback round trip. A real regression moves THIS. */
  gpuRepackLatencyMaxMs: number;
  /** Batch sizes seen by the GPU repacker: total dispatched bricks / flushes.
   * A mean near 1 means the 32 s-style latency sums are pure pipeline latency
   * with no batching to amortize them. */
  gpuRepackFlushes: number;
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
  /** Queued out-of-plan bricks dropped: no free slot at drain time, or
   * stale-queue cap overflow. The repack was paid for; nothing landed. */
  planDrops: number;
  /** Planned bricks that found every slot protected at drain time. */
  acquireFailures: number;
  /** Residents released because they were finer than every plan's target level
   * — slots the shader could never read, reclaimed as cache headroom. */
  trimmed: number;
  /** Bricks whose fetch completed after the plan moved on: repack and upload
   * skipped, decoded chunks retained in the cache (flip-back stays cheap). */
  staleFetches: number;
  /** Out-of-plan bricks uploaded into FREE slots on leftover budget —
   * fallback data, never under the first-brick free pass. */
  staleUploads: number;
  /** Zero-referrer chunk fetches aborted after their LAST brick let go:
   * still-queued decode tasks are cancelled outright (the win); already
   * started ones finish into the chunk cache regardless (aborting shared
   * in-progress decodes was the 13× amplification bug — never do that). */
  cancelledDecodes: number;
  fetchErrors: number;
  /** Streaming wakeups whose render was coalesced by the cadence gate — each
   * one is a whole-scene re-raymarch that no longer happened (gap 1a). */
  streamFramesCoalesced: number;
  /** Hierarchical-occupancy aggregate texels written (R4) — a write happens
   * when a parent cell's LAST child range lands (or on re-encode). */
  aggregateWrites: number;
};

export class BrickResidencyManager {
  /** Keyed by POOL KEY (content address), not layer id — see `buildPoolKey`. */
  private readonly pools = new Map<string, LayerBrickPool>();
  /** layer id → pool key, so the public per-layer accessors (`getLayerPool`,
   * `sampleResident`, …) keep their signatures and every consumer is unchanged. */
  private readonly layerToPoolKey = new Map<string, string>();
  private readonly chunkCache = new ByteBudgetChunkCache(DECODED_CHUNK_CACHE_BYTES);
  /** Per-store zarr chunk-key encoders for the sync chunk-cache probe read
   * (`sampleChunkCacheSync`). null = metadata resolution in flight. */
  private readonly chunkKeyEncoders = new Map<string, ((coords: number[]) => string) | null>();
  /** Single-entry memo for the sync chunk-cache probe: consecutive march
   * steps overwhelmingly read the SAME decoded chunk, so the last one is
   * kept keyed by its FULL zarr chunk coords — a hit skips the cache-key
   * string build and the LRU mutation entirely (≈256×/frame during a 3D
   * hover). Safe without invalidation: decoded chunks are immutable and any
   * slice/dim change alters the coord tuple, which is compared in full. */
  private lastChunkRead: {
    storeId: string;
    coords: number[];
    chunk: Chunk<DataType>;
  } | null = null;
  /** Scratch for the memo's coord tuple (avoids a per-sample allocation). */
  private readonly chunkCoordsScratch: number[] = [];
  /** Scratch for `resolveResidentRead`'s per-level voxel (probe march hot
   * path; read and discarded within the loop body, never retained). */
  private readonly levelVoxelScratch: [number, number, number] = [0, 0, 0];
  /** In-flight decoded-chunk promises, shared across bricks: without this,
   * N concurrent bricks touching the same plane chunk decode it N times
   * (observed 73× fetch amplification on plane-chunked SPIM data). */
  private readonly inFlightChunks = new Map<string, Promise<Chunk<DataType>>>();
  /** Per-in-flight-chunk abort: fired ONLY when the last referring brick
   * releases (see chunkRefs) — the worker pool then cancels the task if it
   * is still QUEUED, while a started task ignores it and finishes into the
   * cache. Entries live exactly as long as their inFlightChunks entry. */
  private readonly inFlightChunkAborts = new Map<string, AbortController>();
  /** Which live bricks need which in-flight chunk (`core/octree/chunkRefRegistry`). */
  private readonly chunkRefs = new ChunkRefRegistry();
  /** Monotonic per-fetch owner suffix: a brick dropped and immediately
   * re-planned runs TWO overlapping fetchBrick invocations with the SAME
   * node.key — with the bare key as owner, the old invocation's finally
   * released the ref the new one had just acquired (Set semantics), fired the
   * last-ref abort and cancelled the NEW fetch's queued chunks. The brick
   * then stayed unloaded until the next replan. Owner identity must be the
   * INVOCATION, not the brick. */
  private fetchOwnerSeq = 0;
  /** Chunk fetches outlive individual brick aborts (shared!); this cancels
   * them all on dispose. */
  private readonly fetchAbort = new AbortController();
  private disposed = false;
  private lastResidencyBumpAt = 0;
  /** Monotonic plan generation, used as the worker-pool priority of every
   * chunk task a brick fetch enqueues: the pool serves HIGHER priorities
   * first, so a newer plan's decodes always beat stranded queued tasks from
   * earlier plans (the old `priority: node.level` scheme served the coarse
   * leftovers first — exactly backwards while zooming in). Within one
   * generation the pool is FIFO, which preserves `pendingFetch`'s near-first
   * dispatch order. Interactive fetches use INTERACTIVE_FETCH_PRIORITY,
   * above every generation; the slab prefetch stays at −1, below all of it. */
  private fetchGeneration = 1;
  /** Trailing hysteresis for the governor's streaming flag (drainUploads). */
  private lastStreamingTrueAt = 0;
  private streamingClearTimer: ReturnType<typeof setTimeout> | null = null;
  /** CPU-uploaded bricks whose backing-mirror copy is deferred to idle time
   * (the copy is main-thread work inside the drain budget otherwise). Until
   * it lands the key sits in `gpuStaleKeys`, so probes read the chunk cache. */
  private readonly mirrorQueue: {
    pool: LayerBrickPool;
    key: string;
    slotIndex: number;
    slotCoords: Vec3;
    data: BrickArray;
  }[] = [];
  private mirrorIdleScheduled = false;
  /** Per-layer geometry/spec derivation cache: nodePlanTracker derives the
   * identical values moments earlier in the same tick, and re-running
   * buildLevelSources + buildLayerLevelGeometry + resolveBrickSpec +
   * assessPoolViability + the JSON structure signature on every replan
   * (≤5×/s during a zoom) was pure allocation churn. Keyed on the input
   * identities the derivation actually reads; only successes are cached, so
   * a store that opens late retries naturally. */
  private readonly layerDerivationCache = new Map<
    string,
    {
      layer: LayerState;
      dataArrays: unknown;
      mode: "2D" | "3D";
      levels: LevelSource[];
      geometry: LayerLevelGeometry;
      spec: BrickSpec;
      structureSignature: string;
      viability: ReturnType<typeof assessPoolViability>;
    }
  >();
  /** Auto-range bump throttle (see AUTO_RANGE_BUMP_MS); the trailing timer
   * guarantees the LAST range move of a burst always publishes. */
  private lastPoolsBumpAt = 0;
  private poolsBumpTimer: ReturnType<typeof setTimeout> | null = null;
  /** False once a drain observed the whole pipeline idle: `drainUploads` then
   * returns immediately (no per-frame allocations/pool walks on idle rendered
   * frames) until new work arrives via `wakeDrain`. */
  private drainNeeded = true;
  readonly stats: BrickSystemStats = {
    bricksFetched: 0,
    chunkRequests: 0,
    bytesDecoded: 0,
    fetchMs: 0,
    repackMs: 0,
    gpuBricks: 0,
    gpuRepackLatencyMsSum: 0,
    gpuRepackLatencyMaxMs: 0,
    gpuRepackFlushes: 0,
    uploadMs: 0,
    timeToSharpMs: 0,
    bricksUploaded: 0,
    bytesUploaded: 0,
    emptyBricks: 0,
    evictions: 0,
    planDrops: 0,
    acquireFailures: 0,
    trimmed: 0,
    staleFetches: 0,
    cancelledDecodes: 0,
    staleUploads: 0,
    fetchErrors: 0,
    streamFramesCoalesced: 0,
    aggregateWrites: 0,
  };
  /** Streaming render-cadence gate (gap 1a — see resolveStreamFrameAction):
   * last actually-issued streaming invalidate, and the off-frame pump timer
   * that keeps drainUploads running between the coalesced frames. */
  private lastStreamInvalidateAt = 0;
  private drainPumpTimer: ReturnType<typeof setTimeout> | null = null;
  /** True while at least one coalesced wakeup still awaits its frame — the
   * pump keeps re-entering the gate until the cadence window closes and the
   * frame lands, even if the upload queue drained mid-window. */
  private pendingStreamFrame = false;
  /** Chunk keys already counted toward bytesDecoded. */
  private readonly countedChunkKeys = new Set<string>();
  /** Layers already warned about a non-viable pool (one warning per layer). */
  private readonly warnedUnviable = new Set<string>();
  /** Stores whose chunk-key metadata read failed at least once (one warning). */
  private readonly warnedEncoderStores = new Set<string>();
  /** undefined = not yet attempted; null = unavailable (pipeline failed, or
   * disabled via the localStorage kill switch) — the CPU worker path then
   * handles every brick. */
  private gpuRepacker: GpuRepacker<GpuBrickToken> | null | undefined;
  /** Lazy like `gpuRepacker`: undefined = not yet attempted, null = no device. */
  private gpuSkeletonizer: GpuSkeletonizer | null | undefined;
  /** Wall-clock start of the current streaming burst (null = idle). Set when
   * a reconcile enqueues work while idle; NOT reset by mid-burst replans, so
   * timeToSharpMs measures interaction → fully-sharp. */
  private streamStartedAt: number | null = null;
  /** Last few timeToSharpMs values (newest last) for variance eyeballing. */
  private readonly timeToSharpRing: number[] = [];

  /**
   * The renderer is LATE-BOUND: the manager is constructed (and starts
   * fetching) outside the R3F canvas, before `renderer.init()` has resolved.
   * Null means "no device yet" — fetch, decode and repack all run regardless,
   * and their results wait in `pool.queue` for the first drain after attach.
   * See `attachRenderer`.
   */
  private renderer: SceneRenderer | null = null;
  private invalidateFn: (() => void) | null = null;

  constructor(private readonly deps: Deps) {}

  /** Request a frame. A no-op while detached — there is no frameloop to ask. */
  private invalidate(): void {
    this.invalidateFn?.();
  }

  /**
   * Bind the renderer once the canvas has one, and drain whatever accumulated
   * while there was no device.
   *
   * Pools created before this point never had their backend texture realized
   * (`initTexture` is a no-op without a renderer), so every existing atlas is
   * re-initialized here — otherwise the first `writeTexture` would race the
   * lazy creation the eager call exists to prevent.
   */
  attachRenderer(renderer: SceneRenderer, invalidate: () => void): void {
    if (this.disposed) return;
    this.renderer = renderer;
    this.invalidateFn = invalidate;
    for (const pool of this.pools.values()) {
      (
        renderer as unknown as { initTexture?: (texture: unknown) => void }
      ).initTexture?.(pool.atlas.texture);
    }
    // Anything fetched pre-attach is sitting in the upload queues.
    this.wakeDrain();
    // Re-reconcile against the CURRENT plans. Load-bearing on a canvas REMOUNT
    // (2D<->3D is not one, but a scope rebuild is): `detachRenderer` disposed
    // every pool, and the plan subscription only fires when plans CHANGE — so
    // without this the scene would sit empty until the next replan happened to
    // move something.
    this.reconcileAll(this.deps.viewerStore.getState().nodePlans);
    this.invalidate();
  }

  /**
   * Unbind the renderer — the canvas is going away.
   *
   * Every GPU resource dies with the device that made it, so this disposes the
   * pools as well. Hoisting the manager out of the canvas is about starting
   * EARLIER, not about surviving a canvas teardown; a remount re-fetches from
   * the decoded-chunk cache, which is the same cost the previous
   * unmount-the-whole-manager arrangement paid.
   */
  detachRenderer(): void {
    this.gpuRepacker?.dispose();
    // undefined, not null: null MEMOIZES "unavailable", and the next attach
    // must be free to try again.
    this.gpuRepacker = undefined;
    this.gpuSkeletonizer?.dispose();
    this.gpuSkeletonizer = undefined;
    for (const pool of this.pools.values()) this.disposePool(pool);
    this.pools.clear();
    this.layerToPoolKey.clear();
    this.renderer = null;
    this.invalidateFn = null;
  }

  private ensureGpuRepacker(): GpuRepacker<GpuBrickToken> | null {
    // Deliberately not memoized while detached: caching `null` here would make
    // "no device yet" permanent for the whole session.
    if (this.renderer === null) return null;
    if (this.gpuRepacker === undefined) {
      this.gpuRepacker = isGpuRepackEnabled()
        ? createGpuRepacker<GpuBrickToken>(this.renderer)
        : null;
    }
    return this.gpuRepacker;
  }

  /**
   * The skeleton-brush compute engine (`computeSkeleton.ts`), created lazily
   * on the manager's renderer like the repacker above — the manager is the
   * one sanctioned holder of the renderer, so GPU consumers of the atlas +
   * page table hang off it rather than threading the renderer through React.
   */
  getGpuSkeletonizer(): GpuSkeletonizer | null {
    if (this.renderer === null) return null;
    if (this.gpuSkeletonizer === undefined) {
      this.gpuSkeletonizer = createGpuSkeletonizer(this.renderer);
    }
    return this.gpuSkeletonizer;
  }

  /** Dev-only (DebugPanel): GPU↔CPU repack parity check on the live renderer. */
  runGpuRepackSelfTest(): Promise<GpuRepackSelfTestResult> {
    if (this.renderer === null) {
      return Promise.reject(new Error("No renderer attached"));
    }
    return runGpuRepackSelfTest(this.renderer);
  }

  /** Dev-only (DebugPanel): GPU↔CPU skeleton-extraction parity check. */
  runGpuSkeletonSelfTest(): Promise<GpuSkeletonSelfTestResult> {
    if (this.renderer === null) {
      return Promise.reject(new Error("No renderer attached"));
    }
    return runGpuSkeletonSelfTest(this.renderer);
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
    // Any member resolves to this same pool, so the probe reads the shared
    // atlas regardless of which id it goes through.
    const anyMember = pool.members.values().next().value;
    if (anyMember === undefined) return [];
    return voxels.map((voxel) => ({
      voxel,
      values: Array.from({ length: pool.spec.channelCount }, (_, channel) =>
        this.sampleResident(anyMember, voxel, 0, channel),
      ),
    }));
  }

  /** Structured snapshot for the DebugPanel's copyable report. */
  /**
   * Bytes a LIVE pool's atlas was actually allocated at, or null if no such
   * pool exists yet.
   *
   * The planner needs this because `maxPlanBytes` is now derived from the
   * device budget divided by the pool count, so the tracker's view of that
   * count and the count in force when the atlas was allocated can differ —
   * close a layer and the next replan sizes a plan for a share the existing
   * atlas was never built for, which is exactly the "plan bigger than its pool"
   * eviction treadmill `poolBudget.ts` exists to prevent.
   *
   * This reports a STATIC allocation capacity, not streaming state. It must
   * never be fed back into planning as a trigger — that is P7, the residency
   * feedback loop that caused replan storms.
   */
  poolAtlasBytes(poolKey: string): number | null {
    return this.pools.get(poolKey)?.atlas.byteLength ?? null;
  }

  buildDebugReport(): Record<string, unknown> {
    let atlasBytesTotal = 0;
    for (const pool of this.pools.values()) atlasBytesTotal += pool.atlas.byteLength;
    return {
      stats: { ...this.stats, chunkCacheBytes: this.chunkCache.sizeBytes },
      /** Time-to-first-voxel decomposition for THIS scene open. The only
       * instrumentation that can see the cold open — perfMonitor only arms
       * once the scene is already up. See coldOpenTimeline. */
      coldOpen: coldOpenTimeline.buildReport(),
      /** Pools, NOT layers. Fewer pools than layers means sharing is working;
       * one pool per layer over the same image means the key is splitting on
       * something it should not (compare the `poolKey`s). */
      poolCount: this.pools.size,
      layerCount: this.layerToPoolKey.size,
      /** Summed atlas GPU bytes across pools. In lazy-mirror mode (the
       * default, roadmap R3) this IS the footprint; with
       * `orkestrator.atlasMirror = "on"` a JS-heap copy costs the same again. */
      atlasBytesTotal,
      timeToSharpRing: this.timeToSharpRing.map((ms) => Math.round(ms)),
      gpuRepack:
        this.gpuRepacker === undefined
          ? "not-attempted"
          : this.gpuRepacker === null
            ? "unavailable"
            : this.gpuRepacker.status(),
      pools: [...this.pools.values()].map((pool) => {
        const residentByLevel: Record<number, number> = {};
        for (const key of pool.pool.keys()) {
          const { level } = parseNodeKey(key);
          residentByLevel[level] = (residentByLevel[level] ?? 0) + 1;
        }
        return {
          poolKey: pool.poolKey,
          /** Every layer this pool backs. Four ids here = four layers sharing
           * one atlas (the one-layer-per-channel case). */
          members: [...pool.members],
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
            bytes: pool.atlas.byteLength,
          },
          pageTableSize: pool.pageTable.layout.size,
          slotsUsed: pool.pool.size,
          // Cache headroom actually achieved vs. intended. `chooseSlotGrid`
          // factorises the slot count and can round DOWN, so the target is a
          // goal, not a guarantee — read these two together before concluding
          // the budget maths is wrong.
          freeSlots: pool.atlas.capacity - pool.pool.size,
          headroomTarget: MIN_POOL_HEADROOM_SLOTS,
          residentByLevel,
          emptyBricks: pool.emptyValues.size,
          inFlight: pool.inFlight.size,
          uploadQueue: pool.queue.length,
          pendingFetch: pool.pendingFetch.length,
          protectedKeys: pool.protectedKeys.size,
          dataRange: [pool.minValue, pool.maxValue],
          occEncodeRange: [pool.occEncodeMin, pool.occEncodeMax],
          occObservedRange: pool.occObservedInitialized
            ? [pool.occObservedMin, pool.occObservedMax]
            : null,
          occHierarchy: pool.occHierarchy
            ? {
                measured: pool.measuredRanges.size,
                aggregatesComplete: pool.aggregateRanges.size,
              }
            : null,
          sliceSignature: pool.sliceSignature,
          // Why bricks did (not) take the GPU repack path — "ready" above only
          // means the pipeline compiled; per-brick `supports()` can still
          // reject every job (e.g. "cpu:unsupported:r8" for uint8 layers).
          gpuPath: pool.lastRepackPath,
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
    return this.poolFor(layerId);
  }

  /** The pool backing a layer. Layers sharing a content address share the pool,
   * so several ids can resolve to the same object — by design. */
  private poolFor(layerId: string): LayerBrickPool | null {
    const poolKey = this.layerToPoolKey.get(layerId);
    if (poolKey === undefined) return null;
    return this.pools.get(poolKey) ?? null;
  }

  snapshotResidency(): Record<string, ResidentBrickInfo[]> {
    const result: Record<string, ResidentBrickInfo[]> = {};
    // Still keyed by LAYER id (the overlay indexes by layer). Members of one
    // shared pool report the same residency because they literally have it.
    const byPool = new Map<string, ResidentBrickInfo[]>();
    for (const [poolKey, pool] of this.pools) {
      const entries: ResidentBrickInfo[] = [];
      for (const key of pool.pool.keys()) {
        const { level, coords } = parseNodeKey(key);
        entries.push({ level, coords, empty: false });
      }
      for (const key of pool.emptyValues.keys()) {
        const { level, coords } = parseNodeKey(key);
        entries.push({ level, coords, empty: true });
      }
      byPool.set(poolKey, entries);
    }
    for (const [layerId, poolKey] of this.layerToPoolKey) {
      const entries = byPool.get(poolKey);
      if (entries) result[layerId] = entries;
    }
    return result;
  }

  /**
   * Shared address resolution for the CPU-mirror reads: walk levels from
   * desiredLevel to coarsest, resolve the finest resident brick and return
   * either its (page-table-quantized) uniform value or the atlas backing
   * index of the voxel at channel slab 0 plus the per-slab index stride.
   * A brick whose slot was written by the GPU repack kernel has no CPU mirror
   * (reading it would return stale zeros, which is worse than not reading) and
   * resolves to `kind: "gpu"`: the caller reads the voxel from the DECODED
   * CHUNK CACHE instead (`sampleChunkCacheSync` — the "Phase D" probe), which
   * holds the CPU copy of exactly what the GPU repacked. Staleness is tracked
   * per brick (`gpuStaleKeys`), so CPU-uploaded bricks keep the fast mirror
   * read. Null only when nothing is resident at any level.
   */
  private resolveResidentRead(
    pool: LayerBrickPool,
    baseVoxel: Vec3,
    desiredLevel: number,
  ):
    | { kind: "empty"; level: number; value: number }
    | { kind: "slot"; level: number; index0: number; slabStride: number }
    | { kind: "gpu"; level: number }
    | null {
    const { geometry, spec, atlas } = pool;

    // Reused scratch, and a memoized key: this loop runs per LEVEL per MARCH
    // STEP (~256 steps a frame while hover probing), and used to allocate two
    // Vec3s and a fresh key string every time round. The values are consumed
    // synchronously below and never retained, and consecutive steps almost
    // always share a brick — see core/octree/nodeKeyMemo.ts.
    const levelVoxel = this.levelVoxelScratch;
    for (let level = Math.max(0, desiredLevel); level < geometry.levels.length; level++) {
      const { scale, spatialShape } = geometry.levels[level];
      levelVoxel[0] = Math.min(Math.max(baseVoxel[0] / scale[0], 0), spatialShape[0] - 1e-3);
      levelVoxel[1] = Math.min(Math.max(baseVoxel[1] / scale[1], 0), spatialShape[1] - 1e-3);
      levelVoxel[2] = Math.min(Math.max(baseVoxel[2] / scale[2], 0), spatialShape[2] - 1e-3);
      const brickX = Math.floor(levelVoxel[0] / spec.payload[0]);
      const brickY = Math.floor(levelVoxel[1] / spec.payload[1]);
      const brickZ = Math.floor(levelVoxel[2] / spec.payload[2]);
      const key = pool.nodeKeys.keyFor(level, brickX, brickY, brickZ);

      const emptyValue = pool.emptyValues.get(key);
      if (emptyValue !== undefined) {
        // The GPU only has the 8-bit page-table encoding of this value; mirror
        // the same encode→decode round-trip so the CPU march matches the
        // rendered image (OCTREE_RENDERER.md P11).
        return {
          kind: "empty",
          level,
          value: decodeEmptyValue(
            encodeEmptyValue(emptyValue, pool, pool.emptyBits),
            pool,
            pool.emptyBits,
          ),
        };
      }

      const slot = pool.pool.slotOf(key);
      if (!slot) continue;
      // Lazy-mirror mode (backing null — the default, roadmap R3): EVERY
      // resident brick reads through the decoded chunk cache, the path
      // GPU-repacked bricks have always used.
      if (pool.gpuStaleKeys.has(key) || !atlas.backing) return { kind: "gpu", level };

      const texel: Vec3 = [
        slot.coords[0] * atlas.slotSize[0] +
          spec.border +
          Math.floor(levelVoxel[0] - brickX * spec.payload[0]),
        slot.coords[1] * atlas.slotSize[1] +
          spec.border +
          Math.floor(levelVoxel[1] - brickY * spec.payload[1]),
        slot.coords[2] * atlas.slotSize[2] +
          spec.border +
          Math.floor(levelVoxel[2] - brickZ * spec.payload[2]),
      ];
      return {
        kind: "slot",
        level,
        index0: (texel[2] * atlas.size[1] + texel[1]) * atlas.size[0] + texel[0],
        slabStride: spec.stored[2] * atlas.size[1] * atlas.size[0],
      };
    }
    return null;
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
    const pool = this.poolFor(layerId);
    if (!pool) return null;
    const read = this.resolveResidentRead(pool, baseVoxel, desiredLevel);
    if (!read) return null;
    if (read.kind === "empty") return read.value;
    if (read.kind === "gpu") {
      return this.sampleChunkCacheSync(pool, read.level, baseVoxel, channel);
    }
    const clampedChannel = Math.min(Math.max(channel, 0), pool.spec.channelCount - 1);
    // kind "slot" implies a live backing (resolveResidentRead routes
    // mirror-less pools to "gpu"); the fallback is belt-and-braces.
    return pool.atlas.backing?.[read.index0 + clampedChannel * read.slabStride] ?? null;
  }

  /**
   * All-channel variant of `sampleResident` for the probe readout: one
   * address resolution, then one read per channel slab (phasor slabs are
   * excluded — they hold derived g/s/i values, not the layer's channels).
   * A uniform ("empty") brick replicates its single value across channels.
   */
  sampleResidentEx(
    layerId: string,
    baseVoxel: Vec3,
    desiredLevel: number,
  ): { values: number[]; level: number } | null {
    const pool = this.poolFor(layerId);
    if (!pool) return null;
    const read = this.resolveResidentRead(pool, baseVoxel, desiredLevel);
    if (!read) return null;
    const channelCount = Math.max(1, pool.geometry.channelSlabCount);
    if (read.kind === "empty") {
      return { values: Array<number>(channelCount).fill(read.value), level: read.level };
    }
    if (read.kind === "gpu") {
      const values = new Array<number>(channelCount);
      for (let channel = 0; channel < channelCount; channel++) {
        const value = this.sampleChunkCacheSync(pool, read.level, baseVoxel, channel);
        if (value === null) return null; // chunk evicted: whole readout pends
        values[channel] = value;
      }
      return { values, level: read.level };
    }
    const backing = pool.atlas.backing;
    if (!backing) return null; // unreachable for kind "slot"; belt-and-braces
    const values = new Array<number>(channelCount);
    for (let channel = 0; channel < channelCount; channel++) {
      values[channel] = backing[read.index0 + channel * read.slabStride];
    }
    return { values, level: read.level };
  }

  /**
   * The LEVEL the shader would sample at a base voxel — the finest resident
   * brick at or coarser than `desiredLevel` — without reading any value.
   * Null when nothing is resident at any level (the walk fell off the top).
   *
   * Deliberately NOT `sampleResidentEx(...)?.level`: that answers null when
   * the value is unavailable, which for a GPU-repacked brick (no CPU mirror,
   * chunk evicted from the decode cache) it routinely is — reporting "nothing
   * resident" for a brick that is on screen. The level is settled by the
   * page-table walk alone, so a level-only question must not be gated on a
   * value read. Consumer: `overlays/CenterLodReadout.tsx`.
   */
  residentLevelAt(layerId: string, baseVoxel: Vec3, desiredLevel: number): number | null {
    const pool = this.poolFor(layerId);
    if (!pool) return null;
    return this.resolveResidentRead(pool, baseVoxel, desiredLevel)?.level ?? null;
  }

  /**
   * "Phase D" probe read: a voxel value straight from the DECODED CHUNK
   * CACHE, synchronously. This is the CPU-side answer for GPU-repacked
   * bricks — their data never reaches the atlas CPU mirror, but the decoded
   * source chunks passed through `fetchChunkShared`'s byte-budget cache on
   * the way to the GPU kernel and usually still live there. Null when the
   * chunk was evicted or the store's chunk-key encoder is still resolving
   * (kicked off here; the next probe move finds it cached).
   */
  /**
   * Resolve a store's zarr chunk-key encoder for the SYNC chunk-cache probe.
   * `sampleChunkCacheSync` cannot await, so the encoder must be resolved ahead
   * of the first probe — `ensurePool` warms every level eagerly (the metadata
   * is already in `readArrayMetadataCached`'s cache from the brick fetches, so
   * this is a microtask, not a network read). Failure schedules a retry on the
   * next call and warns once per store.
   */
  private warmChunkKeyEncoder(
    storeId: string,
    arr: Parameters<typeof getChunkWorker>[0],
  ): void {
    if (this.chunkKeyEncoders.has(storeId)) return;
    this.chunkKeyEncoders.set(storeId, null); // resolving
    void readArrayMetadataCached(arr)
      .then((meta) => this.chunkKeyEncoders.set(storeId, meta.encodeChunkKey))
      .catch((error) => {
        this.chunkKeyEncoders.delete(storeId); // retry on the next probe
        if (!this.warnedEncoderStores.has(storeId)) {
          this.warnedEncoderStores.add(storeId);
          console.warn(`[bricks] chunk-key metadata read failed for store ${storeId}`, error);
        }
      });
  }

  private sampleChunkCacheSync(
    pool: LayerBrickPool,
    levelIndex: number,
    baseVoxel: Vec3,
    channel: number,
  ): number | null {
    const { geometry } = pool;
    const level = geometry.levels[levelIndex];
    const { xPos, yPos, zPos, intensityPos } = geometry.axes;

    // Allocation-free address math: this runs per march STEP on the hover
    // path (≤256×/frame), so plain locals instead of mapped arrays.
    const clampVoxel = (i: number) =>
      Math.min(
        Math.max(Math.floor(baseVoxel[i] / level.scale[i]), 0),
        level.spatialShape[i] - 1,
      );
    const vx = clampVoxel(0);
    const vy = clampVoxel(1);
    const vz = clampVoxel(2);
    const cx = Math.floor(vx / level.spatialChunks[0]);
    const cy = Math.floor(vy / level.spatialChunks[1]);
    const cz = Math.floor(vz / level.spatialChunks[2]);
    const ox = vx - cx * level.spatialChunks[0];
    const oy = vy - cy * level.spatialChunks[1];
    const oz = vz - cz * level.spatialChunks[2];
    const channelsPerChunk =
      intensityPos !== -1 ? Math.max(1, level.chunks[intensityPos] ?? 1) : 1;
    const channelChunk = intensityPos !== -1 ? Math.floor(channel / channelsPerChunk) : 0;

    // Same coords the brick fetch used — the cache key must match what was
    // fetched (collapsed dims via the pool's fixed chunk coords, like the
    // node fetch itself).
    const dims = geometry.dims;
    const coords = this.chunkCoordsScratch;
    coords.length = dims.length;
    for (let d = 0; d < dims.length; d++) {
      coords[d] =
        d === xPos
          ? cx
          : d === yPos
            ? cy
            : d === zPos
              ? cz
              : d === intensityPos
                ? channelChunk
                : pool.fixedChunkCoords[d];
    }

    let chunk: Chunk<DataType> | undefined;
    const memo = this.lastChunkRead;
    if (
      memo &&
      memo.storeId === level.storeId &&
      memo.coords.length === coords.length &&
      memo.coords.every((v, d) => v === coords[d])
    ) {
      chunk = memo.chunk; // hot path: no key build, no LRU touch
    } else {
      let arr: Parameters<typeof getChunkWorker>[0];
      try {
        arr = this.deps.viewerStore.getState().getArrayForStoreId(level.storeId);
      } catch {
        return null;
      }
      const encoder = this.chunkKeyEncoders.get(level.storeId);
      if (encoder === undefined) {
        // Fallback only — ensurePool warms every level's encoder eagerly, so
        // this fires just for pools created before the warm-up (or after a
        // metadata failure scheduled a retry).
        this.warmChunkKeyEncoder(level.storeId, arr);
        return null;
      }
      if (encoder === null) return null; // metadata still resolving
      chunk = this.chunkCache.get(createCacheKey(arr, encoder, coords));
      if (!chunk) return null;
      this.lastChunkRead = { storeId: level.storeId, coords: coords.slice(), chunk };
    }

    let index = 0;
    for (let d = 0; d < dims.length; d++) {
      const offset =
        d === xPos
          ? ox
          : d === yPos
            ? oy
            : d === zPos
              ? oz
              : d === intensityPos
                ? channel % channelsPerChunk
                : pool.fixedOffsets[d];
      index += offset * (chunk.stride[d] ?? 0);
    }
    const value = (chunk.data as ArrayLike<number | bigint>)[index];
    return value === undefined ? null : Number(value);
  }

  /**
   * Exact level-0 voxel read for the probe's async value upgrade: fetches the
   * decoded chunk(s) covering the voxel through `fetchChunkShared` (in-flight
   * dedup + byte-budget cache + worker decode) and reads every channel value
   * with the chunk's strides. Resolves null when the pool is gone or its
   * slice signature changed while awaiting (the caller re-guards on merge),
   * and for phasor layers — their slabs are derived at repack time and have
   * no per-voxel source value to read.
   */
  async fetchExactVoxel(
    layerId: string,
    baseVoxel: Vec3,
  ): Promise<{ values: number[]; sliceSignature: string } | null> {
    const pool = this.poolFor(layerId);
    if (!pool || hasPhasorSlabs(pool.geometry)) return null;
    const sliceSignature = pool.sliceSignature;
    const { geometry } = pool;
    const level = geometry.levels[0];
    const { xPos, yPos, zPos, intensityPos } = geometry.axes;
    const arr = this.deps.viewerStore.getState().getArrayForStoreId(level.storeId);

    const voxel = [0, 1, 2].map((i) =>
      Math.min(Math.max(Math.floor(baseVoxel[i]), 0), level.spatialShape[i] - 1),
    ) as unknown as Vec3;
    const spatialChunk = [0, 1, 2].map((i) =>
      Math.floor(voxel[i] / level.spatialChunks[i]),
    );
    const spatialOffset = [0, 1, 2].map(
      (i) => voxel[i] - spatialChunk[i] * level.spatialChunks[i],
    );

    const channelCount = Math.max(1, geometry.channelSlabCount);
    const channelsPerChunk =
      intensityPos !== -1 ? Math.max(1, level.chunks[intensityPos] ?? 1) : 1;

    // Group channels sharing a chunk into one fetch.
    const groups = new Map<number, number[]>();
    for (let channel = 0; channel < channelCount; channel++) {
      const chunk = intensityPos !== -1 ? Math.floor(channel / channelsPerChunk) : 0;
      const group = groups.get(chunk);
      if (group) group.push(channel);
      else groups.set(chunk, [channel]);
    }

    const values = new Array<number>(channelCount).fill(Number.NaN);
    await Promise.all(
      [...groups.entries()].map(async ([channelChunk, channels]) => {
        const chunkCoords = geometry.dims.map((_, d) => {
          if (d === xPos) return spatialChunk[0];
          if (d === yPos) return spatialChunk[1];
          if (d === zPos) return spatialChunk[2];
          if (d === intensityPos) return channelChunk;
          return pool.fixedChunkCoords[d];
        });
        // Interactive tier: a probe's exact-voxel read must not queue behind
        // streaming decodes (whose priorities scale with fetchGeneration).
        const chunk = await this.fetchChunkShared(
          arr,
          level.storeId,
          chunkCoords,
          INTERACTIVE_FETCH_PRIORITY,
        );
        for (const channel of channels) {
          const index = geometry.dims.reduce((acc, _, d) => {
            const offset =
              d === xPos
                ? spatialOffset[0]
                : d === yPos
                  ? spatialOffset[1]
                  : d === zPos
                    ? spatialOffset[2]
                    : d === intensityPos
                      ? channel % channelsPerChunk
                      : pool.fixedOffsets[d];
            return acc + offset * (chunk.stride[d] ?? 0);
          }, 0);
          values[channel] = Number(chunk.data[index]);
        }
      }),
    );

    if (this.disposed) return null;
    const current = this.poolFor(layerId);
    if (!current || current.sliceSignature !== sliceSignature) return null;
    return { values, sliceSignature };
  }

  /** New work may exist (plan change, fetch completion, GPU requeue): the next
   * `drainUploads` must run its full pass. */
  private wakeDrain(): void {
    this.drainNeeded = true;
  }

  /**
   * Streaming render-cadence gate (gap 1a): request a frame for freshly landed
   * residency work. While streaming and the camera is quiet, actual
   * `invalidate()`s are coalesced to the residencyBumpMs cadence — every
   * skipped one was a whole-scene re-raymarch that showed a single brick
   * batch — and the off-frame pump timer keeps `drainUploads` running between
   * frames so the UPLOAD pipeline never slows down (the invalidate used to do
   * both jobs). The drained edge and interacting frames bypass the gate
   * (`resolveStreamFrameAction`). The pump re-reads the interaction state at
   * fire time and re-enters this gate via the drain, so a burst that ends
   * mid-window still gets its trailing settled frame.
   */
  private scheduleStreamingFrame(interacting: boolean, streaming: boolean): void {
    const now = performance.now();
    const action = resolveStreamFrameAction({
      streaming,
      interacting,
      nowMs: now,
      lastInvalidateAtMs: this.lastStreamInvalidateAt,
      cadenceMs: qualityGovernor.getProfile().residencyBumpMs,
    });
    if (action === "invalidate") {
      this.lastStreamInvalidateAt = now;
      this.pendingStreamFrame = false;
      this.invalidate();
      return;
    }
    this.stats.streamFramesCoalesced += 1;
    this.pendingStreamFrame = true;
    if (this.drainPumpTimer !== null) return;
    this.drainPumpTimer = setTimeout(() => {
      this.drainPumpTimer = null;
      if (this.disposed) return;
      this.drainUploads(this.deps.isInteracting?.() ?? false);
      // The drain re-enters this gate itself when it uploaded or left work
      // queued. If it did neither (queue drained mid-window, fetches still in
      // flight) the coalesced batches still owe a frame — keep knocking until
      // the cadence window closes and the invalidate branch clears the flag.
      if (this.pendingStreamFrame && !this.disposed) {
        this.scheduleStreamingFrame(
          this.deps.isInteracting?.() ?? false,
          this.anyPipelineWork(),
        );
      }
    }, DRAIN_PUMP_MS);
  }

  /**
   * Three passes, because pools are shared across layers:
   *
   *  1. DERIVE — per layer, resolve geometry/spec/viability and its pool key.
   *     Nothing is created; layers that group onto one key are collected.
   *  2. MATERIALIZE — get-or-create one pool per distinct key (the byte budget
   *     divides by the DISTINCT POOL count, not the layer count), reconcile
   *     membership, dispose pools nobody claims.
   *  3. RECONCILE — once per pool, against the UNION of its members' plans.
   *
   * The union matters: members' plans are not identical (each layer has its own
   * view range and voxel→world transform), so reconciling per layer against one
   * shared pool would have each member clobber the previous one's protected set
   * and pending fetches. A union is a superset of every member plan, so no
   * member is ever starved of a brick it planned.
   */
  private reconcileAll(plans: Record<string, LayerNodePlan>): void {
    if (this.disposed) return;
    this.wakeDrain();
    // New plan generation: chunk tasks dispatched from here on outrank any
    // still-queued tasks of previous plans in the worker pool.
    this.fetchGeneration += 1;
    const layers = this.deps.sceneStore.getState().layers;

    // --- Pass 1: derive ---------------------------------------------------
    type Group = {
      derivation: PoolDerivation;
      layers: LayerState[];
      plans: LayerNodePlan[];
      /** Every member's own derivation, for the dev-only join assertion. */
      derivations: PoolDerivation[];
    };
    const groups = new Map<string, Group>();
    // O(1) lookups — `layers.find` per plan (and again per cached derivation
    // below) was O(plans × layers) per reconcile.
    const layerById = new Map(layers.map((l) => [l.id, l]));
    for (const [layerId, plan] of Object.entries(plans)) {
      const layer = layerById.get(layerId);
      if (!layer) continue;
      try {
        const derivation = this.derivePool(layer, plan);
        if (!derivation) continue;
        const group = groups.get(derivation.poolKey);
        if (group) {
          group.layers.push(layer);
          group.plans.push(plan);
          group.derivations.push(derivation);
        } else {
          groups.set(derivation.poolKey, {
            derivation,
            layers: [layer],
            plans: [plan],
            derivations: [derivation],
          });
        }
      } catch (error) {
        // Contain per-layer failures: one bad layer must not abort the rest.
        console.warn(`[bricks] derivation failed for ${layerId}`, error);
      }
    }

    // Derivation caches for layers that vanished entirely.
    for (const layerId of [...this.layerDerivationCache.keys()]) {
      if (!plans[layerId] || !layerById.has(layerId)) {
        this.layerDerivationCache.delete(layerId);
      }
    }
    // --- Pass 2: materialize ---------------------------------------------
    const planCount = Math.max(1, groups.size);
    const live = new Set<string>();
    for (const [poolKey, group] of groups) {
      try {
        const pool = this.ensurePool(group.derivation, group.layers, planCount);
        if (!pool) continue;
        live.add(pool.poolKey);
        pool.members = new Set(group.layers.map((l) => l.id));
        if (import.meta.env?.DEV) {
          for (const derivation of group.derivations) {
            this.assertFixedIndicesMatch(pool, derivation);
          }
        }
      } catch (error) {
        console.warn(`[bricks] pool creation failed for ${poolKey}`, error);
      }
    }

    // Pools nobody claims any more (layer removed, or its key moved and the
    // pool could not be flushed in place).
    for (const [poolKey, pool] of [...this.pools]) {
      if (live.has(poolKey)) continue;
      this.disposePool(pool);
      this.pools.delete(poolKey);
    }

    // Rebuild the layer→pool index from what actually exists, rather than
    // patching it per group: a layer whose pool failed to materialize (store
    // not open yet, unviable geometry) must resolve to null, not to whatever
    // pool it had last reconcile.
    this.layerToPoolKey.clear();
    for (const pool of this.pools.values()) {
      for (const layerId of pool.members) this.layerToPoolKey.set(layerId, pool.poolKey);
    }

    // --- Pass 3: reconcile each pool once --------------------------------
    for (const group of groups.values()) {
      const pool = this.pools.get(group.derivation.poolKey);
      if (!pool) continue;
      try {
        this.reconcilePool(pool, group.plans);
      } catch (error) {
        console.warn(`[bricks] reconcile failed for pool ${pool.poolKey}`, error);
      }
    }

    // Time-to-sharp: start the wall clock when a reconcile enqueues work
    // while the pipeline is idle (drainUploads stops it on the drained edge).
    if (this.streamStartedAt === null && this.anyPipelineWork()) {
      this.streamStartedAt = performance.now();
    }
  }

  /** Work anywhere in the pipeline? (Allocation-free — runs per drain frame.) */
  private anyPipelineWork(): boolean {
    for (const pool of this.pools.values()) {
      if (pool.queue.length > 0 || pool.inFlight.size > 0 || pool.pendingFetch.length > 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Dev-only invariant: a layer joining an existing pool must agree on the
   * collapsed non-spatial indices. The key does not carry them directly — it
   * carries `sliceSignature` plus each level's chunking, which are exactly the
   * inputs of `computeFixedIndices`, so agreement is implied. This turns that
   * inference into something that fails loudly if either side ever changes.
   */
  private assertFixedIndicesMatch(pool: LayerBrickPool, derivation: PoolDerivation): void {
    const { fixedChunkCoords, fixedOffsets } = this.computeFixedIndices(
      derivation.layer,
      derivation.geometry,
      derivation.levels as LevelSource[],
    );
    const same =
      fixedChunkCoords.length === pool.fixedChunkCoords.length &&
      fixedOffsets.length === pool.fixedOffsets.length &&
      fixedChunkCoords.every((v, i) => v === pool.fixedChunkCoords[i]) &&
      fixedOffsets.every((v, i) => v === pool.fixedOffsets[i]);
    if (!same) {
      console.error(
        `[bricks] pool key collision: layer ${derivation.layer.id} joined pool ` +
          `${pool.poolKey} but resolves different fixed indices ` +
          `(${JSON.stringify({ fixedChunkCoords, fixedOffsets })} vs ` +
          `${JSON.stringify({
            fixedChunkCoords: pool.fixedChunkCoords,
            fixedOffsets: pool.fixedOffsets,
          })}). The key is missing a field.`,
      );
    }
  }

  /** Reconcile one pool against the union of its members' plans. */
  private reconcilePool(pool: LayerBrickPool, plans: readonly LayerNodePlan[]): void {
    // UNION across members: a brick planned by any member must be fetched and
    // protected, because they all read the same atlas.
    const planKeys = new Set<string>();
    for (const plan of plans) {
      for (const node of plan.nodes) planKeys.add(node.key);
    }

    // Everything in the plan is protected; the coarsest level stays pinned so
    // the shader's fallback of last resort survives any eviction pressure.
    // `coarsestResident` is maintained incrementally at acquire/release — the
    // old per-replan walk parsed every resident key (O(pool) allocations,
    // ≤5×/s during a zoom).
    const protectedKeys = new Set(planKeys);
    for (const key of pool.coarsestResident) protectedKeys.add(key);
    pool.protectedKeys = protectedKeys;
    pool.pool.touch(planKeys);

    // CHUNK decodes of out-of-plan bricks are still never aborted — aborting
    // shared decodes used to refetch the same bricks over and over under plan
    // oscillation (observed 13× amplification), and a completed decode lands
    // in the shared cache so a flip-back is a cache hit. What IS released
    // eagerly is the brick-level CONCURRENCY slot: aborting the per-brick
    // controller makes fetchBrick's race resolve immediately, freeing its
    // inFlight slot for a newly planned brick instead of holding it until the
    // stale decodes (now at a lower generation priority) finally finish.
    // Already-repacked stale bricks still upload only on leftover budget into
    // FREE slots. Content is keyed by (level, coords) under an unchanged
    // sliceSignature, so a kept brick is never wrong — only possibly unneeded.
    // In-flight COARSEST bricks are exempt, mirroring the staleness
    // checkpoint: an in-flight coarsest brick is the shader's fallback of
    // last resort and must land regardless of plan churn.
    const coarsestLevel = pool.geometry.levels.length - 1;
    for (const [key, controller] of pool.inFlight) {
      if (!protectedKeys.has(key) && parseNodeKey(key).level !== coarsestLevel) {
        controller.abort();
      }
    }

    // Fetch every planned node that isn't resident yet, in band/score order
    // (see compareFetchOrder): rootLevel backdrop first, then on-screen nodes
    // by distance to the view focus with coarse-first ties, margin prefetch
    // last. Only the tier profile's maxInflightBricks run concurrently; the
    // rest wait in pendingFetch.
    // Reversed: startNextFetches pops from the tail.
    // Deduped by key across members — two layers planning the same brick must
    // enqueue one fetch, not two (the second would be dropped by the guards in
    // startNextFetches anyway, but only after occupying a queue slot).
    const seen = new Set<string>();
    const pending: PlannedNode[] = [];
    for (const plan of plans) {
      for (const node of plan.nodes) {
        if (seen.has(node.key)) continue;
        seen.add(node.key);
        if (
          pool.pool.has(node.key) ||
          pool.emptyValues.has(node.key) ||
          pool.inFlight.has(node.key) ||
          pool.queuedKeys.has(node.key)
        ) {
          continue;
        }
        pending.push(node);
      }
    }
    // fetchScore units are each member layer's base voxels, so cross-layer
    // ordering is approximate (already true of the per-plan emission index).
    pool.pendingFetch = pending.sort(compareFetchOrder).reverse();
    // Fresh plan → fresh retry allowance (see the fetchBrick catch).
    pool.fetchRetries.clear();

    // Reclaim headroom BEFORE dispatching, so this reconcile's fetches land in
    // free slots instead of evicting each other.
    this.trimUnreachableResidents(pool, plans);

    this.startNextFetches(pool);
  }

  /**
   * Release residents the shader provably cannot sample — bricks finer than
   * every member plan's target level (see `selectTrimCandidates`).
   *
   * Headroom-triggered, not unconditional: trimming costs a refetch if the plan
   * zooms back in, so it only fires once the pool's deliberate cache headroom
   * is actually gone. The 512 MB decoded-chunk cache means a flip-back is a
   * repack rather than a network round trip, which bounds the downside.
   */
  private trimUnreachableResidents(
    pool: LayerBrickPool,
    plans: readonly LayerNodePlan[],
  ): void {
    let minTargetLevel = Number.POSITIVE_INFINITY;
    for (const plan of plans) minTargetLevel = Math.min(minTargetLevel, plan.targetLevel);
    if (!Number.isFinite(minTargetLevel)) minTargetLevel = 0;
    // Also gates the stale drain (partitionUploadQueue), so it is recorded even
    // when no trimming is needed this pass.
    pool.minTargetLevel = minTargetLevel;
    if (minTargetLevel <= 0) return;

    const free = pool.pool.capacity - pool.pool.size;
    if (free >= MIN_POOL_HEADROOM_SLOTS) return;

    const victims = selectTrimCandidates({
      keys: pool.pool.keys(),
      protectedKeys: pool.protectedKeys,
      levelOf: (key) => parseNodeKey(key).level,
      minTargetLevel,
      needed: MIN_POOL_HEADROOM_SLOTS - free,
    });

    for (const key of victims) {
      const { level, coords } = parseNodeKey(key);
      pool.pool.release(key);
      setPageEntry(pool.pageTable, level, coords, null, PAGE_FLAG_UNMAPPED);
      pool.gpuStaleKeys.delete(key);
      pool.coarsestResident.delete(key);
      // Same bookkeeping as eviction: brickRanges is bounded by slot count
      // only if released keys leave it (measuredRanges deliberately stays).
      pool.brickRanges.delete(key);
      this.stats.trimmed += 1;
    }
    // The page writes land in the dirty region; drainUploads flushes every
    // pool's page table and reconcileAll has already called wakeDrain().
  }

  /** Concurrent brick fetches across ALL pools. The per-pool ceiling alone
   * made total decode pressure LINEAR in layer count (N pools × 16 in-flight
   * on HIGH) — the many-layers fetch-storm half of the linear-cost problem.
   * 2× one pool's allowance keeps cross-pool parallelism without the blowup. */
  private globalInFlightLimit(): number {
    return qualityGovernor.getProfile().maxInflightBricks * 2;
  }

  private totalInFlight(): number {
    let total = 0;
    for (const pool of this.pools.values()) total += pool.inFlight.size;
    return total;
  }

  private startNextFetches(pool: LayerBrickPool): void {
    const maxInflight = qualityGovernor.getProfile().maxInflightBricks;
    const globalLimit = this.globalInFlightLimit();
    let globalInFlight = this.totalInFlight();
    while (
      pool.inFlight.size < maxInflight &&
      globalInFlight < globalLimit &&
      pool.pendingFetch.length > 0 &&
      // Pre-attach there is no drain, so the queue only grows — hold it at the
      // in-flight ceiling until a renderer arrives to consume it.
      shouldDispatchFetch({
        detached: this.renderer === null,
        queuedBricks: pool.queue.length,
        cap: maxInflight,
      })
    ) {
      const node = pool.pendingFetch.pop()!;
      if (
        !pool.protectedKeys.has(node.key) ||
        pool.pool.has(node.key) ||
        pool.emptyValues.has(node.key) ||
        pool.inFlight.has(node.key) ||
        pool.queuedKeys.has(node.key)
      ) {
        continue;
      }
      globalInFlight += 1;
      coldOpenTimeline.stamp("firstBrickRequested");
      void this.fetchBrick(pool, node);
    }
  }

  /** Kick every pool with pending work — needed once the GLOBAL in-flight cap
   * exists: a completed fetch in pool A frees a global slot that pool B may be
   * waiting on, but A's own `startNextFetches` cannot hand it over. Called
   * from the fetch `finally`; cheap (pools are few, empty queues no-op). */
  private startNextFetchesAll(): void {
    if (this.disposed) return;
    for (const pool of this.pools.values()) {
      if (pool.pendingFetch.length > 0) this.startNextFetches(pool);
    }
  }

  /**
   * Everything needed to key and build a pool for one layer, with no side
   * effects beyond the derivation cache. Returns null when the layer cannot
   * back a pool (store not resolvable yet, no usable geometry, or unviable).
   */
  private derivePool(layer: LayerState, plan: LayerNodePlan): PoolDerivation | null {
    const viewerState = this.deps.viewerStore.getState();

    let levels: LevelSource[];
    let geometry: LayerLevelGeometry;
    let spec: BrickSpec;
    let structureSignature: string;
    let viability: ReturnType<typeof assessPoolViability>;

    const dataset = layer.lens.dataset;
    const cached = this.layerDerivationCache.get(layer.id);
    if (
      cached &&
      cached.layer === layer &&
      cached.dataArrays === dataset.dataArrays &&
      cached.mode === plan.mode
    ) {
      ({ levels, geometry, spec, structureSignature, viability } = cached);
    } else {
      try {
        levels = buildLevelSources(
          dataset.dataArrays,
          dataset.axisNames.length,
          viewerState.getArrayForStoreId,
        );
      } catch {
        return null;
      }

      const built = buildLayerLevelGeometry(dataset.axisNames, layer, levels);
      if (!built) return null;
      geometry = built;
      spec = resolveBrickSpec(geometry, plan.mode);
      viability = assessPoolViability(geometry, spec);
      structureSignature = buildStructureSignature({
        mode: plan.mode,
        spec,
        geometry,
        levels,
      });
      this.layerDerivationCache.set(layer.id, {
        layer,
        dataArrays: dataset.dataArrays,
        mode: plan.mode,
        levels,
        geometry,
        spec,
        structureSignature,
        viability,
      });
    }

    // Hard stop (defense in depth — nodePlanTracker refuses such layers before
    // any plan exists): the coarsest-grid slot floor below OVERRIDES the byte
    // budget by design (P16), so a no-pyramid layer would otherwise attempt a
    // multi-GB atlas allocation here (an uncaught RangeError that also aborts
    // reconciliation of the remaining layers). See P18.
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

    const dtype = geometry.levels[0].dtype;
    const dataRange = resolveLayerDataRange(layer, dtype);
    const valueSemantics = poolValueSemantics(layer);
    return {
      layer,
      mode: plan.mode,
      levels,
      geometry,
      spec,
      structureSignature,
      sliceSignature: plan.sliceSignature,
      dataRange,
      valueSemantics,
      poolKey: buildPoolKey({
        mode: plan.mode,
        spec,
        geometry,
        levels,
        sliceSignature: plan.sliceSignature,
        dataRange,
        valueSemantics,
      }),
    };
  }

  /**
   * Get-or-create the pool for one derivation group.
   *
   * `planCount` is the number of DISTINCT POOLS, not layers — it divides the
   * volume-texture budget, and `nodePlanTracker` must count the same way or
   * plans will request more slots than the atlas holds.
   */
  private ensurePool(
    derivation: PoolDerivation,
    members: readonly LayerState[],
    planCount: number,
  ): LayerBrickPool | null {
    const viewerState = this.deps.viewerStore.getState();
    const { levels, geometry, spec, structureSignature, poolKey } = derivation;
    const layer = derivation.layer;

    const existing = this.pools.get(poolKey);
    if (existing) return existing;

    // The key moved but the STRUCTURE did not — a slice change (dim slider, new
    // lens slice) or a value-range change. Reuse the allocation: flushing costs
    // a refetch, reallocating costs a refetch AND a fresh multi-hundred-MB
    // atlas. Only valid when the whole membership moves together; a partial
    // move means some layers still need the old contents, so that pool stays
    // and this group gets a new one.
    const movable = [...this.pools.values()].find(
      (pool) =>
        pool.structureSignature === structureSignature &&
        pool.members.size === members.length &&
        members.every((m) => pool.members.has(m.id)),
    );
    if (movable) {
      this.pools.delete(movable.poolKey);
      this.prefetchedSlabMarker.delete(movable.poolKey);
      if (movable.sliceSignature !== derivation.sliceSignature) {
        this.flushPool(movable, derivation.sliceSignature, layer, levels as LevelSource[]);
      }
      if (
        movable.minValue !== derivation.dataRange[0] ||
        movable.maxValue !== derivation.dataRange[1]
      ) {
        // EMPTY page entries quantize against the pool range, so a range move
        // invalidates every one of them (see reencodeEmptyEntries).
        movable.minValue = derivation.dataRange[0];
        movable.maxValue = derivation.dataRange[1];
        movable.autoRangeEncodeDirty = true;
        // A range move also re-derives everything the fresh-pool branch
        // derives from the range: the auto-range policy (a server histogram
        // landing late is exactly this path — autoRange must turn OFF), and
        // the occupancy encode/observed state, which must restart from the
        // NEW pool range (flushPool above reset it against the OLD one —
        // ordering matters). Encode ≡ decode stays intact because the
        // decode uniforms ride the poolsVersion bump below.
        movable.autoRange =
          derivation.valueSemantics === "intensity" &&
          (geometry.levels[0].dtype === "float32" ||
            geometry.levels[0].dtype === "float64") &&
          serverHistogramRange(layer) === null;
        movable.autoRangeInitialized = false;
        movable.occObservedInitialized = false;
        movable.occEncodeMin = movable.minValue;
        movable.occEncodeMax = movable.maxValue;
        movable.occReencodePending = false;
        this.wakeDrain();
      }
      // Re-capture the pool-creation-time flags: a toggle followed by a
      // slice/range change would otherwise pin this pool on the old policy
      // for its whole life.
      movable.occObservedRange =
        derivation.valueSemantics === "intensity" && isOccObservedRangeEnabled();
      movable.occHierarchy = isOccHierarchyEnabled();
      movable.poolKey = poolKey;
      this.pools.set(poolKey, movable);
      // The decode uniforms (minValue/maxValue, uEmptyDecode*, uOccDecode*)
      // ride poolsVersion — without this bump a moved range left EMPTY
      // bricks decoding at wrong intensities indefinitely.
      this.deps.viewerStore.getState().bumpPoolsVersion();
      this.invalidate();
      return movable;
    }

    const layout = buildPageTableLayout(geometry, spec.payload, PAGE_TEXTURE_MAX_EXTENT);
    if (!layout) return null;

    // Shared with the planner's byte accounting (see atlasKindForGeometry):
    // the two MUST agree on bytes-per-slot or plans request more slots than
    // the pool holds. `resolvePoolBudget` is the shared call that also reserves
    // the cache headroom the plan is not allowed to spend — without it a plan
    // that maxes the budget leaves zero free slots and the pool thrashes.
    const atlasKind = atlasKindForGeometry(geometry);
    const bytesPerVoxel = atlasBytesPerVoxel(atlasKind);
    const slotBytes = brickSlotBytes(spec, bytesPerVoxel);
    const maxUsefulSlotsForBudget = totalBrickCount(geometry, spec);
    const deviceBudgetBytes = getInitialVolumeTextureBudgetBytes();
    const { atlasBytes } = resolvePoolBudget({
      deviceBudgetBytes,
      poolCount: planCount,
      slotBytes,
      totalBrickBytes: maxUsefulSlotsForBudget * slotBytes,
    });
    const coarsestGrid = brickGridForLevel(geometry, spec, geometry.levels.length - 1);
    // `PAGE_TEXTURE_MAX_EXTENT` is 2048 and 2048 is also the WebGPU spec
    // MINIMUM for `maxTextureDimension3D`, so the detached fallback below is
    // not a guess — it is the same number the min would have produced anyway.
    const maxTextureExtent = Math.min(
      PAGE_TEXTURE_MAX_EXTENT,
      this.renderer === null ? PAGE_TEXTURE_MAX_EXTENT : getMax3DTextureSize(this.renderer),
    );
    // The pool can never need more slots than the pyramid has bricks — cap
    // there so small datasets get small atlases (the budget share only binds
    // for genuinely large pyramids).
    const maxUsefulSlots = totalBrickCount(geometry, spec);
    const minSlots = Math.min(
      maxUsefulSlots,
      coarsestGrid[0] * coarsestGrid[1] * coarsestGrid[2] + MIN_POOL_HEADROOM_SLOTS,
    );
    // Creation-order overshoot guard: shares divide by the CURRENT pool count
    // and existing atlases are never resized, so pools created when few
    // existed keep their large allocations and the SUM across pools could
    // exceed the device budget as layers open (each atlas also exists twice —
    // VRAM + its CPU backing — so overshoot hurts double on unified memory).
    // Cap this pool's allocation to what the device budget has LEFT, never
    // below the coarsest floor (the shader's fallback invariant, P18 —
    // `assessPoolViability` already vetted the floor itself as affordable).
    let allocatedAtlasBytes = 0;
    for (const pool of this.pools.values()) {
      allocatedAtlasBytes += pool.atlas.byteLength;
    }
    const remainingBudgetBytes = Math.max(0, deviceBudgetBytes - allocatedAtlasBytes);
    const cappedAtlasBytes = Math.min(
      atlasBytes,
      Math.max(remainingBudgetBytes, minSlots * slotBytes),
    );
    const desiredSlots = Math.min(
      maxUsefulSlots,
      Math.max(minSlots, Math.floor(cappedAtlasBytes / slotBytes)),
    );

    // Called for its side effect only — build the repacker now, while we are
    // already off the hot path. Its RESULT must not decide the atlas usage
    // flags (see `computeStorage` below).
    this.ensureGpuRepacker();
    const atlas = createBrickAtlas({
      spec,
      dtype: geometry.levels[0].dtype,
      kind: atlasKind,
      desiredSlots,
      // The P16 floor travels with the request so the grid factorization can
      // tell "under budget" from "cannot hold the coarsest level".
      minSlots,
      maxExtent: maxTextureExtent,
      filter: spec.border > 0 ? "linear" : "nearest",
      // A phasor layer never repacks on the GPU (the kernel cannot reduce), so
      // it has no use for the storage-binding usage flag either.
      // MUST NOT be `gpuRepacker !== null`: a pool created before the
      // renderer attaches would see null and allocate an atlas WITHOUT the
      // storage binding — permanently, silently disabling GPU repack for this
      // pool's whole life. Decide from the flag + geometry, which do not
      // depend on whether the device exists yet. (OCTREE_RENDERER.md P23.)
      computeStorage: isGpuRepackEnabled() && !hasPhasorSlabs(geometry),
    });
    const pageTable = createPageTableTexture(layout);

    // Create the backend GPUTexture now, for EVERY pool (it used to be
    // compute-repack pools only): compute dispatches must not race the first
    // draw's lazy texture creation, and in lazy-mirror mode (backing null —
    // roadmap R3) `uploadTexSubImage3D`'s needsUpdate fallback has no CPU
    // data to re-spec from, so `writeTexture` must always find the texture
    // already created. WebGPU textures are zero-initialized by spec, so the
    // eager creation costs no upload.
    // No-op while detached; `attachRenderer` re-runs it for every pool that
    // was created before the device existed.
    (
      this.renderer as unknown as { initTexture?: (texture: unknown) => void } | null
    )?.initTexture?.(atlas.texture);

    const { fixedChunkCoords, fixedOffsets } = this.computeFixedIndices(
      layer,
      geometry,
      levels as LevelSource[],
    );

    const dtype = geometry.levels[0].dtype;
    const [minValue, maxValue] = derivation.dataRange;
    // Float layers without a server histogram normalize against the `[0,1]`
    // dtype fallback, which whites-out any data valued >1. Accumulate the real
    // range from decoded bricks instead (see `accumulateAutoRange`).
    //
    // Not a pool-key field: it is implied by dtype (keyed) plus "the range fell
    // back to the dtype's" (keyed as dataRange), so members always agree — see
    // the poolKey module doc.
    // NEVER for a label pool, whatever its dtype. A float32-stored mask would
    // otherwise mutate `minValue`/`maxValue` at runtime as bricks land — and the
    // EMPTY encoding quantizes against exactly that range, so every already-
    // written uniform brick would start decoding to a different id. The label
    // range is a fixed `[0, LABEL_ID_CEILING]` for that reason.
    const autoRange =
      derivation.valueSemantics === "intensity" &&
      (dtype === "float32" || dtype === "float64") &&
      serverHistogramRange(layer) === null;

    const pool: LayerBrickPool = {
      poolKey,
      // Ids must survive the page table EXACTLY (a mask is mostly uniform
      // bricks); an intensity is about to be normalized anyway. See
      // `EmptyValueBits`.
      emptyBits: derivation.valueSemantics === "labelIds" ? 24 : 8,
      members: new Set(members.map((m) => m.id)),
      mode: derivation.mode,
      sliceSignature: derivation.sliceSignature,
      structureSignature,
      geometry,
      spec,
      atlas,
      pageTable,
      pool: new BrickPoolState(atlas.slotGrid),
      protectedKeys: new Set(),
      coarsestResident: new Set(),
      inFlight: new Map(),
      pendingFetch: [],
      fetchRetries: new Map(),
      queue: [],
      queuedKeys: new Set(),
      emptyValues: new Map(),
      brickRanges: new Map(),
      fixedChunkCoords,
      fixedOffsets,
      minValue,
      maxValue,
      autoRange,
      autoRangeEncodeDirty: false,
      autoRangeInitialized: false,
      // Occupancy encode range starts at the pool range (legacy behavior)
      // and, when the flag is on, tightens to the observed union as bricks
      // land. NEVER for label pools: their occupancy is id-space where
      // "range" has no windowing meaning, exactly like autoRange.
      occObservedRange:
        derivation.valueSemantics === "intensity" && isOccObservedRangeEnabled(),
      occObservedMin: 0,
      occObservedMax: 0,
      occObservedInitialized: false,
      occEncodeMin: minValue,
      occEncodeMax: maxValue,
      occReencodePending: false,
      occHierarchy: isOccHierarchyEnabled(),
      measuredRanges: new Map(),
      aggregateRanges: new Map(),
      // (aggregate sidecar is allocated below only when the flag is on)
      gpuStaleKeys: new Set(),
      minTargetLevel: 0,
      lastRepackPath: null,
      nodeKeys: createNodeKeyMemo(geometry.levels.length),
    };
    if (pool.occHierarchy) ensureAggregate(pool.pageTable);
    this.pools.set(poolKey, pool);
    // Warm the sync-probe chunk-key encoders for every level now — the debug
    // report's channel-slab probe runs synchronously and cannot await the
    // metadata (see warmChunkKeyEncoder).
    for (const level of geometry.levels) {
      try {
        this.warmChunkKeyEncoder(level.storeId, viewerState.getArrayForStoreId(level.storeId));
      } catch {
        // Store not resolvable yet — the sampleChunkCacheSync fallback retries.
      }
    }
    // Pool LIFECYCLE event (not streaming progress): this is what layer
    // components re-render on — see viewerStore.poolsVersion.
    this.deps.viewerStore.getState().bumpPoolsVersion();
    coldOpenTimeline.stamp("poolCreated");
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
    if (existing) {
      // NEVER hand out a DOOMED entry: a brick abort fires the per-chunk
      // controller synchronously and then synchronously starts replacement
      // fetches (finally → startNextFetches), all BEFORE the cancelled
      // promise's own async cleanup has removed it from this map. A new
      // subscriber to that promise inherits the rejection and its brick
      // stays unloaded until the next replan — the "sometimes doesn't load /
      // loads seconds later" regression. An aborted entry is cleared here
      // and the fetch re-issued fresh.
      const existingAbort = this.inFlightChunkAborts.get(key);
      if (!existingAbort || !existingAbort.signal.aborted) return existing;
      this.inFlightChunks.delete(key);
      this.inFlightChunkAborts.delete(key);
    }

    // Per-chunk abort on top of the dispose-scoped one: fired only when the
    // LAST referring brick releases this chunk (fetchBrick's finally). The
    // worker runner's abort path cancels the task if still queued; a started
    // task ignores the cancellation and its decode lands in the cache.
    const chunkAbort = new AbortController();
    this.inFlightChunkAborts.set(key, chunkAbort);
    const promise = getChunkWorker(arr, chunkCoords, {
      pool: workerPool,
      priority,
      signal: AbortSignal.any([this.fetchAbort.signal, chunkAbort.signal]),
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
        // Identity-guarded: a doomed entry may already have been REPLACED by
        // a fresh fetch (the branch above). Unconditional deletes here tore
        // down the replacement's dedup + cancellation entries.
        if (this.inFlightChunks.get(key) === promise) {
          this.inFlightChunks.delete(key);
          this.inFlightChunkAborts.delete(key);
        }
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
    // Generation priority: this plan's decodes outrank stranded queued tasks
    // of earlier plans in the worker pool (see fetchGeneration).
    const fetchPriority = this.fetchGeneration;
    /** Chunk keys this brick registered as a referrer for (released in finally). */
    const acquiredChunkKeys: string[] = [];
    /** Unique per INVOCATION — see fetchOwnerSeq: the same brick key can have
     * two overlapping fetches during a plan flip, and the old one's release
     * must never strip the new one's reference. */
    const ownerToken = `${node.key}#${++this.fetchOwnerSeq}`;
    /** Set by the catch when a still-planned brick's fetch failed and has
     * retry budget left; consumed in the finally (after inFlight clears). */
    let retryNode = false;

    try {
      const level = pool.geometry.levels[node.level];
      const arr = this.deps.viewerStore.getState().getArrayForStoreId(level.storeId);

      const chunkSpecs = this.enumerateBrickChunkCoords(pool, node.level, node.coords);
      for (const { chunkCoords } of chunkSpecs) {
        const chunkKey = `${level.storeId}:${chunkCoords.join(",")}`;
        acquiredChunkKeys.push(chunkKey);
        this.chunkRefs.acquire(chunkKey, ownerToken);
      }

      const fetches: Promise<GpuQueuedChunk>[] = chunkSpecs.map(
        ({ spatial, channelChunk, phasorChunk, chunkCoords }) =>
        this.fetchChunkShared(arr, level.storeId, chunkCoords, fetchPriority).then((chunk) => ({
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
      // Race the chunk await against the per-brick abort: a replan that drops
      // this brick (reconcileLayer aborts its controller) releases the
      // inFlight concurrency slot IMMEDIATELY — the shared chunk decodes
      // themselves keep running in the background and land in the cache.
      const allChunks = Promise.all(fetches);
      allChunks.catch(() => {}); // may settle after being abandoned below
      const chunks = await Promise.race([
        allChunks,
        new Promise<null>((resolve) => {
          if (controller.signal.aborted) resolve(null);
          else controller.signal.addEventListener("abort", () => resolve(null), { once: true });
        }),
      ]);
      if (chunks === null) {
        this.stats.staleFetches += 1;
        return; // finally: inFlight release + startNextFetches
      }
      if (controller.signal.aborted || this.disposed) return;

      this.stats.chunkRequests += fetches.length;
      this.stats.fetchMs += performance.now() - fetchStartedAt;

      // Staleness checkpoint: the plan moved on while fetching (2D pan — the
      // node set turns over as bricks scroll). The decoded chunks stay in the
      // shared cache, so a flip-back refetches at cache-hit cost plus one
      // repack; spending a repack worker + queue slot on an out-of-plan brick
      // here would delay newly visible bricks instead. Coarsest-level bricks
      // are exempt — protectedKeys only pins coarsest bricks already RESIDENT,
      // and an in-flight one is the shader's fallback of last resort.
      if (
        node.level !== pool.geometry.levels.length - 1 &&
        !pool.protectedKeys.has(node.key)
      ) {
        this.stats.staleFetches += 1;
        return; // finally: inFlight release + startNextFetches
      }

      const stored = pool.spec.stored;
      const elementCount = stored[0] * stored[1] * stored[2] * pool.spec.channelCount;

      let pending: PendingBrick;
      const gpuRepacker = this.ensureGpuRepacker();
      // The GPU repack kernel is a strided COPY — it cannot reduce a phasor
      // axis. A layer with a phasor node therefore always takes the CPU worker
      // path (a follow-up can teach the compute kernel the DFT).
      const reducesPhasor = hasPhasorSlabs(pool.geometry);
      const useGpu =
        !reducesPhasor && !!gpuRepacker?.ready() && gpuRepacker.supports(pool.atlas, chunks);
      pool.lastRepackPath = useGpu
        ? "gpu"
        : reducesPhasor
          ? "cpu:phasor"
          : this.renderer === null
            ? // Pre-attach bricks legitimately take the CPU path; keep it
              // distinguishable from a genuinely unavailable repacker so the
              // debug report cannot be misread as the `computeStorage` trap.
              "cpu:no-renderer"
            : gpuRepacker === null
              ? "cpu:no-repacker"
              : !gpuRepacker.ready()
                ? `cpu:${gpuRepacker.status()}`
                : `cpu:unsupported:${pool.atlas.kind}`;
      if (useGpu) {
        // GPU path: the repack IS the upload (a compute dispatch straight
        // into the atlas slot at drain time) — only chunk handles queue here.
        pending = {
          key: node.key,
          level: node.level,
          coords: node.coords,
          data: null,
          uniformValue: null,
          range: null,
          bytes: elementCount * atlasBytesPerVoxel(pool.atlas.kind),
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
        this.accumulateAutoRange(pool, result.min, result.max);
        pending = {
          key: node.key,
          level: node.level,
          coords: node.coords,
          data: result.data,
          uniformValue: result.uniformValue,
          range: [result.min, result.max],
          bytes: result.data.byteLength,
          gpu: null,
        };
      }
      this.stats.bricksFetched += 1;
      coldOpenTimeline.stamp("firstBrickDecoded");

      this.wakeDrain();
      pool.queue.push(pending);
      pool.queuedKeys.add(node.key);
      // Gated (gap 1a): a fetch completes up to maxInflight×pools times per
      // second — each used to force a full-scene frame just to run the drain;
      // the gate pumps the drain off-frame and renders at the bump cadence.
      this.scheduleStreamingFrame(this.deps.isInteracting?.() ?? false, true);
    } catch (error) {
      if (!controller.signal.aborted) {
        this.stats.fetchErrors += 1;
        console.warn(`[bricks] fetch failed for pool ${pool.poolKey} ${node.key}`, error);
        // Bounded self-heal: a failed fetch of a STILL-PLANNED brick used to
        // wait for the next replan (a camera move) to retry — on an idle
        // camera that is a visible hole for seconds. Two retries per plan,
        // reset each reconcile; the actual requeue happens in the finally
        // below, after our own inFlight entry is gone.
        if (!this.disposed && pool.protectedKeys.has(node.key)) {
          const retries = pool.fetchRetries.get(node.key) ?? 0;
          if (retries < 2) {
            pool.fetchRetries.set(node.key, retries + 1);
            retryNode = true;
          }
        }
      }
    } finally {
      // Dead-queue cancellation: this brick no longer needs its chunks. Any
      // chunk whose LAST referrer just left gets its per-chunk abort fired —
      // a still-QUEUED decode is cancelled outright (the wasted work this
      // exists to reclaim); a started one ignores it and finishes into the
      // cache, so flip-backs stay cheap (never abort shared in-progress
      // decodes — that was the 13× amplification bug). Happy-path releases
      // are no-ops: the chunk promise already settled and cleared its entry.
      for (const chunkKey of acquiredChunkKeys) {
        if (this.chunkRefs.release(chunkKey, ownerToken)) {
          const chunkAbort = this.inFlightChunkAborts.get(chunkKey);
          if (chunkAbort) {
            chunkAbort.abort();
            this.stats.cancelledDecodes += 1;
          }
        }
      }
      pool.inFlight.delete(node.key);
      if (
        retryNode &&
        !this.disposed &&
        !pool.inFlight.has(node.key) &&
        !pool.queuedKeys.has(node.key) &&
        !pool.pendingFetch.some((pendingNode) => pendingNode.key === node.key)
      ) {
        pool.pendingFetch.push(node); // tail = dispatched next
      }
      // ALL pools, not just this one: the freed global in-flight slot may be
      // what another pool's queue is blocked on (see startNextFetchesAll).
      if (!this.disposed) this.startNextFetchesAll();
    }
  }

  /**
   * Upload/map one queued brick. `planned` decides eviction rights (planned
   * bricks may evict unprotected occupants; stale ones take FREE slots only)
   * and the failure counter; `progress` accumulates the frame budget.
   * Returns "defer" when a PLANNED brick found every slot protected and
   * should stay queued for the next drain (slots free up via replans and
   * evictions) — the caller keeps it in the queue instead of dropping it
   * into a refetch loop.
   */
  private drainEntry(
    pool: LayerBrickPool,
    pending: PendingBrick,
    planned: boolean,
    progress: { bytes: number; bricks: number; uploadedAny: boolean },
  ): "done" | "defer" {
    if (pending.uniformValue !== null) {
      // Encode the uniform value 8-bit-quantized in R (see brickTraversal).
      // Mapped even when the plan moved on: EMPTY costs no slot and is
      // valid fallback data.
      const texel = encodeEmptyTexel(pending.uniformValue, pool, pool.emptyBits);
      setPageEntry(pool.pageTable, pending.level, pending.coords, texel, PAGE_FLAG_EMPTY);
      pool.emptyValues.set(pending.key, pending.uniformValue);
      // Uniform values fold into the occupancy OBSERVED range too — Phase D
      // aggregates union them, and an out-of-range uniform would otherwise
      // clamp its aggregate to the "unbounded" sentinel (lost discrimination
      // on mostly-uniform volumes).
      this.accumulateOccRange(pool, pending.uniformValue, pending.uniformValue);
      this.recordMeasuredRange(
        pool,
        pending.key,
        pending.level,
        pending.coords,
        pending.uniformValue,
        pending.uniformValue,
      );
      this.stats.emptyBricks += 1;
      progress.uploadedAny = true;
      return "done";
    }

    const acquired = pool.pool.acquire(
      pending.key,
      planned ? pool.protectedKeys : FREE_SLOTS_ONLY,
    );
    if (!acquired) {
      if (planned && (pending.acquireRetries ?? 0) < MAX_ACQUIRE_RETRIES) {
        pending.acquireRetries = (pending.acquireRetries ?? 0) + 1;
        return "defer";
      }
      if (planned) this.stats.acquireFailures += 1;
      else this.stats.planDrops += 1;
      // Dropped without upload: the repacked payload is dead — recycle it.
      if (pending.data) this.deps.repack.release(pending.data);
      return "done";
    }

    if (acquired.evictedKey) {
      const evicted = parseNodeKey(acquired.evictedKey);
      setPageEntry(pool.pageTable, evicted.level, evicted.coords, null, PAGE_FLAG_UNMAPPED);
      pool.gpuStaleKeys.delete(acquired.evictedKey);
      pool.coarsestResident.delete(acquired.evictedKey);
      pool.brickRanges.delete(acquired.evictedKey);
      this.stats.evictions += 1;
    }
    if (pending.level === pool.geometry.levels.length - 1) {
      pool.coarsestResident.add(pending.key);
    }

    // What this brick actually costs the frame. CPU path: the atlas-slot
    // payload the writeTexture below uploads. GPU path: `flush()` must
    // writeBuffer every source chunk not already in the GPU chunk cache
    // (a plane chunk can be ~14 MB — far more than the slot bytes), and the
    // flush itself has no wall-clock gate, so the budget has to charge those
    // bytes HERE, at dispatch time. That bounds the flush's synchronous work
    // to the frame budget: one cold plane-chunk brick fills the byte budget
    // for the frame, while cache-hit bricks stay nearly free.
    const frameCostBytes = pending.gpu
      ? gpuFlushUploadBytes(
          pending.gpu.chunks.map((chunk) => ({
            cacheKey: chunk.cacheKey,
            byteLength: chunk.data.byteLength,
          })),
          (cacheKey) => this.gpuRepacker?.hasChunk(cacheKey) ?? false,
        )
      : pending.bytes;

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
        token: { poolKey: pool.poolKey, key: pending.key, slotIndex: acquired.slot.index },
      });
      this.stats.gpuBricks += 1;
      pool.gpuStaleKeys.add(pending.key);
    } else {
      writeBrickToAtlas(this.renderer!, pool.atlas, acquired.slot.coords, pending.data!);
      pool.gpuStaleKeys.add(pending.key);
      if (pool.atlas.backing) {
        // Legacy eager-mirror mode only (orkestrator.atlasMirror = "on"): the
        // backing copy is deferred to idle time (it used to eat a sizable
        // share of the drain's wall budget); until it lands the key reads
        // through the chunk-cache path, exactly like a GPU-repacked one.
        // LAZY mode (the default, roadmap R3) has no backing at all — the key
        // stays in gpuStaleKeys for good and probes always read the decoded
        // chunk cache, halving the atlas' real memory footprint.
        this.mirrorQueue.push({
          pool,
          key: pending.key,
          slotIndex: acquired.slot.index,
          slotCoords: acquired.slot.coords,
          data: pending.data!,
        });
        this.scheduleMirrorDrain();
      } else if (pending.data) {
        // No mirror will consume the payload — recycle it now (the mirror
        // drain used to be the release point for CPU-path bricks).
        this.deps.repack.release(pending.data);
      }
    }
    // Occupancy sidecar: the brick's conservative min/max bracket (skip
    // predicate for the raymarcher). GPU-path bricks have no range yet —
    // the default texel means "unknown, never skip" until the readback
    // continuation writes the real one (applyGpuOutcome). While a range
    // promotion is in flight (occReencodePending) new texels stay "unknown"
    // too: the shader's decode uniforms may not yet hold the new encode
    // range, and the re-encode pass writes the real texel from brickRanges.
    if (pending.range) {
      pool.brickRanges.set(pending.key, pending.range);
      this.accumulateOccRange(pool, pending.range[0], pending.range[1]);
      this.recordMeasuredRange(
        pool,
        pending.key,
        pending.level,
        pending.coords,
        pending.range[0],
        pending.range[1],
      );
    }
    setPageEntry(
      pool.pageTable,
      pending.level,
      pending.coords,
      acquired.slot.coords,
      PAGE_FLAG_RESIDENT,
      pending.range && !pool.occReencodePending
        ? encodeOccupancyTexel(pending.range[0], pending.range[1], occEncodeRangeOf(pool))
        : undefined,
    );
    progress.bytes += frameCostBytes;
    progress.bricks += 1;
    this.stats.bricksUploaded += 1;
    coldOpenTimeline.stamp("firstBrickUploaded");
    this.stats.bytesUploaded += pending.bytes;
    if (!planned) this.stats.staleUploads += 1;
    progress.uploadedAny = true;
    return "done";
  }

  /** Called from the provider's useFrame: bounded texture uploads per frame.
   * `interacting` (the camera is mid-gesture) switches to the trickle policy —
   * no free pass, no stale drain, no GPU-repack dispatch (see
   * `resolveDrainPolicy`) — so uploads stop colliding with gesture frames;
   * the deferred backlog drains at full budget on the first settled frame. */
  drainUploads(interacting = false): void {
    if (this.disposed) return;
    // No device, no uploads. Belt-and-braces — the only caller is the canvas
    // frame driver, which by construction has a renderer — but every GPU write
    // below dereferences `this.renderer` non-null on the strength of it.
    if (this.renderer === null) return;
    // Idle fast path: a previous drain saw the whole pipeline empty and no
    // GPU flush in flight — skip the pool walks and per-frame allocations
    // until wakeDrain() signals new work.
    if (!this.drainNeeded) return;
    const drainStartedAt = performance.now();
    const profile = qualityGovernor.getProfile();
    const policy = resolveDrainPolicy(
      { ...FRAME_UPLOAD_BUDGET, maxMs: profile.uploadBudgetMs },
      interacting,
    );
    const budget = policy.budget;
    const progress = { bytes: 0, bricks: 0, uploadedAny: false };
    const progressOf = () => ({
      bytes: progress.bytes,
      bricks: progress.bricks,
      elapsedMs: performance.now() - drainStartedAt,
    });

    // Planned-first two-pass drain, ordered GLOBALLY across pools: visible
    // (planned) bricks from every pool spend the budget first — with the
    // first-brick free pass so streaming always makes progress (P19: on
    // integrated GPUs a single texSubImage3D can cost >15 ms; the ms cap is
    // tier-scaled). Stale (out-of-plan) bricks upload only on genuinely
    // leftover budget, into FREE slots, and never under the free pass — a
    // stale brick must never be the one causing the >maxMs hitch it permits.
    // The partition re-evaluates protectedKeys each drain, so a stale entry
    // whose plan flips back is automatically promoted to planned.
    const partitions = new Map<
      LayerBrickPool,
      { planned: PendingBrick[]; stale: PendingBrick[] }
    >();
    for (const pool of this.pools.values()) {
      if (pool.queue.length === 0) continue; // no per-frame partition alloc for idle pools
      const { planned, stale, dropped } = partitionUploadQueue(
        pool.queue,
        pool.protectedKeys,
        MAX_STALE_QUEUE,
        pool.minTargetLevel,
      );
      for (const entry of dropped) {
        pool.queuedKeys.delete(entry.key);
        this.stats.planDrops += 1;
        // Never uploaded: the repacked payload is dead — recycle it.
        if (entry.data) this.deps.repack.release(entry.data);
      }
      partitions.set(pool, { planned, stale });
    }

    // The free pass exists so streaming always progresses; while interacting
    // it is exactly the >maxMs hitch we are avoiding, so the strict predicate
    // applies to planned bricks too.
    const continuePlanned = policy.allowFreePass
      ? shouldContinueDrain
      : shouldContinueStaleDrain;
    for (const [pool, part] of partitions) {
      while (part.planned.length > 0 && continuePlanned(progressOf(), budget)) {
        const pending = part.planned[0];
        // A GPU-path brick commits flush() to its source-chunk writeBuffers
        // this frame — deferred while interacting (stays queued; the decoded
        // chunks stay cached, so it lands at cache-hit cost on settle).
        if (pending.gpu && !policy.allowGpuDispatch) break;
        const outcome = this.drainEntry(
          pool,
          pending,
          pool.protectedKeys.has(pending.key),
          progress,
        );
        if (outcome === "defer") break; // no free slot this frame; retry next drain
        part.planned.shift();
        pool.queuedKeys.delete(pending.key);
      }
    }
    if (policy.allowStale) {
      for (const [pool, part] of partitions) {
        while (part.stale.length > 0 && shouldContinueStaleDrain(progressOf(), budget)) {
          const pending = part.stale.shift()!;
          pool.queuedKeys.delete(pending.key);
          this.drainEntry(pool, pending, false, progress);
        }
      }
    }

    // Write the undrained remainder back (feeds the streaming predicate and
    // the budget-exhausted invalidate below), apply any coalesced auto-range
    // EMPTY re-encode (one pass per frame, however many range moves landed —
    // see accumulateAutoRange), and flush dirty page tables.
    //
    // Drained-edge gate for the occupancy-range promotion: promoting while
    // bricks still stream cascaded — the growing union re-promoted on nearly
    // every drain (each one blanking the whole sidecar, starving the
    // re-encode, and injecting off-cadence frames that defeated the
    // streaming coalescer). At the drained edge the union is final for this
    // burst, so promotion happens at most ONCE per burst.
    const pipelineQuiet = !this.anyPipelineWork();
    for (const pool of this.pools.values()) {
      const part = partitions.get(pool);
      if (part) pool.queue = [...part.planned, ...part.stale];
      if (pool.autoRangeEncodeDirty) {
        pool.autoRangeEncodeDirty = false;
        this.reencodeEmptyEntries(pool);
        this.reencodeOccupancyEntries(pool);
      }
      // Occupancy range promotion, two drains (see the occObservedRange
      // field doc): the promote drain blanks every texel to the
      // conservative sentinel, promotes the encode range and bumps
      // poolsVersion (the decode uniforms ride it); the NEXT drain — after
      // the uniforms had a frame to land — writes the real texels.
      // RE-ENCODE FIRST: a pending re-encode always completes before a new
      // promotion can be considered, so promotion can never starve it.
      if (pool.occReencodePending) {
        pool.occReencodePending = false;
        this.reencodeOccupancyEntries(pool);
      } else if (
        pipelineQuiet &&
        pool.occObservedRange &&
        occPromotionWorthwhile(pool)
      ) {
        pool.occEncodeMin = pool.occObservedMin;
        pool.occEncodeMax = pool.occObservedMax;
        this.blankOccupancyEntries(pool);
        pool.occReencodePending = true;
        this.wakeDrain();
        // Once per burst, so the unthrottled bump is cheap. The re-encode
        // needs a NEXT drain, and drains only run inside frames — request
        // one explicitly (the demand loop may otherwise go idle right
        // here). The intervening render is sentinel-safe under any decode
        // uniforms.
        this.lastPoolsBumpAt = performance.now();
        this.deps.viewerStore.getState().bumpPoolsVersion();
        this.invalidate();
      }
      flushPageTable(this.renderer!, pool.pageTable);
    }

    // Submit this frame's compute-repack batch (before R3F renders, so the
    // page entries flushed above and the brick contents land in the same
    // frame). The min/max readback resolves asynchronously.
    const gpuFlush = this.gpuRepacker ? this.gpuRepacker.flush() : null;
    if (gpuFlush) {
      // The clock starts AFTER flush() returns, so what follows is post-submit
      // latency only — see the gpuRepackLatencyMsSum doc on why the sum is not
      // a cost. The max and the flush count are the numbers worth reading.
      const flushStartedAt = performance.now();
      this.stats.gpuRepackFlushes += 1;
      void gpuFlush.then((outcome) => {
        const latency = performance.now() - flushStartedAt;
        this.stats.gpuRepackLatencyMsSum += latency;
        if (latency > this.stats.gpuRepackLatencyMaxMs) {
          this.stats.gpuRepackLatencyMaxMs = latency;
        }
        this.applyGpuOutcome(outcome);
      });
    }

    if (progress.uploadedAny) this.stats.uploadMs += performance.now() - drainStartedAt;
    if (progress.bricks > 0) perfMonitor.markUpload(progress.bricks, progress.bytes); // no-op unless recording

    // "Streaming" (work anywhere in the pipeline) counts as ACTIVITY for the
    // quality governor: frames rendered while bricks load use the tier's
    // cheaper profile, and the edge back to false snaps quality up (P19).
    // The false edge is HYSTERETIC (applyStreamingFlag): the raw predicate
    // flaps between 200 ms replans during a zoom (drained → next plan's
    // fetches), and every flap re-rendered all volume layers and visibly
    // snapped the raymarch step scale mid-gesture.
    const streaming = this.anyPipelineWork();
    this.applyStreamingFlag(streaming);

    // Pipeline drained: stop the time-to-sharp clock started by reconcileAll,
    // then use the idle workers to warm the chunk cache for adjacent z slabs.
    if (!streaming && this.streamStartedAt !== null) {
      this.stats.timeToSharpMs = performance.now() - this.streamStartedAt;
      this.streamStartedAt = null;
      this.timeToSharpRing.push(this.stats.timeToSharpMs);
      if (this.timeToSharpRing.length > 5) this.timeToSharpRing.shift();
      this.prefetchAdjacentSlabs();
    }

    if (progress.uploadedAny) {
      // Throttle version bumps while streaming — every bump re-renders the
      // React consumers (layer components, overlay, DebugPanel). The final
      // batch always bumps so consumers settle on the complete state.
      const now = performance.now();
      if (!streaming || now - this.lastResidencyBumpAt > profile.residencyBumpMs) {
        this.lastResidencyBumpAt = now;
        this.deps.viewerStore.getState().bumpResidencyVersion();
      }
      // Gated (gap 1a): while streaming + camera quiet, RENDERED frames land
      // at the bump cadence; the pump keeps this drain running off-frame.
      this.scheduleStreamingFrame(interacting, streaming);
    } else {
      // Budget exhausted with work left: keep the pipeline pumping.
      let queued = false;
      for (const pool of this.pools.values()) {
        if (pool.queue.length > 0) {
          queued = true;
          break;
        }
      }
      if (queued) this.scheduleStreamingFrame(interacting, streaming);
    }

    // Fully idle: nothing queued/in-flight/pending anywhere, nothing uploaded
    // this pass, and no GPU flush submitted (dispatches only happen inside
    // this method, so gpuFlush === null proves none are in flight; the
    // min/max readback continuation does its own page-table flush and bumps).
    // The streaming→idle edge above already ran in this same pass.
    //
    // MUST also respect PENDING ENCODE WORK: the occupancy-range promotion
    // is a TWO-drain protocol (blank this pass, re-encode next pass). The
    // promote branch above may have just set `occReencodePending` — clearing
    // the latch here would strand every occupancy/aggregate texel at the
    // "never skip" sentinel for the whole idle period (Phase A/D silently
    // dead exactly when settled). See hasPendingEncodeWork.
    if (
      !streaming &&
      !progress.uploadedAny &&
      gpuFlush === null &&
      ![...this.pools.values()].some(hasPendingEncodeWork)
    ) {
      this.drainNeeded = false;
    }
  }

  /** Per idle callback, how long mirror copies may run. */
  private static readonly MIRROR_DRAIN_MS = 2;

  private scheduleMirrorDrain(): void {
    if (this.mirrorIdleScheduled || this.disposed) return;
    this.mirrorIdleScheduled = true;
    const run = () => {
      this.mirrorIdleScheduled = false;
      this.drainMirrorQueue();
    };
    // Idle time when the platform offers it; a timer well past the current
    // frame otherwise. Either way this never competes with drainUploads.
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(run, { timeout: 500 });
    } else {
      setTimeout(run, 32);
    }
  }

  private drainMirrorQueue(): void {
    if (this.disposed) {
      this.mirrorQueue.length = 0;
      return;
    }
    const startedAt = performance.now();
    while (
      this.mirrorQueue.length > 0 &&
      performance.now() - startedAt < BrickResidencyManager.MIRROR_DRAIN_MS
    ) {
      const entry = this.mirrorQueue.shift()!;
      const { pool, key, slotIndex, slotCoords, data } = entry;
      // The copy is only valid while the brick still owns the slot it was
      // uploaded into — evictions, remaps and flushes may have intervened,
      // and mirroring then would corrupt another brick's mirror slot.
      // Either way this entry held the payload's LAST reference (the atlas
      // upload already copied it out at drain time) — recycle it.
      if (this.pools.get(pool.poolKey) === pool) {
        const slot = pool.pool.slotOf(key);
        if (slot && slot.index === slotIndex) {
          mirrorBrickToBacking(pool.atlas, slotCoords, data);
          pool.gpuStaleKeys.delete(key);
        }
      }
      this.deps.repack.release(data);
    }
    if (this.mirrorQueue.length > 0) this.scheduleMirrorDrain();
  }

  /** How long the pipeline must stay drained before the governor's streaming
   * flag clears — long enough to bridge the gap between 200 ms replans. */
  private static readonly STREAMING_CLEAR_MS = 300;

  /** Governor streaming flag with a trailing false edge: true applies
   * immediately (quality must drop as soon as work starts), false only after
   * STREAMING_CLEAR_MS of continuous quiet. The demand frameloop may render
   * no further frame once the pipeline drains, so the trailing clear is
   * timer-driven and re-checks the pipeline freshly when it fires. */
  private applyStreamingFlag(streaming: boolean): void {
    const now = performance.now();
    if (streaming) {
      this.lastStreamingTrueAt = now;
      if (this.streamingClearTimer !== null) {
        clearTimeout(this.streamingClearTimer);
        this.streamingClearTimer = null;
      }
      qualityGovernor.setStreaming(true);
      return;
    }
    if (!qualityGovernor.isStreaming()) return;
    if (now - this.lastStreamingTrueAt >= BrickResidencyManager.STREAMING_CLEAR_MS) {
      qualityGovernor.setStreaming(false);
      return;
    }
    if (this.streamingClearTimer === null) {
      this.streamingClearTimer = setTimeout(() => {
        this.streamingClearTimer = null;
        if (this.disposed) return;
        if (!this.anyPipelineWork()) {
          qualityGovernor.setStreaming(false);
          this.invalidate(); // render one settled-quality frame
        }
      }, BrickResidencyManager.STREAMING_CLEAR_MS);
    }
  }

  /**
   * Fold one brick's raw min/max into the layer's auto-contrast range (float
   * layers with no server histogram — see `LayerBrickPool.autoRange`). The
   * per-brick min/max is already computed by both repack paths; this is the
   * only consumer of it for range purposes.
   *
   * When the range moves, EMPTY page entries must be re-encoded (they store
   * the value quantized against the pool range), and `poolsVersion` is bumped
   * so `BrickVolumeLayer` rebuilds the `minValue`/`maxValue` uniforms — no
   * material rebuild. Bricks resident in the atlas hold raw values and
   * normalize live in the shader, so they need no rewrite.
   */
  private accumulateAutoRange(pool: LayerBrickPool, brickMin: number, brickMax: number): void {
    if (!pool.autoRange) return;
    if (!Number.isFinite(brickMin) || !Number.isFinite(brickMax) || brickMax <= brickMin) return;

    const nextMin = pool.autoRangeInitialized ? Math.min(pool.minValue, brickMin) : brickMin;
    const nextMax = pool.autoRangeInitialized ? Math.max(pool.maxValue, brickMax) : brickMax;

    // Ignore sub-1% wobble so a stream of bricks doesn't churn the uniforms;
    // the first (uninitialized) update always applies.
    const span = Math.max(pool.maxValue - pool.minValue, 1e-6);
    const changed =
      !pool.autoRangeInitialized ||
      Math.abs(nextMin - pool.minValue) > span * 0.01 ||
      Math.abs(nextMax - pool.maxValue) > span * 0.01;
    if (!changed) return;

    pool.minValue = nextMin;
    pool.maxValue = nextMax;
    pool.autoRangeInitialized = true;
    // Flag-off pools keep the occupancy encode range mirroring the pool
    // range (legacy single-range behavior); the autoRangeEncodeDirty pass
    // below re-encodes the sidecar against it, exactly as before.
    if (!pool.occObservedRange) {
      pool.occEncodeMin = nextMin;
      pool.occEncodeMax = nextMax;
    }

    // EMPTY page entries encode their value against the pool range, so a
    // range move requires re-encoding them — but COALESCED to one pass per
    // drain frame (early float streaming lands several moves per frame, and
    // each immediate rewrite re-uploaded page-table regions). The next drain
    // applies it; a drain is guaranteed by the invalidate paths below.
    if (pool.emptyValues.size > 0) {
      pool.autoRangeEncodeDirty = true;
      this.wakeDrain();
    }

    // The React-facing bump is rate-limited with a trailing timer so the
    // LAST range move of a burst always publishes (the drain's idle edge is
    // not a safe trailing site — applyGpuOutcome can fold ranges in after
    // the pipeline already went idle).
    this.schedulePoolsBump();
  }

  /** Throttled `poolsVersion` bump + invalidate with a trailing timer, so
   * the LAST event of a burst always publishes. Shared by the auto-range
   * and occupancy-range paths. */
  private schedulePoolsBump(): void {
    const now = performance.now();
    if (now - this.lastPoolsBumpAt > AUTO_RANGE_BUMP_MS) {
      this.lastPoolsBumpAt = now;
      this.deps.viewerStore.getState().bumpPoolsVersion();
      this.invalidate();
    } else if (this.poolsBumpTimer === null) {
      this.poolsBumpTimer = setTimeout(
        () => {
          this.poolsBumpTimer = null;
          if (this.disposed) return;
          this.lastPoolsBumpAt = performance.now();
          this.deps.viewerStore.getState().bumpPoolsVersion();
          this.invalidate();
        },
        Math.max(0, AUTO_RANGE_BUMP_MS - (now - this.lastPoolsBumpAt)),
      );
    }
  }

  /**
   * Fold a landed brick range into the pool's occupancy OBSERVED range —
   * UNION ONLY, no scheduling. The promotion decision moved to the drain
   * flush loop's drained-edge check (`occPromotionWorthwhile`): promoting
   * per landed brick cascaded during cold loads (the growing union
   * re-promoted on nearly every drain, each one blanking the whole sidecar,
   * starving the re-encode and injecting off-cadence frames that defeated
   * the streaming coalescer — ~9× the intended rendered frames with
   * occupancy culling dead the whole time). During a stream the texels
   * simply keep encoding against the CURRENT range: stale-but-conservative
   * by the four-corner clamp + byte-0 sentinel.
   */
  private accumulateOccRange(pool: LayerBrickPool, brickMin: number, brickMax: number): void {
    if (!pool.occObservedRange) return;
    if (!Number.isFinite(brickMin) || !Number.isFinite(brickMax) || brickMax < brickMin) return;

    pool.occObservedMin = pool.occObservedInitialized
      ? Math.min(pool.occObservedMin, brickMin)
      : brickMin;
    pool.occObservedMax = pool.occObservedInitialized
      ? Math.max(pool.occObservedMax, brickMax)
      : brickMax;
    pool.occObservedInitialized = true;
  }

  /** Re-encode every EMPTY page entry against the current pool range (the
   * page table is flushed by the caller). */
  private reencodeEmptyEntries(pool: LayerBrickPool): void {
    for (const [key, value] of pool.emptyValues) {
      const { level, coords } = parseNodeKey(key);
      setPageEntry(
        pool.pageTable,
        level,
        coords,
        encodeEmptyTexel(value, pool, pool.emptyBits),
        PAGE_FLAG_EMPTY,
      );
    }
  }

  /** Re-encode every RESIDENT brick's occupancy texel against the current
   * occupancy ENCODE range (same quantization dependency as the EMPTY
   * entries; a range move leaves old encodings relative to the old range,
   * which may no longer bracket the brick). */
  private reencodeOccupancyEntries(pool: LayerBrickPool): void {
    const encodeRange = occEncodeRangeOf(pool);
    for (const [key, range] of pool.brickRanges) {
      const slot = pool.pool.slotOf(key);
      if (!slot) continue; // evicted since — its page entry is UNMAPPED
      const { level, coords } = parseNodeKey(key);
      setPageEntry(
        pool.pageTable,
        level,
        coords,
        slot.coords,
        PAGE_FLAG_RESIDENT,
        encodeOccupancyTexel(range[0], range[1], encodeRange),
      );
    }
    for (const [key, range] of pool.aggregateRanges) {
      const { level, coords } = parseNodeKey(key);
      setAggregateEntry(
        pool.pageTable,
        level,
        coords,
        encodeOccupancyTexel(range[0], range[1], encodeRange),
      );
    }
  }

  /** Blank every RESIDENT brick's occupancy texel (and every aggregate
   * texel) to the all-zero "unknown, never skip/hop" sentinel — the
   * conservative intermediate state of a range promotion (valid under ANY
   * decode uniforms; see `occObservedRange`). */
  private blankOccupancyEntries(pool: LayerBrickPool): void {
    for (const key of pool.brickRanges.keys()) {
      const slot = pool.pool.slotOf(key);
      if (!slot) continue;
      const { level, coords } = parseNodeKey(key);
      setPageEntry(pool.pageTable, level, coords, slot.coords, PAGE_FLAG_RESIDENT);
    }
    for (const key of pool.aggregateRanges.keys()) {
      const { level, coords } = parseNodeKey(key);
      setAggregateEntry(pool.pageTable, level, coords, null);
    }
  }

  /**
   * Hierarchical occupancy (R4): fold one brick's measured range into
   * `measuredRanges` and write every parent cell's aggregate that just
   * became complete (`occupancyAggregate.ts`). Uniform (EMPTY) bricks land
   * here too, as [v, v] — an aggregate is only as complete as ALL its
   * children. While a range promotion is in flight the texel is written as
   * the unknown sentinel (like the per-brick path); the re-encode pass
   * rewrites it from `aggregateRanges`.
   */
  private recordMeasuredRange(
    pool: LayerBrickPool,
    key: string,
    level: number,
    coords: Vec3,
    brickMin: number,
    brickMax: number,
  ): void {
    if (!pool.occHierarchy) return;
    if (!Number.isFinite(brickMin) || !Number.isFinite(brickMax) || brickMax < brickMin) return;
    pool.measuredRanges.set(key, [brickMin, brickMax]);
    const parentLevel = level + 1;
    for (const cell of parentCellsOf(pool.geometry, pool.spec, level, coords)) {
      const aggregate = aggregateIfComplete(
        pool.geometry,
        pool.spec,
        parentLevel,
        cell,
        pool.measuredRanges,
      );
      if (!aggregate) continue;
      pool.aggregateRanges.set(nodeKey(parentLevel, cell), aggregate);
      setAggregateEntry(
        pool.pageTable,
        parentLevel,
        cell,
        pool.occReencodePending
          ? null
          : encodeOccupancyTexel(aggregate[0], aggregate[1], occEncodeRangeOf(pool)),
      );
      this.stats.aggregateWrites += 1;
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
      const pool = this.resolveGpuToken(result.token);
      if (!pool) continue;
      // Fold every brick's range into the layer auto-contrast, uniform or not.
      this.accumulateAutoRange(pool, result.min, result.max);
      if (result.uniformValue === null) {
        // Non-uniform GPU brick: its occupancy texel was written as "unknown"
        // at dispatch — backfill the real min/max bracket now that the
        // readback delivered it (resolveGpuToken already validated the slot).
        const { level, coords } = parseNodeKey(result.token.key);
        const slot = pool.pool.slotOf(result.token.key);
        if (slot) {
          pool.brickRanges.set(result.token.key, [result.min, result.max]);
          this.accumulateOccRange(pool, result.min, result.max);
          this.recordMeasuredRange(pool, result.token.key, level, coords, result.min, result.max);
          setPageEntry(
            pool.pageTable,
            level,
            coords,
            slot.coords,
            PAGE_FLAG_RESIDENT,
            // "Unknown" while a promotion is in flight — see drainEntry.
            pool.occReencodePending
              ? undefined
              : encodeOccupancyTexel(result.min, result.max, occEncodeRangeOf(pool)),
          );
          touchedPools.add(pool);
        }
        continue;
      }
      const { level, coords } = parseNodeKey(result.token.key);
      // Uniform brick: the same EMPTY demotion the CPU path applies before
      // acquiring a slot — just deferred to the readback; the slot frees up.
      const texel = encodeEmptyTexel(result.uniformValue, pool, pool.emptyBits);
      setPageEntry(pool.pageTable, level, coords, texel, PAGE_FLAG_EMPTY);
      pool.pool.release(result.token.key);
      pool.gpuStaleKeys.delete(result.token.key);
      pool.coarsestResident.delete(result.token.key);
      pool.brickRanges.delete(result.token.key);
      pool.emptyValues.set(result.token.key, result.uniformValue);
      // See the CPU EMPTY-demotion site: uniforms feed the observed range.
      this.accumulateOccRange(pool, result.uniformValue, result.uniformValue);
      this.recordMeasuredRange(
        pool,
        result.token.key,
        level,
        coords,
        result.uniformValue,
        result.uniformValue,
      );
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
      pool.gpuStaleKeys.delete(token.key);
      pool.coarsestResident.delete(token.key);
      pool.brickRanges.delete(token.key);
      this.stats.fetchErrors += 1;
      if (pool.protectedKeys.has(token.key)) {
        this.wakeDrain();
        // Tail = next to dispatch (pendingFetch is in reverse dispatch order
        // and never re-sorted after reconcile, so score/band are inert here).
        pool.pendingFetch.push({
          key: token.key,
          level,
          coords,
          role: "target",
          priority: 0,
          fetchScore: 0,
          fetchBand: 0,
        });
        this.startNextFetches(pool);
      }
      touchedPools.add(pool);
    }

    if (touchedPools.size > 0) {
      // The page-table flush and the invalidate are the correctness half and
      // stay unconditional. The store bump is throttled exactly as the drain
      // path throttles it (see drainUploads) — this continuation runs once per
      // GPU flush, i.e. up to once per frame, and every bump re-renders the
      // residencyVersion consumers. The `!streaming` clause guarantees the
      // drained edge always lands, so consumers settle on the complete state.
      const now = performance.now();
      const streaming = this.anyPipelineWork();
      if (
        !streaming ||
        now - this.lastResidencyBumpAt > qualityGovernor.getProfile().residencyBumpMs
      ) {
        this.lastResidencyBumpAt = now;
        this.deps.viewerStore.getState().bumpResidencyVersion();
      }
      // Gated (gap 1a), same as the drain path — the drained edge
      // (!streaming) still invalidates unconditionally through the gate.
      this.scheduleStreamingFrame(this.deps.isInteracting?.() ?? false, streaming);
    }
  }

  /** The pool for a GPU token, iff the brick still occupies the slot it was
   * dispatched into (nothing evicted, remapped, flushed, or disposed since). */
  private resolveGpuToken(token: GpuBrickToken): LayerBrickPool | null {
    const pool = this.pools.get(token.poolKey);
    if (!pool) return null;
    const slot = pool.pool.slotOf(token.key);
    if (!slot || slot.index !== token.slotIndex) return null;
    return pool;
  }

  /** One prefetch marker per POOL (key): `sliceSignature|slabZ` last prefetched. */
  private readonly prefetchedSlabMarker = new Map<string, string>();

  /**
   * z±1 adjacent-slab prefetch — decoded-chunk-cache warmth ONLY (no atlas
   * slots, no page-table writes, no residency interaction). Runs exclusively
   * on the streaming→idle edge, so it can never compete with visible fetches;
   * within the worker pool its tasks sort BELOW everything visible
   * (priority −1 vs generation-scaled priorities ≥ 1), so a new plan
   * mid-prefetch jumps the queue naturally. A later scrub to the neighbor
   * slab then costs
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
      // Any member's plan will do: members share a slice signature and mode, so
      // they agree on slabZ (it derives from the scene-wide currentZ). They can
      // differ in view range, which only affects WHICH nodes are planned — and
      // the prefetch reads nodes at targetLevel purely to warm the chunk cache.
      let plan: LayerNodePlan | undefined;
      for (const layerId of pool.members) {
        const candidate = state.nodePlans[layerId];
        if (candidate) {
          plan = candidate;
          break;
        }
      }
      if (!plan || plan.mode !== "2D" || plan.slabZ === null || plan.slabZ === undefined) {
        continue;
      }
      const marker = `${pool.sliceSignature}|${plan.slabZ}`;
      if (this.prefetchedSlabMarker.get(pool.poolKey) === marker) continue;
      this.prefetchedSlabMarker.set(pool.poolKey, marker);

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
    const dims = layer.lens.dataset.axisNames;
    const { xPos, yPos, zPos, intensityPos, phasorPos } = geometry.axes;
    const sliceMap = layer.lens.slices.reduce<Record<string, (typeof layer.lens.slices)[number]>>(
      (acc, slice) => {
        acc[slice.axis] = slice;
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
    pool.brickRanges.clear();
    pool.pool.clear();
    pool.gpuStaleKeys.clear();
    pool.coarsestResident.clear();
    pool.autoRangeEncodeDirty = false;
    // Occupancy observed range is a statement about the flushed data —
    // reset to the pool range and re-observe from the refetched bricks.
    pool.occObservedInitialized = false;
    pool.occEncodeMin = pool.minValue;
    pool.occEncodeMax = pool.maxValue;
    pool.occReencodePending = false;
    // Measured ranges/aggregates describe the flushed slice's data — the ONE
    // event that invalidates them (they deliberately survive eviction).
    pool.measuredRanges.clear();
    pool.aggregateRanges.clear();
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
    // A flush changes what the volume LOOKS like (the previous slice's
    // bricks are gone) but moves none of the compositor's cache-key
    // counters — without this bump a t/z-slider change kept serving the
    // PREVIOUS timepoint from the cached composite until streaming
    // happened to emit (or forever, if the refetch fails).
    this.deps.viewerStore.getState().volumeInputs.bump("pool-flush");
    this.invalidate();
  }

  private disposePool(pool: LayerBrickPool): void {
    for (const controller of pool.inFlight.values()) controller.abort();
    pool.inFlight.clear();
    this.prefetchedSlabMarker.delete(pool.poolKey);
    disposeBrickAtlas(pool.atlas);
    disposePageTable(pool.pageTable);
    // Pool lifecycle event — layer components must drop their pool handle.
    this.deps.viewerStore.getState().bumpPoolsVersion();
  }

  dispose(): void {
    this.disposed = true;
    this.fetchAbort.abort();
    this.inFlightChunks.clear();
    this.inFlightChunkAborts.clear();
    this.chunkRefs.clear();
    this.lastChunkRead = null;
    if (this.poolsBumpTimer !== null) {
      clearTimeout(this.poolsBumpTimer);
      this.poolsBumpTimer = null;
    }
    if (this.streamingClearTimer !== null) {
      clearTimeout(this.streamingClearTimer);
      this.streamingClearTimer = null;
    }
    if (this.drainPumpTimer !== null) {
      clearTimeout(this.drainPumpTimer);
      this.drainPumpTimer = null;
    }
    this.mirrorQueue.length = 0;
    this.gpuRepacker?.dispose();
    this.gpuRepacker = null;
    this.gpuSkeletonizer?.dispose();
    this.gpuSkeletonizer = null;
    for (const pool of this.pools.values()) this.disposePool(pool);
    this.pools.clear();
    this.renderer = null;
    this.invalidateFn = null;
    // Don't leave the governor thinking a torn-down scene is still streaming.
    qualityGovernor.setStreaming(false);
  }
}
