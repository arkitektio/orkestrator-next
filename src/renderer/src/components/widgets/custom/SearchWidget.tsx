import { SearchOptions } from "@/components/fields/SearchField";
import { Badge } from "@/components/ui/badge";
import { SearchAssignWidgetFragment } from "@/rekuest/api/graphql";
import useWidgetDependencies from "@/rekuest/hooks/useWidgetDependencies";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";

import { CheckIcon } from "@radix-ui/react-icons";

import { FieldProps } from "@/components/fields/types";
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
  FormMessage,
} from "@/components/ui/form";
import { cn, notEmpty } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";


export type Option = {
  label: string;
  value: string;
};

export const ButtonLabel = (props: {
  search: SearchFunction;
  value: { object: string; __identifier: string };
}) => {
  const [option, setOption] = useState<Option | null | undefined>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    props
      .search({ values: [props.value.object] })
      .then((res) => {
        if (res.length === 0) {
          setOption(null);
          setError("No option found for value");
        }
        setOption(res[0] || null);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [props.value, props.search]);

  return (
    <div className="flex flex-row items-center">
      {option?.label && <div className="text-slate-200">{option.label}</div>}
      {error}
    </div>
  );
};

export type SearchOptions = { search?: string; values?: (string | number)[] };

export type SearchFunction = (
  searching: SearchOptions,
) => Promise<(Option | null | undefined)[]>;

export type SearchFieldProps = {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  commandPlaceholder?: string;
  createComponent?: React.ReactNode;
  noOptionFoundPlaceholder?: string;
  search: SearchFunction;
} & FieldProps;







export const SearchWidget = (
  props: InputWidgetProps<SearchAssignWidgetFragment>,
) => {
  console.log("SearchWidget", props);
  const { registry } = useWidgetRegistry();

  const thequery = props?.widget?.query || "";
  const wardKey = props.widget?.ward;

  if (!wardKey) {
    return <>No ward set</>;
  }

  const theward = useMemo(
    () => registry.getWard(wardKey),
    [registry, wardKey],
  );

  const { values, met } = useWidgetDependencies({
    widget: props.widget,
    path: props.path,
  });

  const search = useCallback(
    async (searching: SearchOptions) => {
      console.log("searching", searching, theward, wardKey, thequery);
      if (!theward.search) throw new Error("Ward does not support search");
      if (!met) throw new Error("Dependencies not met");

      const options = await theward.search({
        query: thequery,
        variables: { ...searching, ...values },
      });

      console.log(options);
      return options;
    },
    [theward, thequery, values],
  );

  const form = useFormContext();

  const [options, setOptions] = useState<(Option | null | undefined)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            form.setValue(pathToName(props.path), undefined, {
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

  if (!met) {
    return <div className="w-full my-2">Waiting for {props.widget?.dependencies?.map(d => <Badge>{d}</Badge>)}</div>;
  }

  return (
    <FormField
      control={form.control}
      name={pathToName(props.path)}
      render={({ field }) => (
        <>
          <FormItem className="flex flex-col dark:text-white">
            {props.port.label != undefined && <FormLabel>{props.port.label}</FormLabel>}
            <Command
              shouldFilter={false}
              className="overflow-visible bg-transparent"
            >
              <div className="group r2">
                <div className="w-full relative h-10">
                  <CommandInput
                    onKeyDown={handleKeyDown}
                    placeholder={"Search..."}
                    onValueChange={(e) => {
                      setInputValue(e);
                      query(e);
                    }}
                    value={inputValue}
                    onBlur={() => setOpen(false)}
                    onFocus={() => setOpen(true)}
                  />
                  {field.value != undefined && field.value != null && (
                    <div
                      className={cn(
                        "z-8 absolute w-full h-full cursor-pointer flex flex-row items-center bg-slate-800 top-0 left-0 rounded-md px-2 flex h-10 w-full rounded-md  py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 truncate",
                      )}
                      onClick={() => {
                        setInputValue("");
                        form.setValue(pathToName(props.path), undefined, {
                          shouldValidate: false,
                        });
                        setOpen(true);
                        field.onChange(undefined);
                        inputRef.current?.focus();
                      }}
                    >
                      <ButtonLabel search={search} value={field.value} />
                    </div>
                  )}
                </div>
              </div>
              <div className="relative mt-2">
                {open && (
                  <CommandList slot="list" className="w-full t-10">
                    <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in ">
                      <CommandEmpty>No options found.</CommandEmpty>
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
                                if (field.value !== option.value) {
                                  form.setValue(pathToName(props.path), { object: option.value, __identifier: props.port.identifier }, {
                                    shouldValidate: true,
                                  });
                                  setInputValue("");
                                } else {
                                  form.setValue(pathToName(props.path), null, {
                                    shouldValidate: false,
                                  });
                                  setInputValue("");
                                }
                                setOpen(false);
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
                    </div>
                  </CommandList>
                )}
              </div>
            </Command>
            {props.port.description && <FormDescription className="max-h-32 overflow-y-scroll">{props.port.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
};
