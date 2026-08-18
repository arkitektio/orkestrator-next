import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Eye, EyeOff, Filter, Shapes, Spline, Trash2, X } from "lucide-react";
import { memo, useMemo, useState } from "react";
import {
  ColorMap,
  ColumnControl,
  useUpdateLabelLayerMutation,
  type LabelRenderFragment,
} from "@/mikro-next/api/graphql";
import { useAttributeServiceOrNull } from "@/mikro-next/lib/attributes/AttributeServiceProvider";
import { readDefaultFilterRule } from "@/mikro-next/lib/attributes/columnStats";
import { useSceneStore, type LayerState } from "../../store/sceneStore";
import { Badge, CardSection, EntryRow, IconToggle, RowAction } from "./cardControls";
import { colormapGradientCSS } from "./colormap-utils";
import { ColumnEntryEditor } from "./ColumnEntryEditor";
import { ColumnOptionPicker } from "./ColumnOptionPicker";
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
  toColorByInput,
  toFilterByInput,
  type ColorByInputLike,
  type ColumnOption,
  type FilterByInputLike,
  JOINED_NOTE,
} from "./columnOptions";

/**
 * The card for a `LabelLayer` — an array whose values are discrete object ids
 * (a segmentation or an instance map).
 *
 * Its two substantial blocks are the same PICKERS the mesh card publishes, for
 * the same reason and over the same relation: a mask's pixel values dereference
 * into a table of objects by exactly the FIELD edge a mesh collection's ids do,
 * so `colorBys` / `filterBys` mean the same thing here and the picker, the entry
 * editor and the option→input bridge are shared code (`ColumnOptionPicker`,
 * `ColumnEntryEditor`, `columnOptions.ts`) rather than a second dialect.
 *
 * Everything a label layer stores is STORED — unlike the mesh card, whose render
 * settings (palette, detail, normals, wireframe) are session-local because
 * `updateLayer` has no home for them on the server. `updateLabelLayer` takes
 * `visible` / `opacity` / `order` directly and everything else under `render`,
 * so this card has no session-only state at all.
 *
 * Two write paths, and the difference is deliberate:
 *
 *  - `persistSetting` — the two picker CHOICES (`activeColorBy`,
 *    `activeFilterBys`) and the plain render toggles (`contour`). Optimistic: a
 *    control has to answer the click rather than the round trip, so the fold
 *    happens first and is put back if the server refuses.
 *  - `persistRender` — the picker CONTENTS, and anything else the server
 *    normalises. Not optimistic: the server fills `label`, may normalise
 *    `joinPath`, and since the arrays and the indices into them have to stay
 *    consistent, its answer is the one worth showing.
 *
 * The fold after the mutation is not optional either way, and it goes through
 * `updateLayer` (the NORMALIZED list the renderer reads), never
 * `patchSceneLayer`: `syncSceneLayers` reconciles by STRUCTURE, and an unchanged
 * structure key makes it keep the previous NORMALIZED object — so a `GetScene`
 * re-emission carrying the server's new render settings is discarded. Content
 * mutations have to land in the store at their call site, and in the list that
 * is actually read.
 *
 * NOT here, on purpose: `seed`, `background` and the selection. All three are
 * stored, fetched and honoured by the material, but none has a control yet —
 * `seed` reshuffles every colour at once (a "shuffle" button, not a number
 * field), `background` is almost always 0 and picking the wrong one blanks the
 * mask, and the selection is driven by clicking objects rather than by typing
 * ids. Each wants a designed control rather than a raw field, so they wait.
 */

/** What `updateLabelLayer(render:)` accepts, in the shapes this card sends. */
type RenderPatch = {
  colorBys?: ColorByInputLike[];
  filterBys?: FilterByInputLike[];
  activeColorBy?: number | null;
  activeFilterBys?: number[];
};

/** Boundary widths worth a click, in base voxels. */
const CONTOUR_WIDTHS = [1, 2, 3] as const;

export const LabelLayerCard = memo(
  ({
    layer,
    onRemove,
  }: {
    /**
     * The NORMALIZED label layer, off `sceneStore.layers` — deliberately not the
     * raw fragment off `sceneLayers`.
     *
     * A label mask joined `LayerState` when it joined the brick path, and the
     * renderer reads it from there. Editing the raw fragment instead would leave
     * the two disagreeing: `patchSceneLayer` writes only `sceneLayers`, so a
     * colouring picked here would update the card and never reach the material.
     */
    layer: LayerState;
    onRemove?: (id: string) => void;
  }) => {
    const updateLayer = useSceneStore((s) => s.updateLayer);
    const hidden = layer.visible === false;
    const lens = layer.lens;
    const render = layer.labelRender;

    const [updateLabelLayer] = useUpdateLabelLayerMutation();
    // The bounds a new rule is seeded with come out of the column's parquet,
    // which is the attribute engine's connection and grants.
    const attributeService = useAttributeServiceOrNull();
    const [ruleError, setRuleError] = useState<string | null>(null);

    // Memoized: the `?? []` mints a new array every render, which would rebuild
    // the "already added" sets below on every one of them.
    const colorBys = useMemo(() => render?.colorBys ?? [], [render?.colorBys]);
    const filterBys = useMemo(() => render?.filterBys ?? [], [render?.filterBys]);
    const activeColorBy = render?.activeColorBy ?? null;
    const activeFilterBys = render?.activeFilterBys ?? [];
    const contour = render?.contour ?? false;
    const contourWidth = render?.contourWidth ?? 1;

    /**
     * Fold a render patch into the store. `updateLayer` replaces the whole
     * normalized layer by id, so `labelRender` is rebuilt here — spread the
     * current one first or a picker write would drop the seed and the
     * background.
     *
     * `labelRender` is nullable, and a layer that has never been tuned has none.
     * Folding onto `{}` is right rather than defensive: the only patch reachable
     * in that state is adding a first entry, which goes through `persistRender`
     * and comes back with the server's whole render object anyway.
     */
    const foldRender = (patch: Partial<LabelRenderFragment>) =>
      updateLayer({
        ...layer,
        labelRender: { ...render, ...patch } as LabelRenderFragment,
      });

    /**
     * The OPTIMISTIC path: the two picker choices and the plain render toggles.
     *
     * Every one of these is a control the user clicked, so it has to answer the
     * click rather than the round trip — the fold happens first and is put back
     * if the server refuses. Safe precisely because these are scalars the server
     * cannot renormalise: it either stores what was sent or rejects it, unlike
     * the picker CONTENTS below, where it fills labels and may rewrite joins.
     */
    const persistSetting = (patch: {
      activeColorBy?: number | null;
      activeFilterBys?: number[];
      contour?: boolean;
      contourWidth?: number;
    }) => {
      const rollback = { activeColorBy, activeFilterBys, contour, contourWidth };
      foldRender(patch);
      updateLabelLayer({ variables: { input: { id: layer.id, render: patch } } }).catch(
        (error) => {
          foldRender(rollback);
          console.warn("[label] could not save the render setting:", error);
        },
      );
    };

    /**
     * The picker CONTENTS, as opposed to the choice among them.
     *
     * `colorBys` / `filterBys` are whole-array replacements on
     * `LabelRenderInput` — patch semantics are per field, not per element — so
     * adding or dropping one entry means re-sending every other one. That round
     * trip goes through `colorByEntryToInput` / `filterByEntryToInput` rather
     * than by hand, because an entry re-sent without its `joinPath` flattens to
     * `[]`: the same column name, resolved against the wrong table, with
     * nothing to show for it.
     */
    const persistRender = (patch: RenderPatch) =>
      updateLabelLayer({ variables: { input: { id: layer.id, render: patch } } })
        .then(({ data }) => {
          const saved = data?.updateLabelLayer.labelRender;
          if (!saved) return;
          foldRender({
            colorBys: saved.colorBys,
            filterBys: saved.filterBys,
            activeColorBy: saved.activeColorBy,
            activeFilterBys: saved.activeFilterBys,
          });
        })
        .catch((error) => {
          console.warn("[label] could not save the picker entries:", error);
        });

    /** Stored layer fields, not render settings — hence no `render` wrapper. */
    const persistLayer = (patch: { visible?: boolean; opacity?: number }) => {
      const rollback = { visible: layer.visible, opacity: layer.opacity };
      updateLayer({ ...layer, ...patch });
      updateLabelLayer({ variables: { input: { id: layer.id, ...patch } } }).catch((error) => {
        updateLayer({ ...layer, ...rollback });
        console.warn("[label] could not save the layer setting:", error);
      });
    };

    const colorByInputs = () => colorBys.map(colorByEntryToInput);
    const filterByInputs = () => filterBys.map(filterByEntryToInput);

    /**
     * A new colouring is drawn immediately — adding one the user then has to
     * find and click would be two steps for one intent. A MEASURE column needs
     * a colormap to mean anything; a CATEGORICAL one is coloured by its value
     * map, which the server derives when `classColors` is null.
     */
    const addColorBy = (option: ColumnOption) => {
      const next = [
        ...colorByInputs(),
        toColorByInput(option, { colormap: isMeasure(option) ? ColorMap.Viridis : null }),
      ];
      void persistRender({ colorBys: next, activeColorBy: next.length - 1 });
    };

    /**
     * A new rule arrives WITH its bounds, seeded from the column itself.
     *
     * The write path refuses an entry naming neither a bound nor a value set —
     * "matches every row, which is not a filter" — so there is no such thing as
     * adding an empty rule and configuring it afterwards. The seed is the widest
     * legal rule (the full range, or every distinct value), read out of the
     * parquet, so adding one changes nothing on screen and narrowing it is the
     * next move.
     *
     * It is added INACTIVE all the same: applying a rule the moment it is picked
     * would be a second decision the click did not make.
     */
    const addFilterBy = (option: ColumnOption) => {
      const engine = attributeService?.engine;
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
            // No invented bound: the server's refusal is correct, and a made-up
            // range would silently drop rows.
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
          return persistRender({
            filterBys: [...filterByInputs(), toFilterByInput(option, seed.rule)],
          });
        })
        .catch((error: unknown) => {
          setRuleError(
            `could not read ${option.column.name}'s values: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        });
    };

    /** Removing shifts every later index, so the choice is repointed with it. */
    const removeColorBy = (index: number) => {
      const next = colorByInputs().filter((_, at) => at !== index);
      void persistRender({
        colorBys: next,
        activeColorBy: activeColorByAfterRemoval(activeColorBy, index),
      });
    };

    const removeFilterBy = (index: number) => {
      const next = filterByInputs().filter((_, at) => at !== index);
      void persistRender({
        filterBys: next,
        activeFilterBys: activeFilterBysAfterRemoval(activeFilterBys, index),
      });
    };

    /**
     * Editing one entry in place. Same whole-array replacement as adding — the
     * input has no per-element patch — so the edited entry is spliced into the
     * mapped-back list and the whole thing re-sent. The active indices are
     * untouched: editing changes what an entry MEANS, never where it sits.
     */
    const updateColorBy = (index: number, patch: Partial<ColorByInputLike>) => {
      const next = colorByInputs();
      if (!next[index]) return;
      next[index] = { ...next[index], ...patch };
      void persistRender({ colorBys: next });
    };

    const updateFilterBy = (index: number, patch: Partial<FilterByInputLike>) => {
      const next = filterByInputs();
      if (!next[index]) return;
      next[index] = { ...next[index], ...patch };
      void persistRender({ filterBys: next });
    };

    /** What the pickers already hold, so an offered column can say "added". */
    const takenColorBys = useMemo(
      () => new Set(colorBys.map((entry) => entryKey(entry))),
      [colorBys],
    );
    const takenFilterBys = useMemo(
      () => new Set(filterBys.map((entry) => entryKey(entry))),
      [filterBys],
    );

    /** Rules combine with AND, so each is an independent on/off. */
    const toggleFilter = (index: number) =>
      persistSetting({
        activeFilterBys: activeFilterBys.includes(index)
          ? activeFilterBys.filter((active) => active !== index)
          : [...activeFilterBys, index].sort((a, b) => a - b),
      });

    return (
      <div
        className={`@container/card rounded-lg border border-white/10 bg-black/40 backdrop-blur-md transition-opacity ${
          hidden ? "opacity-50" : ""
        }`}
      >
        {/* ------------------------------------------------ header --------- */}
        <div className="flex items-center gap-1.5 px-2 py-1.5">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-emerald-400/15">
            <Shapes className="h-3 w-3 text-emerald-300" />
          </span>
          <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-white/90">
            {lens.dataset?.name?.trim() || `Labels ${layer.id}`}
          </span>

          <Badge>labels</Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0 text-white/45 hover:text-white/90"
            title={hidden ? "Show" : "Hide"}
            onClick={() => persistLayer({ visible: hidden })}
          >
            {hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0 text-white/35 hover:text-red-300"
              title="Remove layer from scene"
              onClick={() => onRemove(layer.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* ------------------------------------------------ outline -------- */}
        {/* A contour is a genuinely different reading of a mask — the boundaries
            rather than the regions — so it is a toggle, not a style tweak. 2D
            ONLY, and the card says so: each boundary test costs its own residency
            resolve, which is affordable once per pixel and not inside a 512-step
            ray loop. */}
        <CardSection
          title="outline"
          hint={
            contour
              ? "2D only — in 3D the mask draws as a solid first-hit surface"
              : "objects draw filled"
          }
        >
          <div className="flex flex-wrap items-center gap-1">
            <IconToggle
              active={contour}
              title={
                contour
                  ? "Draw objects filled"
                  : "Draw only object boundaries (2D only)"
              }
              onClick={() => persistSetting({ contour: !contour })}
              icon={<Spline className="h-2.5 w-2.5" />}
              label="outline"
            />
            {contour &&
              CONTOUR_WIDTHS.map((width) => (
                <button
                  key={width}
                  type="button"
                  title={`${width} voxel${width === 1 ? "" : "s"} wide`}
                  onClick={() => persistSetting({ contourWidth: width })}
                  className={`rounded-md border px-1.5 py-0.5 text-[9px] leading-none transition-colors ${
                    Math.round(contourWidth) === width
                      ? "border-sky-400/40 bg-sky-400/15 text-sky-100"
                      : "border-white/10 bg-black/30 text-white/45 hover:text-white/80"
                  }`}
                >
                  {width}px
                </button>
              ))}
          </div>
        </CardSection>

        {/* ------------------------------------------------ color by ------- */}
        {/* A LIST, not a pill strip: each colouring is a table column whose name
            needs room to be read, and it carries a colormap swatch, a configure
            and a remove. Exclusive — an object takes ONE colouring — and the
            leading "none" row is what hands the decision back to the id hash.

            Rendered even when empty, because "add" is how a colouring comes into
            existence: the server publishes CANDIDATES (`labelColorByOptions`)
            and this card turns one into a stored entry. */}
        <CardSection
          title="color by"
          action={
            <ColumnOptionPicker
              source={{ kind: "label", lens: lens.id }}
              mode="color"
              taken={takenColorBys}
              onPick={addColorBy}
            />
          }
          hint={
            colorBys.length === 0
              ? "nothing added — add a column to color objects by its value"
              : undefined
          }
        >
          <EntryRow
            active={activeColorBy === null}
            title="No table colouring — each object id is hashed to its own hue (stored)"
            onClick={() => activeColorBy !== null && persistSetting({ activeColorBy: null })}
            leading={
              <span
                className="h-3 w-6 shrink-0 rounded-sm border border-white/15"
                style={{
                  background: "linear-gradient(90deg, #e879f9, #22d3ee, #a3e635)",
                }}
              />
            }
            label="none"
            detail="a hue per object id"
          />
          {colorBys.map((entry, index) => (
            <EntryRow
              key={`${entryKey(entry)}.${index}`}
              active={activeColorBy === index}
              title={`Color objects by ${entry.column} of table ${entry.table} (stored)${
                isJoinedEntry(entry) ? JOINED_NOTE : ""
              }`}
              onClick={() => activeColorBy !== index && persistSetting({ activeColorBy: index })}
              leading={
                <span
                  className="h-3 w-6 shrink-0 rounded-sm border border-white/15"
                  style={{
                    background: entry.colormap
                      ? colormapGradientCSS(entry.colormap, 18)
                      : "linear-gradient(90deg, #e879f9, #22d3ee, #a3e635)",
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
                <>
                  <ColumnEntryEditor
                    entry={entry}
                    mode="color"
                    onCommit={(patch) => updateColorBy(index, patch)}
                  />
                  <RowAction
                    title="Remove this colouring"
                    danger
                    onClick={() => removeColorBy(index)}
                  >
                    <X className="h-2.5 w-2.5" />
                  </RowAction>
                </>
              }
            />
          ))}
        </CardSection>

        {/* ------------------------------------------------ filters -------- */}
        {/* Independent, so each row toggles on its own: the active rules combine
            with AND, and an object is drawn when every one of them keeps it.
            None active draws everything. The rule itself is the detail line — a
            filter you cannot read is a filter you cannot trust. */}
        <CardSection
          title="filters"
          action={
            <ColumnOptionPicker
              source={{ kind: "label", lens: lens.id }}
              mode="filter"
              taken={takenFilterBys}
              onPick={addFilterBy}
            />
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
            <EntryRow
              key={`${entryKey(entry)}.${index}`}
              active={activeFilterBys.includes(index)}
              title={`${entry.exclude ? "Drop" : "Keep"} objects where ${
                entry.column
              } ${describeFilterRule(entry)} — combined with AND (stored)${
                isJoinedEntry(entry) ? JOINED_NOTE : ""
              }`}
              onClick={() => toggleFilter(index)}
              leading={
                <Filter
                  className={`h-3 w-3 shrink-0 ${
                    activeFilterBys.includes(index) ? "text-sky-200" : "text-white/30"
                  }`}
                />
              }
              label={
                <>
                  {entryLabel(entry)}
                  {isJoinedEntry(entry) && <span className="ml-1 text-amber-300/70">*</span>}
                </>
              }
              detail={`${entry.exclude ? "drop" : "keep"} where ${describeFilterRule(entry)}`}
              actions={
                <>
                  <ColumnEntryEditor
                    entry={entry}
                    mode="filter"
                    onCommit={(patch) => updateFilterBy(index, patch)}
                  />
                  <RowAction title="Remove this rule" danger onClick={() => removeFilterBy(index)}>
                    <X className="h-2.5 w-2.5" />
                  </RowAction>
                </>
              }
            />
          ))}
        </CardSection>

        {/* ------------------------------------------------ opacity -------- */}
        <CardSection title="opacity">
          <div className="flex items-center gap-1.5">
            <Slider
              min={0}
              max={100}
              step={1}
              value={[Math.round((layer.opacity ?? 1) * 100)]}
              onValueChange={([value]) => updateLayer({ ...layer, opacity: value / 100 })}
              onValueCommit={([value]) => persistLayer({ opacity: value / 100 })}
              className="flex-1"
            />
            <span className="w-7 shrink-0 text-right text-[9px] text-white/40">
              {Math.round((layer.opacity ?? 1) * 100)}%
            </span>
          </div>
        </CardSection>
      </div>
    );
  },
);

LabelLayerCard.displayName = "LabelLayerCard";
