import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphProtocolEvent } from "@/linkers";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { ProtocolEventNode } from "../types";

export default memo(({ data, id, selected }: NodeProps<ProtocolEventNode>) => {
  const resolve = useResolve();

  return (
    <>
      <NodeResizer
        color="#e11d48"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handles self={id} />
      <div className="absolute top-1 left-1 right-1 bottom-1 z-10">
        <Card
          className={`h-full w-full rounded-md border-l-8 border-rose-500 bg-card overflow-hidden shadow-sm transition-all ${selected ? "ring-2 ring-rose-500 shadow-lg" : ""
            }`}
          style={{ zIndex: 10 }}
        >
          {data.category.store?.presignedUrl && (
            <Image
              src={resolve(data.category.store.presignedUrl)}
              style={{ filter: "brightness(0.5)" }}
              className="object-cover h-full w-full"
            />
          )}
          <div className="absolute inset-0 z-10 flex items-center justify-center flex-col p-3">
            <div className="w-full overflow-hidden flex flex-col items-center gap-2">
              <KraphProtocolEvent.DetailLink
                object={data.id}
                className="font-bold text-lg text-center block text-foreground bg-background/90 px-3 py-1 rounded backdrop-blur-sm hover:underline shadow-sm"
              >
                {data.category.label}
              </KraphProtocolEvent.DetailLink>
              {data.variables.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center max-w-full">
                  {data.variables.map((variable) => (
                    <div
                      key={variable.role + variable.value}
                      className="px-2 py-1 bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-100 rounded text-xs font-medium border border-rose-200 dark:border-rose-800"
                    >
                      <span className="font-bold">{variable.role}:</span>{" "}
                      {variable.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
});
