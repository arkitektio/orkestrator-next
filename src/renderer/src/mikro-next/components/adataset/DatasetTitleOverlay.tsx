import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { MikroADataset } from '@/linkers'
import { GetADatasetQuery } from '../../api/graphql'
import { baseDtypeOf, formatShape } from '../../specs'

type PageDataset = GetADatasetQuery['adataset']

/**
 * What the page is *about*, said once and quietly: the dataset's name, the scene
 * currently on screen, and the shape underneath. Deliberately NOT a scene panel —
 * it is positioned by the page rather than composed into a scene panel column,
 * so it neither folds away with the renderer's chrome nor has to be duplicated
 * when there is no scene to host a column. The technical detail (arrays,
 * intrinsic system) lives in the Info sidebar tab instead.
 *
 * `z-40` clears the viewport's own overlays at `z-30`; the card opts into
 * pointer events on its own, so the canvas stays draggable all around it.
 */
export const DatasetTitleOverlay = ({
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
  const dtype = baseDtypeOf(dataset.dataArrays)

  return (
    <div className="pointer-events-auto absolute left-3 top-3 z-40 flex w-[50%] flex-col gap-2 rounded-lg ">
      {/* The name leads, at heading weight — this is the page's title, and the
          page has no other. */}
      <div className="flex flex-col gap-0.5">
        {/* `break-all`, not `truncate` or `break-words`: a dataset name is
            usually one long token with no spaces in it, so wrapping only at
            spaces would not wrap at all and an ellipsis would hide the part
            that tells them apart — the tail. Breaking mid-token shows all of
            it. */}
        <MikroADataset.DetailLink
          object={dataset}
          className="break-all text-3xl font-semibold leading-tight"
        >
          {dataset.name}
        </MikroADataset.DetailLink>
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground w-[50%]">
          <span className="truncate">{formatShape(dataset.axisNames, dataset.shape)}</span>
          {dtype && <span className="shrink-0">{dtype}</span>}
          {dataset.multiscale && (
            <Badge variant="outline" className="font-sans text-[0.625rem]">
              multiscale
            </Badge>
          )}
        </div>
      </div>

      {/* Below the title, full width: with the old panel gone this is the page's
          only way to change which scene is drawn, so it gets the room to show a
          whole scene name rather than being squeezed alongside the heading. */}
      {dataset.scenes.length > 0 ? (
        <Select value={activeSceneId} onValueChange={onSelectScene}>
          <SelectTrigger className="h-7 w-[20%] bg-black">
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

      {sceneLoading && <span className="text-xs text-muted-foreground">Loading scene…</span>}
    </div>
  )
}
