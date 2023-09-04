import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Switch } from "../ui/switch";
import { FieldProps } from "./types";
import { Toggle } from "../ui/toggle";
import { ReactNode } from "react";

export const ToggleField = (
  props: FieldProps & { placeholder?: string; children?: ReactNode },
) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormControl>
          <Toggle pressed={field.value} onPressedChange={field.onChange}>
            {props.children}
          </Toggle>
        </FormControl>
      )}
    />
  );
};
