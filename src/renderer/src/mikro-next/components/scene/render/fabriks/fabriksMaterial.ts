import * as THREE from "three";
import { MeshStandardNodeMaterial } from "three/webgpu";
import * as TSLTyped from "three/tsl";
import {
  DEFAULT_INSTANCE_COLORMAP,
  GOLDEN_RATIO_CONJUGATE,
  INSTANCE_COLORMAP_SPECS,
  type FabriksInstanceColormap,
  type InstanceColormapSpec,
} from "./instanceColormaps";

// Same escape hatch as brickNodeMaterials.ts: three's TSL TypeScript surface
// lags the runtime API (method chaining on nodes is typed dynamically).
/* eslint-disable @typescript-eslint/no-explicit-any */
const TSL = TSLTyped as any;
const {
  Discard,
  Fn,
  attribute,
  clamp,
  float,
  fract,
  materialColor,
  mix,
  select,
  uniform,
  vec3,
} = TSL;

/**
 * The mesh collection's material: standard PBR shading, per-INSTANCE color as
 * the default, and per-instance SELECTION baked into the same fragment logic.
 *
 * Every vertex carries its object's dense `objectOrdinal` (fabriksDecode) —
 * the categorical id the format was built around — so coloring, highlighting
 * and isolating by instance are each one attribute read in TSL: no LUT, no
 * per-object draw state, identical through the BatchedMesh (the attribute is
 * part of the batch layout).
 *
 * Selection is two UNIFORMS (`selectedOrdinal`, `isolate`) always present in
 * the compiled program: picking or isolating an object mutates `.value` only —
 * never a pipeline rebuild. Which palette applies is a
 * `FabriksInstanceColormap` (`instanceColormaps.ts`); `null` = the material's
 * uniform `color`, read via the TSL `materialColor` accessor so the selection
 * logic wraps BOTH modes.
 *
 * WebGPU-only by design (the scene hard-requires the WebGPU backend), hence
 * a node material rather than `onBeforeCompile` GLSL.
 */

export type FabriksMaterialHandle = {
  material: MeshStandardNodeMaterial;
  uniforms: {
    /** The selected instance's ordinal; -1 = no selection. */
    selectedOrdinal: { value: number };
    /** 1 = draw ONLY the selected instance (isolation); 0 = draw all. */
    isolate: { value: number };
  };
};

/** ordinal → rgb node for one colormap spec. */
const buildInstanceColorNode = (spec: InstanceColormapSpec) => {
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

/** Wrap a base color node with the selection logic (isolate + highlight). */
const composeColorNode = (handle: FabriksMaterialHandle, baseNode: unknown) =>
  Fn(() => {
    const ordinal = attribute("objectOrdinal", "float");
    // Float equality is exact here: ordinals are integers ≤ 2^24 on both sides.
    const selected = ordinal.equal(float(handle.uniforms.selectedOrdinal));
    Discard(float(handle.uniforms.isolate).greaterThan(0.5).and(selected.not()));
    const base = vec3(baseNode);
    // ~35% toward white: the identified object pops without a recompile.
    return select(selected, mix(base, vec3(1.0), 0.35), base);
  })();

export function createFabriksMaterial(): FabriksMaterialHandle {
  const material = new MeshStandardNodeMaterial();
  material.color = new THREE.Color(0.72, 0.72, 0.76);
  material.roughness = 0.85;
  material.metalness = 0.0;
  material.side = THREE.DoubleSide;
  material.flatShading = true; // derivative normals — no normal attribute
  const handle: FabriksMaterialHandle = {
    material,
    uniforms: {
      selectedOrdinal: uniform(-1),
      isolate: uniform(0),
    },
  };
  setInstanceColoring(handle, DEFAULT_INSTANCE_COLORMAP);
  return handle;
}

/**
 * Apply an instance colormap, or `null` for the material's uniform `color`
 * (via the `materialColor` accessor — still a colorNode, so selection logic
 * applies in both modes). The caller owns `needsUpdate` — a colormap change
 * IS a pipeline change; a selection change never is.
 */
export function setInstanceColoring(
  handle: FabriksMaterialHandle,
  colormap: FabriksInstanceColormap | null,
): void {
  const base = colormap ? buildInstanceColorNode(INSTANCE_COLORMAP_SPECS[colormap]) : materialColor;
  handle.material.colorNode = composeColorNode(handle, base);
}
