import * as THREE from "three";

import type { LayerState } from "../../core/layerModel";
import type { SlabDesc } from "../../core/octree/levelGeometry";
import { buildColormapAtlas } from "../colormaps";
import { MAX_CHANNELS, MAX_CURSORS } from "./channelLimits";
import {
  buildChannelUniformData,
  blendModeToInt,
  type ChannelUniformData,
} from "./channelUniforms";

/**
 * Compositor uniforms for a MERGED volume pass — several co-pool layers drawn
 * in one raymarch.
 *
 * The single-layer layout already had the right shape for this: per-slot
 * scalars in two packed vec4 arrays, everything phasor-specific in textures.
 * Merging concatenates members' slots into those same 16 and slices them per
 * member, so the material gains no new uniform BINDINGS — which matters,
 * because every `uniformArray` is its own binding on the WebGPU backend and the
 * material already sits near the 12-per-stage device limit. The per-member
 * scalars below are plain `uniform()` nodes, which pack into three's shared
 * node uniform group and cost no binding.
 *
 * Each member is built by the EXISTING `buildChannelUniformData` and then
 * re-based onto its slot offset. That keeps one implementation of the
 * source/phasor/cursor semantics rather than a parallel copy that could drift —
 * and it is what lets the single-member case be asserted byte-identical to the
 * unmerged path (see `mergedChannelUniforms.test.ts`).
 */

export type MergedMemberInput = {
  layerId: string;
  layer: LayerState | undefined;
  /** Where this member's slots start in the merged arrays. */
  slotOffset: number;
};

export type MergedMemberUniforms = {
  layerId: string;
  /** First merged slot index this member owns. */
  slotFirst: number;
  /** How many merged slots it owns (already truncated to what fits). */
  slotCount: number;
  /** Per-member, applied across that member's own slots. */
  blendMode: number;
  /** `projectionModeToInt(layer.projection)` — filled by the caller. */
  projectionMode: number;
};

export type MergedChannelUniformData = Omit<
  ChannelUniformData,
  "numChannels" | "blendMode"
> & {
  /** Total slots used across every member. */
  numChannels: number;
  /** Blend of the FIRST member — kept only so the merged data can stand in for
   * `ChannelUniformData` where a single blend is expected; the shader reads the
   * per-member value from `members` instead. */
  blendMode: number;
  members: MergedMemberUniforms[];
};

const dataTexture = (width: number, height: number): THREE.DataTexture => {
  const texture = new THREE.DataTexture(
    new Float32Array(width * height * 4),
    width,
    height,
    THREE.RGBAFormat,
    THREE.FloatType,
  );
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
};

/** Texels per row of the source-params texture (mirrors channelUniforms). */
const SOURCE_PARAM_TEXELS = 3;
/** Texels per row of the cursor texture: 2 header + packed point pairs. */
const CURSOR_TEXELS = 2 + 24 / 2;

export function buildMergedChannelUniformData(
  members: readonly MergedMemberInput[],
  maxChannelIndex: number,
  minValue: number,
  maxValue: number,
  geometry: { slabs: readonly SlabDesc[]; channelSlabCount: number } | undefined,
  projectionModeOf: (layer: LayerState | undefined) => number,
): MergedChannelUniformData {
  const channelIndex = new Array<number>(MAX_CHANNELS).fill(0);
  const climMin = new Array<number>(MAX_CHANNELS).fill(0);
  const climMax = new Array<number>(MAX_CHANNELS).fill(1);
  const gamma = new Array<number>(MAX_CHANNELS).fill(1);
  const opacity = new Array<number>(MAX_CHANNELS).fill(1);
  const visible = new Array<number>(MAX_CHANNELS).fill(0);
  const invert = new Array<number>(MAX_CHANNELS).fill(0);
  const row = new Array<number>(MAX_CHANNELS).fill(0);

  const sourceParams = dataTexture(SOURCE_PARAM_TEXELS, MAX_CHANNELS);
  const params = sourceParams.image.data as Float32Array;
  const cursors = dataTexture(CURSOR_TEXELS, MAX_CURSORS);
  const cursorData = cursors.image.data as Float32Array;

  const colormapSpecs: { colormap: unknown; color?: number[] | null }[] = [];
  const out: MergedMemberUniforms[] = [];
  let cursorCount = 0;
  let used = 0;

  for (const input of members) {
    // One implementation of the per-source semantics, reused verbatim.
    const single = buildChannelUniformData(
      input.layer,
      maxChannelIndex,
      minValue,
      maxValue,
      geometry,
    );
    const slotFirst = used;
    const slotCount = Math.min(single.numChannels, MAX_CHANNELS - used);

    for (let i = 0; i < slotCount; i++) {
      const to = slotFirst + i;
      channelIndex[to] = single.channelIndex[i];
      climMin[to] = single.climMin[i];
      climMax[to] = single.climMax[i];
      gamma[to] = single.gamma[i];
      opacity[to] = single.opacity[i];
      visible[to] = single.visible[i];
      invert[to] = single.invert[i];
      // `row` is rebased below, once the merged atlas height is known.
      const from = i * SOURCE_PARAM_TEXELS * 4;
      params.set(
        (single.sourceParams.image.data as Float32Array).subarray(
          from,
          from + SOURCE_PARAM_TEXELS * 4,
        ),
        to * SOURCE_PARAM_TEXELS * 4,
      );
    }

    // Cursors carry the slot they belong to in their header (texel 0, .y), so
    // that field must be rebased onto the merged slot numbering.
    const singleCursors = single.cursors.image.data as Float32Array;
    for (let c = 0; c < single.cursorCount && cursorCount < MAX_CURSORS; c++) {
      const from = c * CURSOR_TEXELS * 4;
      const to = cursorCount * CURSOR_TEXELS * 4;
      cursorData.set(singleCursors.subarray(from, from + CURSOR_TEXELS * 4), to);
      const localSlot = singleCursors[from + 1];
      if (localSlot >= slotCount) {
        // Its source was truncated away; render nothing rather than paint over
        // another member's slot.
        cursorData[to + 3] = 0;
      }
      cursorData[to + 1] = slotFirst + localSlot;
      cursorCount += 1;
    }

    for (let i = 0; i < slotCount; i++) {
      const sources = (input.layer?.sources ?? input.layer?.channels ?? []).slice(
        0,
        MAX_CHANNELS,
      );
      const source = sources[i];
      colormapSpecs.push(
        source
          ? source.type === "phasor"
            ? { colormap: source.transfer.colormap, color: null }
            : { colormap: source.transfer.colormap, color: source.transfer.color }
          : { colormap: input.layer?.colormap, color: input.layer?.color },
      );
    }
    // A member with no sources still contributes the layer-level fallback row,
    // exactly as the single-layer builder does.
    if (slotCount === 0 && single.numChannels === 0) {
      colormapSpecs.push({ colormap: input.layer?.colormap, color: input.layer?.color });
    }

    out.push({
      layerId: input.layerId,
      slotFirst,
      slotCount,
      blendMode: blendModeToInt(input.layer?.blend),
      projectionMode: projectionModeOf(input.layer),
    });

    single.atlas.dispose();
    single.sourceParams.dispose();
    single.cursors.dispose();
    used += slotCount;
  }

  const atlas = buildColormapAtlas(
    colormapSpecs as Parameters<typeof buildColormapAtlas>[0],
  );
  // Rows index the MERGED atlas, whose height is the total spec count.
  const rows = Math.max(1, colormapSpecs.length);
  for (let i = 0; i < used; i++) row[i] = (i + 0.5) / rows;

  sourceParams.needsUpdate = true;
  cursors.needsUpdate = true;

  return {
    atlas,
    numChannels: used,
    blendMode: out[0]?.blendMode ?? 0,
    channelIndex,
    climMin,
    climMax,
    gamma,
    opacity,
    visible,
    invert,
    row,
    sourceParams,
    cursors,
    cursorCount,
    members: out,
  };
}
