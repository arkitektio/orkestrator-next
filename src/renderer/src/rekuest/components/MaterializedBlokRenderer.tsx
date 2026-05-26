import * as React from 'react';
import BlokRenderer from '@/blok/renderer/BlokRenderer';
import type {MaterializedBlokQuery} from '@/rekuest/api/graphql';
import {useAgentStates} from '@/rekuest/hooks/useLiveState';

type MaterializedBlokData = MaterializedBlokQuery['materializedBlok'];

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

  const handleStateChange = React.useCallback((dependencyKey: string, value: unknown) => {
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
  }, []);

  const state = React.useMemo(
    () => mergeMaterializedState(materializedBlok.blok.demoState, dependencyStates),
    [dependencyStates, materializedBlok.blok.demoState],
  );

  return (
    <>
      {materializedBlok.agentMappings.map(mapping => (
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
