import * as THREE from "three";
import { NodeMaterial } from "three/webgpu";
import * as TSLTyped from "three/tsl";

// Same dynamic-node discipline as `brickNodeMaterials.ts`: the node GRAPH is
// typed dynamically, the PUBLIC surface (the uniform-node record the layer
// components write to) is hand-typed below.
/* eslint-disable @typescript-eslint/no-explicit-any */
const TSL = TSLTyped as any;
const { Fn, If, clamp, float, max, pow, uniform, uv, vec2, vec3, vec4 } = TSL;

import {
  commonMaterialSettings,
  emitChannelTap,
  emitResolveBrickResidency,
  makeTraversalNodes,
  type TraversalNodesPublic,
  type UniformNodeLike,
} from "./brickNodeMaterials";
import type { LayerBrickPool } from "../residency/brickResidency";
import { INTENSITY_ATLAS_ROW, type IntensityUniformData } from "./intensityUniforms";

/**
 * The compositor for a layer whose recipe shape is DECLARED.
 *
 * **This material computes nothing the general material does not; it computes
 * less of it.** Every value it is handed is produced by the same helpers
 * (`buildIntensityUniformData`, asserted equal to slot 0 of
 * `buildChannelUniformData` in `intensityUniforms.test.ts`), and every piece of
 * traversal is IMPORTED from `brickNodeMaterials` rather than restated:
 * `makeTraversalNodes`, `emitResolveBrickResidency`, `emitChannelTap`,
 * `commonMaterialSettings`. What is different is only what is left out.
 *
 * Left out, and what each cost in the general emitter's innermost region:
 *
 * | Dropped | Cost it carried |
 * |---|---|
 * | `Loop(0..MAX_CHANNELS)` + its `Break` and `Continue` | a loop header and two dynamic branches per fragment |
 * | `chParamsA` / `chParamsB` `uniformArray(vec4 × 16)` | **two of the ~12 WebGPU uniform-buffer bindings per stage** — replaced by four plain `uniform()`s, which pack into three's shared node group and cost none |
 * | the `sourceParams` kind tap and the phasor branch | one texture binding plus a `textureLoad` per slot |
 * | the `cursorParams` binding | one texture binding (and its `DataTexture`, never allocated) |
 * | the blend-mode `If/ElseIf/Else` | two dynamic branches per slot |
 * | `invert` and per-slot `opacity` | a branch and a multiply, both constants here |
 * | the `row` uniform | a one-row atlas puts the row at a compile-time 0.5 |
 *
 * The blend collapse is exact, and `resolveRenderKind` is what makes it so: at
 * ONE slot the general emitter's additive and normal arms both reduce to
 * `color * weight` over a zero-seeded accumulator, while MULTIPLICATIVE seeds
 * to `vec3(1)` and does not — so a multiplicative layer never earns
 * `renderKind === "intensity"` and keeps the general path.
 */
export type IntensityPlaneNodes = TraversalNodesPublic & {
  /** One-row colormap LUT. A tint and a named ramp are both baked into it. */
  colormapAtlas: UniformNodeLike<THREE.Texture>;
  /** The pool's base-native value range — it MOVES on an auto-range pool. */
  minValue: UniformNodeLike<number>;
  maxValue: UniformNodeLike<number>;
  uClimMin: UniformNodeLike<number>;
  uClimMax: UniformNodeLike<number>;
  uGamma: UniformNodeLike<number>;
  /** Atlas-slab index of the single source's channel. */
  uSlab: UniformNodeLike<number>;
  uDesiredLevel: UniformNodeLike<number>;
  uSlabBaseZ: UniformNodeLike<number>;
  uBaseShape: UniformNodeLike<THREE.Vector3>;
};

export type IntensityPlaneBundle = {
  material: NodeMaterial;
  nodes: IntensityPlaneNodes;
};

const makeIntensityNodes = (data: IntensityUniformData): any => ({
  // A shared TextureNode, so a colormap edit swaps the rebuilt atlas via
  // `.value = next` without rebuilding the material — same contract the
  // general material keeps.
  colormapAtlas: TSL.texture(data.atlas),
  minValue: uniform(0, "float"),
  maxValue: uniform(1, "float"),
  uClimMin: uniform(data.climMin, "float"),
  uClimMax: uniform(data.climMax, "float"),
  uGamma: uniform(data.gamma, "float"),
  uSlab: uniform(data.slab, "int"),
});

/**
 * Push fresh uniform data into an existing bundle (no rebuild).
 *
 * The sibling of `updateChannelNodes`, and it adopts the colormap atlas the
 * same way: the material stays bound to one long-lived texture whose CONTENTS
 * are refreshed, because disposing a still-bound texture makes WebGPU sample
 * its default white texture (gray composites).
 */
export function updateIntensityNodes(
  nodes: IntensityPlaneNodes,
  data: IntensityUniformData,
): void {
  const bound = nodes.colormapAtlas.value as THREE.DataTexture | null;
  const next = data.atlas;
  if (bound && bound !== next && bound.image.width === next.image.width) {
    (bound.image.data as Uint8Array).set(next.image.data as Uint8Array);
    bound.needsUpdate = true;
    next.dispose();
  } else if (bound !== next) {
    bound?.dispose();
    nodes.colormapAtlas.value = next;
  }
  nodes.uClimMin.value = data.climMin;
  nodes.uClimMax.value = data.climMax;
  nodes.uGamma.value = data.gamma;
  nodes.uSlab.value = data.slab;
}

/**
 * The scalar transfer, inlined.
 *
 * A straight-line port of `makeChannelNormalize` MINUS the two things
 * `renderKind === "intensity"` rules out: the `chParamsA.element(i)` array read
 * (four plain uniforms instead) and the `invert` branch. The arithmetic — the
 * two clamps, the `max(…, 1e-5)` guards against a degenerate window, the
 * `0.999` ceiling, the `max(gamma, 1e-4)` — is IDENTICAL, deliberately: any
 * difference here would be a colour difference between the two paths, which is
 * exactly what the kill switch exists to bisect and what must never actually
 * happen.
 */
const emitNormalize = (n: any, raw: any) => {
  const baseNorm = clamp(
    float(raw).sub(n.minValue).div(max(float(n.maxValue).sub(n.minValue), 0.00001)),
    0.0,
    1.0,
  );
  const climRange = max(n.uClimMax.sub(n.uClimMin), 0.00001);
  const normalized = clamp(baseNorm.sub(n.uClimMin).div(climRange), 0.0, 0.999).toVar(
    "iNorm",
  );
  normalized.assign(pow(normalized, max(n.uGamma, 0.0001)));
  return normalized;
};

/**
 * 2D plane compositor for a fixed-shape intensity layer.
 *
 * The traversal is byte-for-byte the general plane material's: the same uv →
 * base-voxel mapping (corner-anchored, no flip — COORDINATE_SYSTEMS.md), the
 * same single `emitResolveBrickResidency` with `slabZ`, and nothing resident
 * leaves the accumulator at zero (transparent).
 */
export function createIntensityPlaneMaterial(
  pool: LayerBrickPool,
  dataRange: { minValue: number; maxValue: number },
  data: IntensityUniformData,
): IntensityPlaneBundle {
  const t = makeTraversalNodes(pool, dataRange);
  const n = makeIntensityNodes(data);
  n.minValue.value = dataRange.minValue;
  n.maxValue.value = dataRange.maxValue;

  const uDesiredLevel = uniform(0, "int");
  /** INTEGER base slab z — the slab-mode resolve does the per-level floor +
   * recenter itself (see emitResolveBrickResidency), so no +0.5 here. */
  const uSlabBaseZ = uniform(0, "float");
  const uBaseShape = uniform(new THREE.Vector3(1, 1, 1), "vec3");

  const material = new NodeMaterial();
  commonMaterialSettings(material);
  material.depthTest = false;

  material.fragmentNode = Fn(() => {
    const baseVoxel = vec3(
      uv().x.mul(uBaseShape.x),
      uv().y.mul(uBaseShape.y),
      uSlabBaseZ,
    ).toVar("pxBaseVoxel");

    const accum = vec3(0.0).toVar("accum");

    const resolved = emitResolveBrickResidency(t, baseVoxel, uDesiredLevel, {
      slabZ: true,
    });

    If(resolved.status.greaterThanEqual(0.5), () => {
      const raw = emitChannelTap(t, resolved, n.uSlab, "ch");
      const norm = emitNormalize(n, raw);
      // Additive onto a zero accumulator IS assignment at one slot; per-slot
      // opacity is 1 by construction, so the weight is the normalized value.
      accum.assign(
        n.colormapAtlas.sample(vec2(norm, float(INTENSITY_ATLAS_ROW))).rgb.mul(norm),
      );
    });

    return vec4(accum, 1.0);
  })();

  return {
    material,
    nodes: { ...t, ...n, uDesiredLevel, uSlabBaseZ, uBaseShape } as IntensityPlaneNodes,
  };
}
