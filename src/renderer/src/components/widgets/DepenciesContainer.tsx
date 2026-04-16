import { ListDependencyFragment, MappedAgentInput, ResolvedDependencyInput, useAgentOptionsLazyQuery } from "@/rekuest/api/graphql";
import { ArgPort, PortGroup } from "@/rekuest/widgets/types";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn, notEmpty } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Control, useFormContext } from "react-hook-form";
import { Badge } from "../ui/badge";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { ListButtonLabel } from "./custom/ListSearchWidget";

export type FilledGroup = PortGroup & {
  filledPorts: ArgPort[];
};

export const portHash = (port: ArgPort[]) => {
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


export type Option = {
  label: string;
  value: string;
};

export const DependencyButtonLabel = (props: {
  value: string[] | undefined;
  setValue: (value: string[]) => void;
  placeholder?: string;
}) => {

  const [search ] = useAgentOptionsLazyQuery()

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
    search({ variables: { values: props.value } })
      .then((res) => {
        setOptions(res.data?.options.filter(notEmpty));
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [props.value, search]);

  const remove = (value: string) => {
    props.setValue(props.value?.filter((v) => v !== value) || []);
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

export type DependencyFieldProps = {
  dependency: ListDependencyFragment
}

export const DependencySearchField = ({
  dependency
}: DependencyFieldProps) => {
  const form = useFormContext();

  const name = `dependencies.${dependency.key}`;
  const [options, setOptions] = useState<(Option | null | undefined)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");


  const [search ] = useAgentOptionsLazyQuery()


  const query = (string: string) => {
    search({variables: { search: string , dependency: dependency.id }})
      .then((res) => {
        setOptions(res.data?.options || []);
        setOpen(true);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setOptions([]);
      });
  };

  useEffect(() => {
    search({variables: { search: "", dependency: dependency.id }})
      .then((res) => {
        setOptions(res.data?.options || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Error");
        setOptions([]);
      });
  }, [dependency.id, search]);




  const valuesToDependencies = (values: string[]) => {
    return {
      key: dependency.key,
      mappedAgents: [values.map(v => (  {
        agent: v,
        mappedA: null
      } as MappedAgentInput))],
    } as ResolvedDependencyInput;
  };




  return (
    <FormField<{dependencies: {[key: string]: ResolvedDependencyInput}}>
      control={form.control} // type: ignore
      name={`dependencies.${dependency.key}`}
      render={({ field }) => (
        <>
          <FormItem className={cn("flex flex-col dark:text-white")}>
            {dependency.key != undefined && <FormLabel>{dependency.key}</FormLabel>}
            <Command
              shouldFilter={false}
              className="overflow-visible bg-transparent"
            >
              <div className="group rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="w-full relative flex flex-row flex-wrap w-full">
                  {field.value && (
                    <DependencyButtonLabel
                      value={field.value}
                      setValue={(value) => {
                        form.setValue(`dependencies.${dependency.key}`, valuesToDependencies(value), { shouldValidate: true });
                        setInputValue("");
                        inputRef.current?.focus();
                        setOpen(true);
                      }}
                    />
                  )}
                  <CommandInput
                    placeholder={"Search for an agent..."}
                    onValueChange={(e) => {
                      setInputValue(e);
                      query(e);
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
                      <CommandEmpty>No matching Agnet found</CommandEmpty>
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
                                  field.value.includes(option.value)
                                ) {
                                  form.setValue(
                                    name,
                                    field.value.filter(
                                      (val) => val !== option.value,
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
                                      option.value,
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
                                    field.value.includes(option.value)
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
            {dependency.description && <FormDescription>{dependency.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
};


















export type DependencyContainerProps = {
  dependencies: ListDependencyFragment[]
  bound: string;
}




export const DependenciesContainer = ({
  dependencies,
  bound,
}: DependencyContainerProps) => {




  return (
    <div
      className={`grid overflow-visible`}
    >
      {dependencies.map((dep, index) => {

        return (
          <DependencySearchField dependency={dep} key={dep.key}/>
        );
      })}
    </div>
  );
};
