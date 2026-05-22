import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useModeStore } from "../store/modeStore";
import { useViewerStore } from "../store/viewerStore";

export const SceneOverlay = () => {
  const displayMode = useModeStore((s) => s.displayMode);
  const displayModeOptions = useModeStore((s) => s.displayModeOptions);
  const cameraControllerMode = useModeStore((s) => s.cameraControllerMode);
  const cameraControllerModeOptions = useModeStore((s) => s.cameraControllerModeOptions);
  const interactionModeOptions = useModeStore((s) => s.interactionModeOptions);
  const interactionMode = useModeStore((s) => s.interactionMode);
  const setInteractionMode = useModeStore((s) => s.setInteractionMode);
  const setDisplayMode = useModeStore((s) => s.setDisplayMode);
  const setCameraControllerMode = useModeStore((s) => s.setCameraControllerMode);
  const isDebug = useViewerStore((state) => state.debug);
  const showScaleBar = useViewerStore((state) => state.showScaleBar);
  const showScaleGrid = useViewerStore((state) => state.showScaleGrid);

  const setDebug =  useViewerStore((state) => state.setDebug);
  const setShowScaleBar = useViewerStore((state) => state.setShowScaleBar);
  const setShowScaleGrid = useViewerStore((state) => state.setShowScaleGrid);

  return (
    <>
      <div className="absolute top-4 right-4 z-10 flex flex-row gap-4">
        <ButtonGroup className="">
          {displayModeOptions.map((mode) => (
            <Button
              variant={"outline"}
              size={"xs"}
              className="bg-black"
              key={mode.value}
              onClick={() => setDisplayMode(mode.value)}
              disabled={mode.value === displayMode} // Disable 3D view when in PAN mode
            >
              <span className="text-xs font-bold">{mode.label}</span>
            </Button>
          ))}

        </ButtonGroup>

        <ButtonGroup>
          {interactionModeOptions.map((mode) => (
            <Button
              variant={"outline"}
              size={"xs"}
              key={mode.value}
              onClick={() => setInteractionMode(mode.value)}
              disabled={interactionMode == mode.value} // Disable PAN mode when in 3D view
            >
              <span className="text-xs font-bold">{mode.label}</span>
            </Button>
          ))}
        </ButtonGroup>

        {displayMode === "3D" && (
          <ButtonGroup>
            {cameraControllerModeOptions.map((mode) => (
              <Button
                variant={"outline"}
                size={"xs"}
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

        <ButtonGroup>
          <Button onClick={() => {
            setDebug(!isDebug);
        }} variant={isDebug ? "destructive" : "outline"} size={"xs"}>
            { isDebug ? "Disable Debug" : "Enable Debug" }
        </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            onClick={() => setShowScaleBar(!showScaleBar)}
            variant={showScaleBar ? "default" : "outline"}
            size={"xs"}
          >
            Scale Bar
          </Button>
          <Button
            onClick={() => setShowScaleGrid(!showScaleGrid)}
            variant={showScaleGrid ? "default" : "outline"}
            size={"xs"}
          >
            Grid
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
};
