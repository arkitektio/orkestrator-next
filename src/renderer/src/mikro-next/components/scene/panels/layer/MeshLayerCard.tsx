import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Box,
  Crosshair,
  Eye,
  EyeOff,
  Filter,
  FlipHorizontal2,
  Grid3x3,
  Trash2,
  Waves,
  X,
} from "lucide-react";
import { memo, useMemo, useState } from "react";
import {
  ColorMap,
  ColumnControl,
  useUpdateMeshLayerMutation,
  type MeshColorByInput,
  type MeshFilterByInput,
  type SceneLayerFragment,
} from "@/mikro-next/api/graphql";
import {
  DEFAULT_INSTANCE_COLORMAP,
  INSTANCE_COLORMAPS,
  INSTANCE_COLORMAP_SPECS,
  instanceHue,
  type FabriksInstanceColormap,
} from "../../render/fabriks/instanceColormaps";
import { useSceneStore, type MeshLayerSessionState } from "../../store/sceneStore";
import {
  Badge,
  CardSection,
  EntryRow,
  IconToggle,
  RowAction,
  Segment,
  SegmentGroup,
  formatCount,
} from "./cardControls";
import { colormapGradientCSS } from "./colormap-utils";
import { useViewerStore } from "../../store/viewerStore";
import { useAttributeServiceOrNull } from "@/mikro-next/lib/attributes/AttributeServiceProvider";
import { readDefaultFilterRule } from "@/mikro-next/lib/attributes/columnStats";
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
  JOINED_NOTE,
  toColorByInput,
  toFilterByInput,
  type ColumnOption,
} from "./columnOptions";

/**
 * A compact card for a `MeshLayer` in the Layers panel.
 *
 * Built from the shared control vocabulary in `./cardControls` — segmented
 * groups for exclusive choices (palette, detail, slab, colour-by), icon
 * toggles for independent booleans (wireframe, smooth, two-sided, filters).
 *
 * Two kinds of control live here, and the difference is worth keeping straight:
 *  - SESSION-LOCAL (`patchSceneLayer` only): the render settings — palette,
 *    detail, normals, slab, wireframe, visibility. `updateLayer` is typed to
 *    return `ImageLayer`, so none of these has anywhere to be stored.
 *  - STORED (`updateMeshLayer` + a fold): the two PICKER choices the layer
 *    publishes, `activeColorBy` and `activeFilterBys`. The layer offers
 *    `colorBys`/`filterBys` (server-checked against the collection's FIELD
 *    edge); the choice is the index, and it belongs to the layer rather than
 *    to this session.
 *
 * The fold after the mutation is not optional: `SceneProvider` reconciles the
 * layer set by structure, so a `GetScene` re-emission that changed only a mesh
 * layer's CONTENT keeps the stored object as-is. Content mutations land in the
 * store at their call site — see the rebuild contract in `SceneProvider`.
 */

type MeshLayerVariant = Extract<SceneLayerFragment, { __typename: "MeshLayer" }> &
  MeshLayerSessionState;

/** `store.counts` is the manifest's own tally, mirrored by the API. */
type FabriksCounts = { objects?: number; cellsPerLevel?: number[] };

const DETAIL_PRESETS = ["fine", "balanced", "fast"] as const;
const SLAB_SCALES = [1, 3, 5] as const;

/** A palette chip's preview: the first six instance hues under its spec. */
const paletteCSS = (name: FabriksInstanceColormap): string => {
  const spec = INSTANCE_COLORMAP_SPECS[name];
  const colors = Array.from({ length: 6 }, (_, ordinal) => {
    const s = spec.saturation * (spec.tiered ? 0.7 + (ordinal % 3) * 0.15 : 1);
    const l = 0.55 * spec.value * (spec.tiered ? 0.78 + (ordinal % 2) * 0.22 : 1);
    return `hsl(${instanceHue(ordinal) * 360}, ${s * 100}%, ${Math.min(l, 0.85) * 100}%)`;
  });
  return `linear-gradient(to right, ${colors.join(", ")})`;
};

export const MeshLayerCard = memo(
  ({ layer, onRemove }: { layer: MeshLayerVariant; onRemove?: (id: string) => void }) => {
    const patchSceneLayer = useSceneStore((s) => s.patchSceneLayer);
    const hidden = layer.visible === false;

    // Instance selection (scene-wide; this card acts when it owns it).
    const meshSelection = useViewerStore((s) => s.meshSelection);
    const setMeshSelection = useViewerStore((s) => s.setMeshSelection);
    const manager = useViewerStore((s) => s.meshSystems[layer.id]);
    const selected = meshSelection?.layerId === layer.id ? meshSelection : null;
    const [idQuery, setIdQuery] = useState("");

    const selectById = () => {
      const objectId = Number(idQuery);
      if (!manager || !Number.isFinite(objectId)) return;
      void manager
        .identifyObjectId(objectId)
        .then((entry) => {
          if (!entry) return;
          setMeshSelection({
            layerId: layer.id,
            ordinal: entry.ordinal,
            objectId: entry.objectId,
            stats: { vertices: entry.vertexCount, indices: entry.indexCount },
            isolate: selected?.isolate ?? false,
          });
        })
        .catch((error) => console.warn("[fabriks] select-by-id failed:", error));
    };

    const collection = layer.collection;
    const store = collection?.store;
    const counts = (store?.counts ?? {}) as FabriksCounts;
    const grid = (store?.grid ?? {}) as { cellSize?: number[]; levels?: number };
    const encoding = (store?.encoding ?? {}) as { codec?: string; compression?: string };
    const cellsPerLevel = counts.cellsPerLevel ?? [];
    const totalCells = cellsPerLevel.reduce((sum, n) => sum + n, 0);

    const byInstance = layer.colorByInstance !== false;
    const activePalette = layer.instanceColormap ?? DEFAULT_INSTANCE_COLORMAP;

    // The two stored picker choices. Optimistic: a picker has to answer the
    // click rather than the round trip, so the fold happens first and is put
    // back if the server refuses.
    const [updateMeshLayer] = useUpdateMeshLayerMutation();
    // The bounds a new rule is seeded with come out of the column's parquet,
    // which is the attribute engine's connection and grants.
    const attributeService = useAttributeServiceOrNull();
    const [ruleError, setRuleError] = useState<string | null>(null);
    // Memoized: the `?? []` mints a new array every render, which would rebuild
    // the "already added" sets below on every one of them.
    const colorBys = useMemo(() => layer.colorBys ?? [], [layer.colorBys]);
    const filterBys = useMemo(() => layer.filterBys ?? [], [layer.filterBys]);
    const activeColorBy = layer.activeColorBy ?? null;
    const activeFilterBys = layer.activeFilterBys ?? [];

    const persistPick = (patch: {
      activeColorBy?: number | null;
      activeFilterBys?: number[];
    }) => {
      const rollback = {
        activeColorBy,
        activeFilterBys,
      };
      patchSceneLayer(layer.id, patch);
      updateMeshLayer({ variables: { input: { id: layer.id, ...patch } } }).catch(
        (error) => {
          patchSceneLayer(layer.id, rollback);
          console.warn("[mesh] could not save the picker choice:", error);
        },
      );
    };

    /**
     * The picker CONTENTS, as opposed to the choice among them.
     *
     * `colorBys` / `filterBys` are whole-array replacements on
     * `UpdateMeshLayerInput` — patch semantics are per field, not per element —
     * so adding or dropping one entry means re-sending every other one. That
     * round trip goes through `colorByEntryToInput` / `filterByEntryToInput`
     * rather than by hand, because an entry re-sent without its `joinPath`
     * flattens to `[]`: the same column name, resolved against the wrong table,
     * with nothing to show for it.
     *
     * Not optimistic, unlike `persistPick`. The server fills `label`, may
     * normalise `joinPath`, and — since the arrays and the indices into them
     * have to stay consistent — the authoritative answer is the one worth
     * showing. Folded in by hand for the reason in the docblock above: a
     * `GetScene` re-emission that changed only this layer's CONTENT is
     * discarded by the structural reconcile.
     */
    const persistEntries = (patch: {
      colorBys?: MeshColorByInput[];
      filterBys?: MeshFilterByInput[];
      activeColorBy?: number | null;
      activeFilterBys?: number[];
    }) =>
      updateMeshLayer({ variables: { input: { id: layer.id, ...patch } } })
        .then(({ data }) => {
          const saved = data?.updateMeshLayer;
          if (!saved) return;
          patchSceneLayer(layer.id, {
            colorBys: saved.colorBys,
            filterBys: saved.filterBys,
            activeColorBy: saved.activeColorBy,
            activeFilterBys: saved.activeFilterBys,
          });
        })
        .catch((error) => {
          console.warn("[mesh] could not save the picker entries:", error);
        });

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
        toColorByInput(option, {
          colormap: isMeasure(option) ? ColorMap.Viridis : null,
        }),
      ];
      void persistEntries({ colorBys: next, activeColorBy: next.length - 1 });
    };

    /**
     * A new rule arrives WITH its bounds, seeded from the column itself.
     *
     * `updateMeshLayer` refuses an entry naming neither a bound nor a value set
     * — "matches every row, which is not a filter" — so there is no such thing
     * as adding an empty rule and configuring it afterwards. The seed is the
     * widest legal rule (the full range, or every distinct value), read out of
     * the parquet, so adding one changes nothing on screen and narrowing it is
     * the next move.
     *
     * It is added INACTIVE all the same: applying a rule the moment it is
     * picked would be a second decision the click did not make.
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
          return persistEntries({
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
      void persistEntries({
        colorBys: next,
        activeColorBy: activeColorByAfterRemoval(activeColorBy, index),
      });
    };

    const removeFilterBy = (index: number) => {
      const next = filterByInputs().filter((_, at) => at !== index);
      void persistEntries({
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
    const updateColorBy = (index: number, patch: Partial<MeshColorByInput>) => {
      const next = colorByInputs();
      if (!next[index]) return;
      next[index] = { ...next[index], ...patch };
      void persistEntries({ colorBys: next });
    };

    const updateFilterBy = (index: number, patch: Partial<MeshFilterByInput>) => {
      const next = filterByInputs();
      if (!next[index]) return;
      next[index] = { ...next[index], ...patch };
      void persistEntries({ filterBys: next });
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
      persistPick({
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
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-sky-400/15">
            <Box className="h-3 w-3 text-sky-300" />
          </span>
          <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-white/90">
            {collection ? `Mesh ${collection.id}` : "Mesh (no collection)"}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className={`h-5 w-5 shrink-0 ${
              layer.wireframe ? "bg-sky-400/15 text-sky-300" : "text-white/45 hover:text-white/90"
            }`}
            title={layer.wireframe ? "Solid surface (session)" : "Wireframe (session)"}
            onClick={() => patchSceneLayer(layer.id, { wireframe: !layer.wireframe })}
          >
            <Grid3x3 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0 text-white/45 hover:text-white/90"
            title={hidden ? "Show (session)" : "Hide (session)"}
            onClick={() => patchSceneLayer(layer.id, { visible: hidden })}
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

        {/* ------------------------------------------------ colors --------- */}
        <CardSection title="colors">
          <SegmentGroup>
            {INSTANCE_COLORMAPS.map((name) => (
              <Segment
                key={name}
                active={byInstance && activePalette === name}
                title={`Color by instance id — "${name}" palette (session)`}
                onClick={() =>
                  patchSceneLayer(layer.id, { colorByInstance: true, instanceColormap: name })
                }
              >
                <span className="flex items-center gap-1">
                  <span
                    className="h-2 w-5 rounded-sm"
                    style={{ background: paletteCSS(name) }}
                  />
                  {name}
                </span>
              </Segment>
            ))}
            <Segment
              active={!byInstance}
              title="One uniform color for the whole collection (the layer's material color)"
              onClick={() => patchSceneLayer(layer.id, { colorByInstance: false })}
            >
              <span className="flex items-center gap-1">
                <span
                  className="h-2 w-2 rounded-full border border-white/20"
                  style={{
                    background: layer.materialColor
                      ? `rgb(${layer.materialColor[0] ?? 0}, ${layer.materialColor[1] ?? 0}, ${layer.materialColor[2] ?? 0})`
                      : "rgb(184, 184, 194)",
                  }}
                />
                uniform
              </span>
            </Segment>
          </SegmentGroup>
        </CardSection>

        {/* ------------------------------------------------ color by ------- */}
        {/* A LIST, not a pill strip: each colouring is a table column whose
            name needs room to be read, and it carries a colormap swatch, a
            configure and a remove — four things that do not fit in a segment.
            Exclusivity is unchanged (an object takes ONE colouring); the
            leading "none" row is what hands the decision back to the palette
            above.

            Rendered even when empty, because "add" is now how a colouring
            comes into existence: the server publishes CANDIDATES
            (`colorByOptions`) and this card turns one into a stored entry.
            Still hidden without a collection — options are per collection. */}
        {collection && (
          <CardSection
            title="color by"
            action={
              <ColumnOptionPicker
                source={{ kind: "mesh", meshCollection: collection.id }}
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
              title="No table colouring — the colors row above decides (stored)"
              onClick={() => activeColorBy !== null && persistPick({ activeColorBy: null })}
              leading={
                <span className="h-3 w-6 shrink-0 rounded-sm border border-white/15 bg-white/5" />
              }
              label="none"
              detail="the palette above decides"
            />
            {colorBys.map((entry, index) => (
              <EntryRow
                key={`${entryKey(entry)}.${index}`}
                active={activeColorBy === index}
                title={`Color objects by ${entry.column} of table ${entry.table} (stored)${
                  isJoinedEntry(entry) ? JOINED_NOTE : ""
                }`}
                onClick={() => activeColorBy !== index && persistPick({ activeColorBy: index })}
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
        )}

        {/* ------------------------------------------------ filters -------- */}
        {/* Independent, so each row toggles on its own: the active rules combine
            with AND, and an object is drawn when every one of them keeps it.
            None active draws everything. The rule itself is the detail line —
            a filter you cannot read is a filter you cannot trust. */}
        {collection && (
          <CardSection
            title="filters"
            action={
              <ColumnOptionPicker
                source={{ kind: "mesh", meshCollection: collection.id }}
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
                    <RowAction
                      title="Remove this rule"
                      danger
                      onClick={() => removeFilterBy(index)}
                    >
                      <X className="h-2.5 w-2.5" />
                    </RowAction>
                  </>
                }
              />
            ))}
          </CardSection>
        )}

        {/* ------------------------------------------------ opacity -------- */}
        <CardSection title="opacity">
          <div className="flex items-center gap-1.5">
            <Slider
              min={0}
              max={100}
              step={5}
              value={[Math.round((layer.opacity ?? 1) * 100)]}
              onValueChange={([value]) => patchSceneLayer(layer.id, { opacity: value / 100 })}
              className="flex-1 py-1"
            />
            <span className="w-7 shrink-0 text-right font-mono text-[9px] text-white/40">
              {Math.round((layer.opacity ?? 1) * 100)}%
            </span>
          </div>
        </CardSection>

        {/* ------------------------------------------------ render --------- */}
        <CardSection title="render">
          <div className="flex flex-wrap items-center gap-1.5">
            <SegmentGroup>
              {DETAIL_PRESETS.map((preset) => (
                <Segment
                  key={preset}
                  active={(layer.detail ?? "fine") === preset}
                  title={`LOD budget: ${preset} (${{ fine: "1", balanced: "2", fast: "4" }[preset]} px screen error)`}
                  onClick={() => patchSceneLayer(layer.id, { detail: preset })}
                >
                  {preset}
                </Segment>
              ))}
            </SegmentGroup>
            <IconToggle
              active={layer.flatNormals === false}
              title="Smooth normals (computed per cell on the main thread; flat derivative shading is cheaper)"
              onClick={() => patchSceneLayer(layer.id, { flatNormals: layer.flatNormals === false })}
              icon={<Waves className="h-2.5 w-2.5" />}
              label="smooth"
            />
            <IconToggle
              active={layer.doubleSided !== false}
              title="Render both faces (off = front faces only; interiors disappear through openings)"
              onClick={() => patchSceneLayer(layer.id, { doubleSided: layer.doubleSided === false })}
              icon={<FlipHorizontal2 className="h-2.5 w-2.5" />}
              label="two-sided"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] uppercase tracking-[0.08em] text-white/35">slab</span>
            <SegmentGroup>
              {SLAB_SCALES.map((scale) => (
                <Segment
                  key={scale}
                  active={(layer.slabScale ?? 1) === scale}
                  title="2D cross-section thickness, × the scene's z-step (2D view only)"
                  onClick={() => patchSceneLayer(layer.id, { slabScale: scale })}
                >
                  ×{scale}
                </Segment>
              ))}
            </SegmentGroup>
          </div>
        </CardSection>

        {/* ------------------------------------------------ instance ------- */}
        <CardSection title="instance">
          <div className="flex flex-wrap items-center gap-1.5">
          {selected ? (
            <>
              <span
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[9px] leading-none text-white"
                style={{
                  background: `hsla(${instanceHue(selected.ordinal) * 360}, 70%, 45%, 0.35)`,
                  border: `1px solid hsla(${instanceHue(selected.ordinal) * 360}, 80%, 60%, 0.6)`,
                }}
              >
                <Crosshair className="h-2.5 w-2.5" />
                {selected.objectId !== null ? `#${selected.objectId}` : `ord ${selected.ordinal}`}
              </span>
              {selected.stats && (
                <span className="text-[9px] text-white/40">
                  {formatCount(selected.stats.vertices)}v ·{" "}
                  {formatCount(Math.round(selected.stats.indices / 3))}t
                </span>
              )}
              <IconToggle
                active={selected.isolate}
                title="Show ONLY this instance"
                onClick={() => setMeshSelection({ ...selected, isolate: !selected.isolate })}
                icon={<Box className="h-2.5 w-2.5" />}
                label="isolate"
              />
              <button
                title="Clear selection"
                onClick={() => setMeshSelection(null)}
                className="grid h-4 w-4 place-items-center rounded text-white/40 transition-colors hover:bg-white/10 hover:text-white/80"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <>
              <input
                value={idQuery}
                onChange={(event) => setIdQuery(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && selectById()}
                placeholder="object id"
                className="h-5 w-16 rounded-md border border-white/10 bg-black/30 px-1.5 text-[9px] text-white/80 outline-none transition-colors placeholder:text-white/25 focus:border-sky-400/40"
              />
              <IconToggle
                active={false}
                title="Select by object id"
                onClick={selectById}
                icon={<Crosshair className="h-2.5 w-2.5" />}
                label="select"
              />
              <span className="text-[9px] text-white/25">or click a mesh in probe mode</span>
            </>
          )}
          </div>
        </CardSection>

        {/* What the collection actually is, read off the store's mirrored
            manifest — so this costs no request and cannot disagree with what
            the renderer streams. */}
        {store && (
          <div className="flex flex-wrap items-center gap-1 border-t border-white/5 px-2 py-1">
            {counts.objects !== undefined && (
              <Badge title="Objects in the collection">{formatCount(counts.objects)} objects</Badge>
            )}
            {totalCells > 0 && (
              <Badge title={`Cells per level, finest first: ${cellsPerLevel.join(", ")}`}>
                {formatCount(totalCells)} cells
              </Badge>
            )}
            {grid.levels !== undefined && <Badge title="Octree levels">{grid.levels} levels</Badge>}
            {grid.cellSize && (
              <Badge title="Cell size in voxels, per vertex component">
                {grid.cellSize.join("×")}
              </Badge>
            )}
            {encoding.codec && encoding.codec !== "NONE" && <Badge>{encoding.codec}</Badge>}
            {store.specVersion && (
              <Badge title="fabriks spec version">fabriks v{store.specVersion}</Badge>
            )}
          </div>
        )}
      </div>
    );
  },
);
MeshLayerCard.displayName = "MeshLayerCard";
