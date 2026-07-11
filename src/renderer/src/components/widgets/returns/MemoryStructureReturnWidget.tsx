import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { notEmpty } from "@/lib/utils";
import {
  useMemoryShelveQuery,
} from "@/rekuest/api/graphql";
import { ReturnWidgetProps } from "@/rekuest/widgets/types";
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
      id: props.port.key,
    },
  });

  const search = useCallback(
    async (searching: SearchOptions) => {
      console.log("Searching", searching);
      const drawers = data?.memoryShelve.drawers.filter(notEmpty) || [];

      let filtered = drawers;
      if (searching.search) {
        filtered = drawers.filter((c) =>
          c.label?.startsWith(searching.search || ""),
        );
      } else if (searching.values) {
        console.log("Searching", searching.values);
        filtered = drawers.filter((c) =>
          searching.values?.includes(c.resourceId),
        );
      }

      return filtered.map((c) => ({ label: c.label, value: c.resourceId }));
    },
    [data],
  );

  return (
    <>
      <SearchField
        name={props.port.key}
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
