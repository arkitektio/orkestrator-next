import { useCallback, useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  ColorMap,
  ColumnControl,
  useGetTableDatasetLazyQuery,
} from "@/mikro-next/api/graphql";
import { useAttributeServiceOrNull } from "@/mikro-next/lib/attributes/AttributeServiceProvider";
import {
  DISTINCT_LIMIT,
  readColumnDistinct,
  readColumnDomain,
  readColumnHistogram,
  type ColumnDomain,
} from "@/mikro-next/lib/attributes/columnStats";
import {
  COLORMAP_OPTIONS,
  classColorsForPalette,
  colormapGradientCSS,
  instancePaletteCSS,
  paletteOfClassColors,
  sampleColormapCSS,
} from "./colormap-utils";
import { ColormapSelect, type ColormapChoice } from "./ColormapSelect";
import {
  INSTANCE_COLORMAPS,
  type FabriksInstanceColormap,
} from "../../render/fabriks/instanceColormaps";
import { controlForRole, type ColorByEntry, type FilterByEntry } from "./columnOptions";

/**
 * The configure step behind a stored colouring or rule: which colormap paints a
 * measure, which bound or which values a rule keeps.
 *
 * INLINE, not a popover: an `EntryRow` unfolds this under itself when clicked,
 * so the settings live where the entry lives. Mounting IS opening — the row
 * only renders this while unfolded — which keeps the lazy reads below on-open
 * without an `open` flag.
 *
 * WHICH colormaps a colouring offers follows from the COLUMN, not from which
 * control hosts it: a MEASURE takes the continuous `ColorMap` ramps (plus
 * CLIMS — the bounds the ramp runs between, set against the column's
 * histogram); a CATEGORICAL takes the same instance palettes the default
 * instance-id mode offers, persisted as an explicit `classColors` map over the
 * column's distinct values. Both sit in one compact `ColormapSelect` rather
 * than a spread-out list.
 *
 * Serves BOTH layer kinds. Nothing here reads a mesh-only or label-only field:
 * an entry is a table id plus a column name whichever type it came from, and
 * `ColorByEntry` / `FilterByEntry` are the unions over both.
 *
 * A stored entry carries only its table ID and its column NAME — enough to
 * execute, not enough to draw a control — so this resolves the table lazily on
 * mount to learn the column's role, and reads the column's real contents (its
 * numeric range and histogram, its distinct values) straight out of the
 * parquet. The server publishes neither: `withValues` was removed from the
 * options query precisely so the cheap question (which columns exist) stops
 * paying for the expensive one (what is in them), which only the entry being
 * edited ever needs.
 *
 * All reads are on-mount and uncached beyond Apollo's own cache — this is a
 * user unfolding a row, not a hot path.
 */

/**
 * A step fine enough to reach any value in the range without a slider that
 * needs a thousand pixels. An integral column steps by 1 — a count of nuclei
 * has no 3.4 — and anything else divides its own span.
 */
const sliderStep = (domain: { min: number; max: number }): number => {
  const span = domain.max - domain.min;
  if (!(span > 0)) return 1;
  const integral = Number.isInteger(domain.min) && Number.isInteger(domain.max) && span >= 4;
  return integral ? 1 : span / 200;
};

/**
 * A typed bound, kept inside the column's own range. An empty field is not a
 * cleared bound — the write path refuses a rule with no bound at all — so it
 * falls back to the column's edge, which is the widest thing the bound can
 * legally say.
 */
const clampToDomain = (
  raw: string,
  domain: { min: number; max: number },
  fallback: number,
): number => {
  const value = raw.trim() === "" ? fallback : Number(raw);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, domain.min), domain.max);
};

type Draft = {
  colormap?: ColorMap | null;
  classColors?: unknown;
  min?: number | null;
  max?: number | null;
  values?: string[] | null;
  exclude?: boolean;
};

/** Histogram plot height — shorter than the Levels editor's 64: this sits
 * inline in an unfolded row, not in a dedicated transfer editor. */
const HIST_PLOT_HEIGHT = 40;

/**
 * The column's distribution behind a bounds slider, drawn the way the
 * intensity layer's Levels histogram is: an SVG plot whose bars are painted by
 * sampling the COLORMAP along the axis (so the histogram previews the ramp the
 * values will take), with the out-of-selection regions dimmed by two overlay
 * rects and the selection edges marked by dashed lines. A filter rule has no
 * colormap, so its bars stay neutral — same plot, no ramp to preview.
 *
 * Log-scaled counts, same as Levels: attribute columns are routinely dominated
 * by one bin and a linear scale renders as one spike.
 *
 * Pure display — the thumbs below are the control — but it is what turns
 * "pick two numbers" into "put the ramp where the data is".
 */
const HistogramBars = ({
  bins,
  domain,
  selectionMin,
  selectionMax,
  colormap,
}: {
  bins: number[];
  domain: { min: number; max: number };
  selectionMin: number;
  selectionMax: number;
  /** The ramp the bars preview; absent for a filter rule. */
  colormap?: ColorMap | null;
}) => {
  const span = Math.max(domain.max - domain.min, Number.EPSILON);
  const xOf = (v: number) =>
    Math.min(Math.max(((v - domain.min) / span) * 100, 0), 100);

  // Bars deliberately do NOT depend on the selection — the drag moves the two
  // overlay rects below instead of recoloring every bar per tick (the same
  // lesson the Levels editor's bars memo records).
  const bars = useMemo(() => {
    let peak = 1;
    for (const count of bins) if (count > peak) peak = count;
    const maxLog = Math.log1p(peak);
    const width = 100 / bins.length;
    return bins.map((count, index) => {
      if (!(count > 0)) return null;
      const height = Math.max(
        (Math.log1p(count) / maxLog) * HIST_PLOT_HEIGHT,
        // A non-empty bin always shows at least a sliver: a bar that rounds
        // to nothing reads as "no values here", which is a lie.
        2,
      );
      return (
        <rect
          key={index}
          x={index * width}
          y={HIST_PLOT_HEIGHT - height}
          width={width + 0.15}
          height={height}
          fill={
            colormap
              ? sampleColormapCSS(colormap, bins.length > 1 ? index / (bins.length - 1) : 0)
              : "rgba(255,255,255,0.55)"
          }
        />
      );
    });
  }, [bins, colormap]);

  const lo = xOf(selectionMin);
  const hi = xOf(selectionMax);

  return (
    <div className="overflow-hidden rounded border border-white/10 bg-black/25" aria-hidden>
      <svg
        className="block w-full"
        viewBox={`0 0 100 ${HIST_PLOT_HEIGHT}`}
        preserveAspectRatio="none"
        style={{ height: HIST_PLOT_HEIGHT }}
      >
        <rect x={0} y={0} width={100} height={HIST_PLOT_HEIGHT} fill="rgba(0,0,0,0.3)" />
        {bars}
        {/* Out-of-selection dimming: two overlay rects instead of per-bar
            recoloring, so a slider drag moves an attribute on two elements. */}
        {lo > 0 && (
          <rect x={0} y={0} width={lo} height={HIST_PLOT_HEIGHT} fill="rgba(0,0,0,0.6)" />
        )}
        {hi < 100 && (
          <rect
            x={hi}
            y={0}
            width={100 - hi}
            height={HIST_PLOT_HEIGHT}
            fill="rgba(0,0,0,0.6)"
          />
        )}
        {[lo, hi].map((x, index) => (
          <line
            key={index}
            x1={x}
            y1={0}
            x2={x}
            y2={HIST_PLOT_HEIGHT}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={0.4}
            strokeDasharray="2,2"
          />
        ))}
      </svg>
    </div>
  );
};

/**
 * A bound PAIR over a measure column — the one control clims and filter rules
 * share, because both are "two numbers on the column's own range" and only
 * their meaning differs. Never one loose end: the write path refuses a rule
 * naming neither a bound nor values, so "clear the field" is not an available
 * state here — an emptied input snaps back to the column's own edge, which is
 * the widest legal thing the bound can say.
 */
const BoundsControl = ({
  label,
  stored,
  domain,
  histogram,
  colormap,
  onCommit,
}: {
  label: string;
  /** The entry's stored bounds; null/undefined halves fall back to the domain. */
  stored: { min?: number | null; max?: number | null };
  domain: { min: number; max: number };
  histogram: number[] | null;
  /** Paints the histogram's bars with the ramp being climmed; see above. */
  colormap?: ColorMap | null;
  onCommit: (min: number, max: number) => void;
}) => {
  /**
   * The bounds mid-drag, before the slider settles and the entry is written.
   * Tagged with the stored bounds they were dragged FROM, so the fold that
   * brings the server's answer back retires them without an effect having to
   * notice. Unmounting (folding the row) abandons them.
   */
  const [draft, setDraft] = useState<{ min: number; max: number; from: string } | null>(null);
  const storedKey = `${stored.min ?? ""}|${stored.max ?? ""}`;

  /** What the two thumbs sit at: the draft mid-drag, the stored bounds otherwise. */
  const bounds =
    draft && draft.from === storedKey
      ? { min: draft.min, max: draft.max }
      : { min: stored.min ?? domain.min, max: stored.max ?? domain.max };

  /**
   * Always BOTH bounds, always ordered. An entry carrying only the half the
   * user last touched is how an edit turns into an unbounded (and rejected)
   * rule, and a min above its max keeps nothing while reading like a range.
   */
  const commit = useCallback(
    (low: number, high: number) => onCommit(Math.min(low, high), Math.max(low, high)),
    [onCommit],
  );

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[9px] uppercase tracking-[0.08em] text-white/35">{label}</span>
        <button
          type="button"
          className="text-[9px] text-white/40 underline-offset-2 hover:text-white/80 hover:underline"
          onClick={() => commit(domain.min, domain.max)}
        >
          full range
        </button>
      </div>
      {histogram && (
        <HistogramBars
          bins={histogram}
          domain={domain}
          selectionMin={bounds.min}
          selectionMax={bounds.max}
          colormap={colormap}
        />
      )}
      {/* Two thumbs on the column's OWN range: a bound typed blind against an
          unknown domain is how a selection ends up hiding everything, so the
          control is the domain. */}
      <Slider
        min={domain.min}
        max={domain.max}
        step={sliderStep(domain)}
        value={[bounds.min, bounds.max]}
        onValueChange={([low, high]) => setDraft({ min: low, max: high, from: storedKey })}
        onValueCommit={([low, high]) => commit(low, high)}
        className="py-1"
      />
      <div className="flex items-center gap-1">
        <Input
          key={`min:${stored.min ?? ""}`}
          type="number"
          className="h-6 text-[10px]"
          defaultValue={bounds.min}
          onBlur={(event) =>
            commit(clampToDomain(event.target.value, domain, domain.min), bounds.max)
          }
        />
        <span className="text-[9px] text-white/40">…</span>
        <Input
          key={`max:${stored.max ?? ""}`}
          type="number"
          className="h-6 text-[10px]"
          defaultValue={bounds.max}
          onBlur={(event) =>
            commit(bounds.min, clampToDomain(event.target.value, domain, domain.max))
          }
        />
      </div>
      <div className="text-[9px] text-white/35">
        column runs {domain.min} … {domain.max}
      </div>
    </div>
  );
};

export const ColumnEntrySettings = ({
  entry,
  mode,
  onCommit,
}: {
  entry: ColorByEntry | FilterByEntry;
  mode: "color" | "filter";
  onCommit: (patch: Draft) => void;
}) => {
  const service = useAttributeServiceOrNull();
  const [loadTable, tableResult] = useGetTableDatasetLazyQuery();
  const [domain, setDomain] = useState<ColumnDomain>(null);
  const [histogram, setHistogram] = useState<number[] | null>(null);
  const [distinct, setDistinct] = useState<{ values: string[]; truncated: boolean } | null>(
    null,
  );
  const [statsError, setStatsError] = useState<string | null>(null);

  const table = tableResult.data?.tableDataset;
  const column = table?.columns.find((candidate) => candidate.name === entry.column);
  const control = column ? controlForRole(column.role) : null;

  useEffect(() => {
    void loadTable({ variables: { id: entry.table } }).catch((error) => {
      console.warn("[layer] could not resolve the entry's table:", error);
    });
  }, [entry.table, loadTable]);

  // The values read is gated on the ROLE, which only arrives with the table —
  // a distinct scan over a measure column, or a min/max over a label one, is
  // the wrong question asked expensively. A measure reads its domain and then
  // its histogram off that domain, so the bars and the slider agree on the
  // axis by construction.
  useEffect(() => {
    if (!service || !table || !column || !control) return;
    let cancelled = false;
    const target = { table: { store: table.store }, column: { name: column.name } };
    const read =
      control === ColumnControl.Measure
        ? readColumnDomain(service.engine, target).then(async (result) => {
            if (cancelled) return;
            setDomain(result);
            if (!result) return;
            const bins = await readColumnHistogram(service.engine, target, result);
            if (!cancelled) setHistogram(bins);
          })
        : readColumnDistinct(service.engine, target).then((result) => {
            if (!cancelled) setDistinct(result);
          });
    read.catch((error: unknown) => {
      if (cancelled) return;
      setStatsError(error instanceof Error ? error.message : String(error));
    });
    return () => {
      cancelled = true;
    };
  }, [service, table, column, control]);

  const isFilter = mode === "filter";
  const rule = entry as FilterByEntry;
  const colouring = entry as ColorByEntry;
  // The clim fields land with the backend; read them structurally until the
  // generated fragment carries them.
  const clims = entry as { min?: number | null; max?: number | null };
  const selected = useMemo(() => new Set(rule.values ?? []), [rule.values]);

  const toggleValue = useCallback(
    (value: string) => {
      const next = new Set(selected);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      // Never empty: a rule naming no values is the one the write path rejects
      // ("matches every row, which is not a filter"), and "keep nothing" is
      // what `exclude` expresses instead.
      if (next.size === 0) return;
      onCommit({ values: [...next] });
    },
    [selected, onCommit],
  );

  // ------------------------------------------------- colormap select choices
  /** Continuous ramps for a measure colouring. */
  const measureChoices: ColormapChoice[] = useMemo(
    () =>
      COLORMAP_OPTIONS.map((cm) => ({
        value: cm,
        label: cm.toLowerCase(),
        css: colormapGradientCSS(cm, 18),
      })),
    [],
  );

  /**
   * The instance palettes for a categorical colouring — the SAME set the
   * default instance-id mode offers, so "categorical" always means these
   * whichever entry hosts it. "auto" is the derived colour-per-value (a null
   * `classColors`); a palette pick is persisted as an explicit map over the
   * distinct values, so it needs them read first.
   */
  const activePalette = paletteOfClassColors(colouring.classColors);
  const categoricalValue = activePalette ?? (colouring.classColors ? "custom" : "auto");
  const categoricalChoices: ColormapChoice[] = useMemo(() => {
    const choices: ColormapChoice[] = [
      {
        value: "auto",
        label: "auto",
        css: "linear-gradient(90deg, #e879f9, #22d3ee, #a3e635)",
      },
      ...INSTANCE_COLORMAPS.map((name) => ({
        value: name,
        label: name,
        css: instancePaletteCSS(name),
        disabled: !distinct,
      })),
    ];
    // A hand-made map (no palette stamp) is a real state the select has to be
    // able to SHOW, even though it offers no way back into it.
    if (categoricalValue === "custom") {
      choices.push({ value: "custom", label: "custom", css: "none", disabled: true });
    }
    return choices;
  }, [distinct, categoricalValue]);

  const pickCategorical = (value: string) => {
    if (value === "auto") {
      onCommit({ classColors: null });
      return;
    }
    if (!distinct) return;
    onCommit({
      classColors: classColorsForPalette(value as FabriksInstanceColormap, distinct.values),
    });
  };

  return (
    <div className="space-y-2 text-xs">
      {column?.unit != null && (
        <div className="truncate text-[9px] text-white/35">unit: {String(column.unit)}</div>
      )}

      {tableResult.loading && (
        <div className="text-[10px] text-white/40">Resolving column…</div>
      )}
      {!tableResult.loading && table && !column && (
        <div className="text-[10px] text-amber-300/80">
          {table.name} no longer declares a column named “{entry.column}”.
        </div>
      )}
      {statsError && (
        <div className="text-[10px] text-amber-300/80">
          Could not read the column’s values: {statsError}
        </div>
      )}

      {/* ---------------------------------------------------- colouring --- */}
      {!isFilter && control === ColumnControl.Measure && (
        <div className="space-y-1.5">
          <div className="text-[9px] uppercase tracking-[0.08em] text-white/35">colormap</div>
          <ColormapSelect
            value={colouring.colormap ?? ColorMap.Viridis}
            choices={measureChoices}
            onChange={(value) => onCommit({ colormap: value as ColorMap })}
            title="The ramp the column's values are painted with"
          />
          {domain === null && !statsError && (
            <div className="text-[10px] text-white/40">Reading the column’s range…</div>
          )}
          {domain && (
            <>
              <BoundsControl
                label="clims"
                stored={clims}
                domain={domain}
                histogram={histogram}
                colormap={colouring.colormap ?? ColorMap.Viridis}
                onCommit={(min, max) => onCommit({ min, max })}
              />
              <div className="text-[9px] text-white/35">
                the ramp runs between these; values outside clamp to its ends
              </div>
            </>
          )}
        </div>
      )}
      {!isFilter && control === ColumnControl.Categorical && (
        <div className="space-y-1.5">
          <div className="text-[9px] uppercase tracking-[0.08em] text-white/35">palette</div>
          <ColormapSelect
            value={categoricalValue}
            choices={categoricalChoices}
            onChange={pickCategorical}
            title="Each distinct value takes its own colour from this palette"
          />
          {distinct && (
            <div className="text-[9px] text-white/35">
              {distinct.values.length}
              {distinct.truncated ? "+" : ""} distinct values, a colour each
            </div>
          )}
          {distinct?.truncated && activePalette && (
            <div className="text-[9px] text-amber-300/80">
              More than {DISTINCT_LIMIT} distinct values — the palette names only
              the first {DISTINCT_LIMIT}; the rest keep their derived colour.
            </div>
          )}
        </div>
      )}

      {/* -------------------------------------------------------- rule ---- */}
      {isFilter && control === ColumnControl.Measure && (
        <div className="space-y-1.5">
          {domain === null && !statsError && (
            <div className="text-[10px] text-white/40">Reading the column’s range…</div>
          )}
          {domain && (
            <BoundsControl
              label="keep between"
              stored={rule}
              domain={domain}
              histogram={histogram}
              onCommit={(min, max) => onCommit({ min, max })}
            />
          )}
        </div>
      )}
      {isFilter && control === ColumnControl.Categorical && (
        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[9px] uppercase tracking-[0.08em] text-white/35">
              keep these values
            </span>
            {distinct && distinct.values.length > 0 && (
              <button
                type="button"
                className="text-[9px] text-white/40 underline-offset-2 hover:text-white/80 hover:underline"
                onClick={() => onCommit({ values: distinct.values })}
              >
                all
              </button>
            )}
          </div>
          {distinct === null && !statsError && (
            <div className="text-[10px] text-white/40">Reading values…</div>
          )}
          {distinct && (
            <div className="max-h-40 space-y-0.5 overflow-y-auto">
              {distinct.values.map((value) => {
                const on = selected.has(value);
                // The last remaining value cannot be unchecked: a rule naming
                // no values is the one the write path rejects, and "keep
                // nothing" is what `invert` below is for.
                const locked = on && selected.size === 1;
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={locked}
                    title={
                      locked
                        ? "A rule has to name at least one value — invert it instead"
                        : on
                          ? `Stop keeping ${value}`
                          : `Also keep ${value}`
                    }
                    onClick={() => toggleValue(value)}
                    className={`flex w-full items-center gap-2 rounded px-1 py-0.5 text-[10px] text-white/70 ${
                      locked ? "opacity-60" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="flex-1 truncate text-left">{value}</span>
                    {on && <Check className="h-3 w-3 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
          {/* A list cut at the cap read as complete is worse than no list: a
              rule authored against it silently drops what it never showed. */}
          {distinct?.truncated && (
            <div className="text-[9px] text-amber-300/80">
              More than {DISTINCT_LIMIT} distinct values — showing the first
              {" "}
              {DISTINCT_LIMIT}. Narrow with a bound instead if this is not the
              whole set you meant.
            </div>
          )}
        </div>
      )}

      {isFilter && (
        <label className="flex items-center justify-between gap-2 border-t border-white/5 pt-2 text-[10px]">
          <span className="text-white/40">invert — drop what matches instead</span>
          <Switch
            checked={rule.exclude}
            onCheckedChange={(checked) => onCommit({ exclude: checked })}
          />
        </label>
      )}
    </div>
  );
};
