import { useCallback } from "react";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { FieldProps } from "@/components/fields/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ListEntityFragment,
  ListGraphFragment,
  useCreateEntityMutation,
  useListGraphsLazyQuery,
  useMyActiveGraphQuery,
  useSearchExpressionLazyQuery,
  useSearchLinkedRelationsLazyQuery,
} from "@/kraph/api/graphql";
import { cn, notEmpty } from "@/lib/utils";
import { Tooltip } from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export type Option = {
  label: string;
  value: string;
};

export const ButtonLabel = (props: {
  search: SearchFunction;
  value: string;
}) => {
  const [option, setOption] = useState<ListEntityFragment | null | undefined>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    props
      .search({ values: [props.value] })
      .then((res) => {
        setOption(res[0]);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [props.value, props.search]);

  return (
    <>
      {option?.label}
      {error}
    </>
  );
};

export type SearchOptions = { search?: string; values?: (string | number)[] };

export type SearchFunction = (
  searching: SearchOptions,
) => Promise<(ListEntityFragment | null | undefined)[]>;

export type EntitySearchFieldProps = {
  name: string;
  graph?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  commandPlaceholder?: string;
  noOptionFoundPlaceholder?: string;
} & FieldProps;

export const GraphPanel = (props: {
  onGraphSelected: (id: ListGraphFragment) => void;
}) => {
  const [graphSearch] = useListGraphsLazyQuery();

  const search = useCallback(
    async (x: {
      search?: string | undefined;
      values?: (string | number)[] | undefined;
    }) => {
      const queryResult = await graphSearch({
        variables: {
          filters: {
            search: x.search,
            ids: x.values?.map((x) => x.toString()),
          },
        },
      });
      if (queryResult?.error) {
        throw new Error(queryResult.error[0].message);
      }
      if (!queryResult.data) {
        throw new Error("No data");
      }
      return queryResult.data?.graphs;
    },
    [graphSearch],
  );

  const [options, setOptions] = useState<
    (ListGraphFragment | null | undefined)[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const query = (string: string) => {
    search({ search: string })
      .then((res) => {
        setOptions(res || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setOptions([]);
      });
  };

  useEffect(() => {
    search({})
      .then((res) => {
        setOptions(res || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Error");
        setOptions([]);
      });
  }, [search]);

  return (
    <div>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder={"Search Graphs"}
          className="h-9"
          onValueChange={(e) => {
            query(e);
          }}
        />
        <CommandList>
          <CommandEmpty>{"No Graphs Found"}</CommandEmpty>
          {error && (
            <CommandGroup heading="Error">
              {error && <CommandItem>{error}</CommandItem>}
            </CommandGroup>
          )}
          <CommandGroup>
            {options.filter(notEmpty).map((option) => (
              <CommandItem
                value={option.id}
                key={option.id}
                onSelect={() => {
                  console.log(option.id);
                  props.onGraphSelected(option);
                }}
              >
                {option.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export const LinkExpressionPanel = (props: {
  onExpressionSelected: (id: string) => void;
}) => {
  const [graphSearch] = useSearchExpressionLazyQuery();

  const search = useCallback(
    async (x: {
      search?: string | undefined;
      values?: (string | number)[] | undefined;
    }) => {
      const queryResult = await graphSearch({
        variables: {
          search: x.search,
        },
      });
      if (queryResult?.error) {
        throw new Error(queryResult.error[0].message);
      }
      if (!queryResult.data) {
        throw new Error("No data");
      }
      return queryResult.data?.options;
    },
    [graphSearch],
  );

  const [options, setOptions] = useState<(Option | null | undefined)[]>([]);
  const [error, setError] = useState<string | null>(null);

  const query = (string: string) => {
    search({ search: string })
      .then((res) => {
        setOptions(res || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setOptions([]);
      });
  };

  useEffect(() => {
    search({})
      .then((res) => {
        setOptions(res || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Error");
        setOptions([]);
      });
  }, [search]);

  return (
    <div>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder={"Search Graphs"}
          className="h-9"
          onValueChange={(e) => {
            query(e);
          }}
        />
        <CommandList>
          <CommandEmpty>{"No Graphs Found"}</CommandEmpty>
          {error && (
            <CommandGroup heading="Error">
              {error && <CommandItem>{error}</CommandItem>}
            </CommandGroup>
          )}
          <CommandGroup>
            {options.filter(notEmpty).map((option) => (
              <CommandItem
                value={option.value}
                key={option.value}
                onSelect={() => {
                  console.log(option.value);
                  props.onExpressionSelected(option.value);
                }}
              >
                {option.value}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export const EntityRelationSearchField = ({
  name,
  label,
  graph,
  validate,
  placeholder = "Please Select",
  commandPlaceholder = "Search...",
  noOptionFoundPlaceholder = "No options found",
  description,
}: EntitySearchFieldProps) => {
  const { data, error: myerror } = useMyActiveGraphQuery();

  const mygraph = graph || data?.myActiveGraph;

  const form = useFormContext();

  const [options, setOptions] = useState<(Option | null | undefined)[]>([]);
  const [generalPopoverOpen, setGeneralPopoverOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [createNewEntity] = useCreateEntityMutation();

  const [selectedGraph, setSelectedGraph] = useState<ListGraphFragment | null>(
    null,
  );
  const [graphPopoverOpen, setGraphPopoverOpen] = useState(false);

  const [entitySearch] = useSearchLinkedRelationsLazyQuery();

  const search = useCallback(
    async (x: {
      search?: string | undefined;
      values?: (string | number)[] | undefined;
    }) => {
      const graphId = graph || selectedGraph?.id || mygraph?.id;

      if (!graphId) {
        throw new Error("No graph selected");
      }
      const queryResult = await entitySearch({
        variables: {
          search: x.search,
          values: x.values?.map((x) => x.toString()),
          graph: graphId,
        },
      });
      if (queryResult?.error) {
        throw new Error(queryResult.error[0].message);
      }
      if (!queryResult.data) {
        throw new Error("No data");
      }
      return queryResult.data?.options;
    },
    [entitySearch, selectedGraph, mygraph],
  );

  const query = (string: string) => {
    search({ search: string })
      .then((res) => {
        setOptions(res || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setOptions([]);
      });
  };

  useEffect(() => {
    search({})
      .then((res) => {
        setOptions(res || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Error");
        setOptions([]);
      });
  }, [name, search]);

  return (
    <FormField
      control={form.control}
      name={name}
      rules={{ validate: validate }}
      render={({ field }) => (
        <>
          <FormItem className="flex flex-col dark:text-white">
            {label != undefined && <FormLabel>{label}</FormLabel>}

            {(selectedGraph || mygraph) && !graph && (
              <Popover
                open={graphPopoverOpen}
                onOpenChange={setGraphPopoverOpen}
              >
                <PopoverTrigger className="align-left">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge color="red" className="mb-2">
                        {(selectedGraph || mygraph)?.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The item will be put into this graph</p>
                    </TooltipContent>
                  </Tooltip>
                </PopoverTrigger>
                <PopoverContent className="w-[80%] p-3">
                  <GraphPanel
                    onGraphSelected={(id) => {
                      setSelectedGraph(id);
                      setGraphPopoverOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
            {myerror && <div>{myerror?.message}</div>}

            <Popover
              open={generalPopoverOpen}
              onOpenChange={setGeneralPopoverOpen}
            >
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between overflow-hidden truncate ellipsis",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      <ButtonLabel search={search} value={field.value} />
                    ) : (
                      <> {error ? error : placeholder}</>
                    )}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[80%] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder={commandPlaceholder}
                    className="h-9"
                    onValueChange={(e) => {
                      query(e);
                    }}
                  />
                  <CommandList>
                    <CommandEmpty></CommandEmpty>
                    {error && (
                      <CommandGroup heading="Error">
                        {error && <CommandItem>{error}</CommandItem>}
                      </CommandGroup>
                    )}
                    {options.length > 0 && (
                      <CommandGroup heading="Entities">
                        {options.filter(notEmpty).map((option) => (
                          <CommandItem
                            value={option.value}
                            key={option.value}
                            onSelect={() => {
                              console.log(option.value);
                              form.setValue(name, option.value, {
                                shouldValidate: true,
                              });
                              setGeneralPopoverOpen(false);
                            }}
                          >
                            {option.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                option.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
};
