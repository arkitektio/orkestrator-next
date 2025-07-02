import { useRekuest } from "@/lib/arkitekt/Arkitekt";
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
import { ActionDescription } from "@/lib/rekuest/ActionDescription";
import {
  FlussChildPortFragment,
  FlussPortFragment,
  GraphNodeKind,
  ReactiveImplementation,
} from "@/reaktion/api/graphql";
import { rekuestActionToMatchingNode } from "@/reaktion/plugins/rekuest";
import { nodeIdBuilder, streamToReadable } from "@/reaktion/utils";
import {
  ConstantActionDocument,
  ConstantNodeQuery,
  DemandKind,
  ActionScope,
  PortKind,
  useAllActionsQuery,
  useProtocolOptionsLazyQuery,
} from "@/rekuest/api/graphql";
import clsx from "clsx";
import { ArrowDown } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  ConnectContextualParams,
  DropContextualParams,
  ReactiveNodeSuggestions,
} from "../../types";
import { useEditRiver } from "../context";
import { ContextualContainer } from "./ContextualContainer";
import { TemplateSelector } from "./TemplateSelector";

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

function isMatch(item1: FlussPortFragment, item2: FlussPortFragment): boolean {
  return (
    item1.kind === item2.kind &&
    (item1.kind !== PortKind.Structure || item1.identifier === item2.identifier)
  );
}

function findMappings(
  list1: FlussPortFragment[],
  list2: FlussPortFragment[],
  index1 = 0,
  currentMapping: Map<number, number> = new Map(),
  allMappings: Map<number, number>[] = [],
): void {
  if (index1 === list1.length) {
    // If we've processed all items in list1, store the current mapping clone
    allMappings.push(new Map(currentMapping));
    return;
  }

  for (let index2 = 0; index2 < list2.length; index2++) {
    // If item at index2 in list2 is not already mapped and items match
    if (
      !Array.from(currentMapping.values()).includes(index2) &&
      isMatch(list1[index1], list2[index2])
    ) {
      currentMapping.set(index1, index2);
      findMappings(list1, list2, index1 + 1, currentMapping, allMappings);
      currentMapping.delete(index1); // Backtrack
    }
  }
}

function generateAllMappings(
  list1: FlussPortFragment[],
  list2: FlussPortFragment[],
): { [key: number]: number }[] {
  const allMappings: Map<number, number>[] = [];
  if (list1.length !== list2.length) return [];
  findMappings(list1, list2, 0, new Map(), allMappings);
  return allMappings.map((mapping) => Object.fromEntries(mapping.entries()));
}

//

const combineOptions = [
  {
    title: "Zip",
    description: "Zip multiple streams into one",
    implementation: ReactiveImplementation.Zip,
  },
  {
    title: "WithLatest",
    description: "Combine the latest of stream a with the latest of stream b",
    implementation: ReactiveImplementation.Withlatest,
  },
];

const bufferOptions = [
  {
    title: "Buffer Count",
    description: "Buffer the count stream",
    implementation: ReactiveImplementation.BufferCount,
    constantsMap: {
      count: 1,
    },
  },
  {
    title: "BufferComplete",
    description: "Buffer the stream until complete",
    implementation: ReactiveImplementation.BufferComplete,
    constantsMap: {},
  },
  {
    title: "BufferUntil",
    description: "Buffer the stream until a condition is met",
    implementation: ReactiveImplementation.BufferUntil,
    constantsMap: {},
  },
];

// Checks if two items are structurally equal, that means they have the same kind and identifier. (If the kind is a structure)
const isStructuralMatch = (
  item1: FlussPortFragment | FlussChildPortFragment | undefined,
  item2: FlussPortFragment | FlussChildPortFragment | undefined,
) => {
  if (!item1 || !item2) {
    return false;
  }

  return (
    item1.kind === item2.kind &&
    (item2.kind
      ? PortKind.Structure
        ? item1.identifier === item2.identifier
        : true
      : false)
  );
};

const connectReactiveNodes = (
  leftPorts: FlussPortFragment[],
  rightPorts: FlussPortFragment[],
  search: string | undefined,
): ReactiveNodeSuggestions[] => {
  const nodes: ReactiveNodeSuggestions[] = [];

  if (!leftPorts || !rightPorts) {
    return [];
  }

  if (leftPorts.length == 0 && rightPorts.length >= 1) {
    nodes.push({
      node: {
        id: nodeIdBuilder(),
        type: "ReactiveNode",
        position: { x: 0, y: 0 },
        data: {
          globalsMap: {},
          title: "Gate",
          description: "Gate the signal",
          kind: GraphNodeKind.Reactive,
          ins: [leftPorts, rightPorts],
          constantsMap: {},
          outs: [rightPorts],
          voids: [],
          constants: [],
          implementation: ReactiveImplementation.Gate,
        },
      },
      title: "Gate",
      description:
        "Gates the stream (only lets it through if the gate is open)",
    });
  }

  if (leftPorts.length == 0 && leftPorts.length < rightPorts.length) {
    let intersection = leftPorts.filter((a) =>
      rightPorts.find((b) => isStructuralMatch(a, b)),
    );

    if (intersection.length > 0) {
      combineOptions.map((option) => {
        nodes.push({
          node: {
            id: nodeIdBuilder(),
            type: "ReactiveNode",
            position: { x: 0, y: 0 },
            data: {
              globalsMap: {},
              title: option.title,
              description: option.description,
              kind: GraphNodeKind.Reactive,
              ins: [leftPorts],
              constantsMap: {},
              outs: [rightPorts],
              voids: [],
              constants: [],
              implementation: option.implementation,
            },
          },
          title: option.title,
          description: option.description,
        });
      });
    }
  }

  if (
    leftPorts.length == 1 &&
    leftPorts.at(0)?.kind == PortKind.List &&
    isStructuralMatch(leftPorts.at(0)?.children?.at(0), rightPorts.at(0))
  ) {
    // Is chunk transferable
    nodes.push({
      node: {
        id: nodeIdBuilder(),
        type: "ReactiveNode",
        position: { x: 0, y: 0 },
        data: {
          globalsMap: {},
          title: "Chunk",
          description: "Chunk the stream",
          kind: GraphNodeKind.Reactive,
          ins: [leftPorts],
          constantsMap: {},
          outs: [rightPorts],
          voids: [],
          constants: [],
          implementation: ReactiveImplementation.Chunk,
        },
      },
      title: "Chunk",
      description: "Chunk the stream",
    });
  }

  if (
    rightPorts.length == 1 &&
    rightPorts.at(0)?.kind == PortKind.List &&
    isStructuralMatch(rightPorts.at(0)?.children?.at(0), leftPorts.at(0))
  ) {
    // Is chunk transferable
    bufferOptions.map((option) => {
      nodes.push({
        node: {
          id: nodeIdBuilder(),
          type: "ReactiveNode",
          position: { x: 0, y: 0 },
          data: {
            globalsMap: {},
            title: option.title,
            description: option.description,
            kind: GraphNodeKind.Reactive,
            ins: [leftPorts],
            constantsMap: option.constantsMap,
            outs: [rightPorts],
            voids: [],
            constants: [],
            implementation: option.implementation,
          },
        },
        title: option.title,
        description: option.description,
      });
    });
  }

  if (
    allandone(leftPorts, rightPorts, (port) => port.kind === PortKind.Float)
  ) {
    nodes.push({
      node: {
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
          voids: [],
          constants: [],
          implementation: ReactiveImplementation.ToList,
        },
        title: "Round",
        description: "Round an Float to an Int",
      },
    });
  }

  if (rightPorts.length == 0) {
    nodes.push({
      node: {
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
          voids: [],
          constants: [],
          implementation: ReactiveImplementation.Omit,
        },
      },
      title: "Omit",
      description: "Discard the stream an just send an event",
    });
  }

  if (leftPorts.length > rightPorts.length && rightPorts.length == 1) {
    for (let i in leftPorts) {
      nodes.push({
        node: {
          id: nodeIdBuilder(),
          type: "ReactiveNode",
          position: { x: 0, y: 0 },
          data: {
            globalsMap: {},
            title: "Select " + leftPorts[i].key,
            description: "Select an item of the stream",
            kind: GraphNodeKind.Reactive,
            ins: [leftPorts],
            constantsMap: {},
            outs: [[leftPorts[i]]],
            voids: [],
            constants: [],
            implementation: ReactiveImplementation.Select,
          },
        },
        title: "Select " + leftPorts[i].key,
        description: "Select an item of the stream",
      });
    }
  }

  for (let mapping of generateAllMappings(leftPorts, rightPorts)) {
    nodes.push({
      node: {
        id: nodeIdBuilder(),
        type: "ReactiveNode",
        position: { x: 0, y: 0 },
        data: {
          globalsMap: {},
          title: "Reorder",
          description: "Reorder the stream",
          kind: GraphNodeKind.Reactive,
          ins: [leftPorts],
          constantsMap: {},
          outs: [rightPorts],
          voids: [],
          constants: [],
          implementation: ReactiveImplementation.Reorder,
        },
      },
      title: "Reorder",
      description: "Reorder the stream",
    });
  }

  return nodes.filter((node) =>
    node.title.toLowerCase().includes(search?.toLowerCase() || ""),
  );
};

export const useConnectReactiveNodes = (leftPorts, rightPorts, search) => {
  return useMemo(
    () => connectReactiveNodes(leftPorts, rightPorts, search),
    [leftPorts, rightPorts, search],
  );
};

const ConnectReactiveNodes = (props: {
  search: string | undefined;
  params: ConnectContextualParams;
  leftPorts: FlussPortFragment[];
  rightPorts: FlussPortFragment[];
}) => {
  const nodes = useConnectReactiveNodes(
    props.leftPorts,
    props.rightPorts,
    props.search || "",
  );

  const { addConnectContextualNode } = useEditRiver();

  return (
    <div className="flex flex-row gap-1 my-auto flex-wrap mt-2">
      {nodes.map((sug) => (
        <Tooltip>
          <TooltipTrigger>
            <Card
              onClick={() => addConnectContextualNode(sug.node, props.params)}
              className="px-2 py-1 border-solid border-2 border-accent"
            >
              {sug.title}
            </Card>
          </TooltipTrigger>
          <TooltipContent align="center">{sug.description}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

const buildVariabels = (leftPorts, rightPorts, search) => ({
  filters: {
    search: search,
    demands: [
      {
        kind: DemandKind.Args,
        matches:
          leftPorts.map((port, index) => ({
            at: index,
            kind: port.kind,
            identifier: port.identifier,
            children: port.children?.map((port, index) => ({
              at: index,
              kind: port.kind,
              identifier: port.identifier,
            })),
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
            children: port.children?.map((port, index) => ({
              at: index,
              kind: port.kind,
              identifier: port.identifier,
            })),
          })) || [],
        forceNonNullableLength: rightPorts.length || 0,
      },
    ],
  },
  pagination: {
    limit: 2,
  },
});

const ConnectArkitektNodes = (props: {
  search: string | undefined;
  params: ConnectContextualParams;
  leftPorts: FlussPortFragment[];
  rightPorts: FlussPortFragment[];
}) => {
  const { data, refetch, variables } = useAllActionsQuery({
    variables: buildVariabels(props.leftPorts, props.rightPorts, props.search),
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    refetch(buildVariabels(props.leftPorts, props.rightPorts, props.search));
  }, [props.leftPorts, props.rightPorts, props.search]);

  const { addConnectContextualNode } = useEditRiver();

  const client = useRekuest();

  const onNodeClick = (id: string) => {
    client &&
      client
        .query<ConstantNodeQuery>({
          query: ConstantActionDocument,
          variables: { id: id },
        })
        .then(async (event) => {
          console.log(event);
          if (event.data?.node) {
            let flownode = rekuestActionToMatchingNode(event.data?.node, {
              x: 0,
              y: 0,
            });
            console.log("Trying to add", flownode, props.params);
            addConnectContextualNode(flownode, props.params);
          }
        });
  };

  const onTemplateClick = (node: string, template: string) => {
    client &&
      client
        .query<ConstantNodeQuery>({
          query: ConstantActionDocument,
          variables: { id: node },
        })
        .then(async (event) => {
          console.log(event);
          if (event.data?.node) {
            let flownode = rekuestActionToMatchingNode(event.data?.node, {
              x: 0,
              y: 0,
            });
            flownode.data.binds = { templates: [template] };
            console.log("Trying to add", flownode, props.params);
            addConnectContextualNode(flownode, props.params);
          }
        });
  };

  return (
    <div className="flex flex-row gap-1 my-auto flex-wrap mt-2">
      {data?.actions.map((action) => (
        <Tooltip>
          <TooltipTrigger>
            {action.stateful ? (
              <Popover>
                <PopoverTrigger>
                  <Card className="px-2 py-1 border-solid border-2 border-green-300 border ">
                    {action.name}
                  </Card>
                </PopoverTrigger>
                <PopoverContent className="rounded rounded-lg">
                  <div className="text-xs text-muted-foreground mb-2  mt">
                    This is a stateful node and needs to be bound to a specific
                    instance
                  </div>
                  <TemplateSelector
                    hash={action.hash}
                    node={action.id}
                    onClick={onTemplateClick}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <Card
                onClick={() => onNodeClick(action.id)}
                className={clsx(
                  "px-2 py-1 border",
                  action.scope == ActionScope.Global
                    ? ""
                    : "dark:border-blue-200",
                )}
              >
                {action.name}
              </Card>
            )}
          </TooltipTrigger>
          <TooltipContent align="center">
            {action.description && (
              <ActionDescription description={action.description} />
            )}
            {action.scope == ActionScope.Global ? (
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
  );
};

export const ConnectContextual = (props: {
  params: ConnectContextualParams;
}) => {
  const [search, setSearch] = React.useState<string | undefined>(undefined);

  const leftPorts = props.params.leftNode.data.outs[props.params.leftStream];
  const rightPorts = props.params.rightNode.data.ins[props.params.rightStream];

  const onSubmit = (data: any) => {
    setSearch(data.search);
  };

  return (
    <ContextualContainer
      style={{
        left: props.params.position.x,
        top: props.params.position.y,
      }}
      active={true}
    >
      <div className="text-xs text-muted-foreground inline relative mx-auto mb-2  ">
        {streamToReadable(leftPorts)} <b>to</b> {streamToReadable(rightPorts)}
      </div>

      <SearchForm onSubmit={onSubmit} />

      <Separator />
      <div className="flex flex-row gap-1 my-auto flex-wrap mt-2"></div>
      <ConnectArkitektNodes
        leftPorts={leftPorts}
        rightPorts={rightPorts}
        search={search}
        params={props.params}
      />
      <div className="flex flex-row gap-1 my-auto flex-wrap mt-2">
        <ConnectReactiveNodes
          leftPorts={leftPorts}
          rightPorts={rightPorts}
          search={search}
          params={props.params}
        />
      </div>
    </ContextualContainer>
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
