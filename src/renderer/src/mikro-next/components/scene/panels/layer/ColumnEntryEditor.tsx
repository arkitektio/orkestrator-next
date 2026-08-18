import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  type ColumnDomain,
} from "@/mikro-next/lib/attributes/columnStats";
import { COLORMAP_OPTIONS, colormapGradientCSS } from "./colormap-utils";
import { controlForRole, type ColorByEntry, type FilterByEntry } from "./columnOptions";

/**
 * The configure step behind a stored colouring or rule: which colormap paints a
 * measure, which bound or which values a rule keeps.
 *
 * Serves BOTH layer kinds. Nothing here reads a mesh-only or label-only field:
 * an entry is a table id plus a column name whichever type it came from, and
 * `ColorByEntry` / `FilterByEntry` are the unions over both.
 *
 * A stored entry carries only its table ID and its column NAME — enough to
 * execute, not enough to draw a control — so this resolves the table lazily on
 * open to learn the column's role, and reads the column's real contents (its
 * numeric range, its distinct values) straight out of the parquet. The server
 * publishes neither: `withValues` was removed from the options query precisely
 * so the cheap question (which columns exist) stops paying for the expensive
 * one (what is in them), which only the entry being edited ever needs.
 *
 * Both reads are on-open and uncached beyond Apollo's own cache — this is a
 * user opening a popover, not a hot path.
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
  min?: number | null;
  max?: number | null;
  values?: string[] | null;
  exclude?: boolean;
};

export const ColumnEntryEditor = ({
  entry,
  mode,
  onCommit,
}: {
  entry: ColorByEntry | FilterByEntry;
  mode: "color" | "filter";
  onCommit: (patch: Draft) => void;
}) => {
  const [open, setOpen] = useState(false);
  const service = useAttributeServiceOrNull();
  const [loadTable, tableResult] = useGetTableDatasetLazyQuery();
  const [domain, setDomain] = useState<ColumnDomain>(null);
  const [distinct, setDistinct] = useState<{ values: string[]; truncated: boolean } | null>(
    null,
  );
  const [statsError, setStatsError] = useState<string | null>(null);
  /**
   * The bounds mid-drag, before the slider settles and the rule is written.
   * Tagged with the stored rule it was dragged FROM, so the fold that brings
   * the server's answer back retires it without an effect having to notice.
   */
  const [draftBounds, setDraftBounds] = useState<
    { min: number; max: number; from: string } | null
  >(null);

  const table = tableResult.data?.tableDataset;
  const column = table?.columns.find((candidate) => candidate.name === entry.column);
  const control = column ? controlForRole(column.role) : null;

  useEffect(() => {
    if (!open) return;
    void loadTable({ variables: { id: entry.table } }).catch((error) => {
      console.warn("[layer] could not resolve the entry's table:", error);
    });
  }, [open, entry.table, loadTable]);

  // The values read is gated on the ROLE, which only arrives with the table —
  // a distinct scan over a measure column, or a min/max over a label one, is
  // the wrong question asked expensively.
  useEffect(() => {
    if (!open || !service || !table || !column || !control) return;
    let cancelled = false;
    const target = { table: { store: table.store }, column: { name: column.name } };
    const read =
      control === ColumnControl.Measure
        ? readColumnDomain(service.engine, target).then((result) => {
            if (!cancelled) setDomain(result);
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
  }, [open, service, table, column, control]);

  const isFilter = mode === "filter";
  const rule = entry as FilterByEntry;
  const colouring = entry as ColorByEntry;
  const selected = useMemo(() => new Set(rule.values ?? []), [rule.values]);

  // The stored rule is the truth again the moment the fold brings it back: a
  // draft tagged with the previous rule simply stops matching.
  const ruleBoundsKey = `${rule.min ?? ""}|${rule.max ?? ""}`;

  /** What the two thumbs sit at: the draft mid-drag, the stored rule otherwise. */
  const bounds = useMemo(() => {
    if (draftBounds && draftBounds.from === ruleBoundsKey) {
      return { min: draftBounds.min, max: draftBounds.max };
    }
    return {
      min: rule.min ?? domain?.min ?? 0,
      max: rule.max ?? domain?.max ?? 0,
    };
  }, [draftBounds, ruleBoundsKey, rule.min, rule.max, domain]);

  /**
   * Always BOTH bounds, always ordered. A rule carrying only the half the user
   * last touched is how an edit turns into an unbounded (and rejected) rule,
   * and a min above its max keeps nothing while reading like a range.
   */
  const commitBounds = useCallback(
    (low: number, high: number) =>
      onCommit({ min: Math.min(low, high), max: Math.max(low, high) }),
    [onCommit],
  );

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

  return (
    <Popover
      open={open}
      // Closing abandons an uncommitted drag rather than carrying it into the
      // next open — an event handler, so no effect has to chase the state.
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setDraftBounds(null);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          title={isFilter ? "Configure this rule" : "Configure this colouring"}
          className="grid h-4 w-4 shrink-0 place-items-center rounded text-white/30 transition-colors hover:bg-white/10 hover:text-white/90"
        >
          <Settings2 className="h-2.5 w-2.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 space-y-2 p-2 text-xs">
        <div className="truncate text-[10px] text-muted-foreground">
          {entry.label?.trim() || entry.column}
          {column?.unit ? ` · ${String(column.unit)}` : ""}
        </div>

        {tableResult.loading && (
          <div className="text-[10px] text-muted-foreground">Resolving column…</div>
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
          <div className="space-y-1">
            <div className="text-[10px] text-muted-foreground">colormap</div>
            <div className="grid grid-cols-1 gap-0.5">
              {COLORMAP_OPTIONS.map((cm) => (
                <button
                  key={cm}
                  type="button"
                  onClick={() => onCommit({ colormap: cm })}
                  className="flex items-center gap-2 rounded px-1 py-0.5 text-[10px] hover:bg-white/5"
                >
                  <span
                    className="h-2.5 w-8 shrink-0 rounded"
                    style={{ background: colormapGradientCSS(cm, 18) }}
                  />
                  <span className="flex-1 truncate text-left">{cm.toLowerCase()}</span>
                  {colouring.colormap === cm && <Check className="h-3 w-3 shrink-0" />}
                </button>
              ))}
            </div>
            {domain && (
              <div className="text-[9px] text-muted-foreground">
                values run {domain.min} … {domain.max}
              </div>
            )}
          </div>
        )}
        {!isFilter && control === ColumnControl.Categorical && (
          <div className="text-[10px] text-muted-foreground">
            Categorical: each distinct value takes its own colour. A colormap would
            impose an order these values do not have.
            {distinct && (
              <div className="mt-1 text-[9px]">
                {distinct.values.length}
                {distinct.truncated ? "+" : ""} distinct values
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------- rule ---- */}
        {/* A bound PAIR, never one loose end. The write path refuses a rule
            naming neither a bound nor values, so "clear the field" is not an
            available state here — an emptied input snaps back to the column's
            own edge, which is the widest legal thing the bound can say. */}
        {isFilter && control === ColumnControl.Measure && (
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[10px] text-muted-foreground">keep between</span>
              {domain && (
                <button
                  type="button"
                  className="text-[9px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                  onClick={() => onCommit({ min: domain.min, max: domain.max })}
                >
                  full range
                </button>
              )}
            </div>
            {domain === null && !statsError && (
              <div className="text-[10px] text-muted-foreground">Reading the column’s range…</div>
            )}
            {domain && (
              <>
                {/* Two thumbs on the column's OWN range: a bound typed blind
                    against an unknown domain is how a rule ends up hiding
                    everything, so the control is the domain. */}
                <Slider
                  min={domain.min}
                  max={domain.max}
                  step={sliderStep(domain)}
                  value={[bounds.min, bounds.max]}
                  onValueChange={([low, high]) =>
                    setDraftBounds({ min: low, max: high, from: ruleBoundsKey })
                  }
                  onValueCommit={([low, high]) => commitBounds(low, high)}
                  className="py-1"
                />
                <div className="flex items-center gap-1">
                  <Input
                    key={`min:${rule.min ?? ""}`}
                    type="number"
                    className="h-6 text-[10px]"
                    defaultValue={bounds.min}
                    onBlur={(event) =>
                      commitBounds(
                        clampToDomain(event.target.value, domain, domain.min),
                        bounds.max,
                      )
                    }
                  />
                  <span className="text-[9px] text-muted-foreground">…</span>
                  <Input
                    key={`max:${rule.max ?? ""}`}
                    type="number"
                    className="h-6 text-[10px]"
                    defaultValue={bounds.max}
                    onBlur={(event) =>
                      commitBounds(
                        bounds.min,
                        clampToDomain(event.target.value, domain, domain.max),
                      )
                    }
                  />
                </div>
                <div className="text-[9px] text-muted-foreground">
                  column runs {domain.min} … {domain.max}
                </div>
              </>
            )}
          </div>
        )}
        {isFilter && control === ColumnControl.Categorical && (
          <div className="space-y-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[10px] text-muted-foreground">keep these values</span>
              {distinct && distinct.values.length > 0 && (
                <button
                  type="button"
                  className="text-[9px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                  onClick={() => onCommit({ values: distinct.values })}
                >
                  all
                </button>
              )}
            </div>
            {distinct === null && !statsError && (
              <div className="text-[10px] text-muted-foreground">Reading values…</div>
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
                      className={`flex w-full items-center gap-2 rounded px-1 py-0.5 text-[10px] ${
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
            <span className="text-muted-foreground">
              invert — drop what matches instead
            </span>
            <Switch
              checked={rule.exclude}
              onCheckedChange={(checked) => onCommit({ exclude: checked })}
            />
          </label>
        )}
      </PopoverContent>
    </Popover>
  );
};
