import { Card } from "@/components/ui/card";
import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";
import { ThisNode } from "../types";

export default memo(({ id, selected }: NodeProps<ThisNode>) => {
  return (
    <>
      <Handles self={id} />
      <Card
        className={`h-full w-full rounded-full border-4 border-primary bg-primary text-primary-foreground overflow-hidden shadow-sm flex items-center justify-center transition-all ${selected ? "ring-4 ring-primary/50 shadow-lg" : ""}`}
        style={{ zIndex: 10 }}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="font-bold text-lg tracking-wider">THIS</span>
        </div>
      </Card>
    </>
  );
});
