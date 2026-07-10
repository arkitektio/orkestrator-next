import type * as THREE from "three";
import type { RepackChunk } from "../../../core/octree/brickRepack";
import type { Vec3 } from "../../../core/octree/levelGeometry";
import {
  getBackendTexture,
  getWebGPUDevice,
  type SceneRenderer,
} from "../../gpu/sceneRenderer";
import {
  MINMAX_ENTRY_BYTES,
  MINMAX_INIT_MAX,
  MINMAX_INIT_MIN,
  REPACK_KERNEL_WGSL,
  REPACK_PARAMS_BYTES,
  REPACK_PARAMS_STRIDE,
  buildKernelDispatches,
  decodeMinMax,
  dispatchWorkgroups,
  packKernelParams,
  type RepackDispatchInput,
} from "./repackKernel";
import type { BrickAtlas } from "./brickAtlas";

/**
 * GPU brick repack: runs the fused repack kernel (`repackKernel.ts`) on the
 * raw `GPUDevice`, replacing the CPU worker repack + `writeBrickToAtlas`
 * upload for r32f atlases on the native WebGPU backend. The residency
 * manager queues `dispatch()` calls during its drain (one per acquired
 * slot), then `flush()` once per frame submits the whole batch and resolves
 * with each brick's min/max readback (EMPTY demotion happens there, a few
 * frames later — the page entry is optimistically RESIDENT meanwhile).
 *
 * Availability is three-tiered, all falling back to the CPU worker path:
 * - no `GPUDevice` (WebGL2 fallback backend) → `createGpuRepacker` = null;
 * - pipeline still compiling / compile failed → `ready()` = false;
 * - unsupported job (non-f32 chunks, r8 atlas until Phase B, chunk larger
 *   than `maxStorageBufferBindingSize`) → `supports()` = false per brick.
 * Any batch failure marks the repacker broken — every subsequent brick takes
 * the CPU path, and the failed bricks' tokens are reported for unmapping.
 *
 * Chunk data is uploaded into a small LRU cache of storage buffers: a chunk
 * typically feeds many bricks (up to 8 neighbors per level), so one
 * `writeBuffer` amortizes across all of them. SAB-backed views are written
 * directly when the implementation accepts shared sources, else through a
 * scratch copy (still far cheaper than a CPU repack).
 */

// The repo deliberately avoids @webgpu/types (see sceneRenderer.ts) —
// structural typings for exactly the members this module touches.
type GpuBuffer = {
  destroy(): void;
  mapAsync(mode: number): Promise<void>;
  getMappedRange(): ArrayBuffer;
  unmap(): void;
};
type GpuBindGroup = { readonly __brand?: "bindGroup" };
type GpuBindGroupLayout = { readonly __brand?: "bindGroupLayout" };
type GpuComputePipeline = { readonly __brand?: "computePipeline" };
type GpuTextureView = { readonly __brand?: "textureView" };
type GpuComputePass = {
  setPipeline(pipeline: GpuComputePipeline): void;
  setBindGroup(index: number, group: GpuBindGroup, dynamicOffsets?: number[]): void;
  dispatchWorkgroups(x: number, y: number, z: number): void;
  end(): void;
};
type GpuCommandEncoder = {
  beginComputePass(): GpuComputePass;
  copyBufferToBuffer(
    source: GpuBuffer,
    sourceOffset: number,
    destination: GpuBuffer,
    destinationOffset: number,
    size: number,
  ): void;
  finish(): unknown;
};
type ComputeDevice = {
  limits: { maxStorageBufferBindingSize?: number };
  queue: {
    submit(commandBuffers: unknown[]): void;
    writeBuffer(
      buffer: GpuBuffer,
      bufferOffset: number,
      data: ArrayBufferView | ArrayBuffer,
      dataOffset?: number,
      size?: number,
    ): void;
  };
  createShaderModule(descriptor: { label?: string; code: string }): unknown;
  createBindGroupLayout(descriptor: object): GpuBindGroupLayout;
  createPipelineLayout(descriptor: object): unknown;
  createComputePipelineAsync(descriptor: object): Promise<GpuComputePipeline>;
  createBindGroup(descriptor: object): GpuBindGroup;
  createBuffer(descriptor: { label?: string; size: number; usage: number }): GpuBuffer;
  createCommandEncoder(): GpuCommandEncoder;
};

const BufferUsage = {
  MAP_READ: 0x0001,
  COPY_SRC: 0x0004,
  COPY_DST: 0x0008,
  UNIFORM: 0x0040,
  STORAGE: 0x0080,
} as const;
const SHADER_STAGE_COMPUTE = 0x4;
const MAP_MODE_READ = 0x1;

/** WebGPU default when the limit is somehow unreadable (spec minimum). */
const DEFAULT_MAX_STORAGE_BINDING = 128 * 1024 * 1024;

/** GPU chunk-buffer cache cap — a cache, not a residency requirement; it
 * shares VRAM with the atlases, so it stays well below the CPU-side
 * decoded-chunk cache. Misses just re-upload. */
const CHUNK_CACHE_BYTES = 128 * 1024 * 1024;

/**
 * Kill switch (localStorage, default ON): lets a session A/B the GPU repack
 * path against the CPU worker path without a rebuild. Read once per
 * residency manager — toggling takes effect on the next scene mount.
 */
const GPU_REPACK_STORAGE_KEY = "orkestrator.gpuRepack";

export function isGpuRepackEnabled(): boolean {
  try {
    return window.localStorage.getItem(GPU_REPACK_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setGpuRepackEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(GPU_REPACK_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* storage unavailable: session keeps its current state */
  }
}

export type GpuRepackJob<Token> = {
  atlas: BrickAtlas;
  input: RepackDispatchInput;
  /** GPU chunk-cache keys, parallel to `input.chunks` (decoded-chunk keys). */
  chunkKeys: readonly string[];
  slotCoords: Vec3;
  token: Token;
};

export type GpuRepackResult<Token> = {
  token: Token;
  min: number;
  max: number;
  uniformValue: number | null;
};

export type GpuFlushOutcome<Token> = {
  results: GpuRepackResult<Token>[];
  /** Bricks whose slot content is NOT valid — the caller must unmap them. */
  failed: Token[];
};

export interface GpuRepacker<Token = unknown> {
  /** Pipeline compiled and no batch has failed. False → use the CPU path. */
  ready(): boolean;
  supports(atlas: BrickAtlas, chunks: readonly RepackChunk[]): boolean;
  /** Queue one brick (slot already acquired). Commands record at `flush`. */
  dispatch(job: GpuRepackJob<Token>): void;
  /** Submit the queued batch; null when nothing is queued. Never rejects. */
  flush(): Promise<GpuFlushOutcome<Token>> | null;
  dispose(): void;
}

type ChunkCacheEntry = { buffer: GpuBuffer; bindGroup: GpuBindGroup; bytes: number };
type AtlasBinding = {
  texture: unknown;
  bindGroup: GpuBindGroup;
  paramsGen: number;
  minmaxGen: number;
};
type StagingBuffer = { buffer: GpuBuffer; size: number; free: boolean };

class GpuRepackerImpl<Token> implements GpuRepacker<Token> {
  private pipeline: GpuComputePipeline | null = null;
  private broken = false;
  private disposed = false;

  private readonly group0Layout: GpuBindGroupLayout;
  private readonly group1Layout: GpuBindGroupLayout;

  private pending: GpuRepackJob<Token>[] = [];

  /** LRU by Map insertion order (same convention as BrickPoolState). */
  private readonly chunkCache = new Map<string, ChunkCacheEntry>();
  private chunkCacheBytes = 0;

  private paramsBuffer: GpuBuffer | null = null;
  private paramsCapacity = 0;
  private paramsGen = 0;
  private minmaxBuffer: GpuBuffer | null = null;
  private minmaxCapacity = 0;
  private minmaxGen = 0;
  private readonly staging: StagingBuffer[] = [];
  private readonly atlasBindings = new WeakMap<BrickAtlas, AtlasBinding>();

  /** Whether writeBuffer accepts SAB-backed views (probed on first use). */
  private sabWriteSupported: boolean | null = null;

  constructor(
    private readonly renderer: SceneRenderer,
    private readonly device: ComputeDevice,
  ) {
    this.group0Layout = device.createBindGroupLayout({
      label: "brick-repack group0",
      entries: [
        {
          binding: 0,
          visibility: SHADER_STAGE_COMPUTE,
          buffer: {
            type: "uniform",
            hasDynamicOffset: true,
            minBindingSize: REPACK_PARAMS_BYTES,
          },
        },
        { binding: 1, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "storage" } },
        {
          binding: 2,
          visibility: SHADER_STAGE_COMPUTE,
          storageTexture: { access: "write-only", format: "r32float", viewDimension: "3d" },
        },
      ],
    });
    this.group1Layout = device.createBindGroupLayout({
      label: "brick-repack group1",
      entries: [
        { binding: 0, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "read-only-storage" } },
      ],
    });

    // Async pipeline creation doubles as the validation probe: a rejection
    // (bad WGSL, unsupported storage format) permanently reverts to the CPU
    // path instead of surfacing per-frame uncaptured errors.
    const module = device.createShaderModule({ label: "brick-repack", code: REPACK_KERNEL_WGSL });
    device
      .createComputePipelineAsync({
        label: "brick-repack",
        layout: device.createPipelineLayout({
          bindGroupLayouts: [this.group0Layout, this.group1Layout],
        }),
        compute: { module, entryPoint: "main" },
      })
      .then((pipeline) => {
        this.pipeline = pipeline;
      })
      .catch((error) => {
        this.broken = true;
        console.warn("[bricks] gpu repack pipeline failed to build; using CPU repack", error);
      });
  }

  ready(): boolean {
    return this.pipeline !== null && !this.broken && !this.disposed;
  }

  supports(atlas: BrickAtlas, chunks: readonly RepackChunk[]): boolean {
    if (atlas.kind !== "r32f" || chunks.length === 0) return false;
    const maxBinding = this.device.limits.maxStorageBufferBindingSize ?? DEFAULT_MAX_STORAGE_BINDING;
    return chunks.every(
      (chunk) => chunk.data instanceof Float32Array && chunk.data.byteLength <= maxBinding,
    );
  }

  dispatch(job: GpuRepackJob<Token>): void {
    this.pending.push(job);
  }

  flush(): Promise<GpuFlushOutcome<Token>> | null {
    if (this.pending.length === 0) return null;
    const jobs = this.pending;
    this.pending = [];
    if (!this.ready()) {
      return Promise.resolve({ results: [], failed: jobs.map((job) => job.token) });
    }
    // async fn: sync throws become rejections, so one catch covers both.
    return this.submitAndRead(jobs).catch((error) => {
      if (!this.disposed) {
        this.broken = true;
        console.warn("[bricks] gpu repack batch failed; reverting to CPU repack", error);
      }
      return { results: [], failed: jobs.map((job) => job.token) };
    });
  }

  private async submitAndRead(jobs: GpuRepackJob<Token>[]): Promise<GpuFlushOutcome<Token>> {
    const device = this.device;

    const failed: Token[] = [];
    const live: { job: GpuRepackJob<Token>; dispatches: ReturnType<typeof buildKernelDispatches> }[] = [];
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const slotOrigin: Vec3 = [
        job.slotCoords[0] * job.atlas.slotSize[0],
        job.slotCoords[1] * job.atlas.slotSize[1],
        job.slotCoords[2] * job.atlas.slotSize[2],
      ];
      const dispatches = buildKernelDispatches(job.input, slotOrigin, live.length);
      if (dispatches.length === 0) {
        failed.push(job.token); // no chunk overlaps the brick: nothing was written
        continue;
      }
      live.push({ job, dispatches });
    }
    if (live.length === 0) return { results: [], failed };

    // Chunk buffers: ensure every referenced chunk first (pinning the whole
    // batch), evict LRU extras after — evicting a buffer this batch still
    // needs would unbind it mid-flight.
    const pinned = new Set<string>();
    for (const { job, dispatches } of live) {
      for (const d of dispatches) {
        const key = job.chunkKeys[d.chunkIndex];
        this.ensureChunkEntry(key, job.input.chunks[d.chunkIndex].data as Float32Array);
        pinned.add(key);
      }
    }
    this.evictChunks(pinned);

    // Params arena: one 256-aligned uniform slice per dispatch, one write.
    const totalDispatches = live.reduce((sum, entry) => sum + entry.dispatches.length, 0);
    this.ensureParamsCapacity(totalDispatches * REPACK_PARAMS_STRIDE);
    const paramsWords = new Uint32Array((totalDispatches * REPACK_PARAMS_STRIDE) / 4);
    let slice = 0;
    for (const { dispatches } of live) {
      for (const d of dispatches) {
        packKernelParams(d, paramsWords, (slice * REPACK_PARAMS_STRIDE) / 4);
        slice++;
      }
    }
    device.queue.writeBuffer(this.paramsBuffer!, 0, paramsWords);

    // Min/max slots, initialized to the sentinels the kernel reduces into.
    this.ensureMinmaxCapacity(live.length * MINMAX_ENTRY_BYTES);
    const minmaxInit = new Uint32Array(live.length * 2);
    for (let i = 0; i < live.length; i++) {
      minmaxInit[i * 2] = MINMAX_INIT_MIN;
      minmaxInit[i * 2 + 1] = MINMAX_INIT_MAX;
    }
    device.queue.writeBuffer(this.minmaxBuffer!, 0, minmaxInit);

    const staging = this.acquireStaging(live.length * MINMAX_ENTRY_BYTES);

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipeline!);
    slice = 0;
    for (const { job, dispatches } of live) {
      for (const d of dispatches) {
        pass.setBindGroup(0, this.atlasBindGroup(job.atlas), [slice * REPACK_PARAMS_STRIDE]);
        pass.setBindGroup(1, this.chunkCache.get(job.chunkKeys[d.chunkIndex])!.bindGroup);
        const workgroups = dispatchWorkgroups(d);
        pass.dispatchWorkgroups(workgroups[0], workgroups[1], workgroups[2]);
        slice++;
      }
    }
    pass.end();
    encoder.copyBufferToBuffer(
      this.minmaxBuffer!,
      0,
      staging.buffer,
      0,
      live.length * MINMAX_ENTRY_BYTES,
    );
    device.queue.submit([encoder.finish()]);

    await staging.buffer.mapAsync(MAP_MODE_READ);
    const words = new Uint32Array(
      staging.buffer.getMappedRange().slice(0, live.length * MINMAX_ENTRY_BYTES),
    );
    staging.buffer.unmap();
    staging.free = true;

    const results: GpuRepackResult<Token>[] = live.map(({ job }, i) => ({
      token: job.token,
      ...decodeMinMax(words[i * 2], words[i * 2 + 1]),
    }));
    return { results, failed };
  }

  private ensureChunkEntry(key: string, data: Float32Array): void {
    const existing = this.chunkCache.get(key);
    if (existing) {
      // LRU touch (Map insertion order).
      this.chunkCache.delete(key);
      this.chunkCache.set(key, existing);
      return;
    }
    const buffer = this.device.createBuffer({
      label: `brick-chunk ${key}`,
      size: data.byteLength,
      usage: BufferUsage.STORAGE | BufferUsage.COPY_DST,
    });
    this.writeChunkData(buffer, data);
    const bindGroup = this.device.createBindGroup({
      label: `brick-chunk ${key}`,
      layout: this.group1Layout,
      entries: [{ binding: 0, resource: { buffer } }],
    });
    this.chunkCache.set(key, { buffer, bindGroup, bytes: data.byteLength });
    this.chunkCacheBytes += data.byteLength;
  }

  /**
   * writeBuffer with a SAB-backed view where the implementation allows it
   * (AllowSharedBufferSource in the current spec); on the first rejection,
   * permanently switch to copying through a non-shared scratch.
   */
  private writeChunkData(buffer: GpuBuffer, data: Float32Array): void {
    const shared =
      typeof SharedArrayBuffer !== "undefined" && data.buffer instanceof SharedArrayBuffer;
    if (!shared || this.sabWriteSupported !== false) {
      try {
        this.device.queue.writeBuffer(buffer, 0, data);
        if (shared) this.sabWriteSupported = true;
        return;
      } catch (error) {
        if (!shared) throw error;
        this.sabWriteSupported = false;
        console.warn(
          "[bricks] writeBuffer rejected a SharedArrayBuffer view; copying chunks via scratch",
        );
      }
    }
    this.device.queue.writeBuffer(buffer, 0, new Float32Array(data)); // non-shared copy
  }

  private evictChunks(pinned: ReadonlySet<string>): void {
    for (const [key, entry] of this.chunkCache) {
      if (this.chunkCacheBytes <= CHUNK_CACHE_BYTES) break;
      if (pinned.has(key)) continue;
      this.chunkCache.delete(key);
      this.chunkCacheBytes -= entry.bytes;
      entry.buffer.destroy();
    }
  }

  private ensureParamsCapacity(bytes: number): void {
    if (this.paramsBuffer && this.paramsCapacity >= bytes) return;
    this.paramsBuffer?.destroy();
    this.paramsCapacity = Math.max(bytes, 16 * REPACK_PARAMS_STRIDE);
    this.paramsBuffer = this.device.createBuffer({
      label: "brick-repack params",
      size: this.paramsCapacity,
      usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST,
    });
    this.paramsGen++;
  }

  private ensureMinmaxCapacity(bytes: number): void {
    if (this.minmaxBuffer && this.minmaxCapacity >= bytes) return;
    this.minmaxBuffer?.destroy();
    this.minmaxCapacity = Math.max(bytes, 32 * MINMAX_ENTRY_BYTES);
    this.minmaxBuffer = this.device.createBuffer({
      label: "brick-repack minmax",
      size: this.minmaxCapacity,
      usage: BufferUsage.STORAGE | BufferUsage.COPY_SRC | BufferUsage.COPY_DST,
    });
    this.minmaxGen++;
  }

  private acquireStaging(bytes: number): StagingBuffer {
    for (const entry of this.staging) {
      if (entry.free && entry.size >= bytes) {
        entry.free = false;
        return entry;
      }
    }
    const entry: StagingBuffer = {
      buffer: this.device.createBuffer({
        label: "brick-repack readback",
        size: Math.max(bytes, 32 * MINMAX_ENTRY_BYTES),
        usage: BufferUsage.MAP_READ | BufferUsage.COPY_DST,
      }),
      size: Math.max(bytes, 32 * MINMAX_ENTRY_BYTES),
      free: false,
    };
    this.staging.push(entry);
    return entry;
  }

  /**
   * group0 bind group for an atlas: its storage-texture view + the shared
   * params/minmax buffers. Cached per atlas; rebuilt when either shared
   * buffer was re-allocated (generation bump) or the backend re-created the
   * GPUTexture.
   */
  private atlasBindGroup(atlas: BrickAtlas): GpuBindGroup {
    const texture = this.atlasTexture(atlas);
    const cached = this.atlasBindings.get(atlas);
    if (
      cached &&
      cached.texture === texture &&
      cached.paramsGen === this.paramsGen &&
      cached.minmaxGen === this.minmaxGen
    ) {
      return cached.bindGroup;
    }
    const view = (texture as { createView(descriptor: object): GpuTextureView }).createView({
      dimension: "3d",
      baseMipLevel: 0,
      mipLevelCount: 1,
    });
    const bindGroup = this.device.createBindGroup({
      label: "brick-repack atlas",
      layout: this.group0Layout,
      entries: [
        {
          binding: 0,
          resource: { buffer: this.paramsBuffer!, offset: 0, size: REPACK_PARAMS_BYTES },
        },
        { binding: 1, resource: { buffer: this.minmaxBuffer! } },
        { binding: 2, resource: view },
      ],
    });
    this.atlasBindings.set(atlas, {
      texture,
      bindGroup,
      paramsGen: this.paramsGen,
      minmaxGen: this.minmaxGen,
    });
    return bindGroup;
  }

  private atlasTexture(atlas: BrickAtlas): unknown {
    let texture = getBackendTexture(this.renderer, atlas.texture);
    if (!texture) {
      // Force backend-side creation before the first draw samples the atlas.
      // The manager warms this up at pool creation; this is the safety net.
      (this.renderer as unknown as { initTexture?: (t: THREE.Texture) => void }).initTexture?.(
        atlas.texture,
      );
      texture = getBackendTexture(this.renderer, atlas.texture);
    }
    if (!texture) throw new Error("atlas GPUTexture unavailable for compute repack");
    return texture;
  }

  dispose(): void {
    this.disposed = true;
    this.pending = [];
    for (const entry of this.chunkCache.values()) entry.buffer.destroy();
    this.chunkCache.clear();
    this.chunkCacheBytes = 0;
    this.paramsBuffer?.destroy();
    this.paramsBuffer = null;
    this.minmaxBuffer?.destroy();
    this.minmaxBuffer = null;
    for (const entry of this.staging) entry.buffer.destroy();
    this.staging.length = 0;
  }
}

/**
 * Null when the renderer runs the WebGL2 fallback backend (no compute) —
 * callers then keep the worker repack path unconditionally.
 */
export function createGpuRepacker<Token = unknown>(
  renderer: SceneRenderer,
): GpuRepacker<Token> | null {
  const device = getWebGPUDevice(renderer);
  if (!device) return null;
  try {
    return new GpuRepackerImpl<Token>(renderer, device as unknown as ComputeDevice);
  } catch (error) {
    console.warn("[bricks] gpu repacker unavailable; using CPU repack", error);
    return null;
  }
}
