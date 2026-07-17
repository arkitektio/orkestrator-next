import {
  Box,
  Boxes,
  Clock,
  Hash,
  Image,
  Layers,
  LineChart,
  Waves,
  Zap,
  type LucideIcon
} from 'lucide-react'
import { ADatasetSpec } from './api/graphql'

/**
 * The presentable form of ADatasetSpec — what a dataset structurally IS, derived
 * server-side from the axes of its intrinsic coordinate system. One entry per
 * enum member, and the single source for both the sidebar sections and the
 * filtered list pages behind them.
 *
 * `kind` mirrors the schema's own split, and is not cosmetic: a dataset carries
 * exactly one SPATIAL spec (by its SPACE axis count) plus a MODIFIER per
 * acquisition axis present. So two spatial specs together match nothing, while
 * modifiers stack — VOLUME + TIMESERIES + MULTICHANNEL is one 3D timelapse.
 */
export type ADatasetSpecKind = 'spatial' | 'modifier'

export type ADatasetSpecEntry = {
  spec: ADatasetSpec
  /** URL segment under /mikro/adatasets/spec/. */
  slug: string
  /** Plural, for a section listing many. */
  label: string
  /** Lowercase, for a badge on a card. */
  short: string
  description: string
  icon: LucideIcon
  kind: ADatasetSpecKind
  /**
   * How many SPACE axes this spatial spec denotes. Undefined for a modifier, and
   * for HYPERVOLUME — "four or more" does not pin a number. Usable to split a
   * shape because RFC-5 orders axes time → channel/custom → space, so the
   * spatial axes are always the trailing `spatialRank` of them.
   */
  spatialRank?: number
}

/** Spatial first, in ascending rank, then the modifiers — the reading order the
 *  schema's own docs use, and the order the sidebar renders. */
export const ADATASET_SPECS: readonly ADatasetSpecEntry[] = [
  {
    spec: ADatasetSpec.Scalar,
    slug: 'scalar',
    short: 'scalar',
    label: 'Scalars',
    description: 'Datasets with no spatial extent: the array carries no SPACE axis at all.',
    icon: Hash,
    kind: 'spatial',
    spatialRank: 0
  },
  {
    spec: ADatasetSpec.Profile,
    slug: 'profile',
    short: 'profile',
    label: 'Profiles',
    description: 'Datasets with one spatial axis — a line profile, a depth trace.',
    icon: LineChart,
    kind: 'spatial',
    spatialRank: 1
  },
  {
    spec: ADatasetSpec.Image,
    slug: 'image',
    short: '2d',
    label: 'Images',
    description: 'Datasets with two spatial axes: a plane. The ordinary micrograph.',
    icon: Image,
    kind: 'spatial',
    spatialRank: 2
  },
  {
    spec: ADatasetSpec.Volume,
    slug: 'volume',
    short: '3d',
    label: 'Volumes',
    description:
      'Datasets with three spatial axes: a stack. Holds whenever a z axis is present, even if it carries a single plane.',
    icon: Box,
    kind: 'spatial',
    spatialRank: 3
  },
  {
    spec: ADatasetSpec.Hypervolume,
    slug: 'hypervolume',
    short: 'nd',
    label: 'Hypervolumes',
    description: 'Datasets with four or more spatial axes.',
    icon: Boxes,
    kind: 'spatial'
  },
  {
    spec: ADatasetSpec.Multichannel,
    slug: 'multichannel',
    short: 'multichannel',
    label: 'Multichannel',
    description:
      'Datasets carrying a CHANNEL axis. Presence only: a one-channel axis still counts.',
    icon: Layers,
    kind: 'modifier'
  },
  {
    spec: ADatasetSpec.Timeseries,
    slug: 'timeseries',
    short: 'timeseries',
    label: 'Timeseries',
    description:
      'Datasets carrying a TIME axis — a timelapse. Presence only: a single-frame time axis still counts.',
    icon: Clock,
    kind: 'modifier'
  },
  {
    spec: ADatasetSpec.Spectral,
    slug: 'spectral',
    short: 'spectral',
    label: 'Spectral',
    description:
      'Datasets carrying a SPECTRUM axis: a spectrally resolved acquisition, a lambda stack.',
    icon: Waves,
    kind: 'modifier'
  },
  {
    spec: ADatasetSpec.Flim,
    slug: 'flim',
    short: 'flim',
    label: 'FLIM',
    description: 'Datasets carrying a MICROTIME axis: fluorescence-lifetime arrival-time bins.',
    icon: Zap,
    kind: 'modifier'
  }
]

export const ADATASET_SPEC_BY_SLUG: Record<string, ADatasetSpecEntry> = Object.fromEntries(
  ADATASET_SPECS.map((entry) => [entry.slug, entry])
)

export const adatasetSpecLink = (slug: string) => `/mikro/adatasets/spec/${slug}`

export const ADATASET_SPEC_INFO = Object.fromEntries(
  ADATASET_SPECS.map((entry) => [entry.spec, entry])
) as Record<ADatasetSpec, ADatasetSpecEntry>

/**
 * The single spatial spec a dataset carries. Undefined only while its intrinsic
 * system does not exist yet — `spec` is empty then, and nothing structural is
 * known about it.
 */
export const spatialSpecOf = (specs: readonly ADatasetSpec[] | undefined) =>
  specs?.map((spec) => ADATASET_SPEC_INFO[spec]).find((entry) => entry?.kind === 'spatial')

/** The acquisition modifiers a dataset carries, in catalogue order. */
export const modifierSpecsOf = (specs: readonly ADatasetSpec[] | undefined) =>
  ADATASET_SPECS.filter((entry) => entry.kind === 'modifier' && specs?.includes(entry.spec))

export type ADatasetAxis = { name: string; extent: number }

/**
 * Splits a shape into its acquisition axes and its spatial ones, using the
 * spatial spec's rank. Safe because RFC-5 pins the axis order (time, then
 * channel and custom, then space), so the spatial axes are the trailing ones.
 *
 * Falls back to treating every axis as spatial when the rank is unknown (a
 * HYPERVOLUME, or a dataset with no spec yet) or when the shape is shorter than
 * the rank claims — better to show the axes plainly than to split them wrongly.
 */
export const splitAxesBySpec = (
  axisNames: readonly string[],
  shape: readonly number[],
  specs: readonly ADatasetSpec[] | undefined
): { acquisition: ADatasetAxis[]; spatial: ADatasetAxis[] } => {
  const axes: ADatasetAxis[] = shape.map((extent, index) => ({
    name: axisNames[index] ?? '?',
    extent
  }))

  const rank = spatialSpecOf(specs)?.spatialRank
  if (rank === undefined || rank > axes.length) {
    return { acquisition: [], spatial: axes }
  }

  const boundary = axes.length - rank
  return { acquisition: axes.slice(0, boundary), spatial: axes.slice(boundary) }
}
