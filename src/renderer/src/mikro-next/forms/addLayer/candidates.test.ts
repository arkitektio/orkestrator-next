import { describe, expect, it } from "vitest";
import type { ArrayDatasetSpec, TableColumnRole } from "../../api/graphql";
import {
  Candidate,
  Capabilities,
  DatasetEntry,
  Section,
  SpaceLike,
  buildSections,
  inferLensKinds,
  inferTableKinds,
} from "./candidates";

// Spelled as wire values, for the same reason candidates.ts does: importing the
// generated enum would drag the Apollo client into a node-environment suite.
const COORDINATE = "COORDINATE" as TableColumnRole;
const TRACK_ID = "TRACK_ID" as TableColumnRole;
const VOLUME = "VOLUME" as ArrayDatasetSpec;

type LensOverrides = {
  dataset?: string;
  datasetId?: string;
  axisNames?: string[];
  shape?: number[];
  slices?: { axis: string; start?: number | null; stop?: number | null }[];
  z?: string | null;
  intensity?: string | null;
};

const lens = (id: string, overrides: LensOverrides = {}): Candidate => ({
  __typename: "Lens",
  id,
  shape: overrides.shape ?? [512, 512],
  axisNames: overrides.axisNames ?? ["y", "x"],
  slices: (overrides.slices ?? []).map((slice) => ({
    axis: slice.axis,
    start: slice.start ?? null,
    stop: slice.stop ?? null,
    step: null,
  })),
  renderAxes: {
    x: "x",
    y: "y",
    z: overrides.z ?? null,
    intensity: overrides.intensity ?? null,
  },
  dataset: {
    id: overrides.datasetId ?? `ds-${id}`,
    name: overrides.dataset ?? "dapi.zarr",
    description: null,
  },
});

const dataset = (
  id: string,
  name = "dapi.zarr",
  spec: ArrayDatasetSpec[] = [],
): Candidate => ({
  __typename: "ArrayDataset",
  id,
  name,
  description: null,
  spec,
});

const level = (id: string, value: number): Candidate => ({
  __typename: "DataArray",
  id,
  level: value,
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

const space = (id: string, name: string, residents: Candidate[]): SpaceLike => ({
  id,
  name,
  residents,
});

const caps = (drawable: string[], labels: string[]): Capabilities => ({
  drawable: new Set(drawable),
  labels: new Set(labels),
});

const sectionOf = (sections: Section[], id: string) =>
  sections.find((section) => section.id === id);

const datasetsOf = (sections: Section[]) =>
  (sectionOf(sections, "datasets")?.entries ?? []) as DatasetEntry[];

const asLens = (candidate: Candidate) =>
  candidate as Extract<Candidate, { __typename: "Lens" }>;

describe("inferLensKinds", () => {
  it("infers a plain image, and offers nothing else", () => {
    expect(inferLensKinds(asLens(lens("l1")), caps(["l1"], []))).toEqual([
      "INTENSITY",
    ]);
  });

  it("infers a label whenever the server says the lens is one", () => {
    expect(inferLensKinds(asLens(lens("l1")), caps(["l1"], ["l1"]))).toEqual([
      "LABEL",
      "INTENSITY",
    ]);
  });

  it("infers a volume from real z extent", () => {
    const volumetric = lens("l1", {
      axisNames: ["z", "y", "x"],
      shape: [40, 512, 512],
      z: "z",
    });
    expect(inferLensKinds(asLens(volumetric), caps(["l1"], []))).toEqual([
      "VOLUME",
      "INTENSITY",
    ]);
  });

  it("does not call a single-plane stack a volume", () => {
    const flat = lens("l1", {
      axisNames: ["z", "y", "x"],
      shape: [1, 512, 512],
      z: "z",
    });
    expect(inferLensKinds(asLens(flat), caps(["l1"], []))).toEqual([
      "INTENSITY",
    ]);
  });

  it("offers rgb for three channels but never infers it", () => {
    const rgb = lens("l1", {
      axisNames: ["c", "y", "x"],
      shape: [3, 512, 512],
      intensity: "c",
    });
    expect(inferLensKinds(asLens(rgb), caps(["l1"], []))).toEqual([
      "INTENSITY",
      "RGB",
    ]);
  });

  it("offers a label it cannot confirm, but never leads with one", () => {
    // Optimism about the set, never about the choice: the first kind is what
    // gets created unasked, and an ordinary stack is not a mask.
    expect(inferLensKinds(asLens(lens("l1")), null)).toEqual([
      "INTENSITY",
      "LABEL",
    ]);
  });

  it("offers nothing for a lens the server would draw as neither", () => {
    expect(inferLensKinds(asLens(lens("l1")), caps([], []))).toEqual([]);
  });
});

describe("inferTableKinds", () => {
  it("infers points, and tracks only with a TRACK_ID column", () => {
    const points = table("t1", [COORDINATE]);
    const tracks = table("t2", [TRACK_ID]);
    expect(
      inferTableKinds(points as Extract<Candidate, { __typename: "TableDataset" }>),
    ).toEqual(["POINT"]);
    expect(
      inferTableKinds(tracks as Extract<Candidate, { __typename: "TableDataset" }>),
    ).toEqual(["TRACK", "POINT"]);
  });
});

describe("buildSections", () => {
  const world = space("w", "Stage world", []);

  it("never lists a pyramid level", () => {
    const sections = buildSections({
      world: space("w", "Stage world", [
        dataset("d1"),
        lens("l1", { datasetId: "d1" }),
        level("a0", 0),
        level("a1", 1),
      ]),
      placedSystems: [],
      capabilities: caps(["l1"], []),
      search: "",
    });
    const datasets = datasetsOf(sections);
    expect(datasets).toHaveLength(1);
    expect(datasets[0].lenses).toHaveLength(1);
    expect(JSON.stringify(sections)).not.toContain("DataArray");
  });

  it("merges a dataset with its lenses, wherever those lenses live", () => {
    const sections = buildSections({
      world: space("w", "Stage world", [
        dataset("d1", "dapi.zarr", [VOLUME]),
        lens("full", { datasetId: "d1" }),
      ]),
      placedSystems: [
        space("crop", "crop space", [
          lens("cropped", {
            datasetId: "d1",
            slices: [{ axis: "x", start: 0, stop: 128 }],
          }),
        ]),
      ],
      capabilities: caps(["full", "cropped"], []),
      search: "",
    });

    const [entry] = datasetsOf(sections);
    expect(entry.name).toBe("dapi.zarr");
    expect(entry.specs).toEqual([VOLUME]);
    // The unsliced lens first: that is what "the dataset" means.
    expect(entry.lenses.map((option) => option.lens.id)).toEqual([
      "full",
      "cropped",
    ]);
    expect(entry.lenses[0].space).toMatchObject({ id: "w", isWorld: true });
    expect(entry.lenses[1].space).toMatchObject({ id: "crop", isWorld: false });
  });

  it("keeps a dataset reachable only through a lens, and drops one with no drawable lens", () => {
    const sections = buildSections({
      world: space("w", "Stage world", [
        // No ArrayDataset resident of its own — the lens knows its dataset.
        lens("l1", { datasetId: "d1", dataset: "orphan.zarr" }),
        // A dataset whose only lens the server refuses: not a row, not a reason.
        dataset("d2", "undrawable.zarr"),
        lens("l2", { datasetId: "d2", dataset: "undrawable.zarr" }),
      ]),
      placedSystems: [],
      capabilities: caps(["l1"], []),
      search: "",
    });
    expect(datasetsOf(sections).map((entry) => entry.name)).toEqual([
      "orphan.zarr",
    ]);
  });

  it("sections meshes, measurements and annotations apart from datasets", () => {
    const sections = buildSections({
      world,
      placedSystems: [
        space("m", "mesh space", [mesh("m1")]),
        space("t", "table space", [table("t1", [TRACK_ID])]),
        space("a", "annotation space", [annotations("a1")]),
      ],
      capabilities: null,
      search: "",
    });
    expect(sections.map((section) => section.id)).toEqual([
      "meshes",
      "tables",
      "annotations",
    ]);
    expect(sectionOf(sections, "tables")?.entries[0]).toMatchObject({
      kind: "table",
      kinds: ["TRACK", "POINT"],
      space: { name: "table space" },
    });
  });

  it("dedupes the world against placedSystems", () => {
    const inhabited = space("w", "Stage world", [mesh("m1")]);
    const sections = buildSections({
      world: inhabited,
      placedSystems: [inhabited],
      capabilities: null,
      search: "",
    });
    expect(sectionOf(sections, "meshes")?.entries).toHaveLength(1);
  });

  it("searches names, and the space that made a thing reachable", () => {
    const byName = buildSections({
      world,
      placedSystems: [
        space("n", "grid one", [lens("l1", { dataset: "dapi.zarr" })]),
        space("o", "grid two", [mesh("m1")]),
      ],
      capabilities: null,
      search: "dapi",
    });
    expect(byName.map((section) => section.id)).toEqual(["datasets"]);

    const bySpace = buildSections({
      world,
      placedSystems: [
        space("n", "nuclei mask grid", [mesh("m1")]),
        space("o", "grid two", [mesh("m2")]),
      ],
      capabilities: null,
      search: "nuclei",
    });
    expect(sectionOf(bySpace, "meshes")?.entries).toHaveLength(1);
  });
});
