import { FloatField } from "@/components/fields/FloatField";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { InputWidgetProps } from "@jhnnsrs/rekuest-next";

export const FloatWidget = (props: InputWidgetProps) => {
  const validate = usePortValidate(props.port)
  return (
    <FloatField
      name={props.port.key}
      label={props.port.label || undefined}
      description={props.port.description || undefined}
      validate={validate}
    />
  );
};
