import { MikroROI } from "@/linkers";
import { ListRoiFragment, RoiKind, useDeleteRoiMutation } from "@/mikro-next/api/graphql";
import { useCursor, Line } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { PassThroughProps } from "../TwoDThree";

const convertToThreeJSCoords = (
  vertices: [number, number, number, number, number][],
  imageWidth: number,
  imageHeight: number,
): [number, number][] => {
  console.log(vertices);
  let tr = vertices.map((v) => {
    console.log(v);
    let [c, t, z, y, x] = v;
    return [-(x - imageWidth / 2), y - imageHeight / 2] as [number, number];
  });
  console.log(tr);
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
  const { camera, gl, size } = useThree();
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const [deleteRoi] = useDeleteRoiMutation();

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
      if (meshRef.current && !meshRef.current.userData.contains?.(event.target)) {
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

  if (!vertices.at(0)) return null;

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

      // Set this ROI as selected for deletion
      setSelected(true);

      // Project the rightmost point of the ROI to screen coordinates
      const screenPos = projectToScreenCoordinates(rightPoint);

      // Add the offset to position the panel to the right

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
    [roi.id, rightPoint, camera, size, setSelected],
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
        <Line points={shape.getPoints()} color="blue" lineWidth={2} />
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
        <Line points={shape.getPoints()} color="green" lineWidth={2} />
      </>
    );
  }

  if (roi.kind == RoiKind.Line) {
    const linePoints = vertices.map(([x, y]) => new THREE.Vector3(x, y, 0));

    return (
      <>
        <Line
          points={linePoints}
          color={hovered ? "orange" : "red"}
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
            color="yellow"
            transparent={true}
            opacity={hovered ? 0.8 : 0.6}
            depthWrite={false}
          />
        </mesh>
        {/* Outer ring for better visibility */}
        <mesh position={[point[0], point[1], 0.1]}>
          <ringGeometry args={[hovered ? 8 : 5, hovered ? 10 : 7, 8]} />
          <meshBasicMaterial
            color="orange"
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
        <line width={100}>
          <shapeGeometry args={[shape]} />
          <lineBasicMaterial color="black" linewidth={100} />
        </line>
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
          color={hovered ? "yellow" : "white"}
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
          color={"purple"}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={hovered ? 0.5 : 0.2}
          depthWrite={false}
        />
      </mesh>
      <line>
        <shapeGeometry args={[shape]} />
        <lineBasicMaterial color="black" />
      </line>
    </>
  );
};
