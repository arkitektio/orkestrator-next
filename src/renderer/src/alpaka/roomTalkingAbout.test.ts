import { describe, expect, it } from "vitest";
import { toStructureInput, toStructureInputs } from "./roomTalkingAbout";

// Alpaka's `StructureInput.object` is `Int!`, while the app-level `Structure`
// carries `object.id` as a string. Everything handing a structure to alpaka
// goes through these two, so this is where that boundary is pinned down.
describe("toStructureInput", () => {
  it("coerces a numeric string id to a number", () => {
    expect(
      toStructureInput({ identifier: "@mikro/image", object: { id: "42" } }),
    ).toEqual({ identifier: "@mikro/image", object: 42 });
  });

  it("passes a numeric id through", () => {
    expect(
      toStructureInput({ identifier: "@mikro/image", object: { id: 42 } }),
    ).toEqual({ identifier: "@mikro/image", object: 42 });
  });

  it.each([
    ["a non-numeric id", { id: "abc" }],
    ["a non-integer id", { id: "1.5" }],
    ["an empty id", { id: "" }],
    ["a null id", { id: null }],
    ["a missing object", null],
  ])("rejects %s", (_label, object) => {
    expect(toStructureInput({ identifier: "@mikro/image", object })).toBeNull();
  });
});

describe("toStructureInputs", () => {
  it("keeps the addressable structures and drops the rest", () => {
    expect(
      toStructureInputs([
        { identifier: "@mikro/image", object: { id: "1" } },
        { identifier: "@kraph/graph", object: { id: "not-a-number" } },
        { identifier: "@mikro/folder", object: { id: "3" } },
      ]),
    ).toEqual([
      { identifier: "@mikro/image", object: 1 },
      { identifier: "@mikro/folder", object: 3 },
    ]);
  });

  it("returns an empty list when nothing is addressable", () => {
    expect(
      toStructureInputs([{ identifier: "@kraph/graph", object: { id: "x" } }]),
    ).toEqual([]);
  });
});
