import * as THREE from "three";
import { CoordFragment } from "../api/graphql";
import { toBase } from "@/lib/quantities";

// Coord x/y/z are `Length` quantity strings ("1 µm"); normalise each to µm.
const coordVector = (coord: CoordFragment): THREE.Vector3 =>
  new THREE.Vector3(
    toBase(coord.x, "length", 0),
    toBase(coord.y, "length", 0),
    toBase(coord.z, "length", 0),
  );

export function interpolateCoords(coords: CoordFragment[], position: number): THREE.Vector3 {
  if (coords.length < 2) return new THREE.Vector3(0, 0, 0);

  const totalLength = coords.slice(1).reduce((sum, coord, i) => {
    const start = coordVector(coords[i]);
    const end = coordVector(coord);
    return sum + start.distanceTo(end);
  }, 0);

  let distance = totalLength * position;
  for (let i = 0; i < coords.length - 1; i++) {
    const start = coordVector(coords[i]);
    const end = coordVector(coords[i + 1]);
    const segmentLength = start.distanceTo(end);

    if (distance <= segmentLength) {
      return start.clone().lerp(end, distance / segmentLength);
    }

    distance -= segmentLength;
  }

  return coordVector(coords[coords.length - 1]);
}
