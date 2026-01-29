import { SliderField } from "@/components/fields/SliderField";
import { SliderAssignWidgetFragment } from "@/rekuest/api/graphql";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";

export const SliderWidget = (
  props: InputWidgetProps<SliderAssignWidgetFragment>,
) => {
  const validate = usePortValidate(props.port);
  return (
    <SliderField
      name={pathToName(props.path)}
      label={props.port.label || props.port.key}
      description={props.port.description || undefined}
      validate={validate}
      min={props.widget?.min || undefined}
      max={props.widget?.max || undefined}
      step={props.widget?.step || undefined}
    />
  );
};
