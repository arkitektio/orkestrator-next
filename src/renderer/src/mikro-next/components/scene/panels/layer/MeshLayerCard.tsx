import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Box,
  Crosshair,
  Eye,
  EyeOff,
  FlipHorizontal2,
  Grid3x3,
  Trash2,
  Waves,
  X,
} from "lucide-react";
import { memo, useState } from "react";
import type { SceneLayerFragment } from "@/mikro-next/api/graphql";
import {
  DEFAULT_INSTANCE_COLORMAP,
  INSTANCE_COLORMAPS,
  INSTANCE_COLORMAP_SPECS,
  instanceHue,
  type FabriksInstanceColormap,
} from "../../render/fabriks/instanceColormaps";
import { useSceneStore, type MeshLayerSessionState } from "../../store/sceneStore";
import { useViewerStore } from "../../store/viewerStore";

/**
 * A compact card for a `MeshLayer` in the Layers panel.
 *
 * Control language (deliberate, keep consistent when extending):
 *  - SEGMENTED groups for mutually-exclusive choices (palette, detail, slab):
 *    one joined pill, the active segment filled sky.
 *  - ICON TOGGLES for independent booleans (wireframe, smooth, two-sided):
 *    icon + label, sky when on, muted when off.
 *  - Rows lead with a fixed-width uppercase label so controls align.
 *
 * What it can do is bounded by the API: `updateLayer` is typed to return
 * `ImageLayer` and there is no `updateMeshLayer`, so every control here is a
 * SESSION-LOCAL patch (`patchSceneLayer`) — visibility included.
 */

type MeshLayerVariant = Extract<SceneLayerFragment, { __typename: "MeshLayer" }> &
  MeshLayerSessionState;

/** `store.counts` is the manifest's own tally, mirrored by the API. */
type FabriksCounts = { objects?: number; cellsPerLevel?: number[] };

const DETAIL_PRESETS = ["fine", "balanced", "fast"] as const;
const SLAB_SCALES = [1, 3, 5] as const;

const formatCount = (value: number): string =>
  value >= 1_000_000
    ? `${(value / 1_000_000).toFixed(1)}M`
    : value >= 1_000
      ? `${(value / 1_000).toFixed(1)}k`
      : String(value);

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

/** Fixed-width row label, aligning every control row. */
const RowLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="w-11 shrink-0 text-[9px] font-medium uppercase tracking-[0.08em] text-white/35">
    {children}
  </span>
);

/** One segment of a joined segmented control. */
const Segment = ({
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
    className={`px-1.5 py-0.5 text-[9px] leading-none transition-colors ${
      active
        ? "bg-sky-400/25 font-medium text-sky-100"
        : "text-white/45 hover:bg-white/5 hover:text-white/80"
    }`}
  >
    {children}
  </button>
);

const SegmentGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-stretch overflow-hidden rounded-md border border-white/10 bg-black/30 divide-x divide-white/10">
    {children}
  </div>
);

/** An independent boolean: icon + label, sky when on. */
const IconToggle = ({
  active,
  title,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  title: string;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    title={title}
    onClick={onClick}
    className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9px] leading-none transition-colors ${
      active
        ? "border-sky-400/40 bg-sky-400/15 text-sky-100"
        : "border-white/10 bg-black/30 text-white/45 hover:text-white/80"
    }`}
  >
    {icon}
    {label}
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

    const byInstance = layer.colorByInstance !== false;
    const activePalette = layer.instanceColormap ?? DEFAULT_INSTANCE_COLORMAP;

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
        <div className="flex items-center gap-1.5 border-t border-white/5 px-2 py-1.5">
          <RowLabel>colors</RowLabel>
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
        </div>

        {/* ------------------------------------------------ opacity -------- */}
        <div className="flex items-center gap-1.5 border-t border-white/5 px-2 py-1.5">
          <RowLabel>opacity</RowLabel>
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

        {/* ------------------------------------------------ render --------- */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-white/5 px-2 py-1.5">
          <RowLabel>render</RowLabel>
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
          <span className="ml-0.5 text-[9px] uppercase tracking-[0.08em] text-white/35">slab</span>
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

        {/* ------------------------------------------------ instance ------- */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-white/5 px-2 py-1.5">
          <RowLabel>instance</RowLabel>
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
