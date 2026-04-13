export const StageFloor = ({ brandHue }: { brandHue: number }) => {
  const floorColor = `hsl(${brandHue}, 15%, 6%)`;
  const ringColor = `hsl(${brandHue}, 12%, 10%)`;

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color={floorColor} roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
        <ringGeometry args={[5.8, 6, 64]} />
        <meshBasicMaterial color={ringColor} transparent opacity={0.4} />
      </mesh>
    </>
  );
};
