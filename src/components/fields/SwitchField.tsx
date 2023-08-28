import { Input } from "@/components/ui/input";
import { InputWidgetProps, ReturnWidgetProps } from "@jhnnsrs/rekuest";
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
import { Switch } from "../ui/switch";

export const SwitchField = (props: FieldProps & { placeholder?: string }) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg  shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>{props.label ? props.label : props.name}</FormLabel>

            <FormDescription>{props.description}</FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
