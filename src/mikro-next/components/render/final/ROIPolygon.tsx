import { MikroROI } from "@/linkers";
import { ListRoiFragment, RoiKind } from "@/mikro-next/api/graphql";
import { useCursor } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback, useRef, useState } from "react";
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

const convertFromThreeJSCoords = (
  threeJSVertices: [number, number][],
  imageWidth: number,
  imageHeight: number,
  c: number = 0,
  t: number = 0,
  z: number = 0,
): [number, number, number, number, number][] => {
  return threeJSVertices.map((vertex) => {
    const [threeX, threeY] = vertex;
    // Reverse the transformation: x = -(threeX + imageWidth / 2), y = threeY + imageHeight / 2
    const x = -(threeX - imageWidth / 2);
    const y = threeY + imageHeight / 2;
    return [c, t, z, y, x] as [number, number, number, number, number];
  });
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

      // Project the rightmost point of the ROI to screen coordinates
      const screenPos = projectToScreenCoordinates(rightPoint);

      // Add the offset to position the panel to the right

      console.log(
        "Anchoring panel at screen position:",
        screenPos.x,
        screenPos.y,
      );

      props.setOpenPanels((panels) => {
        const existingPanel = panels.find(
          (p) => p.object === roi.id && p.identifier === MikroROI.identifier,
        );

        if (existingPanel) {
          return panels.filter(
            (p) =>
              !(p.object === roi.id && p.identifier === MikroROI.identifier),
          );
        } else {
          return [
            ...panels,
            {
              positionX: screenPos.x,
              positionY: screenPos.y,
              identifier: MikroROI.identifier,
              object: roi.id,
            },
          ];
        }
      });
    },
    [roi.id, rightPoint, camera, size],
  );

  useCursor(hovered, "pointer");

  if (roi.kind == RoiKind.Polygon) {
    return (
      <>
        <mesh
          ref={meshRef}
          onClick={onClick}
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
        <line>
          <shapeGeometry args={[shape]} />
          <lineBasicMaterial color="black" linewidth={1} />
        </line>
      </>
    );
  }

  if (roi.kind == RoiKind.Path) {
    return (
      <>
        <line
          ref={meshRef}
          onClick={onClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
          }}
        >
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={vertices.length}
              array={new Float32Array(vertices.flatMap(([x, y]) => [x, y, 0]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="white"
            linewidth={3}
            transparent={true}
            opacity={hovered ? 0.5 : 0.2}
            depthWrite={false}
          />
        </line>
      </>
    );
  }

  return (
    <>
      <mesh
        ref={meshRef}
        onClick={onClick}
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
      <line>
        <shapeGeometry args={[shape]} />
        <lineBasicMaterial color="black" linewidth={1} />
      </line>
    </>
  );
};
