import * as THREE from "three";
import { MeshBasicNodeMaterial, StorageBufferAttribute } from "three/webgpu";
import * as TSLTyped from "three/tsl";

// Same escape hatch as `brickNodeMaterials.ts` and `pointsMaterial.ts`: three's
// TSL TypeScript surface lags the runtime API (node method chaining is typed
// dynamically).
/* eslint-disable @typescript-eslint/no-explicit-any */
const TSL = TSLTyped as any;
const {
  Fn,
  abs,
  cameraProjectionMatrix,
  clamp,
  cross,
  float,
  instanceIndex,
  max,
  mix,
  modelViewMatrix,
  normalView,
  normalize,
  positionGeometry,
  select,
  storage,
  texture,
  uniform,
  varying,
  vec2,
  vec3,
  vec4,
} = TSL;

/**
 * The network layer's GPU bundle: storage buffers, materials and meshes.
 *
 * ## Storage-buffer vertex pulling, not per-instance attributes
 *
 * The graph is uploaded ONCE per plan as what it already is — a node table and
 * an edge list — and every draw fetches through `instanceIndex`:
 *
 *  - `positions` (vec3/node) + `aux` (radius, ordinal, glyphScale / node),
 *    each node stored ONCE. The attribute path duplicated every shared
 *    endpoint into per-edge `segStart`/`segEnd` copies — 36 B an edge against
 *    8 B here, before counting the 64 B/instance matrices the glyphs carried.
 *  - `edges`: uint32 index pairs into the node table, exactly the decode
 *    format, so the CPU "build" is a memcpy plus an index rebase.
 *
 * The same pattern `pointsMaterial.ts` ships (and the WebGPU-only argument it
 * makes — the scene hard-requires the WebGPU backend, so this takes the WebGPU
 * path rather than the portable one). Buffers are allocated at a fixed
 * capacity and updated by writing `.array` + `needsUpdate`; the node graphs
 * are authored ONCE and `instanceCount` is the only per-plan draw state —
 * three reads it fresh every draw, and 0 skips the draw entirely.
 *
 * ## Segments are camera-facing quads, not GL lines
 *
 * The schema says so in as many words, and it is not a stylistic preference:
 * `gl.LINES` has a width of exactly one pixel on every desktop GL/WebGPU
 * backend, so a line primitive cannot express `lineWidth` in SCENE UNITS at
 * all. A quad can. The vertex program expands the unit quad in VIEW SPACE:
 *
 * ```
 *   p    = mix(viewStart, viewEnd, t)          t ∈ {0, 1} along the segment
 *   r    = mix(startRadius, endRadius, t)      ← the TAPER
 *   side = normalize(cross(axis, toEye))       ← camera-facing
 *   clip = projection · (p + side · sign · r)
 * ```
 *
 * ## Nodes and arrowheads are real triangles
 *
 * Deliberately not points or sprites: OCTREE_RENDERER.md §7 records that those
 * are never occluders in the volume pass, so a network drawn with them would
 * be invisible behind volume data it is actually in front of. But they are
 * UNLIT `MeshBasicNodeMaterial` with a one-dot hemisphere shade rather than
 * PBR — performance over fidelity, by request — and they are placed by the
 * vertex program from the shared node table, so they carry no instance
 * matrices at all. A ghost's `glyphScale` is 0: its sphere degenerates to a
 * point instead of double-drawing the node its owner already glyphs.
 *
 * ## Everything the UI touches is a uniform
 *
 * `lineWidth` is `uHalfWidth`, consulted only where a node's stored radius is
 * 0 (a radii-less collection). Selection/isolate are uniforms in the compiled
 * program. Nothing the card can do rebuilds a pipeline or reallocates a
 * buffer — the rule `fabriksMaterial.ts` states, now with no exceptions.
 */

/** Cheap glyphs: a network can carry a lot of nodes, and a branch point only
 *  has to read as round. */
const NODE_SEGMENTS = 6;

export type NetworkUniforms = {
  /** The selected object's ordinal; -1 = no selection. */
  selectedOrdinal: any;
  /** 1 = draw ONLY the selected object; 0 = draw all. */
  isolate: any;
  /** Half the layer's flat `lineWidth`, used where a node's stored radius is 0. */
  uHalfWidth: any;
  /** 1 = colour by the packed `values` through the palette; 0 = flat material. */
  uColorize: any;
  /** The colormap window: `uClimMin` maps to the palette's bottom, `uClimMax`
   *  to its top. A window nudge is these two writes and nothing else. */
  uClimMin: any;
  uClimMax: any;
  /** 1 = the colouring paints node glyphs too (target NODE); 0 = segments and
   *  arrows only (target EDGE), glyphs staying at the material colour. */
  uApplyToGlyphs: any;
  /** Which buffer a segment's (and arrow's) value comes from: 0 = the node
   *  buffer via the START node (graph attributes, object-level and per-node
   *  colourings), 1 = the edge buffer via `instanceIndex` (a per-EDGE-table
   *  colouring, whose rows key (source, target) pairs and cannot be a node's).
   *  Glyphs never read the edge buffer — an edge colouring always ships
   *  `applyToGlyphs: false`. */
  uValueSource: any;
};

/** Created by the manager at construction, BEFORE any bundle exists, so
 *  selection and width writes are always safe. */
export const createNetworkUniforms = (): NetworkUniforms => ({
  selectedOrdinal: uniform(-1),
  isolate: uniform(0),
  uHalfWidth: uniform(0.5, "float"),
  uColorize: uniform(0, "float"),
  uClimMin: uniform(0, "float"),
  uClimMax: uniform(1, "float"),
  uApplyToGlyphs: uniform(1, "float"),
  uValueSource: uniform(0, "float"),
});

/** A 1x1 white palette, bound from the start so a real row is a texture swap
 *  and never a recompile — `pointsMaterial.ts`'s move. */
const identityPalette = (): THREE.DataTexture => {
  const tex = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, THREE.RGBAFormat);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
};

export type NetworkGpuBundle = {
  capacity: { nodes: number; edges: number };
  /** `capacity.nodes * 3` floats; write `.array`, flip `needsUpdate`. */
  positions: StorageBufferAttribute;
  /** `capacity.nodes * 4` floats — (radius, ordinal, glyphScale, visible). */
  aux: StorageBufferAttribute;
  /** `capacity.nodes` floats — the active colouring's value per node slot. */
  values: StorageBufferAttribute;
  /** `capacity.edges` floats — a per-EDGE colouring's value per packed edge,
   *  read only when `uValueSource` selects the edge buffer. */
  edgeValues: StorageBufferAttribute;
  /** `capacity.edges * 2` uint32 node indices. */
  edges: StorageBufferAttribute;
  segmentMaterial: MeshBasicNodeMaterial;
  glyphMaterial: MeshBasicNodeMaterial;
  arrowMaterial: MeshBasicNodeMaterial;
  segments: THREE.Mesh;
  nodeGlyphs: THREE.Mesh;
  arrowGlyphs: THREE.Mesh;
  /** Swap the colormap row all three materials sample. A texture swap, never a
   *  recompile; pass null to go back to the identity (flat white) row. */
  setPalette: (row: THREE.DataTexture | null) => void;
  /** Per-plan draw state — three reads `instanceCount` fresh every draw. */
  setCounts: (nodes: number, edges: number) => void;
  /** Flip `needsUpdate` on the four attributes after a pack. */
  markUploaded: () => void;
  dispose: () => void;
};

/** The unit quad every segment instance is expanded from.
 *
 * Two triangles, four vertices. `position.x` is `t` along the segment and
 * `position.y` is the side sign — the geometry carries no geometry, only the
 * parameterisation, because every real coordinate is pulled per instance. */
export function createSegmentQuad(): THREE.InstancedBufferGeometry {
  const geometry = new THREE.InstancedBufferGeometry();
  // (t, side)
  const corners = new Float32Array([0, -1, 0, 0, 1, 0, 1, 1, 0, 1, -1, 0]);
  geometry.setAttribute("position", new THREE.BufferAttribute(corners, 3));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  return geometry;
}

/** A template geometry re-hosted as instanced, sans attributes nothing reads. */
const instancedFrom = (template: THREE.BufferGeometry): THREE.InstancedBufferGeometry => {
  const geometry = new THREE.InstancedBufferGeometry().copy(template as any);
  geometry.deleteAttribute("uv");
  template.dispose();
  return geometry;
};

export function createNetworkGpuBundle(
  capacity: { nodes: number; edges: number },
  uniforms: NetworkUniforms,
): NetworkGpuBundle {
  // A zero-size GPU buffer is an invalid binding; one spare slot is 28 bytes.
  const capNodes = Math.max(1, capacity.nodes);
  const capEdges = Math.max(1, capacity.edges);

  const positions = new StorageBufferAttribute(new Float32Array(capNodes * 3), 3);
  const aux = new StorageBufferAttribute(new Float32Array(capNodes * 4), 4);
  // Fresh slots default fully visible (the pack writes 3 = node bit + edge
  // bit), so an unstyled layer discards nothing.
  const values = new StorageBufferAttribute(new Float32Array(capNodes).fill(Number.NaN), 1);
  // NaN-filled like `values`: a slot the pack never wrote reads as "no value"
  // and keeps the base colour rather than sampling the palette's bottom.
  const edgeValues = new StorageBufferAttribute(new Float32Array(capEdges).fill(Number.NaN), 1);
  const edges = new StorageBufferAttribute(new Uint32Array(capEdges * 2), 1);

  // Storage nodes created ONCE and shared by every material: read-only in
  // draw stages is automatic on this three version, and sharing the node
  // objects is what keeps the three programs reading one copy of the graph.
  const positionsNode = storage(positions, "vec3", capNodes);
  const auxNode = storage(aux, "vec4", capNodes);
  const valuesNode = storage(values, "float", capNodes);
  const edgeValuesNode = storage(edgeValues, "float", capEdges);
  // Flat "uint" pairs rather than "uvec2": the flat read is the in-repo
  // precedent (`pointsCompute.ts`), and two element() loads cost nothing next
  // to the matrix multiplies.
  const edgesNode = storage(edges, "uint", capEdges * 2);

  // One shared texture NODE, three programs: swapping `.value` re-binds, it
  // does not recompile.
  const paletteIdentity = identityPalette();
  const paletteNode = texture(paletteIdentity);

  /** A node's drawn half-width: its stored radius, or the layer's flat width
   *  where the collection carries none (packed as 0). THE line that makes a
   *  width drag a uniform write for every collection. */
  const radiusAt = (index: any): any => {
    const r = auxNode.element(index).x;
    return select(r.greaterThan(float(0)), r, uniforms.uHalfWidth);
  };

  /**
   * The packed value mapped through the palette, or the base colour where no
   * colouring is active or the node has no answer. `value.equal(value)` is the
   * NaN test: comparisons with NaN are false on the GPU as on the CPU, and NaN
   * is the pack's spelling for "no value" — such a node keeps the material
   * colour rather than sampling the palette's bottom, the identity-fill rule
   * every other picker keeps.
   */
  const colourFor = (value: any, applies: any): any => {
    const span = max(uniforms.uClimMax.sub(uniforms.uClimMin), float(1e-9));
    const t = clamp(value.sub(uniforms.uClimMin).div(span), 0.0, 1.0);
    const mapped = paletteNode.sample(vec2(t, 0.5)).rgb;
    const painted = float(uniforms.uColorize)
      .greaterThan(0.5)
      .and(float(applies).greaterThan(0.5))
      .and(value.equal(value));
    return select(painted, vec3(mapped), vec3(TSL.materialColor));
  };

  // --- segments -------------------------------------------------------------

  const segmentMaterial = new MeshBasicNodeMaterial();
  segmentMaterial.color = new THREE.Color(0.85, 0.86, 0.9);
  segmentMaterial.transparent = true;
  // A quad expanded in the vertex program has no meaningful facing — the two
  // triangles wind either way depending on which side of the camera the
  // segment passes — so culling would drop half of every network.
  segmentMaterial.side = THREE.DoubleSide;

  segmentMaterial.vertexNode = Fn(() => {
    const t = positionGeometry.x;
    const sideSign = positionGeometry.y;

    const a = edgesNode.element(instanceIndex.mul(2));
    const b = edgesNode.element(instanceIndex.mul(2).add(1));
    const start = positionsNode.element(a);
    const end = positionsNode.element(b);
    const startRadius = radiusAt(a);
    const endRadius = radiusAt(b);

    const viewStart = modelViewMatrix.mul(vec4(start, 1.0)).xyz;
    const viewEnd = modelViewMatrix.mul(vec4(end, 1.0)).xyz;

    const centre = mix(viewStart, viewEnd, t);
    const radius = mix(startRadius, endRadius, t);

    const delta = viewEnd.sub(viewStart);
    // A zero-length edge has no axis. It is legal data — two nodes at one
    // position — so it degenerates to a fixed axis rather than to NaN, which
    // would propagate through `cross` and blank the whole draw.
    const axis = select(delta.length().greaterThan(float(1e-12)), normalize(delta), vec3(1, 0, 0));

    // The camera is at the origin in view space, so "toward the eye" is just
    // the negated position — no inverse matrix, no camera uniform.
    const toEye = normalize(centre.negate());
    const perpendicular = cross(axis, toEye);
    // Degenerate when the segment points straight at the camera; any
    // perpendicular will do there, since the quad is edge-on either way.
    const side = select(
      perpendicular.length().greaterThan(float(1e-12)),
      normalize(perpendicular),
      vec3(0, 1, 0),
    );

    return cameraProjectionMatrix.mul(vec4(centre.add(side.mul(sideSign).mul(radius)), 1.0));
  })();

  segmentMaterial.colorNode = Fn(() => {
    // Everything per-edge is its START node's — ordinal, value, visibility —
    // as the CPU path always defined it: an edge owns no durable identity of
    // its own. `varying(...)` evaluates the storage reads in the VERTEX stage
    // — where `instanceIndex` is the true builtin — and the value is constant
    // across the quad, so interpolation is exact.
    const startIndex = edgesNode.element(instanceIndex.mul(2));
    const auxRow = auxNode.element(startIndex);
    const ordinal = varying(auxRow.y);
    // aux.w packs two visibility bits: +1 the node's own (glyphs), +2 the
    // edge's (segments and arrows). Legal values 0, 1 and 3 — a hidden node
    // takes its outgoing segments with it, so 2 never occurs.
    const visibility = varying(auxRow.w);
    // Where the value comes from is `uValueSource`: the node buffer via the
    // start node (every per-node source), or the edge buffer via this
    // instance's own index (a per-edge-table colouring — its rows key
    // (source, target) pairs, which no single node owns).
    const value = varying(
      select(
        float(uniforms.uValueSource).greaterThan(0.5),
        edgeValuesNode.element(instanceIndex),
        valuesNode.element(startIndex),
      ),
    );
    TSL.Discard(visibility.lessThan(1.5));
    // Float equality is exact here: ordinals are integers well under 2^24.
    const selected = ordinal.equal(float(uniforms.selectedOrdinal));
    TSL.Discard(float(uniforms.isolate).greaterThan(0.5).and(selected.not()));
    const base = colourFor(value, float(1));
    // ~35% toward white: the identified object pops without a recompile.
    return select(selected, mix(vec3(base), vec3(1.0), 0.35), vec3(base));
  })();

  const segments = new THREE.Mesh(createSegmentQuad(), segmentMaterial);
  // The vertex program places every instance, so the bounding volume three
  // would compute is meaningless — and a wrong one culls the whole network
  // the moment the quad's origin leaves the frustum.
  segments.frustumCulled = false;
  segments.renderOrder = 1;

  // --- glyph shading, shared ------------------------------------------------

  // One dot product of hemisphere shade so a sphere still reads as a sphere.
  // For spheres the geometry normal is exact (uniform scale + translate); for
  // cones it ignores the per-edge rotation, which is accepted — the shade is a
  // depth cue, not lighting. `nodeIndex` is which node table row this instance
  // stands on: the instance itself for a sphere, the edge's START node for an
  // arrow — the same derivation rule the segments use.
  // `valueOverride`, when given, replaces the node-buffer read — the arrows
  // pass the same source select the segments use, so an edge colouring paints
  // its arrowheads from the edge buffer too.
  const glyphColour = (nodeIndex: any, applies: any, edgeBit: boolean, valueOverride?: any): any => {
    const auxRow = auxNode.element(nodeIndex);
    const visibility = varying(auxRow.w);
    const value = varying(valueOverride ?? valuesNode.element(nodeIndex));
    // Node glyphs test the NODE bit (+1); arrows ride their segment and test
    // the EDGE bit (+2), exactly as the segment program does.
    TSL.Discard(
      edgeBit ? visibility.lessThan(1.5) : visibility.mod(2.0).lessThan(0.5),
    );
    const shade = max(normalView.z, float(0)).mul(0.45).add(0.55);
    return vec3(colourFor(value, applies)).mul(shade);
  };

  // --- node glyphs (spheres) ------------------------------------------------

  const glyphMaterial = new MeshBasicNodeMaterial();
  glyphMaterial.color = new THREE.Color(0.85, 0.86, 0.9);
  glyphMaterial.transparent = true;

  glyphMaterial.vertexNode = Fn(() => {
    const centre = positionsNode.element(instanceIndex);
    const auxRow = auxNode.element(instanceIndex);
    // glyphScale is 0 for a ghost: the sphere collapses and rasterizes nothing.
    const scale = radiusAt(instanceIndex).mul(auxRow.z);
    const local = positionGeometry.mul(scale).add(centre);
    return cameraProjectionMatrix.mul(modelViewMatrix.mul(vec4(local, 1.0)));
  })();
  // A node glyph paints only when the colouring targets nodes — a target=EDGE
  // entry leaves the spheres at the material colour, which is what makes the
  // two targets read differently at all.
  glyphMaterial.colorNode = Fn(() => glyphColour(instanceIndex, uniforms.uApplyToGlyphs, false))();

  const nodeGlyphs = new THREE.Mesh(
    instancedFrom(new THREE.SphereGeometry(1, NODE_SEGMENTS, NODE_SEGMENTS)),
    glyphMaterial,
  );
  nodeGlyphs.frustumCulled = false;
  nodeGlyphs.visible = false;

  // --- arrow glyphs (cones) -------------------------------------------------

  const arrowMaterial = new MeshBasicNodeMaterial();
  arrowMaterial.color = new THREE.Color(0.85, 0.86, 0.9);
  arrowMaterial.transparent = true;

  arrowMaterial.vertexNode = Fn(() => {
    const a = edgesNode.element(instanceIndex.mul(2));
    const b = edgesNode.element(instanceIndex.mul(2).add(1));
    const pa = positionsNode.element(a);
    const pb = positionsNode.element(b);

    const delta = vec3(pb).sub(pa);
    const len = delta.length();
    const valid = len.greaterThan(float(1e-12));
    const axis = select(valid, delta.div(len), vec3(0, 1, 0));

    // Branch-free orthonormal basis. The helper is never parallel to the
    // axis: it flips exactly when |axis.y| ≥ 0.99. The basis is [u, axis, w]
    // with w = cross(u, axis) — determinant +1, so the cone's winding (and
    // its FrontSide culling) survives the rotation.
    const helper = select(abs(axis.y).lessThan(float(0.99)), vec3(0, 1, 0), vec3(1, 0, 0));
    const u = normalize(cross(helper, axis));
    const w = cross(u, axis);

    // Scale as the CPU path did: 2.5× the target node's radius; a zero-length
    // edge collapses to a point rather than being skipped.
    const r = radiusAt(b).mul(2.5).mul(select(valid, float(1), float(0)));
    // The cone geometry is (1, 2, …): its tip sits at local +y = 1, so seating
    // it one length back puts the tip ON the node rather than past it.
    const seat = vec3(pb).sub(axis.mul(r));
    const local = positionGeometry;
    const placed = seat
      .add(u.mul(local.x.mul(r)))
      .add(axis.mul(local.y.mul(r)))
      .add(w.mul(local.z.mul(r)));
    return cameraProjectionMatrix.mul(modelViewMatrix.mul(vec4(placed, 1.0)));
  })();
  // An arrow is part of its segment, so it takes its segment's value — the
  // same `uValueSource` select — and the EDGE visibility bit; painted under
  // either target.
  arrowMaterial.colorNode = Fn(() =>
    glyphColour(
      edgesNode.element(instanceIndex.mul(2)),
      float(1),
      true,
      select(
        float(uniforms.uValueSource).greaterThan(0.5),
        edgeValuesNode.element(instanceIndex),
        valuesNode.element(edgesNode.element(instanceIndex.mul(2))),
      ),
    ),
  )();

  const arrowGlyphs = new THREE.Mesh(
    instancedFrom(new THREE.ConeGeometry(1, 2, NODE_SEGMENTS)),
    arrowMaterial,
  );
  arrowGlyphs.frustumCulled = false;
  arrowGlyphs.visible = false;

  // --- draw state and teardown ---------------------------------------------

  const geometries = [segments.geometry, nodeGlyphs.geometry, arrowGlyphs.geometry] as [
    THREE.InstancedBufferGeometry,
    THREE.InstancedBufferGeometry,
    THREE.InstancedBufferGeometry,
  ];
  for (const geometry of geometries) geometry.instanceCount = 0;

  return {
    capacity,
    positions,
    aux,
    values,
    edgeValues,
    edges,
    segmentMaterial,
    glyphMaterial,
    arrowMaterial,
    segments,
    nodeGlyphs,
    arrowGlyphs,
    setPalette: (row) => {
      const previous = paletteNode.value as THREE.Texture;
      paletteNode.value = row ?? paletteIdentity;
      if (previous !== paletteIdentity && previous !== paletteNode.value) previous.dispose();
    },
    setCounts: (nodes, edgeCount) => {
      geometries[0].instanceCount = edgeCount;
      geometries[1].instanceCount = nodes;
      geometries[2].instanceCount = edgeCount;
    },
    markUploaded: () => {
      positions.needsUpdate = true;
      aux.needsUpdate = true;
      values.needsUpdate = true;
      edgeValues.needsUpdate = true;
      edges.needsUpdate = true;
    },
    dispose: () => {
      for (const geometry of geometries) geometry.dispose();
      segmentMaterial.dispose();
      glyphMaterial.dispose();
      arrowMaterial.dispose();
      const bound = paletteNode.value as THREE.Texture;
      if (bound !== paletteIdentity) bound.dispose();
      paletteIdentity.dispose();
    },
  };
}
