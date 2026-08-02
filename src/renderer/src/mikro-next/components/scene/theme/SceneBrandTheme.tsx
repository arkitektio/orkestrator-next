import { useMemo } from "react";
import { useBrandOverride } from "@/providers/settings/useBrandOverride";
import { useSceneStore } from "../store/sceneStore";
import { useSelectionStore } from "../store/selectionStore";
import { layerBrandTarget } from "./brandTarget";

/**
 * Tints the app to the scene's main layer while the scene is open.
 *
 * "Main layer" is the one the user is looking at: the layer selected in the
 * Layers panel, else the first visible one. Renders nothing — it only owns the
 * brand override, which the CSS transition eases in and out.
 *
 * Mounted by `SceneProvider` once the store scope exists, so every scene host
 * (dataset page, scene page) gets it without per-page wiring.
 */
export const SceneBrandTheme = () => {
  const layers = useSceneStore((state) => state.layers);
  const selectedLayerId = useSelectionStore((state) => state.selectedLayerId);

  const target = useMemo(() => {
    const mainLayer =
      layers.find((layer) => layer.id === selectedLayerId) ??
      layers.find((layer) => layer.visible !== false) ??
      layers[0];

    return mainLayer ? layerBrandTarget(mainLayer.channels) : null;
  }, [layers, selectedLayerId]);

  useBrandOverride(target);

  return null;
};
