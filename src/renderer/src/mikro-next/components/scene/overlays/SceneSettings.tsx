import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Camera, Settings2 } from "lucide-react";
import { MikroCoordinateSystem } from "@/linkers";
import { layerDisplayLabel } from "../panels/layer/layerIdentity";
import { resolveProbeStrategy } from "../core/probe/probeModes";
import type { ProbeMode } from "../core/probe/probeTypes";
import { effectiveProbeLayerId } from "../core/probe/probeTargeting";
import { useModeStore } from "../store/modeStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";

const SettingRow = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-4 py-1">
    <span className="text-xs text-muted-foreground">{label}</span>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

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

/**
 * How the probe BEHAVES — target layer, march strategy, threshold. Moved out
 * of the probe HUD so the readout can be just the reading; these are settings,
 * and this popover is where the scene's settings live.
 */
const ProbeSettingsSection = () => {
  const displayMode = useModeStore((s) => s.displayMode);
  const probeMode = useViewerStore((s) => s.probeMode);
  const setProbeMode = useViewerStore((s) => s.setProbeMode);
  const probeThreshold = useViewerStore((s) => s.probeThreshold);
  const setProbeThreshold = useViewerStore((s) => s.setProbeThreshold);
  const probeLayerId = useViewerStore((s) => s.probeLayerId);
  const setProbeLayerId = useViewerStore((s) => s.setProbeLayerId);
  const layers = useSceneStore((s) => s.layers);

  // Both brick layers bail on `visible === false`, so a hidden layer cannot
  // answer a probe (`core/modeCompat.ts`). An alive explicit pin drives the
  // picker's value; a dead pin (hidden/gone layer) shows as Auto WITHOUT being
  // erased — it heals by derivation and resurrects if its layer comes back.
  const probeableLayers = layers.filter((candidate) => candidate.visible !== false);
  const pinnedLayer =
    probeLayerId !== null
      ? layers.find(
          (candidate) => candidate.id === probeLayerId && candidate.visible !== false,
        )
      : undefined;

  // The strategy resolves against the layer that will ANSWER the next probe —
  // the effective target — since this section configures future probes, not a
  // reading that already happened.
  const targetId = effectiveProbeLayerId(probeLayerId, layers);
  const targetLayer = layers.find((candidate) => candidate.id === targetId);
  const resolved = resolveProbeStrategy(
    probeMode,
    targetLayer?.projection,
    probeThreshold,
  );
  // The slider matters only where the march actually consumes it: 3D, an
  // effective first-hit strategy, and not the iso override.
  const showThreshold =
    displayMode === "3D" &&
    resolved.strategy === "first-hit" &&
    resolved.threshold === probeThreshold;

  return (
    <div className="mt-1 border-t pt-1">
      <div className="py-1 text-xs font-medium">Probe</div>

      {/* Which layer the probe reads. Exactly one layer answers — Auto follows
          the first visible layer; picking one pins it explicitly (it sticks
          through reorders). */}
      <select
        value={pinnedLayer?.id ?? ""}
        onChange={(event) =>
          setProbeLayerId(event.target.value === "" ? null : event.target.value)
        }
        className="h-6 w-full min-w-0 rounded border bg-transparent px-1 text-xs"
        title="Which layer the probe reads"
      >
        <option value="">
          {probeableLayers[0]
            ? `Auto — first layer (${layerDisplayLabel(probeableLayers[0])})`
            : "Auto — no visible layer"}
        </option>
        {probeableLayers.map((candidate) => (
          <option key={candidate.id} value={candidate.id}>
            {layerDisplayLabel(candidate)}
          </option>
        ))}
      </select>

      {displayMode === "3D" && (
        <div className="mt-2">
          <div className="grid grid-cols-4 gap-0.5 rounded bg-muted p-0.5">
            {PROBE_MODES.map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => setProbeMode(mode)}
                className={`rounded px-1 py-0.5 text-[10px] transition-colors ${
                  probeMode === mode
                    ? "bg-background font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {probeMode === "auto" && (
            <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
              Following the projection: {STRATEGY_LABELS[resolved.strategy]}.
            </p>
          )}
        </div>
      )}

      {showThreshold && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
            <span>Threshold</span>
            <span className="rounded bg-muted px-1 font-mono">
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
    </div>
  );
};

/**
 * Everything you can change about how the scene is DRAWN, behind one gear.
 *
 * This used to be a card floating in the foldable left column, which put view
 * settings in a different corner from the mode controls that they read as part
 * of. It is now a bare button — no card, no positioning of its own — so it
 * composes into the bottom-right HUD row in `SceneModeControls`, next to the
 * display toggle. The screenshot moved inside the popover for the same reason:
 * one button in the HUD rather than two.
 */
export const SceneSettings = () => {
  const displayMode = useModeStore((s) => s.displayMode);
  const zoomToCursor = useModeStore((s) => s.zoomToCursor);
  const pivotOnProbe = useModeStore((s) => s.pivotOnProbe);
  const setZoomToCursor = useModeStore((s) => s.setZoomToCursor);
  const setPivotOnProbe = useModeStore((s) => s.setPivotOnProbe);
  const isDebug = useViewerStore((state) => state.debug);
  const world = useSceneStore(
    (state) => state.transformContext.worldCoordinateSystem,
  );
  const showScaleBar = useViewerStore((state) => state.showScaleBar);
  const showScaleGrid = useViewerStore((state) => state.showScaleGrid);
  const showSceneAxis = useViewerStore((state) => state.showSceneAxis);
  const showLodReadout = useViewerStore((state) => state.showLodReadout);

  const setDebug = useViewerStore((state) => state.setDebug);
  const setShowScaleBar = useViewerStore((state) => state.setShowScaleBar);
  const setShowScaleGrid = useViewerStore((state) => state.setShowScaleGrid);
  const setShowSceneAxis = useViewerStore((state) => state.setShowSceneAxis);
  const setShowLodReadout = useViewerStore((state) => state.setShowLodReadout);

  const captureScreenshot = useViewerStore((state) => state.captureScreenshot);

  // Capture the current 3D scene (layers + in-scene axis/grid, not HTML overlays
  // or the gizmo) and save it as a PNG via the standard <a download> pattern.
  const onScreenshot = async () => {
    if (!captureScreenshot) return;
    const blob = await captureScreenshot();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${world?.name ?? "scene"}-screenshot.png`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={isDebug ? "destructive" : "outline"}
          size={"xs"}
          className={isDebug ? "h-7 w-8 p-0" : "h-7 w-8 bg-black p-0"}
          title="View settings"
        >
          <Settings2 className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56">
        {/* An action, not a setting — but it belongs to the same question
            ("what does this view look like?"), and it is one click too rare to
            spend a permanent slot in the HUD on. */}
        <Button
          variant={"outline"}
          size={"xs"}
          className="mb-1 h-7 w-full justify-start gap-2"
          onClick={onScreenshot}
          disabled={!captureScreenshot}
          title="Save a PNG screenshot of the current view"
        >
          <Camera className="h-3.5 w-3.5" />
          <span className="text-xs">Save screenshot</span>
        </Button>

        <div className="border-t pt-1">
          <SettingRow
            label="Scale bar"
            checked={showScaleBar}
            onChange={setShowScaleBar}
          />
          <SettingRow
            label="Grid"
            checked={showScaleGrid}
            onChange={setShowScaleGrid}
          />
          <SettingRow
            label="Origin axis"
            checked={showSceneAxis}
            onChange={setShowSceneAxis}
          />
          <SettingRow
            label="LOD readout"
            checked={showLodReadout}
            onChange={setShowLodReadout}
          />
          <SettingRow label="Debug" checked={isDebug} onChange={setDebug} />
        </div>

        {/* Camera behaviour. These used to be exclusive camera modes; as
            switches they compose, so you can orbit around the probe *and*
            zoom to the cursor. Rotation is 2D-disabled, so both are 3D-only. */}
        {displayMode === "3D" && (
          <div className="mt-1 border-t pt-1">
            <SettingRow
              label="Zoom to cursor"
              checked={zoomToCursor}
              onChange={setZoomToCursor}
            />
            <SettingRow
              label="Orbit around probe"
              checked={pivotOnProbe}
              onChange={setPivotOnProbe}
            />
          </div>
        )}

        <ProbeSettingsSection />

        {world && (
          <div className="mt-1 flex items-center justify-between gap-2 border-t pt-2">
            <span className="text-xs text-muted-foreground">World</span>
            <MikroCoordinateSystem.DetailLink
              object={{ id: world.id }}
              title="The scene's world coordinate system — the space every layer is registered into"
              className="truncate font-mono text-xs"
            >
              {world.name ?? world.id}
            </MikroCoordinateSystem.DetailLink>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
