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
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Registration, useModels } from "@/providers/smart/registry";
import { GraphNodeKind, ReactiveImplementation } from "@/reaktion/api/graphql";
import { nodeIdBuilder } from "@/reaktion/utils";
import {
  PortKind,
  PortScope,
  useProtocolOptionsLazyQuery
} from "@/rekuest/api/graphql";
import { Tooltip } from "@radix-ui/react-tooltip";
import { ArrowDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

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
                No no
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </form>
    </Form>
  );
};


const ClickReactiveNodes = (props: {
  search: string | undefined;
  setRegistation: (registration: Registration) => void;
}) => {

  const models = useModels(props.search);

  return (
    <div className="flex flex-row gap-1 my-auto flex-wrap mt-2">
      {models.length == 0 && <div>No results</div>}
      {models.map((node) => (
        <Tooltip>
          <TooltipTrigger>
            <>
              {node.description ? (
                <Popover>
                  <PopoverTrigger>
                    <Card className="px-2 py-1 border-solid border-2 border-green-300 border " onClick={() => props.setRegistation(node)}>
                      {node.identifier}
                    </Card>
                  </PopoverTrigger>
                  <PopoverContent className="rounded rounded-lg">
                    <div className="text-xs text-muted-foreground mb-2  mt">
                      This is a stateful node and needs to be bound to a
                      specific instance
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Card
                  className="px-2 py-1 border-solid border-2 border-accent"
                  onClick={() => props.setRegistation(node)}
                >
                  {node.identifier}
                </Card>
              )}
            </>
          </TooltipTrigger>
          <TooltipContent align="center">{node.description}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};


export const ClickContextual = (props: {  }) => {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [localSearch, setLocalSearch] = useState<string | undefined>(undefined);
  const [registration, setRegistration] = useState<Registration | undefined>(undefined);

  const onSubmit = (data: any) => {
    setSearch(data.search);
  };

  const onLocalSubmit = (data: any) => {
    setLocalSearch(data.search);
  }

  return (
    <>
    {!registration ? 
    <div className="flex flex-col gap-2">
      <SearchForm onSubmit={onSubmit} />
      <Separator />
      <ClickReactiveNodes search={search} setRegistation={(reg) => setRegistration(reg)} />
    </div> : <div>
      <Button onClick={() => setRegistration(undefined)}>Back</Button>
      <SearchForm onSubmit={onLocalSubmit} />
      <Separator />
      <div>{registration.identifier}</div>
      
      
      
      </div>}
    </>
  );
};
