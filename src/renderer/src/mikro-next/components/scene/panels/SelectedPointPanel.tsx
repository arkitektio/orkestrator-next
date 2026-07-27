import { Slider } from "@/components/ui/slider";
import { ScanEye } from "lucide-react";
import { AttributeRowsSection } from "./AttributeRowsSection";
import { resolveProbeStrategy } from "../core/probe/probeModes";
import type { ProbeMode, ProbeResult } from "../core/probe/probeTypes";
import { formatProbeValue } from "../core/probe/valueFormat";
import { beginPathFromProbe } from "../interactions/pathFromProbe";
import { useCreateSceneAnnotation } from "../interactions/useCreateSceneAnnotation";
import { useModeStore } from "../store/modeStore";
import { useRoiDrawingStore } from "../store/roiDrawingStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import type { LayerState } from "../core/layerModel";

/**
 * The probe HUD: strategy selector, threshold (only while the effective
 * strategy uses it), the probed coordinate with per-channel raw values and
 * their provenance (exact vs LOD-approximate vs pending), plus actions that
 * make the probe durable — mark it as a point annotation or start a path
 * draw anchored at it. Composes in the scene column (Scene.Probe).
 */

const PROBE_MODES: { mode: ProbeMode; label: string }[] = [
  { mode: "auto", label: "Auto" },
  { mode: "first-hit", label: "First hit" },
  { mode: "max", label: "Max" },
  { mode: "gradient", label: "Gradient" },
];

const STRATEGY_LABELS: Record<string, string> = {
  "first-hit": "first hit",
  max: "max intensity",
  gradient: "strongest gradient",
  "volume-accum": "opacity depth",
  plane: "plane",
};

const layerLabel = (layer: LayerState | null | undefined, fallback: string): string =>
  layer?.lens.activeAnchors.filter((a) => a.channelLabel)?.[0]?.channelLabel?.label ??
  fallback;

const channelLabel = (layer: LayerState | null | undefined, channel: number): string =>
  layer?.channels.find((node) => node.intensityIndex === channel)?.label ??
  `Ch ${channel}`;

const ProvenanceBadge = ({ probe }: { probe: ProbeResult }) => {
  const { source, level } = probe.provenance;
  if (source === "exact") {
    return (
      <span className="rounded bg-emerald-500/20 px-1 text-[9px] font-medium text-emerald-300">
        exact
      </span>
    );
  }
  if (source === "resident") {
    return (
      <span className="rounded bg-white/10 px-1 text-[9px] font-medium text-white/50">
        {level === 0 ? "level 0" : `~LOD ${level}`}
      </span>
    );
  }
  return (
    <span className="rounded bg-white/10 px-1 text-[9px] font-medium text-white/40">…</span>
  );
};

const smallButton =
  "pointer-events-auto rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/70 hover:bg-white/15 hover:text-white";

export const SelectedPointPanel = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const displayMode = useModeStore((s) => s.displayMode);
  const probeFollowsCursor = useModeStore((s) => s.probeFollowsCursor);
  const setProbeFollowsCursor = useModeStore((s) => s.setProbeFollowsCursor);
  const setInteractionMode = useModeStore((s) => s.setInteractionMode);
  const probedCoordinate = useViewerStore((s) => s.probedCoordinate);
  const setProbedCoordinate = useViewerStore((s) => s.setProbedCoordinate);
  const setActiveTool = useRoiDrawingStore((s) => s.setActiveTool);
  const setPendingPathSeed = useRoiDrawingStore((s) => s.setPendingPathSeed);
  const { createPointAnnotation } = useCreateSceneAnnotation();
  const probeThreshold = useViewerStore((s) => s.probeThreshold);
  const setProbeThreshold = useViewerStore((s) => s.setProbeThreshold);
  const probeMode = useViewerStore((s) => s.probeMode);
  const setProbeMode = useViewerStore((s) => s.setProbeMode);
  const layer = useSceneStore((s) =>
    probedCoordinate
      ? s.layers.find((candidate) => candidate.id === probedCoordinate.layerId)
      : null,
  );

  const inProbeMode = interactionMode === "PROBE";
  if (!inProbeMode && !probedCoordinate) return null;

  const resolved = resolveProbeStrategy(probeMode, layer?.projection, probeThreshold);
  // The slider matters only where the march actually consumes it: 3D, an
  // effective first-hit strategy, and not the iso override.
  const showThreshold =
    displayMode === "3D" &&
    resolved.strategy === "first-hit" &&
    resolved.threshold === probeThreshold;

  return (
    <div className="pointer-events-auto rounded-lg border border-black/10 bg-black/40 p-2 backdrop-blur-md">
      <div className="flex items-center justify-between text-[10px] font-medium text-white/60">
        <span>Probe</span>
        <div className="flex gap-1">
          {/* What used to be the separate AUTO_PROBE mode. Hover updates the
              readout only — the camera pivot still follows clicks alone. */}
          {inProbeMode && (
            <button
              className={
                probeFollowsCursor
                  ? `${smallButton} bg-white/20 text-white`
                  : smallButton
              }
              onClick={() => setProbeFollowsCursor(!probeFollowsCursor)}
              title="Update the probe continuously as the cursor moves"
            >
              <ScanEye className="h-3 w-3" />
            </button>
          )}
          {probedCoordinate && (
            <>
              <button
                className={`${smallButton} disabled:cursor-not-allowed disabled:opacity-40`}
                disabled={!probedCoordinate.worldPos}
                title="Create a point annotation at this probe"
                onClick={() =>
                  probedCoordinate.worldPos &&
                  createPointAnnotation(probedCoordinate.worldPos)
                }
              >
                Mark point
              </button>
              <button
                className={`${smallButton} disabled:cursor-not-allowed disabled:opacity-40`}
                disabled={!probedCoordinate.worldPos}
                title="Draw a path starting at this probe (D)"
                onClick={() =>
                  probedCoordinate.worldPos &&
                  beginPathFromProbe(
                    probedCoordinate.worldPos,
                    { setPendingPathSeed, setActiveTool },
                    setInteractionMode,
                  )
                }
              >
                Draw path
              </button>
              <button className={smallButton} onClick={() => setProbedCoordinate(null)}>
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {displayMode === "3D" && (
        <div className="mt-2">
          <div className="grid grid-cols-4 gap-0.5 rounded bg-white/5 p-0.5">
            {PROBE_MODES.map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => setProbeMode(mode)}
                className={`rounded px-1 py-0.5 text-[10px] transition-colors ${
                  probeMode === mode
                    ? "bg-white/20 font-medium text-white"
                    : "text-white/50 hover:bg-white/10 hover:text-white/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {probeMode === "auto" && (
            <p className="mt-1 text-[10px] leading-4 text-white/50">
              Following the projection: {STRATEGY_LABELS[resolved.strategy]}.
            </p>
          )}
        </div>
      )}

      {showThreshold && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-[10px] font-medium text-white/60">
            <span>Threshold</span>
            <span className="rounded bg-white/10 px-1 font-mono text-white/90">
              {probeThreshold.toFixed(3)}
            </span>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.005}
            value={[probeThreshold]}
            onValueChange={([value]) => setProbeThreshold(value)}
            className="py-2"
          />
        </div>
      )}

      {!probedCoordinate && (
        <p className="mt-2 text-[10px] leading-4 text-white/50">
          Click a layer to probe it{probeFollowsCursor ? " (or hover)" : ""}.
          Shift+click to drop a point annotation.
        </p>
      )}

      {probedCoordinate && (
        <div className="mt-2 space-y-1.5 text-[11px]">
          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
            <span className="text-white/50">Layer</span>
            <span className="truncate font-medium text-white/90">
              {layerLabel(layer, probedCoordinate.layerId)}
            </span>
            <span className="text-white/50">Voxel</span>
            <span className="font-mono text-white/90">
              [{probedCoordinate.voxelIndex.join(", ")}]
            </span>
            {probedCoordinate.worldPos && (
              <>
                <span className="text-white/50">World</span>
                <span className="font-mono text-white/90">
                  {probedCoordinate.worldPos.map((v) => v.toFixed(3)).join(", ")}
                </span>
              </>
            )}
          </div>

          <div className="space-y-0.5 rounded border border-white/10 bg-white/5 px-2 py-1.5">
            {probedCoordinate.values.map((entry) => (
              <div key={entry.channel} className="flex items-center justify-between gap-2">
                <span className="truncate text-[10px] text-white/60">
                  {channelLabel(layer, entry.channel)}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="font-mono text-white/90">
                    {formatProbeValue(entry.value, probedCoordinate.dtype)}
                  </span>
                  <ProvenanceBadge probe={probedCoordinate} />
                </span>
              </div>
            ))}
          </div>

          {/* Attribute-plan results: what the tables attached to this pixel's
              object know about it (AttributeProbeTracker fills the store). */}
          <AttributeRowsSection probe={probedCoordinate} />
        </div>
      )}
    </div>
  );
};
