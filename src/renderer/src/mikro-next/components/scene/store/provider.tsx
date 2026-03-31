import type { ReactNode } from 'react';
import { useMemo } from 'react';
import {
  createSelectionStore,
  SelectionStoreContext,
} from './layerStore';
import {
  createKubeStateStore,
  KubeStateStoreContext,
} from './kubeStateStore';
import { createKubeStore, KubeStoreContext } from './kubeStore';
import { createModeStore, ModeStoreContext } from './modeStore';
import {
  createScansStore,
  ScansStoreContext,
} from './sceneStore';
import { createTimeStore, TimeStoreContext } from './timeStore';
import { createViewStore, ViewStoreContext } from './viewStore';
import { createViewerStore, ViewerStoreContext } from './viewerStore';

export interface LocalStoreBundle {
  modeStore: ReturnType<typeof createModeStore>;
  viewStore: ReturnType<typeof createViewStore>;
  viewerStore: ReturnType<typeof createViewerStore>;
  scansStore: ReturnType<typeof createScansStore>;
  kubeStore: ReturnType<typeof createKubeStore>;
  kubeStateStore: ReturnType<typeof createKubeStateStore>;
  selectionStore: ReturnType<typeof createSelectionStore>;
  timeStore: ReturnType<typeof createTimeStore>;
}

const createLocalStoreBundle = (): LocalStoreBundle => ({
  modeStore: createModeStore(),
  viewStore: createViewStore(),
  viewerStore: createViewerStore(),
  scansStore: createScansStore(),
  kubeStore: createKubeStore(),
  kubeStateStore: createKubeStateStore(),
  selectionStore: createSelectionStore(),
  timeStore: createTimeStore(),
});

const scopedBundles = new Map<string, LocalStoreBundle>();

const getScopedBundle = (scope: string): LocalStoreBundle => {
  const existingBundle = scopedBundles.get(scope);

  if (existingBundle) {
    return existingBundle;
  }

  const nextBundle = createLocalStoreBundle();
  scopedBundles.set(scope, nextBundle);
  return nextBundle;
};

export interface LocalStoreProviderProps {
  children: ReactNode;
  scope?: string;
}

export function LocalStoreProvider({
  children,
  scope = 'default',
}: LocalStoreProviderProps) {
  const stores = useMemo(() => getScopedBundle(scope), [scope]);

  return (
    <ModeStoreContext.Provider value={stores.modeStore}>
      <ViewStoreContext.Provider value={stores.viewStore}>
        <ViewerStoreContext.Provider value={stores.viewerStore}>
          <ScansStoreContext.Provider value={stores.scansStore}>
            <KubeStoreContext.Provider value={stores.kubeStore}>
              <KubeStateStoreContext.Provider value={stores.kubeStateStore}>
                <SelectionStoreContext.Provider value={stores.selectionStore}>
                  <TimeStoreContext.Provider value={stores.timeStore}>
                    {children}
                  </TimeStoreContext.Provider>
                </SelectionStoreContext.Provider>
              </KubeStateStoreContext.Provider>
            </KubeStoreContext.Provider>
          </ScansStoreContext.Provider>
        </ViewerStoreContext.Provider>
      </ViewStoreContext.Provider>
    </ModeStoreContext.Provider>
  );
}

export const StoreProvider = LocalStoreProvider;
export type AppStoreBundle = LocalStoreBundle;
export type StoreProviderProps = LocalStoreProviderProps;
