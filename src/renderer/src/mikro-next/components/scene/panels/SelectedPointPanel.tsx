import { Slider } from "@/components/ui/slider";
import { resolveProbeStrategy } from "../core/probe/probeModes";
import type { ProbeMode, ProbeResult } from "../core/probe/probeTypes";
import { formatProbeValue } from "../core/probe/valueFormat";
import { useModeStore } from "../store/modeStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";
import type { LayerState } from "../core/layerModel";

/**
 * The probe HUD: strategy selector, threshold (only while the effective
 * strategy uses it), the probed coordinate with per-channel raw values and
 * their provenance (exact vs LOD-approximate vs pending), and the saved
 * probes. Composes in the scene column (Scene.Probe).
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
  const probedCoordinate = useViewerStore((s) => s.probedCoordinate);
  const setProbedCoordinate = useViewerStore((s) => s.setProbedCoordinate);
  const savedProbes = useViewerStore((s) => s.savedProbes);
  const addSavedProbe = useViewerStore((s) => s.addSavedProbe);
  const removeSavedProbe = useViewerStore((s) => s.removeSavedProbe);
  const clearSavedProbes = useViewerStore((s) => s.clearSavedProbes);
  const probeThreshold = useViewerStore((s) => s.probeThreshold);
  const setProbeThreshold = useViewerStore((s) => s.setProbeThreshold);
  const probeMode = useViewerStore((s) => s.probeMode);
  const setProbeMode = useViewerStore((s) => s.setProbeMode);
  const layer = useSceneStore((s) =>
    probedCoordinate
      ? s.layers.find((candidate) => candidate.id === probedCoordinate.layerId)
      : null,
  );

  const inProbeMode = interactionMode === "PROBE" || interactionMode === "AUTO_PROBE";
  if (!inProbeMode && !probedCoordinate && savedProbes.length === 0) return null;

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
          {probedCoordinate && (
            <>
              <button className={smallButton} onClick={() => addSavedProbe(probedCoordinate)}>
                Save
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
          Click a layer to probe it{interactionMode === "AUTO_PROBE" ? " (or hover)" : ""}.
          Hold Shift to save the point.
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
        </div>
      )}

      {savedProbes.length > 0 && (
        <div className="mt-2 space-y-1 border-t border-white/10 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-white/60">Saved</span>
            <button className={smallButton} onClick={() => clearSavedProbes()}>
              Clear all
            </button>
          </div>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {savedProbes.map((probe) => (
              <div
                key={`${probe.layerId}:${probe.voxelIndex.join(":")}`}
                className="flex items-center justify-between gap-2 rounded border border-white/10 bg-white/5 px-2 py-1"
              >
                <div className="min-w-0">
                  <div className="font-mono text-[10px] text-white/80">
                    [{probe.voxelIndex.join(", ")}]
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/60">
                    {formatProbeValue(probe.values[0]?.value ?? null, probe.dtype)}
                    {probe.values.length > 1 && (
                      <span className="text-white/40">+{probe.values.length - 1}</span>
                    )}
                    <ProvenanceBadge probe={probe} />
                  </div>
                </div>
                <button className={smallButton} onClick={() => removeSavedProbe(probe)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
