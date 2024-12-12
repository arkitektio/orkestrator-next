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

export const CameraModule = buildModule({
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
  },
  actions: {},
});

export const CentralCamera = () => {
  const { value: camera } = CameraModule.useState("camera");

  if (!camera) {
    return <div>Loading</div>;
  }

  return (
    <div className="mx-auto max-h-[700px] max-w-[700px] my-auto bg-black">
      <StreamWidget value={camera.stream} />
    </div>
  );
};

export const Camera = () => {
  return (
    <div className="w-full h-full  relative flex">
      <CentralCamera />
    </div>
  );
};

export const PositionerPlaceholder = () => {
  return <div className="positioner">Placeholder</div>;
};
