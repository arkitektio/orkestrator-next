import * as React from 'react';
import BlokRenderer from '@/blok/renderer/BlokRenderer';
import {useBlokRuntime, type BlokDispatchActionHandler} from '@/blok/renderer/runtime';
import {toast} from 'sonner';
import {useSettings} from '@/providers/settings/SettingsContext';
import {useAssignMutation} from '@/rekuest/api/graphql';
import {useAgentLiveState} from '@/rekuest/hooks/useLiveState';

type MaterializedBlokData = {
  id: string;
  blok: {
    uiComponents: unknown;
    demoState: unknown;
    dependencies?: Array<{key: string}> | null;
  };
  agentMappings: Array<{
    key: string;
    agent: {
      id: string;
    };
  }>;
};

type MaterializedBlokRendererProps = Omit<
  React.ComponentProps<typeof BlokRenderer>,
  'uiComponents' | 'initialState' | 'dispatchAction' | 'children'
> & {
  materializedBlok: MaterializedBlokData;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const splitRuntimePath = (path: string): string[] =>
  path
    .replace(/^\//, '')
    .split(/[/.]/)
    .filter(Boolean);

const extractUiComponents = (uiComponents: unknown): unknown[] => {
  if (Array.isArray(uiComponents)) {
    return uiComponents;
  }

  if (isRecord(uiComponents) && Array.isArray(uiComponents.uiComponents)) {
    return uiComponents.uiComponents;
  }

  return [];
};

const collectArgumentDemandPaths = (
  argument: unknown,
  registerPath: (path: string) => void,
) => {
  if (!isRecord(argument)) {
    return;
  }

  if (typeof argument.value_path === 'string') {
    registerPath(argument.value_path);
  }

  if (Array.isArray(argument.value_list)) {
    argument.value_list.forEach(item => collectArgumentDemandPaths(item, registerPath));
  }

  if (Array.isArray(argument.value_dict)) {
    argument.value_dict.forEach(item => collectArgumentDemandPaths(item, registerPath));
  }

  if (isRecord(argument.util_call) && Array.isArray(argument.util_call.arguments)) {
    argument.util_call.arguments.forEach(item => collectArgumentDemandPaths(item, registerPath));
  }

  if (isRecord(argument.agent_call) && Array.isArray(argument.agent_call.arguments)) {
    argument.agent_call.arguments.forEach(item => collectArgumentDemandPaths(item, registerPath));
  }
};

const collectDemandedStateInterfaces = (
  uiComponents: unknown,
  dependencyKeys: Set<string>,
): Map<string, Set<string>> => {
  const demandedInterfaces = new Map<string, Set<string>>();

  const registerPath = (path: string) => {
    const [dependencyKey, stateInterface] = splitRuntimePath(path);

    if (!dependencyKey || !stateInterface || !dependencyKeys.has(dependencyKey)) {
      return;
    }

    const interfaces = demandedInterfaces.get(dependencyKey) ?? new Set<string>();
    interfaces.add(stateInterface);
    demandedInterfaces.set(dependencyKey, interfaces);
  };

  const visitNode = (node: unknown) => {
    if (!isRecord(node)) {
      return;
    }

    if (Array.isArray(node.props)) {
      node.props.forEach(prop => {
        if (!isRecord(prop)) {
          return;
        }

        if (isRecord(prop.dynamic_value) && typeof prop.dynamic_value.path === 'string') {
          registerPath(prop.dynamic_value.path);
        }

        if (isRecord(prop.agent_call) && Array.isArray(prop.agent_call.arguments)) {
          prop.agent_call.arguments.forEach(argument => collectArgumentDemandPaths(argument, registerPath));
        }

        if (isRecord(prop.util_call) && Array.isArray(prop.util_call.arguments)) {
          prop.util_call.arguments.forEach(argument => collectArgumentDemandPaths(argument, registerPath));
        }
      });
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(visitNode);
    }
  };

  extractUiComponents(uiComponents).forEach(visitNode);

  return demandedInterfaces;
};

const MaterializedDependencyInterfaceSync = (props: {
  dependencyKey: string;
  stateInterface: string;
  agentId: string;
}) => {
  const {agentId, dependencyKey, stateInterface} = props;
  const {value, revision} = useAgentLiveState({agentID: agentId, stateInterface});
  const setRuntimeValue = useBlokRuntime(state => state.setRuntimeValue);
  const clearRuntimeValue = useBlokRuntime(state => state.clearRuntimeValue);
  const setAgentMappingStateUpdate = useBlokRuntime(state => state.setAgentMappingStateUpdate);
  const clearAgentMappingStateUpdate = useBlokRuntime(state => state.clearAgentMappingStateUpdate);
  const runtimePath = `${dependencyKey}/${stateInterface}`;

  React.useEffect(() => {
    if (value == null) {
      return;
    }

    setRuntimeValue(runtimePath, value);
    setAgentMappingStateUpdate(dependencyKey, agentId, stateInterface, value, revision);

    return () => {
      clearRuntimeValue(runtimePath);
      clearAgentMappingStateUpdate(dependencyKey, stateInterface);
    };
  }, [
    agentId,
    clearAgentMappingStateUpdate,
    clearRuntimeValue,
    dependencyKey,
    revision,
    runtimePath,
    setAgentMappingStateUpdate,
    setRuntimeValue,
    stateInterface,
    value,
  ]);

  return null;
};

const MaterializedBlokRuntimeSync = (props: {materializedBlok: MaterializedBlokData}) => {
  const dependencyKeys = React.useMemo(
    () => new Set(props.materializedBlok.agentMappings.map(mapping => mapping.key)),
    [props.materializedBlok.agentMappings],
  );
  const demandedStateInterfaces = React.useMemo(
    () => collectDemandedStateInterfaces(props.materializedBlok.blok.uiComponents, dependencyKeys),
    [dependencyKeys, props.materializedBlok.blok.uiComponents],
  );

  return (
    <>
      {props.materializedBlok.agentMappings.flatMap(mapping => {
        const interfaces = demandedStateInterfaces.get(mapping.key);

        if (!interfaces || interfaces.size === 0) {
          return [];
        }

        return [...interfaces].map(stateInterface => (
          <MaterializedDependencyInterfaceSync
            key={`${mapping.key}-${mapping.agent.id}-${stateInterface}`}
            dependencyKey={mapping.key}
            stateInterface={stateInterface}
            agentId={mapping.agent.id}
          />
        ));
      })}
    </>
  );
};

const useMaterializedDispatchAction = (
  agentMappings: MaterializedBlokData['agentMappings'],
) => {
  const {settings} = useSettings();
  const [assign] = useAssignMutation();
  const agentIdByDependency = React.useMemo(
    () => new Map(agentMappings.map(mapping => [mapping.key, mapping.agent.id] as const)),
    [agentMappings],
  );

  return React.useCallback<BlokDispatchActionHandler>(
    (action) => {
      console.log('Dispatching action with raw data:', {action, agentMappings, agentIdByDependency});
      const agentId = action?.dependency ? agentIdByDependency.get(action.dependency) : undefined;

      if (!agentId) {
        toast.error(`No agent mapping found for dependency ${action?.dependency ?? 'unknown'}.`);
        return;
      }


      console.log(`Dispatching action ${action.operation} to agent ${agentId} with arguments:`, action.arguments);
      void assign({
        variables: {
          input: {
            instanceId: settings.instanceId,
            agent: agentId,
            interface: action.operation,
            args: action.arguments ?? {},
            hooks: [],
            cached: false,
            capture: false,
            ephemeral: false,
            log: false,
          },
        },
      }).catch((error: unknown) => {
        toast.error(
          error instanceof Error
            ? error.message
            : `Failed to dispatch ${action.operation}.`,
        );
      });
    },
    [agentIdByDependency, assign, settings.instanceId],
  );
};

export const MaterializedBlokRenderer = (props: MaterializedBlokRendererProps) => {
  const {materializedBlok, ...rendererProps} = props;
  const dispatchAction = useMaterializedDispatchAction(materializedBlok.agentMappings);

  return (
    <BlokRenderer
      {...rendererProps}
      uiComponents={materializedBlok.blok.uiComponents}
      initialState={materializedBlok.blok.demoState}
      dispatchAction={dispatchAction}
    >
      <MaterializedBlokRuntimeSync materializedBlok={materializedBlok} />
    </BlokRenderer>
  );
};

export default MaterializedBlokRenderer;
