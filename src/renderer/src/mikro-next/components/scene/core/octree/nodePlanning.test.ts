import * as THREE from "three";
import { describe, expect, it } from "vitest";
import type { LayerState } from "../layerModel";
import type { LayerViewRange } from "../visibility";
import { resolveBrickSpec } from "./brickSpec";
import { buildLayerLevelGeometry, type LevelSource } from "./levelGeometry";
import {
  adjacentSlabBrickZ,
  planLayerNodes,
  sameNodePlan,
  slabLevelZ,
  type NodeCamera,
} from "./nodePlanning";

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

describe("slabLevelZ (planner ↔ shader slab convention)", () => {
  it("floors the base z, NOT the slab center, at non-integer z scales", () => {
    // Real pyramid (38 z slices → 9): scale 38/9 ≈ 4.222. The shader used to
    // sample floor((baseZ + 0.5) / scale), which lands one level texel past
    // the planned brick for slabs like baseZ 8 — the page-table lookup then
    // hits UNMAPPED and silently falls back to a coarser level, flipping as
    // zoom changes the level chain. Planner and shader must both floor the
    // raw base z (makeSampleBrickEx slab mode adds 0.5 only AFTER flooring,
    // to recenter inside the chosen texel).
    const scale = 38 / 9;
    expect(slabLevelZ(8, 1, scale)).toBe(1);
    expect(Math.floor((8 + 0.5) / scale)).toBe(2); // the old shader behavior
    // Half-integer scales hit the same boundary (19 → 9, scale 9.5, baseZ 9).
    expect(slabLevelZ(9, 1, 9.5)).toBe(0);
    expect(Math.floor((9 + 0.5) / 9.5)).toBe(1);
    // Integer scales are unaffected by the convention choice.
    expect(slabLevelZ(150, 1, 32)).toBe(4);
  });
});

describe("adjacentSlabBrickZ (z±1 prefetch targeting)", () => {
  // 38-slice stack, level scale 38/9 ≈ 4.222, 2D payload z = 1: the
  // prefetched brick must be exactly the brick the planner would fetch on a
  // scrub to slabZ ± 1 (same floor chain).
  const scale = 38 / 9;

  it("targets the planner's brick for the neighbor slab", () => {
    // slabZ 8 sits in level brick z 1 (floor(8/4.22)); slab 9 → 2; slab 7 → 1.
    expect(adjacentSlabBrickZ(8, 1, 1, scale, 9, 1, 38)).toBe(2);
    expect(adjacentSlabBrickZ(8, -1, 1, scale, 9, 1, 38)).toBe(1);
    // Multi-slab bricks (payload z 4) coarsen the brick index the same way.
    expect(adjacentSlabBrickZ(8, 1, 1, 1, 38, 4, 38)).toBe(2); // level 0, slab 9 → brick 2
  });

  it("returns null outside the base stack or a truncated level", () => {
    expect(adjacentSlabBrickZ(0, -1, 1, scale, 9, 1, 38)).toBeNull();
    expect(adjacentSlabBrickZ(37, 1, 1, scale, 9, 1, 38)).toBeNull();
    // Truncated pyramid: level covers only z < 2·32 base slices.
    expect(adjacentSlabBrickZ(64, 1, 1, 32, 2, 1, 81)).toBeNull();
    expect(adjacentSlabBrickZ(64, -1, 1, 32, 2, 1, 81)).toBe(1);
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

  it("keeps the slab chain consistent across a deep z-downsampled pyramid", () => {
    // Regression: rounding localZ per level (round(150/32)=5 vs
    // round(150/16)=9, a child of brick 4) picked a coarse root whose
    // children never contained the finer slab, stalling refinement at the
    // coarsest level. Slabs must floor-divide from ONE base z.
    const deepLevels: LevelSource[] = [1, 2, 4, 8, 16, 32].map((s, i) => ({
      shape: [256 / s, 256 / s, 256 / s],
      chunks: [256 / s, 256 / s, i === 0 ? 76 : 256 / s],
      dtype: "float32",
      storeId: `d${i}`,
      scaleFactors: i === 0 ? undefined : [s, s, s],
    }));
    const deepLayer = {
      id: "layer-deep",
      affineMatrix: null,
      xDim: "x",
      yDim: "y",
      zDim: "z",
      intensityDim: null,
      fixedLOD: null,
      lens: {
        slices: [],
        dims: ["z", "y", "x"],
        shape: [256, 256, 256],
        dataset: { dims: ["z", "y", "x"], dataArrays: [] },
      },
    } as unknown as LayerState;
    const deepGeo = buildLayerLevelGeometry(["z", "y", "x"], deepLayer, deepLevels)!;
    const deepSpec = resolveBrickSpec(deepGeo, "2D");

    const p = planLayerNodes({
      layer: deepLayer,
      geometry: deepGeo,
      spec: deepSpec,
      mode: "2D",
      viewRange: { xRange: [0, 256], yRange: [0, 256], zRange: null, scale: 2.84 },
      camera: null,
      lodBias: 1,
      currentZ: 150,
      maxPlanBytes: 128 * 1024 * 1024,
    });

    expect(p.slabZ).toBe(150);
    expect(p.targetLevel).toBe(0);
    expect(keysByRole(p.nodes, "target")).toEqual(["0:0:0:150"]);
    // Ancestor slabs floor-divide from base z 150: 75, 37, 18, 9, 4.
    expect(keysByRole(p.nodes, "keep")).toEqual([
      "5:0:0:4",
      "4:0:0:9",
      "3:0:0:18",
      "2:0:0:37",
      "1:0:0:75",
    ]);
  });

  it("roots below coarse levels that don't cover the slab (truncated pyramid)", () => {
    // Regression, seen live: 81 base slices truncate to z shape 2 at scale
    // 32, so the coarsest level covers only base z < 64. For z=76 the old
    // code clamped to the coarsest level's last slice (wrong z) and its
    // children never contained the finer slab → stuck at lowest resolution.
    // The DFS must instead root at the coarsest level that HAS the slab.
    const spimLevels: LevelSource[] = (
      [
        [2048, 81, 1],
        [1024, 40, 2],
        [512, 20, 4],
        [256, 10, 8],
        [128, 5, 16],
        [64, 2, 32],
      ] as const
    ).map(([xy, z, s], i) => ({
      shape: [z, xy, xy],
      chunks: [Math.min(z, 2), xy, xy],
      dtype: "uint16",
      storeId: `p${i}`,
      scaleFactors: i === 0 ? undefined : [s, s, s],
    }));
    const spimLayer = {
      id: "layer-spim",
      affineMatrix: null,
      xDim: "x",
      yDim: "y",
      zDim: "z",
      intensityDim: null,
      fixedLOD: null,
      lens: {
        slices: [],
        dims: ["z", "y", "x"],
        shape: [81, 2048, 2048],
        dataset: { dims: ["z", "y", "x"], dataArrays: [] },
      },
    } as unknown as LayerState;
    const spimGeo = buildLayerLevelGeometry(["z", "y", "x"], spimLayer, spimLevels)!;
    const spimSpec = resolveBrickSpec(spimGeo, "2D");

    const p = planLayerNodes({
      layer: spimLayer,
      geometry: spimGeo,
      spec: spimSpec,
      mode: "2D",
      viewRange: { xRange: [583, 1465], yRange: [660, 1388], zRange: null, scale: 1.7 },
      camera: null,
      lodBias: 1,
      currentZ: 76,
      maxPlanBytes: 128 * 1024 * 1024,
    });

    expect(p.slabZ).toBe(76);
    expect(p.targetLevel).toBe(0);
    // No node may reference level 5 — it has no data for base z 76.
    expect(p.nodes.some((n) => n.level === 5)).toBe(false);
    // The chain roots at L4 (slab 4 = floor(76/16)) and every level's slab
    // floor-divides from base z 76.
    expect(keysByRole(p.nodes, "keep")).toContain("4:0:0:4");
    const slabForLevel: Record<number, number> = { 0: 76, 1: 38, 2: 19, 3: 9, 4: 4 };
    for (const node of p.nodes) {
      expect(node.coords[2]).toBe(slabForLevel[node.level]);
    }
    expect(p.nodes.filter((n) => n.role === "target").every((n) => n.level === 0)).toBe(true);
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

  it("caps the finest level by visible data volume, not just slot bytes", () => {
    // L0 in full view = 256³ = 16.7 MB of data; a 3 MB share must stay at L1
    // (2.1 MB) even though the screen footprint asks for full resolution —
    // this is what stops plane-chunked datasets from streaming their whole
    // fine level on first view.
    const p = planLayerNodes({
      layer: volLayer,
      geometry: geo,
      spec,
      mode: "3D",
      viewRange: VOL_VIEW,
      camera: null,
      lodBias: 1,
      currentZ: undefined,
      maxPlanBytes: 3_000_000,
    });
    expect(p.targetLevel).toBe(1);
    expect(p.nodes.every((n) => n.level === 1 && n.role === "target")).toBe(true);
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
