import { IntField } from "@/components/fields/IntField";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { InputWidgetProps } from "@jhnnsrs/rekuest-next";

export const IntWidget = (props: InputWidgetProps) => {
  const validate = usePortValidate(props.port)
  return (
    <IntField
      name={props.port.key}
      label={props.port.label || undefined}
      description={props.port.description || undefined}
      validate={validate}
    />
  );
};
