import { IntField } from "@/components/fields/IntField";
import { InputWidgetProps } from "@jhnnsrs/rekuest";

export const IntWidget = (props: InputWidgetProps) => {
  return (
    <IntField
      name={props.port.key}
      label={props.port.label || undefined}
      description={props.port.description || undefined}
    />
  );
};
