import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { PathNodePresentation } from "../../components/PathNodePresentation";
import { Handles } from "../../components/Handles";
import { StructureNode } from "../../types";

export default memo(({ data, id, selected }: NodeProps<StructureNode>) => {
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
        label={data.identifier}
        tags={data.tags}
      />
    </>
  );
});
