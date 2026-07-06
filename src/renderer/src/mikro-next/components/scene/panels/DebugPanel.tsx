import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useViewerStore } from "../store/viewerStore";
import { useSceneStore } from "../store/sceneStore";

export const DebugPanel = () => {
  const isDebug = useViewerStore((s) => s.debug);
  const renderedChunks = useViewerStore((s) => s.renderedChunks);
  const renderBudget = useViewerStore((s) => s.renderBudget);
  const lodBias = useViewerStore((s) => s.lodBias);
  const setLodBias = useViewerStore((s) => s.setLodBias);
  const layers = useSceneStore((s) => s.layers);
  const [isControlsOpen, setIsControlsOpen] = useState(true);

  if (!isDebug) return null;

  const chunksByLayerId = Object.values(renderedChunks).reduce((acc, chunk) => {
    if (!acc[chunk.layerId]) acc[chunk.layerId] = [];
    acc[chunk.layerId].push(chunk);
    return acc;
  }, {} as Record<string, typeof renderedChunks[string][]>);

  return (
    <div className="absolute top-2 left-2 z-50 w-64 max-h-[80vh] overflow-y-auto bg-background/80 backdrop-blur-md border border-border/50 text-xs p-2 rounded shadow-lg pointer-events-auto">
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
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
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
