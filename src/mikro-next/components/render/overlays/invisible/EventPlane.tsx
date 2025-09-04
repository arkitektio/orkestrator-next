import { useViewerState } from "../../ViewerStateProvider";

// Clickable plane component for handling background clicks
export const EventPlane = ({
  xSize,
  ySize,
}: {
  xSize: number;
  ySize: number;
}) => {
  const { setRoiContextMenu } = useViewerState();

  const handleClick = (event: any) => {
    // Handle shift+right-click for ROI context menu
    if (event.shiftKey) {
      event.stopPropagation();
      event.preventDefault();

      // Calculate screen position
      const x = event.clientX;
      const y = event.clientY;

      setRoiContextMenu({ open: true, x, y });
    }
  };

  return (
    <mesh position={[0, 0, -0.001]} onClick={handleClick}>
      <planeGeometry args={[xSize, ySize]} />
      <meshBasicMaterial transparent={true} opacity={0} depthWrite={false} />
    </mesh>
  );
};
