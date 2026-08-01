import { describe, expect, it } from "vitest";
import {
  atlasBytesPerVoxel,
  atlasKindForDtype,
  atlasKindForGeometry,
} from "./atlasFormat";
import type { LayerLevelGeometry } from "./levelGeometry";

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

describe("atlasKindForGeometry (planner ↔ pool slot-byte agreement)", () => {
  const geo = (dtype: string, phasor: boolean): LayerLevelGeometry =>
    ({
      phasorBins: phasor ? 16 : 0,
      slabs: phasor ? [{ kind: "phasor" }] : [{ kind: "channel" }],
      levels: [{ dtype }],
    }) as unknown as LayerLevelGeometry;

  it("keys off the base dtype for plain layers", () => {
    expect(atlasKindForGeometry(geo("uint8", false))).toBe("r8");
    expect(atlasKindForGeometry(geo("uint16", false))).toBe("r32f");
  });

  it("regression: a uint8 PHASOR layer is r32f — the planner sizing it at " +
    "1 B/voxel requested ~4× the slots the pool allocated", () => {
    expect(atlasKindForGeometry(geo("uint8", true))).toBe("r32f");
    expect(atlasBytesPerVoxel("r32f")).toBe(4);
    expect(atlasBytesPerVoxel("r8")).toBe(1);
  });
});
