import { asDetailQueryRoute } from '@/app/routes/DetailQueryRoute'
import { Sidebars } from "@/components/layout/Sidebars";
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { MikroADataset, MikroCoordinateSystem } from '@/linkers'
import { useState } from 'react'
import {
  GetADatasetQuery,
  useGetADatasetQuery,
  useGetSceneQuery
} from '../api/graphql'
import {
  CreateSceneControl,
  DatasetBackdrop
} from '../components/adataset/DatasetBackdrop'
import { Scene } from '../components/scene/Scene'

type PageDataset = GetADatasetQuery['adataset']

/**
 * The dataset's own panel: which scene is on screen, and what the dataset behind
 * it is. Composed into the scene's column above the renderer's own panels, and
 * styled to match them — it folds away with them, so there is no second collapse
 * control to find.
 */
const DatasetPanel = ({
  dataset,
  activeSceneId,
  onSelectScene,
  sceneLoading
}: {
  dataset: PageDataset
  activeSceneId: string | undefined
  onSelectScene: (id: string) => void
  sceneLoading: boolean
}) => {
  return (
    <div className="pointer-events-auto flex flex-col gap-2 rounded-lg border border-black/10 bg-black/40 p-2 backdrop-blur-md">
      {/* Scene switcher, mirroring SceneOverlay's display-toggle row. */}
      {dataset.scenes.length > 0 ? (
        <Select value={activeSceneId} onValueChange={onSelectScene}>
          <SelectTrigger className="h-7 w-full bg-black">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dataset.scenes.map((scene) => (
              <SelectItem key={scene.id} value={scene.id}>
                {scene.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <span className="truncate text-xs text-muted-foreground">No scenes yet</span>
      )}

      <div className="flex max-h-64 flex-col gap-3 overflow-y-auto">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <MikroADataset.DetailLink object={dataset} className="truncate text-sm">
              {dataset.name}
            </MikroADataset.DetailLink>
            {dataset.multiscale && (
              <Badge variant="outline" className="text-[0.625rem]">
                multiscale
              </Badge>
            )}
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {dataset.axisNames.join(' × ')} ({dataset.shape.join(', ')})
          </div>
          {sceneLoading && <div className="text-xs text-muted-foreground">Loading scene…</div>}
        </div>

        {dataset.intrinsicSystem && (
          <div className="flex flex-col gap-0.5">
            <div className="text-xs font-semibold">Intrinsic system</div>
            <MikroCoordinateSystem.DetailLink
              object={dataset.intrinsicSystem}
              className="truncate text-xs"
            >
              {dataset.intrinsicSystem.name}
            </MikroCoordinateSystem.DetailLink>
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          <div className="text-xs font-semibold">Data arrays</div>
          {[...dataset.dataArrays]
            .sort((a, b) => a.level - b.level)
            .map((array) => (
              <div key={array.id} className="flex flex-row gap-2 font-mono text-[0.625rem]">
                <span className="text-muted-foreground">L{array.level}</span>
                <span>{array.shape.join(' × ')}</span>
                <span className="text-muted-foreground">/ {array.chunkShape.join(' × ')}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export const ADatasetPage = asDetailQueryRoute(useGetADatasetQuery, ({ data }) => {
  const dataset = data.adataset
  const [selectedSceneId, setSelectedSceneId] = useState<string>()

  // The first scene is the one to land in: a bootstrapped dataset has exactly
  // one, so the common case needs no choice at all.
  const activeSceneId = selectedSceneId ?? dataset.scenes.at(0)?.id

  // The dataset only carries ListScene (id + name) for the switcher — the
  // renderer needs layers and the world, so the active scene is fetched in
  // full the same way ScenePage does. Apollo caches it, so switching back
  // is free.
  const { data: sceneData, loading: sceneLoading } = useGetSceneQuery({
    variables: { id: activeSceneId as string },
    skip: !activeSceneId
  })

  const datasetPanel = (
    <DatasetPanel
      dataset={dataset}
      activeSceneId={activeSceneId}
      onSelectScene={setSelectedSceneId}
      sceneLoading={sceneLoading}
    />
  )

  return (
    // The provider wraps the WHOLE ModelPage so the Layers sidebar tab (a
    // sibling panel of the content area) reaches the scene stores. Null scene
    // = "no scene selected"; the tab says so instead of listing layers.
    <Scene.Provider scene={sceneData?.scene ?? null}>
    <MikroADataset.ModelPage
      object={dataset}
      title={dataset.name}
      variant="black"
      overlay
      actions={<MikroADataset.Actions object={dataset} />}
      additionalSidebars={<Sidebars.Tab label="Layers"><Scene.LayersSidebar /></Sidebars.Tab>}
      defaultSidebar="Layers"
      sidebarKey="SceneDetail"
      // Only while a scene is on screen: with none, the create action is the
      // centered call in the backdrop, and a second copy up here would be two
      // buttons for one decision.
      pageActions={
        sceneData?.scene ? (
          <CreateSceneControl dataset={dataset} size="sm" variant="outline" />
        ) : undefined
      }
    >
      <div className="relative h-full w-full">
        {/* Keyed on the scene id: the renderer builds its stores per scene, so
              switching scenes must remount rather than feed a new scene into
              components primed for the old one. */}
        {sceneData?.scene ? (
          // The default stack plus one panel of our own — the whole reason
          // the viewport takes children rather than a slot per caller.
          <Scene.Viewport key={sceneData.scene.id}>
            <Scene.Column>
              <Scene.Trigger />
              <Scene.Panels>
                {datasetPanel}
                <Scene.Controls />
              </Scene.Panels>
            </Scene.Column>
            <Scene.Dock side="right">
              <Scene.ZSlider />
            </Scene.Dock>
            <Scene.Dock side="bottom">
              <Scene.DimSliders />
            </Scene.Dock>
          </Scene.Viewport>
        ) : (
          // With no scene there is no renderer to host the column, so the
          // panel is placed here instead — same geometry as Scene.Column's.
          <>
            {activeSceneId ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading scene…</div>
              </div>
            ) : (
              <DatasetBackdrop dataset={dataset} />
            )}
            <div className="pointer-events-none absolute left-3 top-3 z-30 flex w-72 flex-col gap-2">
              {datasetPanel}
            </div>
          </>
        )}
      </div>
    </MikroADataset.ModelPage>
    </Scene.Provider>
  )
})

export default ADatasetPage
