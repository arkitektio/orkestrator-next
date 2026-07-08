import * as THREE from "three";
import { describe, expect, it } from "vitest";
import type { LayerState } from "../layerModel";
import type { LayerViewRange } from "../visibility";
import { resolveBrickSpec } from "./brickSpec";
import { buildLayerLevelGeometry, type LevelSource } from "./levelGeometry";
import { planLayerNodes, sameNodePlan, type NodeCamera } from "./nodePlanning";

const makeLayer = (
  overrides: Partial<{ fixedLOD: number | null; zDim: string | null }> = {},
): LayerState =>
  ({
    id: "layer-1",
    affineMatrix: null,
    xDim: "x",
    yDim: "y",
    zDim: overrides.zDim ?? null,
    intensityDim: "c",
    fixedLOD: overrides.fixedLOD ?? null,
    lens: {
      slices: [],
      dims: overrides.zDim ? ["z", "y", "x", "c"] : ["y", "x", "c"],
      shape: overrides.zDim ? [3, 512, 512, 1] : [512, 512, 1],
      dataset: { dims: overrides.zDim ? ["z", "y", "x", "c"] : ["y", "x", "c"], dataArrays: [] },
    },
  }) as unknown as LayerState;

/** 512² image, 2 levels → 2×2 L0 brick grid, single L1 brick (2D spec 256²). */
const FLAT_LEVELS: LevelSource[] = [
  { shape: [512, 512, 1], chunks: [256, 256, 1], dtype: "uint8", storeId: "s0" },
  { shape: [256, 256, 1], chunks: [256, 256, 1], dtype: "uint8", storeId: "s1", scaleFactors: [2, 2, 1] },
];
const flatGeo = buildLayerLevelGeometry(["y", "x", "c"], makeLayer(), FLAT_LEVELS)!;
const flatSpec = resolveBrickSpec(flatGeo, "2D");

const FULL_VIEW: LayerViewRange = { xRange: [0, 512], yRange: [0, 512], zRange: null, scale: 2 };

const plan2d = (
  overrides: Partial<{
    viewRange: LayerViewRange | undefined;
    layer: LayerState;
    lodBias: number;
    maxPlanBytes: number;
    currentZ: number | undefined;
  }> = {},
) =>
  planLayerNodes({
    layer: overrides.layer ?? makeLayer(),
    geometry: flatGeo,
    spec: flatSpec,
    mode: "2D",
    viewRange: "viewRange" in overrides ? overrides.viewRange : FULL_VIEW,
    camera: null,
    lodBias: overrides.lodBias ?? 1,
    currentZ: overrides.currentZ ?? 0,
    maxPlanBytes: overrides.maxPlanBytes,
  });

const keysByRole = (nodes: { key: string; role: string }[], role: string) =>
  nodes.filter((n) => n.role === role).map((n) => n.key);

describe("planLayerNodes (2D quadtree)", () => {
  it("plans only the coarsest bricks before a view range exists", () => {
    const p = plan2d({ viewRange: undefined });
    expect(p.targetLevel).toBe(1);
    expect(p.nodes.map((n) => `${n.key}:${n.role}`)).toEqual(["1:0:0:0:target"]);
  });

  it("refines to the finest level with the ancestor kept as fallback", () => {
    const p = plan2d();
    expect(p.targetLevel).toBe(0);
    expect(keysByRole(p.nodes, "keep")).toEqual(["1:0:0:0"]);
    expect(keysByRole(p.nodes, "target").sort()).toEqual([
      "0:0:0:0",
      "0:0:1:0",
      "0:1:0:0",
      "0:1:1:0",
    ]);
  });

  it("stays coarse when zoomed out below one pixel per fine voxel", () => {
    const p = plan2d({ viewRange: { ...FULL_VIEW, scale: 0.4 } });
    expect(p.nodes.map((n) => `${n.key}:${n.role}`)).toEqual(["1:0:0:0:target"]);
  });

  it("refines only bricks overlapping the (margin-expanded) view range", () => {
    const p = plan2d({ viewRange: { ...FULL_VIEW, xRange: [0, 100], yRange: [0, 100] } });
    expect(keysByRole(p.nodes, "keep")).toEqual(["1:0:0:0"]);
    expect(keysByRole(p.nodes, "target")).toEqual(["0:0:0:0"]);
  });

  it("suppresses refinement past the byte budget", () => {
    const p = plan2d({ maxPlanBytes: 300_000 }); // < keep(64KB) + 4×256²
    expect(p.nodes.map((n) => `${n.key}:${n.role}`)).toEqual(["1:0:0:0:target"]);
  });

  it("honors fixedLOD regardless of scale", () => {
    const p = plan2d({
      layer: makeLayer({ fixedLOD: 0 }),
      viewRange: { ...FULL_VIEW, scale: 0.4 },
    });
    expect(p.targetLevel).toBe(0);
    expect(keysByRole(p.nodes, "target")).toHaveLength(4);
  });

  it("orders targets center-out", () => {
    const p = plan2d({ viewRange: { ...FULL_VIEW, xRange: [0, 260], yRange: [0, 260] } });
    const targets = keysByRole(p.nodes, "target");
    // View center ≈ (130,130): brick (0,0) is closest.
    expect(targets[0]).toBe("0:0:0:0");
  });
});

describe("planLayerNodes (2D z slabs)", () => {
  const zLevels: LevelSource[] = [
    { shape: [3, 512, 512, 1], chunks: [1, 256, 256, 1], dtype: "uint8", storeId: "s0" },
    { shape: [3, 256, 256, 1], chunks: [1, 256, 256, 1], dtype: "uint8", storeId: "s1", scaleFactors: [1, 2, 2, 1] },
  ];
  const layer = makeLayer({ zDim: "z" });
  const geo = buildLayerLevelGeometry(["z", "y", "x", "c"], layer, zLevels)!;
  const spec = resolveBrickSpec(geo, "2D");

  it("plans bricks of the selected slab only", () => {
    const p = planLayerNodes({
      layer,
      geometry: geo,
      spec,
      mode: "2D",
      viewRange: FULL_VIEW,
      camera: null,
      lodBias: 1,
      currentZ: 2,
    });
    expect(p.slabZ).toBe(2);
    expect(p.nodes.length).toBeGreaterThan(0);
    expect(p.nodes.every((n) => n.coords[2] === 2)).toBe(true);
  });

  it("renders nothing when the slider is outside the stack", () => {
    const p = planLayerNodes({
      layer,
      geometry: geo,
      spec,
      mode: "2D",
      viewRange: FULL_VIEW,
      camera: null,
      lodBias: 1,
      currentZ: 10,
    });
    expect(p.nodes).toEqual([]);
    expect(p.slabZ).toBeNull();
  });
});

describe("planLayerNodes (3D octree)", () => {
  const volLayer = {
    ...makeLayer({ zDim: "z" }),
    lens: {
      slices: [],
      dims: ["z", "y", "x"],
      shape: [256, 256, 256],
      dataset: { dims: ["z", "y", "x"], dataArrays: [] },
    },
  } as unknown as LayerState;
  const volLevels: LevelSource[] = [
    { shape: [256, 256, 256], chunks: [64, 64, 64], dtype: "uint8", storeId: "s0" },
    { shape: [128, 128, 128], chunks: [64, 64, 64], dtype: "uint8", storeId: "s1", scaleFactors: [2, 2, 2] },
  ];
  const geo = buildLayerLevelGeometry(["z", "y", "x"], volLayer, volLevels)!;
  const spec = resolveBrickSpec(geo, "3D"); // 64³ payload → L0 4³, L1 2³

  const VOL_VIEW: LayerViewRange = {
    xRange: [0, 256],
    yRange: [0, 256],
    zRange: [0, 256],
    scale: 1,
  };

  const perspectiveCamera = (position: [number, number, number], viewportHeight: number): NodeCamera => {
    const cam = new THREE.PerspectiveCamera(60, 1, 1, 10000);
    cam.position.set(...position);
    cam.lookAt(128, 128, 128);
    cam.updateMatrixWorld(true);
    cam.updateProjectionMatrix();
    const projScreen = new THREE.Matrix4().multiplyMatrices(
      cam.projectionMatrix,
      cam.matrixWorldInverse,
    );
    return {
      voxelFrustum: new THREE.Frustum().setFromProjectionMatrix(projScreen),
      voxelPosition: position,
      pxPerVoxelAtUnitDistance:
        viewportHeight / (2 * Math.tan(THREE.MathUtils.degToRad(60) / 2)),
    };
  };

  it("ortho: refines uniformly with all ancestors kept", () => {
    const p = planLayerNodes({
      layer: volLayer,
      geometry: geo,
      spec,
      mode: "3D",
      viewRange: VOL_VIEW,
      camera: null,
      lodBias: 1,
      currentZ: undefined,
    });
    expect(keysByRole(p.nodes, "keep")).toHaveLength(8);
    expect(keysByRole(p.nodes, "target")).toHaveLength(64);
    expect(p.targetLevel).toBe(0);
    expect(p.slabZ).toBeNull();
  });

  it("perspective: refines near the camera, keeps distant bricks coarse", () => {
    const p = planLayerNodes({
      layer: volLayer,
      geometry: geo,
      spec,
      mode: "3D",
      viewRange: VOL_VIEW,
      camera: perspectiveCamera([-50, 128, 128], 100),
      lodBias: 1,
      currentZ: undefined,
    });
    const fineTargets = p.nodes.filter((n) => n.role === "target" && n.level === 0);
    const coarseTargets = p.nodes.filter((n) => n.role === "target" && n.level === 1);
    expect(fineTargets.length).toBeGreaterThan(0);
    expect(coarseTargets.length).toBeGreaterThan(0);
    // Only the near half (x bricks 0..1 at L0, from refining L1 x-brick 0) is fine.
    expect(fineTargets.every((n) => n.coords[0] <= 1)).toBe(true);
  });

  it("3D budget degrades refinement instead of overflowing", () => {
    const coarseOnly = planLayerNodes({
      layer: volLayer,
      geometry: geo,
      spec,
      mode: "3D",
      viewRange: VOL_VIEW,
      camera: null,
      lodBias: 1,
      currentZ: undefined,
      maxPlanBytes: 8 * 66 * 66 * 66 + 100_000, // the L1 set, but no child fan-out
    });
    expect(coarseOnly.nodes.every((n) => n.level === 1 && n.role === "target")).toBe(true);
  });
});

describe("sameNodePlan", () => {
  it("is true for identical plans and false when a role flips", () => {
    const a = plan2d();
    const b = plan2d();
    expect(sameNodePlan(a, b)).toBe(true);
    const mutated = { ...b, nodes: b.nodes.map((n, i) => (i === 0 ? { ...n, role: "target" as const } : n)) };
    expect(sameNodePlan(a, mutated)).toBe(false);
  });
});
