import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import {
  SceneLayerFragment,
  useUpdateLaterMutation,
} from "@/mikro-next/api/graphql";
import { Layers } from "lucide-react";
import { useState } from "react";
import { useSelectionStore } from "../store/layerStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import { isLayerDirty } from "./layer/colormap-utils";
import { LayerCard } from "./layer/LayerCard";

export const LayerControlPanel = () => {
  const layers = useSceneStore((s) => s.layers);
  const originalLayers = useSceneStore((s) => s.originalLayers);
  const updateLayer = useSceneStore((s) => s.updateLayer);
  const markLayerClean = useSceneStore((s) => s.markLayerClean);
  const selectedLayerId = useSelectionStore((s) => s.selectedLayerId);
  const setSelectedLayerId = useSelectionStore((s) => s.setSelectedLayerId);
  const fitToLayer = useViewerStore((s) => s.fitToLayer);
  const lodBias = useViewerStore((s) => s.lodBias);
  const cullRadius = useViewerStore((s) => s.cullRadius);
  const setCullRadius = useViewerStore((s) => s.setCullRadius);
  const setLodBias = useViewerStore((s) => s.setLodBias);
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

  console.log("rendering LayerControlPanel", { layers });



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
          <div className="flex flex-col gap-1.5 p-2 mb-1 border border-border/50 rounded bg-background/50 backdrop-blur-sm shadow-sm shrink-0">
            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium">
              <span>LOD Aggressiveness</span>
              <span className="font-mono bg-accent px-1 rounded">{lodBias.toFixed(1)}x</span>
            </div>
            <Slider
              min={0.1}
              max={5.0}
              step={0.1}
              value={[lodBias]}
              onValueChange={([v]) => setLodBias(v)}
              className="py-1"
            />
            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium mt-2">
              <span>Cull Radius (Debug)</span>
              <span className="font-mono bg-accent px-1 rounded">{cullRadius} units</span>
            </div>
            <Slider
              min={40}
              max={900}
              step={10}
              value={[cullRadius]}
              onValueChange={([v]) => setCullRadius(v)}
              className="py-1"
            />

          </div>
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
              onFocus={fitToLayer}
            />
          ))}
        </div>
      )}
    </div>
  );
};
