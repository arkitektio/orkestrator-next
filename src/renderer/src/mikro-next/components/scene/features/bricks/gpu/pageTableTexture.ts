import * as THREE from "three";
import type { Vec3 } from "../../../platform/coords/levelGeometry";
import {
  encodePageEntry,
  pageEntryIndex,
  type PageFlag,
  type PageTableLayout,
} from "../octree/pageTableLayout";
import { uploadTexSubImage3D } from "./texSubImage3d";
import type { SceneRenderer } from "../../../platform/gpu/sceneRenderer";

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
  /**
   * Occupancy sidecar: an RG8 texture with the SAME layout, one texel per
   * page entry, carrying the brick's conservatively-quantized raw min/max
   * (`encodeOccupancyTexel` — g is INVERTED so the all-zero default decodes
   * to the full data range and never enables a skip). The volume raymarcher
   * reads it per RESIDENT step to hop bricks that are invisible under the
   * current transfer function (and, for MIP, bricks that cannot beat the
   * ray's accumulated max). Shares the page table's dirty boxes — occupancy
   * writes only ever happen inside `setPageEntry`.
   */
  occupancy: THREE.Data3DTexture;
  occMirrors: Uint8Array[];
  occBacking: Uint8Array;
  /**
   * Hierarchical-occupancy AGGREGATE sidecar (R4, `orkestrator.occHierarchy`):
   * an RG8 texture with the SAME layout where the texel at (level h, cell c)
   * carries the conservative union of the MEASURED ranges of every level-(h−1)
   * brick overlapping that cell — written only when ALL those children are
   * known (`features/bricks/octree/occupancyAggregate.ts`), all-zero otherwise ("unknown,
   * never hop"). This is a statement about the DATA, not residency: entries
   * survive eviction and are only cleared on a pool flush. Same dirty-box
   * flush as the other two textures.
   */
  aggregate: THREE.Data3DTexture | null;
  aggMirrors: Uint8Array[] | null;
  aggBacking: Uint8Array | null;
};

const configureTexture = (texture: THREE.Data3DTexture, format: THREE.PixelFormat) => {
  texture.format = format;
  texture.type = THREE.UnsignedByteType;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.wrapR = THREE.ClampToEdgeWrapping;
  texture.unpackAlignment = 1;
  texture.flipY = false;
  texture.needsUpdate = true;
};

export function createPageTableTexture(layout: PageTableLayout): PageTableTexture {
  const [w, h, d] = layout.size;
  const backing = new Uint8Array(w * h * d * 4); // all zero = UNMAPPED
  const occBacking = new Uint8Array(w * h * d * 2); // all zero = full range

  const texture = new THREE.Data3DTexture(backing, w, h, d);
  configureTexture(texture, THREE.RGBAFormat);
  const occupancy = new THREE.Data3DTexture(occBacking, w, h, d);
  configureTexture(occupancy, THREE.RGFormat);

  return {
    texture,
    layout,
    mirrors: layout.levelGrid.map(
      (grid) => new Uint8Array(grid[0] * grid[1] * grid[2] * 4),
    ),
    dirty: layout.levelGrid.map(() => null),
    backing,
    occupancy,
    occMirrors: layout.levelGrid.map(
      (grid) => new Uint8Array(grid[0] * grid[1] * grid[2] * 2),
    ),
    occBacking,
    // LAZY: allocated by ensureAggregate on first use (pool has
    // orkestrator.occHierarchy on) — the third texture and its per-level
    // flush upload must cost nothing while the default-off flag is off.
    aggregate: null,
    aggMirrors: null,
    aggBacking: null,
  };
}

/** Allocate the aggregate sidecar on first use (idempotent). Called at pool
 * creation when `orkestrator.occHierarchy` is on and defensively from
 * `setAggregateEntry`/the material builder. */
export function ensureAggregate(pageTable: PageTableTexture): THREE.Data3DTexture {
  if (pageTable.aggregate) return pageTable.aggregate;
  const [w, h, d] = pageTable.layout.size;
  const aggBacking = new Uint8Array(w * h * d * 2); // all zero = unknown, never hop
  const aggregate = new THREE.Data3DTexture(aggBacking, w, h, d);
  configureTexture(aggregate, THREE.RGFormat);
  pageTable.aggregate = aggregate;
  pageTable.aggBacking = aggBacking;
  pageTable.aggMirrors = pageTable.layout.levelGrid.map(
    (grid) => new Uint8Array(grid[0] * grid[1] * grid[2] * 2),
  );
  return aggregate;
}

/**
 * Write one aggregate texel at (level, cell) — `encodeOccupancyTexel` bytes
 * against the pool's occupancy ENCODE range, or `null` to reset the cell to
 * the all-zero "unknown, never hop" sentinel. Shares the page table's dirty
 * boxes, so the next `flushPageTable` uploads it.
 */
export function setAggregateEntry(
  pageTable: PageTableTexture,
  level: number,
  cell: Vec3,
  texel: readonly [number, number] | null,
): void {
  ensureAggregate(pageTable);
  const grid = pageTable.layout.levelGrid[level];
  const entry = pageEntryIndex(grid, cell);
  const r = texel?.[0] ?? 0;
  const g = texel?.[1] ?? 0;
  pageTable.aggMirrors![level][entry * 2] = r;
  pageTable.aggMirrors![level][entry * 2 + 1] = g;
  const box = pageTable.dirty[level];
  if (box === null) {
    pageTable.dirty[level] = {
      min: [cell[0], cell[1], cell[2]],
      max: [cell[0], cell[1], cell[2]],
    };
  } else {
    for (let axis = 0; axis < 3; axis++) {
      if (cell[axis] < box.min[axis]) box.min[axis] = cell[axis];
      if (cell[axis] > box.max[axis]) box.max[axis] = cell[axis];
    }
  }
  const offset = pageTable.layout.levelOffset[level];
  const [w, h] = [pageTable.layout.size[0], pageTable.layout.size[1]];
  const flat =
    ((offset[2] + cell[2]) * h + (offset[1] + cell[1])) * w + (offset[0] + cell[0]);
  pageTable.aggBacking![flat * 2] = r;
  pageTable.aggBacking![flat * 2 + 1] = g;
}

export function setPageEntry(
  pageTable: PageTableTexture,
  level: number,
  brick: Vec3,
  slot: Vec3 | null,
  flag: PageFlag,
  /** RESIDENT entries only: `encodeOccupancyTexel` bytes. Omitted (or a
   * non-RESIDENT flag) resets the texel to the conservative all-zero
   * "unknown, never skip" default. */
  occupancy?: readonly [number, number],
): void {
  const grid = pageTable.layout.levelGrid[level];
  const entry = pageEntryIndex(grid, brick);
  encodePageEntry(pageTable.mirrors[level], entry, slot, flag);
  const occR = occupancy?.[0] ?? 0;
  const occG = occupancy?.[1] ?? 0;
  pageTable.occMirrors[level][entry * 2] = occR;
  pageTable.occMirrors[level][entry * 2 + 1] = occG;
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
  pageTable.occBacking[texel * 2] = occR;
  pageTable.occBacking[texel * 2 + 1] = occG;
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
    const dest: Vec3 = [
      offset[0] + box.min[0],
      offset[1] + box.min[1],
      offset[2] + box.min[2],
    ];
    const pageOk = uploadTexSubImage3D(
      renderer,
      pageTable.texture,
      "rgba8",
      dest,
      [extent[0], extent[1], extent[2]],
      pageTable.mirrors[level],
      {
        offsetBytes: ((box.min[2] * grid[1] + box.min[1]) * grid[0] + box.min[0]) * 4,
        bytesPerRow: grid[0] * 4,
        rowsPerImage: grid[1],
      },
    );
    // The occupancy sidecar shares the dirty box (writes only happen through
    // `setPageEntry`); both uploads go through the same device, so they
    // succeed or fail together.
    const occOk = uploadTexSubImage3D(
      renderer,
      pageTable.occupancy,
      "rg8",
      dest,
      [extent[0], extent[1], extent[2]],
      pageTable.occMirrors[level],
      {
        offsetBytes: ((box.min[2] * grid[1] + box.min[1]) * grid[0] + box.min[0]) * 2,
        bytesPerRow: grid[0] * 2,
        rowsPerImage: grid[1],
      },
    );
    const aggOk = pageTable.aggregate
      ? uploadTexSubImage3D(
          renderer,
          pageTable.aggregate,
          "rg8",
          dest,
          [extent[0], extent[1], extent[2]],
          pageTable.aggMirrors![level],
          {
            offsetBytes:
              ((box.min[2] * grid[1] + box.min[1]) * grid[0] + box.min[0]) * 2,
            bytesPerRow: grid[0] * 2,
            rowsPerImage: grid[1],
          },
        )
      : true; // not allocated (flag off): nothing to upload
    if (pageOk && occOk && aggOk) {
      pageTable.dirty[level] = null;
      uploaded = true;
    }
  }
  return uploaded;
}

/** Reset every entry to UNMAPPED (slice-signature flushes). */
export function clearPageTable(pageTable: PageTableTexture): void {
  pageTable.backing.fill(0);
  pageTable.occBacking.fill(0);
  pageTable.aggBacking?.fill(0);
  for (let level = 0; level < pageTable.mirrors.length; level++) {
    const grid = pageTable.layout.levelGrid[level];
    pageTable.mirrors[level].fill(0);
    pageTable.occMirrors[level].fill(0);
    pageTable.aggMirrors?.[level].fill(0);
    pageTable.dirty[level] = {
      min: [0, 0, 0],
      max: [grid[0] - 1, grid[1] - 1, grid[2] - 1],
    };
  }
}

export function disposePageTable(pageTable: PageTableTexture): void {
  pageTable.texture.dispose();
  pageTable.occupancy.dispose();
  pageTable.aggregate?.dispose();
}
