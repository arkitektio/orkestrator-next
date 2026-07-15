import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useModeStore } from "../store/modeStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";

export const SelectedPointPanel = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const probedCoordinate = useViewerStore((s) => s.probedCoordinate);
  const setProbedCoordinate = useViewerStore((s) => s.setProbedCoordinate);
  const savedProbes = useViewerStore((s) => s.savedProbes);
  const addSavedProbe = useViewerStore((s) => s.addSavedProbe);
  const removeSavedProbe = useViewerStore((s) => s.removeSavedProbe);
  const clearSavedProbes = useViewerStore((s) => s.clearSavedProbes);
  const probeThreshold = useViewerStore((s) => s.probeThreshold);
  const setProbeThreshold = useViewerStore((s) => s.setProbeThreshold);
  const layer = useSceneStore((s) =>
    probedCoordinate
      ? s.layers.find((candidate) => candidate.id === probedCoordinate.layerId)
      : null,
  );

  return (
    <div className="absolute bottom-2 left-2 z-30 w-72 rounded-md border border-border/50 bg-background/85 p-3 text-xs shadow-lg backdrop-blur-md pointer-events-auto">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Volume Probe
          </div>
          <div className="text-sm font-medium text-foreground">
            {probedCoordinate ? probedCoordinate.layerId : 'No point selected'}
          </div>
          <div className="text-[10px] text-muted-foreground">
            Mode: {interactionMode}
          </div>
        </div>
        <div className="flex gap-1">
          {probedCoordinate && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => addSavedProbe(probedCoordinate)}
            >
              Save
            </Button>
          )}
          {probedCoordinate && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => setProbedCoordinate(null)}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {!probedCoordinate && (
        <p className="text-[11px] leading-5 text-muted-foreground">
          Use Probe mode to click a volume, or Auto Probe mode to hover. Hold Shift while probing to save the point.
        </p>
      )}

      <div className="mt-3 space-y-1 rounded border border-border/50 bg-background/40 px-2 py-2">
        <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
          <span>Probe Threshold</span>
          <span className="font-mono bg-accent px-1 rounded text-foreground">
            {probeThreshold.toFixed(3)}
          </span>
        </div>
        <Slider
          min={0}
          max={1}
          step={0.005}
          value={[probeThreshold]}
          onValueChange={([value]) => setProbeThreshold(value)}
          className="py-1"
        />
        <p className="text-[10px] leading-4 text-muted-foreground">
          Higher values ignore faint surface hits and probe deeper into the volume.
        </p>
      </div>

      {probedCoordinate && (
        <div className="space-y-2 text-[11px]">
          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
            <span className="text-muted-foreground">Layer</span>
            <span className="truncate font-medium text-foreground">
              {probedCoordinate.layerId}
            </span>
            <span className="text-muted-foreground">Local</span>
            <span className="font-mono text-foreground">
              {probedCoordinate.localPos.map((value) => value.toFixed(4)).join(', ')}
            </span>
            <span className="text-muted-foreground">Voxel</span>
            <span className="font-mono text-foreground">
              [{probedCoordinate.voxelIndex.join(', ')}]
            </span>
          </div>

          {layer && (
            <div className="rounded border border-border/50 bg-background/40 px-2 py-1.5 font-mono text-[10px] text-muted-foreground">
              {layer.xAxis}: {probedCoordinate.voxelIndex[0]} | {layer.yAxis}: {probedCoordinate.voxelIndex[1]} | {layer.zAxis ?? 'z'}: {probedCoordinate.voxelIndex[2]}
            </div>
          )}
        </div>
      )}

      {savedProbes.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-border/50 pt-2">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Saved Probes
            </div>
            <Button variant="outline" size="xs" onClick={() => clearSavedProbes()}>
              Clear All
            </Button>
          </div>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {savedProbes.map((probe) => (
              <div
                key={`${probe.layerId}:${probe.voxelIndex.join(':')}`}
                className="rounded border border-border/50 bg-background/40 px-2 py-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-[11px] font-medium text-foreground">{probe.layerId}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      [{probe.voxelIndex.join(', ')}]
                    </div>
                  </div>
                  <Button variant="outline" size="xs" onClick={() => removeSavedProbe(probe)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
