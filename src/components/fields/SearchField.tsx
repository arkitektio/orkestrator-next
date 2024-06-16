import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

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
import { cn, notEmpty } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FieldProps } from "./types";

export type Option = {
  label: string;
  value: string;
};

export const ButtonLabel = (props: {
  search: SearchFunction;
  value: string;
}) => {
  const [option, setOption] = useState<Option | null | undefined>(null);
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
) => Promise<(Option | null | undefined)[]>;

export type SearchFieldProps = {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  commandPlaceholder?: string;
  noOptionFoundPlaceholder?: string;
  search: SearchFunction;
} & FieldProps;

export const SearchField = ({
  name,
  label,
  validate,
  search,
  placeholder = "Please Select",
  commandPlaceholder = "Search...",
  noOptionFoundPlaceholder = "No options found",
  description,
}: SearchFieldProps) => {
  const form = useFormContext();

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
  }, [name, search]);

  return (
    <FormField
      control={form.control}
      name={name}
      rules={{ validate: validate }}
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
                    <CommandEmpty>{noOptionFoundPlaceholder}</CommandEmpty>
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
                            form.setValue(name, option.value, {
                              shouldValidate: true,
                            });
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
