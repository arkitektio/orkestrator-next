import { Button } from "@/components/ui/button";
import {
  build,
  buildAction,
  buildModule,
  buildState,
} from "@/hooks/use-metaapp";
import {
  AsyncStageRender
} from "@/mikro-next/components/render/StageRender";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpIcon } from "lucide-react";

export const StageControllerModule = buildModule({
  name: "StageController",
  description: "Controls the stage positioner and grid acquisition.",
  states: {
    positioner: buildState({
      stage: build.structure("@mikro/stage"),
      position_x: build.float(),
      position_y: build.float(),
      position_z: build.float(),
    }),
  },
  actions: {
    moveY: buildAction({
      y: build.int(),
    }),
    moveX: buildAction({
      x: build.int(),
    }),
    reset_stage: buildAction(
      {},
      {},
      {
        name: "Reset Stage",
      },
    ),
    acquire_grid: buildAction({
      grid_cols: build.integer("Number of columns in the grid"),
      grid_rows: build.integer("Number of rows in the grid"),
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

  return (
    <div className="relative w-full h-full">
      <AsyncStageRender stageId={position.stage} />

      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-gray-900 p-2 rounded-full px-3">
        {position.position_y}y {position.position_x}x {position.position_z}z{" "}
        {latestEvent?.message}
      </div>
      <div className="absolute top-4 right-3 bg-gray-900 p-2 rounded-md px-3 flex flex-row gap-2">
        <Button
          onClick={() => acquireGrid({ grid_cols: 3, grid_rows: 3 })}
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
