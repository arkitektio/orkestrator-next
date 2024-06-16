import { StringField } from "@/components/fields/StringField";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";

export const StringWidget = (props: InputWidgetProps) => {
  const validate = usePortValidate(props.port);

  return (
    <StringField
      name={pathToName(props.path)}
      label={props.port.label || props.port.key}
      description={props.port.description || undefined}
    />
  );
};
