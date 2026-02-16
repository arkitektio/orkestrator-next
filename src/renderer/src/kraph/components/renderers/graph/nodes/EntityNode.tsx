import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphEntity } from "@/linkers";
import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { EntityNode } from "../types";

const TNode =  memo(({ data, id, selected }: NodeProps<EntityNode>) => {
  const resolve = useResolve();

  return (
    <>
      <Handles self={id} />
      <Card
        className={`h-full w-full rounded-xl border-4 border-emerald-500 bg-card overflow-hidden shadow-sm transition-all ${selected ? "ring-4 ring-emerald-300 shadow-lg" : ""}`}
        style={{ zIndex: 10 }}
      >
        {data.category.store?.presignedUrl && (
          <Image
            src={resolve(data.category.store.presignedUrl)}
            style={{ filter: "brightness(0.5)" }}
            className="object-cover h-full w-full"
          />
        )}
        <div className="absolute inset-0 z-10 flex items-center justify-center flex-col gap-1 p-4 text-center">
          <KraphEntity.DetailLink
            object={data.id}
            className="font-bold text-lg text-foreground hover:underline bg-background/90 px-3 py-1 rounded backdrop-blur-sm shadow-sm"
          >
            {data.label}
          </KraphEntity.DetailLink>
          {data.category.label}
        </div>
      </Card>
    </>
  );
});


export default TNode;
