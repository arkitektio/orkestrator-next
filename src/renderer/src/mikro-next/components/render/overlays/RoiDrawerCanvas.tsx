import { RoiKind } from "@/mikro-next/api/graphql";
import { useViewerState } from "../ViewerStateProvider";
import { EventKeyProps } from "../controls/eventKeyUtils";
import { EllipsisRoiDrawer } from "./EllipsisRoiDrawer";
import { LineRoiDrawer } from "./LineRoiDrawer";
import { PathRoiDrawer } from "./PathRoiDrawer";
import { PointRoiDrawer } from "./PointRoiDrawer";
import { PolygonRoiDrawer } from "./PolygonRoiDrawer";
import { RectangleRoiDrawer } from "./RectangleRoiDrawer";

export interface RoiDrawerProps extends EventKeyProps {
  imageHeight: number;
  imageWidth: number;
  image: { id: string };
}

export const RoiDrawerCanvas = ({
  imageHeight,
  imageWidth,
  image,
  event_key = "shift",
}: RoiDrawerProps) => {
  const { roiDrawMode, z, t } = useViewerState();

  const commonProps = {
    imageHeight,
    imageWidth,
    image,
    c: 0,
    t,
    z,
    event_key,
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
