import { CheckIcon } from "@radix-ui/react-icons";

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
import { useCallback, useEffect, useRef, useState } from "react";
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

export const SearchField = ({
  name,
  label,
  validate,
  search,
  createComponent,
  placeholder = "Please Select",
  commandPlaceholder = "Search...",
  noOptionFoundPlaceholder = "No options found",
  description,
}: SearchFieldProps) => {
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
            form.setValue(name, undefined, {
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
    <FormField
      control={form.control}
      name={name}
      rules={{ validate: validate }}
      render={({ field }) => (
        <>
          <FormItem className="flex flex-col dark:text-white">
            {label != undefined && <FormLabel>{label}</FormLabel>}
            <Command
              shouldFilter={false}
              className="overflow-visible bg-transparent"
            >
              <div className="group rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="w-full relative h-10">
                  <CommandInput
                    onKeyDown={handleKeyDown}
                    placeholder={commandPlaceholder}
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
                        "z-8 absolute w-full h-full cursor-pointer flex flex-row items-center bg-slate-800 top-0 left-0 rounded-md px-2 flex h-10 w-full rounded-md  py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                      )}
                      onClick={() => {
                        setInputValue("");
                        form.setValue(name, undefined, {
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
                    <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                      <CommandEmpty>{noOptionFoundPlaceholder}</CommandEmpty>
                      {error && (
                        <CommandGroup heading="Error">
                          {error && <CommandItem>{error}</CommandItem>}
                        </CommandGroup>
                      )}
                      {createComponent && (
                        <CommandGroup heading="Created">
                          {createComponent && (
                            <CommandItem>{createComponent}</CommandItem>
                          )}
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
                                  form.setValue(name, option.value, {
                                    shouldValidate: true,
                                  });
                                  setInputValue("");
                                } else {
                                  form.setValue(name, null, {
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
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
};
