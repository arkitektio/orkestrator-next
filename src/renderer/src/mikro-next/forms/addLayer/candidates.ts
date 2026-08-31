/**
 * What the Add Layer picker offers, organised the way someone staging a scene
 * thinks about it: the *things* they have — a dataset, a mesh collection, a
 * table of measurements, a set of annotations — not the residents of a
 * coordinate system.
 *
 * The reachability question is still answered by the coordinate graph, and still
 * by the same field: `worldCoordinateSystem.placedSystems` is every space with a
 * traversable path into the world — "the same set the `placeableIn` filters
 * answer from, so a picker and a layer mutation cannot disagree". What changed
 * is that a space is no longer the heading. It is a caption on the entry it made
 * reachable, because two residents of one dataset regularly live in two spaces
 * (an unsliced lens sits in the intrinsic grid, a crop owns its own), and a
 * picker grouped by space has to tear them apart to say so.
 *
 * Three things are dropped rather than dimmed:
 *
 *   DataArrays        a pyramid level is an implementation detail of its
 *                     dataset. Nobody adds level 3 to a scene, and a multiscale
 *                     dataset was filling the list with six rows saying so.
 *   lens-less datasets a dataset whose lenses the server would refuse to draw
 *                     cannot become a layer here at all.
 *   non-drawable lenses same.
 *
 * The old shape listed all three with a reason attached. A reason is only worth
 * a row when the thing is something you would otherwise reach for; a pyramid
 * level never is.
 */

import { residentName } from "@/mikro-next/components/coordinates/residents";
import type {
  AddLayerCandidateFragment,
  ArrayDatasetSpec,
  ColumnRole,
} from "../../api/graphql";
import { lensLabel } from "../../lenses";

/**
 * The one enum member this module compares against, spelled as its wire value.
 * Type-only imports keep the file free of runtime imports from the generated
 * api — that module pulls in the Apollo client and with it `window`, and this
 * one is pure logic that runs in vitest's `node` environment.
 */
const TRACK_ID = "TRACK_ID" as ColumnRole;

export type Candidate = AddLayerCandidateFragment;

export type LensCandidate = Extract<Candidate, { __typename: "Lens" }>;
export type TableCandidate = Extract<Candidate, { __typename: "TableDataset" }>;
export type MeshCandidate = Extract<Candidate, { __typename: "MeshCollection" }>;
export type NetworkCandidate = Extract<Candidate, { __typename: "NetworkCollection" }>;
export type AnnotationCandidate = Extract<
  Candidate,
  { __typename: "AnnotationCollection" }
>;
export type DatasetCandidate = Extract<
  Candidate,
  { __typename: "ArrayDataset" }
>;

/**
 * Which lenses the server would accept as a drawable / label layer, as id sets.
 * `null` means the capability query has not answered yet — every lens is offered
 * rather than wrongly hidden, and the server stays the last word either way.
 */
export type Capabilities = {
  drawable: ReadonlySet<string>;
  labels: ReadonlySet<string>;
} | null;

/** The space that makes an entry reachable — a caption, not a heading. */
export type SpaceRef = { id: string; name: string; isWorld: boolean };

/** The narrowest shape of a space this module needs. */
export type SpaceLike = {
  id: string;
  name: string;
  residents: readonly Candidate[];
};

// ---------------------------------------------------------------------------
// What a source becomes
// ---------------------------------------------------------------------------

/**
 * The layer kinds a lens can become, named for what you get rather than for the
 * mutation behind them. Which one is *chosen* is never asked: `inferLensKinds`
 * decides, and the alternatives stay behind a disclosure for the case where the
 * inference is not what someone wanted.
 */
export type LayerKind = "LABEL" | "VOLUME" | "INTENSITY" | "RGB";

export const LAYER_KIND_INFO: Record<
  LayerKind,
  { title: string; description: string }
> = {
  LABEL: {
    title: "Segmentation",
    description: "Object ids, drawn as coloured regions you can click",
  },
  VOLUME: {
    title: "Volume",
    description: "The whole stack rendered at once, projected through z",
  },
  INTENSITY: {
    title: "Image",
    description: "One channel at a time, through a colormap",
  },
  RGB: {
    title: "Colour image",
    description: "Three channels mapped to red, green and blue",
  },
};

/** How a table's rows are drawn. Same treatment: inferred, overridable. */
export type TableKind = "TRACK" | "POINT";

export const TABLE_KIND_INFO: Record<
  TableKind,
  { title: string; description: string }
> = {
  TRACK: {
    title: "Tracks",
    description: "Rows joined into trajectories by their track id",
  },
  POINT: {
    title: "Points",
    description: "One mark per row, at its coordinates",
  },
};

/** One way of looking at a dataset, and what it would become. */
export type LensOption = {
  key: string;
  lens: LensCandidate;
  /** "full — y × x · 512 × 512", the line that tells two lenses apart. */
  label: string;
  space: SpaceRef;
  /** Every kind the server would accept, the inferred one first. */
  kinds: LayerKind[];
};

export type DatasetEntry = {
  kind: "dataset";
  key: string;
  id: string;
  name: string;
  description?: string | null;
  /** What the dataset structurally is — the entry's icon and subtitle. */
  specs: readonly ArrayDatasetSpec[];
  /** Drawable lenses only, the unsliced one first. Never empty. */
  lenses: LensOption[];
};

export type TableEntry = {
  kind: "table";
  key: string;
  table: TableCandidate;
  name: string;
  secondary?: string;
  space: SpaceRef;
  /** Inferred first, as everywhere else. */
  kinds: TableKind[];
};

export type MeshEntry = {
  kind: "mesh";
  key: string;
  mesh: MeshCandidate;
  name: string;
  secondary?: string;
  space: SpaceRef;
};

export type NetworkEntry = {
  kind: "network";
  key: string;
  network: NetworkCandidate;
  name: string;
  secondary?: string;
  space: SpaceRef;
};

export type AnnotationEntry = {
  kind: "annotation";
  key: string;
  collection: AnnotationCandidate;
  name: string;
  secondary?: string;
  space: SpaceRef;
};

export type Entry = DatasetEntry | TableEntry | MeshEntry | NetworkEntry | AnnotationEntry;

export type SectionId = "datasets" | "meshes" | "networks" | "tables" | "annotations";

export type Section = {
  id: SectionId;
  title: string;
  entries: Entry[];
};

/** What step 2 is handed once something is chosen. */
export type Source =
  | { kind: "lens"; dataset: DatasetEntry; option: LensOption }
  | { kind: "table"; entry: TableEntry }
  | { kind: "mesh"; entry: MeshEntry }
  | { kind: "network"; entry: NetworkEntry }
  | { kind: "annotation"; entry: AnnotationEntry };

// ---------------------------------------------------------------------------
// Inference
// ---------------------------------------------------------------------------

const extentOf = (lens: LensCandidate, axis: string | null | undefined) => {
  if (!axis) return 0;
  const index = lens.axisNames.indexOf(axis);
  return index < 0 ? 0 : (lens.shape[index] ?? 0);
};

/**
 * Whether this lens is worth rendering as a volume.
 *
 * The z *extent*, not the presence of a z axis: `renderAxes.z` is set for
 * anything volumetric and `spec: VOLUME` "holds whenever a z axis is present,
 * even if it carries a single plane" — so both would call a single-plane stack a
 * volume, and volume-render one slice of data.
 */
export const isVolumetric = (lens: LensCandidate): boolean =>
  extentOf(lens, lens.renderAxes?.z) > 1;

/**
 * Whether RGB is even offerable: three channels to map to red, green and blue.
 *
 * Offerable, never inferred. A three-long channel axis in microscopy is three
 * fluorescence channels far more often than it is an RGB triplet, so guessing
 * would be wrong most of the time on this data.
 */
export const isRgbCapable = (lens: LensCandidate): boolean =>
  extentOf(lens, lens.renderAxes?.intensity) >= 3;

/**
 * What a lens becomes, in preference order — the first is what it becomes
 * without being asked.
 *
 * A label wins outright when the server says the lens is one: `asLayer: LABEL`
 * requires a primary derivation declaring CATEGORIZED, so a lens that qualifies
 * *is* a mask, and drawing a mask as intensities is never what was wanted.
 * Otherwise real z extent means a volume, and everything else is a plain image.
 */
export const inferLensKinds = (
  lens: LensCandidate,
  capabilities: Capabilities,
): LayerKind[] => {
  // Unknown capabilities are optimistic about the *set* — better to let the
  // server refuse a creation than to hide a lens the picker was merely unsure
  // about — but never about the choice. Optimism used to cost nothing, when both
  // kinds were offered side by side and someone picked; now the first entry is
  // what gets created without being asked, and guessing "mask" at every ordinary
  // stack for the length of one round trip is a wrong default, not a generous
  // one. So an unconfirmed LABEL is offered last, and only leads once the server
  // has actually said the lens is one.
  const answered = capabilities !== null;
  const image = capabilities?.drawable.has(lens.id) ?? true;
  const label = capabilities?.labels.has(lens.id) ?? true;

  const kinds: LayerKind[] = [];
  if (label && answered) kinds.push("LABEL");
  if (image) {
    if (isVolumetric(lens)) kinds.push("VOLUME");
    kinds.push("INTENSITY");
    if (isRgbCapable(lens)) kinds.push("RGB");
  }
  if (label && !answered) kinds.push("LABEL");
  return kinds;
};

/** Tracks when the rows can be joined into them, points otherwise. */
export const inferTableKinds = (table: TableCandidate): TableKind[] =>
  table.columns.some((column) => column.role === TRACK_ID)
    ? ["TRACK", "POINT"]
    : ["POINT"];

// ---------------------------------------------------------------------------
// Building the sections
// ---------------------------------------------------------------------------

const matches = (haystack: string | null | undefined, needle: string) =>
  !!haystack && haystack.toLowerCase().includes(needle);

const columnSummary = (table: TableCandidate) =>
  table.description || table.columns.map((column) => column.name).join(", ");

/**
 * Every source reachable from a scene's world, grouped by what it is.
 *
 * A dataset is assembled from two directions and keyed by its id, because the
 * two halves need not share a space: the `ArrayDataset` resident carries the
 * name and the spec, its `Lens` residents carry what can actually be drawn. A
 * lens whose dataset is not itself a resident still yields an entry — the lens
 * knows its dataset — and a dataset with no drawable lens yields none.
 *
 * The world's own residents are asked for separately and deduped here: whether
 * `placedSystems` includes the world itself is not stated, and data sitting IN
 * the world is trivially composable there.
 */
export const buildSections = (input: {
  world: SpaceLike;
  placedSystems: readonly SpaceLike[];
  capabilities: Capabilities;
  search: string;
}): Section[] => {
  const { world, placedSystems, capabilities } = input;
  const search = input.search.trim().toLowerCase();

  const others = placedSystems
    .filter((space) => space.id !== world.id)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));

  const datasets = new Map<string, DatasetEntry>();
  const tables: TableEntry[] = [];
  const meshes: MeshEntry[] = [];
  const networks: NetworkEntry[] = [];
  const annotations: AnnotationEntry[] = [];

  const datasetEntry = (
    dataset: { id: string; name: string; description?: string | null },
    specs?: readonly ArrayDatasetSpec[],
  ): DatasetEntry => {
    const existing = datasets.get(dataset.id);
    if (existing) {
      // The resident is the better source for both — a lens' nested dataset
      // fetches no spec, and its description is the same string.
      if (specs?.length) existing.specs = specs;
      existing.description ??= dataset.description;
      return existing;
    }
    const created: DatasetEntry = {
      kind: "dataset",
      key: `ArrayDataset:${dataset.id}`,
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
      specs: specs ?? [],
      lenses: [],
    };
    datasets.set(dataset.id, created);
    return created;
  };

  for (const space of [world, ...others]) {
    const spaceRef: SpaceRef = {
      id: space.id,
      name: space.name,
      isWorld: space.id === world.id,
    };

    for (const resident of space.residents) {
      switch (resident.__typename) {
        case "Lens": {
          const kinds = inferLensKinds(resident, capabilities);
          // Not drawable as anything — the server would refuse the creation, so
          // the lens is not offered at all.
          if (!kinds.length) break;
          datasetEntry(resident.dataset).lenses.push({
            key: `Lens:${resident.id}`,
            lens: resident,
            label: lensLabel(resident),
            space: spaceRef,
            kinds,
          });
          break;
        }
        case "ArrayDataset":
          datasetEntry(resident, resident.spec);
          break;
        case "TableDataset":
          tables.push({
            kind: "table",
            key: `TableDataset:${resident.id}`,
            table: resident,
            name: resident.name,
            secondary: columnSummary(resident),
            space: spaceRef,
            kinds: inferTableKinds(resident),
          });
          break;
        case "MeshCollection":
          meshes.push({
            kind: "mesh",
            key: `MeshCollection:${resident.id}`,
            mesh: resident,
            name: residentName(resident),
            secondary: `spec ${resident.specVersion}`,
            space: spaceRef,
          });
          break;
        // A konnektion collection. Nameless like a mesh collection, so the row
        // shows the version and the spec — which is what `residentName` already
        // assumes for both.
        case "NetworkCollection":
          networks.push({
            kind: "network",
            key: `NetworkCollection:${resident.id}`,
            network: resident,
            name: residentName(resident),
            secondary: `spec ${resident.specVersion}`,
            space: spaceRef,
          });
          break;
        case "AnnotationCollection":
          annotations.push({
            kind: "annotation",
            key: `AnnotationCollection:${resident.id}`,
            collection: resident,
            name: resident.name,
            secondary: resident.description ?? undefined,
            space: spaceRef,
          });
          break;
        case "DataArray":
          // A pyramid level of its dataset. Never a layer, never a row.
          break;
      }
    }
  }

  const datasetEntries = [...datasets.values()]
    .filter((entry) => entry.lenses.length > 0)
    .map((entry) => ({
      ...entry,
      // The unsliced lens is the one someone means by "the dataset", so it is
      // what the entry itself adds; the crops sort under it by their own label.
      lenses: entry.lenses
        .slice()
        .sort(
          (a, b) =>
            a.lens.slices.length - b.lens.slices.length ||
            a.label.localeCompare(b.label),
        ),
    }));

  const byName = <T extends { name: string; key: string }>(a: T, b: T) =>
    a.name.localeCompare(b.name) || a.key.localeCompare(b.key);

  const sections: Section[] = [
    {
      id: "datasets",
      title: "Datasets",
      entries: datasetEntries.sort(byName),
    },
    { id: "meshes", title: "Meshes", entries: meshes.sort(byName) },
    { id: "networks", title: "Networks", entries: networks.sort(byName) },
    { id: "tables", title: "Measurements", entries: tables.sort(byName) },
    { id: "annotations", title: "Annotations", entries: annotations.sort(byName) },
  ];

  if (!search) return sections.filter((section) => section.entries.length > 0);

  return sections
    .map((section) => ({
      ...section,
      entries: section.entries.filter((entry) => entryMatches(entry, search)),
    }))
    .filter((section) => section.entries.length > 0);
};

/**
 * A search matches what an entry shows: its name, its subtitle, the space that
 * made it reachable, and — for a dataset — any of its lenses. Matching the space
 * keeps the old behaviour of looking a stage frame up by name working, now that
 * the space is a caption rather than a heading.
 */
const entryMatches = (entry: Entry, search: string): boolean => {
  if (matches(entry.name, search)) return true;
  if (entry.kind === "dataset") {
    return (
      matches(entry.description, search) ||
      entry.lenses.some(
        (option) =>
          matches(option.label, search) || matches(option.space.name, search),
      )
    );
  }
  return matches(entry.secondary, search) || matches(entry.space.name, search);
};
