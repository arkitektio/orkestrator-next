// Clickable plane component for handling background clicks
export const EventPlane = ({
  xSize,
  ySize,
  setContextMenu,
}: {
  xSize: number;
  ySize: number;
  setContextMenu(context: { open: boolean; x: number; y: number }): void;
}) => {
  const handleClick = (event: any) => {
    // Handle shift+right-click for ROI context menu
    if (event.shiftKey) {
      event.stopPropagation();
      event.preventDefault();

      // Calculate screen position
      const x = event.clientX;
      const y = event.clientY;

      setContextMenu({ open: true, x, y });
    }
  };

  return (
    <mesh position={[0, 0, -0.001]} onClick={handleClick}>
      <planeGeometry args={[xSize, ySize]} />
      <meshBasicMaterial transparent={true} opacity={0} depthWrite={false} />
    </mesh>
  );
};
