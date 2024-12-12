import { Button } from "@/components/ui/button";
import {
  build,
  buildAction,
  buildModule,
  buildState,
  useAgentContext,
} from "@/hooks/use-metaapp";
import { StreamWidget } from "@/widgets/StreamWidget";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpIcon } from "lucide-react";

export const StageControllerModule = buildModule({
  states: {
    positioner: buildState(
      {
        position_x: build.float(),
        position_y: build.float(),
        position_z: build.float(),
      },
      {
        forceHash:
          "3e1ba8b3140b4a2dba7c0e4bfafa8ff9a9731a3e2b0b51a97d1f52c81ade623d",
      },
    ),
  },
  actions: {
    moveY: buildAction(
      {
        y: build.float(),
      },
      {},
      {
        forceHash:
          "221142ddcfd6d5d32516a0f2cd62b8b423ac97dac11b61642ab98ac2646222ba",
      },
    ),
    moveX: buildAction(
      {
        x: build.float(),
      },
      {},
      {
        forceHash:
          "ae097dc60aaed3382ddfd8ed170d624bf5d7a319a0e32ae5650de454f660a452",
      },
    ),
  },
});

export const StageController = () => {
  const { value: position } = StageControllerModule.useState("positioner");

  const { assign } = StageControllerModule.useAction("moveY", {
    ephemeral: true,
  });
  const { assign: assignX } = StageControllerModule.useAction("moveX", {
    ephemeral: true,
  });

  if (!position) {
    return <div>Loading</div>;
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-gray-900 p-2 rounded-full px-3">
        {position.position_y}y {position.position_x}x {position.position_z}z
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
