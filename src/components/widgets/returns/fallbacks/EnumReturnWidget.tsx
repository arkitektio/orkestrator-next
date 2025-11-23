import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import React from "react";

const EnumReturnWidget: React.FC<ReturnWidgetProps> = ({
  port,
  widget,
  value,
}) => {
  return <div className="text-white items-center flex justify-center h-full w-full">{value}</div>;
};

export { EnumReturnWidget };
