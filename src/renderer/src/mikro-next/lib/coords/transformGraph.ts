/**
 * Client-side composition of the coordinate-transformation graph.
 *
 * The server ships transformations as EDGES (`input CS -> output CS`) and,
 * per scene layer, a resolved PATH of edges (`Layer.pathToWorld`:
 * `[{transformation, inverted}]`) from the layer's source system to the
 * scene's world system — a layer belongs to exactly one scene, so that path
 * has a single right answer and resolving it is a server fact, not a client
 * search. What stays client-side is turning edges into MATRICES: evaluating
 * each step (inverting the flagged ones) and folding the chain into the
 * single spatial 4×4 `affineMatrix` (x, y, z row order) that
 * `worldTransform.affineToMatrix4` and everything downstream of it already
 * consume. The octree planner, culling and slab math are untouched: they see
 * one voxel→world matrix per layer, exactly as before the schema change.
 *
 * Transformation arrays (`scale`, `translation`, affine rows/columns) are in
 * the axis order of their edge's input coordinate system; the spatial subset
 * is extracted by axis NAME via the lens' server-derived `renderAxes`.
 * Anything the evaluator cannot interpret (displacement fields, bijections,
 * axis permutations, singular inverses) degrades to identity with a console
 * warning rather than rendering the layer somewhere wrong silently.
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
  registrations?: readonly NonNullable<TransformLike>[] | null;
};

/** One step of a server-resolved placement path. */
export type PlacementStepLike = {
  transformation: TransformLike;
  /** Walk the edge output→input: invert its matrix before composing. */
  inverted: boolean;
};

/** Structural subset of an `ImageLayer` fragment this module needs. */
export type LayerTransformSource = {
  /** Server-resolved path to the scene's world system (null = unregistered). */
  pathToWorld?: readonly PlacementStepLike[] | null;
  lens: {
    axisNames: readonly string[];
    renderAxes: { x: string; y: string; z?: string | null };
    coordinateSystem?: { id: string } | null;
    toParent?: TransformLike;
    dataset: {
      intrinsicSystem?: CoordinateSystemLike;
      dataArrays: readonly {
        level: number;
        coordinateSystem?: { id: string } | null;
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
 * Inverse of an AFFINE 4×4 (last row 0,0,0,1 — every matrix this module
 * produces is one): invert the 3×3 block by adjugate, transform the
 * translation. Null when singular (degenerate edge; caller degrades).
 */
export const invert4 = (m: Mat4): Mat4 | null => {
  const a = m[0][0], b = m[0][1], c = m[0][2];
  const d = m[1][0], e = m[1][1], f = m[1][2];
  const g = m[2][0], h = m[2][1], i = m[2][2];
  const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  if (!Number.isFinite(det) || Math.abs(det) < 1e-12) return null;
  const r = [
    [(e * i - f * h) / det, (c * h - b * i) / det, (b * f - c * e) / det],
    [(f * g - d * i) / det, (a * i - c * g) / det, (c * d - a * f) / det],
    [(d * h - e * g) / det, (b * g - a * h) / det, (a * e - b * d) / det],
  ];
  const t = [m[0][3], m[1][3], m[2][3]];
  const out = identity4();
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) out[row][col] = r[row][col];
    out[row][3] = -(r[row][0] * t[0] + r[row][1] * t[1] + r[row][2] * t[2]);
  }
  return out;
};

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
      // Children are applied first to last. They self-describe their
      // parameter order (`inputAxes`/`outputAxes` — for ByDimension children
      // that is the SUBSET of axes they act on; unnamed axes pass through
      // untouched, which the name-based extraction handles by leaving
      // identity rows). Fall back to the composite's own axes for payloads
      // predating self-description.
      let m = identity4();
      for (const child of transform.transformations ?? []) {
        const cm = evalTransform(
          child,
          child?.inputAxes ?? axesIn,
          child?.outputAxes ?? axesOut,
          spatial,
        );
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

// Intentional module-level dedupe set for one-time diagnostics, capped so an
// app-lifetime consumer can't grow it without bound (past the cap, warn-once
// degrades to warn-never — acceptable for a diagnostics channel).
const WARNED_EDGES_CAP = 256;
const warnedEdges = new Set<string>();
const warnOnce = (key: string, message: string) => {
  if (warnedEdges.has(key) || warnedEdges.size >= WARNED_EDGES_CAP) return;
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
 * Compose a server-resolved placement path (`pathToWorld` /
 * `levelPaths[].path`) into one spatial 4×4. Steps are applied first-to-last;
 * an `inverted` step is evaluated forward and then matrix-inverted (the
 * server flags edges it traversed output→input). Unresolvable steps —
 * unrepresentable kinds or singular inverses — warn once and degrade to
 * identity, never to a wrong matrix. Returns null for a null path
 * (unregistered) and for an identity result (callers treat null as identity).
 */
export function composePlacementPath(
  steps: readonly PlacementStepLike[] | null | undefined,
  scene: SceneTransformContext,
  spatial: readonly (string | null | undefined)[],
  fallbackAxes: readonly string[] = ["z", "y", "x"],
): number[][] | null {
  if (!steps) return null;

  const axesById = buildAxesIndex(scene);
  const axesOf = (cs: { id: string } | null | undefined): readonly string[] =>
    (cs && axesById.get(cs.id)) ?? fallbackAxes;

  let m = identity4();
  for (const step of steps) {
    const edge = step.transformation;
    if (!edge) continue;
    // SELF-DESCRIBED axis order first (`inputAxes`/`outputAxes` on the
    // edge — non-null since the strict schema landed); the CS-index fallback
    // remains for the world system and structural robustness.
    let em = evalTransform(
      edge,
      edge.inputAxes ?? axesOf(edge.input),
      edge.outputAxes ?? axesOf(edge.output),
      spatial,
    );
    if (em && step.inverted) em = invert4(em);
    if (!em) {
      warnOnce(
        `step:${edge.__typename}:${edge.input?.id ?? "?"}:${step.inverted}`,
        `cannot evaluate ${step.inverted ? "inverted " : ""}${edge.__typename} placement step; treating as identity`,
      );
      continue;
    }
    m = mul4(em, m);
  }
  return isIdentity4(m) ? null : m;
}

/** Source CS id of a path's first step (where the walk starts). */
const pathStartId = (steps: readonly PlacementStepLike[]): string | undefined => {
  const first = steps[0];
  if (!first?.transformation) return undefined;
  return (first.inverted ? first.transformation.output : first.transformation.input)?.id;
};

/**
 * Compose a layer's lens-voxel→world spatial affine.
 *
 * `pathToWorld` starts at the layer's SOURCE system — but the renderer's
 * voxel frame is the LENS grid, so any prefix the path does not cover
 * (lens → level-0 crop, level-0 → intrinsic) is prepended from the lens' and
 * level-0's own `toParent` edges, keyed off the path's actual start CS. A
 * null path (unregistered layer) composes just the local prefix, keeping the
 * layer in its intrinsic pixel frame — the established degradation.
 */
export function composeLayerAffine(
  scene: SceneTransformContext,
  layer: LayerTransformSource,
): number[][] | null {
  const dims = layer.lens.axisNames;
  const ra = layer.lens.renderAxes;
  const spatial = [ra.x, ra.y, ra.z] as const;

  const axesById = buildAxesIndex(scene);
  const axesOf = (cs: { id: string } | null | undefined): readonly string[] =>
    (cs && axesById.get(cs.id)) ?? dims;

  const evalEdgeOrIdentity = (transform: TransformLike, label: string): Mat4 => {
    if (!transform) return identity4();
    // Self-described axis order first (see composePlacementPath).
    const m = evalTransform(
      transform,
      transform.inputAxes ?? axesOf(transform.input),
      transform.outputAxes ?? axesOf(transform.output),
      spatial,
    );
    if (m) return m;
    warnOnce(label, `cannot evaluate ${transform.__typename} for ${label}; treating as identity`);
    return identity4();
  };

  const level0 = layer.lens.dataset.dataArrays.reduce<
    LayerTransformSource["lens"]["dataset"]["dataArrays"][number] | null
  >((best, da) => (best === null || da.level < best.level ? da : best), null);

  const path = layer.pathToWorld;
  const startId = path?.length ? pathStartId(path) : undefined;
  const lensCsId = layer.lens.coordinateSystem?.id;
  const level0CsId = level0?.coordinateSystem?.id;

  // Local prefix: everything between the lens grid and the path's start.
  let m = identity4();
  const pathStartsAtLens = startId !== undefined && startId === lensCsId;
  const pathStartsAtLevel0 = startId !== undefined && startId === level0CsId;
  if (!pathStartsAtLens) {
    // lens voxel → level-0 voxel (crop translation; identity when unsliced)
    m = evalEdgeOrIdentity(layer.lens.toParent ?? null, "lens.toParent");
    if (!pathStartsAtLevel0) {
      // level-0 voxel → intrinsic pixels (relative pyramid factor; ≈identity)
      m = mul4(evalEdgeOrIdentity(level0?.toParent ?? null, "dataArray.toParent"), m);
    }
  }

  if (path) {
    const pathMatrix = composePlacementPath(path, scene, spatial, dims);
    if (pathMatrix) m = mul4(pathMatrix, m);
  } else if (path === null) {
    warnOnce(
      `unregistered:${lensCsId ?? "?"}`,
      `layer has no path to the scene's world system (unregistered); staying in its intrinsic frame`,
    );
  }

  return isIdentity4(m) ? null : m;
}
