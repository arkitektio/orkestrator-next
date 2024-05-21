import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FieldProps } from "./types";
import { useFormContext } from "react-hook-form";

export type Option = {
  label: string;
  value: string;
  description?: string;
};

export const ChoicesField = (props: FieldProps & { options: Option[] }) => {
  const [open, setOpen] = React.useState(false);

  console.log(props.options);

  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={props.name}
      rules={{ validate: props.validate }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {props.label != undefined ? props.label : props.name}
          </FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {field.value
                    ? props.options.find((op) => op.value === field.value)
                        ?.label
                    : "Select framework..."}
                  {field.value}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search options..." />
                  <CommandEmpty>No options found.</CommandEmpty>
                  <CommandGroup>
                    {props.options.map((op) => (
                      <CommandItem
                        key={op.value}
                        value={op.value}
                        onSelect={(currentValue) => {
                          console.log(currentValue);
                          form.setValue(
                            field.name,
                            currentValue === field.value
                              ? undefined
                              : currentValue,
                            { shouldValidate: true },
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === op.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {op.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
