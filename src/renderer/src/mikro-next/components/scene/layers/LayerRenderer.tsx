import { useEffect, useMemo } from "react";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import { getInitialVolumeTextureBudgetBytes } from "../core/lodPlanning";
import { selectLayersWithinBudget } from "../core/renderCost";
import { LAYER_RENDERERS } from "./registry";

// Draw-call backstop only — the primary display limit is the byte budget.
const MAX_DISPLAYABLE_LAYERS = 64;

/**
 * Dispatches each scene layer to the renderer registered for its `__typename`
 * and the current display mode. Image layers cost nothing against the byte
 * budget here: PLANNED image layers are budget-bounded by the brick pool
 * (atlas sized from a budget share), and layers whose pinned coarsest level
 * would exceed the GPU budget (no usable pyramid — P18) are refused UPSTREAM
 * by the pool-viability guard in nodePlanTracker (no plan → the brick layer
 * components render nothing; `viewerStore.unplannableLayers` carries the
 * reason). So this budget only culls non-image layer types.
 */
export const LayerRenderer = ({ mode }: { mode: "2D" | "3D" }) => {
  const sceneLayers = useSceneStore((s) => s.sceneLayers);
  const imageLayers = useSceneStore((s) => s.layers);
  const setRenderBudget = useViewerStore((s) => s.setRenderBudget);

  const selection = useMemo(() => {
    // Hidden image layers neither render nor consume budget (visibility
    // lives on the normalized image LayerState).
    const imageLayerById = new Map(imageLayers.map((layer) => [layer.id, layer]));
    const candidates = sceneLayers.filter(
      (layer) => imageLayerById.get(layer.id)?.visible !== false,
    );

    const entries = candidates.map((layer) => ({ id: layer.id, costBytes: 0, layer }));

    const budgetBytes = getInitialVolumeTextureBudgetBytes();
    return {
      budgetBytes,
      ...selectLayersWithinBudget(entries, budgetBytes, MAX_DISPLAYABLE_LAYERS),
    };
  }, [sceneLayers, imageLayers, mode]);

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
