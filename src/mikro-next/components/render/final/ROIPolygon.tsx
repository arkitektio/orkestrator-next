import { MikroROI } from "@/linkers";
import {
  ListRoiFragment,
  RoiKind,
  useDeleteRoiMutation,
} from "@/mikro-next/api/graphql";
import { Line, Text, useCursor } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useViewerState } from "../ViewerStateProvider";
import { useMySelect } from "@/providers/selection/SelectionContext";
import { e, t } from "node_modules/@udecode/plate-list/dist/BaseListPlugin-B0eGlA5x";

const convertToThreeJSCoords = (
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

export const ROIPolygon = (props: {
  roi: ListRoiFragment;
  imageWidth: number;
  imageHeight: number;
}) => {
  if (!props.roi.vectors || props.roi.vectors.length == 0) return null;

  const { roi } = props;
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();
  const [hovered, setHovered] = useState(false);
  const {
    z,
    setAllowRoiDrawing,
    setRoiDrawMode,
    setShowRois,
    addDisplayStructure,
    setShowDisplayStructures,
    setOpenPanels,
  } = useViewerState();

  // Check if ROI should be visible based on z values
  const roiZValues = roi.vectors.map((v) => v[2]);

  // Convert ROI vectors to Three.js coordinates
  const vertices = convertToThreeJSCoords(
    roi.vectors,
    props.imageWidth,
    props.imageHeight,
  );

  // Create shape from vertices
  const shape = new THREE.Shape();
  shape.moveTo(vertices[0][0], vertices[0][1]);
  vertices.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.lineTo(vertices[0][0], vertices[0][1]); // Close the shape

  console.log("Vertices:", vertices);
  console.log("Shape:", shape);

  // Calculate the center and the rightmost point of the shape
  const boundingBox = new THREE.Box2().setFromPoints(shape.getPoints());
  const center = new THREE.Vector2();
  boundingBox.getCenter(center);

  const { toggle, toggleB, isSelected, isBSelected } = useMySelect({
    self: { identifier: "@mikro/roi", object: props.roi.id },
  });
  // Find the rightmost point of the bounding box
  const rightPoint = new THREE.Vector2(boundingBox.max.x, center.y);

  // Add a small offset to position the panel to the right
  const OFFSET_X = 20; // pixels to the right

  // Labels: show b-selection number near the ROI (if present),
  // and show the normal selection number centered inside the ROI when selected.
  const bLabel = isBSelected ? (
    <Text
      position={[center.x, center.y, 1]}
      fontSize={10}
      color="red"
      anchorX="center"
      anchorY="middle"
    >
      {String(isBSelected)}
    </Text>
  ) : null;

  const selectedLabel = isSelected ? (
    <Text
      position={[center.x, center.y, 1]}
      fontSize={14}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      {String(isSelected)}
    </Text>
  ) : null;

  // Project point to screen coordinates
  const projectToScreenCoordinates = (point: THREE.Vector2) => {
    // Create a 3D vector at z=0 (assuming your ROIs are in the z=0 plane)
    const vector = new THREE.Vector3(point.x, point.y, 0);

    // Project to normalized device coordinates (NDC)
    vector.project(camera);

    // Convert to screen coordinates
    const x = (vector.x * 0.5 + 0.5) * size.width;
    const y = (-(vector.y * 0.5) + 0.5) * size.height;

    return { x, y };
  };

  const color = isSelected ? "blue" : isBSelected ? "red" : "white";

  const onClick = useCallback(
    (e) => {
      e.stopPropagation();

      if (!meshRef.current) return;

      // Check for shift+click to add to display structures
      if (e.shiftKey && !e.ctrlKey) {
        toggle();
        e.preventDefault();
        return;
      }

      if (e.shiftKey && e.ctrlKey) {
        toggleB();
        e.preventDefault();
        return;
      }

      // Project the rightmost point of the ROI to screen coordinates
      const screenPos = projectToScreenCoordinates(rightPoint);

      console.log(
        "Anchoring panel at screen position:",
        screenPos.x,
        screenPos.y,
      );

      setOpenPanels(() => {
        return [
          {
            positionX: screenPos.x,
            positionY: screenPos.y,
            identifier: MikroROI.identifier,
            object: roi.id,
            isRightClick: false,
          },
        ];
      });
    },
    [
      roi.id,
      roi.kind,
      rightPoint,
      camera,
      size,
      setShowRois,
      setAllowRoiDrawing,
      setRoiDrawMode,
      addDisplayStructure,
      setShowDisplayStructures,
      setOpenPanels,
    ],
  );

  const onRightClick = useCallback(
    (e) => {
      e.stopPropagation();

      if (!meshRef.current) return;

      // Project the rightmost point of the ROI to screen coordinates
      const screenPos = projectToScreenCoordinates(rightPoint);

      console.log(
        "Right-click: Anchoring panel at screen position:",
        screenPos.x,
        screenPos.y,
      );

      setOpenPanels(() => {
        return [
          {
            positionX: screenPos.x,
            positionY: screenPos.y,
            identifier: MikroROI.identifier,
            object: roi.id,
            isRightClick: true,
          },
        ];
      });
    },
    [roi.id, rightPoint, camera, size],
  );

  useCursor(hovered, "pointer");

  if (!roiZValues.includes(z)) return null;
  if (!vertices.at(0)) return null;
  if (roi.kind == RoiKind.Rectangle) {
    return (
      <>
        <mesh
          ref={meshRef}
          position={[0, 0, 0.1]}
          onClick={onClick}
          onContextMenu={onRightClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
          }}
        >
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={hovered ? 0.5 : 0.2}
            depthWrite={false}
          />
        </mesh>
        <Line points={shape.getPoints()} color={color} lineWidth={2} />
        {bLabel}
        {selectedLabel}
      </>
    );
  }

  if (roi.kind == RoiKind.Ellipsis) {
    return (
      <>
        <mesh
          ref={meshRef}
          position={[0, 0, 0.1]}
          onClick={onClick}
          onContextMenu={onRightClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
          }}
        >
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={hovered ? 0.2 : 0.5}
            depthWrite={false}
          />
        </mesh>
        <Line points={shape.getPoints()} color={color} lineWidth={2} />
        {bLabel}
        {selectedLabel}
      </>
    );
  }

  if (roi.kind == RoiKind.Line) {
    const linePoints = vertices.map(([x, y]) => new THREE.Vector2(x, y));

    return (
      <>
        <Line
          points={linePoints}
          color={color}
          lineWidth={hovered ? 5 : 3}
          onClick={onClick}
          onContextMenu={onRightClick}
          onPointerOver={(e) => {
            setHovered(true);
          }}
          onPointerOut={(e) => {
            setHovered(false);
          }}
        />

        {bLabel}
        {selectedLabel}
      </>
    );
  }

  if (roi.kind == RoiKind.Point) {
    const point = vertices[0];
    if (!point) return null;

    return (
      <>
        <mesh
          ref={meshRef}
          position={[point[0], point[1], 0.1]}
          onClick={onClick}
          onContextMenu={onRightClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
          }}
        >
          <circleGeometry args={[hovered ? 8 : 5, 8]} />
          <meshBasicMaterial
            color={color}
            transparent={true}
            opacity={hovered ? 0.8 : 0.6}
            depthWrite={false}
          />
        </mesh>
        {/* Outer ring for better visibility */}
        <mesh position={[point[0], point[1], 0.2]}>
          <ringGeometry args={[hovered ? 8 : 5, hovered ? 10 : 7, 8]} />
          <meshBasicMaterial
            color={color}
            transparent={true}
            opacity={hovered ? 0.6 : 0.4}
            depthWrite={false}
          />
        </mesh>
        {bLabel}
      </>
    );
  }

  if (roi.kind == RoiKind.Polygon) {
    return (
      <>
        <mesh
          ref={meshRef}
          position={[0, 0, 0.1]}
          onClick={onClick}
          onContextMenu={onRightClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
          }}
        >
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={hovered ? 0.5 : 0.2}
            depthWrite={false}
          />
        </mesh>
        <Line points={shape.getPoints()} color={color} lineWidth={2} />
        {bLabel}
        {selectedLabel}
      </>
    );
  }

  if (roi.kind == RoiKind.Path) {
    const pathPoints = vertices.map(([x, y]) => new THREE.Vector2(x, y));

    return (
      <>
        <Line
          points={pathPoints}
          color={color}
          lineWidth={hovered ? 5 : 3}
          onClick={onClick}
          onPointerUp={(e) => e.stopPropagation()}
          onContextMenu={onRightClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
          }}
        />

        {bLabel}
        {selectedLabel}
      </>
    );
  }

  // Default case for Polygon
  return (
    <>
      <mesh
        ref={meshRef}
        position={[0, 0, 0.1]}
        onClick={onClick}
        onContextMenu={onRightClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={hovered ? 0.5 : 0.2}
          depthWrite={false}
        />
      </mesh>
      <line>
        <shapeGeometry args={[shape]} />
        <lineBasicMaterial color={color} />
      </line>
      {bLabel}
      {selectedLabel}
    </>
  );
};
