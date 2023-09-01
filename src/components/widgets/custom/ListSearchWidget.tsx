import { ListSearchField } from "@/components/fields/ListSearchField";
import { SearchOptions } from "@/components/fields/SearchField";
import { SearchAssignWidgetFragment } from "@/rekuest/api/graphql";
import { InputWidgetProps, useWidgetRegistry } from "@jhnnsrs/rekuest-next";
import { useCallback, useMemo } from "react";

export const ListSearchWidget = (
  props: InputWidgetProps<SearchAssignWidgetFragment>
) => {
  const { registry } = useWidgetRegistry();

  let wardKey = props.widget?.ward;
  let query = props?.widget?.query || "";

  const theward = useMemo(
    () => registry.getWard(wardKey || "default"),
    [registry, wardKey]
  );

  const search = useCallback(
    async (searching: SearchOptions) => {
      if (!theward.search) throw new Error("Ward does not support search");
      let options = await theward.search({
        query: query,
        variables: searching,
      });
      return options;
    },
    [theward, query]
  );

  return (
    <ListSearchField
      name={props.port.key}
      label={props.port.label || undefined}
      search={search}
      description={props.port.description || undefined}
      noOptionFoundPlaceholder="No options found"
      commandPlaceholder="Search..."
    />
  );
};
