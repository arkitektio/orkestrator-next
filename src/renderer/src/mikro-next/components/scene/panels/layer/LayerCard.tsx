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
import { Save } from "lucide-react";
import {
  COLORMAP_OPTIONS,
  colormapGradientCSS,
  isLayerDirty,
} from "./colormap-utils";
import { HistogramSlider } from "./HistogramSlider";
import { DimPill } from "./DimPill";

export const LayerCard = ({
  layer,
  originalLayer,
  isSelected,
  onSelect,
  onUpdate,
  onSave,
}: {
  layer: SceneLayerFragment;
  originalLayer: SceneLayerFragment | undefined;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updated: SceneLayerFragment) => void;
  onSave: (layer: SceneLayerFragment) => void;
}) => {
  const climMin = layer.climMin ?? 0;
  const climMax = layer.climMax ?? 1;
  const dirty = isLayerDirty(layer, originalLayer);

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
    } as SceneLayerFragment);
  };

  return (
    <Card
      className={`flex flex-col gap-1.5 p-2 transition-all cursor-pointer border ${
        isSelected
          ? "ring-1 ring-primary/70 bg-accent/60 border-primary/30"
          : "hover:bg-accent/30 border-transparent"
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium truncate">
            {layer.lens.dataset.name}
          </div>
        </div>
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
                climMin={climMin}
                climMax={climMax}
                colormap={layer.colormap}
                p1={vh.p1}
                p99={vh.p99}
                histMin={vh.min}
                histMax={vh.max}
                onChange={(newMin, newMax) =>
                  onUpdate({ ...layer, climMin: newMin, climMax: newMax })
                }
              />
            );
          }
          return (
            <>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Contrast</span>
                <span className="font-mono">
                  {climMin.toFixed(3)} – {climMax.toFixed(3)}
                </span>
              </div>
              <Slider
                min={0}
                max={1}
                step={0.001}
                value={[climMin, climMax]}
                onValueChange={([newMin, newMax]) =>
                  onUpdate({ ...layer, climMin: newMin, climMax: newMax })
                }
              />
            </>
          );
        })()}
      </div>

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
