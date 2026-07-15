import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  BoxSelect,
  Camera,
  Hand,
  Move,
  ScanEye,
  Settings2,
  Sparkles,
  SquarePen,
  Target,
  type LucideIcon,
} from "lucide-react";
import { MikroCoordinateSystem } from "@/linkers";
import { InteractionMode, useModeStore } from "../store/modeStore";
import { useSceneStore } from "../store/sceneStore";
import { useViewerStore } from "../store/viewerStore";

/** Icon per interaction mode for the compact, right-side mode control. */
const INTERACTION_ICONS: Record<InteractionMode, LucideIcon> = {
  PAN: Hand,
  EDIT: SquarePen,
  SELECT: BoxSelect,
  MOVE: Move,
  META: Sparkles,
  PROBE: Target,
  AUTO_PROBE: ScanEye,
};

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

export const SceneOverlay = () => {
  const displayMode = useModeStore((s) => s.displayMode);
  const cameraControllerMode = useModeStore((s) => s.cameraControllerMode);
  const cameraControllerModeOptions = useModeStore(
    (s) => s.cameraControllerModeOptions,
  );
  const interactionModeOptions = useModeStore((s) => s.interactionModeOptions);
  const interactionMode = useModeStore((s) => s.interactionMode);
  const setInteractionMode = useModeStore((s) => s.setInteractionMode);
  const setDisplayMode = useModeStore((s) => s.setDisplayMode);
  const setCameraControllerMode = useModeStore((s) => s.setCameraControllerMode);
  const isDebug = useViewerStore((state) => state.debug);
  const world = useSceneStore(
    (state) => state.transformContext.worldCoordinateSystem,
  );
  const showScaleBar = useViewerStore((state) => state.showScaleBar);
  const showScaleGrid = useViewerStore((state) => state.showScaleGrid);

  const setDebug = useViewerStore((state) => state.setDebug);
  const setShowScaleBar = useViewerStore((state) => state.setShowScaleBar);
  const setShowScaleGrid = useViewerStore((state) => state.setShowScaleGrid);

  const captureScreenshot = useViewerStore((state) => state.captureScreenshot);

  const nextDisplayMode = displayMode === "2D" ? "3D" : "2D";

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

  // One control card, styled like the layer cards below it. Holds the display
  // (2D/3D) toggle, the view-settings/debug popover, the camera-controller modes
  // (3D only) and the interaction-mode switches, so every scene control lives in
  // a single top-right card that stacks above the layer list.
  return (
    <div className="pointer-events-auto flex flex-col gap-2 rounded-lg border border-black/10 bg-black/40 p-2 backdrop-blur-md">
      {/* Display toggle + view settings/debug. */}
      <div className="flex items-center gap-2">
        <Button
          variant={"outline"}
          size={"xs"}
          className="h-7 w-11 bg-black tabular-nums"
          onClick={() => setDisplayMode(nextDisplayMode)}
          title={`Switch to ${nextDisplayMode} view`}
        >
          <span className="text-xs font-bold">{displayMode}</span>
        </Button>

        <Button
          variant={"outline"}
          size={"xs"}
          className="ml-auto h-7 bg-black"
          onClick={onScreenshot}
          disabled={!captureScreenshot}
          title="Save a PNG screenshot of the current view"
        >
          <Camera className="h-3.5 w-3.5" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={isDebug ? "destructive" : "outline"}
              size={"xs"}
              className={isDebug ? "h-7" : "h-7 bg-black"}
              title="View settings"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48">
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
            <SettingRow label="Debug" checked={isDebug} onChange={setDebug} />
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
      </div>

      {/* Camera controller modes — 3D only. */}
      {displayMode === "3D" && (
        <ButtonGroup className="w-full">
          {cameraControllerModeOptions.map((mode) => (
            <Button
              variant={"outline"}
              size={"xs"}
              className="h-7 flex-1 bg-black"
              key={mode.value}
              onClick={() => setCameraControllerMode(mode.value)}
              disabled={cameraControllerMode === mode.value}
              title={mode.description}
            >
              <span className="text-xs font-bold">{mode.label}</span>
            </Button>
          ))}
        </ButtonGroup>
      )}

      {/* Interaction modes — iconified switches. */}
      <ButtonGroup className="w-full">
        {interactionModeOptions.map((mode) => {
          const Icon = INTERACTION_ICONS[mode.value];
          const active = interactionMode === mode.value;
          return (
            <Button
              key={mode.value}
              variant={active ? "default" : "outline"}
              size={"xs"}
              className={active ? "h-7 flex-1 p-0" : "h-7 flex-1 bg-black p-0"}
              onClick={() => setInteractionMode(mode.value)}
              title={mode.label}
            >
              <Icon className="h-3.5 w-3.5" />
            </Button>
          );
        })}
      </ButtonGroup>
    </div>
  );
};
