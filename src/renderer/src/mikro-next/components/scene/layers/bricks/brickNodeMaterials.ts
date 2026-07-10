import * as THREE from "three";
import { NodeMaterial } from "three/webgpu";
import * as TSLTyped from "three/tsl";

// three's TSL TypeScript surface lags the runtime API this module needs
// (int/ivec3 uniforms, node-valued Loop bounds, tuple Fn params, method
// chaining on swizzles). The node GRAPH is typed dynamically; the module's
// PUBLIC surface (the uniform-node records the layer components write to) is
// hand-typed below, and correctness is pinned by runtime/golden verification.
/* eslint-disable @typescript-eslint/no-explicit-any */
const TSL = TSLTyped as any;
const {
  Break,
  Continue,
  Discard,
  Fn,
  If,
  Loop,
  bool,
  clamp,
  distance,
  dot,
  exp,
  float,
  floor,
  fract,
  int,
  ivec3,
  max,
  min,
  mix,
  cameraPosition,
  modelWorldMatrixInverse,
  normalize,
  oneMinus,
  positionGeometry,
  pow,
  screenCoordinate,
  select,
  sign,
  sin,
  texture,
  texture3D,
  uniform,
  uniformArray,
  uv,
  varying,
  vec2,
  vec3,
  vec4,
} = TSL;

// three exports texture3DLoad from Texture3DNode.js but (as of 0.184) does not
// re-export it through the `three/tsl` barrel — recreate its one-liner here.
const texture3DLoad = (...params: any[]) => texture3D(...params).setSampler(false);

/** A TSL uniform node as the layer components see it: a `.value` box. */
export type UniformNodeLike<T> = { value: T };
/** A TSL uniformArray node: elements are mutated in place via `.array`. */
export type UniformArrayNodeLike<T> = { array: T[] };

import { MAX_BRICK_LEVELS } from "../../glsl/brickTraversal";
import type { LayerBrickPool } from "../../managers/brickResidency";
import { MAX_CHANNELS, type ChannelUniformData } from "./channelUniforms";

/**
 * TSL (Three Shading Language) node materials for the brick-pool renderer —
 * the WebGPU-migration port of the raw GLSL that lived in
 * `glsl/brickTraversal.ts`, `glsl/common.ts`, `CHANNEL_UNIFORMS_GLSL` and the
 * two ShaderMaterials. TSL compiles to WGSL on the WebGPU backend and GLSL on
 * the WebGL2 fallback, so this single implementation serves both.
 *
 * Semantics are a 1:1 port — the CPU mirrors (`core/octree/brickSampling.ts`,
 * `core/opacityCorrection.ts`, `core/probeMath.ts` normalization) remain in
 * lockstep. The GLSL `uPickingPass` branch was NOT ported: it was dead code
 * (probing is a CPU march via `sampleResident`).
 *
 * Uniform updates: NodeMaterial has no `.uniforms` record — the returned
 * `nodes` object exposes the uniform nodes; write `nodes.uDesiredLevel.value =
 * …` (and mutate array elements in place for `uniformArray`s).
 */

const MAX_RAY_STEPS = 512;

type Vec3Tuple = readonly [number, number, number];

const v3 = (t: Vec3Tuple | number[]): THREE.Vector3 => new THREE.Vector3(t[0], t[1], t[2]);

/** Public (consumer-facing) shape of the traversal uniform nodes. */
export type TraversalNodesPublic = {
  uNumLevels: UniformNodeLike<number>;
  uPageOffset: UniformArrayNodeLike<THREE.Vector3>;
  uLevelShape: UniformArrayNodeLike<THREE.Vector3>;
  uLevelScale: UniformArrayNodeLike<THREE.Vector3>;
  uBrickPayload: UniformNodeLike<THREE.Vector3>;
  uSlotSize: UniformNodeLike<THREE.Vector3>;
  uChannelSlabDepth: UniformNodeLike<number>;
  uBrickBorder: UniformNodeLike<number>;
  uAtlasTexels: UniformNodeLike<THREE.Vector3>;
  uAtlasScale: UniformNodeLike<number>;
  uEmptyDecodeMin: UniformNodeLike<number>;
  uEmptyDecodeRange: UniformNodeLike<number>;
};

/** Public (consumer-facing) shape of the channel-compositor nodes.
 *
 * The eight per-channel scalars are packed into TWO vec4 uniform arrays —
 * every `uniformArray` is its own uniform buffer binding on the WebGPU
 * backend, and eight of them (plus the traversal arrays and three's internal
 * buffers) blew the 12-uniform-buffers-per-stage device limit. */
export type ChannelNodesPublic = {
  colormapAtlas: UniformNodeLike<THREE.Texture>;
  minValue: UniformNodeLike<number>;
  maxValue: UniformNodeLike<number>;
  numChannels: UniformNodeLike<number>;
  blendMode: UniformNodeLike<number>;
  /** Per channel: x = channel-slab index, y = climMin, z = climMax, w = gamma. */
  chParamsA: UniformArrayNodeLike<THREE.Vector4>;
  /** Per channel: x = opacity, y = visible, z = invert, w = colormap row. */
  chParamsB: UniformArrayNodeLike<THREE.Vector4>;
};

/** Shared traversal uniform nodes for one (layer, mode) pool (node graph —
 * dynamically typed; see module header). */
function makeTraversalNodes(
  pool: LayerBrickPool,
  dataRange: { minValue: number; maxValue: number },
): any {
  const pageOffsets: THREE.Vector3[] = [];
  const levelShapes: THREE.Vector3[] = [];
  const levelScales: THREE.Vector3[] = [];
  for (let i = 0; i < MAX_BRICK_LEVELS; i++) {
    const level = pool.geometry.levels[i];
    const offset = pool.pageTable.layout.levelOffset[i];
    pageOffsets.push(offset ? v3(offset) : new THREE.Vector3());
    levelShapes.push(level ? v3(level.spatialShape) : new THREE.Vector3());
    levelScales.push(level ? v3(level.scale) : new THREE.Vector3(1, 1, 1));
  }

  return {
    pageTable: pool.pageTable.texture,
    brickAtlas: pool.atlas.texture,
    uNumLevels: uniform(Math.min(pool.geometry.levels.length, MAX_BRICK_LEVELS), "int"),
    uPageOffset: uniformArray(pageOffsets, "ivec3"),
    uLevelShape: uniformArray(levelShapes, "ivec3"),
    uLevelScale: uniformArray(levelScales, "vec3"),
    uBrickPayload: uniform(v3(pool.spec.payload), "ivec3"),
    uSlotSize: uniform(v3(pool.atlas.slotSize), "ivec3"),
    uChannelSlabDepth: uniform(pool.spec.stored[2], "int"),
    uBrickBorder: uniform(pool.spec.border, "int"),
    uAtlasTexels: uniform(v3(pool.atlas.size), "vec3"),
    uAtlasScale: uniform(pool.atlas.dataScale, "float"),
    uEmptyDecodeMin: uniform(dataRange.minValue, "float"),
    uEmptyDecodeRange: uniform(dataRange.maxValue - dataRange.minValue, "float"),
  };
}

/** Channel-compositor uniform nodes; arrays are mutated in place on update
 * (node graph — dynamically typed; see module header). */
function makeChannelNodes(data: ChannelUniformData): any {
  const paramsA: THREE.Vector4[] = [];
  const paramsB: THREE.Vector4[] = [];
  for (let i = 0; i < MAX_CHANNELS; i++) {
    paramsA.push(new THREE.Vector4());
    paramsB.push(new THREE.Vector4());
  }
  const nodes = {
    // A shared TextureNode so channel edits can swap the rebuilt colormap
    // atlas via `.value = newAtlas` without rebuilding the material.
    colormapAtlas: texture(data.atlas),
    minValue: uniform(0, "float"),
    maxValue: uniform(1, "float"),
    numChannels: uniform(data.numChannels, "int"),
    blendMode: uniform(data.blendMode, "int"),
    chParamsA: uniformArray(paramsA, "vec4"),
    chParamsB: uniformArray(paramsB, "vec4"),
  };
  copyChannelArrays(nodes, data);
  return nodes;
}

function copyChannelArrays(
  nodes: Pick<ChannelNodesPublic, "chParamsA" | "chParamsB">,
  data: ChannelUniformData,
): void {
  for (let i = 0; i < MAX_CHANNELS; i++) {
    nodes.chParamsA.array[i].set(
      data.channelIndex[i] ?? 0,
      data.climMin[i] ?? 0,
      data.climMax[i] ?? 1,
      data.gamma[i] ?? 1,
    );
    nodes.chParamsB.array[i].set(
      data.opacity[i] ?? 1,
      data.visible[i] ?? 0,
      data.invert[i] ?? 0,
      data.row[i] ?? 0,
    );
  }
}

/** Copy fresh channel data into the existing uniform nodes (no rebuild). */
export function updateChannelNodes(nodes: ChannelNodesPublic, data: ChannelUniformData): void {
  adoptColormapAtlas(nodes, data.atlas);
  nodes.numChannels.value = data.numChannels;
  nodes.blendMode.value = data.blendMode;
  copyChannelArrays(nodes, data);
}

/**
 * Take over a freshly built colormap atlas WITHOUT swapping the bound
 * texture object: same-size updates copy the texel data into the texture the
 * material is already bound to (`needsUpdate` re-upload) and dispose the
 * incoming one.
 *
 * Why not `nodes.colormapAtlas.value = data.atlas` (the previous code)? The
 * layers rebuild the atlas as a NEW DataTexture on every channel-data change
 * and used to dispose the old one — the texture the compiled material was
 * still bound to. On the WebGPU backend that leaves the bind group pointing
 * at a destroyed GPUTexture, which three silently replaces with its default
 * (white) texture: every channel then samples the SAME white tint and an RGB
 * composite collapses to gray. In-place adoption keeps one long-lived
 * texture bound for the material's whole life; only a row-count change (rare:
 * render-graph channel add/remove) swaps the object, disposing the old one
 * AFTER the swap.
 */
function adoptColormapAtlas(nodes: ChannelNodesPublic, atlas: THREE.DataTexture): void {
  const bound = nodes.colormapAtlas.value as THREE.DataTexture;
  if (bound === atlas) return;
  const boundImage = bound.image as { width: number; height: number; data: Uint8Array };
  const nextImage = atlas.image as { width: number; height: number; data: Uint8Array };
  if (boundImage.width === nextImage.width && boundImage.height === nextImage.height) {
    boundImage.data.set(nextImage.data);
    bound.needsUpdate = true;
    atlas.dispose();
  } else {
    nodes.colormapAtlas.value = atlas;
    bound.dispose();
  }
}

/** Node handles produced by `emitResolveBrickResidency`. */
type ResolvedResidency = {
  /** 0 = nothing resident (transparent), 1 = resident, 2 = uniform EMPTY. */
  status: any;
  /** Decoded uniform value when status == 2 (per BRICK — shared by channels). */
  emptyValue: any;
  /** Atlas texel (slot origin + border + in-brick) when status == 1, WITHOUT
   * the channel-slab z offset. Per-channel taps must add the slab offset to a
   * COPY — mutating this shared var would leak offsets across channels. */
  texelBase: any;
};

/**
 * CHANNEL-INDEPENDENT half of `sampleBrickEx` (lockstep with the CPU mirror
 * `BrickResidencyManager.sampleResident`): walk levels desiredLevel→coarsest,
 * page-table `texture3DLoad` per level, stop at the first RESIDENT or EMPTY
 * brick. Everything here — level, brick, slot, EMPTY value — is the same for
 * every channel; only the atlas tap's slab-z differs (`emitChannelTap`).
 * Emitted ONCE per pixel (2D) / per ray step (3D), where it previously ran
 * once PER CHANNEL: the hoist saves (numChannels−1) × levelsWalked page-table
 * loads per pixel/step (×512 steps in 3D).
 *
 * Deliberately a plain JS helper that emits nodes into the CURRENT scope, not
 * a TSL `Fn`: (a) it needs multiple outputs, and (b) TSL inlines Fn bodies —
 * an unnamed internal Loop iterator (default `i`) once SHADOWED the caller's
 * channel loop and made inlined `element(i)` arguments index by resident
 * LEVEL instead of channel (channel flipped with zoom). The walk Loop stays
 * explicitly named `sbLvl`; never pass loop-dependent expressions into
 * inlined Fns without `.toVar()` first.
 *
 * `slabZ` (2D plane material only): `baseVoxel.z` is the INTEGER base slab
 * index, and the level z is picked with the planner's floor chain
 * (`nodePlanning.slabLevelZ`: floor(baseZ / scale), then +0.5 to recenter
 * inside the chosen level texel). Sampling floor((baseZ + 0.5) / scale)
 * instead disagrees with the planner at non-integer z scales (scale 4.22,
 * baseZ 8: planner fetched z=1, shader read z=2) — the lookup lands on an
 * UNMAPPED entry and silently falls back to a coarser level, flipping with
 * zoom.
 */
function emitResolveBrickResidency(
  t: any,
  baseVoxel: any,
  desiredLevel: any,
  opts?: { slabZ?: boolean },
): ResolvedResidency {
  const status = float(0.0).toVar("resStatus");
  const emptyValue = float(0.0).toVar("resEmptyValue");
  const texelBase = vec3(0.0).toVar("resTexelBase");

  Loop(
    { start: int(0), end: t.uNumLevels, type: "int", condition: "<", name: "sbLvl" },
    ({ sbLvl }: any) => {
      If(int(sbLvl).lessThan(desiredLevel), () => {
        Continue();
      });

      const levelScale = vec3(t.uLevelScale.element(sbLvl)).toVar();
      const levelShape = vec3(t.uLevelShape.element(sbLvl)).toVar();
      const scaledVoxel = vec3(baseVoxel).div(levelScale).toVar();
      if (opts?.slabZ) {
        scaledVoxel.z.assign(floor(scaledVoxel.z).add(0.5));
      }
      const levelVoxel = clamp(
        scaledVoxel,
        vec3(0.0),
        levelShape.sub(0.5001),
      ).toVar();
      const brick = ivec3(floor(levelVoxel.div(vec3(t.uBrickPayload)))).toVar();
      // texture3DLoad, NOT textureLoad: the plain TSL textureLoad builds a 2D
      // TextureNode whose fetch coords collapse to ivec2 — invalid WGSL for a
      // texture_3d. Entry components are rgba8unorm floats; decode bytes with
      // round(v * 255).
      const entry = vec4(
        texture3DLoad(t.pageTable, ivec3(t.uPageOffset.element(sbLvl)).add(brick)),
      ).toVar();
      const flag = int(entry.a.mul(255.0).add(0.5)).toVar();

      // EMPTY: uniform-fill brick, value 8-bit-encoded in R (P11).
      If(flag.equal(int(2)), () => {
        status.assign(2.0);
        emptyValue.assign(float(t.uEmptyDecodeMin).add(entry.r.mul(t.uEmptyDecodeRange)));
        Break();
      });

      // RESIDENT: base atlas texel at slot origin + border + in-brick offset.
      // The channel-slab z offset is applied per channel in emitChannelTap.
      If(flag.equal(int(1)), () => {
        const inBrick = levelVoxel.sub(vec3(brick.mul(t.uBrickPayload)));
        const slot = ivec3(entry.xyz.mul(255.0).add(0.5));
        status.assign(1.0);
        texelBase.assign(
          vec3(slot.mul(t.uSlotSize)).add(float(t.uBrickBorder)).add(inBrick),
        );
        Break();
      });
    },
  );

  return { status, emptyValue, texelBase };
}

/**
 * Per-channel half of the sample: the raw value for one channel slab of an
 * already-resolved residency. Callers guard on `status >= 0.5` before the
 * channel loop; here EMPTY yields the shared uniform value, RESIDENT taps the
 * channel's slab. Emitted inside the channel loop — `slabIndex` must be a
 * `.toVar()` (loop-dependent).
 */
function emitChannelTap(t: any, resolved: ResolvedResidency, slabIndex: any): any {
  const raw = float(0.0).toVar("chRaw");
  If(resolved.status.greaterThan(1.5), () => {
    raw.assign(resolved.emptyValue);
  }).Else(() => {
    // COPY texelBase — addAssign on the shared var would leak this channel's
    // slab offset into the next channel's tap.
    const texel = vec3(resolved.texelBase).toVar("chTexel");
    texel.z.addAssign(float(int(slabIndex).mul(t.uChannelSlabDepth)));
    raw.assign(texture3D(t.brickAtlas, texel.div(t.uAtlasTexels)).r.mul(t.uAtlasScale));
  });
  return raw;
}

/** TSL port of `channelNormalize` (lockstep with core mirrors). */
function makeChannelNormalize(c: any) {
  return Fn(([i, rawValue]: any[]) => {
    const paramsA = vec4(c.chParamsA.element(i)).toVar(); // (channel, climMin, climMax, gamma)
    const baseNorm = clamp(
      float(rawValue)
        .sub(c.minValue)
        .div(max(float(c.maxValue).sub(c.minValue), 0.00001)),
      0.0,
      1.0,
    );
    const climMin = paramsA.y;
    const climRange = max(paramsA.z.sub(climMin), 0.00001);
    const normalized = clamp(baseNorm.sub(climMin).div(climRange), 0.0, 0.999).toVar();
    normalized.assign(pow(normalized, max(paramsA.w, 0.0001)));
    If(vec4(c.chParamsB.element(i)).z.greaterThan(0.5), () => {
      normalized.assign(oneMinus(normalized));
    });
    return normalized;
  });
}

/** GLSL_RAND port — same constants, motion-invariant jitter source. */
const rand2 = Fn(([co]: any[]) => {
  return fract(
    sin(dot(vec2(co), vec2(12.9898, 78.233))).mul(43758.5453),
  );
});

const commonMaterialSettings = (material: NodeMaterial) => {
  material.transparent = true;
  material.blending = THREE.AdditiveBlending;
  material.depthWrite = false;
  material.lights = false;
  // Parity with the raw-GLSL ShaderMaterials this port replaces: their
  // FragColor bypassed tone mapping entirely; keep the additive compositing
  // values untouched by the renderer's output transform.
  material.toneMapped = false;
};

// ---------------------------------------------------------------------------
// 2D plane compositor
// ---------------------------------------------------------------------------

export type PlaneMaterialNodes = TraversalNodesPublic &
  ChannelNodesPublic & {
    uDesiredLevel: UniformNodeLike<number>;
    uSlabBaseZ: UniformNodeLike<number>;
    uBaseShape: UniformNodeLike<THREE.Vector3>;
  };

export type PlaneMaterialBundle = { material: NodeMaterial; nodes: PlaneMaterialNodes };

export function createPlaneNodeMaterial(
  pool: LayerBrickPool,
  dataRange: { minValue: number; maxValue: number },
  channelData: ChannelUniformData,
): PlaneMaterialBundle {
  const t = makeTraversalNodes(pool, dataRange);
  const c = makeChannelNodes(channelData);
  c.minValue.value = dataRange.minValue;
  c.maxValue.value = dataRange.maxValue;
  const channelNormalize = makeChannelNormalize(c);

  const uDesiredLevel = uniform(0, "int");
  /** INTEGER base slab z — the slab-mode resolve does the per-level floor +
   * recenter itself (see emitResolveBrickResidency), so no +0.5 here. */
  const uSlabBaseZ = uniform(0, "float");
  const uBaseShape = uniform(new THREE.Vector3(1, 1, 1), "vec3");

  const material = new NodeMaterial();
  commonMaterialSettings(material);
  material.depthTest = false;

  material.fragmentNode = Fn(() => {
    // Quad uv → base voxel space (voxel y grows downward).
    const baseVoxel = vec3(
      uv().x.mul(uBaseShape.x),
      oneMinus(uv().y).mul(uBaseShape.y),
      uSlabBaseZ,
    ).toVar("pxBaseVoxel");

    const accum = select(
      int(c.blendMode).equal(1),
      vec3(1.0),
      vec3(0.0),
    ).toVar("accum");

    // Residency is channel-independent: resolve ONCE per pixel, tap per
    // channel. Nothing resident → transparent (accum stays initial).
    const resolved = emitResolveBrickResidency(t, baseVoxel, uDesiredLevel, {
      slabZ: true,
    });

    If(resolved.status.greaterThanEqual(0.5), () => {
      Loop(
        { start: int(0), end: int(MAX_CHANNELS), type: "int", condition: "<", name: "ch" },
        ({ ch }: any) => {
          If(int(ch).greaterThanEqual(c.numChannels), () => {
            Break();
          });
          const paramsB = vec4(c.chParamsB.element(ch)).toVar(); // (opacity, visible, invert, row)
          If(paramsB.y.lessThan(0.5), () => {
            Continue();
          });

          const slabIndex = int(vec4(c.chParamsA.element(ch)).x).toVar();
          const raw = emitChannelTap(t, resolved, slabIndex);

          const normalized = float(channelNormalize(ch, raw)).toVar();
          const color = c.colormapAtlas.sample(vec2(normalized, paramsB.w)).rgb;
          const weight = paramsB.x.mul(normalized);

          If(int(c.blendMode).equal(1), () => {
            accum.mulAssign(mix(vec3(1.0), color, weight));
          })
            .ElseIf(int(c.blendMode).equal(2), () => {
              accum.assign(accum.mul(oneMinus(weight)).add(color.mul(weight)));
            })
            .Else(() => {
              accum.addAssign(color.mul(weight));
            });
        },
      );
    });

    return vec4(accum, 1.0);
  })();

  return {
    material,
    nodes: { ...t, ...c, uDesiredLevel, uSlabBaseZ, uBaseShape } as PlaneMaterialNodes,
  };
}

// ---------------------------------------------------------------------------
// 3D raymarcher
// ---------------------------------------------------------------------------

export type VolumeMaterialNodes = TraversalNodesPublic &
  ChannelNodesPublic & {
    uDesiredLevel: UniformNodeLike<number>;
    uLodBias: UniformNodeLike<number>;
    uPxPerVoxelAtUnitDist: UniformNodeLike<number>;
    uMinDelta: UniformNodeLike<number>;
    uStepScale: UniformNodeLike<number>;
    uBaseShape: UniformNodeLike<THREE.Vector3>;
    projectionMode: UniformNodeLike<number>;
    isoThreshold: UniformNodeLike<number>;
  };

export type VolumeMaterialBundle = { material: NodeMaterial; nodes: VolumeMaterialNodes };

export function createVolumeNodeMaterial(
  pool: LayerBrickPool,
  dataRange: { minValue: number; maxValue: number },
  channelData: ChannelUniformData,
): VolumeMaterialBundle {
  const t = makeTraversalNodes(pool, dataRange);
  const c = makeChannelNodes(channelData);
  c.minValue.value = dataRange.minValue;
  c.maxValue.value = dataRange.maxValue;
  const channelNormalize = makeChannelNormalize(c);

  const uDesiredLevel = uniform(0, "int");
  const uLodBias = uniform(1, "float");
  const uPxPerVoxelAtUnitDist = uniform(0, "float");
  const uMinDelta = uniform(1, "float");
  const uStepScale = uniform(1, "float");
  const uBaseShape = uniform(new THREE.Vector3(1, 1, 1), "vec3");
  const projectionMode = uniform(0, "int"); // 0 MIP, 1 ATTENUATED_MIP, 2 VOLUME, 3 ISO
  const isoThreshold = uniform(0.5, "float");

  const material = new NodeMaterial();
  commonMaterialSettings(material);
  material.depthTest = true;

  // Unit-box local ray, interpolated per fragment (parity with the GLSL
  // vertex stage): origin = camera in object space, direction toward vertex.
  const vOrigin = varying(
    modelWorldMatrixInverse.mul(vec4(cameraPosition, 1.0)).xyz,
    "vOrigin",
  );
  const vDirection = varying(positionGeometry.sub(vOrigin), "vDirection");

  // Unit-box local ([-0.5,0.5], y up) → base voxel (y down).
  const toBaseVoxel = Fn(([p]: any[]) => {
    const q = vec3(p);
    return vec3(q.x.add(0.5), float(0.5).sub(q.y), q.z.add(0.5)).mul(uBaseShape);
  });

  const desiredLevelAt = Fn(([baseVoxel, cameraBase]: any[]) => {
    const out = int(t.uNumLevels).sub(1).toVar("lodOut");
    If(uPxPerVoxelAtUnitDist.lessThanEqual(0.0), () => {
      out.assign(uDesiredLevel);
    }).Else(() => {
      const dist = max(distance(vec3(baseVoxel), vec3(cameraBase)), 1.0);
      const pxPerBaseVoxel = float(uPxPerVoxelAtUnitDist).div(dist);
      const found = bool(false).toVar();
      // Unique iterator name: this Fn inlines into the ray loop (see the
      // emitResolveBrickResidency shadowing note).
      Loop(
        { start: int(0), end: int(t.uNumLevels).sub(1), type: "int", condition: "<", name: "dlv" },
        ({ dlv }: any) => {
          If(found.not(), () => {
            If(
              pxPerBaseVoxel
                .mul(vec3(t.uLevelScale.element(dlv)).x)
                .mul(uLodBias)
                .greaterThanEqual(1.0),
              () => {
                out.assign(max(int(dlv), int(uDesiredLevel)));
                found.assign(true);
              },
            );
          });
        },
      );
    });
    return out;
  });

  // Exit distance (along the ray, from pB) of the level's brick cell.
  const brickExitRel = Fn(([pB, invD, lvl]: any[]) => {
    const cell = vec3(t.uBrickPayload).mul(vec3(t.uLevelScale.element(lvl)));
    const lo = floor(vec3(pB).div(cell)).mul(cell);
    const t1 = lo.sub(pB).mul(invD);
    const t2 = lo.add(cell).sub(pB).mul(invD);
    const tf = max(t1, t2);
    return max(min(tf.x, min(tf.y, tf.z)), 0.0);
  });

  material.fragmentNode = Fn(() => {
    const originB = vec3(toBaseVoxel(vOrigin)).toVar();
    const exitLocal = vec3(vOrigin).add(normalize(vec3(vDirection)));
    const dirB = normalize(vec3(toBaseVoxel(exitLocal)).sub(originB)).toVar();
    const safeDir = sign(dirB).mul(max(dirB.abs(), vec3(1e-6)));
    const invD = vec3(1.0).div(safeDir).toVar();

    // Ray ∩ [0, baseShape] slab test.
    const t0 = vec3(0.0).sub(originB).mul(invD);
    const t1v = vec3(uBaseShape).sub(originB).mul(invD);
    const tminv = min(t0, t1v);
    const tmaxv = max(t0, t1v);
    const boundsX = max(max(tminv.x, tminv.y), tminv.z).toVar();
    const boundsY = min(min(tmaxv.x, tmaxv.y), tmaxv.z).toVar();

    Discard(boundsX.greaterThan(boundsY));
    boundsX.assign(max(boundsX, 0.0));

    const rayLen = max(boundsY.sub(boundsX), 0.00001);
    // Termination guarantee: MAX_STEPS steps of at least this size always
    // cross the ray, whatever the per-sample LOD picks.
    const floorDelta = rayLen.div(float(MAX_RAY_STEPS));

    // Reference step for VOLUME opacity correction (see
    // core/opacityCorrection.ts — keep in lockstep).
    const refStep = max(
      max(float(uMinDelta), floorDelta),
      float(0.75).mul(vec3(t.uLevelScale.element(uDesiredLevel)).x),
    ).toVar();

    // Jitter must not depend on rayLen or uStepScale (motion-invariant, P14).
    const rayT = boundsX.add(float(rand2(screenCoordinate.xy)).mul(uMinDelta)).toVar("rayT");

    const bestNorm = float(0.0).toVar(); // MIP
    const bestColor = vec3(0.0).toVar();
    const attenuatedMax = float(0.0).toVar(); // ATTENUATED_MIP
    const attenuatedColor = vec3(0.0).toVar();
    const volColor = vec3(0.0).toVar(); // VOLUME front-to-back
    const volAlpha = float(0.0).toVar();
    const isoHit = bool(false).toVar(); // ISOSURFACE
    const isoColor = vec3(0.0).toVar();

    Loop({ start: int(0), end: int(MAX_RAY_STEPS), type: "int", condition: "<" }, () => {
      If(rayT.greaterThan(boundsY), () => {
        Break();
      });
      const pB = originB.add(rayT.mul(dirB)).toVar();
      const lvl = int(desiredLevelAt(pB, originB)).toVar();

      // LOD-adaptive step (P14): fine pitch where fine data is sampled.
      const stepLen = max(
        max(float(uMinDelta), floorDelta),
        float(0.75).mul(vec3(t.uLevelScale.element(lvl)).x),
      )
        .mul(max(float(uStepScale), 1.0))
        .toVar();

      // Per-sample channel composite (ChunkPlane semantics). Residency is
      // channel-independent: resolve ONCE per step, tap per channel (the
      // page-table level walk used to run per channel per step).
      const sampleColor = select(int(c.blendMode).equal(1), vec3(1.0), vec3(0.0)).toVar();
      const sampleNorm = float(0.0).toVar();
      const resolved = emitResolveBrickResidency(t, pB, lvl);

      If(resolved.status.greaterThanEqual(0.5), () => {
        Loop(
          { start: int(0), end: int(MAX_CHANNELS), type: "int", condition: "<", name: "ch" },
          ({ ch }: any) => {
            If(int(ch).greaterThanEqual(c.numChannels), () => {
              Break();
            });
            const paramsB = vec4(c.chParamsB.element(ch)).toVar(); // (opacity, visible, invert, row)
            If(paramsB.y.lessThan(0.5), () => {
              Continue();
            });

            const slabIndex = int(vec4(c.chParamsA.element(ch)).x).toVar();
            const raw = emitChannelTap(t, resolved, slabIndex);

            const normalized = float(channelNormalize(ch, raw)).toVar();
            const color = c.colormapAtlas.sample(vec2(normalized, paramsB.w)).rgb;
            const weight = paramsB.x.mul(normalized);
            sampleNorm.assign(max(sampleNorm, normalized));

            If(int(c.blendMode).equal(1), () => {
              sampleColor.mulAssign(mix(vec3(1.0), color, weight));
            })
              .ElseIf(int(c.blendMode).equal(2), () => {
                sampleColor.assign(sampleColor.mul(oneMinus(weight)).add(color.mul(weight)));
              })
              .Else(() => {
                sampleColor.addAssign(color.mul(weight));
              });
          },
        );
      });

      // Empty-space skipping: nothing resident anywhere (status 0), or a
      // known-uniform EMPTY brick (status 2) contributing nothing — jump to
      // the brick's exit. Status 1 (resident) never skips, same as the old
      // per-channel bestStatus/anyResident bookkeeping this replaces.
      If(
        resolved.status
          .lessThan(0.5)
          .or(resolved.status.greaterThan(1.5).and(sampleNorm.lessThanEqual(0.001))),
        () => {
          rayT.addAssign(max(stepLen, float(brickExitRel(pB, invD, lvl)).add(0.01)));
          Continue();
        },
      );

      If(int(projectionMode).equal(1), () => {
        const depthFrac = rayT.sub(boundsX).div(rayLen);
        const a = sampleNorm.mul(exp(float(-1.5).mul(depthFrac)));
        If(a.greaterThan(attenuatedMax), () => {
          attenuatedMax.assign(a);
          attenuatedColor.assign(sampleColor);
        });
      })
        .ElseIf(int(projectionMode).equal(2), () => {
          // Step-size (opacity) correction — mirrors core/opacityCorrection.ts.
          const a = oneMinus(
            pow(max(oneMinus(sampleNorm), 0.0), stepLen.div(max(refStep, 1e-5))),
          );
          volColor.addAssign(oneMinus(volAlpha).mul(a).mul(sampleColor));
          volAlpha.addAssign(oneMinus(volAlpha).mul(a));
          If(volAlpha.greaterThanEqual(0.98), () => {
            Break();
          });
        })
        .ElseIf(int(projectionMode).equal(3), () => {
          If(sampleNorm.greaterThanEqual(isoThreshold), () => {
            isoHit.assign(true);
            isoColor.assign(sampleColor);
            Break();
          });
        })
        .Else(() => {
          If(sampleNorm.greaterThan(bestNorm), () => {
            bestNorm.assign(sampleNorm);
            bestColor.assign(sampleColor);
          });
        });

      rayT.addAssign(stepLen);
    });

    const outColor = vec3(0.0).toVar("finalColor");
    const keep = bool(false).toVar("keepFragment");

    If(int(projectionMode).equal(2), () => {
      If(volAlpha.greaterThanEqual(0.01), () => {
        outColor.assign(volColor);
        keep.assign(true);
      });
    })
      .ElseIf(int(projectionMode).equal(3), () => {
        If(isoHit, () => {
          outColor.assign(isoColor);
          keep.assign(true);
        });
      })
      .Else(() => {
        // MIP / ATTENUATED_MIP: premultiplied additive output.
        const outNorm = select(int(projectionMode).equal(1), attenuatedMax, bestNorm);
        If(outNorm.greaterThanEqual(0.01), () => {
          outColor.assign(
            select(int(projectionMode).equal(1), attenuatedColor, bestColor),
          );
          keep.assign(true);
        });
      });

    Discard(keep.not());
    return vec4(outColor, 1.0);
  })();

  return {
    material,
    nodes: {
      ...t,
      ...c,
      uDesiredLevel,
      uLodBias,
      uPxPerVoxelAtUnitDist,
      uMinDelta,
      uStepScale,
      uBaseShape,
      projectionMode,
      isoThreshold,
    } as VolumeMaterialNodes,
  };
}
