import { describe, expect, it } from "vitest";
import { layerAnswersProbe, probeAfterPinChange } from "./probeTargeting";

describe("layerAnswersProbe", () => {
  it("lets every layer answer when nothing is pinned", () => {
    expect(layerAnswersProbe(null, "a")).toBe(true);
    expect(layerAnswersProbe(null, "b")).toBe(true);
  });

  it("lets only the pinned layer answer", () => {
    expect(layerAnswersProbe("a", "a")).toBe(true);
    expect(layerAnswersProbe("a", "b")).toBe(false);
  });

  // A pin naming a layer that is gone (deleted while pinned) must not leave
  // every layer answering — the probe goes quiet until the pin is cleared.
  it("is false for all layers when the pin names none of them", () => {
    expect(layerAnswersProbe("gone", "a")).toBe(false);
    expect(layerAnswersProbe("gone", "b")).toBe(false);
  });
});

describe("probeAfterPinChange", () => {
  const probe = { layerId: "a" };

  it("drops a reading the new pin would not have produced", () => {
    expect(probeAfterPinChange(probe, "b")).toBeNull();
  });

  it("keeps a reading the new pin agrees with", () => {
    expect(probeAfterPinChange(probe, "a")).toBe(probe);
  });

  // Unpinning widens what may answer next; it says nothing about what was
  // already read, so the readout stays up.
  it("keeps the reading when the pin is cleared", () => {
    expect(probeAfterPinChange(probe, null)).toBe(probe);
  });

  it("has nothing to drop with no probe", () => {
    expect(probeAfterPinChange(null, "a")).toBeNull();
    expect(probeAfterPinChange(null, null)).toBeNull();
  });
});
