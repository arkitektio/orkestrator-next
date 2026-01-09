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
  event_key = "shift",
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

      if (Math.abs(start.x - end.x) <= 2 || Math.abs(start.y - end.y) <= 2) {
        return;
      }

      // Convert to FiveDVector format [c, t, z, y, x]
      const vectors = convertFromThreeJSCoords(
        rectangleCorners,
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
            kind: RoiKind.Rectangle,
            vectors,
          },
        },
      });

      if (result.data) {
        toast.success("Rectangle ROI created successfully!");
      }
    } catch (error) {
      console.error("Error creating ROI:", error);
      toast.error("Failed to create ROI");
    }
  };

  return (
    <RectangleDrawer
      onRectangleDrawn={onRectangleDrawn}
      event_key={event_key}
      imageHeight={imageHeight}
      imageWidth={imageWidth}
      imageId={image.id}
    />
  );
};
