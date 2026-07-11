import { MikroROI } from "@/linkers";
import {
  ListRoiFragment,
  RoiKind
} from "@/mikro-next/api/graphql";
import { useMySelect } from "@/providers/selection/SelectionContext";
import { Line, Text, useCursor } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { useViewerState } from "../ViewerStateProvider";

const convertToThreeJSCoords = (
  vertices: [number, number, number, number, number][],
  imageWidth: number,
  imageHeight: number,
): [number, number][] => {
  const tr = vertices.map((v) => {
    const [, , , y, x] = v; // Try the original order first
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
  shape.moveTo(vertices[0][1], vertices[0][0]);
  vertices.slice(1).forEach(([x, y]) => shape.lineTo(y, x));
  shape.lineTo(vertices[0][1], vertices[0][0]); // Close the shape

  console.log("Vertices:", vertices);
  console.log("Shape:", shape);

  // Calculate the center and the rightmost point of the shape
  const boundingBox = new THREE.Box2().setFromPoints(shape.getPoints());
  const center = new THREE.Vector2();
  boundingBox.getCenter(center);

  const { toggle, toggleB, isSelected, isBSelected } = useMySelect({
    self: { identifier: "@mikro/roi", object: { id: props.roi.id } },
  });
  // Find the rightmost point of the bounding box
  const rightPoint = new THREE.Vector2(boundingBox.max.x, center.y);

  // Labels: show b-selection number near the ROI (if present),
  // and show the normal selection number centered inside the ROI when selected.



  if (!props.roi.vectors || props.roi.vectors.length == 0) return null;


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
          onPointerOver={() => {
            setHovered(true);
          }}
          onPointerOut={() => {
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

    // Split into individual segments so each can be coloured based on z.
    // A segment is "active" when either endpoint's z matches the current viewer z.
    const segments = roi.vectors.slice(0, -1).map((vec, i) => {
      const startZ = vec[2];
      const endZ = roi.vectors[i + 1][2];
      const isActive = startZ === z || endZ === z;
      return {
        pts: [pathPoints[i], pathPoints[i + 1]] as THREE.Vector2[],
        isActive,
      };
    });

    const segmentHandlers = {
      onClick,
      onPointerUp: (e: ThreeEvent<PointerEvent>) => e.stopPropagation(),
      onContextMenu: onRightClick,
      onPointerOver: (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); },
      onPointerOut:  (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(false); },
    };

    return (
      <>
        {segments.map((seg, i) => (
          <Line
            key={i}
            points={seg.pts}
            color={seg.isActive ? color : "#666666"}
            lineWidth={seg.isActive ? (hovered ? 10 : 5) : 3}
            transparent
            opacity={seg.isActive ? 1.0 : 0.4}
            {...segmentHandlers}
          />
        ))}
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
