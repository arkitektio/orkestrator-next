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

  const ids = read.object_id;
  return {
    ids,
    x: read.px,
    y: read.py,
    z: columns.z ? read.pz : null,
    count: ids.length,
  };
};
