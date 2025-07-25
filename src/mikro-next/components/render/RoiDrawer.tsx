import { useCreateRoiMutation } from "@/mikro-next/api/graphql";
import { RectangleDrawer } from "./controls/RectangleDrawer";
import { Vector3 } from "@react-three/fiber";

export const RoiDrawer: React.FC<{ image: string }> = ({ image }) => {
  const [createRoi] = useCreateRoiMutation({});

  const onRectangleDrawn = (start: Vector3, end: Vector3) => {
    console.log("Rectangle drawn:", start, end);
    // Handle the drawn rectangle here, e.g., save it or update state
  };

  return <RectangleDrawer onRectangleDrawn={onRectangleDrawn} />;
};
