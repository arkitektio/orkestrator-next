import { parquetMetadataAsync, parquetRead } from "hyparquet";
import type { AsyncBuffer, FileMetaData } from "hyparquet";
import { decompress as zstdDecompress } from "fzstd";

/**
 * One open Parquet object: its footer, parsed once, and the row groups a
 * planner asks for.
 *
 * This is where the format's locator pays off. A cell catalog row names the
 * `(part, rowGroup)` holding a cell, so a frame costs one footer per part
 * touched — cached for the life of the reader — plus the column chunks of the
 * row groups it actually needs. Not the level, and not the part.
 *
 * The footer is why `byteLength` is a constructor argument rather than
 * something discovered: it sits at the END of the file, our store speaks
 * get/get-range only, and there is no HEAD. The manifest records the length
 * precisely so this can work.
 */

/** Parquet page compression. Only ZSTD needs supplying — hyparquet ships the rest. */
export const PARQUET_COMPRESSORS = {
  ZSTD: (input: Uint8Array) => zstdDecompress(input),
};

/** Reads a byte span of one object. `end` is exclusive. */
export type RangeReader = (path: string, start: number, end: number) => Promise<Uint8Array>;

/**
 * hyparquet's file abstraction over a ranged reader.
 *
 * Deliberately not a `Blob` or a URL: every read has to go through our signed,
 * credential-rotating fetcher, and hyparquet's `AsyncBuffer` is exactly the
 * seam for that.
 */
export function asyncBufferFor(path: string, byteLength: number, read: RangeReader): AsyncBuffer {
  return {
    byteLength,
    async slice(start: number, end?: number): Promise<ArrayBuffer> {
      const stop = end ?? byteLength;
      if (stop <= start) return new ArrayBuffer(0);
      const bytes = await read(path, start, stop);
      // Copy rather than expose the reader's buffer: hyparquet holds slices,
      // and a cached Uint8Array must not be mutated underneath it.
      const out = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(out).set(bytes);
      return out;
    },
  };
}

export class ParquetPart {
  private metadataPromise: Promise<FileMetaData> | null = null;
  private readonly file: AsyncBuffer;

  constructor(
    readonly path: string,
    byteLength: number,
    read: RangeReader,
  ) {
    this.file = asyncBufferFor(path, byteLength, read);
  }

  /** The footer, parsed once and reused for every row group read out of this part. */
  metadata(): Promise<FileMetaData> {
    if (!this.metadataPromise) {
      this.metadataPromise = parquetMetadataAsync(this.file).catch((error: unknown) => {
        this.metadataPromise = null; // allow a retry after a transient failure
        throw error;
      });
    }
    return this.metadataPromise;
  }

  /**
   * The half-open row range of one row group.
   *
   * hyparquet has no `readRowGroup(i)`: row groups are selected by row-index
   * overlap, so the group's position is its cumulative row offset.
   */
  async rowRange(rowGroup: number): Promise<{ rowStart: number; rowEnd: number }> {
    const meta = await this.metadata();
    const groups = meta.row_groups;
    if (rowGroup < 0 || rowGroup >= groups.length) {
      throw new Error(
        `${this.path} has ${groups.length} row groups and the catalog names row group ${rowGroup}; ` +
          `the catalog and the geometry disagree.`,
      );
    }
    let rowStart = 0;
    for (let group = 0; group < rowGroup; group++) rowStart += Number(groups[group].num_rows);
    return { rowStart, rowEnd: rowStart + Number(groups[rowGroup].num_rows) };
  }

  /**
   * Read rows as plain objects.
   *
   * `utf8: false` is NOT optional. hyparquet defaults it to true, and its
   * conversion treats any bare BYTE_ARRAY as a string — which is exactly what
   * fabriks's `positions` and `indices` are. Leaving the default on turns every
   * geometry blob into mojibake with no error anywhere.
   */
  async readRows(
    columns: string[],
    range?: { rowStart: number; rowEnd: number },
  ): Promise<Record<string, unknown>[]> {
    const metadata = await this.metadata();
    let rows: Record<string, unknown>[] = [];
    await parquetRead({
      file: this.file,
      metadata,
      columns,
      compressors: PARQUET_COMPRESSORS,
      utf8: false,
      rowFormat: "object",
      ...(range ? { rowStart: range.rowStart, rowEnd: range.rowEnd } : {}),
      onComplete: (result) => {
        rows = result as unknown as Record<string, unknown>[];
      },
    });
    return rows;
  }

  /** Read exactly the rows of one row group. */
  async readRowGroup(rowGroup: number, columns: string[]): Promise<Record<string, unknown>[]> {
    return this.readRows(columns, await this.rowRange(rowGroup));
  }
}
