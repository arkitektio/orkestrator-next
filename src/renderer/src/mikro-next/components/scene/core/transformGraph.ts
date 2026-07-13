/**
 * Client-side composition of the scene's coordinate-transformation graph.
 *
 * The server ships transformations as EDGES (`input CS -> output CS`) and
 * never resolves a `toWorld` path — the same dataset can sit in two scenes
 * under two different registrations, so composition is a per-scene client
 * concern. This module walks the graph once per layer (at scene-store
 * creation) and folds the chain
 *
 *   lens.toParent  ∘  dataArrays[level 0].toParent  ∘  (dataset CS → world CS)
 *
 * into the single spatial 4×4 `affineMatrix` (x, y, z row order) that
 * `worldTransform.affineToMatrix4` and everything downstream of it already
 * consume. The octree planner, culling and slab math are untouched: they see
 * one voxel→world matrix per layer, exactly as before the schema change.
 *
 * Transformation arrays (`scale`, `translation`, affine rows/columns) are in
 * the axis order of their edge's input coordinate system; the spatial subset
 * is extracted by axis NAME via the lens' server-derived `renderAxes`.
 * Anything the evaluator cannot interpret (displacement fields, bijections,
 * axis permutations) degrades to identity with a console warning rather than
 * rendering the layer somewhere wrong silently.
 */

/** Structural subset of a generated `Transformation` fragment (any variant). */
export type TransformLike = {
  __typename?: string;
  kind?: string;
  input?: { id: string; name?: string | null } | null;
  output?: { id: string; name?: string | null } | null;
  scale?: readonly number[] | null;
  translation?: readonly number[] | null;
  affine?: readonly (readonly number[])[] | null;
  inputAxes?: readonly string[] | null;
  outputAxes?: readonly string[] | null;
  transformations?: readonly TransformLike[] | null;
} | null;

export type CoordinateSystemLike = {
  id: string;
  name?: string | null;
  axes?: readonly { name: string }[] | null;
} | null;

/** Structural subset of the `Scene` fragment this module needs. */
export type SceneTransformContext = {
  worldCoordinateSystem?: CoordinateSystemLike;
  coordinateSystems?: readonly NonNullable<CoordinateSystemLike>[] | null;
  coordinateTransformations?: readonly NonNullable<TransformLike>[] | null;
};

/** Structural subset of an `ImageLayer` fragment this module needs. */
export type LayerTransformSource = {
  lens: {
    dims: readonly string[];
    renderAxes: { x: string; y: string; z?: string | null };
    toParent?: TransformLike;
    dataset: {
      coordinateSystem?: CoordinateSystemLike;
      dataArrays: readonly {
        level: number;
        toParent?: TransformLike;
      }[];
    };
  };
};

/** Row-major 4×4, rows = [x', y', z', w] — the shape `affineToMatrix4` takes. */
type Mat4 = number[][];

const identity4 = (): Mat4 => [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

/** a · b (apply b first, then a) for column-vector convention. */
const mul4 = (a: Mat4, b: Mat4): Mat4 => {
  const out = identity4();
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      out[r][c] = a[r][0] * b[0][c] + a[r][1] * b[1][c] + a[r][2] * b[2][c] + a[r][3] * b[3][c];
  return out;
};

const isIdentity4 = (m: Mat4): boolean =>
  m.every((row, r) => row.every((v, c) => v === (r === c ? 1 : 0)));

/**
 * Evaluate one transformation edge into the spatial 4×4.
 *
 * `axesIn` / `axesOut` are the FULL axis-name orders of the edge's input and
 * output systems; `spatial` the [x, y, z] axis names (z null for 2D data).
 * Returns null when the edge (or a composite child) cannot be interpreted.
 */
export const evalTransform = (
  transform: TransformLike,
  axesIn: readonly string[],
  axesOut: readonly string[],
  spatial: readonly (string | null | undefined)[],
): Mat4 | null => {
  if (!transform) return identity4();
  const typename = transform.__typename ?? "";

  const inPos = spatial.map((name) => (name ? axesIn.indexOf(name) : -1));
  const outPos = spatial.map((name) => (name ? axesOut.indexOf(name) : -1));

  switch (typename) {
    case "IdentityTransformation":
      return identity4();
    case "ScaleTransformation": {
      const m = identity4();
      spatial.forEach((_, i) => {
        const p = inPos[i];
        if (p !== -1) m[i][i] = transform.scale?.[p] ?? 1;
      });
      return m;
    }
    case "TranslationTransformation": {
      const m = identity4();
      spatial.forEach((_, i) => {
        const p = inPos[i];
        if (p !== -1) m[i][3] = transform.translation?.[p] ?? 0;
      });
      return m;
    }
    case "AffineTransformation":
    case "RotationTransformation": {
      // M × (N+1), rows in output axis order, columns in input axis order,
      // last column the translation.
      const rows = transform.affine;
      if (!rows?.length) return null;
      const m = identity4();
      for (let i = 0; i < spatial.length; i++) {
        const r = outPos[i];
        if (r === -1 || !rows[r]) continue;
        for (let j = 0; j < spatial.length; j++) {
          const c = inPos[j];
          m[i][j] = c !== -1 ? rows[r][c] ?? (i === j ? 1 : 0) : i === j ? 1 : 0;
        }
        m[i][3] = rows[r][axesIn.length] ?? 0;
      }
      return m;
    }
    case "SequenceTransformation":
    case "ByDimensionTransformation": {
      // Children are applied first to last and omit their own input/output
      // (the composite supplies them); ByDimension children act on axis
      // subsets, which the name-based extraction above already handles.
      let m = identity4();
      for (const child of transform.transformations ?? []) {
        const cm = evalTransform(child, axesIn, axesOut, spatial);
        if (!cm) return null;
        m = mul4(cm, m);
      }
      return m;
    }
    default:
      // MapAxis / Bijection / Displacements (and future kinds): not
      // representable as a spatial affine here.
      return null;
  }
};

const warnedEdges = new Set<string>();
const warnOnce = (key: string, message: string) => {
  if (warnedEdges.has(key)) return;
  warnedEdges.add(key);
  console.warn(`[transformGraph] ${message}`);
};

/** CS id → axis-name order, from every system the scene fragment resolves. */
const buildAxesIndex = (scene: SceneTransformContext): Map<string, string[]> => {
  const axesById = new Map<string, string[]>();
  for (const cs of scene.coordinateSystems ?? []) {
    if (cs?.axes?.length) axesById.set(cs.id, cs.axes.map((axis) => axis.name));
  }
  const world = scene.worldCoordinateSystem;
  if (world?.axes?.length) axesById.set(world.id, world.axes.map((axis) => axis.name));
  return axesById;
};

/**
 * Generic CS → world composition for things that are not image layers (mesh
 * collections, ROIs): BFS from `startCsId` to the scene's world system over
 * the scene edges plus any `extraEdges` (e.g. dataset `toParent` edges
 * gathered from the scene's layers — an edge is an edge wherever the API
 * delivered it). Returns null when no path exists or `startCsId` IS world —
 * callers treat null as identity.
 */
export function composeCsToWorld(
  scene: SceneTransformContext,
  startCsId: string,
  spatial: readonly (string | null | undefined)[],
  extraEdges: readonly NonNullable<TransformLike>[] = [],
  fallbackAxes: readonly string[] = ["z", "y", "x"],
): number[][] | null {
  const worldId = scene.worldCoordinateSystem?.id;
  if (!worldId || startCsId === worldId) return null;

  const axesById = buildAxesIndex(scene);
  const axesOf = (cs: { id: string } | null | undefined): readonly string[] =>
    (cs && axesById.get(cs.id)) ?? fallbackAxes;

  const edges = [...(scene.coordinateTransformations ?? []), ...extraEdges];
  const path = findPath(edges, startCsId, worldId);
  if (!path) return null;

  let m = identity4();
  for (const edge of path) {
    const em = evalTransform(edge, axesOf(edge.input), axesOf(edge.output), spatial);
    if (!em) {
      warnOnce(
        `cs-edge:${edge.__typename}:${startCsId}`,
        `cannot evaluate ${edge.__typename} on the path from CS ${startCsId}; treating as identity`,
      );
      continue;
    }
    m = mul4(em, m);
  }
  return isIdentity4(m) ? null : m;
}

/**
 * Gather the dataset-level edges (lens / pyramid `toParent`s) the scene's
 * image layers carry, as a BFS edge pool for `composeCsToWorld` — a mesh
 * collection anchored to `labels/0` reaches world through the labels
 * dataset's own level edge plus the scene registration.
 */
export function collectDatasetEdges(
  layers: readonly {
    lens?: {
      toParent?: TransformLike;
      dataset?: { dataArrays?: readonly { toParent?: TransformLike }[] | null } | null;
    } | null;
  }[],
): NonNullable<TransformLike>[] {
  const edges: NonNullable<TransformLike>[] = [];
  for (const layer of layers) {
    if (layer.lens?.toParent) edges.push(layer.lens.toParent);
    for (const dataArray of layer.lens?.dataset?.dataArrays ?? []) {
      if (dataArray.toParent) edges.push(dataArray.toParent);
    }
  }
  return edges;
}

/**
 * Compose a layer's voxel→world spatial affine from the scene graph.
 * Every unresolvable piece degrades to identity (matching the pre-graph
 * behavior of a null `affineMatrix`), never to a wrong matrix.
 */
export function composeLayerAffine(
  scene: SceneTransformContext,
  layer: LayerTransformSource,
): number[][] | null {
  const dims = layer.lens.dims;
  const ra = layer.lens.renderAxes;
  const spatial = [ra.x, ra.y, ra.z] as const;

  // Axis order per CS id, for scene-level edges whose systems differ from the
  // array's dim order. Fallback: the layer's own dim order.
  const axesById = buildAxesIndex(scene);
  const world = scene.worldCoordinateSystem;
  const axesOf = (cs: { id: string } | null | undefined): readonly string[] =>
    (cs && axesById.get(cs.id)) ?? dims;

  const evalEdgeOrIdentity = (transform: TransformLike, label: string): Mat4 => {
    if (!transform) return identity4();
    const m = evalTransform(transform, axesOf(transform.input), axesOf(transform.output), spatial);
    if (m) return m;
    warnOnce(label, `cannot evaluate ${transform.__typename} for ${label}; treating as identity`);
    return identity4();
  };

  // lens voxel → level-0 voxel (crop translation; identity when unsliced)
  let m = evalEdgeOrIdentity(layer.lens.toParent ?? null, "lens.toParent");

  // level-0 voxel → dataset physical (absolute voxel size)
  const level0 = layer.lens.dataset.dataArrays.reduce<
    LayerTransformSource["lens"]["dataset"]["dataArrays"][number] | null
  >((best, da) => (best === null || da.level < best.level ? da : best), null);
  m = mul4(evalEdgeOrIdentity(level0?.toParent ?? null, "dataArray.toParent"), m);

  // dataset physical → scene world: BFS over the scene's edges.
  const startId = layer.lens.dataset.coordinateSystem?.id;
  const worldId = world?.id;
  if (startId && worldId && startId !== worldId) {
    const edges = scene.coordinateTransformations ?? [];
    const path = findPath(edges, startId, worldId);
    if (path) {
      for (const edge of path) m = mul4(evalEdgeOrIdentity(edge, `edge ${edge.__typename}`), m);
    } else {
      warnOnce(
        `path:${startId}->${worldId}`,
        `no transformation path from CS ${startId} to world ${worldId}; layer stays in its physical frame`,
      );
    }
  }

  return isIdentity4(m) ? null : m;
}

/** Shortest forward path start→goal over the edge list (graphs are tiny). */
const findPath = (
  edges: readonly NonNullable<TransformLike>[],
  startId: string,
  goalId: string,
): NonNullable<TransformLike>[] | null => {
  const queue: { at: string; path: NonNullable<TransformLike>[] }[] = [{ at: startId, path: [] }];
  const seen = new Set([startId]);
  while (queue.length) {
    const { at, path } = queue.shift()!;
    if (at === goalId) return path;
    for (const edge of edges) {
      const from = edge.input?.id;
      const to = edge.output?.id;
      if (from !== at || !to || seen.has(to)) continue;
      seen.add(to);
      queue.push({ at: to, path: [...path, edge] });
    }
  }
  return null;
};
