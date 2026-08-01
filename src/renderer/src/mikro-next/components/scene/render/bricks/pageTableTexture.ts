import * as THREE from "three";
import type { Vec3 } from "../../core/octree/levelGeometry";
import {
  encodePageEntry,
  pageEntryIndex,
  type PageFlag,
  type PageTableLayout,
} from "../../core/octree/pageTableLayout";
import { uploadTexSubImage3D } from "./texSubImage3d";
import type { SceneRenderer } from "../gpu/sceneRenderer";

/**
 * GPU page table: ONE packed RGBA8 3D texture per (layer, mode) holding
 * every level's page grid (see `pageTableLayout`). CPU mirrors are kept per
 * level; a dirty level uploads only its dirty BOUNDING BOX, read strided
 * straight out of the mirror (`writeTexture` needs no staging copy). Whole-
 * level re-uploads were the old behavior and hurt precisely while streaming:
 * every drain frame touched at least one entry, and the finest level's grid —
 * the largest, up to hundreds of KB — was re-sent every frame.
 *
 * Format note: entries are byte-encoded (slot xyz + flag) but stored as plain
 * RGBA8 **unorm**, not RGBA8UI — three's WebGPU backend has no mapping for
 * `RGBAIntegerFormat` and its node builder types every sampled texture as
 * float anyway. The shader decodes with `round(value * 255)`, which is exact
 * for all 256 byte values on both backends.
 */

/** Inclusive per-level dirty bounds in level-grid coords; null = clean. */
type DirtyBox = {
  min: [number, number, number];
  max: [number, number, number];
} | null;

export type PageTableTexture = {
  texture: THREE.Data3DTexture;
  layout: PageTableLayout;
  /** Per-level RGBA8 mirrors, `levelGrid` sized, tightly packed. */
  mirrors: Uint8Array[];
  dirty: DirtyBox[];
  /** Full-texture mirror (`texture.image.data`) for context restore. */
  backing: Uint8Array;
};

export function createPageTableTexture(layout: PageTableLayout): PageTableTexture {
  const [w, h, d] = layout.size;
  const backing = new Uint8Array(w * h * d * 4); // all zero = UNMAPPED

  const texture = new THREE.Data3DTexture(backing, w, h, d);
  texture.format = THREE.RGBAFormat;
  texture.type = THREE.UnsignedByteType;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.wrapR = THREE.ClampToEdgeWrapping;
  texture.unpackAlignment = 1;
  texture.flipY = false;
  texture.needsUpdate = true;

  return {
    texture,
    layout,
    mirrors: layout.levelGrid.map(
      (grid) => new Uint8Array(grid[0] * grid[1] * grid[2] * 4),
    ),
    dirty: layout.levelGrid.map(() => null),
    backing,
  };
}

export function setPageEntry(
  pageTable: PageTableTexture,
  level: number,
  brick: Vec3,
  slot: Vec3 | null,
  flag: PageFlag,
): void {
  const grid = pageTable.layout.levelGrid[level];
  const entry = pageEntryIndex(grid, brick);
  encodePageEntry(pageTable.mirrors[level], entry, slot, flag);
  const box = pageTable.dirty[level];
  if (box === null) {
    pageTable.dirty[level] = {
      min: [brick[0], brick[1], brick[2]],
      max: [brick[0], brick[1], brick[2]],
    };
  } else {
    for (let axis = 0; axis < 3; axis++) {
      if (brick[axis] < box.min[axis]) box.min[axis] = brick[axis];
      if (brick[axis] > box.max[axis]) box.max[axis] = brick[axis];
    }
  }

  // Context-restore mirror (full-texture layout).
  const offset = pageTable.layout.levelOffset[level];
  const [w, h] = [pageTable.layout.size[0], pageTable.layout.size[1]];
  const texel =
    ((offset[2] + brick[2]) * h + (offset[1] + brick[1])) * w + (offset[0] + brick[0]);
  encodePageEntry(pageTable.backing, texel, slot, flag);
}

/** Upload every dirty level's bounding box; returns whether anything was
 * uploaded. The source reads strided from the level mirror (offset +
 * bytesPerRow/rowsPerImage), so no staging buffer is built. */
export function flushPageTable(
  renderer: SceneRenderer,
  pageTable: PageTableTexture,
): boolean {
  let uploaded = false;
  for (let level = 0; level < pageTable.mirrors.length; level++) {
    const box = pageTable.dirty[level];
    if (!box) continue;
    const grid = pageTable.layout.levelGrid[level];
    const offset = pageTable.layout.levelOffset[level];
    const extent: Vec3 = [
      box.max[0] - box.min[0] + 1,
      box.max[1] - box.min[1] + 1,
      box.max[2] - box.min[2] + 1,
    ];
    if (
      uploadTexSubImage3D(
        renderer,
        pageTable.texture,
        "rgba8",
        [offset[0] + box.min[0], offset[1] + box.min[1], offset[2] + box.min[2]],
        [extent[0], extent[1], extent[2]],
        pageTable.mirrors[level],
        {
          offsetBytes:
            ((box.min[2] * grid[1] + box.min[1]) * grid[0] + box.min[0]) * 4,
          bytesPerRow: grid[0] * 4,
          rowsPerImage: grid[1],
        },
      )
    ) {
      pageTable.dirty[level] = null;
      uploaded = true;
    }
  }
  return uploaded;
}

/** Reset every entry to UNMAPPED (slice-signature flushes). */
export function clearPageTable(pageTable: PageTableTexture): void {
  pageTable.backing.fill(0);
  for (let level = 0; level < pageTable.mirrors.length; level++) {
    const grid = pageTable.layout.levelGrid[level];
    pageTable.mirrors[level].fill(0);
    pageTable.dirty[level] = {
      min: [0, 0, 0],
      max: [grid[0] - 1, grid[1] - 1, grid[2] - 1],
    };
  }
}

export function disposePageTable(pageTable: PageTableTexture): void {
  pageTable.texture.dispose();
}
