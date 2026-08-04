import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Camera, Settings2 } from "lucide-react";
import { MikroCoordinateSystem } from "@/linkers";
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

  const setDebug = useViewerStore((state) => state.setDebug);
  const setShowScaleBar = useViewerStore((state) => state.setShowScaleBar);
  const setShowScaleGrid = useViewerStore((state) => state.setShowScaleGrid);
  const setShowSceneAxis = useViewerStore((state) => state.setShowSceneAxis);

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
