import { DateField } from "@/components/fields/DateField";
import { InputWidgetProps } from "@jhnnsrs/rekuest";

export const DateWidget = (props: InputWidgetProps) => {
  return (
    <DateField
      name={props.port.key}
      label={props.port.label || undefined}
      description={props.port.description || undefined}
    />
  );
};
