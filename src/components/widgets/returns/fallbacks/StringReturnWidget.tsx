import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import React from "react";

const StringReturnWidget: React.FC<ReturnWidgetProps> = ({
  port,
  widget,
  value,
}) => {
  return <div className="text-white">{value}</div>;
};

export { StringReturnWidget };
