import { FormControl, FormField } from "@/components/ui/form";
import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { Toggle } from "../ui/toggle";
import { FieldProps } from "./types";

export const ToggleField = (
  props: FieldProps & { placeholder?: string; children?: ReactNode },
) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={props.name}
      rules={{ validate: props.validate }}
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
