import { FloatField } from "@/components/fields/FloatField";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";

export const FloatWidget = (props: InputWidgetProps) => {

  return (
    <FloatField
      name={pathToName(props.path)}
      label={props.port.label || props.port.key}
      description={props.port.description || undefined}
    />
  );
};
