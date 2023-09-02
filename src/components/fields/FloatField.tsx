import { Input } from "@/components/ui/input";
import { InputWidgetProps, ReturnWidgetProps } from "@jhnnsrs/rekuest-next";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { FieldProps } from "./types";

export const FloatField = (props: FieldProps & { placeholder?: string }) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.name ? props.label : props.name}</FormLabel>
          <FormControl>
            <Input
              placeholder={
                props.placeholder ? props.placeholder : "Enter Number"
              }
              {...field}
              onChange={(e) => {
                field.onChange(parseFloat(e.target.value));
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
