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

/**
 * A shape as it gets read aloud: `1024x 1024y 5z` — each extent glued to the
 * axis it runs along. Two parallel lists (`x × y × z` over `1024, 1024, 5`) say
 * the same thing but make the reader pair them up by counting, which is exactly
 * the work a label should have already done.
 *
 * Driven by `shape`, so a dataset whose axis names are short of its rank still
 * shows every extent (with `?` for the axis nobody named).
 */
export const formatShape = (
  axisNames: readonly string[],
  shape: readonly number[]
): string => shape.map((extent, index) => `${extent}${axisNames[index] ?? '?'}`).join(' ')

/**
 * The dtype the dataset is stored in, off the base level — a multiscale
 * pyramid's levels are the same array at different resolutions, so they share
 * one. `level` is a field, not a position, and the API does not promise the
 * arrays come back in order, so this looks level 0 up rather than taking
 * `[0]`; the first array is only the fallback for a set that has no level 0.
 */
export const baseDtypeOf = (
  dataArrays: readonly { level: number; store: { dtype?: string | null } }[]
): string | undefined =>
  (dataArrays.find((array) => array.level === 0) ?? dataArrays[0])?.store.dtype ?? undefined

/**
 * Storage bytes per element of a zarr dtype name (`uint8`, `float64`, …), read
 * off the bit width in the name so `int64` and `complex128` work without being
 * enumerated. `bool` stores one byte per element. Undefined for a name that
 * does not carry its width — the callers treat that as "size unknown" rather
 * than guessing.
 */
export const dtypeBytes = (dtype: string | null | undefined): number | undefined => {
  if (!dtype) return undefined
  if (dtype === 'bool') return 1
  const bits = /^(?:u?int|float|complex)(\d+)$/.exec(dtype)?.[1]
  return bits ? Number(bits) / 8 : undefined
}

type SizedArray = { shape: readonly number[]; store: { dtype?: string | null } }

/** Uncompressed bytes of one array: element count × dtype width. */
export const arrayNbytes = (array: SizedArray): number | undefined => {
  const width = dtypeBytes(array.store.dtype)
  if (width === undefined) return undefined
  return array.shape.reduce((total, extent) => total * extent, 1) * width
}

/**
 * Uncompressed bytes across every pyramid level — what the dataset costs to
 * hold, not what zarr's compression left on disk (the store does not report
 * that). Undefined as soon as ANY level's dtype is unreadable: a partial sum
 * shown as "the size" would be a plausible wrong number, which is worse than
 * no number.
 */
export const datasetNbytes = (dataArrays: readonly SizedArray[]): number | undefined => {
  let total = 0
  for (const array of dataArrays) {
    const nbytes = arrayNbytes(array)
    if (nbytes === undefined) return undefined
    total += nbytes
  }
  return dataArrays.length > 0 ? total : undefined
}

/** `1.5 GB`-style rendering, binary-1024 steps like the file pages use. */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(k)))
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${units[i]}`
}
