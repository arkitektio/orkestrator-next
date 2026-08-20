import { useMemo } from "react";
import { useBrandOverride } from "@/providers/settings/useBrandOverride";
import { useSceneStore } from "../../platform/stores/sceneStore";
import { useSelectionStore } from "../../platform/stores/selectionStore";
import { useViewerStore } from "../../platform/stores/viewerStore";
import { layerBrandTarget } from "./brandTarget";

/**
 * Tints the app to the scene while it is open. Renders nothing — it only owns
 * the brand override, which the CSS transition eases in and out.
 *
 * Two sources, in preference order:
 *   1. the SAMPLED target — the majority hue of the pixels actually rendered,
 *      published by `CanvasHueProbe` from inside the canvas;
 *   2. the colormap-derived ESTIMATE from the main layer (the layer selected
 *      in the Layers panel, else the first visible one) — the tint before the
 *      first frame lands, and whenever the canvas is blank or unmounted.
 *
 * Mounted by `SceneProvider` once the store scope exists, so every scene host
 * (dataset page, scene page) gets it without per-page wiring.
 */
export const SceneBrandTheme = () => {
  const layers = useSceneStore((state) => state.layers);
  const selectedLayerId = useSelectionStore((state) => state.selectedLayerId);
  const sampled = useViewerStore((state) => state.sampledBrandTarget);

  const estimate = useMemo(() => {
    const mainLayer =
      layers.find((layer) => layer.id === selectedLayerId) ??
      layers.find((layer) => layer.visible !== false) ??
      layers[0];

    return mainLayer ? layerBrandTarget(mainLayer.channels) : null;
  }, [layers, selectedLayerId]);

  useBrandOverride(sampled ?? estimate);

  return null;
};
