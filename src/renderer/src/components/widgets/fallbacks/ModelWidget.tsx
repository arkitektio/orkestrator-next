import { AssignWidgetFragment, PortKind } from "@/rekuest/api/graphql";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { InputWidgetProps, MappablePort, Port } from "@/rekuest/widgets/types";
import React from "react";

export type UnionValue = {
  use: number;
  value: any;
};

const ModelWidget: React.FC<InputWidgetProps> = ({
  port,
  path,
  bound,
}) => {
  return (
    <>
      {port.children?.map((port) => {
        const Widget = useWidgetRegistry().registry.getInputWidgetForPort(
          port as unknown as MappablePort,
        );

        return (
          <Widget
            port={
              {
                ...port,
                __typename: "Port",
              } as unknown as Port
            }
            path={path.concat(port.key)}
            widget={port.widget as unknown as AssignWidgetFragment}
            bound={bound}
            parentKind={PortKind.Model}
          />
        );
      })}
    </>
  );
};

export { ModelWidget };
