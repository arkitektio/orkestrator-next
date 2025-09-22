import { StageFragment } from "@/mikro-next/api/graphql";
import { OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";



const calculateImageDims = (stage: StageFragment) => {
  if (!stage.affineViews || stage.affineViews.length === 0) {
    // Return default values if no views
    return { width: 800, height: 800, centerX: 0, centerY: 0 };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  // Process each affine view
  stage.affineViews.forEach((view) => {
    if (!view.image?.store?.shape || view.image.store.shape.length < 2) {
      return; // Skip if no shape data
    }


    // Get image dimensions - shape is typically [t, c, z, y, x] or similar
    const shape = view.image.store.shape;
    const imageHeight = shape[shape.length - 2]; // Y dimension
    const imageWidth = shape[shape.length - 1];  // X dimension

    // Create transformation matrix from the affine matrix
    const matrix = new THREE.Matrix4();
    const flatMatrix = view.affineMatrix.reduce((acc, row) => acc.concat(row), []);
    matrix.set(
      flatMatrix[0], flatMatrix[1], flatMatrix[2], flatMatrix[3],
      flatMatrix[4], flatMatrix[5], flatMatrix[6], flatMatrix[7],
      flatMatrix[8], flatMatrix[9], flatMatrix[10], flatMatrix[11],
      flatMatrix[12], flatMatrix[13], flatMatrix[14], flatMatrix[15]
    );

    if (flatMatrix[3] == 0 && flatMatrix[7] == 0 && flatMatrix[11] == 0 && stage.affineViews.length > 1) {
      console.warn("Skipping view with invalid affine matrix:", view.affineMatrix);
      return;
    }

    // Define the four corners of the image in image space
    const corners = [
      new THREE.Vector3(0, 0, 0),                    // Top-left
      new THREE.Vector3(imageWidth, 0, 0),          // Top-right  
      new THREE.Vector3(0, imageHeight, 0),         // Bottom-left
      new THREE.Vector3(imageWidth, imageHeight, 0) // Bottom-right
    ];

    // Transform each corner to world space and track bounds
    corners.forEach((corner) => {
      corner.applyMatrix4(matrix);
      minX = Math.min(minX, corner.x);
      maxX = Math.max(maxX, corner.x);
      minY = Math.min(minY, corner.y);
      maxY = Math.max(maxY, corner.y);
    });
  });

  // Handle case where no valid views were processed
  if (minX === Infinity) {
    return { width: 800, height: 800, centerX: 0, centerY: 0 };
  }

  // Calculate total dimensions and center
  const width = maxX - minX;
  const height = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const dims = { width, height, centerX, centerY };
  console.log("DIms", dims);
  return dims;
}


export const StageCamera = ({
  stage,
}: {
  stage: StageFragment
}) => {
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const { size } = useThree();

  // Store the camera's offset from the image center to maintain panning
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });


  const { width: imageWidth, height: imageHeight, centerX: imageCenterX, centerY: imageCenterY } = useMemo(() => calculateImageDims(stage), [stage]);

  // Initial setup only - run once to center the camera on the image
  useEffect(() => {
    if (!cameraRef.current) return;

    // Initially center the camera on the image
    cameraRef.current.position.set(imageCenterX, imageCenterY, 5);
    offsetRef.current = { x: 0, y: 0 };
  }, [imageCenterX, imageCenterY, imageHeight, imageWidth]);

  useFrame(() => {
    if (!cameraRef.current) return;

    // Store current camera position relative to image center before updating
    const currentOffsetX = cameraRef.current.position.x - imageCenterX;
    const currentOffsetY = cameraRef.current.position.y - imageCenterY;
    offsetRef.current = { x: currentOffsetX, y: currentOffsetY };

    // Calculate the aspect ratios
    const canvasAspect = size.width / size.height;
    const imageAspect = imageWidth / imageHeight;

    // Determine zoom factor to fit the whole image
    let zoom;
    if (canvasAspect > imageAspect) {
      // Canvas is wider than the image
      zoom = size.height / imageHeight;
    } else {
      // Canvas is taller than the image
      zoom = size.width / imageWidth;
    }

    // Apply some padding (80% of max zoom)
    zoom = zoom * 0.8;

    // Set camera frustum
    cameraRef.current.left = -size.width / (2 * zoom);
    cameraRef.current.right = size.width / (2 * zoom);
    cameraRef.current.top = size.height / (2 * zoom);
    cameraRef.current.bottom = -size.height / (2 * zoom);

    // Apply the stored offset to maintain panning position
    cameraRef.current.position.set(
      imageCenterX + offsetRef.current.x,
      imageCenterY + offsetRef.current.y,
      5,
    );
    cameraRef.current.rotation.set(0, 0, 0);

    cameraRef.current.updateProjectionMatrix();
  });

  return (
    <OrthographicCamera
      ref={cameraRef}
      position={[imageCenterX, imageCenterY, 5]}
      near={0.1}
      far={1000}
      makeDefault
    />
  );
};
