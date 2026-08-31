/**
 * A network layer's active picker entries, resolved to what the packer and the
 * uniforms consume: `konnektionPack`'s `NetworkStyling` (the per-node half)
 * and the manager's `NetworkValueAppearance` (the how-it-looks half).
 *
 * The network picker is the one with three entry kinds, and they resolve from
 * three different places:
 *
 *  - a GRAPH entry names a per-node value the collection itself carries — no
 *    parquet, no DuckDB, no round trip: the values ride the decoded cells and
 *    the packer reads them there. Only the NAME travels through here.
 *  - a COLUMN entry is the mesh path verbatim: `resolveColumnValues` over the
 *    attribute plans, one full-column DuckDB scan per column, keyed by this
 *    collection's OBJECT ids. The per-object values are scattered per ordinal
 *    so the shader keeps exactly one value path.
 *  - a SPARSE entry reads one slice of a matrix, exactly as the mesh builder
 *    does.
 *
 * The semantics restated from `columnLut.ts`, which must not drift per layer
 * kind: rules AND together; `exclude` inverts the TEST; an unreadable entry is
 * SKIPPED and surfaced, never applied; an object with no row keeps its colour
 * and stays visible; a sparse rule reads absence as 0 (a slice is the complete
 * truth for its feature) while a column rule does not test an id it has no row
 * for.
 */

import type { AttributePlanLike } from "@/mikro-next/lib/attributes/attributeTypes";
import type { AttributeLookupEngine } from "@/mikro-next/lib/attributes/lookupEngine";

import {
  resolveColumnValues,
  ruleKeeps,
  looksNumeric,
  type ColumnLutEntryFilterBy,
} from "../../platform/attributes/columnLut";
import { readColumnByObjectIdCached } from "../../platform/attributes/columnValueCache";
import { DEFAULT_MEASURE_COLORMAP, paletteRowFor } from "../../platform/attributes/valueLut";
import { qualitativePalette } from "../../platform/layerui/colormap-utils";
import type { KonnektionObjectEntry } from "./konnektion/konnektionCatalogs";
import {
  IDENTITY_STYLING,
  type NetworkNodeRule,
  type NetworkStyling,
} from "./konnektion/konnektionPack";
import type { NetworkValueAppearance } from "./konnektionManager";

/** The layer fragment's entry shape, structurally — no generated-API import,
 *  so this module stays testable the way `konnektionPack` is. */
export type NetworkPickerColorBy = {
  kind?: string | null;
  attribute?: string | null;
  target?: string | null;
  table?: string | null;
  column?: string | null;
  dataset?: string | null;
  at?: readonly { axis: string; value: number }[] | null;
  colormap?: string | null;
  min?: number | null;
  max?: number | null;
  joinPath?: readonly { table: string; column: string }[] | null;
};

export type NetworkPickerFilterBy = NetworkPickerColorBy & {
  values?: readonly string[] | null;
  exclude?: boolean | null;
};

/** A loaded sparse matrix and its reader, exactly the mesh builder's pair. */
export type SparseSliceReader = (
  datasetId: string,
  at: readonly { axis: string; value: number }[],
) => Promise<{ values: Map<number, unknown> }>;

export type NetworkStylingResult = {
  styling: NetworkStyling;
  appearance: NetworkValueAppearance;
  /** Entries that do not render, each with why — badged, never silently applied. */
  skipped: string[];
};

const isGraph = (entry: { kind?: string | null }): boolean => entry.kind === "GRAPH";
const isSparse = (entry: { dataset?: string | null }): boolean => entry.dataset != null;

const IDENTITY_RESULT: NetworkStylingResult = {
  styling: IDENTITY_STYLING,
  appearance: { palette: null, climMin: null, climMax: null, colorize: false, applyToGlyphs: true },
  skipped: [],
};

/** The identity, for a layer with nothing active. A shared constant so the
 *  wiring effect can cheaply tell "nothing to do" from a resolved styling. */
export const identityNetworkStyling = (): NetworkStylingResult => IDENTITY_RESULT;

export const buildNetworkStyling = async ({
  colorBy,
  rules,
  vocabulary,
  objects,
  plans,
  engine,
  readSparse,
}: {
  /** The active colouring, or null when `activeColorBy` selects nothing. */
  colorBy: NetworkPickerColorBy | null;
  /** The ACTIVE rules, already indexed out of `filterBys`. */
  rules: readonly NetworkPickerFilterBy[];
  /** The collection's attribute vocabulary (`attributeVocabulary(manifest)`),
   *  what a GRAPH name is resolved against. */
  vocabulary: readonly string[];
  /** The object catalog, for the objectId → ordinal scatter. Needed only when
   *  an object-level entry is active. */
  objects: readonly KonnektionObjectEntry[] | null;
  plans: readonly AttributePlanLike[] | null;
  engine: AttributeLookupEngine | null;
  readSparse: SparseSliceReader | null;
}): Promise<NetworkStylingResult> => {
  const skipped: string[] = [];

  // ---- the GRAPH half: names only, values already ride the cells ----------
  const graphRules: NetworkNodeRule[] = [];
  for (const rule of rules) {
    if (!isGraph(rule)) continue;
    if (!rule.attribute) continue;
    if (!vocabulary.includes(rule.attribute)) {
      skipped.push(
        `rule over graph attribute '${rule.attribute}': the collection's manifest declares no such attribute`,
      );
      continue;
    }
    graphRules.push({
      attribute: rule.attribute,
      min: rule.min ?? null,
      max: rule.max ?? null,
      exclude: rule.exclude === true,
      target: rule.target === "EDGE" ? "EDGE" : "NODE",
    });
  }

  let valueAttribute: string | null = null;
  let appearance: NetworkValueAppearance = { ...IDENTITY_RESULT.appearance };
  if (colorBy && isGraph(colorBy)) {
    if (colorBy.attribute && vocabulary.includes(colorBy.attribute)) {
      valueAttribute = colorBy.attribute;
      appearance = {
        palette: paletteRowFor((colorBy.colormap ?? DEFAULT_MEASURE_COLORMAP) as never),
        climMin: colorBy.min ?? null,
        climMax: colorBy.max ?? null,
        colorize: true,
        applyToGlyphs: colorBy.target !== "EDGE",
      };
    } else {
      skipped.push(
        `colouring by graph attribute '${colorBy.attribute ?? "?"}': the collection's manifest declares no such attribute`,
      );
    }
  }

  // ---- the object half: DuckDB and sparse reads, scattered per ordinal ----
  const objectColorBy = colorBy && !isGraph(colorBy) ? colorBy : null;
  const objectRules = rules.filter((rule) => !isGraph(rule));

  let ordinalValues: Float32Array | null = null;
  let hiddenOrdinals: Set<number> | null = null;

  if (objectColorBy || objectRules.length > 0) {
    if (!objects || !plans || !engine) {
      skipped.push(
        "object-level entries: the attribute service, plans or object catalog are not available yet",
      );
    } else {
      const asRule = (rule: NetworkPickerFilterBy): ColumnLutEntryFilterBy => ({
        table: rule.table,
        column: rule.column,
        dataset: rule.dataset,
        at: rule.at,
        min: rule.min,
        max: rule.max,
        values: rule.values,
        exclude: rule.exclude === true,
        joinPath: rule.joinPath,
      });

      const resolved = await resolveColumnValues({
        colorBy:
          objectColorBy && !isSparse(objectColorBy)
            ? {
                table: objectColorBy.table,
                column: objectColorBy.column,
                min: objectColorBy.min,
                max: objectColorBy.max,
                joinPath: objectColorBy.joinPath,
              }
            : null,
        filterBys: objectRules.map(asRule),
        plans,
        engine,
        want: { kind: "network" },
        readColumn: readColumnByObjectIdCached,
      });
      skipped.push(...resolved.skipped);

      let colorValues = resolved.colorValues;
      if (objectColorBy && isSparse(objectColorBy)) {
        if (!readSparse) {
          skipped.push(
            `colouring over matrix ${objectColorBy.dataset}: no datalayer connection, so the slice could not be read`,
          );
        } else {
          try {
            colorValues = (await readSparse(objectColorBy.dataset as string, objectColorBy.at ?? []))
              .values;
          } catch (error) {
            skipped.push(
              `colouring over matrix ${objectColorBy.dataset}: ${error instanceof Error ? error.message : String(error)}`,
            );
          }
        }
      }

      const ruleValues = resolved.ruleValues.slice();
      await Promise.all(
        objectRules.map(async (rule, index) => {
          if (!isSparse(rule)) return;
          if (!readSparse) {
            skipped.push(
              `rule over matrix ${rule.dataset}: no datalayer connection, so the slice could not be read`,
            );
            return;
          }
          try {
            ruleValues[index] = (await readSparse(rule.dataset as string, rule.at ?? [])).values;
          } catch (error) {
            skipped.push(
              `rule over matrix ${rule.dataset}: ${error instanceof Error ? error.message : String(error)}`,
            );
          }
        }),
      );

      const ordinalCeiling = objects.reduce((top, object) => Math.max(top, object.ordinal), -1);

      if (colorValues && objectColorBy) {
        ordinalValues = new Float32Array(ordinalCeiling + 1).fill(Number.NaN);
        // Which branch a colouring takes is the `columnLut` split: a
        // qualitative colormap — or a column whose values are not numbers —
        // colours by the value's SORTED RANK so equal values share a colour;
        // a measure maps the number itself. A sparse slice is always measured
        // and reads absence as 0, the complete-truth rule.
        const qualitative =
          qualitativePalette((objectColorBy.colormap ?? "") as never) !== null ||
          !looksNumeric(colorValues.values());
        if (qualitative) {
          const ranks = new Map(
            [...new Set([...colorValues.values()].map((value) => String(value)))]
              .sort()
              .map((value, rank) => [value, rank] as const),
          );
          for (const object of objects) {
            const raw = colorValues.get(object.objectId);
            if (raw === undefined) continue;
            // rank + 0.5 with a 0..256 window lands exactly on the palette
            // row's texel `rank` — the NEAREST-sampled class colour, with no
            // edge texel rounding the top rank into the wrong class.
            ordinalValues[object.ordinal] = (ranks.get(String(raw)) ?? 0) + 0.5;
          }
          appearance = {
            palette: paletteRowFor((objectColorBy.colormap ?? "HUES") as never),
            climMin: 0,
            climMax: 256,
            colorize: true,
            applyToGlyphs: true,
          };
        } else {
          for (const object of objects) {
            const raw = colorValues.get(object.objectId);
            const value = isSparse(objectColorBy) ? Number(raw ?? 0) : Number(raw);
            if (raw === undefined && !isSparse(objectColorBy)) continue;
            if (Number.isFinite(value)) ordinalValues[object.ordinal] = value;
          }
          appearance = {
            palette: paletteRowFor((objectColorBy.colormap ?? DEFAULT_MEASURE_COLORMAP) as never),
            climMin: objectColorBy.min ?? null,
            climMax: objectColorBy.max ?? null,
            colorize: true,
            applyToGlyphs: true,
          };
        }
      }

      // Rules over object values → hidden ordinals, both visibility bits: a
      // hidden object is the mesh semantics, glyphs and segments alike.
      const hidden = new Set<number>();
      objectRules.forEach((rule, index) => {
        const map = ruleValues[index];
        if (!map) return; // unreadable: skipped above, applied to nothing
        const lutRule = asRule(rule);
        for (const object of objects) {
          const raw = map.get(object.objectId);
          // A column rule does not test an id it has no row for — a filter
          // must never hide something it never saw. A sparse rule reads
          // absence as 0 and tests everything.
          const tested = raw !== undefined ? raw : isSparse(rule) ? 0 : undefined;
          if (tested === undefined) continue;
          if (!ruleKeeps(lutRule, tested)) hidden.add(object.ordinal);
        }
      });
      if (hidden.size > 0) hiddenOrdinals = hidden;
    }
  }

  return {
    styling: {
      valueAttribute,
      ordinalValues,
      rules: graphRules,
      hiddenOrdinals,
    },
    appearance,
    skipped,
  };
};
