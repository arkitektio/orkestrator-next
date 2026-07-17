import { Badge } from '@/components/ui/badge'
import { Card, CardTitle } from '@/components/ui/card'
import { MikroADataset } from '@/linkers'
import { Grid3x3 } from 'lucide-react'
import { ListADatasetFragment } from '../../api/graphql'
import { modifierSpecsOf, spatialSpecOf, splitAxesBySpec, type ADatasetAxis } from '../../specs'

interface Props {
  /** Named `item` because createList passes items in under that name. */
  item: ListADatasetFragment
}

/** `512 y` — extent leads, axis name annotates it. */
const AxisChip = ({ axis, muted }: { axis: ADatasetAxis; muted?: boolean }) => (
  <span className="flex items-baseline gap-0.5">
    <span
      className={
        muted
          ? 'text-xs font-medium tabular-nums text-muted-foreground'
          : 'text-base font-semibold tabular-nums'
      }
    >
      {axis.extent}
    </span>
    <span className="text-[10px] font-light uppercase text-muted-foreground">{axis.name}</span>
  </span>
)

/**
 * Leads with what the dataset structurally IS (its spatial spec), then its
 * spatial extent, then everything stacked on top of it. The spec drives the
 * split: the acquisition axes (t, c, …) are demoted to a second row rather than
 * run together with the spatial ones, which is what made the old single
 * `t × c × z × y × x (1, 3, 8, 512, 512)` line unreadable.
 */
const TheCard = ({ item: adataset }: Props) => {
  const spatial = spatialSpecOf(adataset.spec)
  const modifiers = modifierSpecsOf(adataset.spec)
  const axes = splitAxesBySpec(adataset.axisNames, adataset.shape, adataset.spec)

  const Icon = spatial?.icon ?? Grid3x3

  return (
    <MikroADataset.Smart object={adataset}>
      <Card className="aspect-[5/3] flex flex-col justify-between gap-2 px-3 py-2">
        <div className="flex min-w-0 flex-row items-start gap-2">
          <Icon
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
            aria-label={spatial?.label}
          />
          <CardTitle className="min-w-0 break-words text-sm leading-tight line-clamp-2">
            <MikroADataset.DetailLink object={adataset}>{adataset.name}</MikroADataset.DetailLink>
          </CardTitle>
        </div>

        <div className="flex flex-col gap-1">
          {/* A SCALAR has no spatial row at all — the point of the spec is that
              there is no extent to show, so say that rather than print "()". */}
          {axes.spatial.length > 0 ? (
            <div className="flex flex-row flex-wrap items-baseline gap-x-2">
              {axes.spatial.map((axis, index) => (
                <AxisChip key={index} axis={axis} />
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">no spatial extent</span>
          )}

          <div className="flex flex-row flex-wrap items-center gap-x-2 gap-y-1">
            {axes.acquisition.map((axis, index) => (
              <AxisChip key={index} axis={axis} muted />
            ))}
            {modifiers.map((modifier) => (
              <Badge
                key={modifier.spec}
                variant="secondary"
                className="px-1 py-0 text-[10px] font-normal"
              >
                {modifier.short}
              </Badge>
            ))}
            {adataset.multiscale && (
              <Badge variant="outline" className="px-1 py-0 text-[10px] font-normal">
                multiscale
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </MikroADataset.Smart>
  )
}

export default TheCard
