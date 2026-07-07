import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Crosshair, Save, X } from "lucide-react";
import { useState } from "react";
import { ImageLayerFragment } from "../../core/layerGuards";
import { LayerState } from "../../store/sceneStore";
import { useViewerStore } from "../../store/viewerStore";
import { isLayerDirty } from "./colormap-utils";
import { DimPill } from "./DimPill";
import { RenderGraphSection } from "./rendergraph/RenderNodeEditor";

/**
 * The editing surface for a single layer, shown as a flyout to the left of the
 * Layers panel. Holds the render graph (channels, contrast, colormap,
 * projection — the single rendering truth) and an Advanced section for
 * dimension mapping and level-of-detail.
 */
export const LayerGraphFlyout = ({
  layer,
  originalLayer,
  isArmed,
  onUpdate,
  onToggleArm,
  onSave,
  onClose,
}: {
  layer: LayerState;
  originalLayer: LayerState | undefined;
  isArmed: boolean;
  onUpdate: (updated: LayerState) => void;
  onToggleArm: () => void;
  onSave: (layer: LayerState) => void;
  onClose: () => void;
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isLodDebugOpen, setIsLodDebugOpen] = useState(false);
  const lodDebugInfo = useViewerStore((s) => s.lodDebugInfo);
  const currentLodInfo = lodDebugInfo[layer.id];
  const dirty = isLayerDirty(layer, originalLayer);

  const label =
    layer.lens.activeAnchors.filter((a) => a.channelLabel)?.[0]?.channelLabel
      ?.label ?? "Untitled Layer";

  const dims: { label: string; key: keyof ImageLayerFragment }[] = [
    { label: "X", key: "xDim" },
    { label: "Y", key: "yDim" },
    { label: "Z", key: "zDim" },
    { label: "I", key: "intensityDim" },
  ];

  const swapDims = (
    keyA: keyof ImageLayerFragment,
    keyB: keyof ImageLayerFragment,
  ) => {
    onUpdate({
      ...layer,
      [keyA]: layer[keyB],
      [keyB]: layer[keyA],
    } as LayerState);
  };

  return (
    <div className="flex w-72 max-h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/70 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-white/90">
          {label}
        </span>
        <Button
          variant="ghost"
          size="xs"
          className={`h-6 w-6 p-0 ${
            isArmed ? "text-cyan-200" : "text-white/60 hover:text-white"
          }`}
          title={isArmed ? "Disarm ROI constraints" : "Arm for ROI constraints"}
          onClick={onToggleArm}
        >
          <Crosshair className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className="h-6 w-6 p-0 text-white/60 hover:text-white"
          title="Close"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto px-3 py-2 text-[10px] text-white/85">
        <RenderGraphSection layer={layer} />

        {dirty && (
          <Button
            variant="outline"
            size="xs"
            className="h-7 border-white/10 bg-black/20 text-[10px] text-white hover:bg-white/10"
            onClick={() => onSave(layer)}
          >
            <Save className="mr-1 h-3 w-3" />
            Save changes
          </Button>
        )}

        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <div className="rounded-md border border-dashed border-white/10 bg-black/10">
            <CollapsibleTrigger asChild>
              <button className="flex w-full items-center gap-1.5 px-2 py-1.5 text-[10px] text-white/60 transition-colors hover:text-white/85">
                <span>Advanced</span>
                <span className="text-white/35">dimension mapping and LOD</span>
                <ChevronDown
                  className={`ml-auto h-3 w-3 transition-transform duration-200 ${
                    isAdvancedOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-2 border-t border-white/10 px-2 py-2">
                <div className="flex items-center justify-between gap-0">
                  {dims.map((dim, i) => (
                    <DimPill
                      key={dim.key}
                      label={dim.label}
                      value={layer[dim.key] as string | null | undefined}
                      onSwapNext={
                        i < dims.length - 1
                          ? () => swapDims(dim.key, dims[i + 1].key)
                          : undefined
                      }
                    />
                  ))}
                </div>

                {layer.lens.dataset.dataArrays.length > 1 && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[10px] text-white/60">
                      <span>Resolution Level (LOD)</span>
                    </div>
                    <Select
                      value={
                        layer.fixedLOD == null
                          ? "auto"
                          : layer.fixedLOD.toString()
                      }
                      onValueChange={(val) =>
                        onUpdate({
                          ...layer,
                          fixedLOD: val === "auto" ? null : parseInt(val, 10),
                        })
                      }
                    >
                      <SelectTrigger className="h-7 border-white/10 bg-black/20 text-[10px] text-white/85">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto" className="text-xs">
                          Auto (Responsive)
                        </SelectItem>
                        {layer.lens.dataset.dataArrays.map((arr, idx) => (
                          <SelectItem
                            key={idx}
                            value={idx.toString()}
                            className="text-xs"
                          >
                            Level {idx}{" "}
                            {arr.store.shape
                              ? `(${arr.store.shape.join("x")})`
                              : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {currentLodInfo?.renderedLevels && (
                      <Collapsible
                        open={isLodDebugOpen}
                        onOpenChange={setIsLodDebugOpen}
                      >
                        <div className="mt-1 rounded border border-white/10 bg-black/10">
                          <CollapsibleTrigger asChild>
                            <button className="flex w-full items-center gap-1.5 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-white/45 transition-colors hover:text-white/75">
                              <span>LOD Debug</span>
                              <span className="text-white/30">
                                {currentLodInfo.renderedLevels.length} levels
                              </span>
                              <ChevronDown
                                className={`ml-auto h-3 w-3 transition-transform duration-200 ${
                                  isLodDebugOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="flex flex-wrap gap-1 border-t border-white/10 px-2 py-2 text-[9px]">
                              {currentLodInfo.renderedLevels.map(
                                (lvl, index) => (
                                  <div
                                    key={lvl}
                                    className={`rounded px-1.5 py-0.5 ${
                                      index === 0
                                        ? "bg-primary/20 text-primary"
                                        : "bg-white/10 text-white/50"
                                    }`}
                                    title={
                                      index === 0
                                        ? "Primary LOD"
                                        : "Z-buffered fallback LOD"
                                    }
                                  >
                                    LOD {lvl} {index > 0 && "(Z-Buf)"}
                                  </div>
                                ),
                              )}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </div>
  );
};
