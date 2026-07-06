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
