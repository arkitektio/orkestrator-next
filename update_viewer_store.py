import re

with open('src/renderer/src/mikro-next/components/scene/store/viewerStore.ts', 'r') as f:
    text = f.read()

# Add renderedChunks types
if "renderedChunks:" not in text:
    state_injection = """  renderedChunks: Record<string, { layerId: string; chunkKey: string; level: number; status: 'loading' | 'rendered' }>;
  setChunkStatus: (chunkId: string, info: { layerId: string; chunkKey: string; level: number; status: 'loading' | 'rendered' } | null) => void;
"""
    text = text.replace("  lodDebugInfo: Record<string,", state_injection + "  lodDebugInfo: Record<string,")

if "renderedChunks: {}," not in text:
    action_injection = """    renderedChunks: {},
    setChunkStatus: (chunkId, info) => set((state) => {
      const next = { ...state.renderedChunks };
      if (!info) {
        delete next[chunkId];
      } else {
        next[chunkId] = info;
      }
      return { renderedChunks: next };
    }),
"""
    text = text.replace("    lodDebugInfo: {},", action_injection + "    lodDebugInfo: {},")

with open('src/renderer/src/mikro-next/components/scene/store/viewerStore.ts', 'w') as f:
    f.write(text)

