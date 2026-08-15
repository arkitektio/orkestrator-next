import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ClipboardCopy, Circle, Square } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { getInitialVolumeTextureBudgetBytes } from "../core/lodPlanning";
import {
  isAdaptiveDprEnabled,
  qualityGovernor,
  setAdaptiveDprEnabled,
  TIER_LABELS,
  type QualityTier,
} from "../core/qualityGovernor";
import { perfMonitor, type PerfSessionReport } from "../managers/perfMonitor";
import type { FabriksCollectionManager } from "../render/fabriks/fabriksManager";
import { isGpuRepackEnabled, setGpuRepackEnabled } from "../render/bricks/computeRepack";
import {
  isVolumeMergeEnabled,
  setVolumeMergeEnabled,
} from "../render/bricks/volumeMergeGroups";
import {
  isShaderFastPathEnabled,
  isSmoothZoomEnabled,
  setShaderFastPathEnabled,
  setSmoothZoomEnabled,
} from "../render/bricks/shaderFlags";
import { usePerfRecording } from "../PerfFrameProbe";
import { useModeStore } from "../store/modeStore";
import { useViewerStore, useViewerStoreApi } from "../store/viewerStore";
import { useViewStoreApi } from "../store/viewStore";

export const DebugPanel = () => {
  const isDebug = useViewerStore((s) => s.debug);
  const renderBudget = useViewerStore((s) => s.renderBudget);
  const unplannableLayers = useViewerStore((s) => s.unplannableLayers);
  const lodBias = useViewerStore((s) => s.lodBias);
  const setLodBias = useViewerStore((s) => s.setLodBias);
  const nodePlans = useViewerStore((s) => s.nodePlans);
  const brickSystem = useViewerStore((s) => s.brickSystem);
  useViewerStore((s) => s.residencyVersion); // refresh residency stats
  const meshSystems = useViewerStore((s) => s.meshSystems);
  useViewerStore((s) => s.meshVersion); // refresh fabriks streaming stats
  const displayMode = useModeStore((s) => s.displayMode);
  const viewerStoreApi = useViewerStoreApi();
  const viewStoreApi = useViewStoreApi();
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [reportCopied, setReportCopied] = useState(false);
  const recording = usePerfRecording();
  const [lastSession, setLastSession] = useState<PerfSessionReport | null>(null);
  const [gpuRepackOn, setGpuRepackOn] = useState(isGpuRepackEnabled);
  const [volumeMergeOn, setVolumeMergeOn] = useState(isVolumeMergeEnabled);
  const [shaderFastPathOn, setShaderFastPathOn] = useState(isShaderFastPathEnabled);
  const [smoothZoomOn, setSmoothZoomOn] = useState(isSmoothZoomEnabled);
  const [adaptiveDprOn, setAdaptiveDprOn] = useState(isAdaptiveDprEnabled);
  // Applied drawing-buffer DPR (CanvasSync re-registers the canvas on every
  // dpr change, so this chip tracks the interaction ladder live).
  const canvasDpr = useViewerStore((s) => s.canvas?.dpr);
  const [gpuSelfTest, setGpuSelfTest] = useState<string | null>(null);
  // Tier/override/streaming flips only — rare (P17-clean).
  useSyncExternalStore(qualityGovernor.subscribe, () => qualityGovernor.getVersion());

  if (!isDebug) return null;

  const toggleGpuRepack = () => {
    const next = !gpuRepackOn;
    setGpuRepackEnabled(next);
    setGpuRepackOn(next);
  };

  const toggleVolumeMerge = () => {
    const next = !volumeMergeOn;
    setVolumeMergeEnabled(next);
    setVolumeMergeOn(next);
  };

  const toggleShaderFastPath = () => {
    const next = !shaderFastPathOn;
    setShaderFastPathEnabled(next);
    setShaderFastPathOn(next);
  };

  const toggleSmoothZoom = () => {
    const next = !smoothZoomOn;
    setSmoothZoomEnabled(next);
    setSmoothZoomOn(next);
  };

  const toggleAdaptiveDpr = () => {
    const next = !adaptiveDprOn;
    setAdaptiveDprEnabled(next);
    setAdaptiveDprOn(next);
  };

  const runGpuSelfTest = () => {
    const manager = viewerStoreApi.getState().brickSystem;
    if (!manager) return;
    setGpuSelfTest("running…");
    void manager.runGpuRepackSelfTest().then((result) => {
      setGpuSelfTest(
        `${result.supported ? (result.pass ? "PASS" : "FAIL") : "n/a"} — ${result.detail}`,
      );
    });
  };

  const togglePerfRecording = () => {
    if (perfMonitor.isRecording()) {
      perfMonitor.stopRecording();
      setLastSession(perfMonitor.buildSessionReport());
    } else {
      setLastSession(null);
      perfMonitor.startRecording();
    }
  };

  /** One paste-able JSON blob covering planner + residency + camera state. */
  const copyDebugReport = () => {
    const viewerState = viewerStoreApi.getState();
    const viewState = viewStoreApi.getState();
    const report = {
      generatedAt: new Date().toISOString(),
      displayMode,
      lodBias: viewerState.lodBias,
      currentZ: viewerState.currentZ,
      budgetBytes: getInitialVolumeTextureBudgetBytes(),
      viewportSize: viewState.viewportSize,
      // CSS size alone cannot tell you the fragment count — the quality
      // governor modulates DPR per tier, so `pixels` is the number the
      // raymarch actually pays for, per pass.
      drawingBuffer: viewerState.canvas
        ? {
            width: Math.round(viewerState.canvas.size.width * viewerState.canvas.dpr),
            height: Math.round(viewerState.canvas.size.height * viewerState.canvas.dpr),
            dpr: viewerState.canvas.dpr,
            pixels: Math.round(
              viewerState.canvas.size.width *
                viewerState.canvas.dpr *
                viewerState.canvas.size.height *
                viewerState.canvas.dpr,
            ),
          }
        : null,
      // Full-screen volume raymarch passes per frame. With merging OFF this is
      // one per 3D-planned layer. With it ON, co-pool layers collapse into one
      // pass each, so the real count is the number of merge GROUPS — at least
      // `brickSystem.poolCount` and at most `layers` (a group splits when
      // members disagree on transform or overflow the uniform budget).
      volumePasses: {
        layers: Object.values(viewerState.nodePlans).filter((p) => p.mode === "3D").length,
        merging: isVolumeMergeEnabled(),
        shaderFastPath: isShaderFastPathEnabled(),
      },
      fidelity: qualityGovernor.getFidelity(),
      cameraPose: viewState.cameraPose,
      layerViewRanges: viewerState.layerViewRanges,
      plans: Object.fromEntries(
        Object.entries(viewerState.nodePlans).map(([layerId, plan]) => {
          const byLevelRole: Record<string, number> = {};
          for (const node of plan.nodes) {
            const bucket = `L${node.level}:${node.role}`;
            byLevelRole[bucket] = (byLevelRole[bucket] ?? 0) + 1;
          }
          return [
            layerId,
            {
              mode: plan.mode,
              targetLevel: plan.targetLevel,
              slabZ: plan.slabZ,
              planBytes: plan.planBytes,
              nodeCount: plan.nodes.length,
              byLevelRole,
            },
          ];
        }),
      ),
      brickSystem: viewerState.brickSystem?.buildDebugReport() ?? null,
      fabriks: Object.fromEntries(
        Object.entries(viewerState.meshSystems).map(([layerId, manager]) => [
          layerId,
          manager.buildDebugReport(),
        ]),
      ),
      // The opt-in CPU/GPU recording (Start/End report). Null when no session
      // has been captured. This is the "last few seconds" perf window.
      perfSession: perfMonitor.buildSessionReport(),
      quality: {
        tier: TIER_LABELS[qualityGovernor.getTier()],
        autoTier: TIER_LABELS[qualityGovernor.getAutoTier()],
        override:
          qualityGovernor.getOverride() !== null
            ? TIER_LABELS[qualityGovernor.getOverride()!]
            : null,
        emaFrameMs: Number(qualityGovernor.getEmaMs().toFixed(2)),
        streaming: qualityGovernor.isStreaming(),
      },
    };
    const json = JSON.stringify(report, null, 2);
    console.log("[octree debug report]", report);
    navigator.clipboard
      .writeText(json)
      .then(() => {
        setReportCopied(true);
        setTimeout(() => setReportCopied(false), 1500);
      })
      .catch(() => {
        /* console.log above is the fallback */
      });
  };

  return (
    <div className="absolute top-16 left-2 z-50 w-64 max-h-[70vh] overflow-y-auto bg-background/80 backdrop-blur-md border border-border/50 text-xs p-2 rounded shadow-lg pointer-events-auto">
      <h3 className="font-bold border-b border-border/50 pb-1 mb-2">Debug: Octree Renderer</h3>
      {renderBudget && (
        <div className="mb-2 rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] text-amber-200">
          Render budget exceeded: {(renderBudget.usedBytes / (1024 * 1024)).toFixed(0)} /{" "}
          {(renderBudget.budgetBytes / (1024 * 1024)).toFixed(0)} MB — culled{" "}
          {renderBudget.culledLayerIds.length} layer(s): {renderBudget.culledLayerIds.join(", ")}
        </div>
      )}
      {Object.entries(unplannableLayers).map(([layerId, info]) => (
        <div
          key={layerId}
          className="mb-2 rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] text-amber-200"
        >
          {layerId}: not planned in {info.mode} — coarsest-level pool floor{" "}
          {(info.floorBytes / (1024 * 1024)).toFixed(0)} MB exceeds{" "}
          {(info.capBytes / (1024 * 1024)).toFixed(0)} MB budget (no usable pyramid)
        </div>
      ))}
      <Collapsible open={isControlsOpen} onOpenChange={setIsControlsOpen}>
        <div className="mb-3 rounded border border-border/50 bg-background/40">
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center gap-2 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <span>Render Controls</span>
              <ChevronDown className={`ml-auto h-3 w-3 transition-transform ${isControlsOpen ? "rotate-180" : ""}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-3 border-t border-border/50 px-2 py-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                  <span>LOD Aggressiveness</span>
                  <span className="font-mono bg-accent px-1 rounded">{lodBias.toFixed(1)}x</span>
                </div>
                <Slider
                  min={0.1}
                  max={5.0}
                  step={0.1}
                  value={[lodBias]}
                  onValueChange={([value]) => setLodBias(value)}
                  className="py-1"
                />
              </div>
              {/* GPU-adaptive quality tier (P19): learned from frame times,
                  persisted per GPU; the select forces a tier for testing. */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                  <span>Quality</span>
                  <span className="font-mono bg-accent px-1 rounded">
                    {TIER_LABELS[qualityGovernor.getTier()]}
                    {qualityGovernor.getOverride() !== null ? " (forced)" : ""} ·{" "}
                    {qualityGovernor.getEmaMs().toFixed(1)} ms
                  </span>
                </div>
                <div className="flex gap-1">
                  {([null, 0, 1, 2] as const).map((tier) => (
                    <button
                      key={tier === null ? "auto" : tier}
                      className={`flex-1 rounded border px-1 py-0.5 text-[10px] transition-colors ${
                        qualityGovernor.getOverride() === tier
                          ? "border-white/40 bg-white/15 text-white"
                          : "border-border/50 text-muted-foreground hover:bg-white/10"
                      }`}
                      onClick={() => qualityGovernor.setOverride(tier as QualityTier | null)}
                    >
                      {tier === null ? "Auto" : TIER_LABELS[tier as QualityTier]}
                    </button>
                  ))}
                </div>
                {/* Fidelity: how much SETTLED quality the default experience
                    trades for performance. Standard caps settled DPR at 1.5,
                    settled step scale at ≥1.25 and ray steps at 384; High is
                    the full-quality table. Applies at the next settle. */}
                <div className="flex gap-1">
                  {(["standard", "high"] as const).map((mode) => (
                    <button
                      key={mode}
                      title={
                        mode === "standard"
                          ? "Cheaper settled image: DPR ≤ 1.5, coarser ray steps. Applies on the next camera settle."
                          : "Full settled quality (today's pre-fidelity behavior)."
                      }
                      className={`flex-1 rounded border px-1 py-0.5 text-[10px] transition-colors ${
                        qualityGovernor.getFidelity() === mode
                          ? "border-white/40 bg-white/15 text-white"
                          : "border-border/50 text-muted-foreground hover:bg-white/10"
                      }`}
                      onClick={() => qualityGovernor.setFidelity(mode)}
                    >
                      {mode === "standard" ? "Standard fidelity" : "High fidelity"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="flex w-full items-center justify-center gap-1 rounded border border-border/50 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-white/10 transition-colors"
                onClick={copyDebugReport}
              >
                <ClipboardCopy className="h-3 w-3" />
                {reportCopied ? "Copied!" : "Copy debug report"}
              </button>

              {/* Opt-in CPU/GPU perf recording. Nothing is sampled until Start is
                  pressed; the render hot path pays only a boolean check otherwise. */}
              <button
                className={`flex w-full items-center justify-center gap-1 rounded border px-2 py-1 text-[10px] font-medium transition-colors ${
                  recording
                    ? "border-red-500/60 bg-red-500/15 text-red-200 hover:bg-red-500/25"
                    : "border-border/50 text-muted-foreground hover:bg-white/10"
                }`}
                onClick={togglePerfRecording}
              >
                {recording ? (
                  <>
                    <Square className="h-3 w-3 fill-current" /> End report (recording…)
                  </>
                ) : (
                  <>
                    <Circle className="h-3 w-3 fill-current" /> Start perf report
                  </>
                )}
              </button>

              {lastSession && <PerfSessionSummary report={lastSession} />}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
      {Object.keys(nodePlans).length > 0 && (
        <div className="mb-3">
          <h4 className="font-bold border-b border-border/50 pb-1 mb-2">Octree Node Plans</h4>
          {brickSystem && (
            <div className="mb-2 flex flex-wrap gap-1 text-[9px] text-muted-foreground">
              <span className="px-1 rounded border border-border/50">
                fetched {brickSystem.stats.bricksFetched}
              </span>
              <span className="px-1 rounded border border-border/50">
                uploaded {brickSystem.stats.bricksUploaded}
              </span>
              <span className="px-1 rounded border border-border/50">
                decoded {(brickSystem.stats.bytesDecoded / (1024 * 1024)).toFixed(0)} MB
              </span>
              <span className="px-1 rounded border border-border/50">
                repack {brickSystem.stats.repackMs.toFixed(0)} ms
              </span>
              {/* Bricks, mean batch size, and the WORST submit→readback round
                  trip. Deliberately not the latency SUM ÷ bricks — flushes
                  overlap, so that ratio reads as tens of ms per brick while the
                  real main-thread cost is the "upload" chip below. */}
              {brickSystem.stats.gpuBricks > 0 && (
                <span className="px-1 rounded border border-border/50">
                  gpu {brickSystem.stats.gpuBricks} /{" "}
                  {brickSystem.stats.gpuRepackFlushes > 0
                    ? (
                        brickSystem.stats.gpuBricks / brickSystem.stats.gpuRepackFlushes
                      ).toFixed(1)
                    : "0"}
                  /batch / {brickSystem.stats.gpuRepackLatencyMaxMs.toFixed(0)} ms peak
                </span>
              )}
              {/* Per-brick texSubImage3D cost — the P19 signal (≪1 ms on a
                  dGPU; ~17 ms on ANGLE-Metal integrated GPUs). */}
              <span className="px-1 rounded border border-border/50">
                upload{" "}
                {brickSystem.stats.bricksUploaded > 0
                  ? (brickSystem.stats.uploadMs / brickSystem.stats.bricksUploaded).toFixed(1)
                  : "–"}{" "}
                ms/brick
              </span>
              <span className="px-1 rounded border border-border/50">
                evict {brickSystem.stats.evictions}
              </span>
              {/* Zero-referrer queued decodes cancelled before wasting a
                  worker slot — climbs during fast navigation. */}
              {brickSystem.stats.cancelledDecodes > 0 && (
                <span className="px-1 rounded border border-border/50">
                  cancelled {brickSystem.stats.cancelledDecodes}
                </span>
              )}
              {/* Wall-clock plan→drained (fetchMs/repackMs are concurrent SUMS
                  and overstate wall time — judge streaming perf by this). */}
              {brickSystem.stats.timeToSharpMs > 0 && (
                <span className="px-1 rounded border border-border/50">
                  sharp {(brickSystem.stats.timeToSharpMs / 1000).toFixed(2)} s
                </span>
              )}
              {brickSystem.stats.fetchErrors > 0 && (
                <span className="px-1 rounded border border-red-500/50 text-red-300">
                  errors {brickSystem.stats.fetchErrors}
                </span>
              )}
            </div>
          )}
          {brickSystem && (
            <div className="mb-2 flex flex-wrap items-center gap-1 text-[9px]">
              <button
                onClick={toggleGpuRepack}
                title="Compute-shader repack for r32f atlases (WebGPU backend). Takes effect on the next scene mount."
                className="px-1 rounded border border-border/50 hover:bg-accent"
              >
                gpu repack: {gpuRepackOn ? "on" : "off"}
              </button>
              <button
                onClick={toggleVolumeMerge}
                title="Raymarch layers that share a brick pool in ONE pass instead of one each. Off = one pass per layer (the pre-merge path). Takes effect on the next scene mount."
                className="px-1 rounded border border-border/50 hover:bg-accent"
              >
                volume merge: {volumeMergeOn ? "on" : "off"}
              </button>
              <button
                onClick={toggleShaderFastPath}
                title="Restructured raymarch: skip empty bricks BEFORE sampling, textureSampleLevel atlas taps, ATTENUATED_MIP early termination. Off = legacy emission order. Takes effect on the next scene mount."
                className="px-1 rounded border border-border/50 hover:bg-accent"
              >
                shader fast path: {shaderFastPathOn ? "on" : "off"}
              </button>
              <button
                onClick={toggleSmoothZoom}
                title="Tricubic reconstruction of magnified fluorescence (8-tap B-spline past ~3 px/voxel): smooth blobs instead of hard voxel blocks. Takes effect on the next scene mount."
                className="px-1 rounded border border-border/50 hover:bg-accent"
              >
                smooth zoom: {smoothZoomOn ? "on" : "off"}
              </button>
              <button
                onClick={toggleAdaptiveDpr}
                title="Interaction DPR ladder: drop the drawing-buffer resolution by the frame-time EMA while the camera moves or bricks stream (all tiers), restore crisp on settle. Takes effect on the next gesture."
                className="px-1 rounded border border-border/50 hover:bg-accent"
              >
                adaptive dpr: {adaptiveDprOn ? "on" : "off"}
              </button>
              {typeof canvasDpr === "number" && (
                <span className="px-1 rounded border border-border/50 text-muted-foreground">
                  dpr {canvasDpr.toFixed(2)}
                </span>
              )}
              <button
                onClick={runGpuSelfTest}
                title="Repack one synthetic brick on GPU and CPU; compare voxel-for-voxel."
                className="px-1 rounded border border-border/50 hover:bg-accent"
              >
                parity self-test
              </button>
              {gpuSelfTest && (
                <span className="basis-full text-muted-foreground">{gpuSelfTest}</span>
              )}
            </div>
          )}
          {Object.entries(nodePlans).map(([layerId, plan]) => {
            const countsByLevel = plan.nodes.reduce<Record<number, number>>((acc, node) => {
              acc[node.level] = (acc[node.level] ?? 0) + 1;
              return acc;
            }, {});
            const pool = brickSystem?.getLayerPool(layerId) ?? null;
            return (
              <div key={layerId} className="mb-2">
                <div className="font-semibold text-[10px] text-muted-foreground uppercase opacity-80 mb-0.5">
                  {layerId}
                </div>
                <div className="flex flex-wrap items-center gap-1 text-[9px]">
                  <span className="bg-accent px-1 rounded">{plan.mode}</span>
                  <span className="bg-accent px-1 rounded">target L{plan.targetLevel}</span>
                  {plan.slabZ !== null && (
                    <span className="bg-accent px-1 rounded">slab z {plan.slabZ}</span>
                  )}
                  <span className="bg-accent px-1 rounded">
                    {(plan.planBytes / (1024 * 1024)).toFixed(1)} MB
                  </span>
                  {Object.entries(countsByLevel).map(([level, count]) => (
                    <span key={level} className="px-1 rounded border border-border/50">
                      L{level}×{count}
                    </span>
                  ))}
                  {pool && (
                    <>
                      <span className="px-1 rounded border border-border/50">
                        slots {pool.pool.size}/{pool.pool.capacity}
                      </span>
                      <span className="px-1 rounded border border-border/50">
                        empty {pool.emptyValues.size}
                      </span>
                      {(pool.queue.length > 0 || pool.inFlight.size > 0) && (
                        <span className="px-1 rounded border border-amber-500/50 text-amber-300">
                          ↓{pool.inFlight.size} ⇡{pool.queue.length}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {Object.keys(meshSystems).length > 0 && <FabriksMeshSection systems={meshSystems} />}
    </div>
  );
};

/**
 * The fabriks mesh renderer's section — the octree section's idiom (chips at
 * streaming cadence, A/B toggles) over `FabriksCollectionManager.stats`.
 *
 * The controls steer EVERY registered collection: the sliders are scene-wide
 * levers like `lodBias`, not per-layer settings. A manager that mounts after a
 * toggle was flipped starts from its defaults — acceptable for a debug tool.
 */
const FabriksMeshSection = ({
  systems,
}: {
  systems: Record<string, FabriksCollectionManager>;
}) => {
  const managers = Object.values(systems);
  const [pixelBudget, setPixelBudget] = useState(
    () => managers[0]?.getPlanConfig().pixelBudget ?? 1,
  );
  const [frozen, setFrozen] = useState(() => managers[0]?.getPlanConfig().frozen ?? false);
  const [showBoxes, setShowBoxes] = useState(() => managers[0]?.getShowCellBoxes() ?? false);

  const applyPixelBudget = (value: number) => {
    setPixelBudget(value);
    for (const manager of managers) manager.setPlanConfig({ pixelBudget: value });
  };
  const toggleFrozen = () => {
    const next = !frozen;
    setFrozen(next);
    for (const manager of managers) manager.setPlanConfig({ frozen: next });
  };
  const toggleBoxes = () => {
    const next = !showBoxes;
    setShowBoxes(next);
    for (const manager of managers) manager.setShowCellBoxes(next);
  };

  const mb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1);

  return (
    <div className="mb-3">
      <h4 className="font-bold border-b border-border/50 pb-1 mb-2">Fabriks Mesh</h4>
      <div className="space-y-1 mb-2">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
          {/* The mesh LOD lever: max screen-space error per cell. 1 px is the
              conservative default; raising it coarsens every region and cuts
              triangle counts roughly with the CUBE of the budget. */}
          <span>Pixel Error Budget</span>
          <span className="font-mono bg-accent px-1 rounded">{pixelBudget.toFixed(2)} px</span>
        </div>
        <Slider
          min={0.5}
          max={8}
          step={0.25}
          value={[pixelBudget]}
          onValueChange={([value]) => applyPixelBudget(value)}
          className="py-1"
        />
      </div>
      <div className="mb-2 flex flex-wrap items-center gap-1 text-[9px]">
        <button
          onClick={toggleFrozen}
          title="Ignore camera settles: the current plan keeps rendering, so it can be inspected from other angles without being replanned away."
          className="px-1 rounded border border-border/50 hover:bg-accent"
        >
          freeze plan: {frozen ? "on" : "off"}
        </button>
        <button
          onClick={toggleBoxes}
          title="Draw every planned cell's catalog bounding box, colored by octree level — one merged LineSegments, not a helper per cell."
          className="px-1 rounded border border-border/50 hover:bg-accent"
        >
          cell boxes: {showBoxes ? "on" : "off"}
        </button>
      </div>
      {Object.entries(systems).map(([layerId, manager]) => {
        const report = manager.buildDebugReport();
        const { stats, lastPlan, transport } = report;
        return (
          <div key={layerId} className="mb-2">
            <div className="font-semibold text-[10px] text-muted-foreground uppercase opacity-80 mb-0.5">
              {layerId}
            </div>
            {lastPlan ? (
              <div className="flex flex-wrap items-center gap-1 text-[9px]">
                <span className="bg-accent px-1 rounded">
                  {report.mountedCells}/{lastPlan.cellCount} cells
                </span>
                {Object.entries(lastPlan.byLevel).map(([level, count]) => (
                  <span key={level} className="px-1 rounded border border-border/50">
                    L{level}×{count}
                  </span>
                ))}
                <span className="px-1 rounded border border-border/50">
                  {(lastPlan.totalIndices / 3 / 1e6).toFixed(2)} Mtri
                </span>
                {lastPlan.coarsenedRegions > 0 && (
                  <span className="px-1 rounded border border-amber-500/50 text-amber-300">
                    coarsened {lastPlan.coarsenedRegions}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-[9px] text-muted-foreground">no plan yet</div>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-1 text-[9px] text-muted-foreground">
              <span className="px-1 rounded border border-border/50">plans {stats.plans}</span>
              <span className="px-1 rounded border border-border/50">
                cache {report.cache.cells} / {mb(report.cache.bytes)} MB
              </span>
              {transport && (
                <span className="px-1 rounded border border-border/50">
                  GET {transport.gets} · {mb(transport.bytesFetched)} MB
                  {transport.gets > 0
                    ? ` · ${(transport.fetchMs / transport.gets).toFixed(0)} ms`
                    : ""}
                </span>
              )}
              {transport && transport.cacheHits > 0 && (
                <span className="px-1 rounded border border-border/50">
                  hits {transport.cacheHits}
                </span>
              )}
              {/* streamMs brackets fetch+parse+decode; buildMs is geometry
                  assembly, normalsMs the computeVertexNormals share of it —
                  the main-thread jank suspects, kept separately visible. */}
              <span className="px-1 rounded border border-border/50">
                stream {stats.streamMs.toFixed(0)} ms
              </span>
              <span className="px-1 rounded border border-border/50">
                build {stats.buildMs.toFixed(0)} ms (normals {stats.normalsMs.toFixed(0)})
              </span>
              {stats.completeMs > 0 && (
                <span className="px-1 rounded border border-border/50">
                  sharp {(stats.completeMs / 1000).toFixed(2)} s
                </span>
              )}
              {stats.abortedDrains > 0 && (
                <span className="px-1 rounded border border-border/50">
                  aborted {stats.abortedDrains}
                </span>
              )}
              {(stats.fetchErrors > 0 || (transport?.errors ?? 0) > 0) && (
                <span className="px-1 rounded border border-red-500/50 text-red-300">
                  errors {stats.fetchErrors + (transport?.errors ?? 0)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Compact readout of the most recent perf recording (CPU vs GPU + hot renders). */
const PerfSessionSummary = ({ report }: { report: PerfSessionReport }) => {
  const topRenders = Object.entries(report.renderCounts).slice(0, 4);
  return (
    <div className="space-y-1 rounded border border-border/50 bg-background/40 px-2 py-1.5 text-[9px] text-muted-foreground">
      <div className="flex flex-wrap gap-1">
        <span className="rounded bg-accent px-1">
          {(report.durationMs / 1000).toFixed(1)}s · {report.frameCount}f ·{" "}
          {report.fps.toFixed(0)} fps
        </span>
        {report.truncated && (
          <span className="rounded border border-amber-500/50 px-1 text-amber-300">
            capped
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        <span className="rounded border border-border/50 px-1">
          CPU {report.cpuMs.avg.toFixed(1)}/{report.cpuMs.max.toFixed(0)}ms (avg/max)
        </span>
        {/* The rAF period, kept visibly distinct from CPU: period ≈ 1000/fps by
            definition, so CPU sitting right on top of it means the frame is
            being measured, not explained. */}
        <span className="rounded border border-border/50 px-1">
          period {report.periodMs.avg.toFixed(1)}ms
        </span>
        <span className="rounded border border-border/50 px-1">
          GPU{" "}
          {report.gpuMs
            ? `${report.gpuMs.avg.toFixed(1)}/${report.gpuMs.max.toFixed(0)}ms`
            : "n/a"}
        </span>
        {/* Baseline 5: main scene + gizmo hud, each followed by the renderer's
            tone-map/colour output pass (itself a counted render), plus one more
            for the Hud's clearDepth. Above that, something is rasterizing an
            extra time and the fps below is not the real one. */}
        <span
          className={`rounded border px-1 ${
            report.renderCalls.max > 5
              ? "border-amber-500/50 text-amber-300"
              : "border-border/50"
          }`}
        >
          {report.renderCalls.avg.toFixed(1)} render/f
        </span>
        {report.jankFrames > 0 && (
          <span className="rounded border border-red-500/50 px-1 text-red-300">
            {report.jankFrames} jank
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        <span className="rounded border border-border/50 px-1">
          replans {report.replans}
        </span>
        <span className="rounded border border-border/50 px-1">
          vis {report.visibilityRecomputes}
        </span>
      </div>
      {topRenders.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {topRenders.map(([name, count]) => (
            <span key={name} className="rounded border border-border/50 px-1">
              {name} ×{count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
