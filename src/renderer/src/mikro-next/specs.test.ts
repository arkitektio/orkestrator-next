// @vitest-environment jsdom
// (ADatasetSpec is a runtime enum, and importing the generated `graphql.ts`
// pulls in the Apollo hooks barrel, which touches `window` on load)
import { describe, expect, it } from 'vitest'
import { ADatasetSpec } from './api/graphql'
import {
  ADATASET_SPECS,
  baseDtypeOf,
  formatShape,
  modifierSpecsOf,
  spatialSpecOf,
  splitAxesBySpec
} from './specs'

describe('the spec catalogue', () => {
  it('covers every enum member exactly once', () => {
    const covered = ADATASET_SPECS.map((entry) => entry.spec).sort()
    expect(covered).toEqual(Object.values(ADatasetSpec).sort())
  })

  it('gives every spec a unique slug', () => {
    const slugs = ADATASET_SPECS.map((entry) => entry.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('puts a spatialRank only on spatial specs, and never on HYPERVOLUME', () => {
    for (const entry of ADATASET_SPECS) {
      if (entry.kind === 'modifier') expect(entry.spatialRank).toBeUndefined()
    }
    // "four or more" does not pin a number, so it must stay unranked.
    expect(spatialSpecOf([ADatasetSpec.Hypervolume])?.spatialRank).toBeUndefined()
  })
})

describe('spatialSpecOf', () => {
  it('finds the one spatial spec among stacked modifiers', () => {
    const spec = spatialSpecOf([
      ADatasetSpec.Volume,
      ADatasetSpec.Timeseries,
      ADatasetSpec.Multichannel
    ])
    expect(spec?.spec).toBe(ADatasetSpec.Volume)
  })

  it('is undefined for a dataset with no spec yet', () => {
    expect(spatialSpecOf([])).toBeUndefined()
    expect(spatialSpecOf(undefined)).toBeUndefined()
  })
})

describe('modifierSpecsOf', () => {
  it('returns modifiers in catalogue order, never the spatial spec', () => {
    const modifiers = modifierSpecsOf([
      ADatasetSpec.Timeseries,
      ADatasetSpec.Volume,
      ADatasetSpec.Multichannel
    ]).map((entry) => entry.spec)
    expect(modifiers).toEqual([ADatasetSpec.Multichannel, ADatasetSpec.Timeseries])
  })
})

describe('splitAxesBySpec', () => {
  it('splits a 3D timelapse into acquisition and spatial axes', () => {
    const { acquisition, spatial } = splitAxesBySpec(
      ['t', 'c', 'z', 'y', 'x'],
      [20, 3, 8, 512, 512],
      [ADatasetSpec.Volume, ADatasetSpec.Timeseries, ADatasetSpec.Multichannel]
    )
    expect(acquisition).toEqual([
      { name: 't', extent: 20 },
      { name: 'c', extent: 3 }
    ])
    expect(spatial).toEqual([
      { name: 'z', extent: 8 },
      { name: 'y', extent: 512 },
      { name: 'x', extent: 512 }
    ])
  })

  it('treats a plain image as all-spatial', () => {
    const { acquisition, spatial } = splitAxesBySpec(['y', 'x'], [512, 512], [ADatasetSpec.Image])
    expect(acquisition).toEqual([])
    expect(spatial).toHaveLength(2)
  })

  it('gives a SCALAR no spatial axes', () => {
    const { acquisition, spatial } = splitAxesBySpec(
      ['t'],
      [100],
      [ADatasetSpec.Scalar, ADatasetSpec.Timeseries]
    )
    expect(spatial).toEqual([])
    expect(acquisition).toEqual([{ name: 't', extent: 100 }])
  })

  it('falls back to all-spatial when the rank is unknown', () => {
    const { acquisition, spatial } = splitAxesBySpec(
      ['a', 'b', 'c', 'd', 'e'],
      [1, 2, 3, 4, 5],
      [ADatasetSpec.Hypervolume]
    )
    expect(acquisition).toEqual([])
    expect(spatial).toHaveLength(5)
  })

  it('falls back rather than split wrongly when the shape is shorter than the rank', () => {
    // A VOLUME claims 3 spatial axes; a 2-axis shape contradicts that, and
    // slicing at a negative boundary would silently mangle the readout.
    const { acquisition, spatial } = splitAxesBySpec(['y', 'x'], [512, 512], [ADatasetSpec.Volume])
    expect(acquisition).toEqual([])
    expect(spatial).toHaveLength(2)
  })

  it("names an axis '?' when axisNames is shorter than shape", () => {
    const { spatial } = splitAxesBySpec(['y'], [512, 512], [ADatasetSpec.Image])
    expect(spatial.map((axis) => axis.name)).toEqual(['y', '?'])
  })
})

describe('formatShape', () => {
  it('glues each extent to its axis', () => {
    expect(formatShape(['x', 'y', 'z'], [1024, 1024, 5])).toBe('1024x 1024y 5z')
  })

  it("marks an extent '?' when axisNames is shorter than shape", () => {
    expect(formatShape(['y'], [512, 512])).toBe('512y 512?')
  })

  it('ignores axis names the shape does not reach', () => {
    expect(formatShape(['t', 'y', 'x'], [512, 512])).toBe('512t 512y')
  })

  it('is empty for a scalar with no axes', () => {
    expect(formatShape([], [])).toBe('')
  })
})

describe('baseDtypeOf', () => {
  const level = (n: number, dtype: string | null) => ({
    level: n,
    store: { dtype }
  })

  it('reads the base level, not the first element', () => {
    expect(baseDtypeOf([level(2, 'uint8'), level(0, 'uint16')])).toBe('uint16')
  })

  it('falls back to the first array when nothing is level 0', () => {
    expect(baseDtypeOf([level(1, 'float32')])).toBe('float32')
  })

  it('is undefined for no arrays, and for an array that has no dtype', () => {
    expect(baseDtypeOf([])).toBeUndefined()
    expect(baseDtypeOf([level(0, null)])).toBeUndefined()
  })
})
