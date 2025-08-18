import { OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const AutoZoomCamera = ({
  imageWidth,
  imageHeight,
  imageCenterX = 0,
  imageCenterY = 0,
}: {
  imageWidth: number;
  imageHeight: number;
  imageCenterX?: number;
  imageCenterY?: number;
  contextId?: string;
}) => {
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const { size } = useThree();

  // Store the camera's offset from the image center to maintain panning
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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
