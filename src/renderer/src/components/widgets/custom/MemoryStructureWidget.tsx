import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import {
  useSearchMemoryDrawerLazyQuery
} from "@/rekuest/api/graphql";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";
import { useCallback } from "react";

export const MemoryStructureWidget = (
  props: InputWidgetProps<any>,
) => {
  if (!props.bound) {
    return (
      <div>
        This widget makes only sense if you use it on a bound instance, because
        it depends on specific app state
      </div>
    );
  }

  const [searchD] = useSearchMemoryDrawerLazyQuery()

  const search = useCallback(
    async (searching: SearchOptions) => {
      console.log("Searching", searching)
      const w = await searchD({
        variables: {
          ...searching,
          template: props.bound,

        }
      })
      return w.data?.options
    },
    [searchD, props.bound],
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
    </>
  );
};
