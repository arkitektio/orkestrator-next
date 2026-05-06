import re

with open('src/renderer/src/mikro-next/components/scene/layers/ChunkPlane.tsx', 'r') as f:
    text = f.read()

report_effect = """
  // Report rendering state to store automatically
  const setChunkStatus = useViewerStore((s) => s.setChunkStatus);
  useEffect(() => {
    // Only report when mounting
    setChunkStatus(chunk.chunkKey, {
      layerId: chunk.frame_id,
      chunkKey: chunk.chunkKey,
      level: chunk.level || 0,
      status: texture ? 'rendered' : 'loading'
    });

    return () => {
      // Unmount
      setChunkStatus(chunk.chunkKey, null);
    };
  }, [chunk.chunkKey, chunk.frame_id, chunk.level, texture, setChunkStatus]);
"""

if "setChunkStatus(" not in text:
    text = text.replace("  const tEnd = useViewerStore((s) => s.tEnd);", "  const tEnd = useViewerStore((s) => s.tEnd);\n" + report_effect)

with open('src/renderer/src/mikro-next/components/scene/layers/ChunkPlane.tsx', 'w') as f:
    f.write(text)

