import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ActionDescription } from "@/lib/rekuest/ActionDescription";
import { useAction } from "../hooks/useAction";
import { usePortForm } from "../hooks/usePortForm";
import { useWidgetRegistry } from "../widgets/WidgetsContext";
import * as z from "zod";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { notEmpty } from "@/lib/utils";
import { EffectWrapper } from "@/rekuest/widgets/EffectWrapper";
import { ArgsContainerProps } from "@/rekuest/widgets/tailwind";
import { Port, PortGroup } from "@/rekuest/widgets/types";
import { useMemo } from "react";
import { useGetActionQuery } from "@/kraph/api/graphql";
import {
  useAgentOptionsLazyQuery,
  useAgentsLazyQuery,
  useCreateShortcutMutation,
  useDetailActionQuery,
  useReserveMutation,
} from "../api/graphql";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { StringField } from "@/components/fields/StringField";
import { RekuestAgent, RekuestShortcut } from "@/linkers";
import { useNavigate } from "react-router-dom";
import { SwitchField } from "@/components/fields/SwitchField";

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

const ArgsContainer = ({
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
                  <div className="w-full flex flex-row items-center space-x-2">
                    <div className="flex-grow">
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
                    </div>
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};

export const ReserveForm = (props: {
  id: string;
  args?: { [key: string]: any };
  hidden?: { [key: string]: any };
}) => {
  const { data: actiondata } = useDetailActionQuery({
    variables: {
      id: props.id,
    },
  });

  const [create] = useCreateShortcutMutation();

  const action = actiondata?.action;

  const [search] = useAgentOptionsLazyQuery();

  let [chosenArgs, setChosenArgs] = React.useState<string[]>([]);

  const form = usePortForm({
    ports: action?.args.filter((arg) => chosenArgs.includes(arg.key)) || [],
    overwrites: { ...props.args, name: action?.name },
    additionalSchema: z.object({
      name: z.string().nonempty(),
      allowQuick: z.boolean().default(false),
    }),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    console.log("Submitting");
    console.log(data);

    const { toolbox, name, allowQuick, ...rest } = data;

    await create({
      variables: {
        input: {
          name: name,
          action: props.id,
          args: rest,
          allowQuick: allowQuick,
        },
      },
    }).then(
      (res) => {
        if (res.data?.createShortcut?.id) {
          navigate(RekuestShortcut.linkBuilder(res.data?.createShortcut?.id));
        }
      },
      (err) => {
        console.log(err);
      },
    );
  };

  const data = form.watch();
  const isSubmitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;

  const { registry } = useWidgetRegistry();

  return (
    <div>
      <DialogHeader>
        <DialogTitle>{action?.name}</DialogTitle>
      </DialogHeader>

      <DialogDescription className="mt2">
        {action?.description && (
          <ActionDescription description={action?.description} variables={data} />
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <div className="w-full flex flex-row items-center space-x-2 mt-2">
              {action?.args.length > 0 &&
                action?.args.map((arg) => {
                  return (
                    <Badge
                      key={arg.key}
                      onClick={() => {
                        setChosenArgs((chosenArgs) =>
                          chosenArgs.includes(arg.key)
                            ? chosenArgs.filter((k) => k !== arg.key)
                            : [...chosenArgs, arg.key],
                        );
                      }}
                      className="p-2"
                    >
                      <div>{arg.label || arg.key}</div>
                    </Badge>
                  );
                })}
            </div>
            {action?.args.length == 0 && (
              <div className="text-muted"> No Arguments needed</div>
            )}
            <ArgsContainer
              registry={registry}
              groups={action?.portGroups || []}
              ports={
                action?.args.filter((arg) => chosenArgs.includes(arg.key)) || []
              }
              hidden={props.args}
              path={[]}
            />

            <StringField
              name="name"
              label="Name"
              description="The name of the shortcut"
            />

            <SwitchField
              name="allowQuick"
              label="Allow Quick"
              description="Quick access will allow you to run this shortcut without any confirmation"
            />

            <DialogFooter>
              <Button variant={"outline"} disabled={!isValid}>
                {" "}
                Reserve
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogDescription>
    </div>
  );
};

export const ReserveFormDialog = (props: {
  id: string;
  args?: { [key: string]: any };
}) => {
  const { data } = useDetailActionQuery({
    variables: {
      id: props.id,
    },
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  let [chosenArgs, setChosenArgs] = React.useState<string[]>([]);

  return (
    <div>
      <DialogHeader>
        <DialogTitle>{data?.action?.name}</DialogTitle>
      </DialogHeader>

      <DialogDescription className="mt2">
        {data?.action?.description && (
          <ActionDescription
            description={data.action?.description}
            variables={data}
          />
        )}
        {data?.action?.args.length == 0 && (
          <div className="text-muted"> No Arguments needed</div>
        )}

        <div className="text-xs">
          Choose your arguments that you want to preset
        </div>
        <div className="w-full flex flex-row items-center space-x-2 mt-2">
          {data?.action.args.length > 0 &&
            data?.action.args.map((arg) => {
              return (
                <Badge
                  key={arg.key}
                  onClick={() => {
                    setChosenArgs((chosenArgs) =>
                      chosenArgs.includes(arg.key)
                        ? chosenArgs.filter((k) => k !== arg.key)
                        : [...chosenArgs, arg.key],
                    );
                  }}
                  className="p-2"
                >
                  <div>{arg.key}</div>
                  <div>{arg.description}</div>
                </Badge>
              );
            })}
        </div>

        <DialogFooter>
          <Button variant={"outline"}> Reserve</Button>
        </DialogFooter>
      </DialogDescription>
    </div>
  );
};
