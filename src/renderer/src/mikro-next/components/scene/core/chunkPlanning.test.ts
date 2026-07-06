import { describe, expect, it } from "vitest";
import {
  planLayerChunks,
  sameChunkPlan,
  type LayerChunkPlan,
  type PlanLevel,
} from "./chunkPlanning";
import type { LayerState } from "./layerModel";
import type { LayerViewRange } from "./visibility";
import type { ZarrStore } from "../zarr/zarr_stores/type";

/**
 * Fixture: a 2-level pyramid, dims [y, x, c].
 *  - Level 0: 512×512, 256-chunks → 2×2 target grid (keys "0-<cy>/<cx>/0")
 *  - Level 1: 256×256, one chunk (key "1-0/0/0"), scaleFactors [2, 2, 1]
 */
const LAYER_ID = "layer-1";

const makeLayer = (overrides: Partial<{ fixedLOD: number | null }> = {}): LayerState =>
  ({
    id: LAYER_ID,
    affineMatrix: null,
    xDim: "x",
    yDim: "y",
    zDim: null,
    intensityDim: "c",
    colormap: null,
    color: null,
    fixedLOD: overrides.fixedLOD ?? null,
    lens: {
      slices: [],
      dataset: { dims: ["y", "x", "c"], dataArrays: [] },
    },
  }) as unknown as LayerState;

const fakeStore = {} as ZarrStore;

const LEVELS: PlanLevel[] = [
  { shape: [512, 512, 1], chunks: [256, 256, 1], dtype: "float32", store: fakeStore },
  { shape: [256, 256, 1], chunks: [256, 256, 1], dtype: "float32", store: fakeStore, scaleFactors: [2, 2, 1] },
];

const FULL_VIEW: LayerViewRange = {
  xRange: [0, 512],
  yRange: [0, 512],
  zRange: null,
  scale: 2, // 2 px per base voxel -> level 0 is the right LOD
};

const plan = (
  overrides: Partial<{
    viewRange: LayerViewRange | undefined;
    renderedChunkKeys: ReadonlySet<string>;
    prevPlan: LayerChunkPlan | null;
    layer: LayerState;
    lodBias: number;
    maxPlanBytes: number;
  }> = {},
) =>
  planLayerChunks({
    layer: overrides.layer ?? makeLayer(),
    levels: LEVELS,
    viewRange: "viewRange" in overrides ? overrides.viewRange : FULL_VIEW,
    lodBias: overrides.lodBias ?? 1,
    currentZ: 0,
    renderedChunkKeys: overrides.renderedChunkKeys ?? new Set(),
    prevPlan: overrides.prevPlan ?? null,
    maxPlanBytes: overrides.maxPlanBytes,
  });

const keysByRole = (p: LayerChunkPlan, role: "target" | "cover") =>
  p.chunks.filter((c) => c.role === role).map((c) => c.chunkKey);

const ALL_TARGET_KEYS = ["0-0/0/0", "0-0/1/0", "0-1/0/0", "0-1/1/0"];

describe("planLayerChunks", () => {
  it("plans only the coarsest level before a view range exists", () => {
    const p = plan({ viewRange: undefined });
    expect(p.targetLod).toBe(1);
    expect(p.chunks.map((c) => c.chunkKey)).toEqual(["1-0/0/0"]);
    expect(p.chunks[0].role).toBe("target");
  });

  it("targets the scale-chosen LOD and backs unrendered targets with the coarsest chunk", () => {
    const p = plan({});
    expect(p.targetLod).toBe(0);
    expect(keysByRole(p, "target").sort()).toEqual(ALL_TARGET_KEYS);
    expect(keysByRole(p, "cover")).toEqual(["1-0/0/0"]);
    // Covers come first (mount = enqueue order; backdrop loads first).
    expect(p.chunks[0].role).toBe("cover");
  });

  it("retires the cover once every target over its area is rendered", () => {
    const p = plan({ renderedChunkKeys: new Set(ALL_TARGET_KEYS) });
    expect(keysByRole(p, "cover")).toEqual([]);
    expect(keysByRole(p, "target").sort()).toEqual(ALL_TARGET_KEYS);
  });

  it("keeps the cover while any overlapped target is still loading", () => {
    const p = plan({ renderedChunkKeys: new Set(ALL_TARGET_KEYS.slice(0, 3)) });
    expect(keysByRole(p, "cover")).toEqual(["1-0/0/0"]);
  });

  it("retains rendered previous-LOD chunks as covers across a LOD switch", () => {
    // Was at the coarse LOD (zoomed out), its chunk is rendered.
    const coarsePlan = plan({ viewRange: { ...FULL_VIEW, scale: 0.1 } });
    expect(coarsePlan.targetLod).toBe(1);

    // Zoom in: LOD 0 becomes the target; the rendered coarse chunk covers.
    const zoomedIn = plan({
      prevPlan: coarsePlan,
      renderedChunkKeys: new Set(["1-0/0/0"]),
    });
    expect(zoomedIn.targetLod).toBe(0);
    expect(keysByRole(zoomedIn, "cover")).toEqual(["1-0/0/0"]);

    // Once the new targets render, the old-LOD cover retires.
    const settled = plan({
      prevPlan: zoomedIn,
      renderedChunkKeys: new Set(["1-0/0/0", ...ALL_TARGET_KEYS]),
    });
    expect(keysByRole(settled, "cover")).toEqual([]);
  });

  it("discards retained covers when the slice signature changes", () => {
    const before = plan({ renderedChunkKeys: new Set(["1-0/0/0"]) });
    const zLayer = {
      ...makeLayer(),
      zDim: "z",
      lens: { slices: [], dataset: { dims: ["y", "x", "c"], dataArrays: [] } },
    } as unknown as LayerState;

    // Different signature (zDim'd layer at a z) -> retention path skipped;
    // covers must come from fresh coarsest enumeration, not prevPlan.
    const after = planLayerChunks({
      layer: zLayer,
      levels: LEVELS,
      viewRange: FULL_VIEW,
      lodBias: 1,
      currentZ: 5,
      renderedChunkKeys: new Set(["1-0/0/0"]),
      prevPlan: before,
    });
    expect(after.sliceSignature).not.toBe(before.sliceSignature);
    expect(keysByRole(after, "cover")).toEqual(["1-0/0/0"]); // re-derived, still valid
  });

  it("converges: replanning with its own output as prevPlan is a fixed point", () => {
    const rendered = new Set(["1-0/0/0", ...ALL_TARGET_KEYS.slice(0, 2)]);
    const first = plan({ renderedChunkKeys: rendered });
    const second = plan({ renderedChunkKeys: rendered, prevPlan: first });
    expect(sameChunkPlan(first, second)).toBe(true);
  });

  it("orders targets center-out from the view rect center", () => {
    const cornerView: LayerViewRange = {
      xRange: [0, 200],
      yRange: [0, 200],
      zRange: null,
      scale: 2,
    };
    const p = plan({ viewRange: cornerView, renderedChunkKeys: new Set(["1-0/0/0"]) });
    // View sits in the top-left; nearest target chunk is (0,0).
    expect(keysByRole(p, "target")[0]).toBe("0-0/0/0");
  });

  it("respects fixedLOD over the scale-derived choice", () => {
    const p = plan({ layer: makeLayer({ fixedLOD: 1 }) });
    expect(p.targetLod).toBe(1);
  });
});

describe("planLayerChunks substitution (finer chunks beat coarse fetches)", () => {
  const ALL_RENDERED = new Set(ALL_TARGET_KEYS);
  const ZOOMED_OUT: LayerViewRange = { ...FULL_VIEW, scale: 0.1 }; // → target LOD 1

  // One 256² float32 chunk ≈ 262 KB at either level of the fixture.
  const CHUNK_BYTES = 256 * 256 * 4;

  const zoomOutFromRenderedFine = (maxPlanBytes?: number) => {
    const finePlan = plan({ renderedChunkKeys: ALL_RENDERED }); // LOD 0, 4 rendered targets
    return plan({
      viewRange: ZOOMED_OUT,
      prevPlan: finePlan,
      renderedChunkKeys: ALL_RENDERED,
      maxPlanBytes,
    });
  };

  it("keeps rendered fine chunks instead of fetching the coarse target", () => {
    const p = zoomOutFromRenderedFine();
    expect(p.targetLod).toBe(1);
    expect(keysByRole(p, "substitute").sort()).toEqual(ALL_TARGET_KEYS);
    expect(keysByRole(p, "target")).toEqual([]); // nothing left to fetch
    expect(keysByRole(p, "cover")).toEqual([]);
  });

  it("falls back to fetching the coarse target when the byte budget is exceeded", () => {
    // Keeping 4 fine chunks (~1 MB) instead of 1 coarse (~262 KB) busts 500 KB.
    const p = zoomOutFromRenderedFine(500_000);
    expect(keysByRole(p, "substitute")).toEqual([]);
    expect(keysByRole(p, "target")).toEqual(["1-0/0/0"]);
    // The fine chunks still bridge the gap as ordinary covers.
    expect(keysByRole(p, "cover").sort()).toEqual(ALL_TARGET_KEYS);
    expect(4 * CHUNK_BYTES).toBeGreaterThan(500_000);
  });

  it("requires full tiling — a partially rendered area is not substituted", () => {
    const threeRendered = new Set(ALL_TARGET_KEYS.slice(0, 3));
    const finePlan = plan({ renderedChunkKeys: threeRendered });
    const p = plan({ viewRange: ZOOMED_OUT, prevPlan: finePlan, renderedChunkKeys: threeRendered });

    expect(keysByRole(p, "substitute")).toEqual([]);
    expect(keysByRole(p, "target")).toEqual(["1-0/0/0"]);
    expect(keysByRole(p, "cover").sort()).toEqual(ALL_TARGET_KEYS.slice(0, 3));
  });

  it("is a fixed point across replans", () => {
    const substitutedPlan = zoomOutFromRenderedFine();
    const replanned = plan({
      viewRange: ZOOMED_OUT,
      prevPlan: substitutedPlan,
      renderedChunkKeys: ALL_RENDERED,
    });
    expect(sameChunkPlan(substitutedPlan, replanned)).toBe(true);
  });

  it("makes zooming back in free — substitutes become plain targets", () => {
    const substitutedPlan = zoomOutFromRenderedFine();
    const zoomedIn = plan({ prevPlan: substitutedPlan, renderedChunkKeys: ALL_RENDERED });

    expect(zoomedIn.targetLod).toBe(0);
    expect(keysByRole(zoomedIn, "target").sort()).toEqual(ALL_TARGET_KEYS);
    expect(keysByRole(zoomedIn, "substitute")).toEqual([]);
    expect(keysByRole(zoomedIn, "cover")).toEqual([]);
  });

  it("never substitutes across a z change (different slice signature)", () => {
    const zLayer = {
      ...makeLayer(),
      zDim: "z",
      lens: { slices: [], dataset: { dims: ["z", "y", "x"], dataArrays: [] } },
    } as unknown as LayerState;
    const zLevels: PlanLevel[] = [
      { shape: [10, 512, 512], chunks: [1, 256, 256], dtype: "float32", store: fakeStore },
      { shape: [10, 256, 256], chunks: [1, 256, 256], dtype: "float32", store: fakeStore, scaleFactors: [1, 2, 2] },
    ];
    const planZ = (currentZ: number, viewRange: LayerViewRange, prevPlan: LayerChunkPlan | null, rendered: ReadonlySet<string>) =>
      planLayerChunks({
        layer: zLayer, levels: zLevels, viewRange, lodBias: 1, currentZ,
        renderedChunkKeys: rendered, prevPlan,
      });

    const fineAtZ0 = planZ(0, FULL_VIEW, null, new Set());
    const renderedZ0 = new Set(fineAtZ0.chunks.map((c) => c.chunkKey));

    const zoomedOutAtZ1 = planZ(1, ZOOMED_OUT, planZ(0, FULL_VIEW, null, renderedZ0), renderedZ0);
    expect(keysByRole(zoomedOutAtZ1, "substitute")).toEqual([]);
    expect(keysByRole(zoomedOutAtZ1, "target")).toEqual(["1-1/0/0/z1"]);
  });
});

describe("planLayerChunks z slicing", () => {
  const zLayer = {
    id: "z-layer",
    affineMatrix: null,
    xDim: "x",
    yDim: "y",
    zDim: "z",
    intensityDim: null,
    colormap: null,
    color: null,
    fixedLOD: null,
    lens: { slices: [], dataset: { dims: ["z", "y", "x"], dataArrays: [] } },
  } as unknown as LayerState;

  const zLevels = (chunkZ: number): PlanLevel[] => [
    { shape: [10, 256, 256], chunks: [chunkZ, 256, 256], dtype: "float32", store: fakeStore },
  ];

  const planAtZ = (currentZ: number, chunkZ: number) =>
    planLayerChunks({
      layer: zLayer,
      levels: zLevels(chunkZ),
      viewRange: undefined,
      lodBias: 1,
      currentZ,
      renderedChunkKeys: new Set(),
      prevPlan: null,
    });

  it("changes chunk identity with z even when one chunk spans all slices", () => {
    // Regression: with chunks [10, 256, 256] the chunk COORDS are identical
    // for every z, so without the z suffix the plan (and thus the displayed
    // texture) never changed when the slider moved.
    const keysAt = (z: number) => planAtZ(z, 10).chunks.map((c) => c.chunkKey);
    expect(keysAt(0)).toEqual(["0-0/0/0/z0"]);
    expect(keysAt(3)).toEqual(["0-0/0/0/z3"]);
  });

  it("encodes z in both coords and key for z-chunked-at-1 data", () => {
    expect(planAtZ(3, 1).chunks.map((c) => c.chunkKey)).toEqual(["0-3/0/0/z3"]);
  });

  it("attaches the slab selection for ChunkPlane", () => {
    const chunk = planAtZ(3, 10).chunks[0];
    expect(chunk.zSelection).toEqual({ axisPosition: 0, levelIndex: 3 });
  });

  it("keeps z-less layers' keys unchanged", () => {
    const p = plan({ viewRange: undefined });
    expect(p.chunks.map((c) => c.chunkKey)).toEqual(["1-0/0/0"]);
    expect(p.chunks[0].zSelection).toBeUndefined();
  });

  it("plans nothing when the scene z is outside this layer's stack", () => {
    // The slider spans the union of all layers; a 10-slice stack must
    // disappear (not clamp to its last slice) when z sits beyond it.
    expect(planAtZ(50, 10).chunks).toEqual([]);
    expect(planAtZ(-5, 1).chunks).toEqual([]);
  });

  it("tolerates half a voxel at the stack edges", () => {
    expect(planAtZ(9.4, 10).chunks.map((c) => c.chunkKey)).toEqual(["0-0/0/0/z9"]);
    expect(planAtZ(9.6, 10).chunks).toEqual([]);
  });
});
