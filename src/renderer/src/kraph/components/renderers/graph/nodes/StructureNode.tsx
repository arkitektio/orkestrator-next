import { Card } from "@/components/ui/card";
import { KraphStructure } from "@/linkers";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";

import { StructureNode } from "../types";

const TNode = memo(({ data, id, selected }: NodeProps<StructureNode>) => {
  return (
    <>
      <NodeResizer
        color="#8b5cf6"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handles self={id} />
      <div className="absolute top-1 left-1 right-1 bottom-1 z-10">
        <Card
          className={`h-full w-full rounded-md border-l-8 border-violet-500 bg-card overflow-hidden shadow-sm transition-all ${selected ? "ring-2 ring-violet-500 shadow-lg" : ""
            }`}
          style={{ zIndex: 10 }}
        >
          <div className="absolute inset-0 z-10 flex items-center justify-center flex-col p-3">
            <KraphStructure.DetailLink
              object={{ id: data.id }}
              className="font-bold text-lg text-center block text-foreground bg-background/90 px-3 py-1 rounded backdrop-blur-sm hover:underline shadow-sm"
            >
              {data.category.label}
            </KraphStructure.DetailLink>
          </div>
        </Card>
      </div>
    </>
  );
});

export default TNode;
