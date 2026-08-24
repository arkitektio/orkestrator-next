/**
 * The VALUE lookup table — the label path's half of `columnLut`.
 *
 * `columnLut` bakes a colour per slot. That is right for a mesh collection,
 * whose LUT is thousands of texels and rebuilt rarely, and wrong for a mask,
 * where it ties a multi-megabyte table to the colormap and the contrast window:
 * nudging a clim rebuilt and re-uploaded the whole thing to change nothing but
 * how a number becomes a hue. `columnLut.ts`'s own note about `uLutColorize`
 * already makes this argument for the base colour ("would tie the texture to
 * `uSeed` / `uSaturation` / `uValue`, which are LIVE uniforms") — this applies
 * it to the colormap as well.
 *
 * So this table holds a VALUE, and the colormap, the window and the palette
 * become uniforms. A gene switch rewrites the table; a clim or colormap change
 * does not touch it.
 *
 * ## The encoding
 *
 * RG8, holding one 16-bit code per slot, `code = G * 256 + R`:
 *
 *     0 … 65533   a value, quantised over [valueMin, valueMax]
 *     65534       visible, no value  -> the base colour (the id hash)
 *     65535       hidden             -> discarded when the filter is on
 *
 * Sixteen bits rather than eight because the quantisation window is now the
 * DATA's range rather than the user's: 8 bits over counts running 0…200 leaves
 * about six levels once a clim is dragged to 0…5, which is visible banding and
 * a regression on what is drawn today. 65,534 levels leave the window free.
 *
 * Two bytes per slot also halves the table against the RGBA8 one, which is what
 * brings a 2 µm bin lattice (5,479,660 slots, 11.0 MB) inside the budget.
 */
import * as THREE from "three";
import { ColorMap } from "@/mikro-next/api/graphql";
import { buildColormapAtlas } from "../gpu/colormaps";
import { qualitativePalette } from "../layerui/colormap-utils";
import { classColorFor } from "./columnLut";
import {
  LUT_WIDTH,
  ruleKeeps,
  type ColumnLutEntryColorBy,
  type ColumnLutEntryFilterBy,
  type ResolvedColumnValues,
} from "./columnLut";

/** The largest code that carries a value. */
export const VALUE_CODE_MAX = 65533;
/** Visible, but this slot has no value: keep the base colour. */
export const CODE_NO_VALUE = 65534;
/** Hidden by a filter. */
export const CODE_HIDDEN = 65535;

/** Bytes per slot. The whole point of the encoding. */
export const VALUE_LUT_BYTES_PER_TEXEL = 2;

export type ValueLut = {
  /** The texel bytes, as the texture wants them. */
  data: Uint8Array;
  /** The same buffer as 16-bit codes. Little-endian, so byte 0 is R (low). */
  view: Uint16Array;
  width: number;
  height: number;
  slotCount: number;
};

/** Texels a `slotCount` would allocate. */
export const valueLutTexels = (slotCount: number): number => {
  const count = Math.max(1, slotCount);
  const width = Math.min(LUT_WIDTH, count);
  return width * Math.max(1, Math.ceil(count / width));
};

/**
 * Allocate the table, every slot "visible, no value".
 *
 * That baseline is the identity: a slot no read covered keeps its hue hash and
 * stays visible, exactly as it would with no table bound at all — a filter must
 * never hide something it never saw.
 */
export const allocateValueLut = (slotCount: number): ValueLut => {
  const count = Math.max(1, slotCount);
  const width = Math.min(LUT_WIDTH, count);
  const height = Math.max(1, Math.ceil(count / width));
  const data = new Uint8Array(width * height * VALUE_LUT_BYTES_PER_TEXEL);
  const view = new Uint16Array(data.buffer);
  view.fill(CODE_NO_VALUE);
  return { data, view, width, height, slotCount: count };
};

/** Quantise a value in `[min, max]` onto `0 … VALUE_CODE_MAX`. */
export const encodeValue = (value: number, min: number, max: number): number => {
  const span = max - min;
  // A constant column is not a gradient; put it mid-range rather than dividing
  // by a zero span — the same rule the colour painter has always used.
  const t = span > 0 ? Math.min(Math.max((value - min) / span, 0), 1) : 0.5;
  return Math.round(t * VALUE_CODE_MAX);
};

/** The value a code stands for. The CPU twin of the shader's decode. */
export const decodeValue = (code: number, min: number, max: number): number =>
  min + ((max - min) * code) / VALUE_CODE_MAX;

export type ValueLutWindow = {
  /** The range the codes were quantised over. Feeds `uLutValueMin`/`Max`. */
  valueMin: number;
  valueMax: number;
};

export const paintValueLut = ({
  lut,
  slotOf,
  colorBy,
  filterBys,
  colorValues,
  ruleValues,
}: {
  lut: ValueLut;
  slotOf: (objectId: number) => number;
  colorBy: ColumnLutEntryColorBy | null;
  filterBys: readonly ColumnLutEntryFilterBy[];
} & Pick<ResolvedColumnValues, "colorValues" | "ruleValues">): ValueLutWindow => {
  const { view, slotCount } = lut;
  let valueMin = 0;
  let valueMax = 1;

  // ------------------------------------------------------------- visibility
  //
  // FIRST, unlike the colour table. There, visibility is its own channel and
  // can be decided after the colour; here one 16-bit code carries both, so a
  // blanket "hide everything" would erase the values it was meant to sit
  // alongside. Deciding visibility first and then declining to write a value
  // into a hidden slot keeps the two from fighting over the same bits.
  //
  // The answer for an id no rule mentions is a constant, and
  // `ruleKeeps(rule, undefined)` is that constant — derived rather than
  // reasoned about, so it cannot drift from the rule semantics.
  const active = filterBys
    .map((rule, index) => ({ rule, values: ruleValues[index] }))
    // A rule whose column could not be read applies to nothing rather than to
    // everything: silently hiding every object because a read failed is the
    // worst possible reading of "filter".
    .filter((entry): entry is { rule: ColumnLutEntryFilterBy; values: Map<number, unknown> } =>
      Boolean(entry.values),
    );

  if (active.length > 0) {
    if (!active.every(({ rule }) => ruleKeeps(rule, undefined))) {
      for (let slot = 0; slot < slotCount; slot += 1) view[slot] = CODE_HIDDEN;
    }
    const mentioned = new Set<number>();
    for (const { values } of active) for (const objectId of values.keys()) mentioned.add(objectId);
    for (const objectId of mentioned) {
      const slot = slotOf(objectId);
      if (slot < 0 || slot >= slotCount) continue;
      let keeps = true;
      for (const { rule, values } of active) {
        if (!ruleKeeps(rule, values.get(objectId))) {
          keeps = false;
          break;
        }
      }
      view[slot] = keeps ? CODE_NO_VALUE : CODE_HIDDEN;
    }
  }

  // ------------------------------------------------------------------ value
  if (colorBy && colorValues) {
    const named = colorBy.colormap ?? null;
    const palette = named !== null ? qualitativePalette(named) : null;

    if (palette !== null) {
      // Categorical: the code IS the rank, normalised onto the same 0..1 the
      // measure path uses, so the shader keeps exactly one path and the
      // difference lives entirely in what the palette row holds.
      const distinct = new Set<string>();
      for (const value of colorValues.values()) distinct.add(String(value));
      const ranks = new Map<string, number>();
      for (const value of [...distinct].sort()) ranks.set(value, ranks.size);
      for (const [objectId, raw] of colorValues) {
        if (raw === undefined || raw === null) continue;
        const slot = slotOf(objectId);
        if (slot < 0 || slot >= slotCount || view[slot] === CODE_HIDDEN) continue;
        // Texel centres: `(rank + 0.5) / 256` lands on the intended texel of a
        // 256-entry palette row rather than on the seam between two.
        const rank = (ranks.get(String(raw)) ?? 0) % 256;
        view[slot] = encodeValue((rank + 0.5) / 256, 0, 1);
      }
    } else {
      // Measure: quantise over the DATA's range, never the user's window. The
      // window is a uniform now, and a table quantised to it could not be
      // reused when it moved.
      let min = Number.POSITIVE_INFINITY;
      let max = Number.NEGATIVE_INFINITY;
      for (const value of colorValues.values()) {
        const candidate = Number(value);
        if (!Number.isFinite(candidate)) continue;
        if (candidate < min) min = candidate;
        if (candidate > max) max = candidate;
      }
      if (!Number.isFinite(min) || !Number.isFinite(max)) {
        min = 0;
        max = 1;
      }
      valueMin = min;
      valueMax = max;
      for (const [objectId, raw] of colorValues) {
        if (raw === undefined || raw === null) continue;
        const slot = slotOf(objectId);
        if (slot < 0 || slot >= slotCount || view[slot] === CODE_HIDDEN) continue;
        const value = Number(raw);
        if (!Number.isFinite(value)) continue;
        view[slot] = encodeValue(value, min, max);
      }
    }
  }

  return { valueMin, valueMax };
};

/**
 * Wrap the bytes as an RG8 texture.
 *
 * `NearestFilter` for the same reason the colour table uses it: this is a table
 * indexed by an exact integer, not an image, and any filtering would blend one
 * object's code into its neighbour's — which here would not merely blur a
 * colour, it would invent a value.
 */
export const valueLutTexture = (data: Uint8Array, width: number, height: number): THREE.DataTexture => {
  const texture = new THREE.DataTexture(data, width, height, THREE.RGFormat);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
};

/** The default colormap a measure colouring takes when it names none. */
export const DEFAULT_MEASURE_COLORMAP = ColorMap.Viridis;


/**
 * The 256-entry row the shader samples, for either sort of colormap.
 *
 * One row serves both, which is what keeps the shader on a single path: a
 * measure colouring ramps across it and a categorical one lands on one texel of
 * it, and the difference lives entirely in what the CPU wrote into the table.
 *
 * The continuous half reuses `buildColormapAtlas`, so a row is the same bytes
 * the image compositor draws with and comes out of the same `atlasRowCache`.
 * The qualitative half bakes `classColorFor(colormap, rank)` — the palette the
 * mesh instance colouring and the id hash already share.
 */
export const paletteRowFor = (colormap: ColorMap): THREE.DataTexture => {
  if (qualitativePalette(colormap) === null) return buildColormapAtlas([{ colormap }]);

  const width = 256;
  const data = new Uint8Array(width * 4);
  for (let rank = 0; rank < width; rank += 1) {
    const [r, g, b] = classColorFor(colormap, rank);
    const at = rank * 4;
    data[at] = r;
    data[at + 1] = g;
    data[at + 2] = b;
    data[at + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, width, 1, THREE.RGBAFormat);
  // NEAREST, unlike the continuous row: adjacent ranks are unrelated classes and
  // blending two of them would invent a colour belonging to neither.
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
};
