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
import { Switch } from "@/components/ui/switch";
import { SwitchField } from "@/components/fields/SwitchField";

export const BoolWidget = (props: InputWidgetProps) => {
  return (
    <SwitchField
      name={props.port.key}
      label={props.port.label || undefined}
      description={props.port.description || undefined}
    />
  );
};
