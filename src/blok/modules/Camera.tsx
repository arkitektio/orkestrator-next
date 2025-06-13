import { Button } from "@/components/ui/button";
import { action, integer, module, state, structure } from "@/hooks/use-metaapp";
import { MikroImage } from "@/linkers";
import { AsyncSoloBroadcastWidget } from "@/lovekit/widgets/SoloBroadcastWidget";
import {
  AsyncStreamWidget,
  StreamWidget,
} from "@/lovekit/widgets/StreamWidget";
import { useGetImageQuery } from "@/mikro-next/api/graphql";
import { DelegatingImageRender } from "@/mikro-next/components/render/DelegatingImageRender";
import { ImageWidget } from "@/widgets/ImageWidget";

export const CameraModule = module({
  name: "Camera",
  description: "Shows a stream from the central camera",
  states: {
    camera: state({
      keys: {
        broadcast: structure("@lovekit/solo_broadcast"),
      },
    }),
  },
  actions: {},
});

export const ImageRender = ({ id }: { id: string }) => {
  const { data } = useGetImageQuery({
    variables: {
      id,
    },
  });

  const defaultContext = data?.image?.rgbContexts.at(0);

  return (
    <MikroImage.DetailLink object={id}>
      <div className="w-[700px] h-[700px]">
        {defaultContext && (
          <DelegatingImageRender context={defaultContext} rois={[]} />
        )}
      </div>
    </MikroImage.DetailLink>
  );
};

export const CentralCamera = () => {
  const { value: camera, errors } = CameraModule.useState("camera");

  if (errors) {
    return <div>{JSON.stringify(errors)}</div>;
  }

  return (
    <div className="bg-black h-full w-full">
      {camera?.broadcast && <AsyncSoloBroadcastWidget id={camera.broadcast} />}
      {!camera?.broadcast && (
        <div className="flex items-center justify-center h-full">
          <span className="text-white">Loading camera stream...</span>
        </div>
      )}
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
