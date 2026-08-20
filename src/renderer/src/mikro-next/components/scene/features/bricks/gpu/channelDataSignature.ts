import type { LayerState } from "../../../platform/model/layerModel";

/**
 * Value signature over exactly the layer fields `buildMergedChannelUniformData`
 * (via `buildChannelUniformData`, `writeCursors`, `resolveValueRange` and the
 * caller's `projectionModeOf`) reads. The volume layer keys its `channelData`
 * memo on this instead of the whole `layers` array: that memo allocates a
 * colormap atlas plus two DataTextures PER MEMBER on every run, so keying on
 * array identity meant any edit to any layer anywhere — dragging an unrelated
 * clim slider, toggling another image — paid the full texture rebuild for
 * every mounted volume.
 *
 * If a new field is consumed by the uniform builders it MUST be added here,
 * or edits to it will silently stop reaching the GPU. The shape below
 * deliberately serializes whole `transfer` objects rather than picking fields,
 * so transfer-level additions are covered automatically.
 */
export function buildChannelDataSignature(layer: LayerState | undefined): string {
  if (!layer) return "∅";
  const sources = layer.sources ?? layer.channels ?? [];
  try {
    return JSON.stringify({
      blend: layer.blend ?? null,
      colormap: layer.colormap ?? null,
      color: layer.color ?? null,
      projection: layer.projection ?? null,
      phasorLens: layer.lens?.phasor ?? null,
      sources: sources.map((source) =>
        source.type === "phasor"
          ? { t: "p", v: source.visible, h: source.harmonic, tr: source.transfer }
          : { t: "c", v: source.visible, i: source.intensityIndex, tr: source.transfer },
      ),
    });
  } catch {
    // Unserializable state (should not happen for store data): fall back to
    // always-rebuild rather than serving stale uniforms.
    return `unserializable:${++unserializableCounter}`;
  }
}

let unserializableCounter = 0;
