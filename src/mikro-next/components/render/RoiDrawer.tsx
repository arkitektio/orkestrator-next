import { GetImageDocument, RoiKind, useCreateRoiMutation, GetImageQuery } from "@/mikro-next/api/graphql";
import { toast } from "sonner";
import * as THREE from "three";
import { RectangleDrawer } from "./controls/RectangleDrawer";

const convertFromThreeJSCoords = (
  threeJSVertices: [number, number][],
  imageWidth: number,
  imageHeight: number,
  c: number = 0,
  t: number = 0,
  z: number = 0,
): [number, number, number, number, number][] => {
  return threeJSVertices.map((vertex) => {
    const [threeX, threeY] = vertex;
    // Reverse the transformation: x = -(threeX + imageWidth / 2), y = threeY + imageHeight / 2
    const x = -(threeX - imageWidth / 2);
    const y = threeY + imageHeight / 2;
    return [c, t, z, y, x] as [number, number, number, number, number];
  });
};




export const RoiDrawerCanvas = ({ imageHeight, imageWidth, image } :{ imageHeight: number, imageWidth: number, image: {id: string}  }) => {

  const [createRoi] = useCreateRoiMutation({
    update: (cache, { data }) => {
      if (data?.createRoi) {
        // Read the current cache for the image
        const existingImage = cache.readQuery<GetImageQuery>({
          query: GetImageDocument,
          variables: { id: image.id },
        });

        if (existingImage?.image) {
          // Update the cache by adding the new ROI to the rois array
          cache.writeQuery({
            query: GetImageDocument,
            variables: { id: image.id },
            data: {
              image: {
                ...existingImage.image,
                rois: [...existingImage.image.rois, data.createRoi],
              },
            },
          });
        }
      }
    },
  });


  const onRectangleDrawn = async (start: THREE.Vector3, end: THREE.Vector3) => {
    console.log("Rectangle drawn:", start, end);
    
    try {
      // Convert Three.js coordinates back to image coordinates using our conversion function
      // Create rectangle corners as 2D coordinates first
      const rectangleCorners: [number, number][] = [
        [start.x, start.y], // Top-left
        [end.x, start.y],   // Top-right
        [end.x, end.y],     // Bottom-right
        [start.x, end.y],   // Bottom-left
      ];

      // Convert to FiveDVector format [c, t, z, y, x]
      const vectors = convertFromThreeJSCoords(rectangleCorners, imageWidth, imageHeight);

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

  return <RectangleDrawer onRectangleDrawn={onRectangleDrawn} />
};
