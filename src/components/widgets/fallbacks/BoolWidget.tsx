import { SwitchField } from "@/components/fields/SwitchField";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { InputWidgetProps } from "@/rekuest/widgets/types";

export const BoolWidget = (props: InputWidgetProps) => {
  const validate = usePortValidate(props.port);

  return (
    <SwitchField
      name={props.port.key}
      label={props.port.label || undefined}
      description={props.port.description || undefined}
      validate={validate}
    />
  );
};
