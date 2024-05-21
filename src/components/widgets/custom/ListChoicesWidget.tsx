import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { notEmpty } from "@/lib/utils";
import { ChoiceAssignWidgetFragment } from "@/rekuest/api/graphql";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";

import { useCallback } from "react";
import { useFormContext } from "react-hook-form";

export const ListChoicesWidget = (
  props: InputWidgetProps<ChoiceAssignWidgetFragment>,
) => {
  const form = useFormContext();

  console.log(props.widget?.choices);
  const choices = props.widget?.choices || [];

  const search = useCallback(
    async (searching: SearchOptions) => {
      if (searching.search) {
        return choices
          .filter(notEmpty)
          .filter((c) => c.label.startsWith(searching.search || ""));
      }
      if (searching.values != undefined) {
        return choices
          .filter(notEmpty)
          .filter((c) => searching.values?.includes(c.value));
      }
      return [];
    },
    [choices],
  );

  return (
    <SearchField
      name={pathToName(props.path)}
      label={props.port.label  || props.port.key}
      search={search}
      description={props.port.description || undefined}
      noOptionFoundPlaceholder="No options found"
      commandPlaceholder="Search..."
    />
  );
};
