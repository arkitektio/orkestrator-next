import { describe, expect, it } from "vitest";
import { repairedSelections } from "./selectionRepair";

const sel = (id: string, layerId: string) => ({ id, layerId });

describe("repairedSelections", () => {
  it("repairs an entry selected before its layer existed", () => {
    // The first-annotation case: the create hook could not name a layer, so
    // the entry went in with "" and the info panel has no matrix to anchor by.
    const repairs = repairedSelections(
      [sel("ann:1", "")],
      [sel("ann:1", "layer:annotations")],
    );

    expect(repairs).toEqual([sel("ann:1", "layer:annotations")]);
  });

  it("returns nothing once the entries agree, so the caller skips the write", () => {
    // Runs on every annotation poll — a repair that never settles would
    // rewrite the selection forever.
    expect(
      repairedSelections([sel("ann:1", "layer:a")], [sel("ann:1", "layer:a")]),
    ).toEqual([]);
  });

  it("ignores annotations this layer does not draw", () => {
    // A scene can carry several annotation layers; each only speaks for its
    // own collection and must not claim another's shapes.
    expect(
      repairedSelections([sel("ann:1", "")], [sel("ann:2", "layer:b")]),
    ).toEqual([]);
  });

  it("never adds to the selection", () => {
    const repairs = repairedSelections(
      [sel("ann:1", "")],
      [sel("ann:1", "layer:a"), sel("ann:2", "layer:a")],
    );

    expect(repairs.map((roi) => roi.id)).toEqual(["ann:1"]);
  });

  it("repairs only the entries that disagree, in selection order", () => {
    const repairs = repairedSelections(
      [sel("ann:1", "layer:a"), sel("ann:2", ""), sel("ann:3", "")],
      [sel("ann:1", "layer:a"), sel("ann:2", "layer:a"), sel("ann:3", "layer:a")],
    );

    expect(repairs.map((roi) => roi.id)).toEqual(["ann:2", "ann:3"]);
  });

  it("short-circuits on empty input", () => {
    expect(repairedSelections([], [sel("ann:1", "layer:a")])).toEqual([]);
    expect(repairedSelections([sel("ann:1", "")], [])).toEqual([]);
  });
});
