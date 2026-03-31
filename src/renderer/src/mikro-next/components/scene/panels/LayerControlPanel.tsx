import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSceneStore } from "../store/sceneStore";
import { useSelectionStore } from "../store/layerStore";
import { SceneLayerFragment, ColorMap, useUpdateLaterMutation } from "@/mikro-next/api/graphql";
import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSceneStore } from "../store/sceneStore";
import { useSelectionStore } from "../store/layerStore";
import { SceneLayerFragment, ColorMap, useUpdateLaterMutation } from "@/mikro-next/api/graphql";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  ReferenceArea,
  ResponsiveContainer,
  Brush,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORMAP_OPTIONS = Object.values(ColorMap);

const HistogramSlider = ({
  bins,
  histogram,
  climMin,
  climMax,
  onChange,
}: {
  bins: number[];
  histogram: number[];
  climMin: number;
  climMax: number;
  onChange: (min: number, max: number) => void;
}) => {
  const chartData = useMemo(
    () =>
      bins.map((bin, i) => ({
        bin: +bin.toFixed(4),
        count: histogram[i] ?? 0,
        norm: bins.length > 1 ? i / (bins.length - 1) : 0,
      })),
    [bins, histogram]
  );

  const dragging = useRef<{ startNorm: number } | null>(null);
  const [dragNorm, setDragNorm] = useState<number | null>(null);

  const normFromMouseEvent = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      return x;
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const norm = normFromMouseEvent(e);
      dragging.current = { startNorm: norm };
      setDragNorm(norm);
    },
    [normFromMouseEvent]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
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

  // Index-based reference area for the current clim range
  const climStartIdx = Math.round(climMin * (bins.length - 1));
  const climEndIdx = Math.round(climMax * (bins.length - 1));
  const climStartBin = chartData[climStartIdx]?.bin ?? 0;
  const climEndBin = chartData[climEndIdx]?.bin ?? 1;

  // Drag selection bins
  const dragStartBin =
    selStart !== null
      ? chartData[Math.round(selStart * (bins.length - 1))]?.bin
      : null;
  const dragEndBin =
    selEnd !== null
      ? chartData[Math.round(selEnd * (bins.length - 1))]?.bin
      : null;

  return (
    <div className="flex flex-col gap-0.5">
      <div
        className="w-full h-16 cursor-crosshair select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barCategoryGap={0}
            barGap={0}
          >
            <XAxis dataKey="bin" hide />
            <ReferenceArea
              x1={climStartBin}
              x2={climEndBin}
              fill="rgba(56,189,248,0.15)"
              strokeOpacity={0}
            />
            {dragStartBin != null && dragEndBin != null && (
              <ReferenceArea
                x1={dragStartBin}
                x2={dragEndBin}
                fill="rgba(250,204,21,0.25)"
                strokeOpacity={0}
              />
            )}
            <Bar dataKey="count" isAnimationActive={false} radius={[1, 1, 0, 0]}>
              {chartData.map((entry, i) => {
                const inRange = entry.norm >= climMin && entry.norm <= climMax;
                return (
                  <Cell
                    key={i}
                    fill={inRange ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.15)"}
                  />
                );
              })}
            </Bar>
            <Brush
              dataKey="bin"
              height={12}
              stroke="rgba(255,255,255,0.3)"
              fill="rgba(0,0,0,0.4)"
              travellerWidth={6}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
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
        onValueChange={([newMin, newMax]) => onChange(newMin, newMax)}
      />
      <Button
        variant="ghost"
        size="xs"
        className="text-[10px] h-5"
        onClick={() => onChange(0, 1)}
      >
        Reset
      </Button>
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
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">Contrast</span>
          <span className="font-mono">
            {climMin.toFixed(3)} – {climMax.toFixed(3)}
          </span>
        </div>

        {/* Histograms from active anchors */}
        {layer.lens.activeAnchors.map((anchor) =>
          anchor.valueHistogram ? (
            <MiniHistogram
              key={anchor.id}
              bins={anchor.valueHistogram.bins}
              histogram={anchor.valueHistogram.histogram}
              climMin={climMin}
              climMax={climMax}
            />
          ) : null
        )}

        <Slider
          min={0}
          max={1}
          step={0.001}
          value={[climMin, climMax]}
          onValueChange={([newMin, newMax]) =>
            onUpdate({ ...layer, climMin: newMin, climMax: newMax })
          }
        />
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
