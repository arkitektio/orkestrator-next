import { useViewerStore } from "../store/viewerStore";
import { useSceneStore } from "../store/sceneStore";

export const LayerViewRangesOverlay = () => {
  const layerViewRanges = useViewerStore((s) => s.layerViewRanges);
  const layers = useSceneStore((s) => s.layers);

  const entries = Object.entries(layerViewRanges);
  if (entries.length === 0) return null;

  return (
    <div className="absolute bottom-2 left-2 z-30 flex flex-col gap-0.5 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-white/80 pointer-events-none">
      {entries.map(([id, range]) => {
        const layerIndex = layers.findIndex((l) => l.id === id);
        const label =
          layerIndex >= 0 ? `Layer ${layerIndex + 1}` : id.slice(0, 8);
        return (
          <div key={id} className="flex gap-2">
            <span className="text-white/60 min-w-[52px]">{label}</span>
            <span>
              x({range.xRange[0]}, {range.xRange[1]})
            </span>
            <span>
              y({range.yRange[0]}, {range.yRange[1]})
            </span>
            {range.zRange && (
              <span>
                z({range.zRange[0]}, {range.zRange[1]})
              </span>
            )}
            <span className="text-white/50">
              {range.scale >= 1
                ? `${range.scale.toFixed(1)}px/vox`
                : `${(1 / range.scale).toFixed(1)}vox/px`}
            </span>
          </div>
        );
      })}
    </div>
  );
};
