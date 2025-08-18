import { RoiKind } from "@/mikro-next/api/graphql";
import { toast } from "sonner";
import * as THREE from "three";
import { RectangleDrawer } from "../controls/RectangleDrawer";
import { RoiDrawerProps } from "./RoiDrawerCanvas";
import { convertFromThreeJSCoords } from "./roiUtils";
import { useRoiCreation } from "./useRoiCreation";

export const RectangleRoiDrawer = ({
  imageHeight,
  imageWidth,
  image,
  c,
  z,
  t,
}: RoiDrawerProps) => {
  const createRoi = useRoiCreation(image.id);

  const onRectangleDrawn = async (start: THREE.Vector3, end: THREE.Vector3) => {
    console.log("Rectangle drawn:", start, end);

    try {
      // Convert Three.js coordinates back to image coordinates using our conversion function
      // Create rectangle corners as 2D coordinates first
      const rectangleCorners: [number, number][] = [
        [start.x, start.y], // Top-left
        [end.x, start.y], // Top-right
        [end.x, end.y], // Bottom-right
        [start.x, end.y], // Bottom-left
      ];

      // Convert to FiveDVector format [c, t, z, y, x]
      const vectors = convertFromThreeJSCoords(
        rectangleCorners,
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
            kind: RoiKind.Rectangle,
            vectors,
          },
        },
      });

      if (result.data) {
        toast.success("Rectangle ROI created successfully!");
        console.log("Created ROI:", result.data.createRoi);
      }
    } catch (error) {
      console.error("Error creating ROI:", error);
      toast.error("Failed to create ROI");
    }
  };

  return <RectangleDrawer onRectangleDrawn={onRectangleDrawn} />;
};
