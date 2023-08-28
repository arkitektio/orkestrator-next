import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { FormField } from "@/components/ui/form";
import { notEmpty } from "@/lib/utils";
import { ChoiceWidgetFragment } from "@/rekuest/api/graphql";
import { InputWidgetProps, Ward, useWidgetRegistry } from "@jhnnsrs/rekuest";
import { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";

export const ChoicesWidget = (
  props: InputWidgetProps<ChoiceWidgetFragment>
) => {
  const form = useFormContext();

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
    [choices]
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
