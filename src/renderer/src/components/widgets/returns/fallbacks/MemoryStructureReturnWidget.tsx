import { useGetMemoryDrawerQuery } from "@/rekuest/api/graphql";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import React from "react";

const MemoryStructureReturnWidget: React.FC<ReturnWidgetProps> = ({
  value,
}) => {

  if (!value || typeof value !== "object" || Array.isArray(value) || !("object" in value)) {
    return <div className="text-white items-center flex justify-center h-full w-full">Invalid Memory Structure</div>;
  }

  const { data} = useGetMemoryDrawerQuery({
    variables: {
       id: String((value as Record<string, unknown>).object),
    }
  })

  return <div className="text-white items-center flex justify-center h-full w-full">{data?.memoryDrawer?.label}</div>
};

export { MemoryStructureReturnWidget };
