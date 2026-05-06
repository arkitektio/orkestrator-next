import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ColorMap } from "@/mikro-next/api/graphql";
import { useEffect, useMemo, useState } from "react";
import { LocateFixed, RotateCcw } from "lucide-react";
import { sampleColormapCSS } from "./colormap-utils";
import { formatContrastValue, toPercentString } from "./contrast-utils";

const SVG_HEIGHT = 56;

export const HistogramSlider = ({
  bins,
  histogram,
  valueMin,
  valueMax,
  colormap,
  p1,
  p99,
  histMin,
  histMax,
  dtypeMin,
  dtypeMax,
  onChange,
}: {
  bins: number[];
  histogram: number[];
  valueMin: number;
  valueMax: number;
  colormap: ColorMap | null | undefined;
  p1: number | null | undefined;
  p99: number | null | undefined;
  histMin: number | null | undefined;
  histMax: number | null | undefined;
  dtypeMin: number;
  dtypeMax: number;
  onChange: (min: number, max: number) => void;
}) => {
  const n = histogram.length;
  const binValues = useMemo(() => {
    if (bins.length === histogram.length && bins.length > 0) {
      return bins;
    }

    const domainStart = histMin ?? dtypeMin;
    const domainEnd = histMax ?? dtypeMax;
    if (histogram.length <= 1) {
      return [domainStart];
    }

    return Array.from({ length: histogram.length }, (_, index) => {
      const ratio = index / (histogram.length - 1);
      return domainStart + (domainEnd - domainStart) * ratio;
    });
  }, [bins, histogram.length, histMin, histMax, dtypeMin, dtypeMax]);

  const domainMin = useMemo(
    () => histMin ?? binValues[0] ?? dtypeMin,
    [histMin, binValues, dtypeMin],
  );
  const domainMax = useMemo(
    () => histMax ?? binValues[binValues.length - 1] ?? dtypeMax,
    [histMax, binValues, dtypeMax],
  );
  const minimumViewSpan = useMemo(
    () => Math.max((domainMax - domainMin) / Math.max(n, 1) * 8, Number.EPSILON),
    [domainMax, domainMin, n],
  );

  const [viewRange, setViewRange] = useState<{
    start: number;
    end: number;
  }>({
    start: domainMin,
    end: domainMax,
  });

  const [draftMin, setDraftMin] = useState("");
  const [draftMax, setDraftMax] = useState("");

  useEffect(() => {
    setViewRange((current) => {
      const nextStart = Math.max(domainMin, Math.min(current.start, domainMax));
      const nextEnd = Math.min(domainMax, Math.max(current.end, domainMin));
      if (nextEnd - nextStart < minimumViewSpan) {
        return { start: domainMin, end: domainMax };
      }
      return { start: nextStart, end: nextEnd };
    });
  }, [domainMin, domainMax, minimumViewSpan]);

  useEffect(() => {
    setDraftMin(String(valueMin));
    setDraftMax(String(valueMax));
  }, [valueMin, valueMax]);

  const viewStart = viewRange.start;
  const viewEnd = viewRange.end;

  const visibleIndices = useMemo(() => {
    const indices = binValues.reduce<number[]>((acc, value, index) => {
      if (value >= viewStart && value <= viewEnd) {
        acc.push(index);
      }
      return acc;
    }, []);

    if (indices.length > 0) return indices;
    if (binValues.length === 0) return [];

    const nearestIndex = binValues.reduce(
      (bestIndex, value, index) =>
        Math.abs(value - viewStart) < Math.abs(binValues[bestIndex] - viewStart)
          ? index
          : bestIndex,
      0,
    );
    return [nearestIndex];
  }, [binValues, viewStart, viewEnd]);

  const visibleBins = useMemo(
    () => visibleIndices.map((index) => histogram[index] ?? 0),
    [histogram, visibleIndices],
  );

  const maxCount = useMemo(() => Math.max(...visibleBins, 1), [visibleBins]);
  const overviewMaxCount = useMemo(() => Math.max(...histogram, 1), [histogram]);

  const visibleBarColors = useMemo(
    () =>
      visibleIndices.map((globalIndex) =>
        sampleColormapCSS(
          colormap,
          n > 1 ? globalIndex / (n - 1) : 0,
        ),
      ),
    [visibleIndices, n, colormap],
  );

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const span = viewEnd - viewStart;
    const center = viewStart + mouseX * span;
    const zoomFactor = e.deltaY > 0 ? 1.15 : 0.85;
    let newSpan = span * zoomFactor;
    newSpan = Math.max(minimumViewSpan, Math.min(domainMax - domainMin, newSpan));
    let newStart = center - mouseX * newSpan;
    newStart = Math.max(domainMin, Math.min(domainMax - newSpan, newStart));
    setViewRange({ start: newStart, end: newStart + newSpan });
  };

  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragNorm, setDragNorm] = useState<number | null>(null);

  const normFromMouse = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    return viewStart + localX * (viewEnd - viewStart);
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
      const newMin = Math.max(domainMin, Math.min(dragStart, dragNorm));
      const newMax = Math.min(domainMax, Math.max(dragStart, dragNorm));
      if (Math.abs(newMax - newMin) > minimumViewSpan / 8) {
        onChange(newMin, newMax);
      }
    }
    setDragStart(null);
    setDragNorm(null);
  };

  const toSvgX = (globalNorm: number) => {
    const span = viewEnd - viewStart;
    if (span === 0) return 50;
    return ((globalNorm - viewStart) / span) * 100;
  };

  const toOverviewX = (value: number) => {
    const span = domainMax - domainMin;
    if (span === 0) return 50;
    return ((value - domainMin) / span) * 100;
  };

  const selStart =
    dragStart !== null && dragNorm !== null
      ? Math.min(dragStart, dragNorm)
      : null;
  const selEnd =
    dragStart !== null && dragNorm !== null
      ? Math.max(dragStart, dragNorm)
      : null;

  const barWidth = visibleBins.length > 0 ? 100 / visibleBins.length : 100;
  const isZoomed = viewStart > domainMin || viewEnd < domainMax;

  const detailSliderStep = Math.max((viewEnd - viewStart) / 1000, 0.000001);
  const brushSliderStep = Math.max((domainMax - domainMin) / 1000, 0.000001);

  const commitDraft = () => {
    const parsedMin = Number.parseFloat(draftMin);
    const parsedMax = Number.parseFloat(draftMax);

    if (!Number.isFinite(parsedMin) || !Number.isFinite(parsedMax)) {
      setDraftMin(String(valueMin));
      setDraftMax(String(valueMax));
      return;
    }

    onChange(parsedMin, parsedMax);
  };

  const focusCurrentRange = () => {
    const selectionSpan = Math.max(valueMax - valueMin, minimumViewSpan);
    const padding = selectionSpan * 0.35;
    const nextStart = Math.max(domainMin, valueMin - padding);
    const nextEnd = Math.min(domainMax, valueMax + padding);
    if (nextEnd - nextStart < minimumViewSpan) {
      setViewRange({ start: domainMin, end: domainMax });
      return;
    }
    setViewRange({ start: nextStart, end: nextEnd });
  };

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">Contrast</span>
        <div className="flex items-center gap-1">
          <span className="font-mono">
            {formatContrastValue(valueMin)} – {formatContrastValue(valueMax)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between text-[9px] text-muted-foreground">
        <span>{toPercentString(valueMin, dtypeMin, dtypeMax)}</span>
        <span>{toPercentString(valueMax, dtypeMin, dtypeMax)}</span>
      </div>
      <div className="rounded border border-border/40 bg-black/20 px-1.5 py-1">
        <div className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground/80">Focus Window</div>
        <svg
          className="mt-1 h-5 w-full"
          viewBox="0 0 100 18"
          preserveAspectRatio="none"
        >
          <rect x={0} y={0} width={100} height={18} fill="rgba(255,255,255,0.03)" />
          {histogram.map((count, index) => {
            const height = (count / overviewMaxCount) * 18;
            const x = (index / Math.max(histogram.length, 1)) * 100;
            const width = 100 / Math.max(histogram.length, 1);
            return (
              <rect
                key={`overview-${index}`}
                x={x}
                y={18 - height}
                width={width + 0.1}
                height={height}
                fill="rgba(255,255,255,0.18)"
              />
            );
          })}
          <rect
            x={0}
            y={0}
            width={Math.max(0, toOverviewX(viewStart))}
            height={18}
            fill="rgba(0,0,0,0.45)"
          />
          <rect
            x={Math.max(0, toOverviewX(viewEnd))}
            y={0}
            width={Math.max(0, 100 - toOverviewX(viewEnd))}
            height={18}
            fill="rgba(0,0,0,0.45)"
          />
          <rect
            x={Math.max(0, toOverviewX(viewStart))}
            y={0}
            width={Math.max(0, toOverviewX(viewEnd) - toOverviewX(viewStart))}
            height={18}
            fill="rgba(250,204,21,0.16)"
            stroke="rgba(250,204,21,0.7)"
            strokeWidth={0.5}
          />
        </svg>
        <Slider
          min={domainMin}
          max={domainMax}
          step={brushSliderStep}
          value={[viewStart, viewEnd]}
          onValueChange={([nextStart, nextEnd]) => {
            if (nextEnd - nextStart < minimumViewSpan) return;
            setViewRange({ start: nextStart, end: nextEnd });
          }}
          className="py-1"
        />
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
          const x1 = Math.max(0, toSvgX(valueMin));
          const x2 = Math.min(100, toSvgX(valueMax));
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
          const globalIdx = visibleIndices[i];
          const globalValue = binValues[globalIdx] ?? valueMin;
          const h = (count / maxCount) * SVG_HEIGHT;
          const inRange = globalValue >= valueMin && globalValue <= valueMax;
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
        {[valueMin, valueMax].map((v, i) => {
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
      <div className="grid grid-cols-2 gap-1">
        <Input
          value={draftMin}
          onChange={(event) => setDraftMin(event.target.value)}
          onBlur={commitDraft}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitDraft();
            }
          }}
          className="h-6 px-2 text-[10px] font-mono"
        />
        <Input
          value={draftMax}
          onChange={(event) => setDraftMax(event.target.value)}
          onBlur={commitDraft}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitDraft();
            }
          }}
          className="h-6 px-2 text-[10px] font-mono"
        />
      </div>
      <Slider
        min={viewStart}
        max={viewEnd}
        step={detailSliderStep}
        value={[
          Math.max(viewStart, Math.min(valueMin, viewEnd)),
          Math.max(viewStart, Math.min(valueMax, viewEnd)),
        ]}
        onValueChange={([newMin, newMax]) => onChange(newMin, newMax)}
      />
      <div className="flex gap-0.5">
        {isZoomed && (
          <Button
            variant="ghost"
            size="xs"
            className="text-[10px] h-5 flex-1 px-1"
            onClick={focusCurrentRange}
          >
            <LocateFixed className="h-2.5 w-2.5 mr-0.5" />
            Focus
          </Button>
        )}
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
          onClick={() => {
            setViewRange({ start: domainMin, end: domainMax });
            onChange(dtypeMin, dtypeMax);
          }}
        >
          <RotateCcw className="h-2.5 w-2.5 mr-0.5" />
          Reset
        </Button>
      </div>
    </div>
  );
};
