import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import {
  KraphMetric
} from "@/linkers";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { MetricNode } from "../types";

const TNode =  memo(({ data, id, selected }: NodeProps<MetricNode>) => {
  const resolve = useResolve();

  return (
    <>
      <NodeResizer
        color="#f97316"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handles self={id} />
      <div className="absolute top-1 left-1 right-1 bottom-1 z-10">
        <Card
          className={`h-full w-full rounded-md border-l-8 border-orange-500 bg-card overflow-hidden shadow-sm transition-all ${selected ? "ring-2 ring-orange-500 shadow-lg" : ""}`}
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
            <KraphMetric.DetailLink
              object={data.id}
              className="font-bold text-lg text-center block text-foreground bg-background/90 px-3 py-1 rounded backdrop-blur-sm hover:underline shadow-sm"
            >
              {data.category.label}
            </KraphMetric.DetailLink>
            <div className="mt-2 text-3xl font-extrabold text-orange-600 dark:text-orange-400 bg-background/90 px-3 py-1 rounded backdrop-blur-sm shadow-sm">
              {data.value}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
});


export default TNode;
