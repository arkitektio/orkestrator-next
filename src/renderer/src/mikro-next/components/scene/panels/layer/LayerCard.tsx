import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
import { Save, Focus, Eye, EyeOff } from "lucide-react";
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
  const climMin = layer.climMin ?? 0;
  const climMax = layer.climMax ?? 1;
  const dirty = isLayerDirty(layer, originalLayer);
  const lodDebugInfo = useViewerStore((s) => s.lodDebugInfo);
  const currentLodInfo = lodDebugInfo[layer.id];
  const [dtypeMin, dtypeMax] = getLayerDtypeRange(layer);
  const absoluteClimMin = normalizedToAbsolute(climMin, dtypeMin, dtypeMax);
  const absoluteClimMax = normalizedToAbsolute(climMax, dtypeMin, dtypeMax);

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

  return (
    <Card
      className={`flex flex-col gap-1.5 p-2 transition-all cursor-pointer border ${
        isSelected
          ? "ring-1 ring-primary/70 bg-accent/60 border-primary/30"
          : "hover:bg-accent/30 border-transparent"
      } ${layer.visible === false ? "opacity-50 grayscale" : ""}`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="xs"
          className="h-5 w-5 p-0 shrink-0"
          title="Toggle Visibility"
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({ ...layer, visible: layer.visible === false ? true : false });
          }}
        >
          {layer.visible !== false ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
        </Button>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate">
            {layer.lens.dataset.name}
          </div>
        </div>
        <Button
          variant="ghost"
          size="xs"
          className="h-5 w-5 p-0 shrink-0"
          title="Fit camera to layer"
          onClick={(e) => {
            e.stopPropagation();
            onFocus(layer.id);
          }}
        >
          <Focus className="h-3 w-3" />
        </Button>
        {dirty && (
          <div
            className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0"
            title="Unsaved changes"
          />
        )}
      </div>

      {/* Dims row with swap buttons */}
      <div
        className="flex items-center justify-between gap-0"
        onClick={(e) => e.stopPropagation()}
      >
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

      {/* Contrast limits */}
      <div
        className="flex flex-col gap-0.5"
        onClick={(e) => e.stopPropagation()}
      >
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
            <>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Contrast</span>
                <span className="font-mono">
                  {formatContrastValue(absoluteClimMin)} – {formatContrastValue(absoluteClimMax)}
                </span>
              </div>
              <Slider
                min={dtypeMin}
                max={dtypeMax}
                step={Math.max((dtypeMax - dtypeMin) / 1000, 0.000001)}
                value={[absoluteClimMin, absoluteClimMax]}
                onValueChange={([newMin, newMax]) => updateAbsoluteContrast(newMin, newMax)}
              />
            </>
          );
        })()}
      </div>

      {/* LOD selector */}
      {layer.lens.dataset.dataArrays.length > 1 && (
        <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Resolution Level (LOD)</span>
          </div>
          <Select
            value={layer.fixedLOD == null ? "auto" : layer.fixedLOD.toString()}
            onValueChange={(val) =>
              onUpdate({ ...layer, fixedLOD: val === "auto" ? null : parseInt(val) })
            }
          >
            <SelectTrigger className="h-6 text-[10px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto" className="text-xs">Auto (Responsive)</SelectItem>
              {layer.lens.dataset.dataArrays.map((arr, idx) => (
                <SelectItem key={idx} value={idx.toString()} className="text-xs">
                  Level {idx} {arr.store.shape ? `(${arr.store.shape.join('x')})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentLodInfo?.renderedLevels && (
            <div className="flex gap-1 mt-1 text-[9px] flex-wrap">
              {currentLodInfo.renderedLevels.map((lvl, index) => (
                <div
                  key={lvl}
                  className={`px-1.5 py-0.5 rounded ${index === 0 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground opacity-70"}`}
                  title={index === 0 ? "Primary LOD" : "Z-buffered fallback LOD"}
                >
                  LOD {lvl} {index > 0 && " (Z-Buf)"}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Colormap selector with preview gradient */}
      <div
        className="flex flex-col gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-2 w-full rounded-sm"
          style={{
            background: colormapGradientCSS(
              layer.colormap ?? ColorMap.Viridis,
            ),
          }}
        />
        <Select
          value={layer.colormap ?? ColorMap.Viridis}
          onValueChange={(val) =>
            onUpdate({ ...layer, colormap: val as ColorMap })
          }
        >
          <SelectTrigger className="h-6 text-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COLORMAP_OPTIONS.map((cm) => (
              <SelectItem key={cm} value={cm} className="text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-8 rounded-sm shrink-0"
                    style={{ background: colormapGradientCSS(cm, 16) }}
                  />
                  {cm.charAt(0) + cm.slice(1).toLowerCase()}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Save — only if dirty */}
      {dirty && (
        <Button
          variant="outline"
          size="xs"
          className="h-6 text-[10px]"
          onClick={(e) => {
            e.stopPropagation();
            onSave(layer);
          }}
        >
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>
      )}
    </Card>
  );
};
