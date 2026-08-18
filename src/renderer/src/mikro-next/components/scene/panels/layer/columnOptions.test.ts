// @vitest-environment jsdom
// (`columnOptions.ts` imports the ColumnControl enum from the generated
// `graphql.ts`, whose Apollo hooks barrel touches `window` on load.)
import { describe, expect, it } from "vitest";

import { ColumnControl, type MeshColorByFragment } from "@/mikro-next/api/graphql";
import {
  activeColorByAfterRemoval,
  activeFilterBysAfterRemoval,
  colorByEntryToInput,
  entryMatchesOption,
  optionKey,
  toColorByInput,
  toFilterByInput,
  type ColumnOption,
} from "./columnOptions";

const column = (name: string, longName?: string) =>
  ({
    id: `col-${name}`,
    name,
    longName: longName ?? null,
    dtype: "double",
    role: "ATTRIBUTE",
    axisType: null,
    unit: null,
    order: 0,
  }) as ColumnOption["column"];

const table = (id: string, name: string) =>
  ({
    id,
    name,
    description: null,
    axisNames: [],
    store: { id: `store-${id}`, key: "k", bucket: "b", path: "p" },
    columns: [],
  }) as unknown as ColumnOption["table"];

const directOption = (): ColumnOption => ({
  __typename: "ColorByOption",
  control: ColumnControl.Measure,
  table: table("t1", "objects"),
  column: column("area"),
  joinPath: [],
});

/** The case the whole `joinPath` round-trip exists for: a `references` hop. */
const joinedOption = (): ColumnOption => ({
  __typename: "ColorByOption",
  control: ColumnControl.Categorical,
  table: table("t2", "tracks"),
  column: column("phenotype", "Phenotype"),
  joinPath: [{ table: table("t1", "objects"), column: column("track_id") }],
});

describe("option → input", () => {
  it("names the table by id and the column by name", () => {
    const input = toColorByInput(directOption());
    expect(input.table).toBe("t1");
    expect(input.column).toBe("area");
    expect(input.joinPath).toEqual([]);
  });

  it("collapses join steps to {table: id, column: name}", () => {
    const input = toColorByInput(joinedOption());
    expect(input.table).toBe("t2");
    expect(input.joinPath).toEqual([{ table: "t1", column: "track_id" }]);
  });

  it("qualifies a joined entry's label with its table, and leaves a direct one bare", () => {
    expect(toColorByInput(directOption()).label).toBe("area");
    expect(toColorByInput(joinedOption()).label).toBe("tracks · Phenotype");
  });

  it("defaults a filter rule to keeping rather than excluding", () => {
    expect(toFilterByInput(directOption()).exclude).toBe(false);
  });

  it("lets a caller patch the control fields without touching the address", () => {
    const input = toFilterByInput(directOption(), { min: 3, max: 9 });
    expect(input).toMatchObject({ table: "t1", column: "area", min: 3, max: 9 });
  });
});

describe("entry → input round trip", () => {
  // The regression this file mostly exists for: re-sending an entry without its
  // joinPath flattens the join to [] and silently resolves the same column name
  // against the wrong table.
  it("carries joinPath back through a read-modify-write", () => {
    const stored = {
      __typename: "MeshColorBy",
      table: "t2",
      column: "phenotype",
      joinPath: [{ __typename: "JoinStep", table: "t1", column: "track_id" }],
      colormap: null,
      classColors: null,
      label: "tracks · Phenotype",
    } as MeshColorByFragment;

    expect(colorByEntryToInput(stored).joinPath).toEqual([
      { table: "t1", column: "track_id" },
    ]);
  });

  it("matches a stored entry back to the option it came from", () => {
    const option = joinedOption();
    const stored = toColorByInput(option) as unknown as MeshColorByFragment;
    expect(entryMatchesOption(stored, option)).toBe(true);
    expect(entryMatchesOption(stored, directOption())).toBe(false);
  });

  it("keeps the direct and the joined reach of one column apart", () => {
    // Same table and column name, different path — two distinct candidates.
    const joined: ColumnOption = { ...directOption(), joinPath: joinedOption().joinPath };
    expect(optionKey(joined)).not.toBe(optionKey(directOption()));
  });
});

describe("active indices after a removal", () => {
  it("clears the colouring when the active one is what was removed", () => {
    expect(activeColorByAfterRemoval(1, 1)).toBeNull();
  });

  it("shifts a later colouring down and leaves an earlier one alone", () => {
    expect(activeColorByAfterRemoval(2, 1)).toBe(1);
    expect(activeColorByAfterRemoval(0, 1)).toBe(0);
    expect(activeColorByAfterRemoval(null, 1)).toBeNull();
  });

  it("drops the removed rule and shifts every later one down", () => {
    expect(activeFilterBysAfterRemoval([0, 1, 3], 1)).toEqual([0, 2]);
    expect(activeFilterBysAfterRemoval([0, 1], 2)).toEqual([0, 1]);
    expect(activeFilterBysAfterRemoval([], 0)).toEqual([]);
  });
});
