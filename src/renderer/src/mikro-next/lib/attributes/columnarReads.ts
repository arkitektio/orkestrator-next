/**
 * Whole-column reads, kept columnar.
 *
 * Everything else in `lib/attributes` reads a handful of rows for a hover or a
 * rule editor, where a JS object per row is the right shape. A point layer is
 * the other case: it wants every row of two or three coordinate columns, and
 * the row shape is then the dominant cost rather than a convenience.
 *
 * The measured difference, for 5.5 M rows: the row path allocates about seven
 * objects per row per column — an Arrow proxy, a `toJSON` object, an
 * `Object.entries` array and its pairs, a mapped array, a rebuilt object — and
 * materialises the whole proxy array before mapping it, so the Arrow table, the
 * proxies and the records are all live at peak. That is ~77 M allocations and
 * gigabytes of transient garbage for two columns. This path is one typed array
 * per column, a view over Arrow's own buffer.
 *
 * It is also ONE scan. `readColumnByObjectId` is single-column by signature, so
 * reading x and y through it is two full passes over the parquet; here they are
 * two projections of one.
 */
import { escapeSqlIdentifier, escapeSqlLiteral } from "./sqlBind";
import type { ParquetStoreLike } from "./attributeTypes";
import type { AttributeLookupEngine } from "./lookupEngine";

/**
 * A column read columnwise: the ids, and the values parallel to them.
 *
 * `numeric` and `text` are the two shapes a column arrives in — a typed array
 * view over Arrow's buffer for a measure, a plain array of strings for a
 * category — and exactly one of them is set. Neither is a `Map`: this exists
 * precisely so a whole column does not have to become one.
 */
export type ColumnValues = {
  /** Object ids, parallel to the values. */
  ids: ArrayLike<number>;
  numeric: ArrayLike<number> | null;
  text: ArrayLike<string> | null;
  count: number;
};

/** The value at a row, whichever shape the column came back in. */
export const columnValueAt = (values: ColumnValues, index: number): unknown =>
  values.numeric ? values.numeric[index] : values.text ? values.text[index] : undefined;

/**
 * A column as numbers, or null when it did not come back as one.
 *
 * A numeric column is a typed array VIEW over the Arrow buffer; a Utf8 column
 * is a plain `Array` of strings. `ArrayBuffer.isView` separates them at runtime
 * rather than by a cast, so a column that is not what the caller assumed
 * becomes the refusal it already has a branch for instead of NaNs downstream.
 */
const asNumeric = (column: ArrayLike<number> | ArrayLike<string>): ArrayLike<number> | null =>
  ArrayBuffer.isView(column as unknown) ? (column as ArrayLike<number>) : null;

export type PositionColumns = {
  /** The column holding each row's object id — the table's INDEX coordinate. */
  key: string;
  x: string;
  y: string;
  /** Optional third dimension; a 2D table simply omits it. */
  z?: string | null;
};

export type PointPositions = {
  /** Object ids, parallel to the coordinate arrays. */
  ids: ArrayLike<number>;
  x: ArrayLike<number>;
  y: ArrayLike<number>;
  z: ArrayLike<number> | null;
  count: number;
};

/**
 * Every row's id and coordinates, as typed arrays.
 *
 * Returns null when the result cannot answer columnwise — a caller that gets
 * null should refuse rather than fall back to the row path, whose cost is the
 * whole reason this exists.
 */
export const readPointPositions = async (
  engine: AttributeLookupEngine,
  store: ParquetStoreLike,
  columns: PositionColumns,
): Promise<PointPositions | null> => {
  const wanted = ["object_id", "px", "py", ...(columns.z ? ["pz"] : [])];
  const projection = [
    `${escapeSqlIdentifier(columns.key)} AS object_id`,
    `${escapeSqlIdentifier(columns.x)} AS px`,
    `${escapeSqlIdentifier(columns.y)} AS py`,
    ...(columns.z ? [`${escapeSqlIdentifier(columns.z)} AS pz`] : []),
  ].join(", ");

  const read = await engine.readColumnsTyped(
    [store],
    (urlOf) => `SELECT ${projection} FROM read_parquet(${escapeSqlLiteral(urlOf(store.id))})`,
    wanted,
  );
  if (!read) return null;

  const ids = asNumeric(read.object_id);
  const x = asNumeric(read.px);
  const y = asNumeric(read.py);
  const z = columns.z ? asNumeric(read.pz) : null;
  // Coordinates that did not come back as numbers are not coordinates. Null,
  // for the same reason a result that cannot answer columnwise is null: the
  // caller refuses rather than falling back to the path this exists to avoid.
  if (!ids || !x || !y || (columns.z && !z)) return null;

  return { ids, x, y, z, count: ids.length };
};

/**
 * One column, as ids and values side by side — the colour table's read.
 *
 * The columnar twin of `readColumnByObjectId`, which builds a
 * `Map<number, unknown>` off the ROW path. Measured over 5.5 M rows that map
 * costs about 1.1 s to build and holds ~320 MB, before anything is painted; the
 * same read here is two typed arrays and no per-row object at all.
 *
 * `ORDER BY` is what makes several columns of one table comparable: two reads
 * of the same store and key column come back in the same row order, so a
 * colouring and a rule over that table line up by INDEX and neither needs an id
 * lookup. Without it the order is DuckDB's business and the alignment would be
 * a coincidence the painter could not check cheaply.
 *
 * Null when the result cannot answer columnwise, or when the key column is not
 * numeric — the caller falls back to the row path rather than guessing.
 */
export const readColumnValues = async (
  engine: AttributeLookupEngine,
  access: { store: ParquetStoreLike; keyColumn: string },
  column: string,
): Promise<ColumnValues | null> => {
  const key = escapeSqlIdentifier(access.keyColumn);
  const value = escapeSqlIdentifier(column);
  const read = await engine.readColumnsTyped(
    [access.store],
    (urlOf) =>
      `SELECT ${key} AS object_id, ${value} AS value FROM read_parquet(${escapeSqlLiteral(
        urlOf(access.store.id),
      )}) ORDER BY object_id`,
    ["object_id", "value"],
  );
  if (!read) return null;

  const ids = asNumeric(read.object_id);
  if (!ids) return null;

  const numeric = asNumeric(read.value);
  return {
    ids,
    numeric,
    // Not numeric means the column came back as strings — a categorical
    // colouring, which the painter ranks rather than quantises.
    text: numeric ? null : (read.value as ArrayLike<string>),
    count: ids.length,
  };
};
