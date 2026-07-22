import type * as THREE from "three";
import {
  getBackend,
  getWebGPUDevice,
  type SceneRenderer,
} from "../gpu/sceneRenderer";

/**
 * Partial 3D-texture upload via `device.queue.writeTexture` on the backend's
 * GPUTexture (P19 / WebGPU migration) — the native path, with no row-alignment
 * constraints and no global unpack state. The ANGLE `texSubImage3D` path this
 * replaced cost ~17.5 ms/brick on an M2.
 *
 * When the texture is not yet initialized (first frames, before a draw has
 * bound it) this falls back to `texture.needsUpdate = true` — the CPU backing
 * array mirrors every write, so a full re-spec is correct, just not
 * incremental.
 *
 * All brick and page-level buffers are contiguous exactly at their upload
 * extents (tightly packed rows/images).
 */

export type TexelKind = "r8" | "r32f" | "rgba8";

const BYTES_PER_TEXEL: Record<TexelKind, number> = {
  r8: 1,
  r32f: 4,
  rgba8: 4,
};

export function uploadTexSubImage3D(
  renderer: SceneRenderer,
  texture: THREE.Data3DTexture,
  kind: TexelKind,
  dest: readonly [number, number, number],
  size: readonly [number, number, number],
  data: ArrayBufferView,
): boolean {
  const backend = getBackend(renderer);
  if (!backend) return false;

  const device = getWebGPUDevice(renderer);
  if (!device) return false;

  const gpuTexture = (backend.get(texture) as { texture?: unknown } | undefined)
    ?.texture;
  if (!gpuTexture) {
    // Not yet created by the backend (no draw has sampled it): a full
    // needsUpdate upload from the backing mirror is correct and rare.
    texture.needsUpdate = true;
    return true;
  }

  device.queue.writeTexture(
    { texture: gpuTexture, origin: [dest[0], dest[1], dest[2]] },
    data,
    {
      offset: 0,
      bytesPerRow: size[0] * BYTES_PER_TEXEL[kind],
      rowsPerImage: size[1],
    },
    [size[0], size[1], size[2]],
  );
  return true;
}
