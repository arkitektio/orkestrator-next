import { StringField } from "@/components/fields/StringField";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";

export const StructureWidget = (props: InputWidgetProps) => {
  return (
    <>
        <StringField
          name={pathToName(props.path)}
          label={props.port.label || undefined}
          description={props.port.description || undefined}
        />
    </>
  );
};
