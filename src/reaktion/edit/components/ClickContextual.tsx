import { GraphQLSearchField } from "@/components/fields/GraphQLSearchField";
import { Button } from "@/components/ui/button";
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
import { arkitektNodeToMatchingFlowNode } from "@/reaktion/plugins/rekuest";
import {
  AllNodesQueryVariables,
  ConstantNodeDocument,
  ConstantNodeQuery,
  NodeScope,
  PortKind,
  PortScope,
  useAllNodesQuery,
  useProtocolOptionsLazyQuery,
} from "@/rekuest/api/graphql";
import { useRekuest, withRekuest } from "@jhnnsrs/rekuest-next";
import { ArrowDown } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { ClickContextualParams, FlowNode } from "../../types";
import { useEditRiver } from "../context";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NodeDescription } from "@jhnnsrs/rekuest";
import clsx from "clsx";
import {
  FlussPortFragment,
  GraphNodeKind,
  ReactiveImplementation,
} from "@/reaktion/api/graphql";
import { useState } from "react";
import { nodeIdBuilder } from "@/reaktion/utils";

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
        <div className="w-full mb-1">
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

const clickReactiveNodes = (search: string): ReactiveNodeSuggestions[] => {
  const nodes: ReactiveNodeSuggestions[] = [];

  // TODO - Add more nodes here

  const filtered_nodes = nodes.filter((node) =>
    node.data.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (search.length === 0) {
    return filtered_nodes;
  }

  let isInt = !isNaN(parseInt(search));

  if (isInt) {
    filtered_nodes.push({
      node: {
        id: nodeIdBuilder(),
        type: "ReactiveNode",
        position: { x: 0, y: 0 },
        data: {
          globalsMap: {},
          title: "Just",
          description: "Just an Int",
          kind: GraphNodeKind.Reactive,
          ins: [[]],
          constantsMap: {
            value: parseInt(search),
          },
          outs: [
            [
              {
                scope: PortScope.Global,
                description: "Just an Int",
                key: "the_int",
                kind: PortKind.Int,
              },
            ],
          ],
          constants: [],
          implementation: ReactiveImplementation.Just,
        },
      },
      title: `Just ${search} (Int)`,
      description: "Just an Int",
    });
  }

  filtered_nodes.push({
    node: {
      id: nodeIdBuilder(),
      type: "ReactiveNode",
      position: { x: 0, y: 0 },
      data: {
        globalsMap: {},
        title: "Just",
        description: "Just a String",
        kind: GraphNodeKind.Reactive,
        ins: [[]],
        constantsMap: {
          value: search,
        },
        outs: [
          [
            {
              scope: PortScope.Global,
              description: "Just a String",
              key: "string",
              kind: PortKind.String,
            },
          ],
        ],
        constants: [],
        implementation: ReactiveImplementation.Just,
      },
    },
    title: `Just ${search} (String)`,
    description: "Create the string Hallo on Invocation",
  });

  return filtered_nodes;
};

export const useClickReactiveNodes = (search: string) => {
  return useMemo(() => clickReactiveNodes(search), [search]);
};

const ClickReactiveNodes = (props: {
  search: string | undefined;
  params: ClickContextualParams;
}) => {
  const nodes = useClickReactiveNodes(props.search || "");

  const { addClickNode } = useEditRiver();

  return (
    <div className="flex flex-row gap-1 my-auto flex-wrap mt-2">
      {nodes.map((sug) => (
        <Tooltip>
          <TooltipTrigger>
            <Card
              onClick={() => addClickNode(sug.node, props.params)}
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

const ClickArkitektNodes = (props: {
  search: string | undefined;
  params: ClickContextualParams;
}) => {
  const { data, refetch } = withRekuest(useAllNodesQuery)({
    variables: {
      filters: {
        search: props.search,
        protocols: [],
      },
      pagination: {
        limit: displayLimit,
      },
    },
  });

  useEffect(() => {
    refetch({
      pagination: {
        limit: displayLimit,
      },
      filters: {
        search: props.search,
      },
    });
  }, [props.search]);

  const { addClickNode } = useEditRiver();
  const { client } = useRekuest();

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
            addClickNode(flownode, props.params);
          }
        });
  };

  return (
    <div className="flex flex-row gap-1 my-auto flex-wrap mt-2">
      {data?.nodes.map((node) => (
        <Tooltip>
          <TooltipTrigger>
            <Card
              onClick={() => onNodeClick(node.id)}
              className="px-2 py-1 border-solid border-2 border-accent"
            >
              {node.name}
            </Card>
          </TooltipTrigger>
          <TooltipContent align="center">{node.description}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

const displayLimit = 5;

export const ClickContextual = (props: { params: ClickContextualParams }) => {
  const [search, setSearch] = useState(undefined);

  const onSubmit = (data: any) => {
    setSearch(data.search);
  };

  return (
    <Card
      className="absolute translate-x-[-50%] z-50 p-2 max-w-[200px] text-xs bg-sidebar flex flex-col opacity-100 shadow-xl shadow-xl dark:shadow-xl dark:shadow-xl"
      style={{
        left: props.params.position.x,
        top: props.params.position.y,
      }}
    >
      <div className="text-xs text-muted-foreground inline relative mx-auto mb-2  ">
        All Nodes
      </div>
      <SearchForm onSubmit={onSubmit} />

      <Separator />
      <div className="flex flex-row gap-1 my-auto flex-wrap  mb-1">
        <ClickArkitektNodes search={search} params={props.params} />
      </div>
      <Separator />
      <div className="flex flex-row gap-1 my-auto flex-wrap ">
        <ClickReactiveNodes search={search} params={props.params} />
      </div>
    </Card>
  );
};
