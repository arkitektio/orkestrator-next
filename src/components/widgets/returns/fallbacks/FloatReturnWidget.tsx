import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import React from "react";

const FloatReturnWidget: React.FC<ReturnWidgetProps> = ({
  port,
  widget,
  value,
}) => {
  return <div className="text-white">{value}</div>;
};

export { FloatReturnWidget };
