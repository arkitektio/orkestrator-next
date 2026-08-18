import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Shapes, Trash2 } from "lucide-react";
import { memo, useMemo } from "react";
import {
  useGetSceneAnnotationsQuery,
  type SceneLayerFragment,
} from "@/mikro-next/api/graphql";
import { useRoiSelectionStore } from "../../store/roiSelectionStore";
import { useSceneStore } from "../../store/sceneStore";
import { Badge, RowLabel, formatCount } from "./cardControls";

/**
 * A compact card for an `AnnotationLayer` in the Layers panel.
 *
 * Scope on purpose: this is the card for the LAYER, not for its shapes. The
 * Annotations sidebar tab already lists every annotation with its measure and
 * a go-to button; repeating that here would give the same list two homes that
 * can disagree. What the Layers panel answers is what it answers for every
 * other layer — is it on, what is in it, and what is it.
 *
 * Every control is a SESSION-LOCAL patch (`patchSceneLayer`): there is no
 * `updateAnnotationLayer` mutation, so visibility lives for the session and no
 * longer — the same bound the mesh card's render settings work under.
 *
 * The "in view" count is the one thing here that a user cannot get anywhere
 * else, and it answers the question annotations actually provoke: shapes are
 * pinned to discrete coordinates, so a layer can be fully visible and still
 * draw nothing on the current slice. "0 / 5 in view" says that outright,
 * instead of leaving the layer looking broken.
 */

type AnnotationLayerVariant = Extract<
  SceneLayerFragment,
  { __typename: "AnnotationLayer" }
>;

/** Plural-aware kind caption: "3 rectangles", "1 point". */
const kindCaption = (kind: string, count: number): string => {
  const word = kind.toLowerCase();
  return `${count} ${count === 1 ? word : `${word}s`}`;
};

export const AnnotationLayerCard = memo(
  ({
    layer,
    onRemove,
  }: {
    layer: AnnotationLayerVariant;
    onRemove?: (id: string) => void;
  }) => {
    const patchSceneLayer = useSceneStore((s) => s.patchSceneLayer);
    const hidden = layer.visible === false;
    const collection = layer.annotationCollection;

    // The renderer polls this exact query for the same collection, so this is
    // a cache read that stays fresh on its cadence rather than a second poll.
    // It does run on its own when the layer is HIDDEN (the renderer unmounts
    // then) — which is the point: the card still has to say what is in there.
    const { data } = useGetSceneAnnotationsQuery({
      variables: { filters: { collection: collection?.id ?? "" } },
      skip: !collection,
    });
    const annotations = data?.annotations;

    const byKind = useMemo(() => {
      const counts = new Map<string, number>();
      for (const annotation of annotations ?? []) {
        counts.set(annotation.kind, (counts.get(annotation.kind) ?? 0) + 1);
      }
      // Commonest first: the shape the layer is mostly made of leads.
      return [...counts.entries()].sort((a, b) => b[1] - a[1]);
    }, [annotations]);

    // A SCALAR selector, deliberately: `visibleRois` is rewritten whenever the
    // z-plane moves, and subscribing to the objects would re-render this card
    // at scrub cadence (P17). A count only re-renders when the count changes.
    const inView = useRoiSelectionStore(
      (s) =>
        Object.values(s.visibleRois).filter((roi) => roi.layerId === layer.id)
          .length,
    );

    const total = annotations?.length ?? 0;

    return (
      <div
        className={`@container/card rounded-lg border border-white/10 bg-black/40 backdrop-blur-md transition-opacity ${
          hidden ? "opacity-50" : ""
        }`}
      >
        {/* ------------------------------------------------ header --------- */}
        <div className="flex items-center gap-1.5 px-2 py-1.5">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-amber-400/15">
            <Shapes className="h-3 w-3 text-amber-300" />
          </span>
          <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-white/90">
            {collection?.name?.trim() ||
              (collection ? `Annotations ${collection.id}` : "Annotations (no collection)")}
          </span>

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

        {/* ------------------------------------------------ shapes --------- */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-white/5 px-2 py-1.5">
          <RowLabel>shapes</RowLabel>
          {total === 0 ? (
            <span className="text-[9px] text-white/25">
              {annotations ? "empty — draw a shape to fill it" : "loading…"}
            </span>
          ) : (
            <>
              <span
                className={`font-mono text-[9px] ${
                  inView === 0 ? "text-amber-300/80" : "text-white/50"
                }`}
                title={
                  inView === 0
                    ? "None of this layer's shapes are on the current slice — scrub z or switch to 3D to see them"
                    : "Shapes currently drawn, of the layer's total"
                }
              >
                {formatCount(inView)} / {formatCount(total)} in view
              </span>
              {byKind.map(([kind, count]) => (
                <Badge key={kind} title={`${kind} annotations in this layer`}>
                  {kindCaption(kind, count)}
                </Badge>
              ))}
            </>
          )}
        </div>

        {/* What the layer actually is: the collection it draws and the frame
            its vectors live in — the two facts that explain where the shapes
            land when the placement looks wrong. */}
        {collection && (
          <div className="flex flex-wrap items-center gap-1 border-t border-white/5 px-2 py-1">
            <Badge title="The annotation collection this layer draws">
              collection {collection.id}
            </Badge>
            <Badge title="The coordinate system the annotations' vectors are in">
              {collection.coordinateSystem.name}
            </Badge>
            {collection.description?.trim() && (
              <Badge title={collection.description}>described</Badge>
            )}
          </div>
        )}
      </div>
    );
  },
);
AnnotationLayerCard.displayName = "AnnotationLayerCard";
