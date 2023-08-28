import { ReturnWidgetProps } from "@jhnnsrs/rekuest";
import React from "react";

const BoolReturnWidget: React.FC<ReturnWidgetProps> = ({
  port,
  widget,
  value,
}) => {
  return <div className="text-white">{value}</div>;
};

export { BoolReturnWidget };
