import { describe, expect, it } from "vitest";
import {
  collectDatasetEdges,
  composeCsToWorld,
  composeLayerAffine,
  evalTransform,
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

describe("composeLayerAffine", () => {
  const makeLayer = (edges?: {
    lensToParent?: unknown;
    datasetCsId?: string;
  }) => ({
    lens: {
      dims: DIMS,
      renderAxes: { x: "x", y: "y", z: "z" },
      toParent: (edges?.lensToParent ?? null) as never,
      dataset: {
        coordinateSystem: { id: edges?.datasetCsId ?? "cs:phys", name: "physical" },
        dataArrays: [level(0, [100, 1, 0.5, 0.325, 0.325])],
      },
    },
  });

  it("folds lens crop, level-0 scale and the scene registration into one matrix", () => {
    const scene = {
      worldCoordinateSystem: {
        id: "cs:world",
        axes: [{ name: "z" }, { name: "y" }, { name: "x" }],
      },
      coordinateSystems: [
        { id: "cs:phys", axes: [{ name: "t" }, { name: "c" }, { name: "z" }, { name: "y" }, { name: "x" }] },
      ],
      coordinateTransformations: [
        {
          __typename: "TranslationTransformation",
          input: { id: "cs:phys" },
          output: { id: "cs:world" },
          translation: [0, 0, 10, 20, 30],
        },
      ],
    };
    const layer = makeLayer({
      // Cropped lens: z slices start at 4 → translation on the z axis.
      lensToParent: { __typename: "TranslationTransformation", translation: [0, 0, 4, 0, 0] },
    });
    const m = composeLayerAffine(scene, layer)!;
    // lens voxel (0,0,0) → level0 voxel (z 4) → physical z 2.0 µm → world z 12.
    const z = m[2][0] * 0 + m[2][1] * 0 + m[2][2] * 0 + m[2][3];
    expect(z).toBeCloseTo(12.0);
    // x: 0·0.325 + 30 = 30
    expect(m[0][3]).toBeCloseTo(30);
    expect(m[0][0]).toBeCloseTo(0.325);
  });

  it("walks multi-hop paths through intermediate systems", () => {
    const scene = {
      worldCoordinateSystem: { id: "cs:world", axes: [{ name: "z" }, { name: "y" }, { name: "x" }] },
      coordinateSystems: [
        { id: "cs:phys", axes: [{ name: "t" }, { name: "c" }, { name: "z" }, { name: "y" }, { name: "x" }] },
        { id: "cs:stage", axes: [{ name: "z" }, { name: "y" }, { name: "x" }] },
      ],
      coordinateTransformations: [
        {
          __typename: "TranslationTransformation",
          input: { id: "cs:stage" },
          output: { id: "cs:world" },
          translation: [0, 0, 100],
        },
        {
          __typename: "IdentityTransformation",
          input: { id: "cs:phys" },
          output: { id: "cs:stage" },
        },
      ],
    };
    const m = composeLayerAffine(scene, makeLayer())!;
    expect(m[0][3]).toBeCloseTo(100); // x offset from the stage→world hop
    expect(m[0][0]).toBeCloseTo(0.325);
  });

  it("degrades to the physical frame when no path reaches world", () => {
    const scene = {
      worldCoordinateSystem: { id: "cs:world", axes: [{ name: "x" }] },
      coordinateSystems: [],
      coordinateTransformations: [],
    };
    const m = composeLayerAffine(scene, makeLayer())!;
    // Level-0 scale still applies; no registration.
    expect(m[0][0]).toBeCloseTo(0.325);
    expect(m[0][3]).toBe(0);
  });

  it("returns null (identity) when nothing transforms", () => {
    const layer = {
      lens: {
        dims: DIMS,
        renderAxes: { x: "x", y: "y", z: "z" },
        toParent: null,
        dataset: { coordinateSystem: null, dataArrays: [] },
      },
    };
    expect(composeLayerAffine({}, layer)).toBeNull();
  });
});

describe("composeCsToWorld (mesh / ROI path)", () => {
  it("reaches world through dataset edges gathered from image layers", () => {
    // A mesh collection anchored to labels/0 (array CS): the path to world is
    // labels/0 --(dataArray.toParent, carried by the labels IMAGE layer)-->
    // labels_physical --(scene registration)--> world.
    const scene = {
      worldCoordinateSystem: { id: "cs:world", axes: [{ name: "z" }, { name: "y" }, { name: "x" }] },
      coordinateSystems: [
        { id: "cs:labels0", axes: [{ name: "z" }, { name: "y" }, { name: "x" }] },
        { id: "cs:labelsphys", axes: [{ name: "z" }, { name: "y" }, { name: "x" }] },
      ],
      coordinateTransformations: [
        {
          __typename: "IdentityTransformation",
          input: { id: "cs:labelsphys" },
          output: { id: "cs:world" },
        },
      ],
    };
    const labelsLayer = {
      lens: {
        toParent: null,
        dataset: {
          dataArrays: [
            {
              toParent: {
                __typename: "ScaleTransformation",
                input: { id: "cs:labels0" },
                output: { id: "cs:labelsphys" },
                scale: [1.0, 0.65, 0.65],
              },
            },
          ],
        },
      },
    };
    const edges = collectDatasetEdges([labelsLayer]);
    expect(edges).toHaveLength(1);
    const m = composeCsToWorld(scene, "cs:labels0", ["x", "y", "z"], edges)!;
    expect(m[0][0]).toBeCloseTo(0.65); // x voxel → µm
    expect(m[2][2]).toBeCloseTo(1.0); // z voxel → µm
  });

  it("returns null when unreachable or already world", () => {
    const scene = {
      worldCoordinateSystem: { id: "cs:world", axes: [{ name: "x" }] },
      coordinateTransformations: [],
    };
    expect(composeCsToWorld(scene, "cs:world", ["x", "y", "z"])).toBeNull();
    expect(composeCsToWorld(scene, "cs:orphan", ["x", "y", "z"])).toBeNull();
  });
});

describe("level scale factors from toParent edges", () => {
  it("derives the removed scaleFactors semantics from absolute scales", () => {
    // The reference confocal pyramid: TRUE z factors 1, 2, 4, 9, 18, 36 —
    // NOT the nominal 1, 2, 4, 8, 16, 32 the old relative field claimed.
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
