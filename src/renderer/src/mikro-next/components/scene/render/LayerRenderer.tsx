import { useEffect, useMemo } from "react";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import { isImageLayer } from "../core/layerGuards";
import { getInitialVolumeTextureBudgetBytes } from "../core/lodPlanning";
import {
  estimateImageLayerRenderCostBytes,
  selectLayersWithinBudget,
} from "../core/renderCost";
import { LAYER_RENDERERS } from "./registry";

// Draw-call backstop only — the primary display limit is the byte budget.
const MAX_DISPLAYABLE_LAYERS = 64;

/**
 * Dispatches each scene layer to the renderer registered for its `__typename`
 * and the current display mode. Which layers display is decided by a
 * render-cost budget (dtype × shape × mode, see core/renderCost.ts), not a
 * fixed count: 22 tiny debug layers all render, while layers are culled — in
 * reverse render order — once their estimated texture bytes exceed the
 * device-derived budget.
 */
export const LayerRenderer = ({ mode }: { mode: "2D" | "3D" }) => {
  const sceneLayers = useSceneStore((s) => s.sceneLayers);
  const imageLayers = useSceneStore((s) => s.layers);
  const setRenderBudget = useViewerStore((s) => s.setRenderBudget);
  const useOctreeRenderer = useViewerStore((s) => s.useOctreeRenderer);

  const selection = useMemo(() => {
    // Hidden image layers neither render nor consume budget (visibility
    // lives on the normalized image LayerState).
    const imageLayerById = new Map(imageLayers.map((layer) => [layer.id, layer]));
    const candidates = sceneLayers.filter(
      (layer) => imageLayerById.get(layer.id)?.visible !== false,
    );

    const entries = candidates.map((layer) => {
      const normalized = imageLayerById.get(layer.id);
      // The brick-pool renderer bounds image-layer GPU memory by construction
      // (each layer's atlas is sized from a budget share), so cost culling
      // only applies to the legacy monolithic-texture path.
      const costBytes =
        isImageLayer(layer) && normalized && !useOctreeRenderer
          ? estimateImageLayerRenderCostBytes(normalized, mode)
          : 0;
      return { id: layer.id, costBytes, layer };
    });

    const budgetBytes = getInitialVolumeTextureBudgetBytes();
    return {
      budgetBytes,
      ...selectLayersWithinBudget(entries, budgetBytes, MAX_DISPLAYABLE_LAYERS),
    };
  }, [sceneLayers, imageLayers, mode, useOctreeRenderer]);

  // Surface culling decisions so layers don't silently vanish.
  useEffect(() => {
    setRenderBudget(
      selection.culled.length > 0
        ? {
            budgetBytes: selection.budgetBytes,
            usedBytes: selection.usedBytes,
            culledLayerIds: selection.culled.map((entry) => entry.id),
          }
        : null,
    );
  }, [selection, setRenderBudget]);

  return (
    <group>
      {selection.displayed.map(({ layer }) => {
        const renderers = LAYER_RENDERERS[layer.__typename];
        const Component = mode === "2D" ? renderers?.Layer2D : renderers?.Layer3D;
        return Component ? <Component key={layer.id} layerId={layer.id} /> : null;
      })}
    </group>
  );
};
