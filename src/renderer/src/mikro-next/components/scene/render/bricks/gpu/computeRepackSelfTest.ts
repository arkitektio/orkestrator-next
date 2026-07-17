import { repackBrick, type RepackChunk } from "../../../core/octree/brickRepack";
import type { BrickSpec } from "../../../core/octree/brickSpec";
import type { LevelGeometry } from "../../../core/octree/levelGeometry";
import { getWebGPUDevice, type SceneRenderer } from "../../gpu/sceneRenderer";
import { createBrickAtlas, disposeBrickAtlas } from "./brickAtlas";
import { createGpuRepacker } from "./computeRepack";
import type { RepackDispatchInput } from "./repackKernel";

/**
 * Dev-only GPU↔CPU repack parity check, run from the DebugPanel on the LIVE
 * renderer: repacks one synthetic multi-chunk brick both ways, reads the
 * atlas slot back (`copyTextureToBuffer`), and compares voxel-for-voxel plus
 * min/max/uniform. The vitest suite pins the dispatch math against
 * `repackBrick`; this pins the WGSL + binding model against the dispatch
 * math — together they cover the whole GPU path, including any behavior
 * change from a future three upgrade (e.g. the `isStorageTexture` usage bit).
 */

export type GpuRepackSelfTestResult = {
  supported: boolean;
  pass: boolean;
  detail: string;
};

// Structural typings for the readback-only members this module touches
// beyond what computeRepack needs (see sceneRenderer.ts for the convention).
type ReadbackDevice = {
  queue: { submit(commandBuffers: unknown[]): void };
  createBuffer(descriptor: { label?: string; size: number; usage: number }): {
    destroy(): void;
    mapAsync(mode: number): Promise<void>;
    getMappedRange(): ArrayBuffer;
    unmap(): void;
  };
  createCommandEncoder(): {
    copyTextureToBuffer(
      source: { texture: unknown; origin: [number, number, number] },
      destination: { buffer: unknown; bytesPerRow: number; rowsPerImage: number },
      size: [number, number, number],
    ): void;
    finish(): unknown;
  };
};

const BYTES_PER_ROW_ALIGN = 256;

/** Synthetic brick: 4³ payload + border, 2 channels, 2×2 spatial chunks of
 * 8×8×4 — every interesting case at once (chunk straddling, border
 * replication at the volume edge, channel slabs). */
function makeFixture(): { input: RepackDispatchInput; elementCount: number } {
  const spec: BrickSpec = {
    payload: [4, 4, 4],
    border: 1,
    stored: [6, 6, 6],
    channelCount: 2,
  };
  const level: LevelGeometry = {
    spatialShape: [12, 12, 4],
    spatialChunks: [8, 8, 4],
    // zarr dim order [c, z, y, x]:
    shape: [2, 4, 12, 12],
    chunks: [1, 4, 8, 8],
    scale: [1, 1, 1],
    dtype: "float32",
    storeId: "gpu-selftest",
  } as unknown as LevelGeometry;

  const chunks: RepackChunk[] = [];
  for (let channel = 0; channel < 2; channel++) {
    for (const cy of [0, 1]) {
      for (const cx of [0, 1]) {
        const data = new Float32Array(4 * 8 * 8);
        for (let z = 0; z < 4; z++)
          for (let y = 0; y < 8; y++)
            for (let x = 0; x < 8; x++) {
              const gx = cx * 8 + x;
              const gy = cy * 8 + y;
              data[(z * 8 + y) * 8 + x] =
                gx < 12 && gy < 12 ? channel * 1000 + z * 100 + gy * 10 + gx : -999;
            }
        chunks.push({
          coords: [cx, cy, 0],
          channelChunk: channel,
          data: data as unknown as RepackChunk["data"],
          shape: [1, 4, 8, 8],
          stride: [256, 64, 8, 1],
        });
      }
    }
  }

  return {
    input: {
      spec,
      level,
      axes: { xPos: 3, yPos: 2, zPos: 1, intensityPos: 0, phasorPos: -1 },
      // Two plain channel slabs: the GPU kernel is a strided copy and never
      // sees a phasor layer (those take the CPU worker path).
      slabs: [
        { kind: "channel", channel: 0 },
        { kind: "channel", channel: 1 },
      ],
      phasorBins: 0,
      // Brick [1,1,0]: payload x,y ∈ [4,8) straddles all four chunks; the
      // z border leaves the volume on both sides (replication).
      brickBox: { min: [4, 4, 0], max: [8, 8, 4] },
      fetchBox: { min: [3, 3, 0], max: [9, 9, 4] },
      fixedOffsets: [0, 0, 0, 0],
      chunks,
    },
    elementCount: 6 * 6 * 6 * 2,
  };
}

export async function runGpuRepackSelfTest(
  renderer: SceneRenderer,
): Promise<GpuRepackSelfTestResult> {
  if (!getWebGPUDevice(renderer)) {
    return { supported: false, pass: false, detail: "no GPU device (no compute)" };
  }
  const repacker = createGpuRepacker<string>(renderer);
  if (!repacker) {
    return { supported: false, pass: false, detail: "gpu repacker unavailable" };
  }

  const { input, elementCount } = makeFixture();
  const atlas = createBrickAtlas({
    spec: input.spec,
    dtype: "float32",
    desiredSlots: 1,
    maxExtent: 64,
    filter: "nearest",
    computeStorage: true,
  });

  try {
    (renderer as unknown as { initTexture?: (t: unknown) => void }).initTexture?.(atlas.texture);

    // Pipeline creation is async; give it a moment.
    for (let waited = 0; !repacker.ready(); waited += 50) {
      if (waited > 3000) return { supported: true, pass: false, detail: "pipeline never became ready" };
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    if (!repacker.supports(atlas, input.chunks)) {
      return { supported: true, pass: false, detail: "supports() rejected the fixture" };
    }

    repacker.dispatch({
      atlas,
      input,
      chunkKeys: input.chunks.map((_, i) => `selftest:${i}`),
      slotCoords: [0, 0, 0],
      token: "selftest",
    });
    const outcome = await repacker.flush()!;
    if (outcome.failed.length > 0) {
      return { supported: true, pass: false, detail: "dispatch failed (see console)" };
    }

    // CPU truth.
    const cpuOut = new Float32Array(elementCount);
    const cpuResult = repackBrick({ ...input, output: cpuOut });

    // Read the slot back (atlas is exactly one slot: 6×6×12 texels).
    const gpuOut = await readAtlasSlot(renderer, atlas.texture, [6, 6, 12]);

    let mismatches = 0;
    let firstMismatch = "";
    for (let i = 0; i < elementCount; i++) {
      const same =
        cpuOut[i] === gpuOut[i] || (Number.isNaN(cpuOut[i]) && Number.isNaN(gpuOut[i]));
      if (!same && mismatches++ === 0) {
        firstMismatch = ` first@${i}: cpu=${cpuOut[i]} gpu=${gpuOut[i]}`;
      }
    }
    const [gpu] = outcome.results;
    const statsMatch =
      gpu.min === cpuResult.min &&
      gpu.max === cpuResult.max &&
      gpu.uniformValue === cpuResult.uniformValue;

    const pass = mismatches === 0 && statsMatch;
    return {
      supported: true,
      pass,
      detail: pass
        ? `voxels + min/max identical (min ${gpu.min}, max ${gpu.max})`
        : `${mismatches}/${elementCount} voxel mismatches${firstMismatch};` +
          ` minmax gpu=[${gpu.min},${gpu.max},${gpu.uniformValue}]` +
          ` cpu=[${cpuResult.min},${cpuResult.max},${cpuResult.uniformValue}]`,
    };
  } catch (error) {
    return { supported: true, pass: false, detail: String(error) };
  } finally {
    repacker.dispose();
    disposeBrickAtlas(atlas);
  }
}

async function readAtlasSlot(
  renderer: SceneRenderer,
  texture: object,
  size: [number, number, number],
): Promise<Float32Array> {
  const device = getWebGPUDevice(renderer) as unknown as ReadbackDevice;
  const backend = (renderer as unknown as { backend: { get(o: object): { texture?: unknown } } })
    .backend;
  const gpuTexture = backend.get(texture)?.texture;
  if (!gpuTexture) throw new Error("atlas GPUTexture missing after initTexture");

  const bytesPerRow =
    Math.ceil((size[0] * 4) / BYTES_PER_ROW_ALIGN) * BYTES_PER_ROW_ALIGN;
  const buffer = device.createBuffer({
    label: "gpu-repack selftest readback",
    size: bytesPerRow * size[1] * size[2],
    usage: 0x0001 | 0x0008, // MAP_READ | COPY_DST
  });
  try {
    const encoder = device.createCommandEncoder();
    encoder.copyTextureToBuffer(
      { texture: gpuTexture, origin: [0, 0, 0] },
      { buffer, bytesPerRow, rowsPerImage: size[1] },
      size,
    );
    device.queue.submit([encoder.finish()]);
    await buffer.mapAsync(0x0001); // MAP_MODE_READ
    const mapped = buffer.getMappedRange();
    const out = new Float32Array(size[0] * size[1] * size[2]);
    for (let z = 0; z < size[2]; z++) {
      for (let y = 0; y < size[1]; y++) {
        const row = new Float32Array(mapped, (z * size[1] + y) * bytesPerRow, size[0]);
        out.set(row, (z * size[1] + y) * size[0]);
      }
    }
    buffer.unmap();
    return out;
  } finally {
    buffer.destroy();
  }
}
