import { describe, expect, it, vi } from "vitest";

import {
  resolveCollectionMatrix,
  type MeshCollectionRef,
  type MeshLayerVariant,
} from "./collectionPlacement";

/**
 * Placement is `pathToWorld` composed through the graph and NOTHING else —
 * no anchor layer, no centering, no flips (COORDINATE_SYSTEMS.md,
 * "Coordinate conventions"). These tests pin the axis-slot mapping and the
 * unregistered degradation.
 */

/** A per-axis scale edge so each axis's matrix slot is distinguishable. */
const SCALE_STEP = {
  transformation: {
    __typename: "ScaleTransformation",
    inputAxes: ["z", "y", "x"],
    outputAxes: ["z", "y", "x"],
    input: { id: "cs:mesh" },
    output: { id: "cs:world" },
    scale: [2, 3, 4], // z=2, y=3, x=4
  },
  inverted: false,
};

const collection = (over: {
  id?: string;
  axes?: string[];
  storeAxes?: string[] | null;
}): MeshCollectionRef =>
  ({
    id: over.id ?? "col:1",
    coordinateSystem: {
      id: "cs:mesh",
      axes: (over.axes ?? ["z", "y", "x"]).map((name) => ({ name })),
    },
    store: { id: "store:1", axes: over.storeAxes ?? null },
  }) as unknown as MeshCollectionRef;

const layerWith = (pathToWorld: unknown): MeshLayerVariant =>
  ({ __typename: "MeshLayer", id: "layer:1", pathToWorld }) as unknown as MeshLayerVariant;

describe("resolveCollectionMatrix", () => {
  it("maps vertex component slots by the store's declared axis order", () => {
    // Slot 0 declared as z: the matrix's x row carries the z scale.
    const m = resolveCollectionMatrix(
      layerWith([SCALE_STEP]),
      collection({ id: "col:declared", storeAxes: ["z", "y", "x"] }),
      {},
    );
    expect(m.elements[0]).toBeCloseTo(2); // x slot ← z axis
    expect(m.elements[5]).toBeCloseTo(3); // y slot ← y axis
    expect(m.elements[10]).toBeCloseTo(4); // z slot ← x axis
  });

  it("falls back to the CS's last three axes reversed, warning once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const col = collection({ id: "col:fallback", storeAxes: null });
      const m = resolveCollectionMatrix(layerWith([SCALE_STEP]), col, {});
      // Last-three-reversed over (z, y, x) puts x in slot 0.
      expect(m.elements[0]).toBeCloseTo(4);
      expect(m.elements[5]).toBeCloseTo(3);
      expect(m.elements[10]).toBeCloseTo(2);
      expect(warn).toHaveBeenCalledTimes(1);

      // Recomputes (identity churn upstream) never warn again.
      resolveCollectionMatrix(layerWith([SCALE_STEP]), col, {});
      expect(warn).toHaveBeenCalledTimes(1);
    } finally {
      warn.mockRestore();
    }
  });

  it("degrades a null path to identity — the collection's own space", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const m = resolveCollectionMatrix(
        layerWith(null),
        collection({ id: "col:unregistered", storeAxes: ["z", "y", "x"] }),
        {},
      );
      expect(m.elements).toEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      expect(warn).toHaveBeenCalledTimes(1);
    } finally {
      warn.mockRestore();
    }
  });
});
