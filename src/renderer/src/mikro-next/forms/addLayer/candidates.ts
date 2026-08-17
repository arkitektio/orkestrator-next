/**
 * What the Add Layer picker offers, derived from the spaces a scene's world can
 * be reached from.
 *
 * The question "what can we add?" is answered by the coordinate graph, not by a
 * per-kind list: `worldCoordinateSystem.placedSystems` is every space with a
 * traversable path into the world — "the same set the `placeableIn` filters
 * answer from, so a picker and a layer mutation cannot disagree" — and each of
 * those spaces reports who lives in it. So the picker's shape is the model's:
 * spaces, and their residents.
 *
 * Two residents can never become a layer and are still listed, dimmed: an
 * ArrayDataset is staged through its lenses, and a DataArray is a pyramid level
 * of one. Dropping them would make this surface disagree with the coordinate
 * system page about who lives in a space, and the reason a dataset is not
 * clickable here is worth showing once rather than leaving someone to hunt for
 * it.
 */

import {
  occupancyLabel,
  residentLabel,
  residentName,
} from "@/mikro-next/components/coordinates/residents";
import type {
  AddLayerCandidateFragment,
  TableColumnRole,
} from "../../api/graphql";
import { lensLabel } from "../../lenses";

/**
 * The one enum member this module compares against, spelled as its wire value.
 * Type-only imports keep the file free of runtime imports from the generated
 * api — that module pulls in the Apollo client and with it `window`, and this
 * one is pure logic that runs in vitest's `node` environment.
 */
const TRACK_ID = "TRACK_ID" as TableColumnRole;

export type Candidate = AddLayerCandidateFragment;

export type LensCandidate = Extract<Candidate, { __typename: "Lens" }>;
export type TableCandidate = Extract<Candidate, { __typename: "TableDataset" }>;
export type MeshCandidate = Extract<Candidate, { __typename: "MeshCollection" }>;
export type AnnotationCandidate = Extract<
  Candidate,
  { __typename: "AnnotationCollection" }
>;

/** What step 2 is handed once a row is chosen. */
export type Source =
  | { kind: "lens"; lens: LensCandidate; image: boolean; label: boolean }
  | { kind: "tabledataset"; table: TableCandidate }
  | { kind: "mesh"; mesh: MeshCandidate }
  | { kind: "annotation"; collection: AnnotationCandidate };

/**
 * Which lenses the server would accept as a drawable / label layer, as id sets.
 * `null` means the capability query has not answered yet — every lens is offered
 * rather than wrongly greyed out, and the server stays the last word either way.
 */
export type Capabilities = {
  drawable: ReadonlySet<string>;
  labels: ReadonlySet<string>;
} | null;

export type CandidateRow = {
  /** Stable within a group: a resident kind plus its id. */
  key: string;
  resident: Candidate;
  name: string;
  secondary?: string;
  /** What this row could become — empty for a row that cannot become anything. */
  badges: string[];
  /** null when the row is not a layer source; `disabledReason` then says why. */
  source: Source | null;
  disabledReason?: string;
};

export type SpaceGroup = {
  id: string;
  name: string;
  /** The scene's own world: listed first, since it needs no path at all. */
  isWorld: boolean;
  /** The occupancy line — "reference frame", "the grid of X", "4 residents". */
  label: string;
  rows: CandidateRow[];
};

/** The narrowest shape of a space this module needs. */
export type SpaceLike = {
  id: string;
  name: string;
  residents: readonly Candidate[];
};

const residentKey = (resident: Candidate): string => {
  switch (resident.__typename) {
    case "Lens":
    case "TableDataset":
    case "MeshCollection":
    case "AnnotationCollection":
    case "ArrayDataset":
    case "DataArray":
      return `${resident.__typename}:${resident.id}`;
  }
};

/**
 * One resident as a picker row: what to call it, what it could become, and — for
 * the two kinds that could become nothing — why not.
 */
export const candidateRow = (
  resident: Candidate,
  capabilities: Capabilities,
): CandidateRow => {
  const base = {
    key: residentKey(resident),
    resident,
    name: residentName(resident),
  };

  switch (resident.__typename) {
    case "Lens": {
      // Unknown capabilities are optimistic: better to let the server refuse a
      // creation than to hide a lens the picker was merely unsure about.
      const image = capabilities?.drawable.has(resident.id) ?? true;
      const label = capabilities?.labels.has(resident.id) ?? true;
      const badges = [
        ...(image ? ["image"] : []),
        ...(label ? ["label"] : []),
      ];
      return {
        ...base,
        secondary: lensLabel(resident),
        badges,
        source: image || label ? { kind: "lens", lens: resident, image, label } : null,
        disabledReason:
          image || label
            ? undefined
            : "not drawable — needs an x and a y axis of more than one pixel",
      };
    }
    case "TableDataset": {
      // The same check TableLayerForm makes before enabling its Tracks button:
      // tracks need a column the server can group rows by.
      const trackable = resident.columns.some(
        (column) => column.role === TRACK_ID,
      );
      return {
        ...base,
        secondary:
          resident.description ||
          resident.columns.map((column) => column.name).join(", "),
        badges: ["points", ...(trackable ? ["tracks"] : [])],
        source: { kind: "tabledataset", table: resident },
      };
    }
    case "MeshCollection":
      return {
        ...base,
        secondary: `spec ${resident.specVersion}`,
        badges: ["mesh"],
        source: { kind: "mesh", mesh: resident },
      };
    case "AnnotationCollection":
      return {
        ...base,
        secondary: resident.description ?? undefined,
        badges: ["annotations"],
        source: { kind: "annotation", collection: resident },
      };
    case "ArrayDataset":
      return {
        ...base,
        badges: [],
        source: null,
        disabledReason: "staged through its lenses, listed above",
      };
    case "DataArray":
      return {
        ...base,
        badges: [],
        source: null,
        disabledReason: "a pyramid level of its dataset",
      };
  }
};

const matches = (haystack: string | undefined, needle: string) =>
  !!haystack && haystack.toLowerCase().includes(needle);

/**
 * The world and every space that can reach it, each with its residents as rows.
 *
 * The world comes first and is deduped against `placedSystems`: whether that
 * field includes the space itself is not stated, and data sitting IN the world
 * is trivially composable there, so it is asked for separately and merged here.
 * The rest sort by name so the list is stable across refetches.
 *
 * A search keeps a space whose own name matches — the spaces ARE the answer, so
 * looking one up by name has to work — and otherwise keeps only its matching
 * rows. Reference frames, which have nothing to match, drop out of a search and
 * are shown when there is none.
 */
export const groupCandidates = (input: {
  world: SpaceLike;
  placedSystems: readonly SpaceLike[];
  capabilities: Capabilities;
  search: string;
}): SpaceGroup[] => {
  const { world, placedSystems, capabilities } = input;
  const search = input.search.trim().toLowerCase();

  const others = placedSystems
    .filter((space) => space.id !== world.id)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));

  return [world, ...others]
    .map((space): SpaceGroup => {
      const rows = space.residents.map((resident) =>
        candidateRow(resident, capabilities),
      );
      return {
        id: space.id,
        name: space.name,
        isWorld: space.id === world.id,
        // `residentLabel` tells the single-resident story ("the grid of X") and
        // falls back to a count when several share the space.
        label: rows.length === 1 ? residentLabel(space) : occupancyLabel(space),
        // Rows that can become something come first; the dimmed ones keep their
        // server order below them.
        rows: [
          ...rows.filter((row) => row.source),
          ...rows.filter((row) => !row.source),
        ],
      };
    })
    .map((group) => {
      if (!search) return group;
      if (matches(group.name, search)) return group;
      return {
        ...group,
        rows: group.rows.filter(
          (row) => matches(row.name, search) || matches(row.secondary, search),
        ),
      };
    })
    .filter((group) => !search || group.rows.length > 0);
};

/** How many rows the picker is about to render, across every group. */
export const totalRows = (groups: readonly SpaceGroup[]): number =>
  groups.reduce((sum, group) => sum + group.rows.length, 0);
