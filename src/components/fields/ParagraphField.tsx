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
import { Textarea } from "../ui/textarea";

export const ParagraphField = (
  props: FieldProps & { placeholder?: string },
) => {
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
            <Textarea
              placeholder={props.placeholder ? props.placeholder : "Enter.."}
              {...field}
            />
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
