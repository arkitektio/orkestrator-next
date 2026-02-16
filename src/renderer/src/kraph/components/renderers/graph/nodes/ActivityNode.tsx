import { Card } from "@/components/ui/card";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { KraphEditEvent } from "@/linkers";
import { NodeProps, NodeResizer } from "@xyflow/react";
import { memo } from "react";
import { Handles } from "../components/Handles";

import { ActivityNode } from "../types";
import Timestamp from "react-timestamp";
import { UserAvatar } from "@/lok-next/components/UserAvatar";

const TNode =  memo(({ data, id, selected }: NodeProps<ActivityNode>) => {
  const resolve = useResolve();

  return (
    <>
      <NodeResizer
        color="#64748b"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handles self={id} />
      <Card
        className={`h-full w-full rounded-md border-l-8 border-slate-500 bg-card !overflow-hidden shadow-sm transition-all ${selected ? "ring-2 ring-slate-500 shadow-lg" : ""
          }`}
        style={{ zIndex: 10 }}
      >
        <div className="absolute inset-0 z-10 flex items-center justify-center flex-col p-3">
          <KraphEditEvent.DetailLink
            object={data.id}
            className="font-bold text-sm text-center block text-foreground bg-background/90 px-3 py-1 rounded backdrop-blur-sm hover:underline shadow-sm"
          >
            <Timestamp date={data.label} relative />
          </KraphEditEvent.DetailLink>
        </div>
      </Card>
    </>
  );
});

export default TNode;
