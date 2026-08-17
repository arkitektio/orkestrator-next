import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  boundsCenter,
  placeAnchoredPanel,
  projectToScreen,
  type ScreenPoint,
} from "./selectionAnchor";

const VIEWPORT = { width: 800, height: 600 };

const screen = (): ScreenPoint => ({ x: 0, y: 0, behind: false });

/** The same matrix the projector builds: projection × inverse world. */
const viewProjection = (camera: THREE.Camera): THREE.Matrix4 => {
  camera.updateMatrixWorld(true);
  return new THREE.Matrix4().multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse,
  );
};

describe("projectToScreen", () => {
  it("puts a point on the camera axis at the canvas center", () => {
    const camera = new THREE.PerspectiveCamera(50, VIEWPORT.width / VIEWPORT.height, 0.1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const point = projectToScreen({ x: 0, y: 0, z: 0 }, viewProjection(camera), VIEWPORT, screen());

    expect(point.x).toBeCloseTo(400);
    expect(point.y).toBeCloseTo(300);
    expect(point.behind).toBe(false);
  });

  it("maps +y in world to a SMALLER screen y (NDC is y-up, CSS is y-down)", () => {
    const camera = new THREE.PerspectiveCamera(50, VIEWPORT.width / VIEWPORT.height, 0.1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    const matrix = viewProjection(camera);

    const above = projectToScreen({ x: 0, y: 1, z: 0 }, matrix, VIEWPORT, screen());
    const right = projectToScreen({ x: 1, y: 0, z: 0 }, matrix, VIEWPORT, screen());

    expect(above.y).toBeLessThan(300);
    expect(right.x).toBeGreaterThan(400);
  });

  it("flags a point behind a perspective camera", () => {
    const camera = new THREE.PerspectiveCamera(50, VIEWPORT.width / VIEWPORT.height, 0.1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // Twenty units behind the eye — a rotation away from the selection.
    const point = projectToScreen({ x: 0, y: 0, z: 30 }, viewProjection(camera), VIEWPORT, screen());

    expect(point.behind).toBe(true);
  });

  it("never flags `behind` under an orthographic camera (w is 1)", () => {
    const camera = new THREE.OrthographicCamera(-4, 4, 3, -3, 0.1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const point = projectToScreen({ x: 0, y: 0, z: 40 }, viewProjection(camera), VIEWPORT, screen());

    expect(point.behind).toBe(false);
  });
});

describe("placeAnchoredPanel", () => {
  const place = (anchor: { x: number; y: number }, panel = { width: 200, height: 120 }) =>
    placeAnchoredPanel({ anchor, panel, viewport: VIEWPORT, out: { x: 0, y: 0 } });

  it("sits right-and-below the anchor when there is room", () => {
    expect(place({ x: 100, y: 100 })).toEqual({ x: 114, y: 114 });
  });

  it("flips to the other side rather than overflowing", () => {
    // 780 + 14 + 200 runs past the right edge; 560 + 14 + 120 past the bottom.
    expect(place({ x: 780, y: 560 })).toEqual({ x: 780 - 14 - 200, y: 560 - 14 - 120 });
  });

  it("clamps a flipped placement back inside the margin", () => {
    // Flipping left of x=20 would land at -194; the margin wins.
    const placement = place({ x: 20, y: 590 }, { width: 200, height: 120 });
    expect(placement.y).toBe(590 - 14 - 120);
    expect(placement.x).toBeGreaterThanOrEqual(8);
  });

  it("pins a panel larger than the canvas to the top-left margin", () => {
    expect(place({ x: 400, y: 300 }, { width: 1000, height: 900 })).toEqual({ x: 8, y: 8 });
  });
});

describe("boundsCenter", () => {
  it("returns null for no points", () => {
    expect(boundsCenter([])).toBeNull();
  });

  it("centers the axis-aligned bounds, not the mean", () => {
    // Three points bunched at x=0 and one at x=10: the mean is 2.5, the
    // bounds center is 5 — the middle of the shape, which is what anchors.
    const center = boundsCenter([
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 2, z: 0 },
      { x: 0, y: 4, z: 0 },
      { x: 10, y: 4, z: 6 },
    ]);
    expect(center).toEqual({ x: 5, y: 2, z: 3 });
  });
});
