import { describe, expect, it } from "vitest";
import { atlasKindForDtype } from "./atlasFormat";

/**
 * The atlas format MUST match the codec worker's default-fidelity promotion
 * (`lib/zarr/runner/codec-worker.ts`): only unsigned 8-bit stays a Uint8Array
 * (R8); everything else is promoted to Float32Array (R32F).
 */
describe("atlasKindForDtype", () => {
  it("maps unsigned 8-bit to R8", () => {
    expect(atlasKindForDtype("uint8")).toBe("r8");
    expect(atlasKindForDtype("|u1")).toBe("r8");
    expect(atlasKindForDtype("uint8clamped")).toBe("r8");
  });

  it("maps every non-uint8 dtype to R32F (matches float32 promotion)", () => {
    for (const dtype of ["float32", "float64", "uint16", "uint32", "int16", "int32"]) {
      expect(atlasKindForDtype(dtype)).toBe("r32f");
    }
  });

  it("regression: int8 is R32F, not R8 (worker promotes it to a signed Float32Array)", () => {
    // The old `includes("8")` test wrongly routed int8 into a Uint8 R8 atlas,
    // wrapping/truncating its negative values.
    expect(atlasKindForDtype("int8")).toBe("r32f");
    expect(atlasKindForDtype("|i1")).toBe("r32f");
  });
});
