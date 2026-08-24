import { describe, expect, it, vi } from "vitest";

import { readPointPositions } from "./columnarReads";
import type { AttributeLookupEngine } from "./lookupEngine";

const store = { id: "parquet-a", bucket: "b", key: "k" } as never;

/** An engine whose columnar read answers from typed arrays, as Arrow does. */
const engineWith = (
  columns: Record<string, ArrayLike<number>> | null,
  spy = vi.fn(),
): AttributeLookupEngine =>
  ({
    readColumnsTyped: (
      stores: unknown,
      buildSql: (urlOf: (id: string) => string) => string,
      wanted: readonly string[],
    ) => {
      spy(buildSql(() => "s3://bucket/key"), wanted);
      return Promise.resolve(columns);
    },
  }) as never;

describe("readPointPositions", () => {
  it("reads id and coordinates in ONE scan, as typed arrays", () => {
    // The property this exists for. The row path is single-column by signature,
    // so x and y through it are two full passes over the parquet AND ~7 JS
    // allocations per row per column. Here it is one projection and one typed
    // array per column — a view over Arrow's own buffer.
    const spy = vi.fn();
    const engine = engineWith(
      {
        object_id: new Float64Array([1, 2, 3]),
        px: new Float64Array([10, 20, 30]),
        py: new Float64Array([40, 50, 60]),
      },
      spy,
    );

    return readPointPositions(engine, store, { key: "bin_id", x: "x", y: "y" }).then((got) => {
      expect(got).not.toBeNull();
      expect(got!.count).toBe(3);
      expect(ArrayBuffer.isView(got!.x)).toBe(true);
      expect([...got!.x]).toEqual([10, 20, 30]);
      expect([...got!.y]).toEqual([40, 50, 60]);
      expect(got!.z).toBeNull();

      const [sql, wanted] = spy.mock.calls[0];
      expect(sql).toMatch(/SELECT .*AS object_id.*AS px.*AS py.*FROM read_parquet/s);
      // One statement, not one per column.
      expect(sql.match(/read_parquet/g)).toHaveLength(1);
      expect(wanted).toEqual(["object_id", "px", "py"]);
    });
  });

  it("carries a third dimension only when the table declares one", async () => {
    const spy = vi.fn();
    const engine = engineWith(
      {
        object_id: new Float64Array([1]),
        px: new Float64Array([1]),
        py: new Float64Array([2]),
        pz: new Float64Array([3]),
      },
      spy,
    );
    const got = await readPointPositions(engine, store, { key: "id", x: "x", y: "y", z: "z" });
    expect([...got!.z!]).toEqual([3]);
    expect(spy.mock.calls[0][1]).toEqual(["object_id", "px", "py", "pz"]);
  });

  it("returns null rather than falling back to the row path", async () => {
    // A result that cannot answer columnwise. Falling back would reintroduce
    // exactly the per-row cost this avoids, so the caller refuses instead.
    const got = await readPointPositions(engineWith(null), store, { key: "id", x: "x", y: "y" });
    expect(got).toBeNull();
  });

  it("quotes identifiers, so a column named like SQL cannot escape", async () => {
    const spy = vi.fn();
    const engine = engineWith(
      { object_id: new Float64Array(0), px: new Float64Array(0), py: new Float64Array(0) },
      spy,
    );
    await readPointPositions(engine, store, { key: 'id" FROM x --', x: "x", y: "y" });
    expect(spy.mock.calls[0][0]).toContain('"id"" FROM x --"');
  });
});
