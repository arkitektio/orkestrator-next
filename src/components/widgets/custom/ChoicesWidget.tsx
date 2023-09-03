import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { notEmpty } from "@/lib/utils";
import { ChoiceAssignWidgetFragment } from "@/rekuest/api/graphql";
import { InputWidgetProps } from "@jhnnsrs/rekuest-next";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";

export const ChoicesWidget = (
  props: InputWidgetProps<ChoiceAssignWidgetFragment>,
) => {

  console.log(props.widget?.choices);
  const choices = props.widget?.choices || [];

  const search = useCallback(
    async (searching: SearchOptions) => {
      console.log(searching);
      if (searching.search) {
        return choices
          .filter(notEmpty)
          .filter((c) => c.label.startsWith(searching.search || ""));
      }
      if (searching.values) {
        return choices
          .filter(notEmpty)
          .filter((c) => searching.values?.includes(c.value));
      }
      return choices.filter(notEmpty);
    },
    [choices],
  );

  return (
    <SearchField
      name={props.port.key}
      label={props.port.label || undefined}
      search={search}
      description={props.port.description || undefined}
      noOptionFoundPlaceholder="No options found"
      commandPlaceholder="Search..."
    />
  );
};
