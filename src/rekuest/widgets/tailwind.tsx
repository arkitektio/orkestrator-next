import { notEmpty } from "@/lib/utils";
import { useEffect, useState } from "react";
import { EffectWrapper } from "./EffectWrapper";
import { Port, PortGroup, PortOptions, WidgetRegistryType } from "./types";

export type ArgsContainerProps = {
  registry: WidgetRegistryType;
  ports: (Port | null | undefined)[];
  groups?: (PortGroup | null | undefined)[] | undefined;
  options?: PortOptions | undefined;
  bound?: string; // Are we bound to a specific template?
  path: string[];
};

export type InputContainer = (props: ArgsContainerProps) => JSX.Element;

export type ReturnContainerProps = {
  registry: WidgetRegistryType;
  ports: Port[];
  values: { [key: string]: any | null | undefined };
  options?: PortOptions | undefined;
  showKeys?: boolean;
};

export type OutputContainer = (props: ReturnContainerProps) => JSX.Element;

export const ReturnsContainer: OutputContainer = ({
  ports,
  values,
  registry,
  showKeys = false,
}) => {
  let len = ports.length;

  let lg_size = len < 2 ? len : 2;
  let xl_size = len < 3 ? len : 3;
  let xxl_size = len < 4 ? len : 4;
  let xxxl_size = len < 5 ? len : 5;
  let xxxxl_size = len < 6 ? len : 6;

  return (
    <div
      className={`grid @lg:grid-cols-${lg_size} @xl-grid-cols-${xl_size} @2xl:grid-cols-${xxl_size}  @3xl:grid-cols-${xxxl_size}   @5xl:grid-cols-${xxxxl_size} gap-4`}
    >
      {Object.keys(values).map((key, index) => {
        let port = ports.find((p) => p.key === key);
        if (!port) return <>No Port</>;

        const Widget = registry.getReturnWidgetForPort(port);

        return (
          <div className="@container flex flex-col rounded rounded-md border-1">
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
                  widget={port.returnWidget}
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
  ports: Port[];
};

export const ArgsContainer: InputContainer = ({
  ports,
  groups,
  options,
  path,
  registry,
}) => {
  const [filledGroups, setFilledGroups] = useState<FilledGroup[]>([]);

  useEffect(() => {
    let argGroups: FilledGroup[] = [
      { key: "default", hidden: false, ports: [] },
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
    setFilledGroups(filledGroups);
  }, [ports]);

  let len = ports.length;

  let lg_size = len < 2 ? len : 2;
  let xl_size = len < 3 ? len : 3;
  let xxl_size = len < 4 ? len : 4;
  let xxxl_size = len < 5 ? len : 5;
  let xxxxl_size = len < 6 ? len : 6;

  return (
    <div
      className={`grid @lg:grid-cols-${lg_size} @xl-grid-cols-${xl_size} @2xl:grid-cols-${xxl_size}  @3xl:grid-cols-${xxxl_size}   @5xl:grid-cols-${xxxxl_size} gap-4`}
    >
      {ports.filter(notEmpty).map((port, index) => {
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
                  widget={port.assignWidget}
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
