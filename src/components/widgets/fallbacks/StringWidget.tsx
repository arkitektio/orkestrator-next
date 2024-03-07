import { StringField } from "@/components/fields/StringField";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { InputWidgetProps } from "@jhnnsrs/rekuest-next";
import { useFormContext } from "react-hook-form";

export const StringWidget = (props: InputWidgetProps) => {
  const validate = usePortValidate(props.port)

  return (
    <StringField
      name={props.port.key}
      label={props.port.label || undefined}
      description={props.port.description || undefined}
    />
  );
};
