import { useDisplayComponent } from "@/app/display";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";

export const DelegatingStructureWidget = (props: ReturnWidgetProps) => {


  const Widget = useDisplayComponent(props.port.identifier);

  if (!props.value) {
    return (
      <div className="text-xs"> No Value received {props.port.identifier}</div>
    );
  }


  return (
    <Widget
      object={props.value.object}
      small={true}
      identifier={props.port.identifier}
    />
  );
};
