import { describe, expect, it } from 'vitest'
import { coalesceRanges } from './rangeCoalesce'

const r = (offset: number, length: number, item = `${offset}`) => ({ offset, length, item })

describe('coalesceRanges', () => {
  it('merges adjacent and near ranges within the gap, in offset order', () => {
    const out = coalesceRanges([r(200, 100), r(0, 100), r(100, 100), r(350, 50)], {
      maxGap: 64,
      maxBytes: 1 << 20,
    })
    expect(out.map((g) => [g.offset, g.length, g.items.map((i) => i.item)])).toEqual([
      [0, 400, ['0', '100', '200', '350']],
    ])
  })

  it('splits on a gap larger than maxGap', () => {
    const out = coalesceRanges([r(0, 100), r(1000, 100)], { maxGap: 64, maxBytes: 1 << 20 })
    expect(out).toHaveLength(2)
    expect(out[1]).toMatchObject({ offset: 1000, length: 100 })
  })

  it('splits when the merged span would exceed maxBytes', () => {
    const out = coalesceRanges([r(0, 600), r(600, 600), r(1200, 600)], {
      maxGap: 0,
      maxBytes: 1200,
    })
    expect(out.map((g) => g.items.length)).toEqual([2, 1])
  })

  it('handles overlapping ranges without shrinking the span', () => {
    const out = coalesceRanges([r(0, 100), r(50, 100)], { maxGap: 0, maxBytes: 1 << 20 })
    expect(out).toEqual([{ offset: 0, length: 150, items: [r(0, 100), r(50, 100)] }])
  })

  it('returns [] for no input', () => {
    expect(coalesceRanges([])).toEqual([])
  })
})
