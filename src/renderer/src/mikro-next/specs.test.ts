// @vitest-environment jsdom
// (ADatasetSpec is a runtime enum, and importing the generated `graphql.ts`
// pulls in the Apollo hooks barrel, which touches `window` on load)
import { describe, expect, it } from 'vitest'
import { ADatasetSpec } from './api/graphql'
import { ADATASET_SPECS, modifierSpecsOf, spatialSpecOf, splitAxesBySpec } from './specs'

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
