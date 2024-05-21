import { notEmpty } from "@/lib/utils";
import { useMemo } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Port, PortGroup } from "@/rekuest/widgets/types";
import { ArgsContainerProps } from "@/rekuest/widgets/tailwind";
import { EffectWrapper } from "@/rekuest/widgets/EffectWrapper";

export type FilledGroup = PortGroup & {
  ports: Port[];
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
}: ArgsContainerProps) => {
  let hash = portHash(ports.filter(notEmpty));

  const filledGroups = useMemo(() => {
    let argGroups: FilledGroup[] = [
      { key: "default", ports: [], hidden: false },
    ].concat(groups?.filter(notEmpty).map((g) => ({ ...g, ports: [] })) || []);
    let defaultGroup = argGroups.find((g) => g.key === "default");
    for (let port of ports) {
      if (!port) continue;
      if (!port?.groups) {
        argGroups.find((g) => g.key === "default")?.ports.push(port);
      } else {
        for (let group of port.groups) {
          let renderGroup = argGroups.find((g) => g.key === group);
          if (renderGroup) {
            renderGroup.ports.push(port);
          } else if (defaultGroup) {
            defaultGroup.ports.push(port);
          }
        }
      }
    }
    return argGroups;
  }, [ports, hash]);

  let len = ports.length;

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
          <Collapsible
            defaultOpen={!group.hidden}
            key={index}
            className="@container"
          >
            {group.key != "default" && (
              <CollapsibleTrigger>{group.key}</CollapsibleTrigger>
            )}
            <CollapsibleContent>
              {group.ports.map((port, index) => {
                const Widget = registry.getInputWidgetForPort(port);

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
                      widget={port.assignWidget}
                      options={options}
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
