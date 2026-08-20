import {
  ColumnControl,
  ColumnRole,
  type ColorMap,
  type ColorByOptionFragment,
  type FilterByOptionFragment,
  type LabelColorByFragment,
  type LabelColorByInput,
  type LabelFilterByFragment,
  type LabelFilterByInput,
  type MeshColorByFragment,
  type MeshColorByInput,
  type MeshFilterByFragment,
  type MeshFilterByInput,
} from "@/mikro-next/api/graphql";
import { paletteOfClassColors } from "./colormap-utils";

/**
 * The bridge between what the server OFFERS and what a MESH OR LABEL layer
 * STORES.
 *
 * `colorByOptions` and `filterByOptions` return the same candidate set — one
 * coordinate-graph walk, two names — so `ColorByOption` and `FilterByOption`
 * are structurally identical and collapse into the one `ColumnOption` shape
 * every consumer here is written against. The LABEL roots
 * (`labelColorByOptions` / `labelFilterByOptions`, keyed by the lens rather than
 * by a mesh collection) return those same two types, which is why one module
 * serves both layer kinds: a mask's pixel values dereference into a table by
 * exactly the FIELD edge a collection's object ids do.
 *
 * The option and the input deliberately do NOT share a shape: an option carries
 * whole `TableDataset` / `Column` nodes (the picker needs their
 * names, roles, units and parquet stores), while the input names them by id and
 * by column name. `toColorByInput` / `toFilterByInput` are the single place
 * that translation happens — including the `joinPath`, whose step objects
 * collapse to `{ table: id, column: name }`.
 *
 * Why the entry→input mappers exist at all: `colorBys` / `filterBys` are
 * WHOLE-ARRAY replacements on `updateMeshLayer` and on `updateLabelLayer`'s
 * `render`, so adding or removing one entry means re-sending every other entry.
 * Round-tripping through `colorByEntryToInput` keeps `joinPath` alive — read an
 * entry without it and send it back and the join silently flattens to `[]`,
 * which resolves the same column name against the wrong table.
 */

type OfferedOption = ColorByOptionFragment | FilterByOptionFragment;

/**
 * A candidate this module can actually execute: one naming a TABLE COLUMN.
 *
 * The server offers two kinds of candidate over one type. A column candidate
 * carries `table` and `column`; a SPARSE one carries `sparseDataset` and the
 * `axes` a position is named along, and leaves both of the others null —
 * "present exactly when `table` and `column` are null … an option is one or
 * the other, never both". Nothing here reads a sparse matrix yet, so the
 * pickers narrow with `isColumnOption` and the sparse half never reaches a
 * consumer written against `option.table.id`.
 */
export type ColumnOption = OfferedOption & {
  table: NonNullable<OfferedOption["table"]>;
  column: NonNullable<OfferedOption["column"]>;
};

export const isColumnOption = (option: OfferedOption): option is ColumnOption =>
  option.table != null && option.column != null;

/**
 * A stored colouring, either layer kind. `MeshColorByFragment` and
 * `LabelColorByFragment` are field-for-field identical — same relation, same
 * `joinPath`, same caption — so every consumer takes the union rather than
 * being written twice.
 */
export type ColorByEntry = MeshColorByFragment | LabelColorByFragment;

/**
 * A stored colouring the renderers can execute: the COLUMN arm of the same
 * either/or the options carry. A `SPARSE` entry names a `dataset` and a
 * position `at` instead and leaves `table`/`column` null; it round-trips
 * through `colorByEntryToInput` untouched, but no LUT is built from it.
 */
export type ColumnColorByEntry = ColorByEntry & { table: string; column: string };

export const isColumnColorBy = (entry: ColorByEntry): entry is ColumnColorByEntry =>
  entry.table != null && entry.column != null;

/** A stored filter rule, either layer kind. See `ColorByEntry`. */
export type FilterByEntry = MeshFilterByFragment | LabelFilterByFragment;

/**
 * What the mappers below RETURN, structurally.
 *
 * `MeshColorByInput` and `LabelColorByInput` are generated separately but have
 * identical fields, so the mappers are typed against the shape both satisfy
 * rather than against one of them (which would need a cast at every label call
 * site) or a generic parameter (which would make callers name the input type to
 * get anything back). A compile-time assertion below pins the equivalence, so
 * this stops being structurally true the moment the two inputs diverge on the
 * server — rather than silently sending a mesh-shaped entry to a label layer.
 */
export type ColorByInputLike = MeshColorByInput & LabelColorByInput;
export type FilterByInputLike = MeshFilterByInput & LabelFilterByInput;

/**
 * The equivalence the two aliases above rest on, asserted at compile time.
 *
 * An intersection is assignable to either half whatever they contain, so it
 * proves nothing on its own — hence the mutual-extends check. If the server
 * ever gives a label colouring a field a mesh one lacks (or vice versa),
 * `MutuallyAssignable` resolves to `false`, `= true` stops compiling, and that
 * is the signal to split the mappers rather than widen a cast.
 */
type MutuallyAssignable<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const _colorByInputsMatch: MutuallyAssignable<MeshColorByInput, LabelColorByInput> = true;
const _filterByInputsMatch: MutuallyAssignable<MeshFilterByInput, LabelFilterByInput> = true;
void _colorByInputsMatch;
void _filterByInputsMatch;

/** The `joinPath` shape both the options and the stored entries reduce to. */
type JoinStepLike = { table: string; column: string };

const optionJoinPath = (option: ColumnOption): JoinStepLike[] =>
  option.joinPath.map((step) => ({ table: step.table.id, column: step.column.name }));

/**
 * Field by field, never a spread: a step read back off the wire carries
 * `__typename`, and `JoinStepInput` has no such field — spreading it sends an
 * unknown key into the mutation's variables.
 */
const entryJoinPath = (entry: {
  joinPath?: readonly JoinStepLike[] | null;
}): JoinStepLike[] =>
  (entry.joinPath ?? []).map((step) => ({ table: step.table, column: step.column }));

/**
 * The identity of a candidate: the same (joinPath, table, column) triple the
 * server keys an option by. Two columns of the same name in two tables — or the
 * same column reached directly and through a hop — are different candidates,
 * so all three parts are in the key.
 */
const columnKey = (
  joinPath: readonly JoinStepLike[],
  table: string,
  column: string,
): string =>
  `${joinPath.map((step) => `${step.table}.${step.column}`).join(">")}|${table}|${column}`;

export const optionKey = (option: ColumnOption): string =>
  columnKey(optionJoinPath(option), option.table.id, option.column.name);

/**
 * A stored entry's identity. A sparse entry names no column, so it keys on
 * what it does name — its dataset and position — rather than collapsing every
 * one of them onto the same empty `||` key.
 */
export const entryKey = (entry: {
  table?: string | null;
  column?: string | null;
  dataset?: string | null;
  at?: readonly { axis: string; value: number }[] | null;
  joinPath?: readonly JoinStepLike[] | null;
}): string =>
  entry.table != null && entry.column != null
    ? columnKey(entryJoinPath(entry), entry.table, entry.column)
    : `sparse|${entry.dataset ?? "?"}|${(entry.at ?? [])
        .map((position) => `${position.axis}=${position.value}`)
        .join(",")}`;

/** Whether a stored entry is this option — same table, column and join. */
export const entryMatchesOption = (
  entry: {
    table?: string | null;
    column?: string | null;
    joinPath?: readonly JoinStepLike[] | null;
  },
  option: ColumnOption,
): boolean => entryKey(entry) === optionKey(option);

/** What a picker captions a candidate with; `longName` when the table has one. */
export const optionLabel = (option: ColumnOption): string =>
  option.column.longName?.trim() || option.column.name;

/**
 * The default `label` written onto a new entry. The server accepts null and
 * derives its own, but a joined column is ambiguous without its table — two
 * tables reached through one collection can both declare `area`.
 */
export const optionEntryLabel = (option: ColumnOption): string =>
  option.joinPath.length > 0
    ? `${option.table.name} · ${optionLabel(option)}`
    : optionLabel(option);

export const isMeasure = (option: ColumnOption): boolean =>
  option.control === ColumnControl.Measure;

/** A picker entry captions itself; the column is the fallback name. */
export const entryLabel = (entry: {
  label?: string | null;
  column?: string | null;
}): string => entry.label?.trim() || entry.column || "a sparse slice";

/**
 * A filter rule in words, for its row's detail line and the toggle's tooltip.
 * Which half applies follows from the column's role: bounds for a measure, an
 * explicit set for a categorical — the same either/or the input models.
 */
export const describeFilterRule = (rule: {
  min?: number | null;
  max?: number | null;
  values?: readonly string[] | null;
}): string => {
  if (rule.values && rule.values.length > 0) {
    return `is one of ${rule.values.slice(0, 4).join(", ")}${
      rule.values.length > 4 ? `, +${rule.values.length - 4} more` : ""
    }`;
  }
  if (rule.min != null && rule.max != null) return `is between ${rule.min} and ${rule.max}`;
  if (rule.min != null) return `is at least ${rule.min}`;
  if (rule.max != null) return `is at most ${rule.max}`;
  return "matches";
};

/**
 * A colouring in words, for its row's second line. Which half applies is the
 * measure/categorical split again: a colormap is a ramp over the column's
 * range, and a categorical column takes a colour per distinct value instead —
 * explicit ones when the entry carries a `classColors` map, derived otherwise.
 */
export const describeColouring = (entry: {
  colormap?: ColorMap | null;
  classColors?: unknown;
  min?: number | null;
  max?: number | null;
}): string => {
  if (entry.colormap) {
    return entry.min != null || entry.max != null
      ? `${entry.colormap.toLowerCase()} over ${entry.min ?? "…"} … ${entry.max ?? "…"}`
      : `${entry.colormap.toLowerCase()} over the column's range`;
  }
  const palette = paletteOfClassColors(entry.classColors);
  if (palette) return `"${palette}" palette per value`;
  return entry.classColors ? "explicit colours per value" : "a colour per distinct value";
};

/**
 * A joined entry is stored and honoured by the server, but neither renderer
 * executes the `references` hop yet (see the LIMITATION note in
 * `fabriksColorLut.ts`), so a card badges it rather than silently doing nothing
 * on screen.
 */
export const isJoinedEntry = (entry: {
  joinPath?: readonly unknown[] | null;
}): boolean => (entry.joinPath?.length ?? 0) > 0;

/** What that badge says, appended to a row's tooltip. */
export const JOINED_NOTE = " — reached through a join, not rendered yet";

/** The same, for the SPARSE arm: stored and round-tripped, never drawn. */
export const SPARSE_NOTE = " — reads a sparse matrix, not rendered yet";

/**
 * The control a column admits, from its declared role — the same rule the
 * server derives `ColumnControl` by, restated here because a STORED entry
 * carries only its table id and column name and has to be re-classified from
 * the table's own declaration when the picker that created it is long gone.
 *
 * Measured-and-ordered values take a colormap and a bound; naming values take
 * an explicit colour map and a value set, because a colormap or a range over
 * them would impose an order they do not have.
 */
export const controlForRole = (role: ColumnRole): ColumnControl =>
  role === ColumnRole.Coordinate || role === ColumnRole.Attribute
    ? ColumnControl.Measure
    : ColumnControl.Categorical;

// ---------------------------------------------------------------- option → input

export const toColorByInput = (
  option: ColumnOption,
  patch?: Partial<Omit<ColorByInputLike, "table" | "column" | "joinPath">>,
): ColorByInputLike => ({
  table: option.table.id,
  column: option.column.name,
  joinPath: optionJoinPath(option),
  label: optionEntryLabel(option),
  ...patch,
});

export const toFilterByInput = (
  option: ColumnOption,
  patch?: Partial<Omit<FilterByInputLike, "table" | "column" | "joinPath">>,
): FilterByInputLike => ({
  table: option.table.id,
  column: option.column.name,
  joinPath: optionJoinPath(option),
  label: optionEntryLabel(option),
  exclude: false,
  ...patch,
});

// ----------------------------------------------------------------- entry → input

/**
 * Every field, including the ones no picker here authors: `colorBys` is a
 * WHOLE-ARRAY replace, so a `SPARSE` entry read back and re-sent without its
 * `kind`, `dataset` and `at` would come back a COLUMN entry naming nothing —
 * the `joinPath` hazard again, one arm further out.
 */
export const colorByEntryToInput = (entry: ColorByEntry): ColorByInputLike => ({
  kind: entry.kind,
  table: entry.table ?? null,
  column: entry.column ?? null,
  dataset: entry.dataset ?? null,
  at: (entry.at ?? []).map((position) => ({
    axis: position.axis,
    value: position.value,
  })),
  joinPath: entryJoinPath(entry),
  colormap: entry.colormap ?? null,
  classColors: entry.classColors ?? null,
  label: entry.label ?? null,
  min: entry.min ?? null,
  max: entry.max ?? null,
});

export const filterByEntryToInput = (entry: FilterByEntry): FilterByInputLike => ({
  table: entry.table,
  column: entry.column,
  joinPath: entryJoinPath(entry),
  min: entry.min ?? null,
  max: entry.max ?? null,
  values: entry.values ?? null,
  exclude: entry.exclude,
  label: entry.label ?? null,
});

// ------------------------------------------------------------- index bookkeeping

/**
 * `activeColorBy` and `activeFilterBys` are INDICES into the arrays being
 * resliced, so removing an entry has to repoint them in the same mutation:
 * dropping entry `k` shifts every later entry down by one, and an index left
 * pointing at `k` now names its successor.
 */
export const activeColorByAfterRemoval = (
  activeColorBy: number | null,
  removed: number,
): number | null => {
  if (activeColorBy === null) return null;
  if (activeColorBy === removed) return null;
  return activeColorBy > removed ? activeColorBy - 1 : activeColorBy;
};

export const activeFilterBysAfterRemoval = (
  activeFilterBys: readonly number[],
  removed: number,
): number[] =>
  activeFilterBys
    .filter((index) => index !== removed)
    .map((index) => (index > removed ? index - 1 : index))
    .sort((a, b) => a - b);
