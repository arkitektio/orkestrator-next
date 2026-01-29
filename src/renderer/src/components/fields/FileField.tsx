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

export const FileField = (props: FieldProps & { placeholder?: string }) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={props.name}
      rules={{ validate: props.validate }}
      render={({ field }) => (
        <FormItem className="text-white">
          <FormLabel>
            {props.label != undefined ? props.label : props.name}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={props.placeholder ? props.placeholder : "Enter.."}
              {...field}
              type="file"
            />
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
