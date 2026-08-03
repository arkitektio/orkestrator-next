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
  atan,
  bool,
  clamp,
  cos,
  distance,
  dot,
  exp,
  float,
  floor,
  fract,
  int,
  ivec2,
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
  sqrt,
  tan,
  texture,
  texture3D,
  textureLoad,
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

import { MAX_BRICK_LEVELS } from "../../core/octree/brickEncoding";
import { NameScope } from "./tslNames";
import { isShaderFastPathEnabled } from "./shaderFlags";
import type { LayerBrickPool } from "../../managers/brickResidency";
import {
  MAX_CHANNELS,
  MAX_CURSORS,
  PHASOR_MODE_AVERAGE,
  PHASOR_MODE_MODULATION,
  SOURCE_KIND_PHASOR,
  CURSOR_KIND_POLYGON,
  MAX_CURSOR_POINTS,
  type ChannelUniformData,
} from "./channelUniforms";

/**
 * TSL (Three Shading Language) node materials for the brick-pool renderer —
 * the WebGPU-migration port of the raw GLSL that used to live in a `glsl/`
 * directory alongside two ShaderMaterials, since deleted. TSL compiles to WGSL,
 * the scene's only backend.
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
  /** Per source: x = atlas-slab index (a channel's slab, or a phasor's INTENSITY
   * slab), y = climMin, z = climMax, w = gamma. */
  chParamsA: UniformArrayNodeLike<THREE.Vector4>;
  /** Per source: x = opacity, y = visible, z = invert, w = colormap row. */
  chParamsB: UniformArrayNodeLike<THREE.Vector4>;
  /**
   * The phasor half of a source slot, as TEXTURES rather than uniform arrays —
   * three more `uniformArray`s would each be another uniform-buffer binding and
   * blow the WebGPU 12-per-stage limit (see the note above), while a texture
   * costs none. `sourceParams` is 3 texels per row (one row per source):
   *
   *   (kind, gSlab, sSlab, iSlab)
   *   (mode, phaseOffset, modulationFactor, omega)   omega 0 = uncalibrated
   *   (valueMin, valueMax, weightByIntensity, -)
   */
  sourceParams: UniformNodeLike<THREE.Texture>;
  /** One cursor per row; see `writeCursors` in channelUniforms.ts. */
  cursorParams: UniformNodeLike<THREE.Texture>;
  cursorCount: UniformNodeLike<number>;
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
    sourceParams: texture(data.sourceParams),
    cursorParams: texture(data.cursors),
    cursorCount: uniform(data.cursorCount, "int"),
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
  // Same in-place adoption as the colormap atlas, and for the same reason: the
  // builders hand us NEW DataTextures on every edit, and swapping the object
  // would leave the compiled material's bind group pointing at a disposed
  // texture. These two are fixed-size, so the copy always applies.
  adoptDataTexture(nodes.sourceParams, data.sourceParams);
  adoptDataTexture(nodes.cursorParams, data.cursors);
  nodes.cursorCount.value = data.cursorCount;
}

function adoptDataTexture(
  node: UniformNodeLike<THREE.Texture>,
  next: THREE.DataTexture,
): void {
  const bound = node.value as THREE.DataTexture;
  if (bound === next) return;
  const boundImage = bound.image as { width: number; height: number; data: Float32Array };
  const nextImage = next.image as { width: number; height: number; data: Float32Array };
  if (boundImage.width === nextImage.width && boundImage.height === nextImage.height) {
    boundImage.data.set(nextImage.data);
    bound.needsUpdate = true;
    next.dispose();
  } else {
    node.value = next;
    bound.dispose();
  }
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
  /**
   * Level whose brick cell the empty-space skip may hop over: the level the
   * walk STOPPED at (an EMPTY entry declares its entire cell uniform), or the
   * coarsest level when NOTHING is mapped anywhere along the chain. Hopping by
   * the fine desired level instead crossed a fully-unmapped volume — the
   * first-load / slice-flush frames — in fine-pitch steps, each paying the
   * full level walk above (up to numLevels page-table loads × MAX_RAY_STEPS
   * per fragment).
   */
  hopLevel: any;
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
  // Defaults to the coarsest level: only overwritten when the walk stops at
  // an EMPTY entry, so a fully-unmapped chain hops a coarsest-sized cell.
  const hopLevel = int(t.uNumLevels).sub(1).toVar("resHopLevel");

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

      // EMPTY: uniform-fill brick, value 8-bit-encoded in R (P11). The hop
      // level is the level the EMPTY entry lives at — its whole cell is
      // uniform, so a non-contributing sample may skip the entire cell.
      If(flag.equal(int(2)), () => {
        status.assign(2.0);
        emptyValue.assign(float(t.uEmptyDecodeMin).add(entry.r.mul(t.uEmptyDecodeRange)));
        hopLevel.assign(int(sbLvl));
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

  return { status, emptyValue, texelBase, hopLevel };
}

/**
 * Per-channel half of the sample: the raw value for one channel slab of an
 * already-resolved residency. Callers guard on `status >= 0.5` before the
 * channel loop; here EMPTY yields the shared uniform value, RESIDENT taps the
 * channel's slab. Emitted inside the channel loop — `slabIndex` must be a
 * `.toVar()` (loop-dependent).
 */
function emitChannelTap(
  t: any,
  resolved: ResolvedResidency,
  slabIndex: any,
  // A phasor source taps THREE slabs in one scope (g, s, intensity), so the tap
  // vars must be uniquely named — two `chRaw`s in one scope would redeclare.
  name = "ch",
): any {
  const raw = float(0.0).toVar(`${name}Raw`);
  If(resolved.status.greaterThan(1.5), () => {
    raw.assign(resolved.emptyValue);
  }).Else(() => {
    // COPY texelBase — addAssign on the shared var would leak this channel's
    // slab offset into the next channel's tap.
    const texel = vec3(resolved.texelBase).toVar(`${name}Texel`);
    texel.z.addAssign(float(int(slabIndex).mul(t.uChannelSlabDepth)));
    const tap = texture3D(t.brickAtlas, texel.div(t.uAtlasTexels));
    // Fast path: explicit-LOD tap (textureSampleLevel). The atlas has no mips,
    // so level 0 is the same texel data — but the implicit-derivative
    // textureSample this replaces costs derivative math on every tap and is a
    // WGSL uniformity hazard inside the divergent ray loop.
    raw.assign((isShaderFastPathEnabled() ? tap.level(0) : tap).r.mul(t.uAtlasScale));
  });
  return raw;
}

/** What one compositor slot contributes at one sample point. */
type SourceSample = {
  /** The slot's color, already cursor-painted for a phasor. */
  color: any;
  /** Blend weight (opacity × the normalized intensity). */
  weight: any;
  /** Normalized intensity — the ray weight the 3D projections rank samples by. */
  norm: any;
};

/**
 * Sample one compositor slot: a CHANNEL (one slab through the transfer
 * function, colored by its colormap) or a PHASOR (three slabs — g, s and the
 * mean photon count — colored by the phasor's value, and repainted where a
 * cursor covers it).
 *
 * Both kinds end up in the same shape — color + weight — which is what lets the
 * two blend under one blend mode, and lets a phasor source behave like any
 * other leaf under MIP / volume / iso projection: its *intensity* is the ray
 * weight, its *phasor* is only the hue.
 *
 * Emitted inside the slot loop, so every loop-dependent value is `.toVar()`
 * (see the shadowing note on emitResolveBrickResidency).
 */
function emitSourceSample(
  t: any,
  c: any,
  resolved: ResolvedResidency,
  slot: any,
  fns: { channelNormalize: any; phasorValue: any; cursorHit: any },
  // A merged pass emits this body once per MEMBER, so every declaration here
  // exists once per member in one shader. `nm` mints names through the
  // member's NameScope, which throws on a collision rather than letting TSL
  // silently rename (and, historically, silently shadow).
  nm: (name: string) => string = (name) => name,
  // COMPILE-TIME phasor specialization: false (a member whose slots hold no
  // phasor sources — `hasPhasorSources`) omits the whole phasor branch from
  // the WGSL: the kind textureLoad, two extra atlas taps, atan/tan/sqrt, and
  // the 16×24 nested cursor loop. The branch was runtime-skipped anyway, but
  // it inflated register pressure and instruction footprint inside the
  // step×slot loop of EVERY volume shader. The material is rebuilt when a
  // phasor source appears (bundle memo keys on hasPhasorSources).
  emitPhasor = true,
): SourceSample {
  const paramsA = vec4(c.chParamsA.element(slot)).toVar(nm("srcA")); // (slab, climMin, climMax, gamma)
  const paramsB = vec4(c.chParamsB.element(slot)).toVar(nm("srcB")); // (opacity, visible, invert, row)

  // The intensity tap: a channel's slab, or a phasor's mean-photon-count slab.
  // Either way the ordinary clim/gamma/invert transfer applies to it.
  const rawIntensity = emitChannelTap(t, resolved, int(paramsA.x).toVar(nm("srcSlab")), nm("srcI"));
  const norm = float(fns.channelNormalize(slot, rawIntensity)).toVar(nm("srcNorm"));

  const color = vec3(0.0).toVar(nm("srcColor"));
  const weight = float(0.0).toVar(nm("srcWeight"));

  if (!emitPhasor) {
    color.assign(c.colormapAtlas.sample(vec2(norm, paramsB.w)).rgb);
    weight.assign(paramsB.x.mul(norm));
    return { color, weight, norm };
  }

  const p0 = vec4(textureLoad(c.sourceParams, ivec2(int(0), slot))).toVar(nm("srcP0"));

  If(int(p0.x).equal(int(SOURCE_KIND_PHASOR)), () => {
    const p1 = vec4(textureLoad(c.sourceParams, ivec2(int(1), slot))).toVar(nm("srcP1"));
    const p2 = vec4(textureLoad(c.sourceParams, ivec2(int(2), slot))).toVar(nm("srcP2"));

    const rawG = emitChannelTap(t, resolved, int(p0.y).toVar(nm("srcGSlab")), nm("srcG"));
    const rawS = emitChannelTap(t, resolved, int(p0.z).toVar(nm("srcSSlab")), nm("srcS"));

    const value = float(fns.phasorValue(rawG, rawS, p1)).toVar(nm("srcValue"));
    const valueNorm = clamp(
      value.sub(p2.x).div(max(p2.y.sub(p2.x), 0.000001)),
      0.0,
      0.999,
    ).toVar(nm("srcValueNorm"));
    color.assign(c.colormapAtlas.sample(vec2(valueNorm, paramsB.w)).rgb);

    // A cursor repaints the pixels of phasor space it covers. Test against the
    // CALIBRATED phasor — the same (g, s) the plot draws the cursor in.
    const cursor = vec4(fns.cursorHit(slot, rawG, rawS)).toVar(nm("srcCursor"));
    If(cursor.w.greaterThan(0.5), () => {
      color.assign(cursor.xyz);
    });

    // weightByIntensity (p2.z): off, the lifetime hue is painted flat wherever
    // there are photons at all — which is what you want when the interesting
    // structure is dim. The intensity still gates the pixel (norm > 0), so
    // background does not bloom.
    const gate = select(norm.greaterThan(0.0), float(1.0), float(0.0));
    weight.assign(paramsB.x.mul(select(p2.z.greaterThan(0.5), norm, gate)));
  }).Else(() => {
    color.assign(c.colormapAtlas.sample(vec2(norm, paramsB.w)).rgb);
    weight.assign(paramsB.x.mul(norm));
  });

  return { color, weight, norm };
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

const TAU = Math.PI * 2;

/**
 * TSL port of `core/phasor.ts` — keep the two in lockstep.
 *
 * Takes the three slabs the repack produced for a phasor node (g, s and the
 * mean photon count is tapped by the caller) and returns the scalar its
 * colormap maps: a lifetime (τ_φ / τ_m / their mean) when the instrument is
 * known, and the raw phase-as-a-fraction / modulus when it is not (an
 * uncalibrated phasor still renders — its hue is just not an absolute lifetime).
 *
 * `p1` is the source's (mode, phaseOffset, modulationFactor, omega) texel.
 */
const makePhasorValue = (nm: (name: string) => string = (name) => name) => {
  // Minted ONCE per factory call — the Fn body is inlined at each call site,
  // so names baked in here are per-member by construction.
  const N = {
    g: nm("phG"),
    s: nm("phS"),
    phase: nm("phPhase"),
    mod: nm("phMod"),
    phaseValue: nm("phPhaseValue"),
    modValue: nm("phModValue"),
  };
  return Fn(([rawG, rawS, p1]: any[]) => {
    const phaseOffset = float(vec4(p1).y);
    const modulationFactor = float(vec4(p1).z);
    const omega = float(vec4(p1).w);
    const mode = int(vec4(p1).x);

    // Instrument response: rotate by the phase offset, scale by the modulation
    // factor (calibratePhasor).
    const co = cos(phaseOffset);
    const si = sin(phaseOffset);
    const g = modulationFactor.mul(float(rawG).mul(co).sub(float(rawS).mul(si))).toVar(N.g);
    const s = modulationFactor.mul(float(rawG).mul(si).add(float(rawS).mul(co))).toVar(N.s);

    const phase = atan(s, g).toVar(N.phase);
    If(phase.lessThan(0.0), () => {
      phase.assign(phase.add(TAU));
    });
    const modulation = sqrt(g.mul(g).add(s.mul(s))).toVar(N.mod);

    // Uncalibrated (omega == 0): the phasor is only readable in its own terms.
    const phaseValue = float(0.0).toVar(N.phaseValue);
    const modulationValue = float(0.0).toVar(N.modValue);

    If(omega.lessThanEqual(0.0), () => {
      phaseValue.assign(phase.div(TAU));
      modulationValue.assign(modulation);
    }).Else(() => {
      // tau_phi = tan(phase)/omega. Past the semicircle's apex (phase > pi/2)
      // tan goes negative — there is no positive phase lifetime there, so clamp
      // to 0 instead of feeding ±Inf into a colormap lookup.
      phaseValue.assign(max(tan(phase), 0.0).div(omega));
      // tau_m = sqrt(1/m^2 - 1)/omega.
      const m = clamp(modulation, 0.000001, 1.0);
      modulationValue.assign(sqrt(max(float(1.0).div(m.mul(m)).sub(1.0), 0.0)).div(omega));
    });

    return select(
      mode.equal(int(PHASOR_MODE_MODULATION)),
      modulationValue,
      select(
        mode.equal(int(PHASOR_MODE_AVERAGE)),
        phaseValue.add(modulationValue).mul(0.5),
        phaseValue,
      ),
    );
  });
};

/**
 * Does this pixel's (calibrated) phasor fall inside any of the source's
 * cursors? Returns the cursor's color in rgb and a hit flag in a — a cursor is
 * a color RULE on the image, not a plot widget, so a hit repaints the pixel.
 *
 * Mirrors `cursorHit`: circles by distance, polygons by the even-odd crossing
 * test. Vertices are packed two per texel after the two header texels.
 */
const makeCursorHit = (c: any, nm: (name: string) => string = (name) => name) => {
  // Minted ONCE per factory call, for the same reason as makePhasorValue: the
  // Fn body is inlined at every call site, so a merged pass would otherwise
  // declare these names once per member in one scope.
  const N = {
    result: nm("curResult"),
    cur: nm("cur"),
    head: nm("curHead"),
    style: nm("curStyle"),
    centre: nm("curCentre"),
    inside: nm("curInside"),
    count: nm("curCount"),
    cross: nm("curCross"),
    cpt: nm("cpt"),
    cptJ: nm("cptJ"),
    pi: nm("curPi"),
    pj: nm("curPj"),
  };
  return Fn(([slot, g, s]: any[]) => {
    const result = vec4(0.0).toVar(N.result);

    Loop(
      { start: int(0), end: int(MAX_CURSORS), type: "int", condition: "<", name: N.cur },
      // Loop hands the iterator back keyed by its NAME, which is now
      // member-prefixed — destructuring a literal `cur` would silently yield
      // undefined and feed it straight into ivec2().
      (args: any) => {
        const cur = args[N.cur];
        If(int(cur).greaterThanEqual(c.cursorCount), () => {
          Break();
        });
        const header = vec4(textureLoad(c.cursorParams, ivec2(int(0), cur))).toVar(N.head);
        // (kind, source slot, point count, visible)
        If(int(header.y).notEqual(int(slot)).or(header.w.lessThan(0.5)), () => {
          Continue();
        });
        const style = vec4(textureLoad(c.cursorParams, ivec2(int(1), cur))).toVar(N.style);
        const centre = vec4(textureLoad(c.cursorParams, ivec2(int(2), cur))).toVar(N.centre);

        const inside = bool(false).toVar(N.inside);

        If(int(header.x).equal(int(CURSOR_KIND_POLYGON)), () => {
          const count = int(header.z).toVar(N.count);
          const crossings = int(0).toVar(N.cross);
          // Even-odd: count the edges the ray from (g, s) crosses. `j` trails
          // `i` by one vertex, wrapping at the end.
          Loop(
            {
              start: int(0),
              end: int(MAX_CURSOR_POINTS),
              type: "int",
              condition: "<",
              name: N.cpt,
            },
            (args: any) => {
              const cpt = args[N.cpt];
              If(int(cpt).greaterThanEqual(count), () => {
                Break();
              });
              const j = select(int(cpt).equal(int(0)), count.sub(1), int(cpt).sub(1)).toVar(N.cptJ);
              const pi = phasorPolygonPoint(c, cur, int(cpt)).toVar(N.pi);
              const pj = phasorPolygonPoint(c, cur, j).toVar(N.pj);
              const crosses = pi.y
                .greaterThan(float(s))
                .notEqual(pj.y.greaterThan(float(s)));
              If(crosses, () => {
                const x = pj.x
                  .sub(pi.x)
                  .mul(float(s).sub(pi.y))
                  .div(pj.y.sub(pi.y).add(0.000001))
                  .add(pi.x);
                If(float(g).lessThan(x), () => {
                  crossings.assign(crossings.add(int(1)));
                });
              });
            },
          );
          inside.assign(crossings.mod(int(2)).equal(int(1)));
        }).Else(() => {
          const radius = style.w;
          const dg = float(g).sub(centre.x);
          const ds = float(s).sub(centre.y);
          inside.assign(
            radius.greaterThan(0.0).and(dg.mul(dg).add(ds.mul(ds)).lessThanEqual(radius.mul(radius))),
          );
        });

        If(inside, () => {
          result.assign(vec4(style.xyz, 1.0));
          Break();
        });
      },
    );

    return result;
  });
};

/** Vertex `index` of a polygon cursor: two (g, s) pairs per texel, after the
 * two header texels and the centre texel. */
const phasorPolygonPoint = (c: any, cursor: any, index: any) => {
  const texel = int(index).div(int(2)).add(int(3));
  const value = vec4(textureLoad(c.cursorParams, ivec2(texel, cursor)));
  return select(int(index).mod(int(2)).equal(int(0)), value.xy, value.zw);
};

/** Motion-invariant jitter source (the classic sin/dot/fract hash). */
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
  // NOTE: this is a NO-OP on the WebGPU backend and does NOT do what the name
  // suggests. `toneMapped` is read only by WebGLRenderer/WebGLPrograms; nothing
  // under renderers/common or nodes/ looks at it. The output transform runs as
  // a separate full-screen pass (`Renderer._renderOutput`) driven by
  // `needsFrameBufferTarget`, which is on because R3F applies ACES + sRGB — so
  // this material's additive result IS tone-mapped and sRGB-encoded regardless.
  // Kept only as a declaration of intent, and because it would matter if the
  // WebGL2 fallback path is ever exercised.
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
  const fns = {
    channelNormalize: makeChannelNormalize(c),
    phasorValue: makePhasorValue(),
    cursorHit: makeCursorHit(c),
  };

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
          If(vec4(c.chParamsB.element(ch)).y.lessThan(0.5), () => {
            Continue();
          });

          const sample = emitSourceSample(t, c, resolved, ch, fns);
          const color = sample.color;
          const weight = sample.weight;

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
    uMaxSteps: UniformNodeLike<number>;
    uBaseShape: UniformNodeLike<THREE.Vector3>;
    /** Member 0's projection mode — the single-layer alias. */
    projectionMode: UniformNodeLike<number>;
    /** Member 0's iso threshold — the single-layer alias. */
    isoThreshold: UniformNodeLike<number>;
    /** Per-member scalars for a merged pass; length 1 for a single layer. */
    members: {
      slotFirst: UniformNodeLike<number>;
      slotCount: UniformNodeLike<number>;
      blendMode: UniformNodeLike<number>;
      projectionMode: UniformNodeLike<number>;
      isoThreshold: UniformNodeLike<number>;
    }[];
  };

export type VolumeMaterialBundle = { material: NodeMaterial; nodes: VolumeMaterialNodes };

/**
 * One raymarch pass for one or more co-pool layers.
 *
 * `memberCount > 1` MERGES layers that share a brick pool into a single pass.
 * They share the atlas, page table, geometry, brick spec and value range (that
 * is what `buildPoolKey` asserts), so N passes walked the same volume N times:
 * N full rasterizations of the same screen region and N page-table level walks
 * per ray step, with no early-Z to save any of it (additive + depthWrite off +
 * Discard). Merged, the ray is walked ONCE and every member accumulates from
 * the shared residency resolve.
 *
 * Members are unrolled in JS rather than looped in the shader: each needs its
 * own set of projection accumulators, which a dynamic loop would have to keep
 * in indexable local arrays. The per-member CHANNEL loop stays dynamic over
 * `slotFirst`/`slotCount` uniforms, so adding or removing a channel does not
 * rebuild the material — only a membership change does.
 *
 * Semantics preserved exactly:
 *  - Each member keeps its own projection mode, blend mode and iso threshold.
 *  - Each member's early-out (MIP saturation, VOLUME alpha, ISO first crossing)
 *    becomes a per-member `done` flag instead of a shared `Break`, so a
 *    finished member stops accumulating without cutting the others' ray short.
 *  - Empty-space skipping tests the MAX sample across members — strictly more
 *    conservative than any single member's test, so no member loses a sample.
 *  - The output sums the members' contributions, which is exactly what the
 *    framebuffer's additive blending did across the separate passes.
 */
export function createVolumeNodeMaterial(
  pool: LayerBrickPool,
  dataRange: { minValue: number; maxValue: number },
  channelData: ChannelUniformData & {
    /** Present when the data came from `buildMergedChannelUniformData`. */
    members?: readonly {
      slotFirst: number;
      slotCount: number;
      blendMode: number;
      projectionMode: number;
      /** Compile-time phasor specialization input; absent → assume phasors. */
      hasPhasorSources?: boolean;
    }[];
  },
  memberCount = 1,
): VolumeMaterialBundle {
  // Read ONCE per material build (kill switch — see shaderFlags.ts): selects
  // which node graph is emitted. Off = the legacy emission order, verbatim.
  const fastPath = isShaderFastPathEnabled();
  const t = makeTraversalNodes(pool, dataRange);
  const c = makeChannelNodes(channelData);
  c.minValue.value = dataRange.minValue;
  c.maxValue.value = dataRange.maxValue;
  // One Fn set per MEMBER. `makePhasorValue` and `makeCursorHit` bake named
  // declarations into bodies that TSL INLINES at every call site, so a merged
  // pass declares `curPi`/`cptJ`/`phG`/... once per member in one scope — TSL
  // auto-renames those, which is precisely the silent-shadowing mechanism this
  // module has been bitten by before. Minting through one NameScope makes a
  // collision throw at build time instead of becoming a wrong image.
  //
  // With one member the prefix is empty, so the generated WGSL is what it was
  // before merging existed. `makeChannelNormalize` needs no prefix: it declares
  // only unnamed vars, which TSL numbers uniquely on its own.
  const nameScope = new NameScope();
  const memberFns = Array.from({ length: Math.max(1, memberCount) }, (_, m) => {
    const nm = nameScope.prefixed(memberCount > 1 ? `m${m}` : "");
    return {
      channelNormalize: makeChannelNormalize(c),
      phasorValue: makePhasorValue(nm),
      cursorHit: makeCursorHit(c, nm),
      nm,
      // Compile-time phasor specialization (fast path only): a member with no
      // phasor sources gets the phasor branch omitted from its WGSL. Absent
      // member info → conservative true (emit the branch).
      emitPhasor: !fastPath || (channelData.members?.[m]?.hasPhasorSources ?? true),
    };
  });

  // Per-member scalars are plain `uniform()` nodes, NOT `uniformArray` — every
  // uniformArray is its own uniform-buffer binding on WebGPU and this material
  // already sits near the 12-per-stage device limit, while individual uniforms
  // pack into three's shared node group and cost no binding.
  // Seeded from the data the material is built with, so the very first frame
  // is already correct — waiting for the uniform effect would flash member 0
  // rendering every member's slots.
  const memberNodes = Array.from({ length: Math.max(1, memberCount) }, (_, m) => {
    const seed = channelData.members?.[m];
    return {
      slotFirst: uniform(seed?.slotFirst ?? 0, "int"),
      slotCount: uniform(
        seed ? seed.slotCount : m === 0 ? channelData.numChannels : 0,
        "int",
      ),
      blendMode: uniform(seed?.blendMode ?? (m === 0 ? channelData.blendMode : 0), "int"),
      // 0 MIP, 1 ATTENUATED_MIP, 2 VOLUME, 3 ISO
      projectionMode: uniform(seed?.projectionMode ?? 0, "int"),
      isoThreshold: uniform(0.5, "float"),
    };
  });

  const uDesiredLevel = uniform(0, "int");
  const uLodBias = uniform(1, "float");
  const uPxPerVoxelAtUnitDist = uniform(0, "float");
  const uMinDelta = uniform(1, "float");
  const uStepScale = uniform(1, "float");
  // Per-tier hard iteration ceiling (quality profile `maxRaySteps`). Capping
  // steps LENGTHENS the stride (see floorDelta) rather than cutting the far
  // volume; MAX_RAY_STEPS stays the compile-time loop bound.
  const uMaxSteps = uniform(MAX_RAY_STEPS, "float");
  const uBaseShape = uniform(new THREE.Vector3(1, 1, 1), "vec3");
  // Back-compat aliases: the single-layer call site writes `projectionMode` /
  // `isoThreshold` directly, which is member 0.
  const projectionMode = memberNodes[0].projectionMode;
  const isoThreshold = memberNodes[0].isoThreshold;

  const material = new NodeMaterial();
  commonMaterialSettings(material);
  material.depthTest = true;
  // BACK faces, not front: the box is only a proxy to generate fragments for
  // the march, and once the camera dollies inside it every front face is behind
  // the near plane — the volume would blink out exactly when you zoom into it.
  // Back faces rasterize from inside AND outside. The ray is unaffected: its
  // origin is the camera (vOrigin) and its entry distance comes from the slab
  // test below, not from the rasterized face. DoubleSide would be wrong here —
  // blending is additive, so front+back would each march the ray and composite
  // the volume at double brightness.
  material.side = THREE.BackSide;

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
            // MAX spatial factor — mirrors the planner's `wantFiner`
            // (nodePlanning.ts): a level counts as resolvable while ANY of
            // its axes still spans ≥1 px (true-factor pyramids are
            // anisotropic). Keep the two in lockstep.
            const lvlScale = vec3(t.uLevelScale.element(dlv));
            If(
              pxPerBaseVoxel
                .mul(max(lvlScale.x, max(lvlScale.y, lvlScale.z)))
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
    // Termination guarantee: uMaxSteps steps of at least this size always
    // cross the ray, whatever the per-sample LOD picks — a lower tier cap
    // trades step density for the same full-ray coverage.
    const floorDelta = rayLen.div(max(float(uMaxSteps), 1.0));

    // Reference step for VOLUME opacity correction (see
    // core/opacityCorrection.ts — keep in lockstep).
    const refStep = max(
      max(float(uMinDelta), floorDelta),
      float(0.75).mul(vec3(t.uLevelScale.element(uDesiredLevel)).x),
    ).toVar();

    // Jitter must not depend on rayLen or uStepScale (motion-invariant, P14).
    const rayT = boundsX.add(float(rand2(screenCoordinate.xy)).mul(uMinDelta)).toVar("rayT");

    // Per-member accumulators. Deliberately UNNAMED `.toVar()`: TSL mints a
    // unique name for each, which is what makes unrolling members into one
    // scope safe. A named var here would collide across members.
    const acc = memberNodes.map(() => ({
      bestNorm: float(0.0).toVar(), // MIP
      bestColor: vec3(0.0).toVar(),
      attenuatedMax: float(0.0).toVar(), // ATTENUATED_MIP
      attenuatedColor: vec3(0.0).toVar(),
      volColor: vec3(0.0).toVar(), // VOLUME front-to-back
      volAlpha: float(0.0).toVar(),
      isoHit: bool(false).toVar(), // ISOSURFACE
      isoColor: vec3(0.0).toVar(),
      // Replaces the single-pass `Break()`: this member has all it can get, but
      // the ray continues for the others.
      done: bool(false).toVar(),
    }));

    Loop({ start: int(0), end: int(MAX_RAY_STEPS), type: "int", condition: "<" }, ({ i }: any) => {
      // Tier cap: the uniform can't feed the compile-constant loop bound, so
      // it breaks here. floorDelta above guarantees full-ray coverage in
      // uMaxSteps iterations.
      If(float(i).greaterThanEqual(float(uMaxSteps)), () => {
        Break();
      });
      If(rayT.greaterThan(boundsY), () => {
        Break();
      });
      // Every member has finished: nothing further along the ray can change
      // the image. For one member this is exactly the old per-mode `Break`.
      let allDone: any = acc[0].done;
      for (let m = 1; m < acc.length; m++) allDone = allDone.and(acc[m].done);
      If(allDone, () => {
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

      // Residency is channel- AND member-independent: resolve ONCE per step.
      // This is the whole point of merging — N members used to pay N level
      // walks per step for the identical answer.
      const resolved = emitResolveBrickResidency(t, pB, lvl);

      // Empty-space skip hop: jump to the exit of the RESOLVED level's cell
      // (hopLevel: the EMPTY brick's own level, or the coarsest cell when the
      // whole chain is unmapped), not the fine desired level's.
      const hopPastCell = () => {
        rayT.addAssign(
          max(stepLen, float(brickExitRel(pB, invD, resolved.hopLevel)).add(0.01)),
        );
        Continue();
      };

      if (fastPath) {
        // FAST PATH — decide skippability BEFORE any per-slot sampling is
        // emitted (CPU mirror: core/raymarchStep.ts). The legacy path below
        // built the full transfer-function + colormap + phasor sample set
        // first and only then tested the skip predicate, so every skipped
        // step still paid the whole per-slot path.
        //
        // Unmapped chain: nothing to sample anywhere — hop immediately.
        If(resolved.status.lessThan(0.5), () => {
          hopPastCell();
        });
        // Uniform EMPTY brick: every slot taps the same uniform value, so the
        // step's max norm is derivable with pure ALU (channelNormalize only —
        // no colormap sample, no phasor taps, no cursor loop). Invisible
        // slots are excluded, exactly like the sampling loop's guard. The
        // max across members mirrors the legacy predicate: strictly more
        // conservative than any single member's, so no member loses a sample.
        If(resolved.status.greaterThan(1.5), () => {
          const maxEmptyNorm = float(0.0).toVar("esMaxNorm");
          memberNodes.forEach((mem, m) => {
            Loop(
              { start: int(0), end: int(MAX_CHANNELS), type: "int", condition: "<", name: `es${m}` },
              (args: any) => {
                const k = args[`es${m}`];
                If(int(k).greaterThanEqual(mem.slotCount), () => {
                  Break();
                });
                const slot = int(mem.slotFirst).add(int(k)).toVar();
                If(vec4(c.chParamsB.element(slot)).y.lessThan(0.5), () => {
                  Continue();
                });
                maxEmptyNorm.assign(
                  max(
                    maxEmptyNorm,
                    float(memberFns[m].channelNormalize(slot, resolved.emptyValue)),
                  ),
                );
              },
            );
          });
          If(maxEmptyNorm.lessThanEqual(0.001), () => {
            hopPastCell();
          });
        });
      }

      // Per-sample composite, per member (ChunkPlane semantics).
      const maxSampleNorm = float(0.0).toVar();
      const samples = memberNodes.map((mem, m) => {
        const sampleColor = select(int(mem.blendMode).equal(1), vec3(1.0), vec3(0.0)).toVar();
        const sampleNorm = float(0.0).toVar();
        If(resolved.status.greaterThanEqual(0.5), () => {
          Loop(
            {
              start: int(0),
              end: int(MAX_CHANNELS),
              type: "int",
              condition: "<",
              // Distinct iterator per member — see the shadowing note on
              // emitResolveBrickResidency.
              name: `ch${m}`,
            },
            (args: any) => {
              const k = args[`ch${m}`];
              If(int(k).greaterThanEqual(mem.slotCount), () => {
                Break();
              });
              // Members' slots are concatenated into the shared arrays; this
              // member owns [slotFirst, slotFirst + slotCount).
              const slot = int(mem.slotFirst).add(int(k)).toVar();
              If(vec4(c.chParamsB.element(slot)).y.lessThan(0.5), () => {
                Continue();
              });

              const sample = emitSourceSample(
                t,
                c,
                resolved,
                slot,
                memberFns[m],
                memberFns[m].nm,
                memberFns[m].emitPhasor,
              );
              const color = sample.color;
              const weight = sample.weight;
              // The ray ranks samples by INTENSITY, never by phasor value: a MIP
              // through a lifetime overlay must pick the brightest voxel along the
              // ray and show ITS lifetime — not the longest lifetime, which would
              // pick out the dimmest background pixels.
              sampleNorm.assign(max(sampleNorm, sample.norm));

              If(int(mem.blendMode).equal(1), () => {
                sampleColor.mulAssign(mix(vec3(1.0), color, weight));
              })
                .ElseIf(int(mem.blendMode).equal(2), () => {
                  sampleColor.assign(sampleColor.mul(oneMinus(weight)).add(color.mul(weight)));
                })
                .Else(() => {
                  sampleColor.addAssign(color.mul(weight));
                });
            },
          );
        });
        maxSampleNorm.assign(max(maxSampleNorm, sampleNorm));
        return { sampleColor, sampleNorm };
      });

      // LEGACY empty-space skipping (fast path decides BEFORE sampling, above):
      // nothing resident anywhere (status 0), or a known-uniform EMPTY brick
      // (status 2) contributing nothing — jump past the resolved cell. Status
      // 1 (resident) never skips. Merged, the test uses the MAX across
      // members: strictly more conservative than any single member's, so no
      // member loses a sample.
      if (!fastPath) {
        If(
          resolved.status
            .lessThan(0.5)
            .or(resolved.status.greaterThan(1.5).and(maxSampleNorm.lessThanEqual(0.001))),
          () => {
            hopPastCell();
          },
        );
      }

      memberNodes.forEach((mem, m) => {
        const a = acc[m];
        const { sampleColor, sampleNorm } = samples[m];
        // A finished member contributes nothing further; the others march on.
        If(a.done.not(), () => {
          If(int(mem.projectionMode).equal(1), () => {
            const depthFrac = rayT.sub(boundsX).div(rayLen);
            if (fastPath) {
              const atten = exp(float(-1.5).mul(depthFrac)).toVar();
              const av = sampleNorm.mul(atten);
              If(av.greaterThan(a.attenuatedMax), () => {
                a.attenuatedMax.assign(av);
                a.attenuatedColor.assign(sampleColor);
              });
              // Early ray termination (CPU mirror: attenuatedMipDone). atten
              // strictly decreases along the ray and sampleNorm ≤ 1, so every
              // future contribution is < atten_now; once the accumulated max
              // reaches that ceiling nothing later can beat it. Deterministic
              // per pixel (P14-safe, same argument as the MIP 0.995 bound).
              If(a.attenuatedMax.greaterThanEqual(atten), () => {
                a.done.assign(true);
              });
            } else {
              const av = sampleNorm.mul(exp(float(-1.5).mul(depthFrac)));
              If(av.greaterThan(a.attenuatedMax), () => {
                a.attenuatedMax.assign(av);
                a.attenuatedColor.assign(sampleColor);
              });
            }
          })
            .ElseIf(int(mem.projectionMode).equal(2), () => {
              // Step-size (opacity) correction — mirrors core/opacityCorrection.ts.
              const av = oneMinus(
                pow(max(oneMinus(sampleNorm), 0.0), stepLen.div(max(refStep, 1e-5))),
              );
              a.volColor.addAssign(oneMinus(a.volAlpha).mul(av).mul(sampleColor));
              a.volAlpha.addAssign(oneMinus(a.volAlpha).mul(av));
              If(a.volAlpha.greaterThanEqual(0.98), () => {
                a.done.assign(true);
              });
            })
            .ElseIf(int(mem.projectionMode).equal(3), () => {
              If(sampleNorm.greaterThanEqual(mem.isoThreshold), () => {
                a.isoHit.assign(true);
                a.isoColor.assign(sampleColor);
                a.done.assign(true);
              });
            })
            .Else(() => {
              If(sampleNorm.greaterThan(a.bestNorm), () => {
                a.bestNorm.assign(sampleNorm);
                a.bestColor.assign(sampleColor);
              });
              // Early ray termination: the normalize clamps to [0, 0.999] before
              // gamma (invert can reach exactly 1.0), so a max >= 0.995 is within
              // sub-colormap-step distance of the reachable ceiling — nothing
              // later on the ray can visibly beat it. Deterministic per pixel
              // (P14-safe). ATTENUATED_MIP's depth-decay bound lives in its own
              // branch above (fast path only).
              If(a.bestNorm.greaterThanEqual(0.995), () => {
                a.done.assign(true);
              });
            });
        });
      });

      rayT.addAssign(stepLen);
    });

    const outColor = vec3(0.0).toVar("finalColor");
    const keep = bool(false).toVar("keepFragment");

    // SUM the members. Across layers the compositing was always additive (the
    // material is AdditiveBlending and a layer's own blend applies only within
    // its own slots), and addition is associative — so summing here is exactly
    // what the framebuffer did across the separate passes. For one member the
    // addAssign onto a zeroed var is the old plain assign.
    memberNodes.forEach((mem, m) => {
      const a = acc[m];
      If(int(mem.projectionMode).equal(2), () => {
        If(a.volAlpha.greaterThanEqual(0.01), () => {
          outColor.addAssign(a.volColor);
          keep.assign(true);
        });
      })
        .ElseIf(int(mem.projectionMode).equal(3), () => {
          If(a.isoHit, () => {
            outColor.addAssign(a.isoColor);
            keep.assign(true);
          });
        })
        .Else(() => {
          // MIP / ATTENUATED_MIP: premultiplied additive output.
          const outNorm = select(
            int(mem.projectionMode).equal(1),
            a.attenuatedMax,
            a.bestNorm,
          );
          If(outNorm.greaterThanEqual(0.01), () => {
            outColor.addAssign(
              select(int(mem.projectionMode).equal(1), a.attenuatedColor, a.bestColor),
            );
            keep.assign(true);
          });
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
      uMaxSteps,
      uBaseShape,
      projectionMode,
      isoThreshold,
      members: memberNodes,
    } as VolumeMaterialNodes,
  };
}

/**
 * Push a merged group's per-member uniforms. Channel arrays/textures go through
 * the existing `updateChannelNodes`; this covers only the per-member scalars
 * the merged fragment reads.
 *
 * Members whose data is missing this frame are zeroed rather than left stale —
 * a stale `slotCount` would have the shader read another member's slots.
 */
export function updateMergedMemberNodes(
  nodes: VolumeMaterialNodes,
  members: readonly {
    slotFirst: number;
    slotCount: number;
    blendMode: number;
    projectionMode: number;
    isoThreshold: number;
  }[],
): void {
  const target = nodes.members ?? [];
  for (let m = 0; m < target.length; m++) {
    const source = members[m];
    target[m].slotFirst.value = source?.slotFirst ?? 0;
    target[m].slotCount.value = source?.slotCount ?? 0;
    target[m].blendMode.value = source?.blendMode ?? 0;
    target[m].projectionMode.value = source?.projectionMode ?? 0;
    target[m].isoThreshold.value = source?.isoThreshold ?? 0.5;
  }
}
