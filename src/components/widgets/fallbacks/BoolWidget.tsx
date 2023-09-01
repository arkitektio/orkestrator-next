import { SwitchField } from "@/components/fields/SwitchField";
import { InputWidgetProps } from "@jhnnsrs/rekuest-next";

export const BoolWidget = (props: InputWidgetProps) => {
  return (
    <SwitchField
      name={props.port.key}
      label={props.port.label || undefined}
      description={props.port.description || undefined}
    />
  );
};
