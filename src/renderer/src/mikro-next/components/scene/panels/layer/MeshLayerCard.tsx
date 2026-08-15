import { Button } from "@/components/ui/button";
import { Box, Eye, EyeOff, Trash2 } from "lucide-react";
import { memo } from "react";
import type { SceneLayerFragment } from "@/mikro-next/api/graphql";
import { useSceneStore } from "../../store/sceneStore";

/**
 * A compact card for a `MeshLayer` in the Layers panel.
 *
 * Separate from `LayerRow` rather than folded into it: that row is typed
 * against `LayerState`, the normalized IMAGE layer with a pyramid, a render
 * graph and a colormap swatch — a mesh layer has none of those, and widening
 * the row to a union would put four `undefined` branches through the panel's
 * hottest component.
 *
 * What it can do is bounded by the API, not by taste. `deleteLayer` is generic
 * across layer kinds, so removal is real; `updateLayer` is typed to return
 * `ImageLayer` and there is no `updateMeshLayer`, so **visibility is a
 * session-local toggle** and the card says so rather than pretending to
 * persist.
 */

type MeshLayerVariant = Extract<SceneLayerFragment, { __typename: "MeshLayer" }>;

/** `store.counts` is the manifest's own tally, mirrored by the API. */
type FabriksCounts = { objects?: number; cellsPerLevel?: number[] };

const formatCount = (value: number): string =>
  value >= 1_000_000
    ? `${(value / 1_000_000).toFixed(1)}M`
    : value >= 1_000
      ? `${(value / 1_000).toFixed(1)}k`
      : String(value);

const Badge = ({ children, title }: { children: React.ReactNode; title?: string }) => (
  <span
    className="shrink-0 rounded border border-white/10 bg-white/5 px-1 py-px text-[9px] text-white/50"
    title={title}
  >
    {children}
  </span>
);

export const MeshLayerCard = memo(
  ({ layer, onRemove }: { layer: MeshLayerVariant; onRemove?: (id: string) => void }) => {
    const patchSceneLayer = useSceneStore((s) => s.patchSceneLayer);
    const hidden = layer.visible === false;

    const collection = layer.collection;
    const store = collection?.store;
    const counts = (store?.counts ?? {}) as FabriksCounts;
    const grid = (store?.grid ?? {}) as { cellSize?: number[]; levels?: number };
    const encoding = (store?.encoding ?? {}) as { codec?: string; compression?: string };
    const cellsPerLevel = counts.cellsPerLevel ?? [];
    const totalCells = cellsPerLevel.reduce((sum, n) => sum + n, 0);

    return (
      <div
        className={`@container/card rounded border border-white/10 bg-black/40 backdrop-blur-md transition-colors ${
          hidden ? "opacity-50" : ""
        }`}
      >
        <div className="flex items-center gap-1.5 px-2 py-1.5">
          <Box className="h-3 w-3 shrink-0 text-sky-300/70" />
          <span className="min-w-0 flex-1 truncate text-[11px] text-white/90">
            {collection ? `Mesh ${collection.id}` : "Mesh (no collection)"}
          </span>

          <span className="hidden shrink-0 rounded bg-sky-400/10 px-1 py-px text-[9px] font-medium text-sky-200/80 @[13rem]/card:inline">
            Mesh
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0 text-white/50 hover:text-white/90"
            // Session-local: there is no updateMeshLayer to persist it to.
            title={hidden ? "Show (this session only)" : "Hide (this session only)"}
            onClick={() => patchSceneLayer(layer.id, { visible: hidden })}
          >
            {hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>

          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0 text-white/40 hover:text-red-300"
              title="Remove layer from scene"
              onClick={() => onRemove(layer.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>

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
