import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { notEmpty } from "@/lib/utils";
import {
  PortKind,
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


export const StateChoiceWidget = (
  props: InputWidgetProps<StateChoiceAssignWidgetFragment>,
) => {


  const stateKey = props.widget?.statePath.split(".")[0];
  const statePaths = props.widget?.statePath.split(".").slice(1) || [];
  const stateAccessors = props.widget.stateAccessors;
  const dependency = props.widget.dependency


  const { value: liveValue } = useAgentLiveState({
    agentID: props.bound,
    stateInterface: stateKey,
    skip: !props.bound || !stateKey,
  });

  const search = useCallback(
    async (searching: SearchOptions) => {
      console.log("Searching with liveValue:", liveValue);

      const accessedValue = accessNestedValue(liveValue || {}, statePaths);
      console.log("Accessed value at path", statePaths, ":", accessedValue);
      // 1. Validation: Must be an array
      if (!Array.isArray(accessedValue)) {
        console.warn("Path did not resolve to an array", statePaths);
        throw new Error("Invalid state path: Expected an array.");
      }

      // 2. Identify Subpaths (Handling null accessors)
      const valuePath = stateAccessors?.find(a => a?.optionKey === 'VALUE')?.subPath;
      const labelPath = stateAccessors?.find(a => a?.optionKey === 'LABEL')?.subPath;
      const descPath = stateAccessors?.find(a => a?.optionKey === 'DESCRIPTION')?.subPath;


      // 3. Map the array with fallbacks
      return accessedValue.map((item, index) => {
        // Handle Objects
        console.log("Processing item:", item);
        if (item !== null && typeof item === "object") {

          if (props.port.kind == PortKind.MemoryStructure) {
            console.log("Detected MemoryStructure item, applying special handling");
            return {
              value: item,
              label: item.name || item.id || `Option ${index + 1}`,
              description: item.description || undefined,
              key: String(item.id || index), // Keys must be strings for many UI frameworks
            };
          }






          // Resolve values via subpaths or fallback to common keys
          const val = valuePath ? accessNestedValue(item, valuePath.split('.')) : (item.id || item.key || index);
          const lab = labelPath ? accessNestedValue(item, labelPath.split('.')) : (item.name || item.label || String(val));
          const desc = descPath ? accessNestedValue(item, descPath.split('.')) : undefined;
          console.log("Resolved option:", { val, lab, desc });
          return {
            value: val,
            label: lab,
            description: desc,
            key: String(val), // Keys must be strings for many UI frameworks
          };
        }

        // Handle Primitives (Strings/Numbers)
        return {
          value: item,
          label: String(item),
          key: String(item),
        };
      })
    },
    [liveValue, statePaths, stateAccessors],
  );

  if (dependency) {
    return (
      <div>
        This widget is currently not compatible with dependencies. Please remove
        the dependency to use it.
      </div>
    );
  }

  if (!stateKey) {
    return <div>Invalid state choices widget configuration</div>;
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
