import { SwitchField } from "@/components/fields/SwitchField";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";

export const BoolWidget = (props: InputWidgetProps) => {
  const validate = usePortValidate(props.port);

  return (
    <SwitchField
      name={pathToName(props.path)}
      label={props.port.label || props.port.key}
      description={props.port.description || undefined}
      validate={validate}
    />
  );
};
