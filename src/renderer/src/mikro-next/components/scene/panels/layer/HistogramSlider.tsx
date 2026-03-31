import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ColorMap } from "@/mikro-next/api/graphql";
import { useMemo, useState } from "react";
import { RotateCcw, ZoomIn } from "lucide-react";
import { sampleColormapCSS } from "./colormap-utils";

const SVG_HEIGHT = 56;
const MIN_VIEW_SPAN = 8;

export const HistogramSlider = ({
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
  const n = bins.length;

  const [viewRange, setViewRange] = useState<{
    start: number;
    end: number;
    binsLen: number;
  }>({
    start: 0,
    end: n - 1,
    binsLen: n,
  });

  const viewStart = viewRange.binsLen === n ? viewRange.start : 0;
  const viewEnd = viewRange.binsLen === n ? viewRange.end : n - 1;

  const visibleBins = useMemo(
    () => histogram.slice(viewStart, viewEnd + 1),
    [histogram, viewStart, viewEnd],
  );

  const maxCount = useMemo(() => Math.max(...visibleBins, 1), [visibleBins]);

  const visibleBarColors = useMemo(
    () =>
      Array.from({ length: viewEnd - viewStart + 1 }, (_, i) =>
        sampleColormapCSS(
          colormap,
          n > 1 ? (viewStart + i) / (n - 1) : 0,
        ),
      ),
    [viewStart, viewEnd, n, colormap],
  );

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const span = viewEnd - viewStart;
    const center = viewStart + mouseX * span;
    const zoomFactor = e.deltaY > 0 ? 1.15 : 0.85;
    let newSpan = Math.round(span * zoomFactor);
    newSpan = Math.max(MIN_VIEW_SPAN, Math.min(n - 1, newSpan));
    let newStart = Math.round(center - mouseX * newSpan);
    newStart = Math.max(0, Math.min(n - 1 - newSpan, newStart));
    setViewRange({ start: newStart, end: newStart + newSpan, binsLen: n });
  };

  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragNorm, setDragNorm] = useState<number | null>(null);

  const normFromMouse = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    return (viewStart + localX * (viewEnd - viewStart)) / (n - 1);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const norm = normFromMouse(e);
    setDragStart(norm);
    setDragNorm(norm);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (dragStart === null) return;
    setDragNorm(normFromMouse(e));
  };

  const handleMouseUp = () => {
    if (dragStart !== null && dragNorm !== null) {
      const newMin = Math.max(0, Math.min(dragStart, dragNorm));
      const newMax = Math.min(1, Math.max(dragStart, dragNorm));
      if (Math.abs(newMax - newMin) > 0.005) {
        onChange(newMin, newMax);
      }
    }
    setDragStart(null);
    setDragNorm(null);
  };

  const toSvgX = (globalNorm: number) => {
    const span = viewEnd - viewStart;
    if (span === 0) return 50;
    return ((globalNorm * (n - 1) - viewStart) / span) * 100;
  };

  const selStart =
    dragStart !== null && dragNorm !== null
      ? Math.min(dragStart, dragNorm)
      : null;
  const selEnd =
    dragStart !== null && dragNorm !== null
      ? Math.max(dragStart, dragNorm)
      : null;

  const visibleCount = viewEnd - viewStart + 1;
  const barWidth = visibleCount > 0 ? 100 / visibleCount : 100;
  const isZoomed = viewStart > 0 || viewEnd < n - 1;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">Contrast</span>
        <div className="flex items-center gap-1">
          {isZoomed && (
            <button
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                setViewRange({ start: 0, end: n - 1, binsLen: n });
              }}
              title="Reset zoom"
            >
              <ZoomIn className="h-3 w-3" />
            </button>
          )}
          <span className="font-mono">
            {climMin.toFixed(3)} – {climMax.toFixed(3)}
          </span>
        </div>
      </div>
      <svg
        className="w-full cursor-crosshair select-none rounded"
        viewBox={`0 0 100 ${SVG_HEIGHT}`}
        preserveAspectRatio="none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ height: SVG_HEIGHT }}
      >
        <rect
          x={0}
          y={0}
          width={100}
          height={SVG_HEIGHT}
          fill="rgba(0,0,0,0.3)"
        />
        {(() => {
          const x1 = Math.max(0, toSvgX(climMin));
          const x2 = Math.min(100, toSvgX(climMax));
          if (x2 > x1) {
            return (
              <rect
                x={x1}
                y={0}
                width={x2 - x1}
                height={SVG_HEIGHT}
                fill="rgba(255,255,255,0.06)"
              />
            );
          }
          return null;
        })()}
        {visibleBins.map((count, i) => {
          const globalIdx = viewStart + i;
          const globalNorm = n > 1 ? globalIdx / (n - 1) : 0;
          const h = (count / maxCount) * SVG_HEIGHT;
          const inRange = globalNorm >= climMin && globalNorm <= climMax;
          return (
            <rect
              key={globalIdx}
              x={i * barWidth}
              y={SVG_HEIGHT - h}
              width={barWidth + 0.15}
              height={h}
              fill={
                inRange ? visibleBarColors[i] : "rgba(255,255,255,0.06)"
              }
            />
          );
        })}
        {[climMin, climMax].map((v, i) => {
          const x = toSvgX(v);
          if (x < 0 || x > 100) return null;
          return (
            <line
              key={i}
              x1={x}
              y1={0}
              x2={x}
              y2={SVG_HEIGHT}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={0.4}
              strokeDasharray="2,2"
            />
          );
        })}
        {selStart != null && selEnd != null && (
          <rect
            x={Math.max(0, toSvgX(selStart))}
            y={0}
            width={
              Math.min(100, toSvgX(selEnd)) -
              Math.max(0, toSvgX(selStart))
            }
            height={SVG_HEIGHT}
            fill="rgba(250,204,21,0.2)"
          />
        )}
      </svg>
      <Slider
        min={0}
        max={1}
        step={0.001}
        value={[climMin, climMax]}
        onValueChange={([newMin, newMax]) => onChange(newMin, newMax)}
      />
      <div className="flex gap-0.5">
        {p1 != null && p99 != null && (
          <Button
            variant="ghost"
            size="xs"
            className="text-[10px] h-5 flex-1 px-1"
            onClick={() => onChange(p1, p99)}
          >
            Auto
          </Button>
        )}
        {histMin != null && histMax != null && (
          <Button
            variant="ghost"
            size="xs"
            className="text-[10px] h-5 flex-1 px-1"
            onClick={() => onChange(histMin, histMax)}
          >
            Min/Max
          </Button>
        )}
        <Button
          variant="ghost"
          size="xs"
          className="text-[10px] h-5 flex-1 px-1"
          onClick={() => onChange(0, 1)}
        >
          <RotateCcw className="h-2.5 w-2.5 mr-0.5" />
          Reset
        </Button>
      </div>
    </div>
  );
};
