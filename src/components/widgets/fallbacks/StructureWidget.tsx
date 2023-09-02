import { StringField } from "@/components/fields/StringField";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PortScope } from "@/rekuest/api/graphql";
import { InputWidgetProps } from "@jhnnsrs/rekuest-next";

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
          name={props.port.key}
          label={props.port.label || undefined}
          description={props.port.description || undefined}
        />
      )}
    </>
  );
};
