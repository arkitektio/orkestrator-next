import { InputWidgetProps } from "@jhnnsrs/rekuest-next";
import { useFormContext } from "react-hook-form";
import { ListChoicesWidget } from "../custom/ListChoicesWidget";
import { ListSearchWidget } from "../custom/ListSearchWidget";

export const ListWidget = (props: InputWidgetProps) => {
  if (props.port.child?.assignWidget?.__typename == "SearchAssignWidget") {
    return (
      <ListSearchWidget {...props} widget={props.port.child.assignWidget} />
    );
  }

  if (props.port.child?.assignWidget?.__typename == "ChoiceAssignWidget") {
    return (
      <ListChoicesWidget {...props} widget={props.port.child.assignWidget} />
    );
  }

  return <>Nothing</>;
};
