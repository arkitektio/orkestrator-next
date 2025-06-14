import { Button } from "@/components/ui/button";
import {
  build,
  buildAction,
  buildModule,
  buildState,
} from "@/hooks/use-metaapp";
import { AsyncStageRender } from "@/mikro-next/components/render/StageRender";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpIcon } from "lucide-react";
import * as THREE from "three";


export const StageControllerModule = buildModule({
  name: "StageController",
  description: "Controls the stage positioner and grid acquisition.",
  states: {
    positioner: buildState({
      keys: {
        stage: build.structure("@mikro/stage"),
        position_x: build.float(),
        position_y: build.float(),
        position_z: build.float(),
      },
    }),
  },
  actions: {
    moveY: buildAction({
      args: {
        y: build.int(),
      },
      name: "Move Y",
    }),
    moveX: buildAction({
      args: {
        x: build.int(),
      },
      name: "Move X",
    }),
    acquire_grid: buildAction({
      args: {
        minPosX: build.int(),
        maxPosX: build.int(),
        minPosY: build.int(),
        maxPosY: build.int(),
      },
      name: "Tile Scan",
    }),
  },
});

export const StageController = () => {
  const { value: position } = StageControllerModule.useState("positioner");

  const { assign } = StageControllerModule.useAction("moveY");

  const {
    assign: acquireGrid,
    latestEvent,
    cancel,
  } = StageControllerModule.useAction("acquire_grid");

  const { assign: resetStage } = StageControllerModule.useAction("reset_stage");

  const { assign: assignX } = StageControllerModule.useAction("moveX");

  if (!position) {
    return <div>Loading</div>;
  }

  const onRectangleDrawn = (start: THREE.Vector3, end: THREE.Vector3) => {
    // Handle rectangle drawn event
    acquireGrid({
      minPosX: start.x,
      maxPosX: end.x,
      minPosY: start.y,
      maxPosY: end.y,
    });
  };



  return (
    <div className="relative w-full h-full">
      <AsyncStageRender stageId={position.stage} onRectangleDrawn={onRectangleDrawn}/>

      {latestEvent?.message && <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-gray-900 p-2 rounded-full px-3">
        
        {latestEvent?.message}
      </div>}
      <div className="absolute top-4 right-3 bg-gray-900 p-2 rounded-md px-3 flex flex-row gap-2">
        <Button
          onClick={() => acquireGrid({ minPosX: 1, maxPosX: 1000, minPosY: 1, maxPosY: 1000 })}
          variant={"outline"}
        >
          Acquire Grid
        </Button>
        <Button onClick={() => resetStage({})} variant={"outline"}>
          Reset
        </Button>
      </div>
      <Button
        className="absolute top-2 left-1/2 transform -translate-x-1/2"
        onClick={() => assign({ y: position.position_y + 1 })}
        variant={"outline"}
      >
        <ArrowUpIcon></ArrowUpIcon>
      </Button>
      <Button
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
        onClick={() => assign({ y: position.position_y - 1 })}
        variant={"outline"}
      >
        <ArrowDown />
      </Button>
      <Button
        className="absolute top-1/2 left-2 transform -translate-y-1/2"
        onClick={() => assignX({ x: position.position_x - 1 })}
        variant={"outline"}
      >
        <ArrowLeft />
      </Button>
      <Button
        className="absolute top-1/2 right-2 transform -translate-y-1/2"
        onClick={() => assignX({ x: position.position_x + 1 })}
        variant={"outline"}
      >
        <ArrowRight />
      </Button>
    </div>
  );
};

export const PositionerPlaceholder = () => {
  return <div className="positioner">Placeholder</div>;
};
