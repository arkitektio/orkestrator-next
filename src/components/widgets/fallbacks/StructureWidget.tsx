import { StringField } from "@/components/fields/StringField";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PortScope } from "@/rekuest/api/graphql";
import { usePortValidate } from "@/rekuest/hooks/usePortValidator";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";

export const StructureWidget = (props: InputWidgetProps) => {

  return (
    <>
      {props.port.scope == PortScope.Local ? (
        <Alert>
          <AlertTitle>{props.port.key} is Local</AlertTitle>
          <AlertDescription> You cannot use it here</AlertDescription>
        </Alert>
      ) : (
        <StringField
          name={pathToName(props.path)}
          label={props.port.label || undefined}
          description={props.port.description || undefined}
        />
      )}
    </>
  );
};
