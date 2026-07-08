import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ClipboardCopy } from "lucide-react";
import { useState } from "react";
import { getInitialVolumeTextureBudgetBytes } from "../core/lodPlanning";
import { useModeStore } from "../store/modeStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore, useViewerStoreApi } from "../store/viewerStore";
import { useViewStoreApi } from "../store/viewStore";

export const DebugPanel = () => {
  const isDebug = useViewerStore((s) => s.debug);
  const renderedChunks = useViewerStore((s) => s.renderedChunks);
  const renderBudget = useViewerStore((s) => s.renderBudget);
  const lodBias = useViewerStore((s) => s.lodBias);
  const setLodBias = useViewerStore((s) => s.setLodBias);
  const useOctreeRenderer = useViewerStore((s) => s.useOctreeRenderer);
  const setUseOctreeRenderer = useViewerStore((s) => s.setUseOctreeRenderer);
  const nodePlans = useViewerStore((s) => s.nodePlans);
  const brickSystem = useViewerStore((s) => s.brickSystem);
  useViewerStore((s) => s.residencyVersion); // refresh residency stats
  const layers = useSceneStore((s) => s.layers);
  const displayMode = useModeStore((s) => s.displayMode);
  const viewerStoreApi = useViewerStoreApi();
  const viewStoreApi = useViewStoreApi();
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [reportCopied, setReportCopied] = useState(false);

  if (!isDebug) return null;

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
      useOctreeRenderer: viewerState.useOctreeRenderer,
      viewportSize: viewState.viewportSize,
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

  const chunksByLayerId = Object.values(renderedChunks).reduce((acc, chunk) => {
    if (!acc[chunk.layerId]) acc[chunk.layerId] = [];
    acc[chunk.layerId].push(chunk);
    return acc;
  }, {} as Record<string, typeof renderedChunks[string][]>);

  return (
    <div className="absolute top-16 left-2 z-50 w-64 max-h-[70vh] overflow-y-auto bg-background/80 backdrop-blur-md border border-border/50 text-xs p-2 rounded shadow-lg pointer-events-auto">
      <h3 className="font-bold border-b border-border/50 pb-1 mb-2">Debug: Rendered Chunks</h3>
      {renderBudget && (
        <div className="mb-2 rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] text-amber-200">
          Render budget exceeded: {(renderBudget.usedBytes / (1024 * 1024)).toFixed(0)} /{" "}
          {(renderBudget.budgetBytes / (1024 * 1024)).toFixed(0)} MB — culled{" "}
          {renderBudget.culledLayerIds.length} layer(s): {renderBudget.culledLayerIds.join(", ")}
        </div>
      )}
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
              <label className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground font-medium">
                <span>Octree renderer</span>
                <input
                  type="checkbox"
                  checked={useOctreeRenderer}
                  onChange={(e) => setUseOctreeRenderer(e.target.checked)}
                />
              </label>
              <button
                className="flex w-full items-center justify-center gap-1 rounded border border-border/50 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-white/10 transition-colors"
                onClick={copyDebugReport}
              >
                <ClipboardCopy className="h-3 w-3" />
                {reportCopied ? "Copied!" : "Copy debug report"}
              </button>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
      {useOctreeRenderer && Object.keys(nodePlans).length > 0 && (
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
              <span className="px-1 rounded border border-border/50">
                evict {brickSystem.stats.evictions}
              </span>
              {brickSystem.stats.fetchErrors > 0 && (
                <span className="px-1 rounded border border-red-500/50 text-red-300">
                  errors {brickSystem.stats.fetchErrors}
                </span>
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
      {layers.map(layer => {
        const chunks = chunksByLayerId[layer.id] || [];
        if (chunks.length === 0) return null;

        // Sort by level ascending, then by key
        chunks.sort((a, b) => a.level !== b.level ? a.level - b.level : a.chunkKey.localeCompare(b.chunkKey));

        return (
          <div key={layer.id} className="mb-3">
            <div className="font-semibold text-[10px] text-muted-foreground uppercase opacity-80 mb-1">{layer.id}</div>
            <div className="flex flex-col gap-0.5">
              {chunks.map(c => (
                <div key={c.chunkKey} className="flex justify-between items-center rounded px-1 group hover:bg-white/10 transition-colors">
                  <span className="font-mono truncate mr-2" title={c.chunkKey}>{c.chunkKey}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="bg-accent px-1 rounded text-[9px]">LOD {c.level}</span>
                    <span className={`w-2 h-2 rounded-full ${c.status === 'rendered' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} title={c.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
