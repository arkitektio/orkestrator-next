// @vitest-environment jsdom
// (the generated `graphql.ts` enums are runtime values, and importing that
// module pulls in the Apollo hooks barrel, which touches `window` on load)
import { describe, expect, it } from "vitest";

import { createRoiSelectionStore, type SelectedRoi } from "./roiSelectionStore";

const roi = (id: string, layerId: string): SelectedRoi => ({
  id,
  layerId,
  name: id,
  kind: "RECTANGLE" as never,
  systemId: "cs:1",
  axisNames: ["z", "y", "x"],
  vectors: [[0, 0, 0]],
  coordinates: [],
});

/**
 * A selection must not outlive its layer: a selected shape whose layer is
 * gone keeps describing something that is no longer in the scene.
 */
describe("dropLayerSelections", () => {
  it("drops selections belonging to a departed layer", () => {
    const store = createRoiSelectionStore();
    store.getState().replaceSelectedRois([roi("ann:1", "layer:a"), roi("ann:2", "layer:b")]);

    store.getState().dropLayerSelections(["layer:a"]);

    expect(store.getState().selectedRois.map((r) => r.id)).toEqual(["ann:2"]);
  });

  it("drops several layers at once", () => {
    const store = createRoiSelectionStore();
    store
      .getState()
      .replaceSelectedRois([
        roi("ann:1", "layer:a"),
        roi("ann:2", "layer:b"),
        roi("ann:3", "layer:c"),
      ]);

    store.getState().dropLayerSelections(["layer:a", "layer:c"]);

    expect(store.getState().selectedRois.map((r) => r.id)).toEqual(["ann:2"]);
  });

  it("leaves the list untouched when nothing was selected in those layers", () => {
    // Runs on every reconcile that removes a layer, so a no-op must not
    // publish a new array and re-render every selection consumer.
    const store = createRoiSelectionStore();
    store.getState().replaceSelectedRois([roi("ann:1", "layer:a")]);
    const before = store.getState().selectedRois;

    store.getState().dropLayerSelections(["layer:z"]);

    expect(store.getState().selectedRois).toBe(before);
  });

  it("is a no-op on an empty removal list", () => {
    const store = createRoiSelectionStore();
    store.getState().replaceSelectedRois([roi("ann:1", "layer:a")]);

    store.getState().dropLayerSelections([]);

    expect(store.getState().selectedRois).toHaveLength(1);
  });
});
