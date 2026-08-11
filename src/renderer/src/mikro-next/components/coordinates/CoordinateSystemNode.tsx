import { MikroCoordinateSystem } from "@/linkers";
import { NodeProps } from "@xyflow/react";
import { Boxes, Globe } from "lucide-react";
import CircleNode from "./CircleNode";
import { isReferenceFrame, occupancyLabel } from "./residents";
import { CoordinateSystemNode as TNode } from "./types";

// Inhabited vs. uninhabited is the whole vocabulary the graph has left, and
// colour is the fastest way to read a component: which spaces hold data, and
// which is the pure frame the rest are registered into.
//
// The app's chart ramp rather than picked Tailwind hues, so the graph is
// coloured by the same palette as everything else that visualises data. The
// ramp is a LIGHTNESS ladder of one hue, not a categorical set, so the three
// classes take its ends and its middle — frame (1), inhabited (3), resident
// (5, in `ResidentNode`) — and separate by weight rather than by hue. They also
// flip with the theme on their own, which the fixed `-500` shades and their
// `dark:` overrides had to do by hand.
export const OCCUPANCY_DOT = {
  frame: "bg-chart-1",
  inhabited: "bg-chart-3",
} as const;

export const OCCUPANCY_LABEL = {
  frame: "reference frame",
  inhabited: "inhabited",
} as const;

const OCCUPANCY_RING = {
  // Dashed for the frame: nothing lives inside it, and the border says so
  // before the colour does.
  frame: "border-dashed border-chart-1/70 bg-chart-1/5",
  inhabited: "border-chart-3/70 bg-chart-3/5",
} as const;

const OCCUPANCY_TEXT = {
  frame: "text-chart-1",
  inhabited: "text-chart-3",
} as const;

const OCCUPANCY_ICON = {
  frame: Globe,
  inhabited: Boxes,
} as const;

const OCCUPANCY_TITLE = {
  frame:
    "Nothing lives in this space. Sources register into it and scenes adopt it as their world; it outlives every scene over it.",
  inhabited: "The data living in this space.",
} as const;

export type Occupancy = keyof typeof OCCUPANCY_DOT;

export const CoordinateSystemNode = ({ data }: NodeProps<TNode>) => {
  const { system, isRoot } = data;
  const occupancy: Occupancy = isReferenceFrame(system) ? "frame" : "inhabited";

  // The axes do not fit in a circle and are not what distinguishes one space
  // from another at a glance — the name and who lives there are. They stay on
  // the hover, in their declared order.
  const axes = [...system.axes]
    .sort((a, b) => a.order - b.order)
    .map((axis) => `${axis.name}${axis.unit ? ` (${axis.unit})` : ""}`)
    .join(" · ");

  return (
    <CircleNode
      icon={OCCUPANCY_ICON[occupancy]}
      title={`${system.name}\n${occupancyLabel(system)}\n${axes}\n\n${OCCUPANCY_TITLE[occupancy]}`}
      className={OCCUPANCY_RING[occupancy]}
      iconClassName={OCCUPANCY_TEXT[occupancy]}
      emphasised={isRoot}
      caption={system.axes
        .map((axis) => axis.name)
        .slice(0, 5)
        .join("")}
    >
      <MikroCoordinateSystem.DetailLink object={system}>
        {system.name}
      </MikroCoordinateSystem.DetailLink>
    </CircleNode>
  );
};

export default CoordinateSystemNode;
