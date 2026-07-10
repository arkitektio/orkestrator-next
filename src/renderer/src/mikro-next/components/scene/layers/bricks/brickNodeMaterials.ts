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
  nodes.colormapAtlas.value = data.atlas;
  nodes.numChannels.value = data.numChannels;
  nodes.blendMode.value = data.blendMode;
  copyChannelArrays(nodes, data);
}

/**
 * TSL port of `sampleBrickEx`: sample the finest resident brick at or coarser
 * than desiredLevel. Returns vec2(status, rawValue) with status 0 = nothing
 * resident (transparent), 1 = resident sample, 2 = uniform EMPTY brick.
 */
function makeSampleBrickEx(t: any) {
  return Fn(([baseVoxel, desiredLevel, channel]: any[]) => {
    const result = vec2(0.0, 0.0).toVar("sampleResult");

    Loop({ start: int(0), end: t.uNumLevels, type: "int", condition: "<" }, ({ i }) => {
      If(int(i).lessThan(desiredLevel), () => {
        Continue();
      });

      const levelScale = vec3(t.uLevelScale.element(i)).toVar();
      const levelShape = vec3(t.uLevelShape.element(i)).toVar();
      const levelVoxel = clamp(
        vec3(baseVoxel).div(levelScale),
        vec3(0.0),
        levelShape.sub(0.5001),
      ).toVar();
      const brick = ivec3(floor(levelVoxel.div(vec3(t.uBrickPayload)))).toVar();
      // texture3DLoad, NOT textureLoad: the plain TSL textureLoad builds a 2D
      // TextureNode whose fetch coords collapse to ivec2 — invalid WGSL for a
      // texture_3d. Entry components are rgba8unorm floats; decode bytes with
      // round(v * 255).
      const entry = vec4(
        texture3DLoad(t.pageTable, ivec3(t.uPageOffset.element(i)).add(brick)),
      ).toVar();
      const flag = int(entry.a.mul(255.0).add(0.5)).toVar();

      // EMPTY: uniform-fill brick, value 8-bit-encoded in R (P11).
      If(flag.equal(int(2)), () => {
        result.assign(
          vec2(
            2.0,
            float(t.uEmptyDecodeMin).add(entry.r.mul(t.uEmptyDecodeRange)),
          ),
        );
        Break();
      });

      // RESIDENT: atlas tap at slot origin + border + in-brick offset
      // (+ channel-slab z).
      If(flag.equal(int(1)), () => {
        const inBrick = levelVoxel.sub(vec3(brick.mul(t.uBrickPayload)));
        const slot = ivec3(entry.xyz.mul(255.0).add(0.5));
        const texel = vec3(slot.mul(t.uSlotSize))
          .add(float(t.uBrickBorder))
          .add(inBrick)
          .toVar();
        texel.z.addAssign(float(int(channel).mul(t.uChannelSlabDepth)));
        const raw = texture3D(t.brickAtlas, texel.div(t.uAtlasTexels))
          .r.mul(t.uAtlasScale);
        result.assign(vec2(1.0, raw));
        Break();
      });
    });

    return result;
  });
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
  const sampleBrickEx = makeSampleBrickEx(t);
  const channelNormalize = makeChannelNormalize(c);

  const uDesiredLevel = uniform(0, "int");
  const uSlabBaseZ = uniform(0.5, "float");
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
    );

    const accum = select(
      int(c.blendMode).equal(1),
      vec3(1.0),
      vec3(0.0),
    ).toVar("accum");

    Loop({ start: int(0), end: int(MAX_CHANNELS), type: "int", condition: "<" }, ({ i }) => {
      If(int(i).greaterThanEqual(c.numChannels), () => {
        Break();
      });
      const paramsB = vec4(c.chParamsB.element(i)).toVar(); // (opacity, visible, invert, row)
      If(paramsB.y.lessThan(0.5), () => {
        Continue();
      });

      const sampled = vec2(
        sampleBrickEx(baseVoxel, uDesiredLevel, int(vec4(c.chParamsA.element(i)).x)),
      ).toVar();
      If(sampled.x.lessThan(0.5), () => {
        Continue(); // nothing resident yet: transparent
      });

      const normalized = float(channelNormalize(i, sampled.y)).toVar();
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
  const sampleBrickEx = makeSampleBrickEx(t);
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
      Loop({ start: int(0), end: int(t.uNumLevels).sub(1), type: "int", condition: "<" }, ({ i }) => {
        If(found.not(), () => {
          If(
            pxPerBaseVoxel
              .mul(vec3(t.uLevelScale.element(i)).x)
              .mul(uLodBias)
              .greaterThanEqual(1.0),
            () => {
              out.assign(max(int(i), int(uDesiredLevel)));
              found.assign(true);
            },
          );
        });
      });
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

      // Per-sample channel composite (ChunkPlane semantics).
      const sampleColor = select(int(c.blendMode).equal(1), vec3(1.0), vec3(0.0)).toVar();
      const sampleNorm = float(0.0).toVar();
      const bestStatus = float(0.0).toVar();
      const anyResident = bool(false).toVar();

      Loop({ start: int(0), end: int(MAX_CHANNELS), type: "int", condition: "<" }, ({ i }) => {
        If(int(i).greaterThanEqual(c.numChannels), () => {
          Break();
        });
        const paramsB = vec4(c.chParamsB.element(i)).toVar(); // (opacity, visible, invert, row)
        If(paramsB.y.lessThan(0.5), () => {
          Continue();
        });

        const sampled = vec2(
          sampleBrickEx(pB, lvl, int(vec4(c.chParamsA.element(i)).x)),
        ).toVar();
        bestStatus.assign(max(bestStatus, sampled.x));
        If(sampled.x.lessThan(0.5), () => {
          Continue();
        });
        If(sampled.x.lessThan(1.5), () => {
          anyResident.assign(true);
        });

        const normalized = float(channelNormalize(i, sampled.y)).toVar();
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
      });

      // Empty-space skipping: nothing resident anywhere, or a known-uniform
      // brick contributing nothing — jump to the brick's exit.
      If(
        bestStatus
          .lessThan(0.5)
          .or(anyResident.not().and(sampleNorm.lessThanEqual(0.001))),
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
