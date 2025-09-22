import * as THREE from "three";
import { CoordFragment } from "../api/graphql";

export function interpolateCoords(coords: CoordFragment[], position: number): THREE.Vector3 {
  if (coords.length < 2) return new THREE.Vector3(0, 0, 0);

  const totalLength = coords.slice(1).reduce((sum, coord, i) => {
    const start = new THREE.Vector3(coords[i].x, coords[i].y, coords[i].z);
    const end = new THREE.Vector3(coord.x, coord.y, coord.z);
    return sum + start.distanceTo(end);
  }, 0);

  let distance = totalLength * position;
  for (let i = 0; i < coords.length - 1; i++) {
    const start = new THREE.Vector3(coords[i].x, coords[i].y, coords[i].z);
    const end = new THREE.Vector3(coords[i + 1].x, coords[i + 1].y, coords[i + 1].z);
    const segmentLength = start.distanceTo(end);

    if (distance <= segmentLength) {
      return start.clone().lerp(end, distance / segmentLength);
    }

    distance -= segmentLength;
  }

  return new THREE.Vector3(coords[coords.length - 1].x, coords[coords.length - 1].y, coords[coords.length - 1].z);
}