import { cn, notEmpty } from "@/lib/utils";
import { useEffect, useState } from "react";
import { EffectWrapper } from "./EffectWrapper";
import { ArgPort, ReturnPort, PortGroup , PortOptions, WidgetRegistryType } from "./types";

export type ArgsContainerProps = {
  registry: WidgetRegistryType;
  ports: (ArgPort | null | undefined)[];
  groups?: (PortGroup | null | undefined)[] | undefined;
  options?: PortOptions | undefined;
  bound?: string; // Are we bound to a specific implementation?
  path: string[];
  hidden?: { [key: string]: boolean };
};

export type InputContainer = (props: ArgsContainerProps) => React.ReactNode;

export type ReturnContainerProps = {
  registry: WidgetRegistryType;
  ports: ReturnPort[];
  values: { [key: string]: any | null | undefined };
  options?: PortOptions | undefined;
  showKeys?: boolean;
  className?: string;
};

export type OutputContainer = (props: ReturnContainerProps) => React.ReactNode;

export const ReturnsContainer =  ({
  ports,
  values,
  registry,
  showKeys = false,
  className,
}: ReturnContainerProps) => {
  const len = ports.length;

  const lg_size = len < 2 ? len : 2;
  const xl_size = len < 3 ? len : 3;
  const xxl_size = len < 4 ? len : 4;
  const xxxl_size = len < 5 ? len : 5;
  const xxxxl_size = len < 6 ? len : 6;

  return (
    <div
      className={cn(
        `grid @lg:grid-cols-${lg_size} @xl-grid-cols-${xl_size} @2xl:grid-cols-${xxl_size}  @3xl:grid-cols-${xxxl_size}   @5xl:grid-cols-${xxxxl_size} gap-4`,
        className,
      )}
    >
      {Object.keys(values).map((key, index) => {
        const port = ports.find((p) => p.key === key);
        if (!port) return <>No Port</>;

        const Widget = registry.getReturnWidgetForPort(port);

        return (
          <div className="@container flex flex-col rounded rounded-md border-1" key={index}>
            {showKeys && (
              <label
                className="flex-initial font-light text-slate-200 mb-2"
                htmlFor={port.key}
              >
                {port.label || port.key}
              </label>
            )}
            <div className="flex-grow bg-background rounded rounded-md ">
              <EffectWrapper
                effects={port.effects || []}
                port={port}
                registry={registry}
              >
                <Widget
                  key={index}
                  port={port}
                  widget={port.widget}
                  value={values[key]}
                />
              </EffectWrapper>
            </div>
            {port.description && (
              <div
                id={`${port.key}-help`}
                className="text-xs mb-4 font-light flex-initial text-slate-400"
              >
                {port.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const WrappedReturnsContainer = ({
  ports,
  values,
  registry,
  showKeys = false,
  className,
}: ReturnContainerProps) => {
  return (
    <div className={cn("flex flex-row flex-wrap gap-2 w-full h-full", className)}>
      {Object.keys(values).map((key, index) => {
        const port = ports.find((p) => p.key === key);
        if (!port) return <>No Port</>;

        const Widget = registry.getReturnWidgetForPort(port);

        return (
          <div
            key={key}
            className="@container flex flex-col rounded rounded-md border-1 flex-1"
          >
            {showKeys && (
              <label
                className="flex-initial font-light text-slate-200 mb-2"
                htmlFor={port.key}
              >
                {port.label || port.key}
              </label>
            )}
            <div className="flex-grow bg-gray-800 rounded rounded-md max-h-[300px]">
              <EffectWrapper
                effects={port.effects || []}
                port={port}
                registry={registry}
              >
                <Widget
                  key={index}
                  port={port}
                  widget={port.widget}
                  value={values[key]}
                />
              </EffectWrapper>
            </div>
            {port.description && (
              <div
                id={`${port.key}-help`}
                className="text-xs mb-4 font-light flex-initial text-slate-400"
              >
                {port.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export type FilledGroup = PortGroup & {
  ports: ArgPort[];
};

export const ArgsContainer = ({
  ports,
  groups,
  options,
  path,
  hidden,
  registry,
}: ArgsContainerProps) => {
  const [filledGroups, setFilledGroups] = useState<FilledGroup[]>([]);

  useEffect(() => {
    const argGroups: FilledGroup[] = [
      { key: "default", hidden: false, ports: [] },
    ].concat(groups?.filter(notEmpty).map((g) => ({ ...g, ports: [] })) || []);
    const defaultGroup = argGroups.find((g) => g.key === "default");
    for (const port of ports) {
      if (!port) continue;
      if (!port?.groups) {
        argGroups.find((g) => g.key === "default")?.ports.push(port);
      } else {
        for (const group of port.groups) {
          const renderGroup = argGroups.find((g) => g.key === group);
          if (renderGroup) {
            renderGroup.ports.push(port);
          } else if (defaultGroup) {
            defaultGroup.ports.push(port);
          }
        }
      }
    }
    setFilledGroups(filledGroups);
  }, [ports]);

  const len = ports.length;

  const lg_size = len < 2 ? len : 2;
  const xl_size = len < 3 ? len : 3;
  const xxl_size = len < 4 ? len : 4;
  const xxxl_size = len < 5 ? len : 5;
  const xxxxl_size = len < 6 ? len : 6;

  return (
    <div
      className={`grid @lg:grid-cols-${lg_size} @xl-grid-cols-${xl_size} @2xl:grid-cols-${xxl_size}  @3xl:grid-cols-${xxxl_size}   @5xl:grid-cols-${xxxxl_size} gap-4`}
    >
      {ports.filter(notEmpty).map((port, index) => {
        if (hidden && hidden[port.key]) return null;
        const Widget = registry.getInputWidgetForPort(port);

        return (
          <div
            className="@container flex flex-col rounded rounded-md bg-gray-900 p-2 border-gray-800 border border-1"
            key={index}
          >
            <label
              className="flex-initial font-light text-slate-200 mb-2"
              htmlFor={port.key}
            >
              {port.label || port.key}
            </label>
            <div className="flex-grow bg-gray-800 rounded rounded-md max-h-[300px]">
              <EffectWrapper
                effects={port.effects || []}
                port={port}
                registry={registry}
              >
                <Widget
                  path={path}
                  key={index}
                  port={port}
                  widget={port.widget}
                  options={options}
                />
              </EffectWrapper>
            </div>
            {port.description && (
              <div
                id={`${port.key}-help`}
                className="text-xs mb-4 font-light flex-initial text-slate-400"
              >
                {port.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
