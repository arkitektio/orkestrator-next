import { MikroROI } from "@/linkers";
import {
  ListRoiFragment,
  RoiKind,
  useDeleteRoiMutation,
} from "@/mikro-next/api/graphql";
import { Line, useCursor } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useViewerState } from "../ViewerStateProvider";
import { PassThroughProps } from "../FInalRender";



const convertToThreeJSCoords = (
  vertices: [number, number, number, number, number][],
  imageWidth: number,
  imageHeight: number,
): [number, number][] => {
  console.log("Raw vertices:", vertices);
  console.log("Image dimensions:", imageWidth, imageHeight);
  const tr = vertices.map((v) => {
    console.log("Processing vertex:", v);
    const [c, t, z, y, x] = v; // Try the original order first
    // Convert from image coordinates to Three.js coordinates
    // Image: (0,0) = top-left, (width,height) = bottom-right
    // Three.js: (0,0) = center, (-width/2, height/2) = top-left
    const transformedX = x - imageWidth / 2; // Remove the negative sign
    const transformedY = imageHeight / 2 - y; // Keep this transformation
    console.log(
      `Original: x=${x}, y=${y} -> Transformed: x=${transformedX}, y=${transformedY}`,
    );
    return [transformedX, transformedY] as [number, number];
  });
  console.log("Transformed vertices:", tr);
  return tr;
};

export const ROIPolygon = (
  props: {
    roi: ListRoiFragment;
    imageWidth: number;
    imageHeight: number;
  } & PassThroughProps,
) => {
  const { roi } = props;
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const [deleteRoi] = useDeleteRoiMutation();
  const {
    z,
    setAllowRoiDrawing,
    setRoiDrawMode,
    setShowRois,
    addDisplayStructure,
    setShowDisplayStructures,
    removeDisplayStructure,
    displayStructures,
    showDisplayStructures,
  } = useViewerState();

  // Check if ROI should be visible based on z values
  const roiZValues = roi.vectors.map(v => v[2]);

  // Keyboard event handler for deletion
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace" && selected) {
        event.preventDefault();
        event.stopPropagation();
        deleteRoi({
          variables: { id: roi.id },
          onCompleted: () => {
            console.log(`ROI ${roi.id} deleted`);
          },
          onError: (error) => {
            console.error("Failed to delete ROI:", error);
          },
        });
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        meshRef.current &&
        !meshRef.current.userData.contains?.(event.target)
      ) {
        setSelected(false);
      }
    };

    if (selected) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("click", handleClickOutside);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("click", handleClickOutside);
      };
    }
  }, [selected, roi.id, deleteRoi]);

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

  // Find the rightmost point of the bounding box
  const rightPoint = new THREE.Vector2(boundingBox.max.x, center.y);

  // Add a small offset to position the panel to the right
  const OFFSET_X = 20; // pixels to the right

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

  const onClick = useCallback(
    (e) => {
      e.stopPropagation();

      if (!meshRef.current) return;

      // Check for shift+click to add to display structures
      if (e.shiftKey) {
        console.log(
          "Shift+click detected, adding ROI to display structures:",
          roi.id,
        );
        if (!isDisplayStructure) {
          addDisplayStructure(roi.id);
          setShowDisplayStructures(true);
        }
        else {
          removeDisplayStructure(roi.id);
        }

        // Project the rightmost point of the ROI to screen coordinates
        const screenPos = projectToScreenCoordinates(rightPoint);

        // Open the display structures panel
        props.setOpenPanels(() => {
          return [
            {
              positionX: screenPos.x,
              positionY: screenPos.y,
              identifier: "display_structures",
              object: "structures_panel",
              kind: "display_structures",
              isRightClick: false,
            },
          ];
        });
        return;
      }

      // Set this ROI as selected for deletion
      setSelected(true);

      // Enable ROI drawing mode with the same type as the clicked ROI
      setShowRois(true);
      setAllowRoiDrawing(true);
      setRoiDrawMode(roi.kind);

      // Project the rightmost point of the ROI to screen coordinates
      const screenPos = projectToScreenCoordinates(rightPoint);

      console.log(
        "Anchoring panel at screen position:",
        screenPos.x,
        screenPos.y,
      );

      props.setOpenPanels(() => {
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
      setSelected,
      setShowRois,
      setAllowRoiDrawing,
      setRoiDrawMode,
      addDisplayStructure,
      setShowDisplayStructures,
    ],
  );

  const onRightClick = useCallback(
    (e) => {
      e.stopPropagation();

      if (!meshRef.current) return;

      // Set this ROI as selected for deletion
      setSelected(true);

      // Project the rightmost point of the ROI to screen coordinates
      const screenPos = projectToScreenCoordinates(rightPoint);

      console.log(
        "Right-click: Anchoring panel at screen position:",
        screenPos.x,
        screenPos.y,
      );

      props.setOpenPanels(() => {
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
    [roi.id, rightPoint, camera, size, setSelected],
  );

  useCursor(hovered, "pointer");

  // Check if this ROI is currently in display structures
  const isDisplayStructure =
    showDisplayStructures && displayStructures.includes(roi.id);


  if (!roiZValues.includes(z)) return null;
  if (!vertices.at(0)) return null;
  if (roi.kind == RoiKind.Rectangle) {
    return (
      <>
        <mesh
          ref={meshRef}
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
            color={"white"}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={hovered ? 0.5 : 0.2}
            depthWrite={false}
          />
        </mesh>
        <Line
          points={shape.getPoints()}
          color={isDisplayStructure ? "orange" : "blue"}
          lineWidth={2}
        />
      </>
    );
  }

  if (roi.kind == RoiKind.Ellipsis) {
    return (
      <>
        <mesh
          ref={meshRef}
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
            color={"white"}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={hovered ? 0.5 : 0.2}
            depthWrite={false}
          />
        </mesh>
        <Line
          points={shape.getPoints()}
          color={isDisplayStructure ? "orange" : "green"}
          lineWidth={2}
        />
      </>
    );
  }

  if (roi.kind == RoiKind.Line) {
    const linePoints = vertices.map(([x, y]) => new THREE.Vector3(x, y, 0));

    return (
      <>
        <Line
          points={linePoints}
          color={
            isDisplayStructure
              ? hovered
                ? "yellow"
                : "orange"
              : hovered
                ? "orange"
                : "red"
          }
          lineWidth={hovered ? 5 : 3}
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
        />
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
          position={[point[0], point[1], 0]}
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
            color={isDisplayStructure ? "cyan" : "yellow"}
            transparent={true}
            opacity={hovered ? 0.8 : 0.6}
            depthWrite={false}
          />
        </mesh>
        {/* Outer ring for better visibility */}
        <mesh position={[point[0], point[1], 0.1]}>
          <ringGeometry args={[hovered ? 8 : 5, hovered ? 10 : 7, 8]} />
          <meshBasicMaterial
            color={isDisplayStructure ? "blue" : "orange"}
            transparent={true}
            opacity={hovered ? 0.6 : 0.4}
            depthWrite={false}
          />
        </mesh>
      </>
    );
  }

  if (roi.kind == RoiKind.Polygon) {
    return (
      <>
        <mesh
          ref={meshRef}
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
            color={"white"}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={hovered ? 0.5 : 0.2}
            depthWrite={false}
          />
        </mesh>
        <Line
          points={shape.getPoints()}
          color={isDisplayStructure ? "orange" : "purple"}
          lineWidth={2}
        />
      </>
    );
  }

  if (roi.kind == RoiKind.Path) {
    const pathPoints = vertices.map(([x, y]) => new THREE.Vector3(x, y, 0));

    return (
      <>
        <Line
          ref={meshRef}
          points={pathPoints}
          color={
            isDisplayStructure
              ? hovered
                ? "cyan"
                : "orange"
              : hovered
                ? "yellow"
                : "white"
          }
          lineWidth={hovered ? 5 : 3}
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
        />
      </>
    );
  }

  // Default case for Polygon
  return (
    <>
      <mesh
        ref={meshRef}
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
          color={isDisplayStructure ? "orange" : "purple"}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={hovered ? 0.5 : 0.2}
          depthWrite={false}
        />
      </mesh>
      <line>
        <shapeGeometry args={[shape]} />
        <lineBasicMaterial color={isDisplayStructure ? "orange" : "black"} />
      </line>
    </>
  );
};
