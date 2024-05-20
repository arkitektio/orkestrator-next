import { DateField } from "@/components/fields/DateField";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { InputWidgetProps } from "@/rekuest/widgets/types";

export const DateWidget = (props: InputWidgetProps) => {
  const validate = usePortValidate(props.port);

  return (
    <DateField
      name={props.port.key}
      label={props.port.label || undefined}
      description={props.port.description || undefined}
      validate={validate}
    />
  );
};
