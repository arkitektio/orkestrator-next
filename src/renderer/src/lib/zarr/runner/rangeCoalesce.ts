/**
 * Byte-range coalescing for sharded reads: several inner chunks of one shard
 * become one HTTP `Range` when they sit close together in the object. Pure.
 *
 * Rule (after zarr-python 3.3's `sharding_coalesce_*`): sort by offset, then
 * greedily extend the current run while the gap to the next range is at most
 * `maxGap` bytes and the merged span stays within `maxBytes`. Gap bytes are
 * fetched and discarded, so `maxGap` trades request count against wasted
 * bandwidth — small on S3 (billed per byte, cheap per request on HTTP/2).
 */

export interface RangeItem<T> {
  offset: number
  length: number
  item: T
}

export interface CoalescedRange<T> {
  offset: number
  length: number
  items: RangeItem<T>[]
}

export interface CoalesceOptions {
  /** Largest gap (bytes) between two ranges that is still bridged. */
  maxGap: number
  /** Largest merged span (bytes). */
  maxBytes: number
}

/** Defaults tuned for 64³ uint16 inner chunks (~0.5 MB compressed each). */
export const DEFAULT_COALESCE: CoalesceOptions = {
  maxGap: 64 * 1024,
  maxBytes: 8 * 1024 * 1024,
}

export function coalesceRanges<T>(
  items: readonly RangeItem<T>[],
  options: CoalesceOptions = DEFAULT_COALESCE,
): CoalescedRange<T>[] {
  if (items.length === 0) return []
  const sorted = [...items].sort((a, b) => a.offset - b.offset)
  const out: CoalescedRange<T>[] = []
  let current: CoalescedRange<T> = {
    offset: sorted[0].offset,
    length: sorted[0].length,
    items: [sorted[0]],
  }
  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i]
    const currentEnd = current.offset + current.length
    const nextEnd = next.offset + next.length
    const gap = next.offset - currentEnd
    const mergedLength = Math.max(currentEnd, nextEnd) - current.offset
    if (gap <= options.maxGap && mergedLength <= options.maxBytes) {
      current.length = mergedLength
      current.items.push(next)
    } else {
      out.push(current)
      current = { offset: next.offset, length: next.length, items: [next] }
    }
  }
  out.push(current)
  return out
}
