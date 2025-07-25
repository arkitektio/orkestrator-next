import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import React from "react";

const DateReturnWidget: React.FC<ReturnWidgetProps> = ({
  port,
  widget,
  value,
}) => {
  return <div className="text-white">{value}</div>;
};

export { DateReturnWidget };
