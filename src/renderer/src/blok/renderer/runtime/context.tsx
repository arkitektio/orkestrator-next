import * as React from 'react';
import {useStore} from 'zustand';
import {useShallow} from 'zustand/react/shallow';
import {createStore} from 'zustand/vanilla';
import type {BlokRuntimeContext, BlokRuntimeStore} from './types';

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
      pathAliases: state.pathAliases,
      invokeFunction: state.invokeFunction,
      dispatchAction: state.dispatchAction,
    })),
  );
  const [scopedStore] = React.useState(() =>
    createStore<BlokRuntimeContext>(() => ({
      ...parentState,
      pathAliases: {
        ...parentState.pathAliases,
        ...(props.pathAliases ?? {}),
      },
    })),
  );

  React.useEffect(() => {
    scopedStore.setState({
      ...parentState,
      pathAliases: {
        ...parentState.pathAliases,
        ...(props.pathAliases ?? {}),
      },
    });
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
