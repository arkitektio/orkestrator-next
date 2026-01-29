export const convertFromThreeJSCoords = (
  threeJSVertices: [number, number][],
  imageWidth: number,
  imageHeight: number,
  c: number = 0,
  t: number = 0,
  z: number = 0,
): [number, number, number, number, number][] => {
  return threeJSVertices.map((vertex) => {
    const [threeX, threeY] = vertex;
    // Reverse the transformation:
    // Original: transformedX = x - imageWidth / 2, so x = transformedX + imageWidth / 2
    // Original: transformedY = imageHeight / 2 - y, so y = imageHeight / 2 - transformedY
    const x = threeX + imageWidth / 2;
    const y = imageHeight / 2 - threeY;
    return [c, t, z, y, x] as [number, number, number, number, number];
  });
};

export const convertToThreeJSCoords = (
  vertices: [number, number, number, number, number][],
  imageWidth: number,
  imageHeight: number,
): [number, number][] => {
  const tr = vertices.map((v) => {
    const [c, t, z, y, x] = v; // Try the original order first
    // Convert from image coordinates to Three.js coordinates
    // Image: (0,0) = top-left, (width,height) = bottom-right
    // Three.js: (0,0) = center, (-width/2, height/2) = top-left
    const transformedX = x - imageWidth / 2; // Remove the negative sign
    const transformedY = imageHeight / 2 - y; // Keep this transformation
    return [transformedX, transformedY] as [number, number];
  });
  return tr;
};
