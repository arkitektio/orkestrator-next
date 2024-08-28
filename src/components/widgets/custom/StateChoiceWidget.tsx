import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { notEmpty } from "@/lib/utils";
import {
  StateChoiceAssignWidgetFragment,
  useGetStateForQuery,
} from "@/rekuest/api/graphql";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";
import { useCallback } from "react";

export const StateChoiceWidget = (
  props: InputWidgetProps<StateChoiceAssignWidgetFragment>,
) => {
  if (!props.bound) {
    return (
      <div>
        This widget makes only sense if you use it on a bound instance, because
        it depends on specific app state
      </div>
    );
  }

  const stateKey = props.widget?.stateChoices.split(".")[0];
  const valueKey = props.widget?.stateChoices.split(".")[1];

  if (!stateKey || !valueKey) {
    return <div>Invalid state choices widget configuration</div>;
  }

  const { data, error } = useGetStateForQuery({
    variables: {
      template: props.bound,
      stateKey: stateKey,
    },
  });

  const search = useCallback(
    async (searching: SearchOptions) => {
      console.log("Searching", searching);
      if (searching.search) {
        return data?.stateFor.value[valueKey]
          .filter(notEmpty)
          .filter((c) => c.label.startsWith(searching.search || ""));
      }
      if (searching.values) {
        console.log("Searching", searching.values);
        return data?.stateFor.value[valueKey]
          .filter(notEmpty)
          .filter((c) => searching.values?.includes(c.value));
      }
      return data?.stateFor.value[valueKey].filter(notEmpty);
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
