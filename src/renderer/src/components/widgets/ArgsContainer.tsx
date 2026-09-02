import { AssignWidgetFragment } from "@/rekuest/api/graphql";
import { notEmpty } from "@/lib/utils";
import { EffectWrapper } from "@/rekuest/widgets/EffectWrapper";
import { ArgsContainerProps } from "@/rekuest/widgets/tailwind";
import { ArgPort, PortGroup } from "@/rekuest/widgets/types";
import { useMemo } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export type FilledGroup = PortGroup & {
  filledPorts: ArgPort[];
};

export const portHash = (port: ArgPort[]) => {
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

const EMPTY_EFFECTS: ArgPort["effects"] = [];

type ResolvedPort = {
  port: ArgPort;
  Widget: ReturnType<ArgsContainerProps["registry"]["getInputWidgetForPort"]>;
  path: string[];
  effects: NonNullable<ArgPort["effects"]>;
};

type ResolvedGroup = FilledGroup & { resolvedPorts: ResolvedPort[] };

export const ArgsContainer = ({
  ports,
  groups,
  options,
  registry,
  hidden,
  bound,
  path,
}: ArgsContainerProps) => {
  const hash = portHash(ports.filter(notEmpty));
  const pathKey = path.join(".");

  // Resolve widgets, paths and effects once per port set. Doing this in the
  // render body handed every widget fresh `path` / `effects` arrays on each
  // render, which defeated memoization down the widget tree and re-triggered
  // search queries keyed on those props.
  const resolvedGroups = useMemo<ResolvedGroup[]>(() => {
    const presentPorts = ports.filter(notEmpty);
    const effectiveGroups: PortGroup[] =
      !groups || groups.length === 0
        ? [{ key: "default", ports: presentPorts.map((p) => p.key) }]
        : groups.filter(notEmpty);

    return effectiveGroups.map((g) => {
      const filledPorts = presentPorts.filter((x) => g.ports.includes(x?.key));
      return {
        ...g,
        filledPorts,
        resolvedPorts: filledPorts.map((port) => ({
          port,
          Widget: registry.getInputWidgetForPort(port),
          path: [...path, port.key],
          effects: port.effects || EMPTY_EFFECTS,
        })),
      };
    });
    // `hash` and `pathKey` stand in for the identity of `ports` / `path`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, groups, registry, pathKey]);

  const glen = groups?.length || 0;

  const glg_size = glen < 2 ? glen : 2;
  const gxl_size = glen < 3 ? glen : 3;
  const gxxl_size = glen < 4 ? glen : 4;
  const gxxxl_size = glen < 5 ? glen : 5;
  const gxxxxl_size = glen < 6 ? glen : 6;


  return (
    <div
      className={`grid @lg:grid-cols-${glg_size} @xl:grid-cols-${gxl_size} @2xl:grid-cols-${gxxl_size}  @3xl:grid-cols-${gxxxl_size}   @5xl:grid-cols-${gxxxxl_size} gap-5`}
    >
      {resolvedGroups.map((group) => {
        const len = group.filledPorts.length;

        const lg_size = len < 2 ? len : 2;
        const xl_size = len < 3 ? len : 3;
        const xxl_size = len < 4 ? len : 4;
        const xxxl_size = len < 5 ? len : 5;
        const xxxxl_size = len < 6 ? len : 6;


        return (
          <Collapsible key={group.key} className="@container" defaultOpen={true}>
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
              <div className={`grid @lg:grid-cols-${lg_size} @xl:grid-cols-${xl_size} @2xl:grid-cols-${xxl_size}  @3xl:grid-cols-${xxxl_size}   @5xl:grid-cols-${xxxxl_size} gap-5`}>


                {group.resolvedPorts.map(({ port, Widget, path: portPath, effects }) => {
                  if (hidden && hidden[port.key]) return null;

                  return (
                    <EffectWrapper
                      key={port.key}
                      effects={effects}
                      port={port}
                      registry={registry}
                    >
                      <Widget
                        port={port}
                        bound={bound}
                        widget={port.widget as unknown as AssignWidgetFragment}
                        options={options}
                        path={portPath}
                      />
                    </EffectWrapper>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};
