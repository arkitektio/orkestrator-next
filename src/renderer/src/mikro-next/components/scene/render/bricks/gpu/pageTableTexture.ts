import * as THREE from "three";
import type { Vec3 } from "../../../core/octree/levelGeometry";
import {
  encodePageEntry,
  pageEntryIndex,
  type PageFlag,
  type PageTableLayout,
} from "../../../core/octree/pageTableLayout";
import { uploadTexSubImage3D } from "./texSubImage3d";
import type { SceneRenderer } from "../../gpu/sceneRenderer";

/**
 * GPU page table: ONE packed RGBA8UI 3D texture per (layer, mode) holding
 * every level's page grid (see `pageTableLayout`). CPU mirrors are kept per
 * level; a dirty level re-uploads whole — level grids are small (hundreds of
 * KB at the very worst), so batching beats bookkeeping sub-rectangles.
 */

export type PageTableTexture = {
  texture: THREE.Data3DTexture;
  layout: PageTableLayout;
  /** Per-level RGBA8 mirrors, `levelGrid` sized, tightly packed. */
  mirrors: Uint8Array[];
  dirty: boolean[];
  /** Full-texture mirror (`texture.image.data`) for context restore. */
  backing: Uint8Array;
};

export function createPageTableTexture(layout: PageTableLayout): PageTableTexture {
  const [w, h, d] = layout.size;
  const backing = new Uint8Array(w * h * d * 4); // all zero = UNMAPPED

  const texture = new THREE.Data3DTexture(backing, w, h, d);
  texture.format = THREE.RGBAIntegerFormat;
  texture.type = THREE.UnsignedByteType;
  texture.internalFormat = "RGBA8UI";
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
    dirty: layout.levelGrid.map(() => false),
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
  pageTable.dirty[level] = true;

  // Context-restore mirror (full-texture layout).
  const offset = pageTable.layout.levelOffset[level];
  const [w, h] = [pageTable.layout.size[0], pageTable.layout.size[1]];
  const texel =
    ((offset[2] + brick[2]) * h + (offset[1] + brick[1])) * w + (offset[0] + brick[0]);
  encodePageEntry(pageTable.backing, texel, slot, flag);
}

/** Upload every dirty level region; returns whether anything was uploaded. */
export function flushPageTable(
  renderer: SceneRenderer,
  pageTable: PageTableTexture,
): boolean {
  let uploaded = false;
  for (let level = 0; level < pageTable.mirrors.length; level++) {
    if (!pageTable.dirty[level]) continue;
    const grid = pageTable.layout.levelGrid[level];
    const offset = pageTable.layout.levelOffset[level];
    if (
      uploadTexSubImage3D(
        renderer,
        pageTable.texture,
        "rgba8ui",
        [offset[0], offset[1], offset[2]],
        [grid[0], grid[1], grid[2]],
        pageTable.mirrors[level],
      )
    ) {
      pageTable.dirty[level] = false;
      uploaded = true;
    }
  }
  return uploaded;
}

/** Reset every entry to UNMAPPED (slice-signature flushes). */
export function clearPageTable(pageTable: PageTableTexture): void {
  pageTable.backing.fill(0);
  for (let level = 0; level < pageTable.mirrors.length; level++) {
    pageTable.mirrors[level].fill(0);
    pageTable.dirty[level] = true;
  }
}

export function disposePageTable(pageTable: PageTableTexture): void {
  pageTable.texture.dispose();
}
