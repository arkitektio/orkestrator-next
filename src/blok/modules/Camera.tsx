import { Button } from "@/components/ui/button";
import {
  action,
  integer,
  module,
  state,
  structure,
} from "@/hooks/use-metaapp";
import { MikroImage } from "@/linkers";
import { useGetImageQuery } from "@/mikro-next/api/graphql";
import { DelegatingImageRender } from "@/mikro-next/components/render/DelegatingImageRender";
import { ImageWidget } from "@/widgets/ImageWidget";

export const CameraModule = module({
  name: "Camera",
  description: "Controls the camera and image acquisition.",
  states: {
    camera: state(
      {
        latest_image: structure("@mikro/image"),
      }
    ),
  },
  actions: {
    acquire: action(
      {
        x: integer("The x position of the stage"),
        y: integer("The y position of the stage"),
        z: integer("The z position of the stage"),
      },
      {
        return0: structure("@mikro/image"),
      }
    )
  },
});

export const ImageRender = ({id}: {
  id: string,
}) => {

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
}

export const CentralCamera = () => {
  const { value: camera, errors} = CameraModule.useState("camera");

  

  const { assign } = CameraModule.useAction("acquire");
  if (errors) {
    return <div>{JSON.stringify(errors)}</div>;
  }
  




  return (
    <div className="mx-auto max-h-[700px] max-w-[700px] my-auto bg-black">
      { camera?.latest_image && (
        <ImageRender id={camera.latest_image} />
      )}

      <Button 
        onClick={() => {
          assign({
            x: 0,
            y: 0,
            z: 0,
          });
        }}
        className="absolute bottom-0 left-0 m-4"
      >
        Acquire
      </Button>
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
