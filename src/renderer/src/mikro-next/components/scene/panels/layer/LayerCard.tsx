import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ColorMap } from "@/mikro-next/api/graphql";
import { ImageLayerFragment } from "../../core/layerGuards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayerState } from "../../store/sceneStore";
import {
  ChevronDown,
  Crosshair,
  Focus,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { useMemo, useState } from "react";
import { colormapGradientCSS, isLayerDirty } from "./colormap-utils";
import { DimPill } from "./DimPill";
import { RenderGraphSection } from "./rendergraph/RenderNodeEditor";
import { useViewerStore } from "../../store/viewerStore";

const DEFAULT_INTENSITY_COLOR = [255, 255, 255] as const;

const getLayerColorCSS = (color: number[] | null | undefined) => {
  const r = Math.round(color?.[0] ?? DEFAULT_INTENSITY_COLOR[0]);
  const g = Math.round(color?.[1] ?? DEFAULT_INTENSITY_COLOR[1]);
  const b = Math.round(color?.[2] ?? DEFAULT_INTENSITY_COLOR[2]);
  return `rgb(${r}, ${g}, ${b})`;
};

export const LayerCard = ({
  layer,
  originalLayer,
  isArmed,
  isSelected,
  onSelect,
  onToggleArm,
  onUpdate,
  onSave,
  onFocus,
}: {
  layer: LayerState;
  originalLayer: LayerState | undefined;
  isArmed: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggleArm: () => void;
  onUpdate: (updated: LayerState) => void;
  onSave: (layer: LayerState) => void;
  onFocus: (layerId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(isSelected);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isLodDebugOpen, setIsLodDebugOpen] = useState(false);
  // The render graph is the editing surface for contrast/colormap now —
  // open it by default when the card expands.
  const [isRenderGraphOpen, setIsRenderGraphOpen] = useState(true);
  const dirty = isLayerDirty(layer, originalLayer);
  const lodDebugInfo = useViewerStore((s) => s.lodDebugInfo);
  const currentLodInfo = lodDebugInfo[layer.id];

  // Display chrome derives from the render graph's primary channel — the
  // graph is the single rendering truth; flat fields are just its fold.
  const primaryTransfer = layer.channels[0]?.transfer;
  const displayColormap = primaryTransfer?.colormap ?? layer.colormap ?? ColorMap.Viridis;
  const displayColor = primaryTransfer?.color ?? layer.color;
  const previewGradient = colormapGradientCSS(displayColormap, 18, displayColor);

  const cardStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(135deg, rgba(9, 9, 11, 0.90) 0%, rgba(24, 24, 27, 0.72) 48%, rgba(9, 9, 11, 0.92) 100%), ${previewGradient}`,
    }),
    [previewGradient],
  );

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

  const isOpen = isExpanded;

  return (
    <div
      className={`group cursor-pointer overflow-hidden border transition-all rounded rounded-xl overflow-hidden ${
        isSelected
          ? "border-white/40 shadow-lg shadow-black/25"
          : "border-white/10 hover:border-white/20 hover:shadow-md hover:shadow-black/20"
      } ${layer.visible === false ? "opacity-60" : ""}`}
      style={cardStyle}
      onClick={onSelect}
    >
      <Collapsible open={isOpen} onOpenChange={setIsExpanded}>
        <div className="border border-white/10 bg-black/20 backdrop-blur-sm rounded rounded-xl">
          <div className="px-2.5 py-2">
            <div className="flex items-start gap-2 h-full my-auto">
              <span
                className=" h-3 w-3 shrink-0 rounded-full ring-1 ring-black/20 my-auto"
                style={{
                  background:
                    displayColormap === ColorMap.Intensity
                      ? getLayerColorCSS(displayColor)
                      : colormapGradientCSS(displayColormap, 12),
                }}
              />
              <div className="min-w-0 flex-1 gap-2 flex flex-row h-full my-auto">
                <div className="truncate text-xs font-bold text-white/95 my-auto">
                  {layer.lens.activeAnchors.filter((a) => a.channelLabel)?.[0]?.channelLabel?.label ?? "Untitled Layer"}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-white/60">
                  {dirty && (
                    <span className="rounded-full border border-yellow-300/20 bg-yellow-300/10 px-1.5 py-0.5 text-yellow-100">
                      Unsaved
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-0.5 my-auto">
                <Button
                  variant="ghost"
                  size="xs"
                  className={`h-6 px-1.5 shrink-0 text-[9px] transition-colors ${
                    isArmed
                      ? "bg-cyan-400/15 text-cyan-100 hover:bg-cyan-400/20 hover:text-cyan-50"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                  title={isArmed ? "Disarm ROI constraints for this layer" : "Arm this layer for ROI constraints"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleArm();
                  }}
                >
                  <Crosshair className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-6 w-6 shrink-0 p-0 text-white/75 hover:bg-white/10 hover:text-white"
                  title="Toggle Visibility"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate({ ...layer, visible: layer.visible === false ? true : false });
                  }}
                >
                  {layer.visible !== false ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3 text-white/50" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-6 w-6 shrink-0 p-0 text-white/75 hover:bg-white/10 hover:text-white"
                  title="Fit camera to layer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFocus(layer.id);
                  }}
                >
                  <Focus className="h-3 w-3" />
                </Button>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 w-6 shrink-0 p-0 text-white/75 hover:bg-white/10 hover:text-white"
                    title={isOpen ? "Collapse layer settings" : "Expand layer settings"}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </div>
          <CollapsibleContent>
            <div
              className="space-y-2 border-t border-white/10 px-2.5 pb-2.5 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Contrast, colormap, color and the histogram all live in the
                  render graph below — the graph is the single rendering
                  truth; there are no flat-field controls anymore. */}

              <Collapsible open={isRenderGraphOpen} onOpenChange={setIsRenderGraphOpen}>
                <div className="rounded-md border border-white/10 bg-black/10">
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center gap-1.5 px-2 py-1.5 text-[10px] text-white/60 transition-colors hover:text-white/85">
                      <span>Render graph</span>
                      <span className="text-white/35">channels, contrast, colormap & projection</span>
                      <ChevronDown
                        className={`ml-auto h-3 w-3 transition-transform duration-200 ${
                          isRenderGraphOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-white/10 px-2 py-2 text-[10px] text-white/85">
                      <RenderGraphSection layer={layer} />
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>

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
                            value={layer.fixedLOD == null ? "auto" : layer.fixedLOD.toString()}
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
                              <SelectItem value="auto" className="text-xs">Auto (Responsive)</SelectItem>
                              {layer.lens.dataset.dataArrays.map((arr, idx) => (
                                <SelectItem key={idx} value={idx.toString()} className="text-xs">
                                  Level {idx} {arr.store.shape ? `(${arr.store.shape.join("x")})` : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {currentLodInfo?.renderedLevels && (
                            <Collapsible open={isLodDebugOpen} onOpenChange={setIsLodDebugOpen}>
                              <div className="mt-1 rounded border border-white/10 bg-black/10">
                                <CollapsibleTrigger asChild>
                                  <button className="flex w-full items-center gap-1.5 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-white/45 transition-colors hover:text-white/75">
                                    <span>LOD Debug</span>
                                    <span className="text-white/30">{currentLodInfo.renderedLevels.length} levels</span>
                                    <ChevronDown
                                      className={`ml-auto h-3 w-3 transition-transform duration-200 ${
                                        isLodDebugOpen ? "rotate-180" : ""
                                      }`}
                                    />
                                  </button>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="flex flex-wrap gap-1 border-t border-white/10 px-2 py-2 text-[9px]">
                                    {currentLodInfo.renderedLevels.map((lvl, index) => (
                                      <div
                                        key={lvl}
                                        className={`rounded px-1.5 py-0.5 ${
                                          index === 0
                                            ? "bg-primary/20 text-primary"
                                            : "bg-white/10 text-white/50"
                                        }`}
                                        title={index === 0 ? "Primary LOD" : "Z-buffered fallback LOD"}
                                      >
                                        LOD {lvl} {index > 0 && "(Z-Buf)"}
                                      </div>
                                    ))}
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

              {dirty && (
                <Button
                  variant="outline"
                  size="xs"
                  className="h-7 border-white/10 bg-black/20 text-[10px] text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave(layer);
                  }}
                >
                  <Save className="mr-1 h-3 w-3" />
                  Save changes
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};
