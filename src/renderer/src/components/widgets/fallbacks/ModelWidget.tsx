import { PortKind } from "@/rekuest/api/graphql";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { InputWidgetProps, Port } from "@/rekuest/widgets/types";
import React from "react";

export type UnionValue = {
  use: number;
  value: any;
};

const ModelWidget: React.FC<InputWidgetProps> = ({
  port,
  path,
  widget,
  parentKind,
}) => {
  return (
    <>
      {port.children?.map((port) => {
        const Widget = useWidgetRegistry().registry.getInputWidgetForPort(port);

        return (
          <Widget
            port={
              {
                ...port,
                __typename: "Port",
              } as Port
            }
            path={path.concat(port.key)}
            widget={port.assignWidget}
            parentKind={PortKind.Model}
          />
        );
      })}
    </>
  );
};

export { ModelWidget };
