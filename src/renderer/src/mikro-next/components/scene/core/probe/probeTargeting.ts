/**
 * Which layer answers a probe pointer event.
 *
 * Every brick layer raycasts its own mesh, so with layers stacked the one in
 * FRONT claims the pointer and the ones behind it never get a look in. Pinning
 * a layer (`viewerStore.probeLayerId`) is how you read the one underneath.
 *
 * The mechanism is a decline, not a filter: a layer that is not the pinned one
 * must return from its handler WITHOUT calling `event.stopPropagation()`, so
 * R3F carries the same event on to the next intersected object — the pinned
 * layer — which handles it normally. Stopping propagation first would swallow
 * the event and pin the probe to nothing.
 */
export const layerAnswersProbe = (
  /** The pinned layer, or null for "whatever is in front". */
  probeLayerId: string | null,
  /** The layer whose handler is deciding whether to act. */
  layerId: string,
): boolean => probeLayerId === null || probeLayerId === layerId;

/**
 * The probe to keep after the pin changes. A reading taken from a layer the
 * probe no longer reads is stale the moment the pin moves — leaving it up would
 * show one layer's values under another layer's name until the next click.
 * Unpinning keeps whatever is up: it widens what may answer next, it does not
 * invalidate what was already read.
 */
export const probeAfterPinChange = <T extends { layerId: string }>(
  probe: T | null,
  nextProbeLayerId: string | null,
): T | null =>
  nextProbeLayerId !== null && probe?.layerId !== nextProbeLayerId ? null : probe;
