import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { notEmpty } from "@/lib/utils";
import {
  useMemoryShelveQuery,
} from "@/rekuest/api/graphql";
import { InputWidgetProps, ReturnWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";
import { useCallback } from "react";

export const MemoryStructureWidget = (
  props: ReturnWidgetProps,
  
) => {
  if (!props.value) {
    return (
      <div>
        No value found
      </div>
    );
  }

  const { data, error } = useMemoryShelveQuery({
    variables: {
      template: props.bound,
    },
  });

  const search = useCallback(
    async (searching: SearchOptions) => {
      console.log("Searching", searching);
      if (searching.search) {
        return data?.memoryShelve.drawers
          .filter(notEmpty)
          .filter((c) => c.label?.startsWith(searching.search || ""));
      }
      if (searching.values) {
        console.log("Searching", searching.values);
        return data?.memoryShelve.drawers
          .filter(notEmpty)
          .filter((c) => searching.values?.includes(c.resourceId));
      }
      return data?.memoryShelve.drawers
    },
    [data],
  );

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
      {error && <div>Error: {error.message}</div>}
    </>
  );
};
