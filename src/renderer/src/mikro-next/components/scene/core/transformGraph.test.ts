import { describe, expect, it } from "vitest";
import {
  composeLayerAffine,
  composePlacementPath,
  evalTransform,
  invert4,
} from "./transformGraph";
import {
  absoluteLevelScale,
  relativeLevelScaleFactors,
} from "./octree/levelGeometry";

/**
 * Fixtures use the reference scene document's own numbers (confocal pyramid
 * with true z factors 1..36, FLIM registration affine), so these tests double
 * as the hand-computed verification of the RFC-5 migration.
 */

const DIMS = ["t", "c", "z", "y", "x"];
const SPATIAL = ["x", "y", "z"] as const;

const level = (lvl: number, scale: number[], translation?: number[]) => ({
  level: lvl,
  toParent:
    translation === undefined
      ? { __typename: "ScaleTransformation", scale }
      : {
          __typename: "SequenceTransformation",
          transformations: [
            { __typename: "ScaleTransformation", scale },
            { __typename: "TranslationTransformation", translation },
          ],
        },
});

describe("evalTransform", () => {
  it("extracts spatial scale in input-axis order", () => {
    const m = evalTransform(
      { __typename: "ScaleTransformation", scale: [100, 1, 0.5, 0.325, 0.325] },
      DIMS,
      DIMS,
      SPATIAL,
    );
    expect(m).not.toBeNull();
    expect(m![0][0]).toBe(0.325); // x
    expect(m![1][1]).toBe(0.325); // y
    expect(m![2][2]).toBe(0.5); // z
    expect(m![0][3]).toBe(0);
  });

  it("composes Sequence children first-to-last (scale then translate)", () => {
    const m = evalTransform(
      level(3, [100, 1, 4.5, 2.6, 2.6], [0, 0, 2.0, 1.1375, 1.1375]).toParent,
      DIMS,
      DIMS,
      SPATIAL,
    )!;
    // voxel (1, 1, 1) → (2.6 + 1.1375, 2.6 + 1.1375, 4.5 + 2.0)
    expect(m[0][0] * 1 + m[0][3]).toBeCloseTo(3.7375);
    expect(m[2][2] * 1 + m[2][3]).toBeCloseTo(6.5);
  });

  it("maps an affine's spatial block by axis name (FLIM registration)", () => {
    // (M) x (N+1) over spatial axes z, y, x — rows outer, last column t.
    const m = evalTransform(
      {
        __typename: "AffineTransformation",
        affine: [
          [1.0, 0.0, 0.0, 0.0],
          [0.0, 0.998, 0.021, 12.4],
          [0.0, -0.021, 0.998, -3.1],
        ],
      },
      ["z", "y", "x"],
      ["z", "y", "x"],
      SPATIAL,
    )!;
    // x row (output x = affine row 2): x' = -0.021·y + 0.998·x - 3.1
    expect(m[0][0]).toBeCloseTo(0.998);
    expect(m[0][1]).toBeCloseTo(-0.021);
    expect(m[0][3]).toBeCloseTo(-3.1);
    // z passes through
    expect(m[2][2]).toBe(1);
    expect(m[2][3]).toBe(0);
  });

  it("returns null for kinds it cannot represent", () => {
    expect(
      evalTransform({ __typename: "DisplacementsTransformation" }, DIMS, DIMS, SPATIAL),
    ).toBeNull();
  });
});

describe("invert4", () => {
  it("inverts an affine scale+translation", () => {
    const m = [
      [2, 0, 0, 10],
      [0, 4, 0, -8],
      [0, 0, 0.5, 3],
      [0, 0, 0, 1],
    ];
    const inv = invert4(m)!;
    expect(inv[0][0]).toBeCloseTo(0.5);
    expect(inv[0][3]).toBeCloseTo(-5);
    expect(inv[1][1]).toBeCloseTo(0.25);
    expect(inv[1][3]).toBeCloseTo(2);
    expect(inv[2][2]).toBeCloseTo(2);
    expect(inv[2][3]).toBeCloseTo(-6);
  });

  it("returns null for singular matrices", () => {
    expect(
      invert4([
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]),
    ).toBeNull();
  });
});

// The calibration-first scene: the world CS, the dataset's intrinsic pixel
// grid, and one calibrated physical system between them.
const SCENE = {
  worldCoordinateSystem: {
    id: "cs:world",
    axes: [{ name: "z" }, { name: "y" }, { name: "x" }],
  },
  coordinateSystems: [
    { id: "cs:intrinsic", axes: [{ name: "t" }, { name: "c" }, { name: "z" }, { name: "y" }, { name: "x" }] },
    { id: "cs:phys", axes: [{ name: "z" }, { name: "y" }, { name: "x" }] },
  ],
  registrations: [],
};

// intrinsic pixels → calibrated µm (the calibration edge)…
const CALIBRATION_STEP = {
  transformation: {
    __typename: "ScaleTransformation",
    input: { id: "cs:intrinsic" },
    output: { id: "cs:phys" },
    scale: [100, 1, 0.5, 0.325, 0.325],
  },
  inverted: false,
};
// …then calibrated → world (the scene registration).
const REGISTRATION_STEP = {
  transformation: {
    __typename: "TranslationTransformation",
    input: { id: "cs:phys" },
    output: { id: "cs:world" },
    translation: [10, 20, 30],
  },
  inverted: false,
};

describe("composePlacementPath", () => {
  it("composes steps first-to-last (calibration then registration)", () => {
    const m = composePlacementPath([CALIBRATION_STEP, REGISTRATION_STEP], SCENE, SPATIAL)!;
    // pixel (1, 0, 0): x' = 1·0.325 + 30
    expect(m[0][0]).toBeCloseTo(0.325);
    expect(m[0][3]).toBeCloseTo(30);
    expect(m[2][2]).toBeCloseTo(0.5);
    expect(m[2][3]).toBeCloseTo(10);
  });

  it("inverts flagged steps (walking an edge output→input)", () => {
    const m = composePlacementPath(
      [{ ...CALIBRATION_STEP, inverted: true }],
      SCENE,
      SPATIAL,
    )!;
    expect(m[0][0]).toBeCloseTo(1 / 0.325); // µm → pixels
    expect(m[2][2]).toBeCloseTo(2);
  });

  it("null path → null; empty path → null (identity)", () => {
    expect(composePlacementPath(null, SCENE, SPATIAL)).toBeNull();
    expect(composePlacementPath([], SCENE, SPATIAL)).toBeNull();
  });

  it("uses self-described inputAxes/outputAxes without any scene CS index", () => {
    // The strict schema: edges carry their own axis order, so the scene
    // context can be EMPTY (the fragment no longer ships coordinateSystems).
    // A rank-bridging registration: (y, x) params applied under a (z, y, x)
    // spatial mapping — unnamed z passes through untouched.
    const steps = [
      {
        transformation: {
          __typename: "ScaleTransformation",
          inputAxes: ["y", "x"],
          outputAxes: ["y", "x"],
          input: { id: "cs:unknown" },
          output: { id: "cs:world" },
          scale: [0.65, 0.325],
        },
        inverted: false,
      },
    ];
    const m = composePlacementPath(steps, {}, SPATIAL)!;
    expect(m[0][0]).toBeCloseTo(0.325); // x
    expect(m[1][1]).toBeCloseTo(0.65); // y
    expect(m[2][2]).toBe(1); // z untouched (not named by the edge)
  });

  it("composite children use their own subset axes (ByDimension)", () => {
    const steps = [
      {
        transformation: {
          __typename: "ByDimensionTransformation",
          inputAxes: ["t", "z", "y", "x"],
          outputAxes: ["t", "z", "y", "x"],
          input: { id: "cs:a" },
          output: { id: "cs:b" },
          transformations: [
            {
              __typename: "TranslationTransformation",
              inputAxes: ["z"],
              outputAxes: ["z"],
              translation: [5],
            },
            {
              __typename: "ScaleTransformation",
              inputAxes: ["y", "x"],
              outputAxes: ["y", "x"],
              scale: [2, 2],
            },
          ],
        },
        inverted: false,
      },
    ];
    const m = composePlacementPath(steps, {}, SPATIAL)!;
    expect(m[2][3]).toBeCloseTo(5); // z translated by the z-only child
    expect(m[0][0]).toBeCloseTo(2); // x scaled by the xy child
    expect(m[2][2]).toBe(1);
  });

  it("degrades unresolvable steps to identity, keeps the rest", () => {
    const m = composePlacementPath(
      [
        { transformation: { __typename: "DisplacementsTransformation" }, inverted: false },
        REGISTRATION_STEP,
      ],
      SCENE,
      SPATIAL,
    )!;
    expect(m[0][0]).toBe(1);
    expect(m[0][3]).toBeCloseTo(30);
  });
});

describe("composeLayerAffine", () => {
  const makeLayer = (opts?: {
    lensToParent?: unknown;
    pathToWorld?: unknown;
    pathStartId?: string;
  }) => ({
    pathToWorld: (opts?.pathToWorld ?? null) as never,
    lens: {
      axisNames: DIMS,
      renderAxes: { x: "x", y: "y", z: "z" },
      coordinateSystem: { id: "cs:lens" },
      toParent: (opts?.lensToParent ?? null) as never,
      dataset: {
        intrinsicSystem: { id: "cs:intrinsic", name: "intrinsic" },
        dataArrays: [
          {
            level: 0,
            coordinateSystem: { id: "cs:intrinsic" },
            // pixel-space pyramid: level 0 → intrinsic is identity
            toParent: { __typename: "IdentityTransformation" },
          },
        ],
      },
    },
  });

  it("prepends the lens crop before an intrinsic-rooted path", () => {
    const layer = makeLayer({
      // Cropped lens: z slices start at 4 → translation on the z axis.
      lensToParent: { __typename: "TranslationTransformation", translation: [0, 0, 4, 0, 0] },
      pathToWorld: [CALIBRATION_STEP, REGISTRATION_STEP],
    });
    const m = composeLayerAffine(SCENE, layer)!;
    // lens voxel (0,0,0) → intrinsic z 4 → physical z 2.0 µm → world z 12.
    expect(m[2][3]).toBeCloseTo(12.0);
    expect(m[0][3]).toBeCloseTo(30);
    expect(m[0][0]).toBeCloseTo(0.325);
  });

  it("skips the local prefix when the path already starts at the lens", () => {
    // The lens CS is not in the scene's axes index, so its edge arrays
    // resolve against the layer's dim order (t, c, z, y, x).
    const lensRootedPath = [
      {
        transformation: {
          __typename: "TranslationTransformation",
          input: { id: "cs:lens" },
          output: { id: "cs:world" },
          translation: [0, 0, 7, 0, 0],
        },
        inverted: false,
      },
    ];
    const layer = makeLayer({
      lensToParent: { __typename: "TranslationTransformation", translation: [0, 0, 4, 0, 0] },
      pathToWorld: lensRootedPath,
    });
    const m = composeLayerAffine(SCENE, layer)!;
    // The crop must NOT be double-applied: only the path's z shift remains.
    expect(m[2][3]).toBeCloseTo(7);
  });

  it("stays in the intrinsic frame for unregistered layers (null path)", () => {
    const layer = makeLayer({
      lensToParent: { __typename: "TranslationTransformation", translation: [0, 0, 4, 0, 0] },
      pathToWorld: null,
    });
    const m = composeLayerAffine(SCENE, layer)!;
    expect(m[2][3]).toBeCloseTo(4); // crop only, pixel units
    expect(m[0][0]).toBe(1);
  });

  it("returns null (identity) when nothing transforms", () => {
    expect(composeLayerAffine({}, makeLayer())).toBeNull();
  });
});

describe("level scale factors from toParent edges", () => {
  it("passes pixel-space scales through unchanged (level 0 = 1)", () => {
    // Calibration-first pyramids: toParent maps level → intrinsic PIXELS, so
    // the scale IS the relative factor and dividing by level 0 is a no-op.
    const dataArrays = [
      level(0, [1, 1, 1, 1, 1]),
      level(1, [1, 1, 2, 2, 2]),
      level(3, [1, 1, 9, 8, 8]),
    ];
    const factors = relativeLevelScaleFactors(dataArrays, DIMS.length);
    expect(factors[0]).toEqual([1, 1, 1, 1, 1]);
    expect(factors[1]).toEqual([1, 1, 2, 2, 2]);
    expect(factors[2]).toEqual([1, 1, 9, 8, 8]);
  });

  it("derives the removed scaleFactors semantics from absolute scales", () => {
    // The reference confocal pyramid: TRUE z factors 1, 2, 4, 9, 18, 36 —
    // NOT the nominal 1, 2, 4, 8, 16, 32 the old relative field claimed.
    // (Physical-scaled level edges — the pre-calibration schema — must keep
    // working: the division by level 0 normalizes them to factors.)
    const dataArrays = [
      level(0, [100, 1, 0.5, 0.325, 0.325]),
      level(1, [100, 1, 1.0, 0.65, 0.65], [0, 0, 0.25, 0.1625, 0.1625]),
      level(2, [100, 1, 2.0, 1.3, 1.3], [0, 0, 0.75, 0.4875, 0.4875]),
      level(3, [100, 1, 4.5, 2.6, 2.6], [0, 0, 2.0, 1.1375, 1.1375]),
      level(4, [100, 1, 9.0, 5.2, 5.2], [0, 0, 4.25, 2.4375, 2.4375]),
      level(5, [100, 1, 18.0, 10.4, 10.4], [0, 0, 8.75, 5.0375, 5.0375]),
    ];
    const factors = relativeLevelScaleFactors(dataArrays, DIMS.length);
    expect(factors[0]).toEqual([1, 1, 1, 1, 1]);
    expect(factors[3]).toEqual([1, 1, 9, 8, 8]);
    expect(factors[5]).toEqual([1, 1, 36, 32, 32]);
  });

  it("treats identity / pure-translation edges as unscaled", () => {
    expect(absoluteLevelScale({ __typename: "IdentityTransformation" }, 3)).toEqual([1, 1, 1]);
    expect(
      absoluteLevelScale({ __typename: "TranslationTransformation", translation: [1, 2, 3] }, 3),
    ).toEqual([1, 1, 1]);
  });

  it("memoizes on the dataArrays array identity (warm replan path)", () => {
    const dataArrays = [level(0, [1, 1, 1, 1, 1]), level(1, [1, 1, 2, 2, 2])];
    const first = relativeLevelScaleFactors(dataArrays, DIMS.length);
    // Same identity → same output array, no re-parse.
    expect(relativeLevelScaleFactors(dataArrays, DIMS.length)).toBe(first);
    // A structurally equal but NEW array recomputes (fresh fragment).
    const clone = [...dataArrays];
    expect(relativeLevelScaleFactors(clone, DIMS.length)).not.toBe(first);
    expect(relativeLevelScaleFactors(clone, DIMS.length)).toEqual(first);
  });

  it("bails to the shape-ratio fallback for edges it cannot read", () => {
    expect(absoluteLevelScale({ __typename: "AffineTransformation", affine: [[1]] }, 3)).toBeNull();
    expect(absoluteLevelScale(null, 3)).toBeNull();
    const factors = relativeLevelScaleFactors(
      [{ level: 0, toParent: null }, level(1, [1, 1, 2, 2, 2])],
      DIMS.length,
    );
    expect(factors).toEqual([null, null]);
  });
});
