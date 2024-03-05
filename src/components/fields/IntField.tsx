import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { FieldProps } from "./types";

export const IntField = (props: FieldProps & { placeholder?: string }) => {
  const form = useFormContext();

  console.log("Reanderer");
  return (
    <FormField
      control={form.control}
      rules={{
        validate: (v, values) => {
          console.log("Validating", values);
          return v < 1 || "Value must be greater than 3";
        },
      }}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label ? props.label : props.name}</FormLabel>
          <FormControl>
            <Input
              placeholder={
                props.placeholder ? props.placeholder : "Enter Number"
              }
              {...field}
              onChange={(e) => {
                field.onChange(e);
              }}
              type="number"
            />
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
