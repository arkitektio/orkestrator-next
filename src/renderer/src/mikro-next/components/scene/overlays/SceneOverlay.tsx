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
  Hand,
  Move,
  ScanEye,
  Settings2,
  Sparkles,
  SquarePen,
  Target,
  type LucideIcon,
} from "lucide-react";
import { InteractionMode, useModeStore } from "../store/modeStore";
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
  const showScaleBar = useViewerStore((state) => state.showScaleBar);
  const showScaleGrid = useViewerStore((state) => state.showScaleGrid);
  const useOctreeRenderer = useViewerStore((state) => state.useOctreeRenderer);

  const setDebug = useViewerStore((state) => state.setDebug);
  const setShowScaleBar = useViewerStore((state) => state.setShowScaleBar);
  const setShowScaleGrid = useViewerStore((state) => state.setShowScaleGrid);
  const setUseOctreeRenderer = useViewerStore((state) => state.setUseOctreeRenderer);

  const nextDisplayMode = displayMode === "2D" ? "3D" : "2D";

  return (
    <>
      {/* Display + view settings — top left. */}
      <div className="absolute left-4 top-4 z-10 flex flex-row gap-2">
        <Button
          variant={"outline"}
          size={"xs"}
          className="bg-black w-11 tabular-nums"
          onClick={() => setDisplayMode(nextDisplayMode)}
          title={`Switch to ${nextDisplayMode} view`}
        >
          <span className="text-xs font-bold">{displayMode}</span>
        </Button>

        {displayMode === "3D" && (
          <ButtonGroup>
            {cameraControllerModeOptions.map((mode) => (
              <Button
                variant={"outline"}
                size={"xs"}
                className="bg-black"
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

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={isDebug ? "destructive" : "outline"}
              size={"xs"}
              className={isDebug ? "" : "bg-black"}
              title="View settings"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-48">
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
            <SettingRow
              label="Octree renderer"
              checked={useOctreeRenderer}
              onChange={setUseOctreeRenderer}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Interaction modes — compact, iconified control on the right. */}
      <ButtonGroup className="absolute right-3 top-3 z-10">
        {interactionModeOptions.map((mode) => {
          const Icon = INTERACTION_ICONS[mode.value];
          const active = interactionMode === mode.value;
          return (
            <Button
              key={mode.value}
              variant={active ? "default" : "outline"}
              size={"xs"}
              className={active ? "h-7 w-7 p-0" : "h-7 w-7 p-0 bg-black"}
              onClick={() => setInteractionMode(mode.value)}
              title={mode.label}
            >
              <Icon className="h-3.5 w-3.5" />
            </Button>
          );
        })}
      </ButtonGroup>
    </>
  );
};
