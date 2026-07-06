import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { buildDimRemapMatrix, computeAxisMemoryOrder } from "./dimRemap";

/**
 * The CPU probe raymarch (core/probeMath.ts) must map a unit-box UVW
 * coordinate onto texture (width, height, depth) exactly like the GLSL
 * `dimRemap` matrix does, otherwise probing and rendering disagree.
 * This pins the two mappings together for every axis permutation.
 */

const PERMUTATIONS: [number, number, number][] = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0], // the standard zyx layout (x fastest, output index 2)
];

// Mirror of the mapping used in marchVolumeTexture.
const cpuTexCoord = (
  dimensionOrder: [number, number, number],
  uvw: THREE.Vector3,
): THREE.Vector3 => {
  const { fastestIdx, middleIdx, slowestIdx } = computeAxisMemoryOrder(dimensionOrder);
  const components = [uvw.x, uvw.y, uvw.z];
  return new THREE.Vector3(
    components[dimensionOrder.indexOf(fastestIdx)] ?? 0,
    components[dimensionOrder.indexOf(middleIdx)] ?? 0,
    components[dimensionOrder.indexOf(slowestIdx)] ?? 0,
  );
};

describe("dimRemap CPU/GPU lockstep", () => {
  const uvw = new THREE.Vector3(0.1, 0.5, 0.9);

  it.each(PERMUTATIONS)("matches the GLSL matrix for order [%i, %i, %i]", (x, y, z) => {
    const order: [number, number, number] = [x, y, z];
    const gpu = uvw.clone().applyMatrix3(buildDimRemapMatrix(order));
    const cpu = cpuTexCoord(order, uvw);

    expect(cpu.x).toBeCloseTo(gpu.x, 10);
    expect(cpu.y).toBeCloseTo(gpu.y, 10);
    expect(cpu.z).toBeCloseTo(gpu.z, 10);
  });

  it("samples box-x for texture width in the standard zyx layout", () => {
    // dims [z, y, x] → dimensionOrder [xPos, yPos, zPos] = [2, 1, 0]:
    // x is the fastest-varying axis and lives on box axis 0.
    const coord = cpuTexCoord([2, 1, 0], uvw);
    expect(coord.x).toBe(uvw.x);
    expect(coord.y).toBe(uvw.y);
    expect(coord.z).toBe(uvw.z);
  });
});
