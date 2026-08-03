import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { contentDistanceAlongRay, orbitDepthAlongRay, resolvePanSpeed } from "./panScale";

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const box = (min: [number, number, number], max: [number, number, number]) =>
  new THREE.Box3(new THREE.Vector3(...min), new THREE.Vector3(...max));

describe("contentDistanceAlongRay", () => {
  it("returns the entry distance of a box ahead of the camera", () => {
    const d = contentDistanceAlongRay(v(0, 0, 10), v(0, 0, -1), [box([-5, -5, -5], [5, 5, 5])], 99);
    expect(d).toBeCloseTo(5, 6);
  });

  it("uses the mid-chord when the camera is INSIDE a box (zoomed into a volume)", () => {
    // Camera at z=2 inside [-5,5]: exit along -z is at t=7 → mid-chord 3.5.
    const d = contentDistanceAlongRay(v(0, 0, 2), v(0, 0, -1), [box([-5, -5, -5], [5, 5, 5])], 99);
    expect(d).toBeCloseTo(3.5, 6);
  });

  it("takes the nearest of several boxes", () => {
    const boxes = [box([-1, -1, -30], [1, 1, -20]), box([-1, -1, -8], [1, 1, -4])];
    expect(contentDistanceAlongRay(v(0, 0, 0), v(0, 0, -1), boxes, 99)).toBeCloseTo(4, 6);
  });

  it("ignores boxes entirely behind the camera", () => {
    const d = contentDistanceAlongRay(v(0, 0, 0), v(0, 0, -1), [box([-1, -1, 5], [1, 1, 8])], 42);
    expect(d).toBe(42);
  });

  it("falls back when the ray misses everything", () => {
    const d = contentDistanceAlongRay(v(0, 0, 0), v(0, 0, -1), [box([10, 10, -5], [12, 12, -4])], 42);
    expect(d).toBe(42);
  });

  it("handles axis-parallel rays that never cross the slab", () => {
    // Ray along -z at x=20: outside the box's x slab, direction.x = 0.
    const d = contentDistanceAlongRay(v(20, 0, 0), v(0, 0, -1), [box([-5, -5, -5], [5, 5, 5])], 7);
    expect(d).toBe(7);
  });

  it("skips empty boxes", () => {
    expect(contentDistanceAlongRay(v(0, 0, 0), v(0, 0, -1), [new THREE.Box3()], 7)).toBe(7);
  });
});

describe("orbitDepthAlongRay", () => {
  it("targets the chord midpoint of a box ahead (dolly can enter the volume)", () => {
    // Camera at z=10 looking -z through [-5,5]: entry t=5, exit t=15 → mid 10.
    const d = orbitDepthAlongRay(v(0, 0, 10), v(0, 0, -1), [box([-5, -5, -5], [5, 5, 5])], 99);
    expect(d).toBeCloseTo(10, 6);
  });

  it("inside a box, targets the midpoint of the REMAINING chord (keeps receding)", () => {
    // Camera at z=2 inside [-5,5]: exit t=7 → mid 3.5. Advancing the camera
    // re-seats the target ahead again, so forward travel never stalls.
    const d = orbitDepthAlongRay(v(0, 0, 2), v(0, 0, -1), [box([-5, -5, -5], [5, 5, 5])], 99);
    expect(d).toBeCloseTo(3.5, 6);
  });

  it("picks the NEAREST box's chord, not the deepest", () => {
    const boxes = [box([-1, -1, -30], [1, 1, -20]), box([-1, -1, -8], [1, 1, -4])];
    // Near box: entry 4, exit 8 → mid 6 (not the far box's 25).
    expect(orbitDepthAlongRay(v(0, 0, 0), v(0, 0, -1), boxes, 99)).toBeCloseTo(6, 6);
  });

  it("falls back to the current target distance on a miss or behind-camera box", () => {
    expect(orbitDepthAlongRay(v(0, 0, 0), v(0, 0, -1), [], 42)).toBe(42);
    expect(
      orbitDepthAlongRay(v(0, 0, 0), v(0, 0, -1), [box([-1, -1, 5], [1, 1, 8])], 42),
    ).toBe(42);
  });
});

describe("resolvePanSpeed", () => {
  it("is 1 when the target already sits at the content depth (stock behavior)", () => {
    expect(resolvePanSpeed(100, 100)).toBe(1);
  });

  it("boosts pan when the orbit radius collapsed below the content depth", () => {
    // The zoomed-in freeze: radius 0.001, content 50 → pan restored 50000×
    // (three multiplies by panSpeed · targetDistance, so the product is the
    // content distance again).
    expect(resolvePanSpeed(50, 0.001)).toBeCloseTo(10_000, 6); // hits the sanity clamp
    expect(resolvePanSpeed(50, 0.01) * 0.01).toBeCloseTo(50, 6);
  });

  it("slows pan when the target is far behind close-up content", () => {
    expect(resolvePanSpeed(2, 200)).toBeCloseTo(0.01, 8);
  });

  it("degenerate inputs fall back to 1", () => {
    expect(resolvePanSpeed(0, 10)).toBe(1);
    expect(resolvePanSpeed(10, 0)).toBe(1);
    expect(resolvePanSpeed(Number.NaN, 10)).toBe(1);
    expect(resolvePanSpeed(10, Number.POSITIVE_INFINITY)).toBe(1);
  });
});
