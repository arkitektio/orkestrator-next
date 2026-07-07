import type { LayerState } from '../../store/sceneStore'
import { resolveLayerDataRange } from '../../core/dataRange'

const FALLBACK_RANGE: [number, number] = [0, 1]

export function getLayerDtypeRange(layer: LayerState): [number, number] {
  const dtype = layer.lens.dataset.dataArrays[0]?.store.dtype
  if (!dtype) return FALLBACK_RANGE

  try {
    return resolveLayerDataRange(layer, dtype)
  } catch {
    return FALLBACK_RANGE
  }
}

export function normalizedToAbsolute(value: number, rangeMin: number, rangeMax: number): number {
  const span = rangeMax - rangeMin
  if (span <= 0) return rangeMin
  return rangeMin + value * span
}

export function absoluteToNormalized(value: number, rangeMin: number, rangeMax: number): number {
  const span = rangeMax - rangeMin
  if (span <= 0) return 0
  return clamp01((value - rangeMin) / span)
}

export function formatContrastValue(value: number): string {
  const absValue = Math.abs(value)

  if (absValue >= 1000) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
  }

  if (absValue >= 1) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(value)
  }

  if (absValue >= 0.01) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(value)
  }

  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value)
}

export function toPercentString(value: number, rangeMin: number, rangeMax: number): string {
  return `${(absoluteToNormalized(value, rangeMin, rangeMax) * 100).toFixed(2)}%`
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function clamp01(value: number): number {
  return clamp(value, 0, 1)
}
