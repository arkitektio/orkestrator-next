import { notEmpty } from "@/lib/utils";
import { EffectWrapper } from "@/rekuest/widgets/EffectWrapper";
import { ArgsContainerProps } from "@/rekuest/widgets/tailwind";
import { Port, PortGroup } from "@/rekuest/widgets/types";
import { useMemo } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export type FilledGroup = PortGroup & {
  filledPorts: Port[];
};

export const portHash = (port: Port[]) => {
  return port
    .map((port) => `${port.key}-${port.kind}-${port.identifier}`)
    .join("-");
};

export const NanaContainer = () => {
  return (
    <div className="grid @lg:grid-cols-2 @lg:grid-cols-2 @xl:grid-cols-3 @2xl:grid-cols-4 @3xl:grid-cols-5 @5xl:grid-cols-6 gap-5">
      {" "}
    </div>
  );
};

export const ArgsContainer = ({
  ports,
  groups,
  options,
  registry,
  hidden,
  bound,
  path,
}: ArgsContainerProps) => {
  let hash = portHash(ports.filter(notEmpty));

  const filledGroups = useMemo(() => {
    if (!groups || groups.length === 0) {
      groups = [
        {
          key: "default",
          ports: ports.filter(notEmpty).map((p) => p.key),
        },
      ];
    }

    let argGroups: FilledGroup[] = groups.filter(notEmpty).map((g) => ({
      ...g,
      filledPorts: ports
        .filter(notEmpty)
        .filter((x) => g.ports.includes(x?.key)),
    }));

    return argGroups;
  }, [ports, hash]);

  let len = 1;

  let lg_size = len < 2 ? len : 2;
  let xl_size = len < 3 ? len : 3;
  let xxl_size = len < 4 ? len : 4;
  let xxxl_size = len < 5 ? len : 5;
  let xxxxl_size = len < 6 ? len : 6;

  return (
    <div
      className={`grid @lg:grid-cols-${lg_size} @xl:grid-cols-${xl_size} @2xl:grid-cols-${xxl_size}  @3xl:grid-cols-${xxxl_size}   @5xl:grid-cols-${xxxxl_size} gap-5 `}
    >
      {filledGroups.map((group, index) => {
        return (
          <Collapsible key={index} className="@container" defaultOpen={true}>
            {group.key != "default" && (
              <div className="mb-2">
                <CollapsibleTrigger className="text-xs">
                  {group.key}
                </CollapsibleTrigger>
                <p className="text-muted-foreground text-xs">
                  {group.description}
                </p>
              </div>
            )}
            <CollapsibleContent>
              {group.filledPorts.map((port, index) => {
                const Widget = registry.getInputWidgetForPort(port);
                if (hidden && hidden[port.key]) return null;

                return (
                  <EffectWrapper
                    key={index}
                    effects={port.effects || []}
                    port={port}
                    registry={registry}
                  >
                    <Widget
                      key={index}
                      port={port}
                      bound={bound}
                      widget={port.assignWidget}
                      options={options}
                      path={[...path, port.key]}
                    />
                  </EffectWrapper>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};
