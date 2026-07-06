import { useMemo } from "react";
import { useSceneStore } from "../store/sceneStore";
import { LAYER_RENDERERS } from "./registry";

const MAX_DISPLAYABLE = 10;

/**
 * Dispatches each scene layer to the renderer registered for its `__typename`
 * and the current display mode. Iterates the raw polymorphic layer list so new
 * layer types render through their own registry entry.
 */
export const LayerRenderer = ({ mode }: { mode: "2D" | "3D" }) => {
  const sceneLayers = useSceneStore((s) => s.sceneLayers);
  const imageLayers = useSceneStore((s) => s.layers);
  const displayed = useMemo(() => {
    // Filter hidden image layers out BEFORE slicing so they don't consume
    // display slots (visibility lives on the normalized image LayerState).
    const hiddenImageIds = new Set(
      imageLayers.filter((layer) => layer.visible === false).map((layer) => layer.id),
    );
    return sceneLayers
      .filter((layer) => !hiddenImageIds.has(layer.id))
      .slice(0, MAX_DISPLAYABLE);
  }, [sceneLayers, imageLayers]);

  return (
    <group>
      {displayed.map((layer) => {
        const renderers = LAYER_RENDERERS[layer.__typename];
        const Component = mode === "2D" ? renderers?.Layer2D : renderers?.Layer3D;
        return Component ? <Component key={layer.id} layerId={layer.id} /> : null;
      })}
    </group>
  );
};
