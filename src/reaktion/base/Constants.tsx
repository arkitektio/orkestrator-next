import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Form } from "@/components/ui/form";
import { notEmpty } from "@/lib/utils";
import { PortFragment } from "@/rekuest/api/graphql";
import { usePortForm } from "@/rekuest/hooks/usePortForm";
import { EffectWrapper } from "@/rekuest/widgets/EffectWrapper";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { ArgsContainerProps } from "@/rekuest/widgets/tailwind";
import { submittedDataToRekuestFormat } from "@/rekuest/widgets/utils";

import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronUpIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo, useState } from "react";

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
  onToArg,
  onToGlobal,
  registry,
  path
}: ArgsContainerProps & {
  onToArg?: (port: PortFragment) => void;
  onToGlobal?: (port: PortFragment, key?: string | undefined) => void;
}) => {
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
          <Collapsible defaultOpen={!group.hidden} key={index}>
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
                    <div className="flex flex-row gap-2 justify-between">
                      <div className="flex-grow">
                        <Widget
                          key={index}
                          port={port}
                          widget={port.assignWidget}
                          options={options}
                          path={path.concat(port.key)}
                        />
                      </div>
                      <div className="my-auto flex-col flex">
                        {onToArg && (
                          <Button
                            variant="ghost"
                            className="py-1 px-1"
                            onClick={() => onToArg(port)}
                          >
                            <ChevronUpIcon />
                          </Button>
                        )}
                        {onToGlobal && (
                          <Button
                            variant="ghost"
                            className="py-1 px-1"
                            onClick={() => onToGlobal(port, undefined)}
                          >
                            <DoubleArrowUpIcon />
                          </Button>
                        )}
                      </div>
                    </div>
                  </EffectWrapper>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        );
        <NanaContainer />;
      })}
    </div>
  );
};

export const Constants = (props: {
  ports: PortFragment[];
  path: string[];
  onSubmit: (data: any) => void;
  overwrites: { [key: string]: any };
  onToArg?: (port: PortFragment) => void;
  onToGlobal?: (port: PortFragment, key?: string | undefined) => void;
}) => {

  const form = usePortForm({
    ports: props.ports,
    overwrites: props.overwrites,
  });

  const {
    formState,
    formState: { isValidating },
    watch,
  } = form;

  const data = watch();

  const onSubmit = (data: any) => {
    props.onSubmit(data);
  }


  useEffect(() => {
    if (formState.isValid && !isValidating) {
      if (props.onSubmit) {

        props.onSubmit(submittedDataToRekuestFormat(data, props.ports));
      }
    }
  }, [formState, data, isValidating]); 


  const { registry } = useWidgetRegistry();

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-1"
        >
          <ArgsContainer
            registry={registry}
            ports={props.ports}
            onToArg={props.onToArg}
            onToGlobal={props.onToGlobal}
            path={props.path}
          />
        </form>
      </Form>
    </>
  );
};

export const TestConstants = (props: {
  ports: PortFragment[];
  overwrites: { [key: string]: any };
  onToArg?: (port: PortFragment) => void;
  onToGlobal?: (port: PortFragment, key?: string | undefined) => void;
  onSubmit?: (data: any) => void;
}) => {
  const form = usePortForm({
    ports: props.ports,
    overwrites: props.overwrites,

  });

  function onSubmit(data: any) {
    if (props.onSubmit) {
      props.onSubmit(data);
    }
  }

  const {
    formState,
    formState: { isValidating, isValid, errors },
    
    watch,
  } = form;





  const { registry } = useWidgetRegistry();

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <ArgsContainer
            registry={registry}
            ports={props.ports}
            onToArg={props.onToArg}
            onToGlobal={props.onToGlobal}
            path={[]}
          />
          {isValid && <div>{props.onSubmit && (
            <button type="submit" className="btn">
              {" "}
              Submit{" "}
            </button>
          )}</div>}
          {errors && <div>{JSON.stringify(errors)}</div>}
        </form>
      </Form>
    </>
  );
};
