import { useGetMemoryDrawerQuery, useMemoryShelveQuery } from "@/rekuest/api/graphql";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import React from "react";

const MemoryStructureReturnWidget: React.FC<ReturnWidgetProps> = ({
  port,
  widget,
  value,
}) => {

  if (!value) return <div className="text-white items-center flex justify-center h-full w-full">No value</div>;



  const { data} = useGetMemoryDrawerQuery({
    variables: {
       id: value.object,
    }
  })

  if (!value || typeof value !== "object" || !("object" in value)) {
    return <div className="text-white items-center flex justify-center h-full w-full">Invalid Memory Structure</div>;
  }


  return <div className="text-white items-center flex justify-center h-full w-full">{data?.memoryDrawer?.label}</div>
};

export { MemoryStructureReturnWidget };
