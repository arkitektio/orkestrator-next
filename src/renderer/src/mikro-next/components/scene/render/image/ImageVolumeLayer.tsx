import { useSceneStore } from "../../store/sceneStore";
import { VolumeLayer } from "../../layers/three_d/VolumeLayer";

/**
 * Registry entry for rendering an ImageLayer in 3D. Looks up the normalized
 * image `LayerState` by id and renders the volume (keyed so a LOD change
 * remounts). Non-image layer types have their own registry entries.
 */
export const ImageVolumeLayer = ({ layerId }: { layerId: string }) => {
  const layer = useSceneStore((s) => s.layers.find((l) => l.id === layerId));
  if (!layer || layer.visible === false) return null;
  return (
    <VolumeLayer
      key={`${layer.id}:${layer.fixedLOD == null ? "auto" : layer.fixedLOD}`}
      layer={layer}
    />
  );
};
