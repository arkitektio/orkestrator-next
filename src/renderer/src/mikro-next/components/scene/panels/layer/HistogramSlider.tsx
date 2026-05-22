import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorMap } from "@/mikro-next/api/graphql";
import { useMemo, useRef, useState } from "react";
import { LocateFixed, RotateCcw } from "lucide-react";
import { sampleColormapCSS } from "./colormap-utils";
import { formatContrastValue, toPercentString } from "./contrast-utils";

const SVG_HEIGHT = 56;
const RAIL_HANDLE_PX = 12;

const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const RangeRail = ({
  min,
  max,
  start,
  end,
  minSpan,
  onChange,
  className,
}: {
  min: number;
  max: number;
  start: number;
  end: number;
  minSpan: number;
  onChange: (nextStart: number, nextEnd: number) => void;
  className?: string;
}) => {
  const railRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    mode: "start" | "end" | "range";
    originValue: number;
    start: number;
    end: number;
  } | null>(null);

  const span = Math.max(max - min, Number.EPSILON);
  const clampedStart = clampValue(start, min, max);
  const clampedEnd = clampValue(end, clampedStart, max);
  const startPercent = ((clampedStart - min) / span) * 100;
  const endPercent = ((clampedEnd - min) / span) * 100;

  const valueFromClientX = (clientX: number) => {
    const rect = railRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) {
      return clampedStart;
    }

    const ratio = clampValue((clientX - rect.left) / rect.width, 0, 1);
    return min + ratio * span;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = railRef.current?.getBoundingClientRect();
    if (!rect) return;

    const pointerValue = valueFromClientX(event.clientX);
    const startX = ((clampedStart - min) / span) * rect.width;
    const endX = ((clampedEnd - min) / span) * rect.width;
    const pointerX = event.clientX - rect.left;
    const nearStart = Math.abs(pointerX - startX) <= RAIL_HANDLE_PX;
    const nearEnd = Math.abs(pointerX - endX) <= RAIL_HANDLE_PX;

    let mode: "start" | "end" | "range" = "range";
    if (nearStart && nearEnd) {
      mode = Math.abs(pointerX - startX) <= Math.abs(pointerX - endX)
        ? "start"
        : "end";
    } else if (nearStart) {
      mode = "start";
    } else if (nearEnd) {
      mode = "end";
    } else if (pointerValue < clampedStart) {
      mode = "start";
    } else if (pointerValue > clampedEnd) {
      mode = "end";
    }

    dragRef.current = {
      mode,
      originValue: pointerValue,
      start: clampedStart,
      end: clampedEnd,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const pointerValue = valueFromClientX(event.clientX);
    if (drag.mode === "range") {
      const windowSpan = drag.end - drag.start;
      let nextStart = drag.start + (pointerValue - drag.originValue);
      nextStart = clampValue(nextStart, min, max - windowSpan);
      onChange(nextStart, nextStart + windowSpan);
      return;
    }

    if (drag.mode === "start") {
      const nextStart = clampValue(pointerValue, min, drag.end - minSpan);
      onChange(nextStart, drag.end);
      return;
    }

    const nextEnd = clampValue(pointerValue, drag.start + minSpan, max);
    onChange(drag.start, nextEnd);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={railRef}
      className={[
        "relative h-5 w-full touch-none select-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/8" />
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-black/35"
        style={{ left: 0, width: `${startPercent}%` }}
      />
      <div
        className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full border border-yellow-300/55 bg-yellow-300/20 shadow-[0_0_0_1px_rgba(250,204,21,0.12)]"
        style={{
          left: `${startPercent}%`,
          width: `${Math.max(endPercent - startPercent, 0)}%`,
        }}
      />
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-black/35"
        style={{ left: `${endPercent}%`, right: 0 }}
      />
      {[startPercent, endPercent].map((position, index) => (
        <div
          key={index}
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/65 bg-white shadow-sm"
          style={{ left: `${position}%` }}
        />
      ))}
    </div>
  );
};

export const HistogramSlider = ({
  bins,
  histogram,
  valueMin,
  valueMax,
  colormap,
  baseColor,
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
  baseColor?: number[] | null;
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

  const [draftRange, setDraftRange] = useState<{
    min?: string;
    max?: string;
  }>({});

  const clampedViewRange = useMemo(() => {
    const nextStart = Math.max(domainMin, Math.min(viewRange.start, domainMax));
    const nextEnd = Math.min(domainMax, Math.max(viewRange.end, domainMin));
    if (nextEnd - nextStart < minimumViewSpan) {
      return { start: domainMin, end: domainMax };
    }
    return { start: nextStart, end: nextEnd };
  }, [viewRange, domainMin, domainMax, minimumViewSpan]);

  const draftMin = draftRange.min ?? String(valueMin);
  const draftMax = draftRange.max ?? String(valueMax);
  const viewStart = clampedViewRange.start;
  const viewEnd = clampedViewRange.end;

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
  const visibleBarColors = useMemo(
    () =>
      visibleIndices.map((globalIndex) =>
        sampleColormapCSS(
          colormap,
          n > 1 ? globalIndex / (n - 1) : 0,
          baseColor,
        ),
      ),
    [visibleIndices, n, colormap, baseColor],
  );

  const zoomAroundPoint = (clientX: number, width: number, left: number, deltaY: number) => {
    const mouseX = clampValue((clientX - left) / width, 0, 1);
    const span = viewEnd - viewStart;
    const center = viewStart + mouseX * span;
    const zoomFactor = Math.exp(Math.sign(deltaY) * Math.min(Math.abs(deltaY), 120) / 500);
    let newSpan = span * zoomFactor;
    newSpan = Math.max(minimumViewSpan, Math.min(domainMax - domainMin, newSpan));
    let newStart = center - mouseX * newSpan;
    newStart = Math.max(domainMin, Math.min(domainMax - newSpan, newStart));
    setViewRange({ start: newStart, end: newStart + newSpan });
  };

  const panViewWindow = (delta: number) => {
    const span = viewEnd - viewStart;
    const panAmount = span * Math.min(Math.abs(delta), 160) / 240;
    const direction = Math.sign(delta);
    const nextStart = clampValue(
      viewStart + direction * panAmount,
      domainMin,
      domainMax - span,
    );
    setViewRange({ start: nextStart, end: nextStart + span });
  };

  const handleWheel = (e: React.WheelEvent<HTMLElement | SVGSVGElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    if (e.shiftKey) {
      const panDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      panViewWindow(panDelta);
      return;
    }
    zoomAroundPoint(e.clientX, rect.width, rect.left, e.deltaY);
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
  const detailMinimumSpan = Math.max((viewEnd - viewStart) / 1000, Number.EPSILON);

  const commitDraft = () => {
    const parsedMin = Number.parseFloat(draftMin);
    const parsedMax = Number.parseFloat(draftMax);

    if (!Number.isFinite(parsedMin) || !Number.isFinite(parsedMax)) {
      setDraftRange({});
      return;
    }

    setDraftRange({});
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
      <div className="rounded border border-white/10 bg-black/25 px-1.5 py-1" onWheel={handleWheel}>
        <svg
          className="w-full cursor-crosshair select-none rounded"
          viewBox={`0 0 100 ${SVG_HEIGHT}`}
          preserveAspectRatio="none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
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
        <RangeRail
          min={viewStart}
          max={viewEnd}
          start={Math.max(viewStart, Math.min(valueMin, viewEnd))}
          end={Math.max(viewStart, Math.min(valueMax, viewEnd))}
          minSpan={detailMinimumSpan}
          onChange={(nextMin, nextMax) => onChange(nextMin, nextMax)}
          className="mt-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-1">
        <Input
          value={draftMin}
          onChange={(event) =>
            setDraftRange((current) => ({ ...current, min: event.target.value }))
          }
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
          onChange={(event) =>
            setDraftRange((current) => ({ ...current, max: event.target.value }))
          }
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
