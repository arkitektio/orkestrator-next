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

export const PositionerModule = buildModule({
  states: {
    positioner: buildState(
      {
        position_x: build.float(),
        position_y: build.float(),
        position_z: build.float(),
        latest_image: build.structure("@mikro/image"),
        stream: build.structure("@lok/stream"),
      },
      {
        forceHash:
          "419bca0e04d05a101436571cfe9590a62ecd8422cf8ff88488daeb2262aad00b",
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

export const Positioner = () => {
  const { agent } = useAgentContext();

  const { value } = PositionerModule.useState("positioner");

  const { assign } = PositionerModule.useAction("moveY", {
    ephemeral: true,
  });
  const { assign: assignX } = PositionerModule.useAction("moveX", {
    ephemeral: true,
  });

  if (!value) {
    return <div>Loading</div>;
  }

  return (
    <div className="w-full h-full bg-black relative flex">
      <div className="mx-auto">
        <StreamWidget value={value.stream} />
      </div>
      <div className="absolute bottom-4 right-3 bg-gray-900 p-2 rounded-full px-3">
        {value.position_y}y {value.position_x}x {value.position_z}z
      </div>
      <Button
        className="absolute top-2 left-1/2 transform -translate-x-1/2"
        onClick={() => assign({ y: value.position_y + 1 })}
        variant={"outline"}
      >
        <ArrowUpIcon></ArrowUpIcon>
      </Button>
      <Button
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
        onClick={() => assign({ y: value.position_y - 1 })}
        variant={"outline"}
      >
        <ArrowDown />
      </Button>
      <Button
        className="absolute top-1/2 left-2 transform -translate-y-1/2"
        onClick={() => assignX({ x: value.position_x - 1 })}
        variant={"outline"}
      >
        <ArrowLeft />
      </Button>
      <Button
        className="absolute top-1/2 right-2 transform -translate-y-1/2"
        onClick={() => assignX({ x: value.position_x + 1 })}
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
