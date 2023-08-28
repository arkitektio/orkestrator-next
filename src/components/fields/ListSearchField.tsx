import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Badge } from "../ui/badge";

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
  searching: SearchOptions
) => Promise<(Option | null | undefined)[]>;

export const ListSearchField = ({
  name,
  label,
  search,
  placeholder = "Please Select",
  commandPlaceholder = "Search...",
  noOptionFoundPlaceholder = "No options found",
  description,
}: {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  commandPlaceholder?: string;
  noOptionFoundPlaceholder?: string;
  search: SearchFunction;
}) => {
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
      render={({ field }) => (
        <>
          <FormItem className="flex flex-col">
            <FormLabel>{label ? label : name}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between overflow-hidden truncate ellipsis",
                      !field.value && "text-muted-foreground"
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
                  {options.length > 0 && (
                    <CommandGroup heading="Search">
                      {options.filter(notEmpty).map((option) => (
                        <CommandItem
                          value={option.value}
                          key={option.value}
                          onSelect={() => {
                            console.log(option.value);
                            if (field.value == undefined) {
                              field.onChange([option.value]);
                            } else {
                              if (field.value.includes(option.value)) {
                                form.setValue(
                                  name,
                                  field.value.filter(
                                    (v: string) => v !== option.value
                                  ),
                                  { shouldValidate: true }
                                );
                              } else {
                                form.setValue(
                                  name,
                                  [...field.value, option.value].filter(
                                    notEmpty
                                  ),
                                  { shouldValidate: true }
                                );
                              }
                            }
                          }}
                        >
                          {option.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              field.value && field.value.includes(option.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
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
