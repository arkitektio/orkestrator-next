import { Button } from "@/components/ui/button";
import {
  build,
  buildAction,
  buildModule,
  buildState,
} from "@/hooks/use-metaapp";
import { StreamWidget } from "@/lovekit/widgets/StreamWidget";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpIcon } from "lucide-react";

export const PositionerModule = buildModule({
  name: "Positioner",
  description: "Controls the positioner and camera stream.",
  states: {
    camera: buildState(
      {
        latest_image: build.structure("@mikro/image"),
        stream: build.structure("@lok/stream"),
      },
      {
        forceHash:
          "98827913a754105345839da69433409c43b1000251387ff2a37e174e46f1f7e4",
      },
    ),
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

export const CentralCamera = () => {
  const { value: camera } = PositionerModule.useState("camera");

  if (!camera) {
    return <div>Loading</div>;
  }

  return (
    <div className="mx-auto max-h-[700px] max-w-[700px]">
      <StreamWidget value={camera.stream} />
    </div>
  );
};

export const PositionOverlay = () => {
  const { value: position } = PositionerModule.useState("positioner");

  const { assign } = PositionerModule.useAction("moveY", {
    ephemeral: true,
  });
  const { assign: assignX } = PositionerModule.useAction("moveX", {
    ephemeral: true,
  });

  if (!position) {
    return <div>Loading</div>;
  }

  return (
    <>
      <div className="absolute bottom-4 right-3 bg-gray-900 p-2 rounded-full px-3">
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
    </>
  );
};

export const Positioner = () => {
  return (
    <div className="w-full h-full  relative flex">
      <CentralCamera />
      <PositionOverlay />
    </div>
  );
};

export const PositionerPlaceholder = () => {
  return <div className="positioner">Placeholder</div>;
};
