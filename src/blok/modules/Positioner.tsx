import { Button } from "@/components/ui/button";
import {
  build,
  buildAction,
  buildModule,
  buildState,
} from "@/hooks/use-metaapp";
import { AsyncSoloBroadcastWidget } from "@/lovekit/widgets/SoloBroadcastWidget";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpIcon } from "lucide-react";

export const PositionerModule = buildModule({
  name: "Positioner",
  description: "Controls the positioner and camera stream.",
  states: {
    camera: buildState({
      keys: {
        broadcast: build.structure("@lovekit/solo_broadcast"),
      },
    }),
    positioner: buildState({
      keys: {
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
  },
});

export const CentralCamera = () => {
  const { value: camera } = PositionerModule.useState("camera");

  if (!camera) {
    return <div>Loading</div>;
  }

  return (
    <div className="mx-auto  w-full h-full bg-black relative">
      <AsyncSoloBroadcastWidget id={camera.broadcast} />
    </div>
  );
};

export const PositionOverlay = () => {
  const { value: position } = PositionerModule.useState("positioner");

  const { assign } = PositionerModule.useAction("moveY");
  const { assign: assignX } = PositionerModule.useAction("moveX");

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
