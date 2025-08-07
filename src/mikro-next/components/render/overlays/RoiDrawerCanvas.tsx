import { RoiKind } from "@/mikro-next/api/graphql";
import { RectangleRoiDrawer } from "./RectangleRoiDrawer";
import { EllipsisRoiDrawer } from "./EllipsisRoiDrawer";
import { LineRoiDrawer } from "./LineRoiDrawer";
import { PointRoiDrawer } from "./PointRoiDrawer";
import { PolygonRoiDrawer } from "./PolygonRoiDrawer";
import { PathRoiDrawer } from "./PathRoiDrawer";
import { useViewerState } from "../ViewerStateProvider";

export interface RoiDrawerProps {
  imageHeight: number;
  imageWidth: number;
  image: { id: string };
  c: number;
  z: number;
  t: number;
}

export const RoiDrawerCanvas = ({
  imageHeight,
  imageWidth,
  image,
  c,
  z,
  t,
}: RoiDrawerProps) => {
  const { roiDrawMode } = useViewerState();

  const commonProps = {
    imageHeight,
    imageWidth,
    image,
    c,
    z,
    t,
  };

  // Render the appropriate drawer based on the selected mode
  switch (roiDrawMode) {
    case RoiKind.Rectangle:
      return <RectangleRoiDrawer {...commonProps} />;
    case RoiKind.Ellipsis:
      return <EllipsisRoiDrawer {...commonProps} />;
    case RoiKind.Line:
      return <LineRoiDrawer {...commonProps} />;
    case RoiKind.Point:
      return <PointRoiDrawer {...commonProps} />;
    case RoiKind.Polygon:
      return <PolygonRoiDrawer {...commonProps} />;
    case RoiKind.Path:
      return <PathRoiDrawer {...commonProps} />;
    default:
      return <RectangleRoiDrawer {...commonProps} />;
  }
};
