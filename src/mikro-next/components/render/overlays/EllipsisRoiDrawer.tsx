import { RoiKind } from "@/mikro-next/api/graphql";
import { toast } from "sonner";
import * as THREE from "three";
import { EllipsisDrawer } from "../controls/EllipsisDrawer";
import { convertFromThreeJSCoords } from "./roiUtils";
import { useRoiCreation } from "./useRoiCreation";
import { RoiDrawerProps } from "./RoiDrawerCanvas";

export const EllipsisRoiDrawer = ({
  imageHeight,
  imageWidth,
  image,
  c,
  z,
  t,
}: RoiDrawerProps) => {
  const createRoi = useRoiCreation(image.id);

  const onEllipsisDrawn = async (
    center: THREE.Vector3,
    radiusX: number,
    radiusY: number,
  ) => {
    console.log("Ellipsis drawn:", center, radiusX, radiusY);

    try {
      // Generate ellipse points
      const segments = 32;
      const ellipsePoints: [number, number][] = [];

      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = center.x + Math.cos(angle) * radiusX;
        const y = center.y + Math.sin(angle) * radiusY;
        ellipsePoints.push([x, y]);
      }

      const vectors = convertFromThreeJSCoords(
        ellipsePoints,
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
            kind: RoiKind.Ellipsis,
            vectors,
          },
        },
      });

      if (result.data) {
        toast.success("Ellipse ROI created successfully!");
        console.log("Created ROI:", result.data.createRoi);
      }
    } catch (error) {
      console.error("Error creating ROI:", error);
      toast.error("Failed to create ROI");
    }
  };

  return <EllipsisDrawer onEllipsisDrawn={onEllipsisDrawn} />;
};
