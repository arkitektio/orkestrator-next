/**
 * The point cloud's material: one quad per object, positioned and coloured on the GPU.
 *
 * ## Why storage buffers rather than instanced vertex attributes
 *
 * The scene is WebGPU-only — `webgpuSupport.ts` gates it before `<Canvas>` mounts and refuses
 * rather than falling back, because three silently swaps in a WebGL2 backend and offers no
 * `forceWebGPU`. So this takes the WebGPU path rather than the portable one.
 *
 * Per-object position and value live in `StorageInstancedBufferAttribute`s read as
 * `storage(...).element(instanceIndex)`. Against instanced vertex attributes that buys:
 *
 *   - the two buffers are independent, so a colour change writes the value buffer and never
 *     touches positions — the same split that took the colormap out of the label LUT;
 *   - a compute stage can read and write the same buffers, which is what a GPU scatter and an
 *     indirect cull would need. Neither is here yet; this is the shape that admits them.
 *
 * The quad's corner comes from `vertexIndex` — six vertices, no index buffer, no position
 * attribute, no geometry to keep in step with the data.
 *
 * ## Appearance is uniforms, as everywhere else
 *
 * The value buffer holds the DATA's value, not a colour. The colormap is a 256-entry row and
 * the window is two uniforms, so changing either is a uniform write rather than a rebuild —
 * `columnLut.ts` makes this argument for the base colour and `valueLut.ts` extends it to the
 * colormap; a point cloud gets it for free by keeping value and colour apart.
 */
import * as THREE from "three";
import { NodeMaterial, StorageBufferAttribute, StorageInstancedBufferAttribute } from "three/webgpu";
import * as TSLTyped from "three/tsl";

/* eslint-disable @typescript-eslint/no-explicit-any */
const TSL = TSLTyped as any;
const {
  Fn,
  clamp,
  float,
  instanceIndex,
  max,
  mix,
  storage,
  texture,
  uniform,
  vec2,
  vec3,
  vec4,
  vertexIndex,
} = TSL;

export type PointMaterialNodes = {
  // `any`, for the reason the label material gives: a TSL uniform node carries the whole
  // operator surface at runtime, and a `{ value }` type only ever described the slot a setter
  // writes to.
  uPointSize: any;
  uOpacity: any;
  uColorize: any;
  uValueMin: any;
  uValueMax: any;
  uClimMin: any;
  uClimMax: any;
};

export type PointMaterialBundle = {
  material: NodeMaterial;
  nodes: PointMaterialNodes;
  /** Rewritten when the colouring changes; positions are not. */
  values: StorageInstancedBufferAttribute;
  positions: StorageInstancedBufferAttribute;
  count: number;
  dispose: () => void;
};

/** A 1x1 white palette, bound from the start so a real one is a swap and not a recompile. */
const identityPalette = (): THREE.DataTexture => {
  const texture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, THREE.RGBAFormat);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
};

/**
 * The six corners of a quad, from the vertex index alone.
 *
 * Two triangles, wound (0,1,2)(2,1,3) over the unit square centred on the origin. Deriving them
 * arithmetically rather than from a geometry attribute is what lets the mesh carry no per-vertex
 * data at all: the only buffers bound are the two storage ones, both indexed per INSTANCE.
 */
const emitCorner = (): any => {
  const index = vertexIndex.mod(6);
  // 0,1,2,2,1,3 -> the two triangles of the square
  const corner = index.lessThan(3).select(index, index.sub(3).oneMinus().add(2));
  const x = corner.mod(2).toFloat().sub(0.5);
  const y = corner.div(2).floor().toFloat().sub(0.5);
  return vec2(x, y);
};

export const createPointMaterial = (
  positions: Float32Array,
  values: Float32Array,
  stride: 2 | 3,
  /**
   * The cull pass's survivor list, when one is running.
   *
   * With it, `instanceIndex` is a cursor into the survivors and the point is
   * `visible[instanceIndex]`; without it the two are the same number. That indirection is the
   * whole cost of GPU culling on the draw side — one extra storage read per vertex.
   */
  visible?: { attribute: StorageBufferAttribute; count: number } | null,
): PointMaterialBundle => {
  const count = values.length;
  const positionBuffer = new StorageInstancedBufferAttribute(positions, stride);
  const valueBuffer = new StorageInstancedBufferAttribute(values, 1);

  const nodes: PointMaterialNodes = {
    uPointSize: uniform(3, "float"),
    uOpacity: uniform(1, "float"),
    uColorize: uniform(0, "float"),
    uValueMin: uniform(0, "float"),
    uValueMax: uniform(1, "float"),
    uClimMin: uniform(0, "float"),
    uClimMax: uniform(1, "float"),
  };
  const palette = texture(identityPalette());

  const positionNode = storage(positionBuffer, stride === 3 ? "vec3" : "vec2", count);
  const valueNode = storage(valueBuffer, "float", count);
  const visibleNode = visible ? storage(visible.attribute, "uint", visible.count) : null;
  // Resolved once and reused by both stages, so the two cannot disagree about which point a
  // drawn instance is.
  const pointIndex = visibleNode ? visibleNode.element(instanceIndex) : instanceIndex;

  const material = new NodeMaterial();
  material.transparent = true;
  material.depthWrite = false;

  // The quad is billboarded in VIEW space, so a point keeps its size and facing however the
  // layer's affine rotates or shears the data. `placementInvariance` is what says whether that
  // size is a well-defined length at all -- from SIMILARITY up -- and the layer badges it.
  material.vertexNode = Fn(() => {
    const centre = positionNode.element(pointIndex);
    const world = stride === 3 ? vec3(centre) : vec3(centre.x, centre.y, float(0));
    const view = TSL.modelViewMatrix.mul(vec4(world, 1.0));
    const corner = emitCorner();
    return TSL.cameraProjectionMatrix.mul(
      vec4(view.xyz.add(vec3(corner.x, corner.y, float(0)).mul(nodes.uPointSize)), 1.0),
    );
  })();

  material.fragmentNode = Fn(() => {
    // A round point: the quad is a billboard and its corners are not part of the mark.
    const corner = emitCorner();
    TSL.Discard(corner.length().greaterThan(0.5));

    const raw = valueNode.element(pointIndex);
    const span = max(nodes.uClimMax.sub(nodes.uClimMin), float(1e-9));
    const t = clamp(raw.sub(nodes.uClimMin).div(span), 0.0, 1.0);
    const mapped = palette.sample(vec2(t, 0.5)).rgb;
    // Uncoloured points draw flat white rather than sampling a palette nothing selected.
    const rgb = mix(vec3(1.0), mapped, nodes.uColorize);
    return vec4(rgb, nodes.uOpacity);
  })();

  return {
    material,
    nodes,
    values: valueBuffer,
    positions: positionBuffer,
    count,
    dispose: () => {
      material.dispose();
    },
  };
};

/**
 * Swap in a colouring: the value buffer and the two window uniforms.
 *
 * Positions are untouched, which is the point — a gene switch rewrites `values` and nothing
 * else, and the buffer is reused rather than reallocated.
 */
export const setPointValues = (
  bundle: PointMaterialBundle,
  values: Float32Array,
  window: { valueMin: number; valueMax: number },
): void => {
  (bundle.values.array as Float32Array).set(values.subarray(0, bundle.count));
  bundle.values.needsUpdate = true;
  bundle.nodes.uValueMin.value = window.valueMin;
  bundle.nodes.uValueMax.value = window.valueMax;
};
