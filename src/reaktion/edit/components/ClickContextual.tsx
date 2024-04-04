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
  ConstantNodeDocument,
  ConstantNodeQuery,
  useAllNodesQuery,
  useProtocolOptionsLazyQuery,
} from "@/rekuest/api/graphql";
import { useRekuest, withRekuest } from "@jhnnsrs/rekuest-next";
import { ArrowDown } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ClickContextualParams } from "../../types";
import { useEditRiver } from "../context";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NodeDescription } from "@jhnnsrs/rekuest";

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

export const ClickContextual = (props: { params: ClickContextualParams }) => {
  const { addClickNode } = useEditRiver();

  const { client } = useRekuest();

  const onSubmit = (data: any) => {
    refetch({
      ...variables,
      filters: {
        ...variables.filters,
        protocols: data?.protocol && [data.protocol],
        search: data.search,
      },
    });
  };

  const variables = {
    filters: {},
    pagination: {
      limit: 6,
    },
  };

  const { data, refetch } = withRekuest(useAllNodesQuery)({
    variables: variables,
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
    <Card
      className="absolute translate-x-[-50%] z-50 p-2 max-w-[200px] text-xs bg-sidebar flex flex-col opacity-50 data-[found=true]:opacity-100 shadow-xl shadow-xl dark:shadow-xl dark:shadow-xl"
      style={{
        left: props.params.position.x,
        top: props.params.position.y,
      }}
      data-found={data?.nodes?.length != 0}
    >
      <div className="text-xs text-muted-foreground inline relative mx-auto mb-2  mt">
        All Nodes
      </div>
      <SearchForm onSubmit={onSubmit} />

      <Separator />
      {data?.nodes?.length == 0 && (
        <div className="my-auto mt-2 mx-auto">No matching nodes found</div>
      )}
      <div className="flex flex-row gap-1 my-auto flex-wrap mt-2">
        {data?.nodes.map((node) => (
          <Tooltip>
            <TooltipTrigger>
              <Card onClick={() => onNodeClick(node.id)} className="px-2 py-1">
                {node.name}
              </Card>
            </TooltipTrigger>
            <TooltipContent align="center">
              {node.description && (
                <NodeDescription description={node.description} />
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </Card>
  );
};
