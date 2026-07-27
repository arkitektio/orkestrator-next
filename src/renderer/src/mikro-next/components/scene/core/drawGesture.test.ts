import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  DRAG_THRESHOLD_PX,
  exceedsDragThreshold,
  intersectDrawPlane,
  withinSlop,
} from "./drawGesture";

/**
 * Two invariants:
 *
 * 1. A press-release that didn't really move stays a CLICK, so the two-click
 *    drawing flow survives alongside drag-to-draw.
 * 2. The drawing point comes from intersecting the live ray against the slice
 *    plane — NOT from the event's cached intersection. The parallax test at the
 *    bottom is the whole argument for that, and should stop anyone reverting to
 *    `event.point`.
 */

describe("exceedsDragThreshold", () => {
  it("is false for no movement", () => {
    expect(exceedsDragThreshold({ x: 10, y: 10 }, { x: 10, y: 10 })).toBe(false);
  });

  it("is strictly greater — exactly at the threshold is still a click", () => {
    expect(
      exceedsDragThreshold({ x: 0, y: 0 }, { x: DRAG_THRESHOLD_PX, y: 0 }),
    ).toBe(false);
  });

  it("is true just past the threshold", () => {
    expect(
      exceedsDragThreshold({ x: 0, y: 0 }, { x: DRAG_THRESHOLD_PX + 1, y: 0 }),
    ).toBe(true);
  });

  it("measures diagonally, not per axis", () => {
    // 3-4-5: 5 px of travel, neither axis alone exceeding 4.
    expect(exceedsDragThreshold({ x: 0, y: 0 }, { x: 3, y: 4 }, 4)).toBe(true);
  });
});

describe("withinSlop", () => {
  it("accepts a second click landing on the first", () => {
    expect(withinSlop({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(true);
  });

  it("rejects two quick clicks placed far apart", () => {
    // Without this guard, placing two polygon vertices quickly inside the
    // browser's double-click window finishes the polygon.
    expect(withinSlop({ x: 0, y: 0 }, { x: 40, y: 40 })).toBe(false);
  });
});

/** Ortho-style: straight down the -Z axis from above. */
const topDownRay = (x: number, y: number) =>
  new THREE.Ray(new THREE.Vector3(x, y, 100), new THREE.Vector3(0, 0, -1));

describe("intersectDrawPlane", () => {
  it("lands exactly on the requested plane", () => {
    const target = new THREE.Vector3();
    const hit = intersectDrawPlane(topDownRay(12, -7), 3, target);

    expect(hit).toBe(target); // writes in place, allocates nothing
    expect(target.x).toBeCloseTo(12);
    expect(target.y).toBeCloseTo(-7);
    expect(target.z).toBe(3);
  });

  it("returns null for a ray parallel to the plane", () => {
    const ray = new THREE.Ray(
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(1, 0, 0),
    );
    expect(intersectDrawPlane(ray, 0, new THREE.Vector3())).toBeNull();
  });

  it("returns null when the plane is behind the ray", () => {
    // Pointing up, plane below: t < 0.
    const ray = new THREE.Ray(
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(0, 0, 1),
    );
    expect(intersectDrawPlane(ray, 0, new THREE.Vector3())).toBeNull();
  });

  it("handles a ray that starts below and points up", () => {
    const ray = new THREE.Ray(
      new THREE.Vector3(1, 2, -50),
      new THREE.Vector3(0, 0, 1),
    );
    const target = new THREE.Vector3();
    expect(intersectDrawPlane(ray, 0, target)).not.toBeNull();
    expect(target.z).toBe(0);
  });

  // The regression test for the parallax bug: the old code intersected the hit
  // plane at z≈0.01 and then overwrote z with the slice's z, which silently
  // moved the point sideways under any camera that isn't looking straight down.
  it("gives materially different xy for different planes under a tilted ray", () => {
    const tilted = new THREE.Ray(
      new THREE.Vector3(0, 0, 100),
      new THREE.Vector3(0.5, 0.5, -1).normalize(),
    );

    const near = new THREE.Vector3();
    const far = new THREE.Vector3();
    intersectDrawPlane(tilted, 0.01, near);
    intersectDrawPlane(tilted, 5, far);

    expect(Math.abs(near.x - far.x)).toBeGreaterThan(2);
    expect(Math.abs(near.y - far.y)).toBeGreaterThan(2);
  });

  it("is unaffected by the plane under a top-down ray — why the bug hid in 2D", () => {
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    intersectDrawPlane(topDownRay(4, 9), 0.01, a);
    intersectDrawPlane(topDownRay(4, 9), 5, b);

    expect(a.x).toBeCloseTo(b.x);
    expect(a.y).toBeCloseTo(b.y);
  });
});
