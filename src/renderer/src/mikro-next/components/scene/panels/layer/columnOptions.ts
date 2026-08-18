import {
  ColumnControl,
  TableColumnRole,
  type ColorByOptionFragment,
  type FilterByOptionFragment,
  type MeshColorByFragment,
  type MeshColorByInput,
  type MeshFilterByFragment,
  type MeshFilterByInput,
} from "@/mikro-next/api/graphql";

/**
 * The bridge between what the server OFFERS and what a mesh layer STORES.
 *
 * `colorByOptions` and `filterByOptions` return the same candidate set — one
 * coordinate-graph walk, two names — so `ColorByOption` and `FilterByOption`
 * are structurally identical and collapse into the one `ColumnOption` shape
 * every consumer here is written against.
 *
 * The option and the input deliberately do NOT share a shape: an option carries
 * whole `TableDataset` / `TableDatasetColumn` nodes (the picker needs their
 * names, roles, units and parquet stores), while the input names them by id and
 * by column name. `toColorByInput` / `toFilterByInput` are the single place
 * that translation happens — including the `joinPath`, whose step objects
 * collapse to `{ table: id, column: name }`.
 *
 * Why the entry→input mappers exist at all: `colorBys` / `filterBys` are
 * WHOLE-ARRAY replacements on `updateMeshLayer`, so adding or removing one
 * entry means re-sending every other entry. Round-tripping through
 * `colorByEntryToInput` keeps `joinPath` alive — read an entry without it and
 * send it back and the join silently flattens to `[]`, which resolves the same
 * column name against the wrong table.
 */

export type ColumnOption = ColorByOptionFragment | FilterByOptionFragment;

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

export const entryKey = (entry: {
  table: string;
  column: string;
  joinPath?: readonly JoinStepLike[] | null;
}): string => columnKey(entryJoinPath(entry), entry.table, entry.column);

/** Whether a stored entry is this option — same table, column and join. */
export const entryMatchesOption = (
  entry: { table: string; column: string; joinPath?: readonly JoinStepLike[] | null },
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
export const controlForRole = (role: TableColumnRole): ColumnControl =>
  role === TableColumnRole.Coordinate || role === TableColumnRole.Attribute
    ? ColumnControl.Measure
    : ColumnControl.Categorical;

// ---------------------------------------------------------------- option → input

export const toColorByInput = (
  option: ColumnOption,
  patch?: Partial<Omit<MeshColorByInput, "table" | "column" | "joinPath">>,
): MeshColorByInput => ({
  table: option.table.id,
  column: option.column.name,
  joinPath: optionJoinPath(option),
  label: optionEntryLabel(option),
  ...patch,
});

export const toFilterByInput = (
  option: ColumnOption,
  patch?: Partial<Omit<MeshFilterByInput, "table" | "column" | "joinPath">>,
): MeshFilterByInput => ({
  table: option.table.id,
  column: option.column.name,
  joinPath: optionJoinPath(option),
  label: optionEntryLabel(option),
  exclude: false,
  ...patch,
});

// ----------------------------------------------------------------- entry → input

export const colorByEntryToInput = (entry: MeshColorByFragment): MeshColorByInput => ({
  table: entry.table,
  column: entry.column,
  joinPath: entryJoinPath(entry),
  colormap: entry.colormap ?? null,
  classColors: entry.classColors ?? null,
  label: entry.label ?? null,
});

export const filterByEntryToInput = (entry: MeshFilterByFragment): MeshFilterByInput => ({
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
