import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphReagentCategory } from "@/linkers";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { ReagentNode } from "../types";

export default memo(({ data, id, selected }: NodeProps<ReagentNode>) => {
  const resolve = useResolve();

  return (
    <>
      <NodeResizer
        color="#06b6d4"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handles self={id} />
      <Card
        className={`h-full w-full rounded-xl border-4 border-cyan-600 bg-card overflow-hidden shadow-sm transition-all ${selected ? "ring-4 ring-cyan-300 shadow-lg" : ""}`}
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
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-background/90 px-2 py-0.5 rounded-full backdrop-blur-sm mb-1 shadow-sm">
            {data.category.label}
          </div>
          <KraphReagentCategory.DetailLink
            object={data.id}
            className="font-bold text-lg text-foreground hover:underline bg-background/90 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm"
          >
            {data.label}
          </KraphReagentCategory.DetailLink>
        </div>
      </Card>
    </>
  );
});
