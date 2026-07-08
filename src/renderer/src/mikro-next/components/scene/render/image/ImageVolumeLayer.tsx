import { useSceneStore } from "../../store/sceneStore";
import { useViewerStore } from "../../store/viewerStore";
import { BrickVolumeLayer } from "../../layers/bricks/BrickVolumeLayer";
import { VolumeLayer } from "../../layers/three_d/VolumeLayer";

/**
 * Registry entry for rendering an ImageLayer in 3D. Looks up the normalized
 * image `LayerState` by id and renders the volume (keyed so a LOD change
 * remounts). The migration flag switches between the legacy monolithic
 * volume texture and the brick-pool (pyramidal octree) raymarcher — static
 * imports only. Non-image layer types have their own registry entries.
 */
export const ImageVolumeLayer = ({ layerId }: { layerId: string }) => {
  const layer = useSceneStore((s) => s.layers.find((l) => l.id === layerId));
  const useOctreeRenderer = useViewerStore((s) => s.useOctreeRenderer);
  if (!layer || layer.visible === false) return null;
  if (useOctreeRenderer) return <BrickVolumeLayer layerId={layerId} />;
  return (
    <VolumeLayer
      key={`${layer.id}:${layer.fixedLOD == null ? "auto" : layer.fixedLOD}`}
      layer={layer}
    />
  );
};
