import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CircleDot, Eye, EyeOff, Trash2 } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import {
  ColorMap,
  useUpdatePointLayerMutation,
  type SceneLayerFragment,
  type UpdatePointLayerInput,
} from "@/mikro-next/api/graphql";
import { useSceneStore } from "../../platform/stores/sceneStore";
import {
  Badge,
  CardSection,
  OpacityRow,
  RowLabel,
  Segment,
  SegmentGroup,
} from "../../platform/layerui/cardControls";
import { ColormapSelect } from "../../platform/layerui/ColormapSelect";
import { CONTINUOUS_COLORMAPS, colormapGradientCSS } from "../../platform/layerui/colormap-utils";

/**
 * A compact card for a `PointLayer` in the Layers panel.
 *
 * The point layer shipped with a renderer and no card at all, so until now a
 * point cloud could not be hidden, resized or recoloured once created — every
 * setting was whatever `createPointLayer` was given. Everything here persists:
 * `updatePointLayer` takes the pickers, `sizeColumn`, `pointSize`, `colormap`,
 * `opacity`, `visible` and `order`.
 *
 * WHAT THIS CARD DOES NOT DO, and why it is a gap rather than a decision: it
 * cannot ADD a colouring. `ColumnOptionPicker` — which is how the mesh and label
 * cards let you pick a new column — has exactly two roots on the server,
 * `colorByOptions(meshCollection:)` and `labelColorByOptions(lens:)`. A point
 * layer has neither a collection nor a lens; its objects ARE rows of its table,
 * which is precisely the case the option queries do not cover. So this card
 * switches between the colourings the layer already publishes and tunes the
 * flat settings, and adding one still means recreating the layer. Closing that
 * means a table-rooted options query on the server, mirroring the label one.
 *
 * Write cadence follows the mesh card: edits fold into the store immediately so
 * the canvas previews them, and sliders persist on COMMIT rather than per tick.
 */

type PointLayerVariant = Extract<SceneLayerFragment, { __typename: "PointLayer" }>;

/**
 * What `persist` may be handed: the mutation's OWN field set, minus the id.
 * `Partial<PointLayerVariant>` would admit `__typename`, `tableDataset` and the
 * placement fields, and GraphQL rejects the whole mutation on one unknown input
 * field — see the sibling note in `TrackLayerCard`.
 */
type PointPatch = Omit<UpdatePointLayerInput, "id">;

export const PointLayerCard = memo(
  ({
    layer,
    onRemove,
  }: {
    layer: PointLayerVariant;
    onRemove?: (id: string) => void;
  }) => {
    const patchSceneLayer = useSceneStore((s) => s.patchSceneLayer);
    const [updatePointLayer] = useUpdatePointLayerMutation();
    const hidden = layer.visible === false;

    /**
     * Preview locally, persist on commit.
     *
     * The fold is not optional: `SceneProvider` reconciles the layer set by
     * STRUCTURE, so a `GetScene` re-emission that changed only this layer's
     * content keeps the stored object as it was.
     *
     * `colorBys`/`filterBys` are deliberately never sent from here. They are
     * whole-array replacements on the input, and an entry read back without its
     * `joinPath` or its clims and re-sent flattens them — the same column name
     * resolved against the wrong table, silently. This card only ever moves the
     * ACTIVE index, which carries no such hazard.
     */
    const persist = useCallback(
      (patch: PointPatch) => {
        // The two sides have deliberately different nullability. The INPUT lets
        // a field be null to mean "reset to the server's default"; the FRAGMENT
        // types some of those same fields non-null, because that is what comes
        // back. So the local preview takes the patch as-is and the authoritative
        // value arrives with the mutation's own result — the cast states that,
        // rather than widening the input type and losing the check above.
        patchSceneLayer(layer.id, patch as Parameters<typeof patchSceneLayer>[1]);
        void updatePointLayer({
          variables: { input: { id: layer.id, ...patch } },
        }).catch((error: unknown) => {
          console.warn("[points] could not save layer settings", error);
        });
      },
      [layer.id, patchSceneLayer, updatePointLayer],
    );

    const colormapChoices = useMemo(
      () =>
        CONTINUOUS_COLORMAPS.map((colormap) => ({
          value: colormap,
          label: colormap.toLowerCase(),
          css: colormapGradientCSS(colormap),
        })),
      [],
    );

    const colorBys = layer.colorBys ?? [];
    const pointSize = layer.pointSize ?? 3;

    /** A colouring's own label, else the column or matrix it names. */
    const captionOf = (entry: (typeof colorBys)[number], index: number): string =>
      entry.label?.trim() || entry.column?.trim() || `colouring ${index + 1}`;

    return (
      <div
        className={`@container/card rounded-lg border border-white/10 bg-black/40 backdrop-blur-md transition-opacity ${
          hidden ? "opacity-50" : ""
        }`}
      >
        {/* ------------------------------------------------ header --------- */}
        <div className="flex items-center gap-1.5 px-2 py-1.5">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-violet-400/15">
            <CircleDot className="h-3 w-3 text-violet-300" />
          </span>
          <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-white/90">
            {layer.tableDataset?.name?.trim() || `Points ${layer.id}`}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0 text-white/45 hover:text-white/90"
            title={hidden ? "Show" : "Hide"}
            onClick={() => persist({ visible: hidden })}
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

        {/* ------------------------------------------------ size ----------- */}
        <CardSection title="size">
          <div className="flex items-center gap-1.5">
            <Slider
              min={0.5}
              max={20}
              step={0.5}
              value={[pointSize]}
              onValueChange={([value]) => patchSceneLayer(layer.id, { pointSize: value })}
              onValueCommit={([value]) => persist({ pointSize: value })}
              className="flex-1 py-1"
            />
            <span className="w-7 shrink-0 text-right font-mono text-[9px] text-white/40">
              {pointSize}
            </span>
          </div>
        </CardSection>

        {/* ------------------------------------------------ colouring ------ */}
        {colorBys.length > 0 && (
          <CardSection title="color by">
            <SegmentGroup>
              <Segment
                active={layer.activeColorBy == null}
                title="Draw every point in the flat colour, ignoring the colourings below"
                onClick={() => persist({ activeColorBy: null })}
              >
                flat
              </Segment>
              {colorBys.map((entry, index) => (
                <Segment
                  key={`${entry.table ?? entry.dataset ?? "entry"}-${entry.column ?? index}`}
                  active={layer.activeColorBy === index}
                  title={`Colour the points by ${captionOf(entry, index)}`}
                  onClick={() => persist({ activeColorBy: index })}
                >
                  {captionOf(entry, index)}
                </Segment>
              ))}
            </SegmentGroup>
            {layer.activeColorBy != null && (
              <div className="mt-1.5">
                <ColormapSelect
                  value={layer.colormap ?? ColorMap.Viridis}
                  choices={colormapChoices}
                  onChange={(value) => persist({ colormap: value as ColorMap })}
                  title="The ramp used when the active colouring names none of its own"
                />
              </div>
            )}
          </CardSection>
        )}

        <OpacityRow
          opacity={layer.opacity ?? 1}
          onChange={(opacity) => patchSceneLayer(layer.id, { opacity })}
          onCommit={(opacity) => persist({ opacity })}
        />

        {/* What the layer IS. The coordinate and id columns come from the
            dataset's declared roles, so they are stated rather than offered. */}
        <div className="flex flex-wrap items-center gap-1 border-t border-white/5 px-2 py-1">
          <RowLabel>from</RowLabel>
          <Badge title="The coordinate columns, resolved from the dataset's declared axes">
            {[layer.xColumn, layer.yColumn, layer.zColumn].filter(Boolean).join(" · ")}
          </Badge>
          {layer.sizeColumn && (
            <Badge title="The measure column mapped to per-point size">
              size {layer.sizeColumn}
            </Badge>
          )}
          {(layer.filterBys?.length ?? 0) > 0 && (
            <Badge title="Filters are stored on this layer but are not applied by the renderer yet">
              {layer.filterBys?.length} filter(s), not applied
            </Badge>
          )}
        </div>
      </div>
    );
  },
);
PointLayerCard.displayName = "PointLayerCard";
