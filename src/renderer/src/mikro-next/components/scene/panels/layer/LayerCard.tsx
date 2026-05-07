import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SceneLayerFragment,
  ColorMap,
} from "@/mikro-next/api/graphql";
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
  Focus,
  Eye,
  EyeOff,
  Save,
  SlidersHorizontal,
} from "lucide-react";
import { RgbColorPicker } from "react-colorful";
import { useMemo, useState } from "react";
import {
  COLORMAP_OPTIONS,
  colormapGradientCSS,
  isLayerDirty,
} from "./colormap-utils";
import { HistogramSlider } from "./HistogramSlider";
import { DimPill } from "./DimPill";
import { useViewerStore } from "../../store/viewerStore";
import {
  absoluteToNormalized,
  clampAbsoluteRange,
  formatContrastValue,
  getLayerDtypeRange,
  normalizedToAbsolute,
} from "./contrast-utils";

const DEFAULT_INTENSITY_COLOR = [255, 255, 255] as const;

const getLayerColorObject = (color: number[] | null | undefined) => ({
  r: Math.round(color?.[0] ?? DEFAULT_INTENSITY_COLOR[0]),
  g: Math.round(color?.[1] ?? DEFAULT_INTENSITY_COLOR[1]),
  b: Math.round(color?.[2] ?? DEFAULT_INTENSITY_COLOR[2]),
});

const getLayerColorCSS = (color: number[] | null | undefined) => {
  const { r, g, b } = getLayerColorObject(color);
  return `rgb(${r}, ${g}, ${b})`;
};

const formatColormapLabel = (colormap: ColorMap | null | undefined) => {
  const value = colormap ?? ColorMap.Viridis;
  return value.charAt(0) + value.slice(1).toLowerCase();
};

export const LayerCard = ({
  layer,
  originalLayer,
  isSelected,
  onSelect,
  onUpdate,
  onSave,
  onFocus,
}: {
  layer: LayerState;
  originalLayer: LayerState | undefined;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updated: LayerState) => void;
  onSave: (layer: LayerState) => void;
  onFocus: (layerId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(isSelected);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const climMin = layer.climMin ?? 0;
  const climMax = layer.climMax ?? 1;
  const dirty = isLayerDirty(layer, originalLayer);
  const lodDebugInfo = useViewerStore((s) => s.lodDebugInfo);
  const currentLodInfo = lodDebugInfo[layer.id];
  const [dtypeMin, dtypeMax] = getLayerDtypeRange(layer);
  const absoluteClimMin = normalizedToAbsolute(climMin, dtypeMin, dtypeMax);
  const absoluteClimMax = normalizedToAbsolute(climMax, dtypeMin, dtypeMax);
  const previewGradient = colormapGradientCSS(
    layer.colormap ?? ColorMap.Viridis,
    18,
    layer.color,
  );



  const cardStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(135deg, rgba(9, 9, 11, 0.90) 0%, rgba(24, 24, 27, 0.72) 48%, rgba(9, 9, 11, 0.92) 100%), ${previewGradient}`,
    }),
    [previewGradient],
  );

  const dims: { label: string; key: keyof SceneLayerFragment }[] = [
    { label: "X", key: "xDim" },
    { label: "Y", key: "yDim" },
    { label: "Z", key: "zDim" },
    { label: "I", key: "intensityDim" },
  ];

  const swapDims = (
    keyA: keyof SceneLayerFragment,
    keyB: keyof SceneLayerFragment,
  ) => {
    onUpdate({
      ...layer,
      [keyA]: layer[keyB],
      [keyB]: layer[keyA],
    } as LayerState);
  };

  const updateAbsoluteContrast = (nextMin: number, nextMax: number) => {
    const [clampedMin, clampedMax] = clampAbsoluteRange(nextMin, nextMax, dtypeMin, dtypeMax);
    onUpdate({
      ...layer,
      climMin: absoluteToNormalized(clampedMin, dtypeMin, dtypeMax),
      climMax: absoluteToNormalized(clampedMax, dtypeMin, dtypeMax),
    });
  };

  const handleColorChange = (color: { r: number; g: number; b: number }) => {
    onUpdate({
      ...layer,
      color: [Math.round(color.r), Math.round(color.g), Math.round(color.b)],
    });
  };

  const isOpen = isSelected || isExpanded;

  return (
    <Card
      className={`group cursor-pointer overflow-hidden border transition-all ${
        isSelected
          ? "border-white/40 shadow-lg shadow-black/25"
          : "border-white/10 hover:border-white/20 hover:shadow-md hover:shadow-black/20"
      } ${layer.visible === false ? "opacity-60" : ""}`}
      style={cardStyle}
      onClick={onSelect}
    >
      <Collapsible open={isOpen} onOpenChange={setIsExpanded}>
        <div className="border border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="px-2.5 py-2">
            <div className="flex items-start gap-2">
              <span
                className="mt-0.5 h-3 w-3 shrink-0 rounded-full ring-1 ring-black/20"
                style={{
                  background:
                    layer.colormap === ColorMap.Intensity
                      ? getLayerColorCSS(layer.color)
                      : colormapGradientCSS(layer.colormap ?? ColorMap.Viridis, 12),
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-white/95">
                  {layer.lens.dataset.name}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-white/60">
                  <span className="rounded-full border border-white/10 bg-black/20 px-1.5 py-0.5">
                    {formatColormapLabel(layer.colormap)}
                  </span>
                  <span className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-1.5 py-0.5 font-mono">
                    <SlidersHorizontal className="h-2.5 w-2.5" />
                    {formatContrastValue(absoluteClimMin)}-{formatContrastValue(absoluteClimMax)}
                  </span>
                  {dirty && (
                    <span className="rounded-full border border-yellow-300/20 bg-yellow-300/10 px-1.5 py-0.5 text-yellow-100">
                      Unsaved
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-0.5">
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
              <div className="flex flex-col gap-1 rounded-md border border-white/10 bg-black/20 p-2">
                {(() => {
                  const anchor = layer.lens.activeAnchors.find(
                    (a) => a.valueHistogram,
                  );
                  if (anchor?.valueHistogram) {
                    const vh = anchor.valueHistogram;
                    return (
                      <HistogramSlider
                        bins={vh.bins}
                        histogram={vh.histogram}
                        valueMin={absoluteClimMin}
                        valueMax={absoluteClimMax}
                        colormap={layer.colormap}
                        baseColor={layer.color}
                        p1={vh.p1}
                        p99={vh.p99}
                        histMin={vh.min}
                        histMax={vh.max}
                        dtypeMin={dtypeMin}
                        dtypeMax={dtypeMax}
                        onChange={updateAbsoluteContrast}
                      />
                    );
                  }
                  return (
                    <HistogramSlider
                      bins={[]}
                      histogram={[]}
                      valueMin={absoluteClimMin}
                      valueMax={absoluteClimMax}
                      colormap={layer.colormap}
                      baseColor={layer.color}
                      p1={null}
                      p99={null}
                      histMin={dtypeMin}
                      histMax={dtypeMax}
                      dtypeMin={dtypeMin}
                      dtypeMax={dtypeMax}
                      onChange={updateAbsoluteContrast}
                    />
                  );
                })()}
                <div className="mt-1 border-t border-white/10 pt-2">
                  <div className="mb-1 flex items-center justify-between text-[10px] text-white/60">
                    <span>Colormap</span>
                    <span className="text-white/35">
                      {formatColormapLabel(layer.colormap)}
                    </span>
                  </div>
                <Select
                  value={layer.colormap ?? ColorMap.Viridis}
                  onValueChange={(val) =>
                    onUpdate({ ...layer, colormap: val as ColorMap })
                  }
                >
                  <SelectTrigger className="h-7 border-white/10 bg-black/20 text-[10px] text-white/85">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLORMAP_OPTIONS.map((cm) => (
                      <SelectItem key={cm} value={cm} className="text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-8 rounded-sm shrink-0"
                            style={{ background: colormapGradientCSS(cm, 16, layer.color) }}
                          />
                          {formatColormapLabel(cm)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>
              </div>

              {layer.colormap === ColorMap.Intensity && (
                <div className="space-y-1 rounded-md border border-white/10 bg-black/20 p-2">
                  <div className="flex items-center justify-between text-[10px] text-white/60">
                    <span>Intensity Color</span>
                    <span className="font-mono text-white/80">
                      {getLayerColorCSS(layer.color)}
                    </span>
                  </div>
                  <RgbColorPicker
                    color={getLayerColorObject(layer.color)}
                    onChange={handleColorChange}
                    style={{ width: "100%", height: 96 }}
                  />
                </div>
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
                            <div className="mt-1 flex flex-wrap gap-1 text-[9px]">
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
    </Card>
  );
};
