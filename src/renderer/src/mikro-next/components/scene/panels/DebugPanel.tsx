import { useViewerStore } from "../store/viewerStore";
import { useSceneStore } from "../store/sceneStore";

export const DebugPanel = () => {
  const isDebug = useViewerStore((s) => s.debug);
  const renderedChunks = useViewerStore((s) => s.renderedChunks);
  const layers = useSceneStore((s) => s.layers);

  if (!isDebug) return null;

  const chunksByLayerId = Object.values(renderedChunks).reduce((acc, chunk) => {
    if (!acc[chunk.layerId]) acc[chunk.layerId] = [];
    acc[chunk.layerId].push(chunk);
    return acc;
  }, {} as Record<string, typeof renderedChunks[string][]>);

  return (
    <div className="absolute top-2 left-2 z-50 w-64 max-h-[80vh] overflow-y-auto bg-background/80 backdrop-blur-md border border-border/50 text-xs p-2 rounded shadow-lg pointer-events-auto">
      <h3 className="font-bold border-b border-border/50 pb-1 mb-2">Debug: Rendered Chunks</h3>
      {layers.map(layer => {
        const chunks = chunksByLayerId[layer.id] || [];
        if (chunks.length === 0) return null;
        
        // Sort by level ascending, then by key
        chunks.sort((a, b) => a.level !== b.level ? a.level - b.level : a.chunkKey.localeCompare(b.chunkKey));
        
        return (
          <div key={layer.id} className="mb-3">
            <div className="font-semibold text-[10px] text-muted-foreground uppercase opacity-80 mb-1">{layer.name || layer.id}</div>
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
