import * as React from 'react';
import BlokRenderer from '@/blok/renderer/BlokRenderer';
import {useAgentStates} from '@/rekuest/hooks/useLiveState';

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
  'uiComponents' | 'demoState' | 'state'
> & {
  materializedBlok: MaterializedBlokData;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const mergeMaterializedState = (
  demoState: unknown,
  dependencyStates: Record<string, unknown>,
): unknown => {
  if (!isRecord(demoState)) {
    return Object.keys(dependencyStates).length > 0 ? dependencyStates : demoState;
  }

  return {
    ...demoState,
    ...dependencyStates,
  };
};

const toDemandedDependencyKeys = (materializedBlok: MaterializedBlokData): Set<string> => {
  const demandedKeys = new Set<string>();

  materializedBlok.blok.dependencies?.forEach(dependency => {
    demandedKeys.add(dependency.key);
  });

  materializedBlok.agentMappings.forEach(mapping => {
    demandedKeys.add(mapping.key);
  });

  return demandedKeys;
};

const AgentStateSubscription = (props: {
  dependencyKey: string;
  agentId: string;
  onStateChange: (dependencyKey: string, value: unknown) => void;
}) => {
  const {agentId, dependencyKey, onStateChange} = props;
  const {value} = useAgentStates({agentID: agentId});

  React.useEffect(() => {
    if (value == null) {
      return;
    }

    onStateChange(dependencyKey, value);

    return () => {
      onStateChange(dependencyKey, undefined);
    };
  }, [dependencyKey, onStateChange, value]);

  return null;
};

export const MaterializedBlokRenderer = (props: MaterializedBlokRendererProps) => {
  const {materializedBlok, ...rendererProps} = props;
  const [dependencyStates, setDependencyStates] = React.useState<Record<string, unknown>>({});
  const demandedDependencyKeys = React.useMemo(
    () => toDemandedDependencyKeys(materializedBlok),
    [materializedBlok],
  );
  const mappedDependencies = React.useMemo(
    () =>
      materializedBlok.agentMappings.filter(mapping =>
        demandedDependencyKeys.has(mapping.key),
      ),
    [demandedDependencyKeys, materializedBlok.agentMappings],
  );

  React.useEffect(() => {
    setDependencyStates(currentState => {
      const nextState = Object.fromEntries(
        Object.entries(currentState).filter(([key]) => demandedDependencyKeys.has(key)),
      );

      const currentKeys = Object.keys(currentState);
      const nextKeys = Object.keys(nextState);

      if (currentKeys.length === nextKeys.length) {
        return currentState;
      }

      return nextState;
    });
  }, [demandedDependencyKeys]);

  const handleStateChange = React.useCallback((dependencyKey: string, value: unknown) => {
    if (!demandedDependencyKeys.has(dependencyKey)) {
      return;
    }

    setDependencyStates(currentState => {
      if (value === undefined) {
        if (!(dependencyKey in currentState)) {
          return currentState;
        }

        const nextState = {...currentState};
        delete nextState[dependencyKey];
        return nextState;
      }

      if (currentState[dependencyKey] === value) {
        return currentState;
      }

      return {
        ...currentState,
        [dependencyKey]: value,
      };
    });
  }, [demandedDependencyKeys]);

  const state = React.useMemo(
    () => mergeMaterializedState(materializedBlok.blok.demoState, dependencyStates),
    [dependencyStates, materializedBlok.blok.demoState],
  );

  return (
    <>
      {mappedDependencies.map(mapping => (
        <AgentStateSubscription
          key={`${mapping.key}-${mapping.agent.id}`}
          dependencyKey={mapping.key}
          agentId={mapping.agent.id}
          onStateChange={handleStateChange}
        />
      ))}
      <BlokRenderer
        {...rendererProps}
        uiComponents={materializedBlok.blok.uiComponents}
        demoState={materializedBlok.blok.demoState}
        state={state}
      />
    </>
  );
};

export default MaterializedBlokRenderer;
