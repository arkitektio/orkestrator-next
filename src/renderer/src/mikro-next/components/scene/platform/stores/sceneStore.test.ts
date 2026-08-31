// @vitest-environment jsdom
// The store transitively imports app modules that read `window` at import time.
import { describe, expect, it } from "vitest";
import { createSceneStore } from "./sceneStore";
import { TIME_DIM, type DimExtent } from "../model/dimExtents";
import type { SceneFragment } from "@/mikro-next/api/graphql";

/** The least a scene can be and still build a store: no layers, no world. */
const emptyScene = () =>
  ({
    id: "1",
    preferredView: "TWO_D",
    layers: [],
    worldCoordinateSystem: null,
  }) as unknown as SceneFragment;

const store = () => createSceneStore({ scene: emptyScene() });

const extents = (maxIndex: number): DimExtent[] => [
  { dim: TIME_DIM, maxIndex, defaultIndex: maxIndex },
];

describe("setLayerDimExtents", () => {
  it("stores what a layer published", () => {
    const api = store();
    api.getState().setLayerDimExtents("a", extents(9));
    expect(api.getState().layerDimExtents).toEqual({ a: extents(9) });
  });

  /**
   * The guard `TrackLayerCard` and `DimSliderPanel` depend on. Publishers run
   * this from an effect on every geometry reload and rebuild the array each
   * time; without a STRUCTURAL compare the record would get a fresh identity per
   * reload and re-render every card for a sibling's load (P17).
   */
  it("keeps the same array reference when the published value is unchanged", () => {
    const api = store();
    api.getState().setLayerDimExtents("a", extents(9));
    const first = api.getState().layerDimExtents;
    api.getState().setLayerDimExtents("a", extents(9));
    expect(api.getState().layerDimExtents).toBe(first);
    expect(api.getState().layerDimExtents.a).toBe(first.a);
  });

  it("republishes when the value actually moved", () => {
    const api = store();
    api.getState().setLayerDimExtents("a", extents(9));
    const first = api.getState().layerDimExtents;
    api.getState().setLayerDimExtents("a", extents(10));
    expect(api.getState().layerDimExtents).not.toBe(first);
    expect(api.getState().layerDimExtents.a?.[0].maxIndex).toBe(10);
  });

  it("clears on null — a hidden or unmounted layer keeps no slider alive", () => {
    const api = store();
    api.getState().setLayerDimExtents("a", extents(9));
    api.getState().setLayerDimExtents("a", null);
    expect(api.getState().layerDimExtents).toEqual({});
  });

  it("treats an empty list as a clear, not as an entry offering nothing", () => {
    const api = store();
    api.getState().setLayerDimExtents("a", extents(9));
    api.getState().setLayerDimExtents("a", []);
    expect(api.getState().layerDimExtents).toEqual({});
  });

  it("clearing an absent layer is a no-op, not a republish", () => {
    const api = store();
    const before = api.getState().layerDimExtents;
    api.getState().setLayerDimExtents("nonesuch", null);
    expect(api.getState().layerDimExtents).toBe(before);
  });

  it("keeps layers independent: one publisher does not disturb another", () => {
    const api = store();
    api.getState().setLayerDimExtents("a", extents(9));
    api.getState().setLayerDimExtents("b", extents(4));
    api.getState().setLayerDimExtents("a", null);
    expect(api.getState().layerDimExtents).toEqual({ b: extents(4) });
  });
});
