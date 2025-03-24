import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FieldProps } from "./types";
import { SearchField } from "./SearchField";
import { ListSearchField } from "./ListSearchField";

export type Option = {
  label: string;
  value: string;
  description?: string;
};

export const ListChoicesField = (props: FieldProps & { options: Option[] }) => {
  const [open, setOpen] = React.useState(false);

  console.log(props.options);

  const search = async ({
    search,
    values,
  }: {
    search?: string;
    values?: (string | number)[];
  }) => {
    return props.options.filter((op) => {
      if (values) return values.includes(op.value);
      if (search) return op.label.includes(search);
      if (!search) return true;
      return false;
    });
  };

  const form = useFormContext();

  return <ListSearchField search={search} {...props} />;
};
