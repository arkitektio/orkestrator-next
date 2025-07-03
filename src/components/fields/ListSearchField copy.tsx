import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
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
import { cn, notEmpty } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Badge } from "../ui/badge";
import { FieldProps } from "./types";

export type Option = {
  label: string;
  value: string;
};

export const ListButtonLabel = (props: {
  search: SearchFunction;
  value: string[] | undefined;
  setValue: (value: string[]) => void;
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
      .search({ values: props.value })
      .then((res) => {
        setOptions(res.filter(notEmpty));
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [props.value, props.search]);

  const remove = (value: string) => {
    props.setValue(props.value?.filter((v) => v !== value) || []);
  };

  return (
    <div className="gap-2 flex flex-row flex-wrap">
      {options.map((l, index) => (
        <Badge key={index} onDoubleClick={() => remove(l.value)}>
          {l.label}
        </Badge>
      ))}
      {options.length == 0 && (
        <span className="text-muted-foreground">No options selected</span>
      )}
      {error}
    </div>
  );
};

export type SearchOptions = { search?: string; values?: string[] };

export type SearchFunction = (
  searching: SearchOptions,
) => Promise<(Option | null | undefined)[]>;

export type ListSearchFieldProps = {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  commandPlaceholder?: string;
  noOptionFoundPlaceholder?: string;
  search: SearchFunction;
} & FieldProps;

export const ListSearchField = ({
  name,
  label,
  validate,
  search,
  placeholder = "Please Select",
  commandPlaceholder = "Search...",
  noOptionFoundPlaceholder = "No options found",
  description,
}: ListSearchFieldProps) => {
  const form = useFormContext();

  const [options, setOptions] = useState<(Option | null | undefined)[]>([]);
  const [error, setError] = useState<string | null>(null);

  const query = (string: string) => {
    search({ search: string })
      .then((res) => {
        setOptions(res);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    search({})
      .then((res) => {
        setOptions(res);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [name, search]);

  return (
    <FormField
      control={form.control}
      name={name}
      rules={{ validate: validate }}
      render={({ field }) => (
        <FormItem>
          <Popover>
            <FormItem className="flex flex-col">
              {label && <FormLabel>{label ? label : name}</FormLabel>}
              {error}
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
                      <ListButtonLabel
                        search={search}
                        value={field.value}
                        placeholder={placeholder}
                        setValue={(value) => {
                          form.setValue(name, value, { shouldValidate: true });
                        }}
                      />
                    ) : (
                      <>{error ? error : placeholder}</>
                    )}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>

              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
            <PopoverContent className="w-[400px] p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder={commandPlaceholder}
                  className="h-9"
                  onValueChange={(e) => {
                    query(e);
                  }}
                />
                <CommandEmpty>{noOptionFoundPlaceholder}</CommandEmpty>
                <CommandList className="z-50 pointer-events-auto">
                  {options.length > 0 && (
                    <>
                      {options.filter(notEmpty).map((option) => (
                        <CommandItem
                          value={option.value}
                          key={option.value}
                          onSelect={() => {
                            if (field.value == undefined) {
                              field.onChange([option.value]);
                            } else {
                              if (field.value.find((v) => v == option.value)) {
                                form.setValue(
                                  name,
                                  field.value.filter((v) => v !== option.value),
                                  { shouldValidate: true },
                                );
                              } else {
                                form.setValue(
                                  name,
                                  [...field.value, option.value].filter(
                                    notEmpty,
                                  ),
                                  { shouldValidate: true },
                                );
                              }
                            }
                          }}
                          onClick={() => {}}
                        >
                          {option.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              field.value && field.value.includes(option.value)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
};
