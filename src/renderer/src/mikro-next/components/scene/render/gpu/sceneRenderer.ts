import type { WebGPURenderer } from "three/webgpu";

/**
 * The scene's renderer is three's `WebGPURenderer` — which runs on either a
 * native WebGPU backend (Metal on macOS: the fix for the ANGLE texSubImage3D
 * upload stalls, P19) or its automatic WebGL2 fallback backend. This module is
 * the ONE place that touches backend internals, so callers stay
 * backend-agnostic.
 *
 * Minimal structural typings for the WebGPU objects we touch — the repo does
 * not depend on @webgpu/types, and we only use a handful of members.
 */

export type SceneRenderer = WebGPURenderer;

type MinimalGPUDevice = {
  queue: {
    writeTexture: (
      destination: { texture: unknown; origin: [number, number, number]; mipLevel?: number },
      data: ArrayBufferView,
      dataLayout: { offset?: number; bytesPerRow: number; rowsPerImage: number },
      size: [number, number, number],
    ) => void;
  };
  limits: { maxTextureDimension3D?: number };
  /** GPUAdapterInfo — on the device per the WebGPU spec. */
  adapterInfo?: { vendor?: string; architecture?: string; device?: string; description?: string };
};

type MinimalBackend = {
  isWebGPUBackend?: boolean;
  isWebGLBackend?: boolean;
  device?: MinimalGPUDevice;
  gl?: WebGL2RenderingContext;
  get: (object: object) => { texture?: unknown };
};

export function getBackend(renderer: SceneRenderer): MinimalBackend | null {
  return ((renderer as unknown as { backend?: MinimalBackend }).backend ?? null);
}

export function isWebGPUBackend(renderer: SceneRenderer): boolean {
  return getBackend(renderer)?.isWebGPUBackend === true;
}

/** GPUDevice when running the native WebGPU backend, else null. */
export function getWebGPUDevice(renderer: SceneRenderer): MinimalGPUDevice | null {
  const backend = getBackend(renderer);
  return backend?.isWebGPUBackend ? (backend.device ?? null) : null;
}

/** WebGL2 context when running the WebGL fallback backend, else null. */
export function getFallbackGL(renderer: SceneRenderer): WebGL2RenderingContext | null {
  const backend = getBackend(renderer);
  return backend?.isWebGLBackend ? (backend.gl ?? null) : null;
}

/** Backend-side data record for a texture (GPUTexture / WebGLTexture handle). */
export function getBackendTexture(renderer: SceneRenderer, texture: object): unknown {
  return getBackend(renderer)?.get(texture)?.texture ?? null;
}

/** 3D-texture extent limit (2048 under ANGLE; device limit under WebGPU). */
export function getMax3DTextureSize(renderer: SceneRenderer): number {
  const device = getWebGPUDevice(renderer);
  if (device?.limits.maxTextureDimension3D) return device.limits.maxTextureDimension3D;
  const gl = getFallbackGL(renderer);
  if (gl) return gl.getParameter(gl.MAX_3D_TEXTURE_SIZE) as number;
  return 2048; // conservative default (matches ANGLE)
}

/** Human-readable GPU identity for the quality governor's persistence key. */
export function getGpuKey(renderer: SceneRenderer): string {
  const backend = getBackend(renderer);
  const info = backend?.isWebGPUBackend ? backend.device?.adapterInfo : undefined;
  if (info) {
    const key = [info.vendor, info.architecture, info.device, info.description]
      .filter(Boolean)
      .join(" ");
    if (key) return `webgpu:${key}`;
  }
  const gl = backend?.gl;
  if (gl) {
    try {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const name = ext
        ? (gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string)
        : (gl.getParameter(gl.RENDERER) as string);
      if (name) return `webgl:${name}`;
    } catch {
      /* fall through */
    }
  }
  return "unknown";
}
