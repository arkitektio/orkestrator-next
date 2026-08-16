import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Box, Eye, EyeOff, Grid3x3, Trash2, X } from "lucide-react";
import { memo, useState } from "react";
import type { SceneLayerFragment } from "@/mikro-next/api/graphql";
import {
  DEFAULT_INSTANCE_COLORMAP,
  INSTANCE_COLORMAPS,
} from "../../render/fabriks/instanceColormaps";
import { useSceneStore, type MeshLayerSessionState } from "../../store/sceneStore";
import { useViewerStore } from "../../store/viewerStore";

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

type MeshLayerVariant = Extract<SceneLayerFragment, { __typename: "MeshLayer" }> &
  MeshLayerSessionState;

/** `store.counts` is the manifest's own tally, mirrored by the API. */
type FabriksCounts = { objects?: number; cellsPerLevel?: number[] };

const formatCount = (value: number): string =>
  value >= 1_000_000
    ? `${(value / 1_000_000).toFixed(1)}M`
    : value >= 1_000
      ? `${(value / 1_000).toFixed(1)}k`
      : String(value);

const DETAIL_PRESETS = ["fine", "balanced", "fast"] as const;
const SLAB_SCALES = [1, 3, 5] as const;

/** The card's toggle/preset chip (matches the colors row's styling). */
const Chip = ({
  active,
  title,
  onClick,
  children,
}: {
  active: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    title={title}
    onClick={onClick}
    className={`rounded border px-1 py-px text-[9px] transition-colors ${
      active
        ? "border-sky-400/50 bg-sky-400/10 text-sky-200"
        : "border-white/10 text-white/50 hover:text-white/80"
    }`}
  >
    {children}
  </button>
);

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
            className={`h-5 w-5 shrink-0 ${
              layer.wireframe ? "text-sky-300" : "text-white/50 hover:text-white/90"
            }`}
            // Session-local: there is no updateMeshLayer to persist it to.
            title={
              layer.wireframe
                ? "Solid surface (this session only)"
                : "Wireframe (this session only)"
            }
            onClick={() => patchSceneLayer(layer.id, { wireframe: !layer.wireframe })}
          >
            <Grid3x3 className="h-3 w-3" />
          </Button>

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

        {/* Coloring — session-local, always visible. Instance coloring (by
            objectOrdinal) is the default; "uniform" uses the layer's stored
            materialColor (gray when it has none). */}
        <div className="flex flex-wrap items-center gap-1 border-t border-white/5 px-2 py-1">
          <span className="shrink-0 text-[9px] text-white/40">colors</span>
          {INSTANCE_COLORMAPS.map((name) => {
            const byInstance = layer.colorByInstance !== false;
            const active =
              byInstance && (layer.instanceColormap ?? DEFAULT_INSTANCE_COLORMAP) === name;
            return (
              <button
                key={name}
                title={`Color by instance id with the "${name}" palette (this session only)`}
                className={`rounded border px-1 py-px text-[9px] transition-colors ${
                  active
                    ? "border-sky-400/50 bg-sky-400/10 text-sky-200"
                    : "border-white/10 text-white/50 hover:text-white/80"
                }`}
                onClick={() =>
                  patchSceneLayer(layer.id, { colorByInstance: true, instanceColormap: name })
                }
              >
                {name}
              </button>
            );
          })}
          <button
            title="One uniform color for the whole collection (the layer's material color; this session only)"
            className={`flex items-center gap-1 rounded border px-1 py-px text-[9px] transition-colors ${
              layer.colorByInstance === false
                ? "border-sky-400/50 bg-sky-400/10 text-sky-200"
                : "border-white/10 text-white/50 hover:text-white/80"
            }`}
            onClick={() => patchSceneLayer(layer.id, { colorByInstance: false })}
          >
            <span
              className="h-2 w-2 rounded-full border border-white/20"
              style={{
                background: layer.materialColor
                  ? `rgb(${layer.materialColor[0] ?? 0}, ${layer.materialColor[1] ?? 0}, ${layer.materialColor[2] ?? 0})`
                  : "rgb(184, 184, 194)",
              }}
            />
            uniform
          </button>
        </div>

        {/* Opacity — session-local, a uniform edit (no recompile). */}
        <div className="flex items-center gap-2 border-t border-white/5 px-2 py-1">
          <span className="shrink-0 text-[9px] text-white/40">opacity</span>
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

        {/* Render options — session-local. */}
        <div className="flex flex-wrap items-center gap-1 border-t border-white/5 px-2 py-1">
          <span className="shrink-0 text-[9px] text-white/40">detail</span>
          {DETAIL_PRESETS.map((preset) => (
            <Chip
              key={preset}
              active={(layer.detail ?? "fine") === preset}
              title={`LOD budget: ${preset} (${{ fine: "1", balanced: "2", fast: "4" }[preset]} px screen error)`}
              onClick={() => patchSceneLayer(layer.id, { detail: preset })}
            >
              {preset}
            </Chip>
          ))}
          <Chip
            active={layer.flatNormals === false}
            title="Smooth normals (computed per cell on the main thread; flat derivative shading is cheaper)"
            onClick={() => patchSceneLayer(layer.id, { flatNormals: layer.flatNormals === false })}
          >
            smooth
          </Chip>
          <Chip
            active={layer.doubleSided !== false}
            title="Render both faces (off = front faces only; interiors disappear through openings)"
            onClick={() => patchSceneLayer(layer.id, { doubleSided: layer.doubleSided === false })}
          >
            two-sided
          </Chip>
          <span className="ml-1 shrink-0 text-[9px] text-white/40">slab</span>
          {SLAB_SCALES.map((scale) => (
            <Chip
              key={scale}
              active={(layer.slabScale ?? 1) === scale}
              title="2D cross-section thickness, × the scene's z-step (2D view only)"
              onClick={() => patchSceneLayer(layer.id, { slabScale: scale })}
            >
              ×{scale}
            </Chip>
          ))}
        </div>

        {/* Instance selection: identify (click in probe mode / by id here),
            highlight, isolate. */}
        <div className="flex flex-wrap items-center gap-1 border-t border-white/5 px-2 py-1">
          <span className="shrink-0 text-[9px] text-white/40">instance</span>
          {selected ? (
            <>
              <span className="rounded bg-sky-400/10 px-1 py-px font-mono text-[9px] text-sky-200">
                {selected.objectId !== null ? `#${selected.objectId}` : `ordinal ${selected.ordinal}`}
              </span>
              {selected.stats && (
                <span className="text-[9px] text-white/40">
                  {formatCount(selected.stats.vertices)}v ·{" "}
                  {formatCount(Math.round(selected.stats.indices / 3))}t
                </span>
              )}
              <Chip
                active={selected.isolate}
                title="Show ONLY this instance"
                onClick={() => setMeshSelection({ ...selected, isolate: !selected.isolate })}
              >
                isolate
              </Chip>
              <button
                title="Clear selection"
                onClick={() => setMeshSelection(null)}
                className="text-white/40 transition-colors hover:text-white/80"
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
                className="h-5 w-16 rounded border border-white/10 bg-transparent px-1 text-[9px] text-white/80 outline-none placeholder:text-white/25"
              />
              <Chip active={false} title="Select by object id" onClick={selectById}>
                select
              </Chip>
              <span className="text-[9px] text-white/30">or click a mesh in probe mode</span>
            </>
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
