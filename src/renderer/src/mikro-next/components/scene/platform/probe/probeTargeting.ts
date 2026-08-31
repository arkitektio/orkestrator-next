/**
 * Which layer answers a probe pointer event.
 *
 * Exactly ONE layer reads the probe at any time. An explicit pin
 * (`viewerStore.probeLayerId`) selects it; with no pin the DEFAULT target is
 * the first visible image layer in store order — never "whatever mesh the ray
 * hits first", which made the reading camera-dependent with stacked layers.
 *
 * The mechanism is a decline, not a filter: a layer that is not the target
 * must return from its handler WITHOUT calling `event.stopPropagation()`, so
 * R3F carries the same event on to the next intersected object — the target
 * layer — which handles it normally. Stopping propagation first would swallow
 * the event and probe nothing.
 *
 * This covers EVERY probe-shaped gesture, not just PROBE-mode readouts: the
 * DESIGN tools' volume clicks and strokes (brush, blob, wand, lift, bridge)
 * are captured by the intensity volume, the label raymarcher and the 2D
 * plane through the same `layerAnswersProbe` guard — so a design gesture
 * lands on the pinned layer (or the default first visible one), never on
 * "whatever the ray hit first". Lifting from a mask that is not the first
 * visible layer therefore means pinning it (the layer row's probe pin).
 */

/**
 * The layer the probe actually reads. An explicit pin wins while its layer
 * exists and is visible (a hidden layer draws no mesh and can answer
 * nothing); otherwise the first layer with `visible !== false`. Null only
 * when no layer can answer at all.
 *
 * A dead pin is deliberately NOT erased here: it heals by derivation, and
 * resurrects if its layer is shown again — a temporary hide keeps the user's
 * intent.
 */
export const effectiveProbeLayerId = (
  probeLayerId: string | null,
  layers: readonly { id: string; visible?: boolean }[],
): string | null => {
  if (
    probeLayerId !== null &&
    layers.some((layer) => layer.id === probeLayerId && layer.visible !== false)
  ) {
    return probeLayerId;
  }
  return layers.find((layer) => layer.visible !== false)?.id ?? null;
};

export const layerAnswersProbe = (
  /** The resolved target (`effectiveProbeLayerId`), or null for "no layer". */
  effectiveLayerId: string | null,
  /** The layer whose handler is deciding whether to act. */
  layerId: string,
): boolean => effectiveLayerId === layerId;

/**
 * The probe to keep after the pin changes. A reading taken from a layer the
 * probe no longer reads is stale the moment the pin moves — leaving it up would
 * show one layer's values under another layer's name until the next click.
 * Resetting to the default (null) keeps whatever is up: this helper cannot see
 * the layer list, so the default target is unknown here — the probe panel's
 * reconciliation drops a reading that mismatches the derived target.
 */
export const probeAfterPinChange = <T extends { layerId: string }>(
  probe: T | null,
  nextProbeLayerId: string | null,
): T | null =>
  nextProbeLayerId !== null && probe?.layerId !== nextProbeLayerId ? null : probe;
