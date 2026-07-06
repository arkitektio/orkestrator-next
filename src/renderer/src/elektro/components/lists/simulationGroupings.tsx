import { GroupByDef } from "@/components/layout/GroupableListRenderer";
import { ListSimulationFragment } from "@/elektro/api/graphql";

const byTitle = (a: { title: React.ReactNode }, b: { title: React.ReactNode }) =>
  String(a.title).localeCompare(String(b.title));

const modelGrouping: GroupByDef<ListSimulationFragment> = {
  key: "model",
  label: "Model",
  getGroupId: (item) => item.model.id,
  getGroupTitle: (_id, item) => item.model.name,
  compareGroups: byTitle,
};

const creatorGrouping: GroupByDef<ListSimulationFragment> = {
  key: "creator",
  label: "Creator",
  getGroupId: (item) => item.creator?.sub ?? "unknown",
  getGroupTitle: (id) => (id === "unknown" ? "Unknown" : id),
  // Keep "Unknown" last, otherwise alphabetical by sub.
  compareGroups: (a, b) => {
    if (a.id === "unknown") return 1;
    if (b.id === "unknown") return -1;
    return byTitle(a, b);
  },
};

const dateGrouping: GroupByDef<ListSimulationFragment> = {
  key: "date",
  label: "Date",
  getGroupId: (item) => new Date(item.createdAt).toISOString().slice(0, 10),
  getGroupTitle: (id) =>
    new Date(id).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  // No compareGroups: keep the query's createdAt-desc order (newest day first).
};

/** Ordered group-by options offered on the Simulations page. */
export const SIMULATION_GROUPINGS: GroupByDef<ListSimulationFragment>[] = [
  modelGrouping,
  creatorGrouping,
  dateGrouping,
];

export const SIMULATION_GROUP_KEYS = [
  "none",
  ...SIMULATION_GROUPINGS.map((g) => g.key),
] as const;

export type SimulationGroupKey = (typeof SIMULATION_GROUP_KEYS)[number];

export const getSimulationGrouping = (
  key: SimulationGroupKey,
): GroupByDef<ListSimulationFragment> | undefined =>
  SIMULATION_GROUPINGS.find((g) => g.key === key);
