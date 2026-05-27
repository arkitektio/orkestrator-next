import * as React from 'react';
import {useStore} from 'zustand';
import {useShallow} from 'zustand/react/shallow';
import {createStore} from 'zustand/vanilla';
import {isRecord, splitPathSegments} from './utils';
import type {
  BlokAgentMappingStateUpdates,
  BlokDispatchActionHandler,
  BlokInvokeFunctionHandler,
  BlokRuntimeContext,
  BlokRuntimeStore,
} from './types';

const defaultInvokeFunction: BlokInvokeFunctionHandler = () => undefined;
const defaultDispatchAction: BlokDispatchActionHandler = () => undefined;

const isNumericPathSegment = (segment: string): boolean => /^\d+$/.test(segment);

const clonePathContainer = (value: unknown, nextSegment?: string): unknown[] | Record<string, unknown> => {
  if (Array.isArray(value)) {
    return [...value];
  }

  if (isRecord(value)) {
    return {...value};
  }

  return isNumericPathSegment(nextSegment ?? '') ? [] : {};
};

const applyRuntimeValueAtPath = (dataModel: unknown, path: string, value: unknown): unknown => {
  const segments = splitPathSegments(path);

  if (segments.length === 0) {
    return value;
  }

  const root = clonePathContainer(dataModel, segments[0]);
  let currentTarget: unknown[] | Record<string, unknown> = root;
  let currentSource: unknown = dataModel;

  segments.forEach((segment, index) => {
    const isLeaf = index === segments.length - 1;
    const key: number | string = isNumericPathSegment(segment) ? Number(segment) : segment;

    if (isLeaf) {
      currentTarget[key] = value;
      return;
    }

    const nextSegment = segments[index + 1];
    const sourceChild =
      Array.isArray(currentSource) || isRecord(currentSource)
        ? currentSource[key]
        : undefined;
    const nextTarget = clonePathContainer(sourceChild, nextSegment);

    currentTarget[key] = nextTarget;
    currentTarget = nextTarget;
    currentSource = sourceChild;
  });

  return root;
};

const composeRuntimeDataModel = (
  initialDataModel: unknown,
  runtimePathValues: Record<string, unknown>,
): unknown => {
  return Object.entries(runtimePathValues).reduce(
    (currentDataModel, [path, value]) => applyRuntimeValueAtPath(currentDataModel, path, value),
    initialDataModel,
  );
};

export const createBlokRuntimeStore = (config?: {
  initialDataModel?: unknown;
  agentMappingStateUpdates?: BlokAgentMappingStateUpdates;
  pathAliases?: Record<string, string>;
  invokeFunction?: BlokInvokeFunctionHandler;
  dispatchAction?: BlokDispatchActionHandler;
}): BlokRuntimeStore => {
  const initialDataModel = config?.initialDataModel;
  const initialAgentMappingStateUpdates = config?.agentMappingStateUpdates ?? {};
  const initialPathAliases = config?.pathAliases ?? {};
  const invokeFunction = config?.invokeFunction ?? defaultInvokeFunction;
  const dispatchAction = config?.dispatchAction ?? defaultDispatchAction;

  return createStore<BlokRuntimeContext>(set => ({
    initialDataModel,
    dataModel: initialDataModel,
    runtimePathValues: {},
    agentMappingStateUpdates: initialAgentMappingStateUpdates,
    pathAliases: initialPathAliases,
    invokeFunction,
    dispatchAction,
    setInitialDataModel: nextInitialDataModel => {
      set(currentState => ({
        initialDataModel: nextInitialDataModel,
        dataModel: composeRuntimeDataModel(nextInitialDataModel, currentState.runtimePathValues),
      }));
    },
    setRuntimeValue: (path, value) => {
      set(currentState => {
        const nextRuntimePathValues = {
          ...currentState.runtimePathValues,
          [path]: value,
        };

        return {
          runtimePathValues: nextRuntimePathValues,
          dataModel: composeRuntimeDataModel(currentState.initialDataModel, nextRuntimePathValues),
        };
      });
    },
    clearRuntimeValue: path => {
      set(currentState => {
        if (!(path in currentState.runtimePathValues)) {
          return currentState;
        }

        const nextRuntimePathValues = {...currentState.runtimePathValues};
        delete nextRuntimePathValues[path];

        return {
          runtimePathValues: nextRuntimePathValues,
          dataModel: composeRuntimeDataModel(currentState.initialDataModel, nextRuntimePathValues),
        };
      });
    },
    setAgentMappingStateUpdates: nextAgentMappingStateUpdates => {
      set({agentMappingStateUpdates: nextAgentMappingStateUpdates});
    },
    setAgentMappingStateUpdate: (mappingKey, agentId, stateInterface, value, revision) => {
      set(currentState => ({
        agentMappingStateUpdates: {
          ...currentState.agentMappingStateUpdates,
          [mappingKey]: {
            agentId,
            interfaces: {
              ...(currentState.agentMappingStateUpdates[mappingKey]?.interfaces ?? {}),
              [stateInterface]: {
                value,
                revision,
              },
            },
          },
        },
      }));
    },
    clearAgentMappingStateUpdate: (mappingKey, stateInterface) => {
      set(currentState => {
        const currentMapping = currentState.agentMappingStateUpdates[mappingKey];

        if (!currentMapping || !(stateInterface in currentMapping.interfaces)) {
          return currentState;
        }

        const nextInterfaces = {...currentMapping.interfaces};
        delete nextInterfaces[stateInterface];

        const nextAgentMappingStateUpdates = {...currentState.agentMappingStateUpdates};

        if (Object.keys(nextInterfaces).length === 0) {
          delete nextAgentMappingStateUpdates[mappingKey];
        } else {
          nextAgentMappingStateUpdates[mappingKey] = {
            ...currentMapping,
            interfaces: nextInterfaces,
          };
        }

        return {
          agentMappingStateUpdates: nextAgentMappingStateUpdates,
        };
      });
    },
    setPathAliases: nextPathAliases => {
      set({pathAliases: nextPathAliases});
    },
    setInvokeFunction: nextInvokeFunction => {
      set({invokeFunction: nextInvokeFunction});
    },
    setDispatchAction: nextDispatchAction => {
      set({dispatchAction: nextDispatchAction});
    },
  }));
};

const BlokRuntimeStoreContext = React.createContext<BlokRuntimeStore | null>(null);

export const BlokRuntimeProvider = (
  props: {store: BlokRuntimeStore; children: React.ReactNode},
) => {
  return (
    <BlokRuntimeStoreContext.Provider value={props.store}>
      {props.children}
    </BlokRuntimeStoreContext.Provider>
  );
};

export const useBlokRuntimeStoreApi = (): BlokRuntimeStore => {
  const store = React.useContext(BlokRuntimeStoreContext);
  if (!store) {
    throw new Error('useBlokRuntime must be used within a BlokRuntimeProvider');
  }

  return store;
};

export const ScopedBlokRuntimeProvider = (props: {
  pathAliases?: Record<string, string>;
  children: React.ReactNode;
}) => {
  const parentStore = useBlokRuntimeStoreApi();
  const parentState = useStore(
    parentStore,
    useShallow(state => ({
      dataModel: state.dataModel,
      agentMappingStateUpdates: state.agentMappingStateUpdates,
      pathAliases: state.pathAliases,
      invokeFunction: state.invokeFunction,
      dispatchAction: state.dispatchAction,
    })),
  );
  const [scopedStore] = React.useState(() =>
    createBlokRuntimeStore({
      initialDataModel: parentState.dataModel,
      agentMappingStateUpdates: parentState.agentMappingStateUpdates,
      pathAliases: {
        ...parentState.pathAliases,
        ...(props.pathAliases ?? {}),
      },
      invokeFunction: parentState.invokeFunction,
      dispatchAction: parentState.dispatchAction,
    }),
  );

  React.useEffect(() => {
    const scopedState = scopedStore.getState();
    scopedState.setInitialDataModel(parentState.dataModel);
    scopedState.setAgentMappingStateUpdates(parentState.agentMappingStateUpdates);
    scopedState.setPathAliases({
      ...parentState.pathAliases,
      ...(props.pathAliases ?? {}),
    });
    scopedState.setInvokeFunction(parentState.invokeFunction);
    scopedState.setDispatchAction(parentState.dispatchAction);
  }, [parentState, props.pathAliases, scopedStore]);

  return (
    <BlokRuntimeStoreContext.Provider value={scopedStore}>
      {props.children}
    </BlokRuntimeStoreContext.Provider>
  );
};

export const useBlokRuntime = <T,>(selector: (state: BlokRuntimeContext) => T): T => {
  const store = useBlokRuntimeStoreApi();
  return useStore(store, selector);
};
