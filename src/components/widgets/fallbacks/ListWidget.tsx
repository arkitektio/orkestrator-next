import { InputWidgetProps } from "@jhnnsrs/rekuest";
import { useFormContext } from "react-hook-form";
import { ListSearchWidget } from "../custom/ListSearchWidget";
import { ListChoicesWidget } from "../custom/ListChoicesWidget";

export const ListWidget = (props: InputWidgetProps) => {
  const form = useFormContext();

  if (props.port.child?.assignWidget?.__typename == "SearchWidget") {
    return (
      <ListSearchWidget {...props} widget={props.port.child.assignWidget} />
    );
  }

  if (props.port.child?.assignWidget?.__typename == "ChoiceWidget") {
    return (
      <ListChoicesWidget {...props} widget={props.port.child.assignWidget} />
    );
  }

  return <>Nothing</>;
};
