import { RoiKind } from "@/mikro-next/api/graphql";
import { toast } from "sonner";
import * as THREE from "three";
import { PolygonDrawer } from "../controls/PolygonDrawer";
import { RoiDrawerProps } from "./RoiDrawerCanvas";
import { convertFromThreeJSCoords } from "./roiUtils";
import { useRoiCreation } from "./useRoiCreation";

export const PolygonRoiDrawer = ({
  imageHeight,
  imageWidth,
  image,
  c,
  z,
  t,
  event_key = "shift",
}: RoiDrawerProps) => {
  const createRoi = useRoiCreation(image.id);

  const onPolygonDrawn = async (points: THREE.Vector3[]) => {
    try {
      const polygonPoints: [number, number][] = points.map((p) => [p.x, p.y]);

      const vectors = convertFromThreeJSCoords(
        polygonPoints,
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
            kind: RoiKind.Polygon,
            vectors,
          },
        },
      });

      if (result.data) {
        toast.success("Polygon ROI created successfully!");
        console.log("Created ROI:", result.data.createRoi);
      }
    } catch (error) {
      console.error("Error creating ROI:", error);
      toast.error("Failed to create ROI");
    }
  };

  return (
    <PolygonDrawer onPolygonDrawn={onPolygonDrawn} event_key={event_key} />
  );
};
