import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorMap } from "@/mikro-next/api/graphql";
import { useMemo, useRef, useState } from "react";
import { Maximize2, RotateCcw } from "lucide-react";
import { sampleColormapCSS } from "./colormap-utils";
import { formatContrastValue } from "./contrast-utils";

/**
 * Photoshop-Levels-style transfer editor: the histogram is ALWAYS drawn over
 * the layer's full dynamic range (no zoom/pan state to get lost in), with the
 * actual transfer curve overlaid and three draggable stops beneath it —
 * black point (climMin), midtone (gamma) and white point (climMax). The
 * midtone stop sits where the curve crosses 0.5 and dragging it solves the
 * gamma that puts 0.5 there (t^gamma = 0.5 → gamma = ln.5/ln t), exactly the
 * shader's `pow((v - climMin)/(climMax - climMin), gamma)` transfer.
 *
 * Bars use log-scaled counts — microscopy histograms are dominated by the
 * background bin and a linear scale renders as one spike.
 */

const PLOT_HEIGHT = 64;
const STRIP_HEIGHT = 11;
const GAMMA_MIN = 0.1;
const GAMMA_MAX = 9.99;
const CURVE_SAMPLES = 96;

export type LevelsValue = { min: number; max: number; gamma: number };

type DragTarget = "black" | "mid" | "white";

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/** Window fraction where the transfer outputs 0.5 (the midtone stop). */
const midFraction = (gamma: number) => Math.pow(0.5, 1 / clamp(gamma, GAMMA_MIN, GAMMA_MAX));

export const LevelsEditor = ({
  bins,
  histogram,
  value,
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
  value: LevelsValue;
  colormap: ColorMap | null | undefined;
  baseColor?: number[] | null;
  p1: number | null | undefined;
  p99: number | null | undefined;
  histMin: number | null | undefined;
  histMax: number | null | undefined;
  dtypeMin: number;
  dtypeMax: number;
  onChange: (next: LevelsValue) => void;
}) => {
  // The histogram extent (the data-focused view). The Reset / Min/Max buttons
  // snap back to this, and it's the floor for the draggable domain.
  const plotMin = histMin ?? dtypeMin;
  const plotMax = histMax ?? dtypeMax;
  // The x domain: the histogram extent grown to always contain the current clim
  // so a native/typed value is visible and reachable instead of snapping back to
  // the histogram edge. The "Full range" button pushes the clim out to the dtype
  // boundaries, which then expands this domain to match.
  const domainMin = Math.min(plotMin, value.min, value.max);
  const domainMax = Math.max(plotMax, value.min, value.max);
  const domainSpan = Math.max(domainMax - domainMin, Number.EPSILON);
  const minSpan = domainSpan / 500;

  const gamma = clamp(value.gamma || 1, GAMMA_MIN, GAMMA_MAX);
  const black = clamp(value.min, domainMin, domainMax);
  const white = clamp(Math.max(value.max, black + minSpan), domainMin, domainMax);
  const mid = black + (white - black) * midFraction(gamma);

  const xOf = (v: number) => ((v - domainMin) / domainSpan) * 100;
  const valueAt = (ratio: number) => domainMin + clamp(ratio, 0, 1) * domainSpan;

  const binValues = useMemo(() => {
    if (bins.length === histogram.length && bins.length > 0) return bins;
    if (histogram.length <= 1) return [domainMin];
    return Array.from(
      { length: histogram.length },
      (_, i) => domainMin + (domainSpan * i) / (histogram.length - 1),
    );
  }, [bins, histogram.length, domainMin, domainSpan]);

  // Log-scaled bar heights (see doc comment).
  const barHeights = useMemo(() => {
    const maxLog = Math.log1p(Math.max(...histogram, 1));
    return histogram.map((count) => (Math.log1p(Math.max(count, 0)) / maxLog) * PLOT_HEIGHT);
  }, [histogram]);

  const barColors = useMemo(
    () =>
      histogram.map((_, i) =>
        sampleColormapCSS(colormap, histogram.length > 1 ? i / (histogram.length - 1) : 0, baseColor),
      ),
    [histogram, colormap, baseColor],
  );

  // Transfer curve over the full domain, in plot coordinates.
  const curvePoints = useMemo(() => {
    const windowSpan = Math.max(white - black, Number.EPSILON);
    const points: string[] = [];
    for (let i = 0; i <= CURVE_SAMPLES; i++) {
      const v = domainMin + (domainSpan * i) / CURVE_SAMPLES;
      const t = clamp((v - black) / windowSpan, 0, 0.999);
      const norm = Math.pow(t, gamma);
      points.push(`${(i / CURVE_SAMPLES) * 100},${PLOT_HEIGHT - norm * PLOT_HEIGHT}`);
    }
    return points.join(" ");
  }, [domainMin, domainSpan, black, white, gamma]);

  // --- Handle dragging -------------------------------------------------------
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ target: DragTarget; black: number; white: number } | null>(null);

  const ratioFromClientX = (clientX: number) => {
    const rect = surfaceRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    return clamp((clientX - rect.left) / rect.width, 0, 1);
  };

  const nearestTarget = (clientX: number): DragTarget => {
    const rect = surfaceRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return "mid";
    const px = clientX - rect.left;
    const candidates: [DragTarget, number][] = [
      ["black", (xOf(black) / 100) * rect.width],
      ["mid", (xOf(mid) / 100) * rect.width],
      ["white", (xOf(white) / 100) * rect.width],
    ];
    candidates.sort((a, b) => Math.abs(px - a[1]) - Math.abs(px - b[1]));
    return candidates[0][0];
  };

  const applyDrag = (clientX: number) => {
    const drag = dragRef.current;
    if (!drag) return;
    const v = valueAt(ratioFromClientX(clientX));
    if (drag.target === "black") {
      onChange({ min: clamp(v, domainMin, drag.white - minSpan), max: drag.white, gamma });
    } else if (drag.target === "white") {
      onChange({ min: drag.black, max: clamp(v, drag.black + minSpan, domainMax), gamma });
    } else {
      const t = clamp((v - drag.black) / Math.max(drag.white - drag.black, Number.EPSILON), 0.02, 0.98);
      const nextGamma = clamp(Math.log(0.5) / Math.log(t), GAMMA_MIN, GAMMA_MAX);
      onChange({ min: drag.black, max: drag.white, gamma: nextGamma });
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { target: nearestTarget(event.clientX), black, white };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    applyDrag(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) applyDrag(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  // --- Numeric drafts --------------------------------------------------------
  const [draft, setDraft] = useState<{ min?: string; gamma?: string; max?: string }>({});
  const commitDraft = () => {
    const parsedMin = draft.min !== undefined ? Number.parseFloat(draft.min) : value.min;
    const parsedMax = draft.max !== undefined ? Number.parseFloat(draft.max) : value.max;
    const parsedGamma = draft.gamma !== undefined ? Number.parseFloat(draft.gamma) : gamma;
    setDraft({});
    if (!Number.isFinite(parsedMin) || !Number.isFinite(parsedMax) || !Number.isFinite(parsedGamma))
      return;
    onChange({
      min: parsedMin,
      max: Math.max(parsedMax, parsedMin + minSpan),
      gamma: clamp(parsedGamma, GAMMA_MIN, GAMMA_MAX),
    });
  };
  const draftProps = (key: "min" | "gamma" | "max", current: string) => ({
    value: draft[key] ?? current,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      setDraft((d) => ({ ...d, [key]: event.target.value })),
    onBlur: commitDraft,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commitDraft();
      }
    },
  });

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">Levels</span>
        <span className="font-mono">
          {formatContrastValue(black)} – {formatContrastValue(white)}
          <span className="text-muted-foreground"> · γ {gamma.toFixed(2)}</span>
        </span>
      </div>

      <div
        ref={surfaceRef}
        className="cursor-ew-resize touch-none select-none rounded border border-white/10 bg-black/25 px-0 pt-1"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <svg
          className="block w-full"
          viewBox={`0 0 100 ${PLOT_HEIGHT}`}
          preserveAspectRatio="none"
          style={{ height: PLOT_HEIGHT }}
        >
          <rect x={0} y={0} width={100} height={PLOT_HEIGHT} fill="rgba(0,0,0,0.3)" />
          {histogram.map((_, i) => {
            const v = binValues[i] ?? domainMin;
            const h = barHeights[i];
            if (h <= 0) return null;
            const inWindow = v >= black && v <= white;
            // Position bars by value (not index) so they bunch correctly when the
            // domain is wider than the data. Width spans to the next bin; the last
            // bin mirrors its predecessor's gap.
            const nextV =
              binValues[i + 1] ?? v + (v - (binValues[i - 1] ?? v));
            const x = xOf(v);
            const w = Math.max(xOf(nextV) - x, 0.15);
            return (
              <rect
                key={i}
                x={x}
                y={PLOT_HEIGHT - h}
                width={w + 0.15}
                height={h}
                fill={inWindow ? barColors[i] : "rgba(255,255,255,0.10)"}
              />
            );
          })}
          {/* Transfer curve + its window edges. */}
          {[black, white].map((v, i) => (
            <line
              key={i}
              x1={xOf(v)}
              y1={0}
              x2={xOf(v)}
              y2={PLOT_HEIGHT}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={0.4}
              strokeDasharray="2,2"
            />
          ))}
          <polyline
            points={curvePoints}
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={0.9}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Photoshop-style stops: black point, midtone (gamma), white point. */}
        <svg
          className="block w-full"
          viewBox={`0 0 100 ${STRIP_HEIGHT}`}
          preserveAspectRatio="none"
          style={{ height: STRIP_HEIGHT + 3 }}
        >
          {(
            [
              [black, "#0a0a0a"],
              [mid, "#9ca3af"],
              [white, "#fafafa"],
            ] as const
          ).map(([v, fill], i) => {
            const x = xOf(v);
            return (
              <polygon
                key={i}
                points={`${x},1 ${x + 2.2},${STRIP_HEIGHT} ${x - 2.2},${STRIP_HEIGHT}`}
                fill={fill}
                stroke="rgba(255,255,255,0.65)"
                strokeWidth={0.3}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-1">
        <Input
          {...draftProps("min", String(value.min))}
          className="h-6 px-2 text-[10px] font-mono"
          title="Black point"
        />
        <Input
          {...draftProps("gamma", gamma.toFixed(2))}
          className="h-6 px-2 text-center text-[10px] font-mono"
          title="Gamma (midtone)"
        />
        <Input
          {...draftProps("max", String(value.max))}
          className="h-6 px-2 text-right text-[10px] font-mono"
          title="White point"
        />
      </div>

      <div className="flex gap-0.5">
        {p1 != null && p99 != null && (
          <Button
            variant="ghost"
            size="xs"
            className="h-5 flex-1 px-1 text-[10px]"
            onClick={() => onChange({ min: p1, max: Math.max(p99, p1 + minSpan), gamma })}
          >
            Auto
          </Button>
        )}
        {histMin != null && histMax != null && (
          <Button
            variant="ghost"
            size="xs"
            className="h-5 flex-1 px-1 text-[10px]"
            onClick={() => onChange({ min: histMin, max: histMax, gamma })}
          >
            Min/Max
          </Button>
        )}
        <Button
          variant="ghost"
          size="xs"
          className="h-5 flex-1 px-1 text-[10px]"
          onClick={() => onChange({ min: dtypeMin, max: dtypeMax, gamma })}
          title="Full dtype range"
        >
          <Maximize2 className="mr-0.5 h-2.5 w-2.5" />
          Full
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className="h-5 flex-1 px-1 text-[10px]"
          onClick={() => onChange({ min: plotMin, max: plotMax, gamma: 1 })}
        >
          <RotateCcw className="mr-0.5 h-2.5 w-2.5" />
          Reset
        </Button>
      </div>
    </div>
  );
};
