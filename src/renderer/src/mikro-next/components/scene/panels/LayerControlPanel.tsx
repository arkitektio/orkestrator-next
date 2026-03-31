import { Button } from "@/components/ui/button";
import { useSceneStore } from "../store/sceneStore";
import { useSelectionStore } from "../store/layerStore";
import {
  SceneLayerFragment,
  useUpdateLaterMutation,
} from "@/mikro-next/api/graphql";
import { useState } from "react";
import { Layers } from "lucide-react";
import { isLayerDirty } from "./layer/colormap-utils";
import { LayerCard } from "./layer/LayerCard";

export const LayerControlPanel = () => {
  const layers = useSceneStore((s) => s.layers);
  const originalLayers = useSceneStore((s) => s.originalLayers);
  const updateLayer = useSceneStore((s) => s.updateLayer);
  const markLayerClean = useSceneStore((s) => s.markLayerClean);
  const selectedLayerId = useSelectionStore((s) => s.selectedLayerId);
  const setSelectedLayerId = useSelectionStore((s) => s.setSelectedLayerId);
  const [updateLater] = useUpdateLaterMutation();
  const [open, setOpen] = useState(false);

  const saveLayer = (layer: SceneLayerFragment) => {
    updateLater({
      variables: {
        input: {
          id: layer.id,
          climMin: layer.climMin,
          climMax: layer.climMax,
          colormap: layer.colormap,
          xDim: layer.xDim,
          yDim: layer.yDim,
          zDim: layer.zDim,
          intensityDim: layer.intensityDim,
        },
      },
    });
    markLayerClean(layer.id);
  };

  const anyDirty = layers.some((l) =>
    isLayerDirty(
      l,
      originalLayers.find((o) => o.id === l.id),
    ),
  );

  return (
    <div className="absolute bottom-2 right-2 z-30 flex flex-col items-end gap-1">
      <Button
        variant={open ? "default" : "outline"}
        size="xs"
        className="h-7 px-2 gap-1 text-[11px] shadow-md"
        onClick={() => setOpen((v) => !v)}
      >
        <Layers className="h-3.5 w-3.5" />
        Layers
        {layers.length > 0 && (
          <span className="ml-0.5 text-[9px] opacity-70">
            ({layers.length})
          </span>
        )}
        {anyDirty && (
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
        )}
      </Button>

      {open && (
        <div className="w-60 max-h-[calc(100vh-5rem)] overflow-y-auto flex flex-col gap-1.5 pb-1">
          {layers.map((layer) => (
            <LayerCard
              key={layer.id}
              layer={layer}
              originalLayer={originalLayers.find(
                (o) => o.id === layer.id,
              )}
              isSelected={layer.id === selectedLayerId}
              onSelect={() =>
                setSelectedLayerId(
                  layer.id === selectedLayerId ? null : layer.id,
                )
              }
              onUpdate={updateLayer}
              onSave={saveLayer}
            />
          ))}
        </div>
      )}
    </div>
  );
};
