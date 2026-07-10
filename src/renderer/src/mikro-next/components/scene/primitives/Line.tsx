import { useEffect, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/webgpu/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { Line2NodeMaterial } from "three/webgpu";
import type { ThreeEvent } from "@react-three/fiber";

type PointLike = THREE.Vector3 | [number, number, number];

export interface LineProps {
  /** Ordered polyline vertices, either Vector3 or [x, y, z] tuples. */
  points: PointLike[];
  color?: THREE.ColorRepresentation;
  /** Screen-space line width in pixels. */
  lineWidth?: number;
  dashed?: boolean;
  dashSize?: number;
  gapSize?: number;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
}

/**
 * WebGPU-native drop-in for drei's `<Line>`.
 *
 * drei's `<Line>` is backed by three-stdlib's `LineMaterial` — a raw WebGL
 * `ShaderMaterial` the WebGPU `NodeBuilder` cannot compile ("Material
 * 'LineMaterial' is not compatible" + an infinite `drawIndexed`). This uses the
 * WebGPU fat-line pair shipped in three 0.184 (`Line2` + `Line2NodeMaterial`),
 * which derives its screen resolution internally from the viewport node — so no
 * resolution tracking is needed here.
 */
export const Line = ({
  points,
  color = "white",
  lineWidth = 1,
  dashed = false,
  dashSize = 3,
  gapSize = 1,
  onClick,
}: LineProps) => {
  const geometry = useMemo(() => new LineGeometry(), []);
  const material = useMemo(() => new Line2NodeMaterial(), []);
  const line = useMemo(() => new Line2(geometry, material), [geometry, material]);

  // Release GPU resources when the line unmounts.
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  // Rebuild the vertex buffer whenever the points change. Layout effect, not
  // passive: the WGSL vertex layout is derived from the geometry's attributes,
  // so the positions must exist before the first frame draws — a bare
  // LineGeometry has no instanceStart/instanceEnd yet and the missing
  // attribute collapses to a scalar 0.0 in the generated shader
  // ("no matching constructor for vec4(abstract-float, abstract-float)").
  useLayoutEffect(() => {
    if (points.length < 2) return; // fewer than 2 points: nothing is rendered
    const flat: number[] = [];
    for (const point of points) {
      if (Array.isArray(point)) {
        flat.push(point[0], point[1], point[2]);
      } else {
        flat.push(point.x, point.y, point.z);
      }
    }
    geometry.setPositions(flat);
    line.computeLineDistances(); // required for dashed rendering
  }, [points, geometry, line]);

  // Sync material appearance.
  useEffect(() => {
    material.color = new THREE.Color(color);
    material.linewidth = lineWidth;
    material.dashed = dashed;
    material.dashSize = dashSize;
    material.gapSize = gapSize;
    material.transparent = dashed; // let discarded gap fragments blend cleanly
    material.needsUpdate = true;
  }, [material, color, lineWidth, dashed, dashSize, gapSize]);

  // Never mount a Line2 whose geometry has no segments: the shader would be
  // built against a geometry without instanceStart/instanceEnd attributes.
  if (points.length < 2) return null;

  return <primitive object={line} onClick={onClick} />;
};
