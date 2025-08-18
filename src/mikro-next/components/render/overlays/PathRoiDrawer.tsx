import { RoiKind } from "@/mikro-next/api/graphql";
import { toast } from "sonner";
import * as THREE from "three";
import { PathDrawer } from "../controls/PathDrawer";
import { convertFromThreeJSCoords } from "./roiUtils";
import { useRoiCreation } from "./useRoiCreation";
import { RoiDrawerProps } from "./RoiDrawerCanvas";

export const PathRoiDrawer = ({
  imageHeight,
  imageWidth,
  image,
  c,
  z,
  t,
}: RoiDrawerProps) => {
  const createRoi = useRoiCreation(image.id);

  const onPathDrawn = async (points: THREE.Vector3[]) => {
    console.log("Path drawn:", points);

    try {
      const pathPoints: [number, number][] = points.map((p) => [p.x, p.y]);

      const vectors = convertFromThreeJSCoords(
        pathPoints,
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
            kind: RoiKind.Path,
            vectors,
          },
        },
      });

      if (result.data) {
        toast.success("Path ROI created successfully!");
        console.log("Created ROI:", result.data.createRoi);
      }
    } catch (error) {
      console.error("Error creating ROI:", error);
      toast.error("Failed to create ROI");
    }
  };

  return <PathDrawer onPathDrawn={onPathDrawn} />;
};
