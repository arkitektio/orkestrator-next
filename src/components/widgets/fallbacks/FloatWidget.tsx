import { FloatField } from "@/components/fields/FloatField";
import { InputWidgetProps } from "@jhnnsrs/rekuest";

export const FloatWidget = (props: InputWidgetProps) => {
  return (
    <FloatField
      name={props.port.key}
      label={props.port.label || undefined}
      description={props.port.description || undefined}
    />
  );
};
