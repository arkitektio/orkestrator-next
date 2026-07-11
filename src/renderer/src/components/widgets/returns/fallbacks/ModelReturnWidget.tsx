import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReturnWidgetFragment } from "@/rekuest/api/graphql";
import { MappablePort, ReturnWidgetProps, ValueKind } from "@/rekuest/widgets/types";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import React from "react";

const ModelReturnWidget: React.FC<ReturnWidgetProps> = ({
  port,
  value,
}) => {
  const { registry } = useWidgetRegistry();

  const childPorts = port.children;

  const values: Record<string, ValueKind> =
    value != null && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, ValueKind>)
      : {};

  const len = childPorts?.length || 1;

  const lg_size = len < 2 ? len : 2;
  const xl_size = len < 3 ? len : 3;
  const xxl_size = len < 4 ? len : 4;
  const xxxl_size = len < 5 ? len : 5;
  const xxxxl_size = len < 6 ? len : 6;

  return (
    <div
      className={`grid @lg:grid-cols-${lg_size} @xl-grid-cols-${xl_size} @2xl:grid-cols-${xxl_size}  @3xl:grid-cols-${xxxl_size}   @5xl:grid-cols-${xxxxl_size} gap-5`}
    >
      {childPorts?.map((port, index) => {
        const Widget = registry.getReturnWidgetForPort(
          port as unknown as MappablePort,
        );

        return (
          <Card>
            <CardHeader>
              <CardTitle>{port.key}</CardTitle>
            </CardHeader>
            <CardContent>
              <Widget
                key={index}
                value={values[port.key]}
                port={port as unknown as ReturnWidgetProps["port"]}
                widget={port.widget as unknown as ReturnWidgetFragment}
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
