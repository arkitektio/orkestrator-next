import { RoiKind } from "@/mikro-next/api/graphql";
import { toast } from "sonner";
import * as THREE from "three";
import { LineDrawer } from "../controls/LineDrawer";
import { RoiDrawerProps } from "./RoiDrawerCanvas";
import { convertFromThreeJSCoords } from "./roiUtils";
import { useRoiCreation } from "./useRoiCreation";

export const LineRoiDrawer = ({
  imageHeight,
  imageWidth,
  image,
  c,
  z,
  t,
  event_key = "shift",
}: RoiDrawerProps) => {
  const createRoi = useRoiCreation(image.id);

  const onLineDrawn = async (start: THREE.Vector3, end: THREE.Vector3) => {
    console.log("Line drawn:", start, end);

    try {
      const linePoints: [number, number][] = [
        [start.x, start.y],
        [end.x, end.y],
      ];

      const vectors = convertFromThreeJSCoords(
        linePoints,
        imageWidth,
        imageHeight,
        c,
        t,
        z,
      );

      const result = await createRoi({
        variables: {
          input: {
            image: image.id,
            kind: RoiKind.Line,
            vectors,
          },
        },
      });

      if (result.data) {
        toast.success("Line ROI created successfully!");
        console.log("Created ROI:", result.data.createRoi);
      }
    } catch (error) {
      console.error("Error creating ROI:", error);
      toast.error("Failed to create ROI");
    }
  };

  return <LineDrawer onLineDrawn={onLineDrawn} event_key={event_key} />;
};
