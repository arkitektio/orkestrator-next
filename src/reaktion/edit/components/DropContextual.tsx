import { useRekuest } from "@/arkitekt/Arkitekt";
import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NodeDescription } from "@/lib/rekuest/NodeDescription";
import {
  FlussPortFragment,
  GraphNodeKind,
  PortKind,
  ReactiveImplementation,
} from "@/reaktion/api/graphql";
import { rekuestNodeToMatchingNode } from "@/reaktion/plugins/rekuest";
import {
  listPortToSingle,
  nodeIdBuilder,
  streamToReadable,
} from "@/reaktion/utils";
import {
  AllNodesQueryVariables,
  ConstantNodeDocument,
  ConstantNodeQuery,
  DemandKind,
  NodeScope,
  useAllNodesQuery,
  useProtocolOptionsLazyQuery,
} from "@/rekuest/api/graphql";
import clsx from "clsx";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DropContextualParams, FlowNode } from "../../types";
import { useEditRiver } from "../context";
import { ContextualContainer } from "./ContextualContainer";

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

  const [searchProtocol] = useProtocolOptionsLazyQuery();

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

export type ReactiveNodeSuggestions = {
  node: FlowNode;
  title: string;
  description: string;
};

const reactiveNodes = (
  ports: FlussPortFragment[],
  params: DropContextualParams,
): ReactiveNodeSuggestions[] => {
  const nodes: ReactiveNodeSuggestions[] = [];

  if (!ports) {
    return [];
  }

  if (ports.every((port) => port.kind === PortKind.List)) {
    nodes.push({
      node: {
        id: nodeIdBuilder(),
        type: "ReactiveNode",
        position: { x: 0, y: 0 },
        data: {
          globalsMap: {},
          title: "Chunk",
          description: "Transforms a stream into an item of chunks",
          kind: GraphNodeKind.Reactive,
          ins: [ports],
          constantsMap: {},
          outs: [
            ports.map((p, index) => listPortToSingle(p, "Chunked" + p.key)),
          ],
          voids: [],
          constants: [],
          implementation: ReactiveImplementation.Chunk,
        },
      },
      title: "Chunk",
      description: "Transforms a stream into an item of chunks",
    });
  }

  if (ports && ports.length > 1) {
    for (let i = 0; i < ports.length; i++) {
      nodes.push({
        node: {
          id: nodeIdBuilder(),
          type: "ReactiveNode",
          position: { x: 0, y: 0 },
          data: {
            globalsMap: {},
            title: `Only`,
            description: "Transforms a stream into an item of chunks",
            kind: GraphNodeKind.Reactive,
            ins: [ports],
            constants: [],
            constantsMap: {
              index: i,
            },
            outs: [[ports.at(i)]],
            voids: [],
            implementation: ReactiveImplementation.Select,
          },
        },
        title: `Only ${ports.at(i)?.key}`,
        description: "Transforms a stream into an item of chunks",
      });
    }
  }

  nodes.push({
    node: {
      id: nodeIdBuilder(),
      type: "ReactiveNode",
      position: { x: 0, y: 0 },
      data: {
        globalsMap: {},
        title: `Zip`,
        description: "Transforms a stream into an item of chunks",
        kind: GraphNodeKind.Reactive,
        ins:
          params.relativePosition == "topleft" ||
          params.relativePosition == "topright"
            ? [[], ports]
            : [ports, []],
        outs: [ports],
        constants: [],
        constantsMap: {},
        voids: [],
        implementation: ReactiveImplementation.Zip,
      },
    },
    title: `Zip with ...`,
    description: "Transforms a stream into an item of chunks",
  });

  return nodes;
};

const displayLimit = 5;

export const TargetDropContextual = (props: {
  params: DropContextualParams;
  ports: FlussPortFragment[] | null | undefined;
}) => {
  const { addContextualNode } = useEditRiver();

  const client = useRekuest();
  const [variables, setVariables] = useState<AllNodesQueryVariables>({
    filters: {
      demands: [
        {
          kind: DemandKind.Args,
          matches:
            props.ports?.map((port, index) => ({
              at: index,
              kind: port.kind,
              identifier: port.identifier,
              children: port.children?.map((port, index) => ({
                at: index,
                kind: port.kind,
                identifier: port.identifier,
              })),
            })) || [],
          forceNonNullableLength: props.ports?.length || 0,
        },
      ],
    },
    pagination: {
      limit: displayLimit,
    },
  });

  useEffect(() => {
    refetch(variables);
  }, [variables]);

  const onSubmit = (data: any) => {
    setVariables((v) => ({
      ...v,
      filters: {
        ...v.filters,
        search: data.search,
      },
    }));
  };

  const { data, refetch } = useAllNodesQuery({
    variables: variables,
    fetchPolicy: "network-only",
  });

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
            let flownode = rekuestNodeToMatchingNode(event.data?.node, {
              x: 0,
              y: 0,
            });
            console.log("Trying to add", flownode, props.params);
            addContextualNode(flownode, props.params);
          }
        });
  };

  const notWorthSearch =
    data?.nodes &&
    data.nodes.length < displayLimit &&
    variables.filters?.search == undefined;

  const calculatedNodes = props.ports
    ? reactiveNodes(props.ports, props.params)
    : [];

  return (
    <ContextualContainer
      active={data?.nodes?.length != 0}
      style={{
        left: props.params.position.x,
        top: props.params.position.y,
      }}
    >
      <Tooltip>
        <TooltipTrigger>
          <div className="text-xs text-muted-foreground inline relative mx-auto mb-2  ">
            Add Target Node
          </div>
        </TooltipTrigger>
        <TooltipContent align="center">
          Add a target node to the workflow for the ports {props.ports?.length}
          {streamToReadable(props.ports)}
        </TooltipContent>
      </Tooltip>

      {notWorthSearch ? <></> : <SearchForm onSubmit={onSubmit} />}

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
        {calculatedNodes.map((sug) => (
          <Tooltip>
            <TooltipTrigger>
              <Card
                onClick={() => addContextualNode(sug.node, props.params)}
                className="px-2 py-1 border-dashed border-2 border-accent"
              >
                {sug.title}
              </Card>
            </TooltipTrigger>
            <TooltipContent align="center">{sug.description}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </ContextualContainer>
  );
};

export const SourceDropContextual = (props: {
  params: DropContextualParams;
  ports: FlussPortFragment[] | null | undefined;
}) => {
  const { addContextualNode } = useEditRiver();

  const client = useRekuest();
  const [variables, setVariables] = useState<AllNodesQueryVariables>({
    filters: {
      demands: [
        {
          kind: DemandKind.Args,
          matches:
            props.ports?.map((port, index) => ({
              at: index,
              kind: port.kind,
              identifier: port.identifier,
              children: port.children?.map((port, index) => ({
                at: index,
                kind: port.kind,
                identifier: port.identifier,
              })),
            })) || [],
          forceNonNullableLength: props.ports?.length || 0,
        },
      ],
    },
    pagination: {
      limit: displayLimit,
    },
  });

  useEffect(() => {
    refetch(variables);
  }, [variables]);

  const onSubmit = (data: any) => {
    setVariables((v) => ({
      ...v,
      filters: {
        ...v.filters,
        protocols: data.protocol ? [data.protocol] : undefined,
        search: data.search,
      },
    }));
  };

  const { data, refetch } = useAllNodesQuery({
    variables: variables,
    fetchPolicy: "network-only",
  });

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
            let flownode = rekuestNodeToMatchingNode(event.data?.node, {
              x: 0,
              y: 0,
            });
            console.log("Trying to add", flownode, props.params);
            addContextualNode(flownode, props.params);
          }
        });
  };

  const notWorthSearch =
    data?.nodes &&
    data.nodes.length < displayLimit &&
    variables.filters?.search == undefined;

  const calculatedNodes = props.ports
    ? reactiveNodes(props.ports, props.params)
    : [];

  return (
    <ContextualContainer
      active={data?.nodes?.length != 0}
      style={{
        left: props.params.position.x,
        top: props.params.position.y,
      }}
    >
      <div className="text-xs text-muted-foreground inline relative mx-auto mb-2  ">
        Add Source Node
      </div>
      {notWorthSearch ? <></> : <SearchForm onSubmit={onSubmit} />}

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
        {calculatedNodes.map((sug) => (
          <Tooltip>
            <TooltipTrigger>
              <Card
                onClick={() => addContextualNode(sug.node, props.params)}
                className="px-2 py-1 border-dashed border-2 border-accent"
              >
                {sug.title}
              </Card>
            </TooltipTrigger>
            <TooltipContent align="center">{sug.description}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </ContextualContainer>
  );
};

export const DropContextual = (props: { params: DropContextualParams }) => {
  if (!props.params.causingNode) {
    return null;
  }

  if (props.params.handleType === "target") {
    return (
      <SourceDropContextual
        params={props.params}
        ports={props.params.causingNode.data.int[props.params.causingStream]}
      />
    );
  } else {
    return (
      <TargetDropContextual
        params={props.params}
        ports={props.params.causingNode.data.outs[props.params.causingStream]}
      />
    );
  }
};
