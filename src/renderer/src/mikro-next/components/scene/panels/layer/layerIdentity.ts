import type { LayerState } from "../../core/layerModel";

/**
 * What kind of data an image layer paints — the layer list's color code.
 * Derived from the render graph, never stored: a phasor node makes it FLIM,
 * several channel sources make it multichannel, anything else is a plain image.
 *
 * "Labels" used to be derived here from a `transfer.categorical` flag. That flag
 * no longer exists — a label map is its own `LabelLayer` type now, so the flavor
 * comes from the layer's `__typename` rather than from its render graph, and is
 * checked FIRST: a label has no channels and no phasors, so every graph-derived
 * test below would fall through to "Image" and mislabel it.
 */
export type LayerFlavor = "FLIM" | "Labels" | "Multichannel" | "Image";

export const layerFlavor = (layer: LayerState): LayerFlavor => {
  if (layer.__typename === "LabelLayer") return "Labels";
  if (layer.phasors.length > 0) return "FLIM";
  if (layer.channels.length > 1) return "Multichannel";
  return "Image";
};

/** Badge classes per flavor, on the panel's dark card surface. */
export const FLAVOR_BADGE_CLASSES: Record<LayerFlavor, string> = {
  FLIM: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  Labels: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  Multichannel: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  Image: "border-sky-400/40 bg-sky-400/10 text-sky-300",
};

/**
 * The name a layer row shows: the channel-label anchor when the acquisition
 * recorded one, else the DATASET the lens looks at — the name the user gave
 * their data, which is almost always the answer to "which layer is this?" —
 * and only then a flavor-based fallback. Never the old constant
 * "Untitled Layer", which made every row read identically.
 */
export const layerDisplayLabel = (layer: LayerState): string => {
  const anchorLabel = layer.lens.activeAnchors
    .find((anchor) => anchor.channelLabel)
    ?.channelLabel?.label?.trim();
  if (anchorLabel) return anchorLabel;

  const datasetName = layer.lens.dataset.name?.trim();
  if (datasetName) return datasetName;

  return `${layerFlavor(layer)} layer`;
};
