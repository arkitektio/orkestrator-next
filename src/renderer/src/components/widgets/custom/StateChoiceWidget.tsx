import { SearchField, SearchOptions } from "@/components/fields/SearchField";
import { FormLabel } from "@/components/ui/form";
import {
  PortKind,
  ResolvedDependencyInput,
  StateChoiceAssignWidgetFragment,
} from "@/rekuest/api/graphql";
import { useAgentLiveState } from "@/rekuest/hooks/useLiveState";
import {
  resolveDependencyDefinition,
  useDependencyDefinitions,
} from "@/rekuest/widgets/DependencyContext";
import { InputWidgetProps } from "@/rekuest/widgets/types";
import { pathToName } from "@/rekuest/widgets/utils";
import { useCallback } from "react";
import { useWatch } from "react-hook-form";



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


  const stateKey = props.widget?.statePath?.split(".")[0];
  const statePaths = props.widget?.statePath?.split(".").slice(1) || [];
  const stateAccessors = props.widget?.stateAccessors;
  const dependency = props.widget?.dependency;

  // Resolve which agent's live state backs this widget.
  // - No dependency: the implementation's own bound agent (props.bound).
  // - Dependency: the agent the user selected for that dependency in the form.
  const dependencyDefinitions = useDependencyDefinitions();
  const watchedDeps = useWatch({ name: "dependencies" }) as
    | ResolvedDependencyInput[]
    | undefined;

  let agentID: string | undefined = props.bound;
  let dependencyLabel: string | undefined;
  if (dependency) {
    const definition = resolveDependencyDefinition(
      dependencyDefinitions,
      dependency,
    );
    const dependencyKey = definition?.key ?? dependency;
    dependencyLabel = dependencyKey;
    // A STATE_CHOICE reads a single agent's state — use the first mapped agent.
    agentID = watchedDeps?.find((d) => d.key === dependencyKey)
      ?.mappedAgents?.[0]?.agent;
  }

  const { value: liveValue } = useAgentLiveState({
    agentID: agentID,
    stateInterface: stateKey,
    skip: !agentID || !stateKey,
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

  if (!stateKey) {
    return <div>Invalid state choices widget configuration</div>;
  }

  if (!agentID) {
    return (
      <div className="flex flex-col gap-1">
        <FormLabel className="text-sm">
          {props.port.label || props.port.key}
        </FormLabel>
        <div className="rounded-md border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          {dependency
            ? `First select an agent for "${dependencyLabel}"`
            : "No agent available for this state"}
        </div>
      </div>
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
