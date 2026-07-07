import { useUpdateLaterMutation } from "@/mikro-next/api/graphql";
import { useState } from "react";
import { isLayerOutOfPlane } from "../core/worldTransform";
import { useModeStore } from "../store/modeStore";
import { useSelectionStore } from "../store/selectionStore";
import { LayerState, useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import { LayerGraphFlyout } from "./layer/LayerGraphFlyout";
import { LayerRow } from "./layer/LayerRow";

export const LayerControlPanel = () => {
  const layers = useSceneStore((s) => s.layers);
  const originalLayers = useSceneStore((s) => s.originalLayers);
  const updateLayer = useSceneStore((s) => s.updateLayer);
  const markLayerClean = useSceneStore((s) => s.markLayerClean);
  const armedLayerIds = useSelectionStore((s) => s.armedLayerIds);
  const selectedLayerId = useSelectionStore((s) => s.selectedLayerId);
  const setSelectedLayerId = useSelectionStore((s) => s.setSelectedLayerId);
  const toggleArmedLayerId = useSelectionStore((s) => s.toggleArmedLayerId);
  const fitToLayer = useViewerStore((s) => s.fitToLayer);
  const visibleLayers = useViewerStore((s) => s.visibleLayers);
  const currentZ = useViewerStore((s) => s.currentZ);
  const displayMode = useModeStore((s) => s.displayMode);
  const [updateLater] = useUpdateLaterMutation();
  const [showOffscreen, setShowOffscreen] = useState(false);

  // Contrast/colormap/color live in the render graph (saved by the render-graph
  // editor); this persists only the dimension mapping.
  const saveLayer = (layer: LayerState) => {
    updateLater({
      variables: {
        input: {
          id: layer.id,
          xDim: layer.xDim,
          yDim: layer.yDim,
          zDim: layer.zDim,
          intensityDim: layer.intensityDim,
        },
      },
    });
    markLayerClean(layer.id);
  };

  if (layers.length === 0) return null;

  // A layer is "in view" when it is inside the camera frustum
  // (viewerStore.visibleLayers) AND — in 2D — its data intersects the current Z
  // plane. Out-of-plane layers (from scrubbing the Z slider) are treated like
  // off-screen ones. Not the per-layer on/off `visible` flag.
  const inViewSet = new Set(visibleLayers);
  const isInView = (l: LayerState) =>
    inViewSet.has(l.id) &&
    !(displayMode === "2D" && isLayerOutOfPlane(l, currentZ));
  const inViewLayers = layers.filter(isInView);
  const offscreenLayers = layers.filter((l) => !isInView(l));
  // Only layers currently in view are shown by default; the rest stay collapsed
  // behind the "+N off-view" toggle.
  const shownLayers = showOffscreen ? layers : inViewLayers;

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) ?? null;

  const renderRow = (layer: LayerState) => (
    <LayerRow
      key={layer.id}
      layer={layer}
      originalLayer={originalLayers.find((o) => o.id === layer.id)}
      isArmed={armedLayerIds.includes(layer.id)}
      isSelected={layer.id === selectedLayerId}
      onSelect={() =>
        setSelectedLayerId(layer.id === selectedLayerId ? null : layer.id)
      }
      onToggleArm={() => toggleArmedLayerId(layer.id)}
      onUpdate={updateLayer}
      onFocus={fitToLayer}
    />
  );

  return (
    <div className="pointer-events-none absolute right-3 top-16 bottom-3 z-30 flex flex-row items-start justify-end gap-2">
      {selectedLayer && (
        <div className="pointer-events-auto flex max-h-full">
          <LayerGraphFlyout
            key={selectedLayer.id}
            layer={selectedLayer}
            originalLayer={originalLayers.find((o) => o.id === selectedLayer.id)}
            isArmed={armedLayerIds.includes(selectedLayer.id)}
            onUpdate={updateLayer}
            onToggleArm={() => toggleArmedLayerId(selectedLayer.id)}
            onSave={saveLayer}
            onClose={() => setSelectedLayerId(null)}
          />
        </div>
      )}

      <div className="pointer-events-auto flex w-56 max-h-full flex-col gap-1 overflow-y-auto">
        {shownLayers.map(renderRow)}

        {offscreenLayers.length > 0 && (
          <button
            className="self-end rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] text-white/60 backdrop-blur-md transition-colors hover:border-white/20 hover:text-white/90"
            onClick={() => setShowOffscreen((v) => !v)}
          >
            {showOffscreen
              ? "Hide off-view"
              : `+${offscreenLayers.length} off-view`}
          </button>
        )}
      </div>
    </div>
  );
};
