import { RoiKind } from "@/mikro-next/api/graphql";
import { toast } from "sonner";
import * as THREE from "three";
import { PointDrawer } from "../controls/PointDrawer";
import { RoiDrawerProps } from "./RoiDrawerCanvas";
import { convertFromThreeJSCoords } from "./roiUtils";
import { useRoiCreation } from "./useRoiCreation";

export const PointRoiDrawer = ({
  imageHeight,
  imageWidth,
  image,
  c,
  z,
  t,
  event_key = "shift",
}: RoiDrawerProps) => {
  const createRoi = useRoiCreation(image.id);

  const onPointDrawn = async (point: THREE.Vector3) => {
    console.log("Point drawn:", point);

    try {
      const pointCoords: [number, number][] = [[point.x, point.y]];

      const vectors = convertFromThreeJSCoords(
        pointCoords,
        imageWidth,
        imageHeight,
        c,
        z,
        t,
      );

      const result = await createRoi({
        variables: {
          input: {
            image: image.id,
            kind: RoiKind.Point,
            vectors,
          },
        },
      });

      if (result.data) {
        toast.success("Point ROI created successfully!");
        console.log("Created ROI:", result.data.createRoi);
      }
    } catch (error) {
      console.error("Error creating ROI:", error);
      toast.error("Failed to create ROI");
    }
  };

  return <PointDrawer onPointDrawn={onPointDrawn} event_key={event_key} />;
};
