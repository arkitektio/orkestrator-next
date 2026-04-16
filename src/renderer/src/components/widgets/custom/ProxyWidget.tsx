import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { notEmpty } from "@/lib/utils";
import {
  PortKind,
  ProxyWidgetFragment,
  StateChoiceAssignWidgetFragment,
  useGetStateForQuery,
} from "@/rekuest/api/graphql";
import { useAgentLiveState } from "@/rekuest/hooks/useLiveState";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";
import { useCallback } from "react";



const accessNestedValue = (obj: Record<string, unknown>, path: string[]) => {
  return path.reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return acc[key] as Record<string, unknown>;
    }
    return null;
  }, obj);
}


export const ProxyWidget = (
  props: InputWidgetProps<ProxyWidgetFragment>,
) => {
  if (!props.bound) {
    return <div>Proxy widget requires a bound agent to function.</div>;
  }

  if (props.widget.targetDependency) {
    return (
      <div>
        This widget is currently not compatible with dependencies. Please remove
        the dependency to use it.
      </div>
    );
  }


  return (
    <>
      Not implemented yet.
    </>
  );
};
