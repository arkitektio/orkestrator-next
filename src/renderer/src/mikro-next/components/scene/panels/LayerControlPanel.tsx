import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSceneStore } from "../store/sceneStore";
import { useSelectionStore } from "../store/layerStore";
import { SceneLayerFragment, ColorMap, useUpdateLaterMutation } from "@/mikro-next/api/graphql";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORMAP_OPTIONS = Object.values(ColorMap);

// --- Colormap CSS color sampling ---
const sampleColormapCSS = (colormap: ColorMap | null | undefined, t: number): string => {
  const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
  const toRGB = (r: number, g: number, b: number) =>
    `rgb(${Math.round(clamp(r) * 255)},${Math.round(clamp(g) * 255)},${Math.round(clamp(b) * 255)})`;

  switch (colormap) {
    case ColorMap.Red:
      return toRGB(t, 0, 0);
    case ColorMap.Green:
      return toRGB(0, t, 0);
    case ColorMap.Blue:
      return toRGB(0, 0, t);
    case ColorMap.Grey:
      return toRGB(t, t, t);
    case ColorMap.Cool:
      return toRGB(t, 1 - t, 1);
    case ColorMap.Warm:
      return toRGB(1, t, 0);
    case ColorMap.Plasma: {
      const c0 = [0.050383, 0.029803, 0.527975];
      const c1 = [0.063536, 0.28201, 1.28706];
      const c2 = [0.047002, -0.027879, -0.376627];
      const c3 = [0.081427, -1.81901, 1.43231];
      const c4 = [0.105724, 8.46568, -3.89642];
      return toRGB(
        c0[0] + t * (c1[0] + t * (c2[0] + t * (c3[0] + t * c4[0]))),
        c0[1] + t * (c1[1] + t * (c2[1] + t * (c3[1] + t * c4[1]))),
        c0[2] + t * (c1[2] + t * (c2[2] + t * (c3[2] + t * c4[2])))
      );
    }
    case ColorMap.Inferno: {
      const c0 = [0.0014615, 0.000466, 0.013866];
      const c1 = [0.120565, 0.675951, 0.669823];
      const c2 = [-0.0041943, -0.411412, -0.0498334];
      const c3 = [0.0411583, 1.0048, 0.728707];
      const c4 = [0.0745821, -3.65852, -1.35202];
      return toRGB(
        c0[0] + t * (c1[0] + t * (c2[0] + t * (c3[0] + t * c4[0]))),
        c0[1] + t * (c1[1] + t * (c2[1] + t * (c3[1] + t * c4[1]))),
        c0[2] + t * (c1[2] + t * (c2[2] + t * (c3[2] + t * c4[2])))
      );
    }
    case ColorMap.Magma: {
      const c0 = [0.001462, 0.000466, 0.013866];
      const c1 = [0.078815, 0.674501, 0.973988];
      const c2 = [0.138051, -0.411412, -0.814952];
      const c3 = [-0.126219, 1.0048, 1.66697];
      const c4 = [0.0582235, -3.65852, -2.87069];
      return toRGB(
        c0[0] + t * (c1[0] + t * (c2[0] + t * (c3[0] + t * c4[0]))),
        c0[1] + t * (c1[1] + t * (c2[1] + t * (c3[1] + t * c4[1]))),
        c0[2] + t * (c1[2] + t * (c2[2] + t * (c3[2] + t * c4[2])))
      );
    }
    // Default to viridis
    default: {
      const c0 = [0.277727, 0.005407, 0.3341];
      const c1 = [0.105093, 1.40461, 1.38459];
      const c2 = [-0.330861, 0.214847, 0.095095];
      const c3 = [-4.63423, -5.7991, -19.3324];
      const c4 = [6.22827, 14.1799, 56.6906];
      const c5 = [4.77638, -13.7451, -65.353];
      const c6 = [-5.43546, 4.64585, 26.3124];
      return toRGB(
        c0[0] + t * (c1[0] + t * (c2[0] + t * (c3[0] + t * (c4[0] + t * (c5[0] + t * c6[0]))))),
        c0[1] + t * (c1[1] + t * (c2[1] + t * (c3[1] + t * (c4[1] + t * (c5[1] + t * c6[1]))))),
        c0[2] + t * (c1[2] + t * (c2[2] + t * (c3[2] + t * (c4[2] + t * (c5[2] + t * c6[2])))))
      );
    }
  }
};

// --- Debounced onChange hook ---
const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestCallback = useRef(callback);
  latestCallback.current = callback;

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return useCallback(
    ((...args: any[]) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => latestCallback.current(...args), delay);
    }) as T,
    [delay]
  );
};

const SVG_HEIGHT = 64;

const HistogramSlider = ({
  bins,
  histogram,
  climMin,
  climMax,
  colormap,
  p1,
  p99,
  histMin,
  histMax,
  onChange,
}: {
  bins: number[];
  histogram: number[];
  climMin: number;
  climMax: number;
  colormap: ColorMap | null | undefined;
  p1: number | null | undefined;
  p99: number | null | undefined;
  histMin: number | null | undefined;
  histMax: number | null | undefined;
  onChange: (min: number, max: number) => void;
}) => {
  const maxCount = useMemo(
    () => Math.max(...histogram, 1),
    [histogram]
  );

  const barColors = useMemo(
    () =>
      bins.map((_, i) =>
        sampleColormapCSS(colormap, bins.length > 1 ? i / (bins.length - 1) : 0)
      ),
    [bins, colormap]
  );

  const debouncedOnChange = useDebouncedCallback(onChange, 30);

  const dragging = useRef<{ startNorm: number } | null>(null);
  const [dragNorm, setDragNorm] = useState<number | null>(null);

  const normFromMouseEvent = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const norm = normFromMouseEvent(e);
      dragging.current = { startNorm: norm };
      setDragNorm(norm);
    },
    [normFromMouseEvent]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!dragging.current) return;
      setDragNorm(normFromMouseEvent(e));
    },
    [normFromMouseEvent]
  );

  const handleMouseUp = useCallback(() => {
    if (dragging.current && dragNorm !== null) {
      const a = dragging.current.startNorm;
      const b = dragNorm;
      const newMin = Math.min(a, b);
      const newMax = Math.max(a, b);
      if (Math.abs(newMax - newMin) > 0.005) {
        onChange(newMin, newMax);
      }
    }
    dragging.current = null;
    setDragNorm(null);
  }, [dragNorm, onChange]);

  const selStart = dragging.current
    ? Math.min(dragging.current.startNorm, dragNorm ?? 0)
    : null;
  const selEnd = dragging.current
    ? Math.max(dragging.current.startNorm, dragNorm ?? 0)
    : null;

  const n = bins.length;
  const barWidth = n > 0 ? 100 / n : 100;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">Contrast</span>
        <span className="font-mono">
          {climMin.toFixed(3)} – {climMax.toFixed(3)}
        </span>
      </div>
      <svg
        className="w-full cursor-crosshair select-none"
        viewBox={`0 0 100 ${SVG_HEIGHT}`}
        preserveAspectRatio="none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ height: SVG_HEIGHT }}
      >
        {/* clim range background */}
        <rect
          x={climMin * 100}
          y={0}
          width={(climMax - climMin) * 100}
          height={SVG_HEIGHT}
          fill="rgba(255,255,255,0.08)"
        />
        {/* Histogram bars */}
        {bins.map((_, i) => {
          const norm = n > 1 ? i / (n - 1) : 0;
          const count = histogram[i] ?? 0;
          const h = (count / maxCount) * SVG_HEIGHT;
          const inRange = norm >= climMin && norm <= climMax;
          return (
            <rect
              key={i}
              x={i * barWidth}
              y={SVG_HEIGHT - h}
              width={barWidth + 0.1}
              height={h}
              fill={inRange ? barColors[i] : "rgba(255,255,255,0.08)"}
              rx={0.3}
            />
          );
        })}
        {/* Drag selection overlay */}
        {selStart != null && selEnd != null && (
          <rect
            x={selStart * 100}
            y={0}
            width={(selEnd - selStart) * 100}
            height={SVG_HEIGHT}
            fill="rgba(250,204,21,0.25)"
          />
        )}
      </svg>
      <Slider
        min={0}
        max={1}
        step={0.001}
        value={[climMin, climMax]}
        onValueChange={([newMin, newMax]) => debouncedOnChange(newMin, newMax)}
      />
      <div className="flex gap-1">
        {p1 != null && p99 != null && (
          <Button
            variant="ghost"
            size="xs"
            className="text-[10px] h-5 flex-1"
            onClick={() => onChange(p1, p99)}
          >
            Auto (p1/p99)
          </Button>
        )}
        {histMin != null && histMax != null && (
          <Button
            variant="ghost"
            size="xs"
            className="text-[10px] h-5 flex-1"
            onClick={() => onChange(histMin, histMax)}
          >
            Min/Max
          </Button>
        )}
        <Button
          variant="ghost"
          size="xs"
          className="text-[10px] h-5 flex-1"
          onClick={() => onChange(0, 1)}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

const LayerCard = ({
  layer,
  isSelected,
  onSelect,
  onUpdate,
  onSave,
}: {
  layer: SceneLayerFragment;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updated: SceneLayerFragment) => void;
  onSave: (layer: SceneLayerFragment) => void;
}) => {
  const climMin = layer.climMin ?? 0;
  const climMax = layer.climMax ?? 1;

  return (
    <Card
      className={`p-3 flex flex-col gap-2 cursor-pointer transition-colors ${
        isSelected
          ? "ring-2 ring-primary bg-accent"
          : "hover:bg-accent/50"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-xs truncate">
          {layer.lens.dataset.name}
        </span>
        <span className="text-muted-foreground text-[10px] font-mono">
          {layer.id.slice(0, 8)}
        </span>
      </div>

      {/* Dims */}
      <div className="grid grid-cols-4 gap-1 text-[10px]">
        <span>
          <span className="text-muted-foreground">X:</span>{" "}
          <span className="font-mono">{layer.xDim}</span>
        </span>
        <span>
          <span className="text-muted-foreground">Y:</span>{" "}
          <span className="font-mono">{layer.yDim}</span>
        </span>
        <span>
          <span className="text-muted-foreground">Z:</span>{" "}
          <span className="font-mono">{layer.zDim ?? "—"}</span>
        </span>
        <span>
          <span className="text-muted-foreground">I:</span>{" "}
          <span className="font-mono">{layer.intensityDim}</span>
        </span>
      </div>

      {/* Roll dims */}
      <Button
        variant="outline"
        size="xs"
        onClick={(e) => {
          e.stopPropagation();
          const keys = ["xDim", "yDim", "zDim", "intensityDim"] as const;
          const values = keys.map((k) => layer[k]);
          const rolled = [...values.slice(1), values[0]];
          onUpdate({
            ...layer,
            xDim: rolled[0] ?? layer.xDim,
            yDim: rolled[1] ?? layer.yDim,
            zDim: rolled[2] ?? null,
            intensityDim: rolled[3] ?? layer.intensityDim,
          });
        }}
      >
        Roll Dims
      </Button>

      {/* Contrast limits */}
      <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
        {(() => {
          const anchor = layer.lens.activeAnchors.find((a) => a.valueHistogram);
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

      {/* Colormap selector */}
      <div
        className="flex flex-col gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-muted-foreground text-[10px]">Colormap</span>
        <Select
          value={layer.colormap ?? ColorMap.Viridis}
          onValueChange={(val) =>
            onUpdate({ ...layer, colormap: val as ColorMap })
          }
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COLORMAP_OPTIONS.map((cm) => (
              <SelectItem key={cm} value={cm} className="text-xs">
                {cm.charAt(0) + cm.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Save to server */}
      <Button
        variant="default"
        size="xs"
        onClick={(e) => {
          e.stopPropagation();
          onSave(layer);
        }}
      >
        Save
      </Button>
    </Card>
  );
};

export const LayerControlPanel = () => {
  const layers = useSceneStore((s) => s.layers);
  const updateLayer = useSceneStore((s) => s.updateLayer);
  const selectedLayerId = useSelectionStore((s) => s.selectedLayerId);
  const setSelectedLayerId = useSelectionStore((s) => s.setSelectedLayerId);
  const [updateLater] = useUpdateLaterMutation();

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
  };

  return (
    <div className="absolute top-2 right-2 z-30 w-64 max-h-[calc(100%-1rem)] overflow-y-auto flex flex-col gap-2">
      <span className="text-xs font-semibold text-white px-1">
        Layers ({layers.length})
      </span>
      {layers.map((layer) => (
        <LayerCard
          key={layer.id}
          layer={layer}
          isSelected={layer.id === selectedLayerId}
          onSelect={() =>
            setSelectedLayerId(
              layer.id === selectedLayerId ? null : layer.id
            )
          }
          onUpdate={updateLayer}
          onSave={saveLayer}
        />
      ))}
    </div>
  );
};
