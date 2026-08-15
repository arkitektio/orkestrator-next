import * as THREE from "three";
import { MeshStandardNodeMaterial } from "three/webgpu";
import * as TSLTyped from "three/tsl";
import {
  DEFAULT_INSTANCE_COLORMAP,
  INSTANCE_COLORMAP_SPECS,
  type FabriksInstanceColormap,
  type InstanceColormapSpec,
} from "./instanceColormaps";

// Same escape hatch as brickNodeMaterials.ts: three's TSL TypeScript surface
// lags the runtime API (method chaining on nodes is typed dynamically).
/* eslint-disable @typescript-eslint/no-explicit-any */
const TSL = TSLTyped as any;
const { attribute, clamp, float, fract, mix, vec3 } = TSL;

/**
 * The mesh collection's material: standard PBR shading with per-INSTANCE
 * color as the default.
 *
 * Every vertex carries its object's dense `objectOrdinal` (fabriksDecode) —
 * the categorical id the format was built around — so coloring by instance
 * is one attribute read in TSL: no LUT texture, no per-object draw state,
 * and it works identically through the BatchedMesh (the attribute is part of
 * the batch layout). Which palette is applied is a `FabriksInstanceColormap`
 * (`instanceColormaps.ts`); a layer that declares an explicit `materialColor`
 * opts back into a uniform color (`setInstanceColoring(material, null)`).
 *
 * WebGPU-only by design (the scene hard-requires the WebGPU backend), hence
 * a node material rather than `onBeforeCompile` GLSL.
 */

const GOLDEN_RATIO_CONJUGATE = 0.6180339887498949;

/** ordinal → rgb node for one colormap spec. */
const buildColorNode = (spec: InstanceColormapSpec) => {
  const ordinal = attribute("objectOrdinal", "float");
  const hue = fract(ordinal.mul(float(GOLDEN_RATIO_CONJUGATE)));
  // Standard hue→rgb ramp: clamp(|fract(h + (1, 2/3, 1/3))·6 − 3| − 1, 0, 1).
  const ramp = clamp(
    fract(hue.add(vec3(1.0, 2.0 / 3.0, 1.0 / 3.0))).mul(6.0).sub(3.0).abs().sub(1.0),
    0.0,
    1.0,
  );
  let saturation = float(spec.saturation);
  let value = float(spec.value);
  if (spec.tiered) {
    // s tiers ×{0.7, 0.85, 1.0} by ordinal mod 3, v tiers ×{0.78, 1.0} by
    // mod 2 — six brightness/saturation bands riding the hue scatter.
    saturation = saturation.mul(ordinal.mod(3.0).mul(0.15).add(0.7));
    value = value.mul(ordinal.mod(2.0).mul(0.22).add(0.78));
  }
  return mix(vec3(1.0), ramp, saturation).mul(value);
};

export function createFabriksMaterial(): MeshStandardNodeMaterial {
  const material = new MeshStandardNodeMaterial();
  material.color = new THREE.Color(0.72, 0.72, 0.76);
  material.roughness = 0.85;
  material.metalness = 0.0;
  material.side = THREE.DoubleSide;
  material.flatShading = true; // derivative normals — no normal attribute
  setInstanceColoring(material, DEFAULT_INSTANCE_COLORMAP);
  return material;
}

/**
 * Apply an instance colormap, or `null` for the material's uniform `color`
 * (a null `colorNode` is the node system's "use the material property").
 * The caller owns `needsUpdate` — this IS a pipeline change.
 */
export function setInstanceColoring(
  material: MeshStandardNodeMaterial,
  colormap: FabriksInstanceColormap | null,
): void {
  material.colorNode = colormap ? buildColorNode(INSTANCE_COLORMAP_SPECS[colormap]) : null;
}
