import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { SceneFragment } from '@/mikro-next/api/graphql';
import {
  createSelectionStore,
  SelectionStoreContext,
} from './selectionStore';
import {
  createKubeStateStore,
  KubeStateStoreContext,
} from './kubeStateStore';
import { createKubeStore, KubeStoreContext } from './kubeStore';
import { createModeStore, ModeStoreContext } from './modeStore';
import {
  createSceneStore,
  SceneStoreContext,
} from './sceneStore';
import { createTimeStore, TimeStoreContext } from './timeStore';
import { createViewStore, ViewStoreContext } from './viewStore';
import { createViewerStoreSync, ViewerStoreContext } from './viewerStore';

const EMPTY_SCENE = {
  spatialUnit: 'px',
  layers: [],
} as unknown as SceneFragment;

export interface LocalStoreBundle {
  modeStore: ReturnType<typeof createModeStore>;
  viewStore: ReturnType<typeof createViewStore>;
  viewerStore: ReturnType<typeof createViewerStoreSync>;
  sceneStore: ReturnType<typeof createSceneStore>;
  kubeStore: ReturnType<typeof createKubeStore>;
  kubeStateStore: ReturnType<typeof createKubeStateStore>;
  selectionStore: ReturnType<typeof createSelectionStore>;
  timeStore: ReturnType<typeof createTimeStore>;
}

const createLocalStoreBundle = (): LocalStoreBundle => ({
  modeStore: createModeStore(),
  viewStore: createViewStore(),
  viewerStore: createViewerStoreSync(),
  sceneStore: createSceneStore({ scene: EMPTY_SCENE }),
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
          <SceneStoreContext.Provider value={stores.sceneStore}>
            <KubeStoreContext.Provider value={stores.kubeStore}>
              <KubeStateStoreContext.Provider value={stores.kubeStateStore}>
                <SelectionStoreContext.Provider value={stores.selectionStore}>
                  <TimeStoreContext.Provider value={stores.timeStore}>
                    {children}
                  </TimeStoreContext.Provider>
                </SelectionStoreContext.Provider>
              </KubeStateStoreContext.Provider>
            </KubeStoreContext.Provider>
          </SceneStoreContext.Provider>
        </ViewerStoreContext.Provider>
      </ViewStoreContext.Provider>
    </ModeStoreContext.Provider>
  );
}

export const StoreProvider = LocalStoreProvider;
export type AppStoreBundle = LocalStoreBundle;
export type StoreProviderProps = LocalStoreProviderProps;
