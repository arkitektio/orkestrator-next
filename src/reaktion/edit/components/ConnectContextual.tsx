import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { Button } from "@/components/ui/button";
import React from "react";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FlussPortFragment,
  GraphNodeKind,
  ReactiveImplementation,
} from "@/reaktion/api/graphql";
import { arkitektNodeToMatchingFlowNode } from "@/reaktion/plugins/rekuest";
import {
  ConstantNodeDocument,
  ConstantNodeQuery,
  DemandKind,
  NodeKind,
  NodeScope,
  PortKind,
  useAllNodesQuery,
  useProtocolOptionsLazyQuery,
} from "@/rekuest/api/graphql";
import { useRekuest, withRekuest } from "@jhnnsrs/rekuest-next";
import { ArrowDown, ListFilterIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ConnectContextualParams,
  DropContextualParams,
  FlowNode,
} from "../../types";
import { useEditRiver } from "../context";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NodeDescription } from "@jhnnsrs/rekuest";
import { nodeIdBuilder, streamToReadable } from "@/reaktion/utils";
import clsx from "clsx";

export const SearchForm = (props: { onSubmit: (data: any) => void }) => {
  const form = useForm({
    defaultValues: {
      protocol: undefined,
      search: undefined,
    },
  });

  const {
    formState,
    formState: { isValidating },
    watch,
  } = form;

  const formdata = watch();

  console.log("Rendering", formdata);

  useEffect(() => {
    console.log(formState.isValid, isValidating);
    if (formState.isValid && !isValidating) {
      console.log("submiting", formdata);
      props.onSubmit(formdata);
    }
  }, [formState, formdata, isValidating]);

  const [searchProtocol] = withRekuest(useProtocolOptionsLazyQuery)();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="">
        <div className="w-full">
          <Popover>
            <FormField
              control={form.control}
              name={"search"}
              render={({ field }) => (
                <PopoverAnchor asChild>
                  <FormItem className="h-full  w-full relative flex-row flex relative">
                    <FormControl>
                      <Input
                        placeholder={"Search...."}
                        autoFocus
                        autoComplete="off"
                        {...field}
                        type="string"
                        className="flex-grow h-full bg-background text-foreground w-full"
                      />
                    </FormControl>

                    <PopoverTrigger className="absolute right-1 text-foreground text-sm">
                      <ArrowDown className="w-4 h-4" />
                    </PopoverTrigger>
                  </FormItem>
                </PopoverAnchor>
              )}
            />
            <PopoverContent>
              <div className="flex flex-row gap-2">
                <div className="col-span-2">
                  <GraphQLSearchField
                    name="protocol"
                    label="Protocol"
                    searchQuery={searchProtocol}
                    placeholder="Filter"
                    description="Filter by protocol"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </form>
    </Form>
  );
};

export const allandone = <T extends any>(
  left: T[],
  right: T[],
  predicate: (l: T, r: T) => boolean,
) => {
  return (
    left.every((l) => right.some((r) => predicate(l, r))) &&
    left.length == right.length &&
    right.length > 0
  );
};

const connectReactiveNodes = (
  leftPorts: FlussPortFragment[],
  rightPorts: FlussPortFragment[],
): FlowNode[] => {
  const nodes: FlowNode[] = [];

  if (!leftPorts || !rightPorts) {
    return [];
  }

  if (
    allandone(leftPorts, rightPorts, (port) => port.kind === PortKind.Float)
  ) {
    nodes.push({
      id: nodeIdBuilder(),
      type: "ReactiveNode",
      position: { x: 0, y: 0 },
      data: {
        globalsMap: {},
        title: "Round",
        description: "Round an Float to an Int",
        kind: GraphNodeKind.Reactive,
        ins: [leftPorts],
        constantsMap: {},
        outs: [
          rightPorts.map((p, index) => ({
            ...p,
            key: "Rounded" + p.key,
            kind: PortKind.Int,
          })),
        ],
        constants: [],
        implementation: ReactiveImplementation.ToList,
      },
    });
  }

  if (rightPorts.length == 0) {
    nodes.push({
      id: nodeIdBuilder(),
      type: "ReactiveNode",
      position: { x: 0, y: 0 },
      data: {
        globalsMap: {},
        title: "Omit",
        description: "Discard the stream an just send an event",
        kind: GraphNodeKind.Reactive,
        ins: [leftPorts],
        constantsMap: {},
        outs: [[]],
        constants: [],
        implementation: ReactiveImplementation.Omit,
      },
    });
  }

  return nodes;
};

export const ConnectContextual = (props: {
  params: ConnectContextualParams;
}) => {
  const { addConnectContextualNode } = useEditRiver();

  const { client } = useRekuest();

  const onSubmit = (data: any) => {
    refetch({
      ...variables,
      filters: { ...variables.filters },
    });
  };

  const leftPorts = props.params.leftNode.data.outs[props.params.leftStream];
  const rightPorts = props.params.rightNode.data.ins[props.params.rightStream];

  const variables = {
    filters: {
      demands: [
        {
          kind: DemandKind.Args,
          matches:
            leftPorts.map((port, index) => ({
              at: index,
              kind: port.kind,
              identifier: port.identifier,
            })) || [],
          forceNonNullableLength: leftPorts.length || 0,
        },
        {
          kind: DemandKind.Returns,
          matches:
            rightPorts.map((port, index) => ({
              at: index,
              kind: port.kind,
              identifier: port.identifier,
            })) || [],
          forceNonNullableLength: rightPorts.length || 0,
        },
      ],
    },
    pagination: {
      limit: 2,
    },
  };

  const { data, refetch } = withRekuest(useAllNodesQuery)({
    variables: variables,
    fetchPolicy: "network-only",
  });

  const [searchProtocol] = withRekuest(useProtocolOptionsLazyQuery)();

  const onNodeClick = (id: string) => {
    client &&
      client
        .query<ConstantNodeQuery>({
          query: ConstantNodeDocument,
          variables: { id: id },
        })
        .then(async (event) => {
          console.log(event);
          if (event.data?.node) {
            let flownode = arkitektNodeToMatchingFlowNode(event.data?.node, {
              x: 0,
              y: 0,
            });
            console.log("Trying to add", flownode, props.params);
            addConnectContextualNode(flownode, props.params);
          }
        });
  };

  const calculatedNodes =
    leftPorts && rightPorts ? connectReactiveNodes(leftPorts, rightPorts) : [];

  return (
    <Card
      className="absolute  z-50 p-2 max-w-[200px] text-xs bg-sidebar flex flex-col opacity-70 data-[found=true]:opacity-100 shadow-xl shadow-xl dark:shadow-xl dark:shadow-xl "
      style={{
        left: props.params.position.x,
        top: props.params.position.y,
      }}
      data-found={data?.nodes?.length != 0}
    >
      <div className="text-xs text-muted-foreground inline relative mx-auto mb-2  ">
        {streamToReadable(leftPorts)} to {streamToReadable(rightPorts)}
      </div>

      <SearchForm onSubmit={onSubmit} />

      <Separator />
      {data?.nodes?.length == 0 && calculatedNodes.length == 0 && (
        <div className="my-auto mx-auto mt-2">No matching nodes found</div>
      )}
      <div className="flex flex-row gap-1 my-auto flex-wrap mt-2">
        {data?.nodes.map((node) => (
          <Tooltip>
            <TooltipTrigger>
              <Card
                onClick={() => onNodeClick(node.id)}
                className={clsx(
                  "px-2 py-1 border",
                  node.scope == NodeScope.Global ? "" : "dark:border-blue-200",
                )}
              >
                {node.name}
              </Card>
            </TooltipTrigger>
            <TooltipContent align="center">
              {node.description && (
                <NodeDescription description={node.description} />
              )}
              {node.scope == NodeScope.Global ? (
                " "
              ) : (
                <div className="text-blue-200 mt-2">
                  This Node will bind this workflow to specific apps
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex flex-row gap-1 my-auto flex-wrap mt-2">
        {calculatedNodes.map((node) => (
          <Tooltip>
            <TooltipTrigger>
              <Card
                onClick={() => addConnectContextualNode(node, props.params)}
                className="px-2 py-1 border-solid border-2 border-accent"
              >
                {node.data.title}
              </Card>
            </TooltipTrigger>
            <TooltipContent align="center">
              {node.data.description}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </Card>
  );
};

export const TargetDropContextual = (props: {
  params: DropContextualParams;
  ports: FlussPortFragment[];
}) => {
  return (
    <Card
      className="absolute translate-x-[-50%] z-50"
      style={{
        left: props.params.position.x,
        top: props.params.position.y,
      }}
    >
      Target Action Right Here
    </Card>
  );
};
