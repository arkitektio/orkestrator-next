import { describe, expect, it } from "vitest";
import {
  planarRadius,
  primitiveCornerVectors,
  SPHERE_KIND,
} from "./primitiveDraw";

describe("primitiveCornerVectors", () => {
  it("builds symmetric bounding corners around the center", () => {
    expect(primitiveCornerVectors([10, -4, 2.5], 2)).toEqual([
      [8, -6, 0.5],
      [12, -2, 4.5],
    ]);
  });

  it("collapses to the center at radius 0", () => {
    expect(primitiveCornerVectors([1, 2, 3], 0)).toEqual([
      [1, 2, 3],
      [1, 2, 3],
    ]);
  });

  it("treats a negative radius as its magnitude", () => {
    expect(primitiveCornerVectors([0, 0, 0], -3)).toEqual([
      [-3, -3, -3],
      [3, 3, 3],
    ]);
  });
});

describe("planarRadius", () => {
  it("measures XY distance and ignores z", () => {
    expect(planarRadius([0, 0, 5], [3, 4, -100])).toBe(5);
  });
});

describe("SPHERE_KIND bridge", () => {
  it("is the literal the backend enum will carry", () => {
    // When this fails after a `yarn mikro`, the generated enum has gained
    // Sphere — replace the widened literal with `RoiKind.Sphere` and delete
    // this pin.
    expect(SPHERE_KIND).toBe("SPHERE");
  });
});
