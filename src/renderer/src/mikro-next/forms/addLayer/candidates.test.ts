import { describe, expect, it } from "vitest";
import type { TableColumnRole } from "../../api/graphql";
import {
  Candidate,
  Capabilities,
  SpaceLike,
  candidateRow,
  groupCandidates,
} from "./candidates";

// Spelled as wire values, for the same reason candidates.ts does: importing the
// generated enum would drag the Apollo client into a node-environment suite.
const COORDINATE = "COORDINATE" as TableColumnRole;
const TRACK_ID = "TRACK_ID" as TableColumnRole;

const lens = (id: string, dataset = "dapi.zarr"): Candidate => ({
  __typename: "Lens",
  id,
  shape: [512, 512],
  axisNames: ["y", "x"],
  slices: [],
  dataset: { id: `ds-${id}`, name: dataset, description: null },
});

const table = (id: string, roles: TableColumnRole[]): Candidate => ({
  __typename: "TableDataset",
  id,
  name: "localisations",
  description: null,
  axisNames: ["x", "y"],
  columns: roles.map((role, index) => ({
    id: `${id}-${index}`,
    name: `col${index}`,
    longName: null,
    dtype: "float64",
    role,
    axisType: null,
    unit: null,
    order: index,
  })),
});

const mesh = (id: string): Candidate => ({
  __typename: "MeshCollection",
  id,
  version: "2",
  specVersion: "0.1",
});

const annotations = (id: string): Candidate => ({
  __typename: "AnnotationCollection",
  id,
  name: "hand ROIs",
  description: null,
});

const space = (
  id: string,
  name: string,
  residents: Candidate[],
): SpaceLike => ({ id, name, residents });

const caps = (drawable: string[], labels: string[]): Capabilities => ({
  drawable: new Set(drawable),
  labels: new Set(labels),
});

describe("candidateRow", () => {
  it("offers a lens only the kinds the server would accept", () => {
    const row = candidateRow(lens("l1"), caps(["l1"], []));
    expect(row.badges).toEqual(["image"]);
    expect(row.source).toMatchObject({ kind: "lens", image: true, label: false });
  });

  it("disables a lens the server would draw as neither", () => {
    const row = candidateRow(lens("l1"), caps([], []));
    expect(row.source).toBeNull();
    expect(row.disabledReason).toContain("not drawable");
    expect(row.badges).toEqual([]);
  });

  it("offers both kinds while the capability query is still unanswered", () => {
    const row = candidateRow(lens("l1"), null);
    expect(row.badges).toEqual(["image", "label"]);
    expect(row.source).toMatchObject({ image: true, label: true });
  });

  it("badges tracks only for a table with a TRACK_ID column", () => {
    expect(
      candidateRow(table("t1", [COORDINATE]), null).badges,
    ).toEqual(["points"]);
    expect(
      candidateRow(table("t2", [TRACK_ID]), null).badges,
    ).toEqual(["points", "tracks"]);
  });

  it("lists the two residents that are not layer sources, with a reason", () => {
    const dataset = candidateRow(
      { __typename: "ArrayDataset", id: "d1", name: "dapi.zarr" },
      null,
    );
    expect(dataset.source).toBeNull();
    expect(dataset.disabledReason).toContain("lenses");

    const level = candidateRow(
      { __typename: "DataArray", id: "a1", level: 0 },
      null,
    );
    expect(level.source).toBeNull();
    expect(level.name).toBe("pyramid level 0");
  });

  it("makes a mesh collection and an annotation collection addable", () => {
    expect(candidateRow(mesh("m1"), null).source).toMatchObject({ kind: "mesh" });
    expect(candidateRow(annotations("a1"), null).source).toMatchObject({
      kind: "annotation",
    });
  });
});

describe("groupCandidates", () => {
  const world = space("w", "Stage world", []);

  it("puts the world first and dedupes it against placedSystems", () => {
    const groups = groupCandidates({
      world,
      placedSystems: [space("z", "zeta grid", [mesh("m1")]), world],
      capabilities: null,
      search: "",
    });
    expect(groups.map((group) => group.id)).toEqual(["w", "z"]);
    expect(groups[0].isWorld).toBe(true);
  });

  it("sorts the reachable spaces by name", () => {
    const groups = groupCandidates({
      world,
      placedSystems: [
        space("b", "beta", [mesh("m2")]),
        space("a", "alpha", [mesh("m1")]),
      ],
      capabilities: null,
      search: "",
    });
    expect(groups.map((group) => group.name)).toEqual([
      "Stage world",
      "alpha",
      "beta",
    ]);
  });

  it("labels an empty space a reference frame and keeps it without a search", () => {
    const [worldGroup] = groupCandidates({
      world,
      placedSystems: [],
      capabilities: null,
      search: "",
    });
    expect(worldGroup.label).toBe("reference frame");
    expect(worldGroup.rows).toEqual([]);
  });

  it("orders addable rows above the ones that only explain themselves", () => {
    const groups = groupCandidates({
      world: space("w", "Stage world", [
        { __typename: "ArrayDataset", id: "d1", name: "dapi.zarr" },
        lens("l1"),
      ]),
      placedSystems: [],
      capabilities: caps(["l1"], []),
      search: "",
    });
    expect(groups[0].rows.map((row) => row.resident.__typename)).toEqual([
      "Lens",
      "ArrayDataset",
    ]);
  });

  it("keeps a space matched by its own name, with every row", () => {
    const groups = groupCandidates({
      world,
      placedSystems: [space("n", "nuclei mask grid", [lens("l1"), mesh("m1")])],
      capabilities: null,
      search: "nuclei",
    });
    expect(groups).toHaveLength(1);
    expect(groups[0].rows).toHaveLength(2);
  });

  it("keeps only the matching rows of an unmatched space, and drops the empty ones", () => {
    const groups = groupCandidates({
      world,
      placedSystems: [
        space("n", "grid one", [lens("l1", "dapi.zarr"), mesh("m1")]),
        space("o", "grid two", [mesh("m2")]),
      ],
      capabilities: null,
      search: "dapi",
    });
    expect(groups.map((group) => group.id)).toEqual(["n"]);
    expect(groups[0].rows.map((row) => row.name)).toEqual([
      "a lens of dapi.zarr",
    ]);
  });
});
