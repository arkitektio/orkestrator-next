import { Arkitekt, useOmeroArk } from "@/lib/arkitekt/Arkitekt";
import { useService } from "@/lib/arkitekt/provider";
import { OmeroArkImage } from "@/linkers";
import { MateFinder } from "@/mates/types";
import { ListImageFragment } from "@/omero-ark/api/graphql";
import React from "react";

interface Props {
  image: ListImageFragment;
  mates?: MateFinder[];
}

const apiUrlFromImageID = (id: string, fakts: any) => {
  //TODO: CURRENTLY NOT FUNCTIONAL
  return `${fakts.omero_ark.endpoint_url.replace(
    "/graphql",
    "",
  )}/api/thumbnails/${id}`;
};

const Card = ({ image, mates }: Props) => {
  const token = Arkitekt.useToken();
  const omeroArk = Arkitekt.useService("omero_ark");

  // Components refs
  const ref: React.Ref<HTMLImageElement> = React.createRef();

  // Load data
  React.useEffect(() => {
    if (!image.id) return;
    if (ref.current === null) return;
    fetch(apiUrlFromImageID(image.id, omeroArk.client.url), {
      headers: {
        Accept: "image/jpeg",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.blob())
      .then((res) => {
        console.log("blob: ", res);
        var objectURL = URL.createObjectURL(res);
        if (ref.current === null) return;
        ref.current.style.background = "url('" + objectURL + "')";
        ref.current.style.backgroundSize = "cover";
        ref.current.style.backgroundPosition = "center";
      });
  }, [image.id, ref]);

  return (
    <OmeroArkImage.Smart
      object={image?.id}
      dropClassName={({ isOver, canDrop, isDragging }) =>
        `relative rounded group text-white bg-center bg-back-999 shadow-lg h-40 rounded rounded-xl  hover:bg-back-800 transition-all ease-in-out duration-200 group ${
          isOver && !isDragging && "border-primary-200 border"
        } ${isDragging && "ring-primary-200 ring"} `
      }
      mates={mates}
    >
      <div
        className="px-2 py-2 h-40 w-full top-0 left-0 bg-opacity-20 bg-black  rounded rounded-xl"
        ref={ref}
      >
        <OmeroArkImage.DetailLink
          className={({ isActive } /*  */) =>
            "z-10 font-bold text-md mb-2 cursor-pointer " +
            (isActive ? "text-primary-300" : "")
          }
          object={image.id}
        >
          {image?.name}
        </OmeroArkImage.DetailLink>
        {image.description}
      </div>
    </OmeroArkImage.Smart>
  );
};

export default Card;
