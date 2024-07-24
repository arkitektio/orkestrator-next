import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import React from "react";

const ModelReturnWidget: React.FC<ReturnWidgetProps> = ({
  port,
  widget,
  value,
}) => {
  const { registry } = useWidgetRegistry();

  const childPorts = port.children;

  let len = childPorts?.length || 1;

  let lg_size = len < 2 ? len : 2;
  let xl_size = len < 3 ? len : 3;
  let xxl_size = len < 4 ? len : 4;
  let xxxl_size = len < 5 ? len : 5;
  let xxxxl_size = len < 6 ? len : 6;

  return (
    <div
      className={`grid @lg:grid-cols-${lg_size} @xl-grid-cols-${xl_size} @2xl:grid-cols-${xxl_size}  @3xl:grid-cols-${xxxl_size}   @5xl:grid-cols-${xxxxl_size} gap-5`}
    >
      {childPorts?.map((port, index) => {
        const Widget = registry.getReturnWidgetForPort(port);

        return (
          <Card>
            <CardHeader>
              <CardTitle>{port.label || port.key}</CardTitle>
            </CardHeader>
            <CardContent>
              <Widget
                key={index}
                value={value[port.key]}
                port={port}
                widget={port.returnWidget}
                options={{ disable: false }}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export { ModelReturnWidget };
