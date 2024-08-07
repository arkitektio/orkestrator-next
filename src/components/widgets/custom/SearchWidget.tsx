import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { SearchAssignWidgetFragment } from "@/rekuest/api/graphql";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";

import { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";

export const SearchWidget = (
  props: InputWidgetProps<SearchAssignWidgetFragment>,
) => {
  console.log("SearchWidget", props);
  const form = useFormContext();
  const { registry } = useWidgetRegistry();

  let query = props?.widget?.query || "";
  let wardKey = props.widget?.ward;

  const theward = useMemo(
    () => registry.getWard(wardKey || "default"),
    [registry, wardKey],
  );

  const values = useMemo(() => form.getValues(), [form.formState]);

  const search = useCallback(
    async (searching: SearchOptions) => {
      console.log("searching", searching, theward, wardKey, query);
      if (!theward.search) throw new Error("Ward does not support search");
      let options = await theward.search({
        query: query,
        variables: { ...searching, ...values },
      });

      console.log(options);
      return options;
    },
    [theward, query, values],
  );

  return (
    <SearchField
      name={pathToName(props.path)}
      label={props.port.label || props.port.key}
      search={search}
      description={props.port.description || undefined}
      noOptionFoundPlaceholder="No options found"
      commandPlaceholder="Search..."
    />
  );
};
