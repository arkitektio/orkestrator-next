import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { SearchAssignWidgetFragment } from "@/rekuest/api/graphql";
import { InputWidgetProps, useWidgetRegistry } from "@jhnnsrs/rekuest-next";
import { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";

export const SearchWidget = (
  props: InputWidgetProps<SearchAssignWidgetFragment>,
) => {
  const form = useFormContext();
  const { registry } = useWidgetRegistry();

  console.log(props.widget?.ward);
  let query = props?.widget?.query || "";
  let wardKey = props.widget?.ward;
  console.log(query, wardKey);

  const theward = useMemo(
    () => registry.getWard(wardKey || "default"),
    [registry, wardKey],
  );

  const values = useMemo(() => form.getValues(), [form.formState]);
  console.log(values);

  const search = useCallback(
    async (searching: SearchOptions) => {
      if (!theward.search) throw new Error("Ward does not support search");
      let options = await theward.search({
        query: query,
        variables: { ...searching, ...values },
      });

      console.log(options)
      return options;
    },
    [theward, query, values],
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
