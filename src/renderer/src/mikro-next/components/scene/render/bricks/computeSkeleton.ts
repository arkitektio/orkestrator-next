import type * as THREE from "three";
import {
  getBackendTexture,
  getWebGPUDevice,
  type SceneRenderer,
} from "../gpu/sceneRenderer";
import type { CorridorBox } from "../../core/skeleton/corridorPlan";
import { corridorVoxelCount } from "../../core/skeleton/corridorPlan";
import { INF_COST, type SkeletonWeights } from "../../core/skeleton/corridorCost";
import type { Vec3 } from "../../core/skeleton/strokeModel";
import type { BrickAtlas } from "./brickAtlas";
import type { PageTableTexture } from "./pageTableTexture";
import {
  COST_PARAMS_BYTES,
  MAX_RELAX_ITERS,
  NO_PRED_WORD,
  RELAX_ITERS_PER_SUBMIT,
  RELAX_PARAMS_BYTES,
  SKELETON_COST_WGSL,
  SKELETON_RELAX_WGSL,
  SKELETON_TUBE_WGSL,
  TUBE_PARAMS_BYTES,
  packCostParams,
  packRelaxParams,
  packStrokePoints,
  packTubeParams,
  skeletonWorkgroups,
  tubeWorkgroups,
} from "./skeletonKernel";

/**
 * GPU skeleton extraction: runs the corridor cost + geodesic relaxation
 * kernels (`skeletonKernel.ts`) on the raw `GPUDevice`, reading the
 * intensity atlas and page table exactly where the raymarcher left them.
 * `computeRepack.ts` is the structural template — async pipeline creation as
 * the validation probe, a broken-latch that permanently reverts to the CPU
 * reference (`geodesicReference`), structural GPU typings instead of
 * @webgpu/types, mapAsync readback.
 *
 * One `run()` at a time (they serialize internally): extraction is a
 * click-cadence action, not a streaming pipeline, so there is no batching —
 * each run is (cost pass + holes readback) then batches of
 * `RELAX_ITERS_PER_SUBMIT` ping-pong relaxation passes until the changed
 * flag stays clear, then one dist+pred readback. An unconverged field at
 * `MAX_RELAX_ITERS` answers null — partial distances must not be
 * backtracked — and the caller falls back to the CPU path.
 */

type GpuBuffer = {
  destroy(): void;
  mapAsync(mode: number): Promise<void>;
  getMappedRange(): ArrayBuffer;
  unmap(): void;
};
type GpuBindGroup = { readonly __brand?: "bindGroup" };
type GpuBindGroupLayout = { readonly __brand?: "bindGroupLayout" };
type GpuComputePipeline = { readonly __brand?: "computePipeline" };
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
  pushErrorScope?(filter: "validation"): void;
  popErrorScope?(): Promise<{ message: string } | null>;
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

export type SkeletonRunJob = {
  atlas: BrickAtlas;
  pageTable: PageTableTexture;
  level: number;
  box: CorridorBox;
  /** Resampled stroke in LEVEL-voxel coordinates. */
  strokeLevelPts: readonly Vec3[];
  radiusWorld: number;
  weights: SkeletonWeights;
  channel: number;
  /** Normalization WINDOW (clim-windowed display range, raw units). */
  minValue: number;
  maxValue: number;
  /** `2^pool.emptyBits - 1`. */
  emptyCeiling: number;
  /** The POOL's own data range — EMPTY page-entry codes decode against it
   * (the normalization window above may be narrower). */
  poolMin: number;
  poolRange: number;
  /** `pool.spec.payload` / `.border` / `.stored[2]` — the brick geometry the
   * atlas slots were written with. */
  payload: Vec3;
  border: 0 | 1;
  storedZ: number;
  /** World size of one level voxel per axis. */
  spacing: Vec3;
  /** BOX-relative seed voxel. */
  seed: Vec3;
  /** Also extract the tube surface (`SKELETON_TUBE_WGSL`) from the cost
   * field: `iso`/`clampValue` come from `voxelCost`/`tubeClampValue`. */
  tube?: { iso: number; clampValue: number; maxVertices: number };
};

export type SkeletonTubeResult = {
  /** Absolute level-voxel xyz triplets, 3 vertices per triangle. */
  positions: Float32Array;
  triangles: number;
  truncated: boolean;
};

export type SkeletonRunResult = {
  dist: Float32Array;
  pred: Uint32Array;
  holes: number;
  /** Present iff the job asked for a tube AND the tube pipeline is alive. */
  tube: SkeletonTubeResult | null;
};

/**
 * The tube-only job (live preview while the stroke is being painted): the
 * cost pass + tube pass with NO geodesic — no seed, no dist/pred seeding, no
 * relaxation batches — so it answers in one submit plus readbacks.
 */
export type SkeletonTubeJob = Omit<SkeletonRunJob, "seed" | "tube"> & {
  tube: { iso: number; clampValue: number; maxVertices: number };
};

export interface GpuSkeletonizer {
  ready(): boolean;
  /** The tube-only path is alive (cost + tube pipelines; relax not needed). */
  tubeReady(): boolean;
  status(): "pending" | "ready" | "broken";
  /** Null result = give up on the GPU for THIS run (unconverged, too big);
   * a rejected batch latches `broken` and the promise still resolves null. */
  run(job: SkeletonRunJob): Promise<SkeletonRunResult | null>;
  /** Tube-only extraction for the live drag preview. A failure latches only
   * the tube path (`tubeBroken`) — the centerline keeps its GPU. */
  extractTube(job: SkeletonTubeJob): Promise<SkeletonTubeResult | null>;
  dispose(): void;
}

class GpuSkeletonizerImpl implements GpuSkeletonizer {
  private costPipeline: GpuComputePipeline | null = null;
  private relaxPipeline: GpuComputePipeline | null = null;
  private tubePipeline: GpuComputePipeline | null = null;
  private broken = false;
  /** Tube-kernel failure only — must not take the centerline path down. */
  private tubeBroken = false;
  private disposed = false;

  private readonly costGroup0Layout: GpuBindGroupLayout;
  private readonly costGroup1Layout: GpuBindGroupLayout;
  private readonly relaxGroup0Layout: GpuBindGroupLayout;
  private readonly tubeGroup0Layout: GpuBindGroupLayout;

  private costParams: GpuBuffer | null = null;
  private relaxParams: GpuBuffer | null = null;
  // Two single-word buffers, NOT one shared buffer with offsets: a storage
  // binding's offset must be 256-aligned, so binding word 1 of a shared
  // buffer at offset 4 fails CreateBindGroup validation.
  private holesBuffer: GpuBuffer | null = null;
  private changedBuffer: GpuBuffer | null = null;
  private strokeBuffer: GpuBuffer | null = null;
  private strokeCapacity = 0;
  private costBuffer: GpuBuffer | null = null;
  private distA: GpuBuffer | null = null;
  private distB: GpuBuffer | null = null;
  private predA: GpuBuffer | null = null;
  private predB: GpuBuffer | null = null;
  private fieldCapacity = 0;
  private flagStaging: GpuBuffer | null = null;
  private fieldStaging: GpuBuffer | null = null;
  private fieldStagingCapacity = 0;
  private tubeParams: GpuBuffer | null = null;
  private tubeCountBuffer: GpuBuffer | null = null;
  private tubeVertexBuffer: GpuBuffer | null = null;
  private tubeVertexCapacity = 0;
  private tubeStaging: GpuBuffer | null = null;
  private tubeStagingCapacity = 0;

  /** Serializes runs — see the module comment. */
  private chain: Promise<unknown> = Promise.resolve();

  constructor(
    private readonly renderer: SceneRenderer,
    private readonly device: ComputeDevice,
  ) {
    this.costGroup0Layout = device.createBindGroupLayout({
      label: "skeleton-cost group0",
      entries: [
        {
          binding: 0,
          visibility: SHADER_STAGE_COMPUTE,
          buffer: { type: "uniform", minBindingSize: COST_PARAMS_BYTES },
        },
        { binding: 1, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "storage" } },
        { binding: 2, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "storage" } },
        { binding: 3, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "read-only-storage" } },
      ],
    });
    this.costGroup1Layout = device.createBindGroupLayout({
      label: "skeleton-cost group1",
      entries: [
        {
          binding: 0,
          visibility: SHADER_STAGE_COMPUTE,
          // The page table is filterable rgba8unorm, the atlas may be
          // unfilterable r32float — "unfilterable-float" accepts both under
          // textureLoad, which never filters anyway.
          texture: { sampleType: "unfilterable-float", viewDimension: "3d" },
        },
        {
          binding: 1,
          visibility: SHADER_STAGE_COMPUTE,
          texture: { sampleType: "unfilterable-float", viewDimension: "3d" },
        },
      ],
    });
    this.relaxGroup0Layout = device.createBindGroupLayout({
      label: "skeleton-relax group0",
      entries: [
        {
          binding: 0,
          visibility: SHADER_STAGE_COMPUTE,
          buffer: { type: "uniform", minBindingSize: RELAX_PARAMS_BYTES },
        },
        { binding: 1, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "read-only-storage" } },
        { binding: 2, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "read-only-storage" } },
        { binding: 3, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "read-only-storage" } },
        { binding: 4, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "storage" } },
        { binding: 5, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "storage" } },
        { binding: 6, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "storage" } },
      ],
    });

    this.tubeGroup0Layout = device.createBindGroupLayout({
      label: "skeleton-tube group0",
      entries: [
        {
          binding: 0,
          visibility: SHADER_STAGE_COMPUTE,
          buffer: { type: "uniform", minBindingSize: TUBE_PARAMS_BYTES },
        },
        { binding: 1, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "read-only-storage" } },
        { binding: 2, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "storage" } },
        { binding: 3, visibility: SHADER_STAGE_COMPUTE, buffer: { type: "storage" } },
      ],
    });

    // Async pipeline creation doubles as the validation probe (the
    // computeRepack pattern): a rejection permanently reverts to the CPU
    // reference instead of surfacing per-frame uncaptured errors.
    const costModule = device.createShaderModule({
      label: "skeleton-cost",
      code: SKELETON_COST_WGSL,
    });
    device
      .createComputePipelineAsync({
        label: "skeleton-cost",
        layout: device.createPipelineLayout({
          bindGroupLayouts: [this.costGroup0Layout, this.costGroup1Layout],
        }),
        compute: { module: costModule, entryPoint: "main" },
      })
      .then((pipeline) => {
        this.costPipeline = pipeline;
      })
      .catch((error) => {
        this.broken = true;
        console.warn("[skeleton] cost pipeline failed to build; using CPU path", error);
      });
    const relaxModule = device.createShaderModule({
      label: "skeleton-relax",
      code: SKELETON_RELAX_WGSL,
    });
    device
      .createComputePipelineAsync({
        label: "skeleton-relax",
        layout: device.createPipelineLayout({
          bindGroupLayouts: [this.relaxGroup0Layout],
        }),
        compute: { module: relaxModule, entryPoint: "main" },
      })
      .then((pipeline) => {
        this.relaxPipeline = pipeline;
      })
      .catch((error) => {
        this.broken = true;
        console.warn("[skeleton] relax pipeline failed to build; using CPU path", error);
      });
    const tubeModule = device.createShaderModule({
      label: "skeleton-tube",
      code: SKELETON_TUBE_WGSL,
    });
    device
      .createComputePipelineAsync({
        label: "skeleton-tube",
        layout: device.createPipelineLayout({
          bindGroupLayouts: [this.tubeGroup0Layout],
        }),
        compute: { module: tubeModule, entryPoint: "main" },
      })
      .then((pipeline) => {
        this.tubePipeline = pipeline;
      })
      .catch((error) => {
        this.tubeBroken = true;
        console.warn("[skeleton] tube pipeline failed to build; tube uses CPU path", error);
      });
  }

  ready(): boolean {
    return (
      this.costPipeline !== null &&
      this.relaxPipeline !== null &&
      !this.broken &&
      !this.disposed
    );
  }

  tubeReady(): boolean {
    return (
      this.costPipeline !== null &&
      this.tubePipeline !== null &&
      !this.broken &&
      !this.tubeBroken &&
      !this.disposed
    );
  }

  status(): "pending" | "ready" | "broken" {
    if (this.broken || this.disposed) return "broken";
    return this.costPipeline === null || this.relaxPipeline === null
      ? "pending"
      : "ready";
  }

  run(job: SkeletonRunJob): Promise<SkeletonRunResult | null> {
    const next = this.chain.then(() => {
      if (!this.ready()) return null;
      return this.runExclusive(job).catch((error) => {
        if (!this.disposed) {
          this.broken = true;
          console.warn("[skeleton] gpu extraction failed; reverting to CPU path", error);
        }
        return null;
      });
    });
    this.chain = next.catch(() => null);
    return next;
  }

  extractTube(job: SkeletonTubeJob): Promise<SkeletonTubeResult | null> {
    const next = this.chain.then(() => {
      if (!this.tubeReady()) return null;
      return this.runTubeExclusive(job).catch((error) => {
        if (!this.disposed) {
          this.tubeBroken = true;
          console.warn("[skeleton] gpu tube preview failed; disabled for this scene", error);
        }
        return null;
      });
    });
    this.chain = next.catch(() => null);
    return next;
  }

  /** The cost + tube stages of `runExclusive`, alone: one submit for the two
   * passes and the count copy, one for the vertex readback. */
  private async runTubeExclusive(job: SkeletonTubeJob): Promise<SkeletonTubeResult | null> {
    const device = this.device;
    const voxels = corridorVoxelCount(job.box);
    const maxBinding =
      this.device.limits.maxStorageBufferBindingSize ?? 128 * 1024 * 1024;
    if (voxels * 4 > maxBinding) return null;

    const pageTexture = this.backendTexture(job.pageTable.texture);
    const atlasTexture = this.backendTexture(job.atlas.texture);
    if (!pageTexture || !atlasTexture) return null;

    this.ensureBuffers(voxels, job.strokeLevelPts.length);
    const tubeCapacity = Math.max(3, Math.floor(job.tube.maxVertices / 3) * 3);
    this.ensureTubeBuffers(tubeCapacity);

    this.device.pushErrorScope?.("validation");
    const finish = async <T>(value: T): Promise<T> => {
      const error = await this.device.popErrorScope?.();
      if (error) throw new Error(`WebGPU validation: ${error.message}`);
      return value;
    };

    const range = Math.max(job.maxValue - job.minValue, 1e-5);
    device.queue.writeBuffer(
      this.costParams!,
      0,
      packCostParams({
        boxOrigin: job.box.origin,
        boxSize: job.box.size,
        strokeCount: job.strokeLevelPts.length,
        channel: job.channel,
        pageOffset: job.pageTable.layout.levelOffset[job.level],
        payload: job.payload,
        border: job.border,
        storedZ: job.storedZ,
        slotSize: job.atlas.slotSize,
        spacing: job.spacing,
        radiusWorld: job.radiusWorld,
        minValue: job.minValue,
        range,
        dataScale: job.atlas.dataScale,
        emptyCeiling: job.emptyCeiling,
        poolMin: job.poolMin,
        poolRange: job.poolRange,
        weights: job.weights,
      }),
    );
    device.queue.writeBuffer(this.strokeBuffer!, 0, packStrokePoints(job.strokeLevelPts));
    device.queue.writeBuffer(this.holesBuffer!, 0, new Uint32Array([0]));
    device.queue.writeBuffer(
      this.tubeParams!,
      0,
      packTubeParams({
        boxOrigin: job.box.origin,
        boxSize: job.box.size,
        capacity: tubeCapacity,
        iso: job.tube.iso,
        clampValue: job.tube.clampValue,
      }),
    );
    device.queue.writeBuffer(this.tubeCountBuffer!, 0, new Uint32Array([0]));

    const costGroup0 = device.createBindGroup({
      label: "skeleton-cost group0",
      layout: this.costGroup0Layout,
      entries: [
        { binding: 0, resource: { buffer: this.costParams! } },
        { binding: 1, resource: { buffer: this.costBuffer! } },
        { binding: 2, resource: { buffer: this.holesBuffer! } },
        { binding: 3, resource: { buffer: this.strokeBuffer! } },
      ],
    });
    const costGroup1 = device.createBindGroup({
      label: "skeleton-cost group1",
      layout: this.costGroup1Layout,
      entries: [
        { binding: 0, resource: this.view3d(pageTexture) },
        { binding: 1, resource: this.view3d(atlasTexture) },
      ],
    });
    const tubeGroup0 = device.createBindGroup({
      label: "skeleton-tube group0",
      layout: this.tubeGroup0Layout,
      entries: [
        { binding: 0, resource: { buffer: this.tubeParams! } },
        { binding: 1, resource: { buffer: this.costBuffer! } },
        { binding: 2, resource: { buffer: this.tubeVertexBuffer! } },
        { binding: 3, resource: { buffer: this.tubeCountBuffer! } },
      ],
    });

    const workgroups = skeletonWorkgroups(job.box.size);
    const cells = tubeWorkgroups(job.box.size);
    {
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginComputePass();
      pass.setPipeline(this.costPipeline!);
      pass.setBindGroup(0, costGroup0);
      pass.setBindGroup(1, costGroup1);
      pass.dispatchWorkgroups(workgroups[0], workgroups[1], workgroups[2]);
      pass.end();
      const tubePass = encoder.beginComputePass();
      tubePass.setPipeline(this.tubePipeline!);
      tubePass.setBindGroup(0, tubeGroup0);
      tubePass.dispatchWorkgroups(cells[0], cells[1], cells[2]);
      tubePass.end();
      encoder.copyBufferToBuffer(this.tubeCountBuffer!, 0, this.flagStaging!, 0, 4);
      device.queue.submit([encoder.finish()]);
    }
    await this.flagStaging!.mapAsync(MAP_MODE_READ);
    const tubeDemand = new Uint32Array(this.flagStaging!.getMappedRange().slice(0, 4))[0];
    this.flagStaging!.unmap();

    const kept = Math.min(tubeDemand, tubeCapacity);
    if (kept === 0) {
      return finish({ positions: new Float32Array(0), triangles: 0, truncated: false });
    }
    {
      const encoder = device.createCommandEncoder();
      encoder.copyBufferToBuffer(this.tubeVertexBuffer!, 0, this.tubeStaging!, 0, kept * 16);
      device.queue.submit([encoder.finish()]);
    }
    await this.tubeStaging!.mapAsync(MAP_MODE_READ);
    const vec4s = new Float32Array(this.tubeStaging!.getMappedRange().slice(0, kept * 16));
    this.tubeStaging!.unmap();
    const positions = new Float32Array(kept * 3);
    for (let i = 0; i < kept; i += 1) {
      positions[i * 3] = vec4s[i * 4];
      positions[i * 3 + 1] = vec4s[i * 4 + 1];
      positions[i * 3 + 2] = vec4s[i * 4 + 2];
    }
    return finish({
      positions,
      triangles: kept / 3,
      truncated: tubeDemand > tubeCapacity,
    });
  }

  private async runExclusive(job: SkeletonRunJob): Promise<SkeletonRunResult | null> {
    const device = this.device;
    const voxels = corridorVoxelCount(job.box);
    const fieldBytes = voxels * 4;
    const maxBinding =
      this.device.limits.maxStorageBufferBindingSize ?? 128 * 1024 * 1024;
    if (fieldBytes > maxBinding) return null;

    const pageTexture = this.backendTexture(job.pageTable.texture);
    const atlasTexture = this.backendTexture(job.atlas.texture);
    if (!pageTexture || !atlasTexture) return null; // not uploaded yet: CPU path

    this.ensureBuffers(voxels, job.strokeLevelPts.length);

    // Validation errors never throw in WebGPU — an invalid bind group just
    // voids its command buffers and the readbacks then answer stale zeros,
    // which here would masquerade as instant convergence. The scope turns
    // any validation error into a rejection, which trips the broken latch.
    this.device.pushErrorScope?.("validation");
    const finish = async <T>(value: T): Promise<T> => {
      const error = await this.device.popErrorScope?.();
      if (error) throw new Error(`WebGPU validation: ${error.message}`);
      return value;
    };

    const range = Math.max(job.maxValue - job.minValue, 1e-5);
    device.queue.writeBuffer(
      this.costParams!,
      0,
      packCostParams({
        boxOrigin: job.box.origin,
        boxSize: job.box.size,
        strokeCount: job.strokeLevelPts.length,
        channel: job.channel,
        pageOffset: job.pageTable.layout.levelOffset[job.level],
        payload: job.payload,
        border: job.border,
        storedZ: job.storedZ,
        slotSize: job.atlas.slotSize,
        spacing: job.spacing,
        radiusWorld: job.radiusWorld,
        minValue: job.minValue,
        range,
        dataScale: job.atlas.dataScale,
        emptyCeiling: job.emptyCeiling,
        poolMin: job.poolMin,
        poolRange: job.poolRange,
        weights: job.weights,
      }),
    );
    device.queue.writeBuffer(
      this.relaxParams!,
      0,
      packRelaxParams(job.box.size, job.spacing),
    );
    device.queue.writeBuffer(this.strokeBuffer!, 0, packStrokePoints(job.strokeLevelPts));

    // dist/pred seeding: INF everywhere, 0 at the seed; NO_PRED throughout.
    const distInit = new Float32Array(voxels).fill(INF_COST);
    const seedIndex =
      job.seed[0] + job.seed[1] * job.box.size[0] + job.seed[2] * job.box.size[0] * job.box.size[1];
    distInit[seedIndex] = 0;
    device.queue.writeBuffer(this.distA!, 0, distInit);
    const predInit = new Uint32Array(voxels).fill(NO_PRED_WORD);
    device.queue.writeBuffer(this.predA!, 0, predInit);
    device.queue.writeBuffer(this.holesBuffer!, 0, new Uint32Array([0]));

    // Tube stage setup: rides the same submit as the cost pass (it reads the
    // cost buffer the pass just wrote; pass order within a submit is
    // guaranteed). A dead tube pipeline degrades to tube: null — the caller
    // then marches the CPU twin — and never blocks the centerline.
    const tube =
      job.tube && this.tubePipeline !== null && !this.tubeBroken ? job.tube : null;
    let tubeCapacity = 0;
    if (tube) {
      tubeCapacity = Math.max(3, Math.floor(tube.maxVertices / 3) * 3);
      this.ensureTubeBuffers(tubeCapacity);
      device.queue.writeBuffer(
        this.tubeParams!,
        0,
        packTubeParams({
          boxOrigin: job.box.origin,
          boxSize: job.box.size,
          capacity: tubeCapacity,
          iso: tube.iso,
          clampValue: tube.clampValue,
        }),
      );
      device.queue.writeBuffer(this.tubeCountBuffer!, 0, new Uint32Array([0]));
    }

    // --- Cost pass + holes readback -------------------------------------
    const costGroup0 = device.createBindGroup({
      label: "skeleton-cost group0",
      layout: this.costGroup0Layout,
      entries: [
        { binding: 0, resource: { buffer: this.costParams! } },
        { binding: 1, resource: { buffer: this.costBuffer! } },
        { binding: 2, resource: { buffer: this.holesBuffer! } },
        { binding: 3, resource: { buffer: this.strokeBuffer! } },
      ],
    });
    const costGroup1 = device.createBindGroup({
      label: "skeleton-cost group1",
      layout: this.costGroup1Layout,
      entries: [
        { binding: 0, resource: this.view3d(pageTexture) },
        { binding: 1, resource: this.view3d(atlasTexture) },
      ],
    });
    const workgroups = skeletonWorkgroups(job.box.size);
    {
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginComputePass();
      pass.setPipeline(this.costPipeline!);
      pass.setBindGroup(0, costGroup0);
      pass.setBindGroup(1, costGroup1);
      pass.dispatchWorkgroups(workgroups[0], workgroups[1], workgroups[2]);
      pass.end();
      if (tube) {
        const tubeGroup0 = device.createBindGroup({
          label: "skeleton-tube group0",
          layout: this.tubeGroup0Layout,
          entries: [
            { binding: 0, resource: { buffer: this.tubeParams! } },
            { binding: 1, resource: { buffer: this.costBuffer! } },
            { binding: 2, resource: { buffer: this.tubeVertexBuffer! } },
            { binding: 3, resource: { buffer: this.tubeCountBuffer! } },
          ],
        });
        const cells = tubeWorkgroups(job.box.size);
        const tubePass = encoder.beginComputePass();
        tubePass.setPipeline(this.tubePipeline!);
        tubePass.setBindGroup(0, tubeGroup0);
        tubePass.dispatchWorkgroups(cells[0], cells[1], cells[2]);
        tubePass.end();
        encoder.copyBufferToBuffer(this.tubeCountBuffer!, 0, this.flagStaging!, 4, 4);
      }
      encoder.copyBufferToBuffer(this.holesBuffer!, 0, this.flagStaging!, 0, 4);
      device.queue.submit([encoder.finish()]);
    }
    await this.flagStaging!.mapAsync(MAP_MODE_READ);
    const flagWords = new Uint32Array(this.flagStaging!.getMappedRange().slice(0, 8));
    const holes = flagWords[0];
    const tubeDemand = flagWords[1];
    this.flagStaging!.unmap();

    // --- Tube vertex readback (independent of the relaxation) ------------
    let tubeResult: SkeletonTubeResult | null = null;
    if (tube) {
      const kept = Math.min(tubeDemand, tubeCapacity);
      if (kept === 0) {
        tubeResult = { positions: new Float32Array(0), triangles: 0, truncated: false };
      } else {
        const encoder = device.createCommandEncoder();
        encoder.copyBufferToBuffer(this.tubeVertexBuffer!, 0, this.tubeStaging!, 0, kept * 16);
        device.queue.submit([encoder.finish()]);
        await this.tubeStaging!.mapAsync(MAP_MODE_READ);
        const vec4s = new Float32Array(this.tubeStaging!.getMappedRange().slice(0, kept * 16));
        this.tubeStaging!.unmap();
        const positions = new Float32Array(kept * 3);
        for (let i = 0; i < kept; i += 1) {
          positions[i * 3] = vec4s[i * 4];
          positions[i * 3 + 1] = vec4s[i * 4 + 1];
          positions[i * 3 + 2] = vec4s[i * 4 + 2];
        }
        tubeResult = {
          positions,
          triangles: kept / 3,
          truncated: tubeDemand > tubeCapacity,
        };
      }
    }

    // --- Relaxation batches ---------------------------------------------
    // A→B then B→A per pair; RELAX_ITERS_PER_SUBMIT is even, so every batch
    // ends with the newest field back in the A buffers.
    const groupAB = this.relaxBindGroup(this.distA!, this.predA!, this.distB!, this.predB!);
    const groupBA = this.relaxBindGroup(this.distB!, this.predB!, this.distA!, this.predA!);
    let iterations = 0;
    let converged = false;
    while (iterations < MAX_RELAX_ITERS) {
      device.queue.writeBuffer(this.changedBuffer!, 0, new Uint32Array([0]));
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginComputePass();
      pass.setPipeline(this.relaxPipeline!);
      for (let i = 0; i < RELAX_ITERS_PER_SUBMIT; i += 1) {
        pass.setBindGroup(0, i % 2 === 0 ? groupAB : groupBA);
        pass.dispatchWorkgroups(workgroups[0], workgroups[1], workgroups[2]);
      }
      pass.end();
      encoder.copyBufferToBuffer(this.changedBuffer!, 0, this.flagStaging!, 0, 4);
      device.queue.submit([encoder.finish()]);
      await this.flagStaging!.mapAsync(MAP_MODE_READ);
      const changed = new Uint32Array(this.flagStaging!.getMappedRange().slice(0, 4))[0];
      this.flagStaging!.unmap();
      iterations += RELAX_ITERS_PER_SUBMIT;
      if (changed === 0) {
        converged = true;
        break;
      }
    }
    if (!converged) return finish(null); // partial distances must not be backtracked

    // --- Field readback --------------------------------------------------
    {
      const encoder = device.createCommandEncoder();
      encoder.copyBufferToBuffer(this.distA!, 0, this.fieldStaging!, 0, fieldBytes);
      encoder.copyBufferToBuffer(this.predA!, 0, this.fieldStaging!, fieldBytes, fieldBytes);
      device.queue.submit([encoder.finish()]);
    }
    await this.fieldStaging!.mapAsync(MAP_MODE_READ);
    const mapped = this.fieldStaging!.getMappedRange().slice(0, fieldBytes * 2);
    this.fieldStaging!.unmap();
    return finish({
      dist: new Float32Array(mapped, 0, voxels),
      pred: new Uint32Array(mapped, fieldBytes, voxels),
      holes,
      tube: tubeResult,
    });
  }

  private relaxBindGroup(
    distIn: GpuBuffer,
    predIn: GpuBuffer,
    distOut: GpuBuffer,
    predOut: GpuBuffer,
  ): GpuBindGroup {
    return this.device.createBindGroup({
      label: "skeleton-relax",
      layout: this.relaxGroup0Layout,
      entries: [
        { binding: 0, resource: { buffer: this.relaxParams! } },
        { binding: 1, resource: { buffer: this.costBuffer! } },
        { binding: 2, resource: { buffer: distIn } },
        { binding: 3, resource: { buffer: predIn } },
        { binding: 4, resource: { buffer: distOut } },
        { binding: 5, resource: { buffer: predOut } },
        { binding: 6, resource: { buffer: this.changedBuffer! } },
      ],
    });
  }

  private ensureBuffers(voxels: number, strokePoints: number): void {
    const device = this.device;
    if (!this.costParams) {
      this.costParams = device.createBuffer({
        label: "skeleton cost params",
        size: COST_PARAMS_BYTES,
        usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST,
      });
    }
    if (!this.relaxParams) {
      this.relaxParams = device.createBuffer({
        label: "skeleton relax params",
        size: RELAX_PARAMS_BYTES,
        usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST,
      });
    }
    if (!this.holesBuffer) {
      this.holesBuffer = device.createBuffer({
        label: "skeleton holes",
        size: 4,
        usage: BufferUsage.STORAGE | BufferUsage.COPY_SRC | BufferUsage.COPY_DST,
      });
    }
    if (!this.changedBuffer) {
      this.changedBuffer = device.createBuffer({
        label: "skeleton changed",
        size: 4,
        usage: BufferUsage.STORAGE | BufferUsage.COPY_SRC | BufferUsage.COPY_DST,
      });
    }
    if (!this.flagStaging) {
      this.flagStaging = device.createBuffer({
        label: "skeleton flag staging",
        size: 8, // [holes, tube vertex demand]
        usage: BufferUsage.MAP_READ | BufferUsage.COPY_DST,
      });
    }
    const strokeBytes = Math.max(1, strokePoints) * 16;
    if (!this.strokeBuffer || this.strokeCapacity < strokeBytes) {
      this.strokeBuffer?.destroy();
      this.strokeCapacity = Math.max(strokeBytes, 128 * 16);
      this.strokeBuffer = device.createBuffer({
        label: "skeleton stroke",
        size: this.strokeCapacity,
        usage: BufferUsage.STORAGE | BufferUsage.COPY_DST,
      });
    }
    const fieldBytes = voxels * 4;
    if (this.fieldCapacity < fieldBytes) {
      for (const buffer of [this.costBuffer, this.distA, this.distB, this.predA, this.predB]) {
        buffer?.destroy();
      }
      this.fieldCapacity = fieldBytes;
      const make = (label: string) =>
        device.createBuffer({
          label,
          size: fieldBytes,
          usage: BufferUsage.STORAGE | BufferUsage.COPY_SRC | BufferUsage.COPY_DST,
        });
      this.costBuffer = make("skeleton cost");
      this.distA = make("skeleton distA");
      this.distB = make("skeleton distB");
      this.predA = make("skeleton predA");
      this.predB = make("skeleton predB");
    }
    if (this.fieldStagingCapacity < fieldBytes * 2) {
      this.fieldStaging?.destroy();
      this.fieldStagingCapacity = fieldBytes * 2;
      this.fieldStaging = device.createBuffer({
        label: "skeleton field staging",
        size: this.fieldStagingCapacity,
        usage: BufferUsage.MAP_READ | BufferUsage.COPY_DST,
      });
    }
  }

  private ensureTubeBuffers(vertexCapacity: number): void {
    const device = this.device;
    if (!this.tubeParams) {
      this.tubeParams = device.createBuffer({
        label: "skeleton tube params",
        size: TUBE_PARAMS_BYTES,
        usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST,
      });
    }
    if (!this.tubeCountBuffer) {
      this.tubeCountBuffer = device.createBuffer({
        label: "skeleton tube count",
        size: 4,
        usage: BufferUsage.STORAGE | BufferUsage.COPY_SRC | BufferUsage.COPY_DST,
      });
    }
    const bytes = vertexCapacity * 16;
    if (this.tubeVertexCapacity < bytes) {
      this.tubeVertexBuffer?.destroy();
      this.tubeVertexCapacity = bytes;
      this.tubeVertexBuffer = device.createBuffer({
        label: "skeleton tube vertices",
        size: bytes,
        usage: BufferUsage.STORAGE | BufferUsage.COPY_SRC,
      });
    }
    if (this.tubeStagingCapacity < bytes) {
      this.tubeStaging?.destroy();
      this.tubeStagingCapacity = bytes;
      this.tubeStaging = device.createBuffer({
        label: "skeleton tube staging",
        size: bytes,
        usage: BufferUsage.MAP_READ | BufferUsage.COPY_DST,
      });
    }
  }

  private view3d(texture: unknown): unknown {
    return (texture as { createView(descriptor: object): unknown }).createView({
      dimension: "3d",
      baseMipLevel: 0,
      mipLevelCount: 1,
    });
  }

  private backendTexture(texture: THREE.Texture): unknown {
    let backend = getBackendTexture(this.renderer, texture);
    if (!backend) {
      (this.renderer as unknown as { initTexture?: (t: THREE.Texture) => void }).initTexture?.(
        texture,
      );
      backend = getBackendTexture(this.renderer, texture);
    }
    return backend;
  }

  dispose(): void {
    this.disposed = true;
    for (const buffer of [
      this.costParams,
      this.relaxParams,
      this.holesBuffer,
      this.changedBuffer,
      this.flagStaging,
      this.strokeBuffer,
      this.costBuffer,
      this.distA,
      this.distB,
      this.predA,
      this.predB,
      this.fieldStaging,
      this.tubeParams,
      this.tubeCountBuffer,
      this.tubeVertexBuffer,
      this.tubeStaging,
    ]) {
      buffer?.destroy();
    }
    this.costParams = null;
    this.relaxParams = null;
    this.holesBuffer = null;
    this.changedBuffer = null;
    this.flagStaging = null;
    this.strokeBuffer = null;
    this.costBuffer = null;
    this.distA = null;
    this.distB = null;
    this.predA = null;
    this.predB = null;
    this.fieldStaging = null;
    this.tubeParams = null;
    this.tubeCountBuffer = null;
    this.tubeVertexBuffer = null;
    this.tubeStaging = null;
  }
}

/** Null when there is no device to compute on — callers keep the CPU path. */
export function createGpuSkeletonizer(renderer: SceneRenderer): GpuSkeletonizer | null {
  const device = getWebGPUDevice(renderer);
  if (!device) return null;
  try {
    return new GpuSkeletonizerImpl(renderer, device as unknown as ComputeDevice);
  } catch (error) {
    console.warn("[skeleton] gpu skeletonizer unavailable; using CPU path", error);
    return null;
  }
}
