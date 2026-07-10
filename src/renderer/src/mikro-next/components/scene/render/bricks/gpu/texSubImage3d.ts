import type * as THREE from "three";
import {
  getBackend,
  getFallbackGL,
  getWebGPUDevice,
  type SceneRenderer,
} from "../../gpu/sceneRenderer";

/**
 * Partial 3D-texture upload, dual-backend (P19 / WebGPU migration).
 *
 * - **WebGPU backend** (macOS Metal, etc.): `device.queue.writeTexture` on the
 *   backend's GPUTexture — the native path, no row-alignment constraints, no
 *   global unpack state (the ANGLE texSubImage3D slowness this replaces was
 *   ~17.5 ms/brick on an M2).
 * - **WebGL2 fallback backend**: raw `gl.texSubImage3D` on the backend's
 *   WebGLTexture, with the historical UNPACK_* resets (three leaks flipY /
 *   premultiply from 2D uploads; WebGL2 forbids both for 3D uploads — P3).
 * - **Texture not yet initialized** on either backend (first frames before the
 *   texture is bound by a draw): fall back to `texture.needsUpdate = true` —
 *   the CPU backing array mirrors every write, so a full re-spec is correct,
 *   just not incremental.
 *
 * All brick and page-level buffers are contiguous exactly at their upload
 * extents (tightly packed rows/images).
 */

export type TexelKind = "r8" | "r32f" | "rgba8ui";

const BYTES_PER_TEXEL: Record<TexelKind, number> = {
  r8: 1,
  r32f: 4,
  rgba8ui: 4,
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

  const record = backend.get(texture) as
    | { texture?: unknown; textureGPU?: WebGLTexture }
    | undefined;

  // --- Native WebGPU path ----------------------------------------------------
  const device = getWebGPUDevice(renderer);
  if (device) {
    const gpuTexture = record?.texture;
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

  // --- WebGL2 fallback path ----------------------------------------------------
  const gl = getFallbackGL(renderer);
  if (!gl) return false;

  const glTexture = record?.textureGPU;
  if (!glTexture) {
    texture.needsUpdate = true;
    return true;
  }

  // Bind through the backend's state tracker when available (keeps its
  // binding cache coherent, avoids a getParameter sync point under ANGLE).
  const state = (
    backend as unknown as {
      state?: { bindTexture?: (target: number, texture: WebGLTexture | null) => void };
    }
  ).state;
  const boundViaState = typeof state?.bindTexture === "function";
  let previous: WebGLTexture | null = null;
  if (boundViaState) {
    state!.bindTexture!(gl.TEXTURE_3D, glTexture);
  } else {
    previous = gl.getParameter(gl.TEXTURE_BINDING_3D) as WebGLTexture | null;
    gl.bindTexture(gl.TEXTURE_3D, glTexture);
  }
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.pixelStorei(gl.UNPACK_ROW_LENGTH, 0);
  gl.pixelStorei(gl.UNPACK_IMAGE_HEIGHT, 0);
  gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, 0);
  gl.pixelStorei(gl.UNPACK_SKIP_ROWS, 0);
  gl.pixelStorei(gl.UNPACK_SKIP_IMAGES, 0);
  // three sets these per 2D-texture upload (e.g. flipY colormap atlases) and
  // leaves them dangling; WebGL2 forbids both for 3D texture uploads (P3).
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

  const format = kind === "rgba8ui" ? gl.RGBA_INTEGER : gl.RED;
  const type = kind === "r32f" ? gl.FLOAT : gl.UNSIGNED_BYTE;

  gl.texSubImage3D(
    gl.TEXTURE_3D,
    0,
    dest[0],
    dest[1],
    dest[2],
    size[0],
    size[1],
    size[2],
    format,
    type,
    data as ArrayBufferView<ArrayBuffer>,
  );

  if (!boundViaState) gl.bindTexture(gl.TEXTURE_3D, previous);
  return true;
}
