import { BrickPlaneLayer } from "../../layers/bricks/BrickPlaneLayer";
import { PlaneLayer } from "../../layers/two_d/PlaneLayer";
import { useViewerStore } from "../../store/viewerStore";

/**
 * Registry entry for rendering an ImageLayer in 2D. Switches between the
 * legacy per-chunk tile path and the brick-pool (pyramidal octree) path on
 * the migration flag — static imports only (no React.lazy in the Electron
 * renderer). The wrapper goes away with the flag at final cutover.
 */
export const ImagePlaneLayer = ({ layerId }: { layerId: string }) => {
  const useOctreeRenderer = useViewerStore((s) => s.useOctreeRenderer);
  return useOctreeRenderer ? (
    <BrickPlaneLayer layerId={layerId} />
  ) : (
    <PlaneLayer layerId={layerId} />
  );
};
