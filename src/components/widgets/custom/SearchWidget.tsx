import { FilterSearchField } from "@/components/fields/FilterSearchField";
import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { FilterSearch } from "@/kabinet/forms/filter/GlobalSearchFilter";
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

  const foundValues = useMemo(() => {
    return (
      props.widget?.dependencies
        ?.map((dep) => {
          return values[dep];
        })
        .filter((predicate) => predicate !== undefined) || []
    );
  }, [values, props.widget?.dependencies]);

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

  if (foundValues?.length < (props.widget?.dependencies?.length || 0)) {
    return <>Waiting for {props.widget?.dependencies?.join(",")}</>;
  }

  if (props.widget?.filters && props.widget.filters.length > 0) {
    return (
      <FilterSearchField
        name={pathToName(props.path)}
        label={props.port.label || props.port.key}
        filters={props.widget.filters || []}
        search={search}
        description={props.port.description || undefined}
        noOptionFoundPlaceholder="No options found"
        commandPlaceholder="Search..."
      />
    );
  }

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
