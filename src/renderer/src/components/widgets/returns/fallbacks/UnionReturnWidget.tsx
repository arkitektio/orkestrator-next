import { NotImplementedYet } from "@/app/components/fallbacks/NotImplemted";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import React from "react";

const UnionReturnWidget: React.FC<ReturnWidgetProps> = ({
  port,
  widget,
  value,
}) => {
  const { registry } = useWidgetRegistry();

  return (
    <div className="text-white">
      <NotImplementedYet />
    </div>
  );
};

export { UnionReturnWidget };
