import { FilterSearchField } from "@/components/fields/FilterSearchField";
import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { Badge } from "@/components/ui/badge";
import { SearchAssignWidgetFragment } from "@/rekuest/api/graphql";
import useWidgetDependencies from "@/rekuest/hooks/useWidgetDependencies";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";

import { useCallback, useMemo } from "react";





export const SearchWidget = (
  props: InputWidgetProps<SearchAssignWidgetFragment>,
) => {
  console.log("SearchWidget", props);
  const { registry } = useWidgetRegistry();

  const query = props?.widget?.query || "";
  const wardKey = props.widget?.ward;

  if (!wardKey) {
    return <>No ward set</>;
  }

  const theward = useMemo(
    () => registry.getWard(wardKey),
    [registry, wardKey],
  );

  const { values, met } = useWidgetDependencies({
    widget: props.widget,
    path: props.path,
  });

  const search = useCallback(
    async (searching: SearchOptions) => {
      console.log("searching", searching, theward, wardKey, query);
      if (!theward.search) throw new Error("Ward does not support search");
      if (!met) throw new Error("Dependencies not met");

      const options = await theward.search({
        query: query,
        variables: { ...searching, ...values },
      });

      console.log(options);
      return options;
    },
    [theward, query, values],
  );

  if (!met) {
    return <div className="w-full my-2">Waiting for {props.widget?.dependencies?.map(d => <Badge>{d}</Badge>)}</div>;
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
    <>
      <SearchField
        name={pathToName(props.path)}
        label={props.port.label || props.port.key}
        search={search}
        description={props.port.description || undefined}
        noOptionFoundPlaceholder="No options found"
        commandPlaceholder="Search..."
      />
    </>
  );
};
