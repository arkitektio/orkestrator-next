import { ReturnWidgetProps } from "@jhnnsrs/rekuest";
import React from "react";

const StringReturnWidget: React.FC<ReturnWidgetProps> = ({
  port,
  widget,
  value,
}) => {
  return <div className="text-white">{value}</div>;
};

export { StringReturnWidget };
