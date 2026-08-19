import { Filter, X } from "lucide-react";
import { memo, useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { ColorMap, ColumnControl } from "@/mikro-next/api/graphql";
import { useAttributeServiceOrNull } from "@/mikro-next/lib/attributes/AttributeServiceProvider";
import { readDefaultFilterRule } from "@/mikro-next/lib/attributes/columnStats";
import { perfMonitor } from "../../managers/perfMonitor";
import { CardSection, EntryRow, RowAction } from "./cardControls";
import { colormapGradientCSS } from "./colormap-utils";
import { ColumnEntrySettings } from "./ColumnEntryEditor";
import { ColumnOptionPicker, type ColumnOptionSource } from "./ColumnOptionPicker";
import {
  activeColorByAfterRemoval,
  activeFilterBysAfterRemoval,
  colorByEntryToInput,
  describeColouring,
  describeFilterRule,
  entryKey,
  entryLabel,
  filterByEntryToInput,
  isJoinedEntry,
  isMeasure,
  JOINED_NOTE,
  toColorByInput,
  toFilterByInput,
  type ColorByClims,
  type ColorByEntry,
  type ColorByInputLike,
  type ColumnOption,
  type FilterByEntry,
  type FilterByInputLike,
} from "./columnOptions";

/**
 * The `color by` / `filters` SECTIONS of the mesh and label layer cards — the
 * two blocks both cards publish over the same FIELD relation, extracted so
 * they exist ONCE and, more importantly, so they are RE-RENDER BOUNDARIES.
 *
 * The cards used to hold every piece of state themselves — the unfold key,
 * the rule error, the selection, a text draft — so a slider tick or an unfold
 * click re-rendered the whole card: every row, every gradient string, both
 * pickers, an open histogram. The refactor's rule is: STATE LIVES WHERE IT IS
 * DISPLAYED, and everything a section receives from its card is either data
 * that section displays or a callback that is REFERENTIALLY STABLE.
 *
 * What that means concretely:
 *
 *  - Each section owns its own unfold state and (for filters) the rule error.
 *    Unfolding a row re-renders that section alone — and inside it, only the
 *    two rows whose `expanded` actually changed, because the rows are
 *    memoized too and every handler they receive is stable.
 *  - Handlers read CURRENT values out of a ref (`stateRef`) instead of
 *    closing over them, so their identity never depends on the data and the
 *    memo boundary holds across data changes the handler merely reads.
 *  - The write callbacks (`persistEntries`, `persistPick`) are the card's
 *    concern — and per the image-layer contract they fold into the LOCAL
 *    store and mark the card dirty; the card's header Save button is the one
 *    server write. The cards are required (by the memo working at all) to
 *    pass them stable, ref-backed. Same for `source` and `defaultRow`: both
 *    are objects, so the card must `useMemo` them or the section re-renders
 *    with the card anyway.
 *
 * The semantics are unchanged from when this lived in the cards; the
 * docblocks moved with the code they explain.
 */

/** What both cards' entry-persistence accepts: whole-array replacements plus
 * the active indices, in the input shapes both mutations take. */
export type EntriesPatch = {
  colorBys?: (ColorByInputLike & ColorByClims)[];
  filterBys?: FilterByInputLike[];
  activeColorBy?: number | null;
  activeFilterBys?: number[];
};

/** The optimistic path's patch: the two picker CHOICES, nothing else. */
export type PickPatch = {
  activeColorBy?: number | null;
  activeFilterBys?: number[];
};

/** The section's leading DEFAULT row — what "no table colouring" means for
 * this layer kind. `settings` (optional) unfolds under it like any entry's. */
export type DefaultColorRow = {
  title: string;
  label: string;
  detail: string;
  swatchCSS: string;
  settings?: ReactNode;
};

/** The derived colour-per-value preview, shared by every "no colormap" swatch. */
export const HASH_GRADIENT_CSS = "linear-gradient(90deg, #e879f9, #22d3ee, #a3e635)";

// ---------------------------------------------------------------- color rows

/**
 * One stored colouring. Memoized so an unfold or an active-pick re-renders
 * exactly the rows whose `active`/`expanded` changed — the handlers are
 * index-parameterized and stable, and the entry object comes straight off the
 * stored array, so every other row's props are reference-equal.
 */
const ColorByRow = memo(function ColorByRow({
  entry,
  index,
  active,
  expanded,
  onRowClick,
  onRemove,
  onUpdate,
}: {
  entry: ColorByEntry;
  index: number;
  active: boolean;
  expanded: boolean;
  onRowClick: (index: number) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, patch: Partial<ColorByInputLike> & ColorByClims) => void;
}) {
  return (
    <EntryRow
      active={active}
      expanded={expanded}
      title={`Color objects by ${entry.column} of table ${entry.table} — click to configure (stored)${
        isJoinedEntry(entry) ? JOINED_NOTE : ""
      }`}
      onClick={() => onRowClick(index)}
      leading={
        <span
          className="h-3 w-6 shrink-0 rounded-sm border border-white/15"
          style={{
            background: entry.colormap
              ? colormapGradientCSS(entry.colormap, 18)
              : HASH_GRADIENT_CSS,
          }}
        />
      }
      label={
        <>
          {entryLabel(entry)}
          {isJoinedEntry(entry) && <span className="ml-1 text-amber-300/70">*</span>}
        </>
      }
      detail={describeColouring(entry)}
      actions={
        <RowAction title="Remove this colouring" danger onClick={() => onRemove(index)}>
          <X className="h-2.5 w-2.5" />
        </RowAction>
      }
    >
      <ColumnEntrySettings
        entry={entry}
        mode="color"
        onCommit={(patch) => onUpdate(index, patch)}
      />
    </EntryRow>
  );
});

/**
 * The `color by` block: the default row, the stored colourings, the add
 * picker. A LIST, not a pill strip — each colouring is a table column whose
 * name needs room to be read, and it carries a colormap swatch and a remove.
 * Exclusive (an object takes ONE colouring); clicking a row picks it AND
 * unfolds its settings inline, a second click folds them back.
 *
 * Rendered even when empty, because "add" is how a colouring comes into
 * existence: the server publishes CANDIDATES and this section turns one into
 * a stored entry.
 */
export const ColorBySection = memo(function ColorBySection({
  source,
  colorBys,
  activeColorBy,
  persistEntries,
  persistPick,
  defaultRow,
}: {
  /** MUST be memoized by the card — it is an object and this is a memo boundary. */
  source: ColumnOptionSource;
  colorBys: readonly ColorByEntry[];
  activeColorBy: number | null;
  /** MUST be stable (ref-backed in the card); see the module docblock. */
  persistEntries: (patch: EntriesPatch) => void | Promise<unknown>;
  /** MUST be stable; the pick path (choice among the entries). */
  persistPick: (patch: PickPatch) => void;
  /** MUST be memoized by the card. */
  defaultRow: DefaultColorRow;
}) {
  perfMonitor.countRender("ColorBySection"); // no-op unless a perf recording is armed

  // Which row is unfolded — at most one, keyed by list + entry so removals
  // and re-adds do not resurrect a stale unfold. Owned HERE: unfolding must
  // not re-render the card.
  const [unfolded, setUnfolded] = useState<string | null>(null);

  // Current data for the stable handlers below. Writing on every render is
  // the point: the handlers read through the ref at CALL time.
  const stateRef = useRef({ colorBys, activeColorBy });
  stateRef.current = { colorBys, activeColorBy };

  const keyOf = (entry: ColorByEntry, index: number) =>
    `color.${entryKey(entry)}.${index}`;

  /**
   * A new colouring is drawn immediately — adding one the user then has to
   * find and click would be two steps for one intent. A MEASURE column needs
   * a colormap to mean anything; a CATEGORICAL one is coloured by its value
   * map, which the server derives when `classColors` is null.
   */
  const addColorBy = useCallback(
    (option: ColumnOption) => {
      const next = [
        ...stateRef.current.colorBys.map(colorByEntryToInput),
        toColorByInput(option, {
          colormap: isMeasure(option) ? ColorMap.Viridis : null,
        }),
      ];
      void persistEntries({ colorBys: next, activeColorBy: next.length - 1 });
    },
    [persistEntries],
  );

  /** Removing shifts every later index, so the choice is repointed with it. */
  const removeColorBy = useCallback(
    (index: number) => {
      const { colorBys: entries, activeColorBy: active } = stateRef.current;
      const next = entries.map(colorByEntryToInput).filter((_, at) => at !== index);
      void persistEntries({
        colorBys: next,
        activeColorBy: activeColorByAfterRemoval(active, index),
      });
    },
    [persistEntries],
  );

  /**
   * Editing one entry in place. Same whole-array replacement as adding — the
   * input has no per-element patch — so the edited entry is spliced into the
   * mapped-back list and the whole thing re-sent. The active indices are
   * untouched: editing changes what an entry MEANS, never where it sits.
   */
  const updateColorBy = useCallback(
    (index: number, patch: Partial<ColorByInputLike> & ColorByClims) => {
      const next = stateRef.current.colorBys.map(colorByEntryToInput);
      if (!next[index]) return;
      next[index] = { ...next[index], ...patch };
      void persistEntries({ colorBys: next });
    },
    [persistEntries],
  );

  /** Click = pick (if not active) + unfold; on the active row it toggles. */
  const rowClick = useCallback(
    (index: number) => {
      const { colorBys: entries, activeColorBy: active } = stateRef.current;
      const entry = entries[index];
      if (!entry) return;
      const key = keyOf(entry, index);
      if (active !== index) {
        persistPick({ activeColorBy: index });
        setUnfolded(key);
      } else {
        setUnfolded((current) => (current === key ? null : key));
      }
    },
    [persistPick],
  );

  const defaultClick = useCallback(() => {
    if (stateRef.current.activeColorBy !== null) {
      persistPick({ activeColorBy: null });
      setUnfolded("default");
    } else {
      setUnfolded((current) => (current === "default" ? null : "default"));
    }
  }, [persistPick]);

  /** What the picker already holds, so an offered column can say "added". */
  const taken = useMemo(
    () => new Set(colorBys.map((entry) => entryKey(entry))),
    [colorBys],
  );

  return (
    <CardSection
      title="color by"
      action={
        <ColumnOptionPicker source={source} mode="color" taken={taken} onPick={addColorBy} />
      }
      hint={colorBys.length === 0 ? "add a column to color objects by its value" : undefined}
    >
      <EntryRow
        active={activeColorBy === null}
        expanded={unfolded === "default"}
        title={defaultRow.title}
        onClick={defaultClick}
        leading={
          <span
            className="h-3 w-6 shrink-0 rounded-sm border border-white/15"
            style={{ background: defaultRow.swatchCSS }}
          />
        }
        label={defaultRow.label}
        detail={defaultRow.detail}
      >
        {defaultRow.settings}
      </EntryRow>
      {colorBys.map((entry, index) => (
        <ColorByRow
          key={keyOf(entry, index)}
          entry={entry}
          index={index}
          active={activeColorBy === index}
          expanded={unfolded === keyOf(entry, index)}
          onRowClick={rowClick}
          onRemove={removeColorBy}
          onUpdate={updateColorBy}
        />
      ))}
    </CardSection>
  );
});

// --------------------------------------------------------------- filter rows

/** One stored rule; see `ColorByRow` for why it is memoized. */
const FilterByRow = memo(function FilterByRow({
  entry,
  index,
  applied,
  expanded,
  onRowClick,
  onToggleApply,
  onRemove,
  onUpdate,
}: {
  entry: FilterByEntry;
  index: number;
  applied: boolean;
  expanded: boolean;
  onRowClick: (index: number) => void;
  onToggleApply: (index: number) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, patch: Partial<FilterByInputLike>) => void;
}) {
  return (
    <EntryRow
      active={applied}
      expanded={expanded}
      title={`${entry.exclude ? "Drop" : "Keep"} objects where ${
        entry.column
      } ${describeFilterRule(entry)} — click to apply & configure, the funnel switches it off (stored)${
        isJoinedEntry(entry) ? JOINED_NOTE : ""
      }`}
      onClick={() => onRowClick(index)}
      leadingAction={
        <button
          type="button"
          title={
            applied
              ? "Stop applying this rule — combined with AND (stored)"
              : "Apply this rule — combined with AND (stored)"
          }
          onClick={() => onToggleApply(index)}
          className="grid h-4 w-4 shrink-0 place-items-center rounded transition-colors hover:bg-white/10"
        >
          <Filter className={`h-3 w-3 ${applied ? "text-sky-200" : "text-white/30"}`} />
        </button>
      }
      label={
        <>
          {entryLabel(entry)}
          {isJoinedEntry(entry) && <span className="ml-1 text-amber-300/70">*</span>}
        </>
      }
      detail={`${entry.exclude ? "drop" : "keep"} where ${describeFilterRule(entry)}`}
      actions={
        <RowAction title="Remove this rule" danger onClick={() => onRemove(index)}>
          <X className="h-2.5 w-2.5" />
        </RowAction>
      }
    >
      <ColumnEntrySettings
        entry={entry}
        mode="filter"
        onCommit={(patch) => onUpdate(index, patch)}
      />
    </EntryRow>
  );
});

/**
 * The `filters` block. Independent rules, so the leading funnel toggles each
 * on its own: the active rules combine with AND, and an object is drawn when
 * every one of them keeps it. None active draws everything. Clicking the row
 * itself unfolds the rule's settings (range, values, invert) inline. The rule
 * is the detail line — a filter you cannot read is a filter you cannot trust.
 */
export const FilterBySection = memo(function FilterBySection({
  source,
  filterBys,
  activeFilterBys,
  persistEntries,
  persistPick,
}: {
  /** MUST be memoized by the card. */
  source: ColumnOptionSource;
  filterBys: readonly FilterByEntry[];
  /** MUST be a stable reference while unchanged (memoize the `?? []`). */
  activeFilterBys: readonly number[];
  /** MUST be stable; see `ColorBySection`. */
  persistEntries: (patch: EntriesPatch) => void | Promise<unknown>;
  persistPick: (patch: PickPatch) => void;
}) {
  perfMonitor.countRender("FilterBySection"); // no-op unless a perf recording is armed

  const [unfolded, setUnfolded] = useState<string | null>(null);
  // The rule error is DISPLAYED here, so it lives here: a failed seed read
  // must not re-render the card.
  const [ruleError, setRuleError] = useState<string | null>(null);
  // The bounds a new rule is seeded with come out of the column's parquet,
  // which is the attribute engine's connection and grants.
  const attributeService = useAttributeServiceOrNull();

  const stateRef = useRef({ filterBys, activeFilterBys, attributeService });
  stateRef.current = { filterBys, activeFilterBys, attributeService };

  const keyOf = (entry: FilterByEntry, index: number) =>
    `filter.${entryKey(entry)}.${index}`;

  /**
   * A new rule arrives WITH its bounds, seeded from the column itself.
   *
   * The write path refuses an entry naming neither a bound nor a value set —
   * "matches every row, which is not a filter" — so there is no such thing as
   * adding an empty rule and configuring it afterwards. The seed is the
   * widest legal rule (the full range, or every distinct value), read out of
   * the parquet, so adding one changes nothing on screen and narrowing it is
   * the next move.
   *
   * It is added APPLIED — like a new colouring is drawn immediately, adding a
   * rule the user then has to find and switch on would be two steps for one
   * intent, and the wide seed means applying it hides nothing yet.
   */
  const addFilterBy = useCallback(
    (option: ColumnOption) => {
      const engine = stateRef.current.attributeService?.engine;
      if (!engine) {
        setRuleError("no datalayer connection — cannot read the column's bounds");
        return;
      }
      setRuleError(null);
      void readDefaultFilterRule(
        engine,
        option,
        option.control === ColumnControl.Measure ? "MEASURE" : "CATEGORICAL",
      )
        .then((seed) => {
          if (!seed) {
            // No invented bound: the server's refusal is correct, and a
            // made-up range would silently drop rows.
            setRuleError(
              `${option.column.name} has no values to bound a rule with — nothing to filter on`,
            );
            return;
          }
          if (seed.truncated) {
            setRuleError(
              `${option.column.name} has more distinct values than can be listed; the rule names only the first ones and will hide the rest once applied`,
            );
          }
          const { filterBys: entries, activeFilterBys: active } = stateRef.current;
          const next = [
            ...entries.map(filterByEntryToInput),
            toFilterByInput(option, seed.rule),
          ];
          return persistEntries({
            filterBys: next,
            activeFilterBys: [...active, next.length - 1].sort((a, b) => a - b),
          });
        })
        .catch((error: unknown) => {
          setRuleError(
            `could not read ${option.column.name}'s values: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        });
    },
    [persistEntries],
  );

  const removeFilterBy = useCallback(
    (index: number) => {
      const { filterBys: entries, activeFilterBys: active } = stateRef.current;
      const next = entries.map(filterByEntryToInput).filter((_, at) => at !== index);
      void persistEntries({
        filterBys: next,
        activeFilterBys: activeFilterBysAfterRemoval(active, index),
      });
    },
    [persistEntries],
  );

  const updateFilterBy = useCallback(
    (index: number, patch: Partial<FilterByInputLike>) => {
      const next = stateRef.current.filterBys.map(filterByEntryToInput);
      if (!next[index]) return;
      next[index] = { ...next[index], ...patch };
      void persistEntries({ filterBys: next });
    },
    [persistEntries],
  );

  /** Rules combine with AND, so each is an independent on/off. */
  const toggleApply = useCallback(
    (index: number) => {
      const active = stateRef.current.activeFilterBys;
      persistPick({
        activeFilterBys: active.includes(index)
          ? active.filter((at) => at !== index)
          : [...active, index].sort((a, b) => a - b),
      });
    },
    [persistPick],
  );

  /**
   * Click = apply (if not applied) + unfold; on an applied row it toggles the
   * unfold — the same shape as a colouring's row click. UNapplying stays on
   * the funnel alone: a click that switched an applied rule off while opening
   * its settings would change the scene as a side effect of configuring.
   */
  const rowClick = useCallback(
    (index: number) => {
      const { filterBys: entries, activeFilterBys: active } = stateRef.current;
      const entry = entries[index];
      if (!entry) return;
      const key = keyOf(entry, index);
      if (!active.includes(index)) {
        persistPick({ activeFilterBys: [...active, index].sort((a, b) => a - b) });
        setUnfolded(key);
      } else {
        setUnfolded((current) => (current === key ? null : key));
      }
    },
    [persistPick],
  );

  const taken = useMemo(
    () => new Set(filterBys.map((entry) => entryKey(entry))),
    [filterBys],
  );

  return (
    <CardSection
      title="filters"
      action={
        <ColumnOptionPicker source={source} mode="filter" taken={taken} onPick={addFilterBy} />
      }
      hint={
        ruleError ? (
          <span className="text-amber-300/80">{ruleError}</span>
        ) : filterBys.length === 0 ? (
          "nothing added — every object draws"
        ) : activeFilterBys.length === 0 ? (
          "none applied — every object draws"
        ) : (
          `${activeFilterBys.length} applied, combined with AND`
        )
      }
    >
      {filterBys.map((entry, index) => (
        <FilterByRow
          key={keyOf(entry, index)}
          entry={entry}
          index={index}
          applied={activeFilterBys.includes(index)}
          expanded={unfolded === keyOf(entry, index)}
          onRowClick={rowClick}
          onToggleApply={toggleApply}
          onRemove={removeFilterBy}
          onUpdate={updateFilterBy}
        />
      ))}
    </CardSection>
  );
});
