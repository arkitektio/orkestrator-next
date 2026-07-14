import * as THREE from "three";
import type { BrickArray } from "../../../core/octree/brickRepack";
import type { BrickSpec } from "../../../core/octree/brickSpec";
import type { Vec3 } from "../../../core/octree/levelGeometry";
import { uploadTexSubImage3D } from "./texSubImage3d";
import type { SceneRenderer } from "../../gpu/sceneRenderer";

/**
 * The brick pool's GPU side: one big `Data3DTexture` per (layer, mode)
 * holding fixed-size slots. A slot stores one brick's `stored` voxels with
 * its channel slabs stacked along z (slot depth = stored.z × channelCount).
 *
 * The texture's backing array doubles as the context-loss mirror — every
 * slot write also lands there, so a lost context restores with a single
 * `needsUpdate` full upload instead of a refetch storm.
 */

export type BrickAtlas = {
  texture: THREE.Data3DTexture;
  kind: "r8" | "r32f";
  /** Texels one slot occupies ([stored.x, stored.y, stored.z × channels]). */
  slotSize: Vec3;
  slotGrid: Vec3;
  capacity: number;
  /** Texture extents in texels. */
  size: Vec3;
  /** Hardware-normalization factor (255 for R8, 1 for R32F). */
  dataScale: number;
  backing: BrickArray;
};

/**
 * Atlas storage format for a layer's dtype. This MUST mirror the codec worker's
 * DEFAULT-fidelity promotion (`lib/zarr/runner/codec-worker.ts`
 * `promoteChunkForTexture`): only **unsigned 8-bit** stays a `Uint8Array` and
 * uses an `R8` atlas; **every other dtype is promoted to `Float32Array`** and
 * uses `R32F`. In particular `int8`/`int16`/`uint16`/`uint32` all promote to
 * float32 — an earlier `dtype.includes("8")` test wrongly routed `int8` (a
 * signed, possibly-negative Float32Array) into a Uint8 R8 atlas, wrapping/
 * truncating its values.
 *
 * The scene never sets `textureFidelity`, so 'default' promotion is assumed. If
 * a caller ever requests 'low'/'high' fidelity (per-chunk-normalized uint8/
 * uint16), this decision would no longer match the worker's `promotedType` and
 * normalization would break — keep the two in lockstep.
 */
export const atlasKindForDtype = (dtype: string): "r8" | "r32f" => {
  const d = dtype.toLowerCase();
  // Canonical "uint8" contains no "u1"; numpy-style unsigned 8-bit is "|u1".
  const isUnsigned8 = d === "uint8" || d === "uint8clamped" || d.includes("u1");
  return isUnsigned8 ? "r8" : "r32f";
};

export function createBrickAtlas(opts: {
  spec: BrickSpec;
  dtype: string;
  desiredSlots: number;
  maxExtent: number;
  filter: "linear" | "nearest";
  /**
   * Native-WebGPU-backend only: let the GPU repack kernel `textureStore`
   * into the atlas. Applied only for r32f — `r8unorm` is not a core
   * storage-texture format, so an r8 atlas with this usage would fail
   * `createTexture` validation (r8 goes through a staging buffer in Phase B).
   */
  computeStorage?: boolean;
  /**
   * Override the dtype-derived kind. Used by phasor layers: their slabs hold a
   * DERIVED (g, s) — signed, in [-1, 1] — which an r8unorm atlas can neither
   * represent nor quantize acceptably (a 1/255 step in g is a visible step in
   * lifetime), so they force r32f even over uint8 source data.
   */
  kind?: "r8" | "r32f";
}): BrickAtlas {
  const { spec, dtype, desiredSlots, maxExtent, filter } = opts;
  const kind = opts.kind ?? atlasKindForDtype(dtype);
  const slotSize: Vec3 = [
    spec.stored[0],
    spec.stored[1],
    spec.stored[2] * spec.channelCount,
  ];

  const maxSlots: Vec3 = [
    Math.max(1, Math.floor(maxExtent / slotSize[0])),
    Math.max(1, Math.floor(maxExtent / slotSize[1])),
    Math.max(1, Math.floor(maxExtent / slotSize[2])),
  ];
  const wanted = Math.max(1, desiredSlots);
  const gx = Math.min(maxSlots[0], wanted);
  const gy = Math.min(maxSlots[1], Math.ceil(wanted / gx));
  const gz = Math.min(maxSlots[2], Math.ceil(wanted / (gx * gy)));
  const slotGrid: Vec3 = [gx, gy, gz];
  const capacity = gx * gy * gz;

  const size: Vec3 = [gx * slotSize[0], gy * slotSize[1], gz * slotSize[2]];
  const elementCount = size[0] * size[1] * size[2];
  const backing: BrickArray =
    kind === "r8" ? new Uint8Array(elementCount) : new Float32Array(elementCount);

  const texture = new THREE.Data3DTexture(backing, size[0], size[1], size[2]);
  // No explicit internalFormat: both backends derive it from format+type
  // (R8/R32F on WebGL2, r8unorm/r32float on WebGPU). Setting the WebGL enum
  // string here would be passed verbatim to GPUDevice.createTexture, which
  // throws and silently degrades the texture to a 1x1 2D placeholder.
  texture.format = THREE.RedFormat;
  texture.type = kind === "r8" ? THREE.UnsignedByteType : THREE.FloatType;
  texture.minFilter = filter === "linear" ? THREE.LinearFilter : THREE.NearestFilter;
  texture.magFilter = filter === "linear" ? THREE.LinearFilter : THREE.NearestFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.wrapR = THREE.ClampToEdgeWrapping;
  texture.unpackAlignment = 1;
  texture.flipY = false;
  texture.needsUpdate = true; // one full (zero) allocation upload

  if (opts.computeStorage && kind === "r32f") {
    // In three r184 this flag's ONLY effect on a sampled Data3DTexture is
    // adding GPUTextureUsage.STORAGE_BINDING at createTexture
    // (WebGPUTextureUtils.js) — sampling bindings key off isData3DTexture and
    // node code off isStorageTextureNode, both unaffected. Verified against
    // r184 source; the gpu-repack parity self-test guards three upgrades.
    (texture as THREE.Data3DTexture & { isStorageTexture?: boolean }).isStorageTexture = true;
  }

  return {
    texture,
    kind,
    slotSize,
    slotGrid,
    capacity,
    size,
    dataScale: kind === "r8" ? 255 : 1,
    backing,
  };
}

/** Upload one repacked brick into a slot (GPU + context-restore mirror). */
export function writeBrickToAtlas(
  renderer: SceneRenderer,
  atlas: BrickAtlas,
  slotCoords: Vec3,
  brick: BrickArray,
): boolean {
  const origin: [number, number, number] = [
    slotCoords[0] * atlas.slotSize[0],
    slotCoords[1] * atlas.slotSize[1],
    slotCoords[2] * atlas.slotSize[2],
  ];
  const ok = uploadTexSubImage3D(
    renderer,
    atlas.texture,
    atlas.kind,
    origin,
    [atlas.slotSize[0], atlas.slotSize[1], atlas.slotSize[2]],
    brick,
  );

  // Mirror into the backing store row by row.
  const [w, h] = [atlas.size[0], atlas.size[1]];
  const [bw, bh, bd] = atlas.slotSize;
  for (let z = 0; z < bd; z++) {
    for (let y = 0; y < bh; y++) {
      const src = (z * bh + y) * bw;
      const dest = ((origin[2] + z) * h + (origin[1] + y)) * w + origin[0];
      atlas.backing.set(brick.subarray(src, src + bw), dest);
    }
  }
  return ok;
}

export function disposeBrickAtlas(atlas: BrickAtlas): void {
  atlas.texture.dispose();
}
