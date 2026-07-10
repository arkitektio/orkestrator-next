import { Slider } from "@/components/ui/slider";
import { useModeStore } from "../store/modeStore";
import { useViewerStore } from "../store/viewerStore";

/**
 * Probe-threshold control, shown as a compact card directly under the scene
 * controls card — but only while a probe interaction mode is active, so it
 * appears exactly when it's relevant. Higher values ignore faint surface hits and
 * probe deeper into the volume.
 */
export const ProbeThresholdPanel = () => {
  const interactionMode = useModeStore((s) => s.interactionMode);
  const probeThreshold = useViewerStore((s) => s.probeThreshold);
  const setProbeThreshold = useViewerStore((s) => s.setProbeThreshold);

  if (interactionMode !== "PROBE" && interactionMode !== "AUTO_PROBE") return null;

  return (
    <div className="pointer-events-auto rounded-lg border border-black/10 bg-black/40 p-2 backdrop-blur-md">
      <div className="flex items-center justify-between text-[10px] font-medium text-white/60">
        <span>Probe Threshold</span>
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
      <p className="text-[10px] leading-4 text-white/50">
        Higher values ignore faint surface hits and probe deeper into the volume.
      </p>
    </div>
  );
};
