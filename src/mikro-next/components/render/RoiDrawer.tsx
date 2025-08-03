import {
  GetImageDocument,
  RoiKind,
  useCreateRoiMutation,
  GetImageQuery,
} from "@/mikro-next/api/graphql";
import { toast } from "sonner";
import * as THREE from "three";
import { RectangleDrawer } from "./controls/RectangleDrawer";
import { EllipsisDrawer } from "./controls/EllipsisDrawer";
import { LineDrawer } from "./controls/LineDrawer";
import { PointDrawer } from "./controls/PointDrawer";
import { PolygonDrawer } from "./controls/PolygonDrawer";
import { PathDrawer } from "./controls/PathDrawer";
import { useViewerState } from "./ViewerStateProvider";

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

export const RoiDrawerCanvas = ({
  imageHeight,
  imageWidth,
  image,
  c,
  z,
  t,
}: {
  imageHeight: number;
  imageWidth: number;
  image: { id: string };
  c: number;
  z: number;
  t: number;
}) => {
  const { roiDrawMode } = useViewerState();

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
        z,
        t,
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

  const onPolygonDrawn = async (points: THREE.Vector3[]) => {
    console.log("Polygon drawn:", points);

    try {
      const polygonPoints: [number, number][] = points.map((p) => [p.x, p.y]);

      const vectors = convertFromThreeJSCoords(
        polygonPoints,
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

  // Render the appropriate drawer based on the selected mode
  switch (roiDrawMode) {
    case RoiKind.Rectangle:
      return <RectangleDrawer onRectangleDrawn={onRectangleDrawn} />;
    case RoiKind.Ellipsis:
      return <EllipsisDrawer onEllipsisDrawn={onEllipsisDrawn} />;
    case RoiKind.Line:
      return <LineDrawer onLineDrawn={onLineDrawn} />;
    case RoiKind.Point:
      return <PointDrawer onPointDrawn={onPointDrawn} />;
    case RoiKind.Polygon:
      return <PolygonDrawer onPolygonDrawn={onPolygonDrawn} />;
    case RoiKind.Path:
      return <PathDrawer onPathDrawn={onPathDrawn} />;
    default:
      return <RectangleDrawer onRectangleDrawn={onRectangleDrawn} />;
  }
};
