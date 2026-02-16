import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphStructure } from "@/linkers";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";

import { StructureNode } from "../types";
import { usePathViewerState } from "../PathViewerStateProvider";
import { DisplayWidget } from "@/command/Menu";

const TNode = memo(({ data, id, selected }: NodeProps<StructureNode>) => {
  const resolve = useResolve();

  const { viewerState } = usePathViewerState();

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
          {viewerState.showWidgets ? (
            <DisplayWidget
              identifier={data.category.identifier}
              object={data.object}
              link
            />
          ) : (
            <>
              {data.category.store?.presignedUrl && (
                <Image
                  src={resolve(data?.category.store.presignedUrl)}
                  style={{ filter: "brightness(0.5)" }}
                  className="object-cover h-full w-full"
                />
              )}
              <div className="absolute inset-0 z-10 flex items-center justify-center flex-col p-3">
                <KraphStructure.DetailLink
                  object={data.id}
                  className="font-bold text-lg text-center block text-foreground bg-background/90 px-3 py-1 rounded backdrop-blur-sm hover:underline shadow-sm"
                >
                  {data.category.label}
                </KraphStructure.DetailLink>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
});

export default TNode;
