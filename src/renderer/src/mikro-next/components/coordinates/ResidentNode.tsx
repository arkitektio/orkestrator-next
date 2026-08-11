import { NodeProps } from "@xyflow/react";
import CircleNode from "./CircleNode";
import { RESIDENT_ICON, RESIDENT_KIND_LABEL, ResidentLink } from "./ResidentLink";
import { residentName } from "./residents";
import { ResidentNode as TNode } from "./types";

/**
 * A resident as its own node.
 *
 * `residents` is the whole vocabulary a coordinate system has left now that
 * `kind` is gone, so who lives in a space is structure, not a caption: the
 * dataset hangs off the grid it lives in, and a space with nothing hanging off
 * it IS the reference frame. The darkest step of the chart ramp throughout —
 * the spaces take its lighter ones — so the data reads as a different class of
 * thing from the spaces it sits in at a glance, and the transformation chain
 * between those spaces stays the first thing the eye follows.
 */
export const RESIDENT_COLOR = "bg-chart-5";

export const ResidentNode = ({ data }: NodeProps<TNode>) => {
  const { resident } = data;
  const kind = RESIDENT_KIND_LABEL[resident.__typename];

  return (
    <CircleNode
      icon={RESIDENT_ICON[resident.__typename]}
      title={`${residentName(resident)}\n${kind}`}
      className="border-chart-5/70 bg-chart-5/10"
      iconClassName="text-chart-5"
      caption={kind}
    >
      <ResidentLink resident={resident} />
    </CircleNode>
  );
};

export default ResidentNode;
