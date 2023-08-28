import { StringField } from "@/components/fields/StringField";
import { InputWidgetProps } from "@jhnnsrs/rekuest";
import { useFormContext } from "react-hook-form";

export const StringWidget = (props: InputWidgetProps) => {
  return (
    <StringField
      name={props.port.key}
      label={props.port.label || undefined}
      description={props.port.description || undefined}
    />
  );
};
