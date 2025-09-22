import { SearchOptions } from "@/components/fields/SearchField";
import { SearchAssignWidgetFragment } from "@/rekuest/api/graphql";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";
import { CheckIcon } from "@radix-ui/react-icons";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { cn, notEmpty } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export type Option = {
  label: string;
  value: string;
};

export const ListButtonLabel = (props: {
  search: SearchFunction;
  value: { __value: string }[] | undefined;
  setValue: (vars: { __value: string }[]) => void;
  placeholder?: string;
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (props.value == undefined) {
      setOptions([]);
      return;
    }
    if (props.value.length == 0) {
      setOptions([]);
      return;
    }
    props
      .search({ values: props.value.map(x => x.__value) })
      .then((res) => {
        setOptions(res.filter(notEmpty));
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [props.value, props.search]);

  const remove = (value: string) => {
    props.setValue(props.value?.filter((v) => v.__value !== value) || []);
  };

  return (
    <div className="gap-2 flex flex-row p-1">
      {options.map((l, index) => (
        <Badge
          key={index}
          onClick={() => remove(l.value)}
          className="cursor-pointer px-1 py-1 bg-slate-300 my-2"
        >
          {l.label}
        </Badge>
      ))}
      {error}
    </div>
  );
};

export type SearchOptions = { search?: string; values?: string[] };

export type SearchFunction = (
  searching: SearchOptions,
) => Promise<(Option | null | undefined)[]>;


export const ListSearchWidget = (
  props: InputWidgetProps<SearchAssignWidgetFragment>,
) => {
  const { registry } = useWidgetRegistry();
  const [options, setOptions] = useState<(Option | null | undefined)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  let wardKey = props.widget?.ward;
  let query = props?.widget?.query || "";

  if (!wardKey) {
    return <>No ward set</>;
  }

  const theward = useMemo(
    () => registry.getWard(wardKey),
    [registry, wardKey],
  );

  const name = pathToName(props.path)

  const search = useCallback(
    async (searching: SearchOptions) => {
      if (!theward.search) throw new Error("Ward does not support search");
      let options = await theward.search({
        query: query,
        variables: searching,
      });
      return options;
    },
    [theward, query],
  );

  const form = useFormContext();


  const onValueChange = (string: string) => {
    search({ search: string })
      .then((res) => {
        setOptions(res || []);
        setOpen(true);
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            form.setValue(name, { __value: undefined }, {
              shouldValidate: true,
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [],
  );

  return (
    <FormField<{ [name: string]: { __value: string }[] }>
      control={form.control}
      name={name}
      render={({ field }) => (
        <>
          <FormItem className={cn("flex flex-col dark:text-white")}>
            <FormLabel>{props.port.label || props.port.key}</FormLabel>
            <Command
              shouldFilter={false}
              className="overflow-visible bg-transparent"
            >
              <div className="group rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="w-full relative flex flex-row flex-wrap w-full">
                  {field.value && (
                    <ListButtonLabel
                      search={search}
                      value={field.value}
                      setValue={(value) => {
                        form.setValue(name, value, { shouldValidate: true });
                        setInputValue("");
                        inputRef.current?.focus();
                        setOpen(true);
                      }}
                    />
                  )}
                  <CommandInput
                    onKeyDown={handleKeyDown}
                    placeholder={"Search..."}
                    onValueChange={(e) => {
                      setInputValue(e);
                      onValueChange(e);
                    }}
                    value={inputValue}
                    onBlur={() => setOpen(false)}
                    onFocus={() => {
                      setOpen(true);
                    }}
                    className="flex-grow"
                  />
                </div>
              </div>
              <div className="relative mt-2">
                {open && (
                  <CommandList slot="list" className="w-full">
                    <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                      <CommandEmpty>No Options found</CommandEmpty>
                      {error && (
                        <CommandGroup heading="Error">
                          {error && <CommandItem>{error}</CommandItem>}
                        </CommandGroup>
                      )}
                      {options.length > 0 && (
                        <CommandGroup heading="Options">
                          {options?.filter(notEmpty).map((option, index) => (
                            <CommandItem
                              value={option.value}
                              key={index}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onSelect={() => {
                                if (
                                  field.value &&
                                  Array.isArray(field.value) &&
                                  field.value.find(
                                    (val) => val.__value === option.value,
                                  )
                                ) {
                                  form.setValue(
                                    name,
                                    field.value.filter(
                                      (val) => val.__value !== option.value,
                                    ),
                                    {
                                      shouldValidate: true,
                                    },
                                  );
                                  setInputValue("");
                                } else {
                                  form.setValue(
                                    name,
                                    [
                                      ...(field.value &&
                                        Array.isArray(field.value)
                                        ? field.value
                                        : []),
                                      { __value: option.value },
                                    ],
                                    {
                                      shouldValidate: false,
                                    },
                                  );
                                  setInputValue("");
                                }
                              }}
                            >
                              {option.label}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  field.value &&
                                    Array.isArray(field.value) &&
                                    field.value.find(
                                      (val) => val.__value === option.value,
                                    )
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </div>
                  </CommandList>
                )}
              </div>
            </Command>
            <FormDescription>{props.port.description}</FormDescription>
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
};

