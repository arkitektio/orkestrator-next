import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { PathNodePresentation } from "../../components/PathNodePresentation";
import { Handles } from "../../components/Handles";
import { MetricNode } from "../../types";

export default memo(({ data, id, selected }: NodeProps<MetricNode>) => {
  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handles self={id} />
      <PathNodePresentation
        id={id}
        label={data.label}
        tags={data.tags}
      >
        <div className="font-semibold">{data.label}</div>
        <div className="text-sm text-muted-foreground">{data.metricKind}</div>
      </PathNodePresentation>
    </>
  );
});
