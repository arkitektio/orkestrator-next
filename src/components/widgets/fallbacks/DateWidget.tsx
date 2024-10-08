import { DateTimeField } from "@/components/fields/DateTimeField";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";

export const DateWidget = (props: InputWidgetProps) => {
  const validate = usePortValidate(props.port);

  return (
    <DateTimeField
      name={pathToName(props.path)}
      label={props.port.label || props.port.key}
      description={props.port.description || undefined}
      validate={validate}
    />
  );
};
