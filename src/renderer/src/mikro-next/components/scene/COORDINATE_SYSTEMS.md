# Coordinate systems & the transform graph

How the scene renderer consumes the RFC-5-aligned mikro schema (coordinate
systems as nodes, transformations as edges), what the client derives from it,
and every invariant that keeps a voxel on screen where it belongs.

Companion documents: `OCTREE_RENDERER.md` (the brick-pool image renderer this
feeds), `render/mesh/README.md` (the mesh-collection renderer built on the
same graph).

---

## 1. The model, in three rules

The backend (OME-NGFF RFC-5 aligned) obeys three rules; the renderer's
adapter code is shaped by the same three. When editing anything in
`@/mikro-next/lib/coords/transformGraph.ts` / `core/layerModel.ts` / `core/octree/levelGeometry.ts`,
re-derive from here.

**R1 — Edges are facts; matrices are client work.** The server ships
transformations as edges `(input CS → output CS, params)` and — per SCENE
LAYER — a resolved **path** of edges to the scene's world system
(`Layer.pathToWorld: [{transformation, inverted}]`). The path is itself a
fact, not a shortcut around R1: a layer belongs to exactly one scene, so "this
layer to ITS world" has a single right answer, resolved from the layer's
dataset facts plus that scene's membership edges (never another scene's
registration). What the server still never resolves is a MATRIX: evaluating
each step, inverting the flagged ones, and folding the chain stays
client-side, in exactly one module — `@/mikro-next/lib/coords/transformGraph.ts` — attached to
view-model state once per scene load. Do not compose matrices ad-hoc anywhere
else.

**R2 — Store what was authored or measured; derive everything else.**
Server-derived (we consume, never re-implement): `Lens.renderAxes` (axis
mapping from axis TYPES), `Lens.toParent` (crop translation from slice
starts), `DataArray.toParent` (per-level pixel scale from actual shapes),
`Layer.pathToWorld` / `ImageLayer.levelPaths` (path resolution over the
graph). Client-derived (we own): composed matrices, relative level factors,
GPU uniforms, frustums. If you find yourself persisting any of these, stop.

**R3 — Coordinate systems are nodes, not strings.** Everything spatial is
anchored by CS id: datasets, pyramid levels, lenses, mesh collections, ROIs.
Axis names are only meaningful *within* a CS; all name lookups here go
through a specific CS's axis list.

---

## 2. What the server ships (the scene fragment)

```
Scene
├─ worldCoordinateSystem            # the scene's shared frame; axes may carry units
├─ (coordinateSystems NOT selected) # edges self-describe their axis order now
├─ registrations[]                  # scene-level edges (registrations), each with
│                                   #   inputAxes/outputAxes (param order)
└─ layers[]
   ├─ pathToWorld[]                 # SERVER-RESOLVED: ordered {transformation,
   │                                #   inverted} steps, source CS → world.
   │                                #   null = unregistered, [] = source IS world
   └─ ImageLayer
      ├─ (levelPaths NOT selected)  # exists in the schema (per-level paths) but
      │                             #   deliberately unqueried: it costs a server
      │                             #   path resolution per pyramid level and
      │                             #   duplicates the registration tail per level,
      │                             #   while the renderer uses one matrix per
      │                             #   layer + relative factors. Reselect when
      │                             #   per-level placement lands (§3.1).
      └─ lens
         ├─ renderAxes {x y z t intensity}   # derived from axis types (server)
         ├─ coordinateSystem                 # the lens' own (cropped) space
         ├─ toParent                         # lens → level-0 array space
         ├─ slices[]                         # authored selection
         └─ dataset
            ├─ intrinsicSystem               # the level-0 PIXEL grid: structural,
            │                                #   calibration-independent, what
            │                                #   pyramids/lenses/ROIs resolve against
            ├─ calibrations[]  (not selected) # PHYSICAL spaces, one edge from
            │                                #   intrinsic; recalibration bumps that
            │                                #   edge, nothing drawn in pixels moves
            └─ dataArrays[]                  # pyramid levels
               ├─ coordinateSystem           # this level's array space
               └─ toParent                   # level → intrinsic PIXELS — the scale
                                             #   IS the relative pyramid factor
```

**The unit story.** Intrinsic and array systems are unitless pixel/index
spaces — `Axis.unit` is null there (and `Axis.discrete` no longer exists;
discreteness follows from the system's kind). Units live on CALIBRATED
(`PHYSICAL`) systems and, usually, the world system. Physical voxel size is
therefore NOT in the pyramid's `toParent` edges anymore — it is the
calibration edge (intrinsic → physical), which arrives inside `pathToWorld`.
The scale bar still reads the world CS's first SPACE axis unit, falling back
to "px" (`sceneStore`).

GraphQL documents: `graphql/mikro-next/fragments/{scene,lens,layer,
coordinatesystem,dataroi,meshcollection}.graphql`. The `Transformation`
fragment expands composite edges (Sequence / ByDimension / Bijection) to a
FIXED depth — real edges are shallow (a pyramid level is
`Sequence[Scale, Translation]`; a registration is an `Affine` or
`ByDimension[Identity|Affine]`). If the server ever nests deeper, the extra
depth silently drops out of the query — extend the fragment, not the parser.

Gone from the wire (and from `ImageLayerFragment`): `Layer.affineMatrix`,
`ImageLayer.xDim/yDim/zDim/tDim/intensityDim`, `DataArray.scaleFactors`,
`Scene.spatialUnit/temporalUnit`, `DataRoi.dataset/xDim/yDim/zDim`,
`ADataset.coordinateSystem` (→ `intrinsicSystem` + `calibrations`),
`Axis.discrete`, `AxisType.ARRAY`, and `DataRoi`/`ShapeLayer` themselves
(→ `Annotation` in an `AnnotationCollection`, drawn by an `AnnotationLayer`).

**Deliberate fragment omissions (perf):**
- `lens.coordinateSystem` / `dataset.intrinsicSystem` are selected **id+name
  only** — their axis order equals the layer's dims by contract ("a selection
  never drops or reorders an axis"), so selecting axes only duplicated dims
  in every payload.
- `scene.coordinateSystems` is NOT selected (removed once §7 item 1 shipped):
  every edge carries `inputAxes`/`outputAxes`, which was the global list's
  only client-side job. The axis-resolution order in `transformGraph.ts` is
  edge-carried lists → CS index (world only now) → layer dims.
- `ZarrStore.accessGrant` / `ParquetStore.accessGrant` are NOT selected in the
  scene fragment — each grant is a server-side STS call; selecting them per
  store would turn one scene query into a dozen credential mints. Grants are
  requested lazily (zarr: existing store flow; parquet: mutation on mesh-layer
  mount).
- `CoordinateAnchor.valueHistogram` IS still selected (clim defaults + the
  brick pool's global min/max normalization need it, `core/dataRange.ts`).
  It is always PRECOMPUTED server-side — there is no on-demand evaluation
  path; the field is either present or null. So selecting it costs only wire
  size (a few hundred floats per anchor), and a null histogram simply means
  clims resolve against the dtype range (the fallback `dataRange.ts` already
  implements).

---

## 3. What the client derives, and where

One rule of altitude: **everything below `core/transformGraph.ts` and
`core/layerModel.ts` still sees the pre-migration flat facts.** The octree
planner, culling, slab math, probes and panels were not rewritten — they
consume derived fields with the exact semantics the server fields used to
have. The migration is an adapter, not a rewrite.

| Derived fact | From | Where | Consumed by |
| --- | --- | --- | --- |
| `LayerState.affineMatrix` (voxel→world 4×4, x/y/z rows) | local prefix (`lens.toParent`, level-0 `toParent`) ∘ `pathToWorld` steps | `composeLayerAffine` (`core/transformGraph.ts`), once per scene load in `normalizeLayer` | `worldTransform.buildAffineMatrix`, `voxelFrame.buildVolumeVoxelToWorld`, `nodePlanning` 2D slab inverse, `visibility`, `RoiDrawer` |
| `LayerState.xAxis/yAxis/zAxis/tAxis/intensityAxis` | `lens.renderAxes` | `normalizeLayer` (`core/layerModel.ts`) | `resolveAxisIndices` and ~15 call sites (slice signature, probes, panels) |
| Relative level factors (old `scaleFactors` semantics) | `toParent` pixel scales, `rel = abs_L / abs_0` (a no-op now that level 0 = 1) | `relativeLevelScaleFactors` / `buildLevelSources` (`core/octree/levelGeometry.ts`) | level geometry, plan tracker, residency, pool viability, probe geometry |
| `spatialUnit` | first SPACE axis of the world CS | `sceneStore` | `ScaleBar` |
| Mesh transforms | `MeshLayer.pathToWorld` via `composePlacementPath` | `core/transformGraph.ts` | `render/mesh/MeshCollectionLayer` |

Raw-fragment code paths that run BEFORE normalization (`lodPlanning`,
`renderCost`, `renderGraph.defaultLayerGraph`, `colormap-utils`) read
`layer.lens.renderAxes` directly.

### 3.1 `composeLayerAffine` — local prefix + server path

```
lens voxel ──toParent──▶ level-0 array ──toParent──▶ intrinsic pixels
 (crop translation)      (pyramid factor, ≈identity)
                                │
                 pathToWorld steps, evaluated in order
                                ▼
        … ──calibration edge──▶ physical ──registration──▶ world
             (pixel size — the ONLY place it lives)
```

- `composePlacementPath(steps, scene, spatial)` evaluates each step's
  transformation with `evalTransform` and **matrix-inverts** (`invert4`,
  pure affine adjugate) the steps flagged `inverted` — the server marks edges
  it traversed output→input. Singular inverses degrade like unknown kinds.
- The path starts at the layer's SOURCE system, but the renderer's voxel
  frame is the LENS grid — so `composeLayerAffine` prepends whatever local
  prefix the path does not cover, keyed off the path's actual start CS:
  starts at the lens CS → no prefix; at the level-0 array CS → prepend
  `lens.toParent`; anywhere else (intrinsic, typically) → prepend both
  `toParent`s. This makes the client indifferent to which source the server
  chooses, and immune to double-applying the crop.
- `pathToWorld: null` (unregistered layer) → local prefix only; the layer
  stays in its intrinsic pixel frame (warn once) — exactly the old
  `affineMatrix: null` behavior. `[]` (source IS world) → local prefix only,
  no warning.
- Arrays (`scale`, `translation`, affine rows/cols) are in the **axis order
  of the edge's input CS**. The spatial subset is extracted **by axis name**
  via `renderAxes` (never by position). Axis orders come from
  `scene.coordinateSystems` (fetched with full axes precisely for this);
  unknown systems fall back to the layer's dim order.
- Affine edges are `M × (N+1)`, rows in OUTPUT axis order, last column the
  translation — `evalTransform` maps the spatial block name-by-name between
  input and output systems (tested against the FLIM registration numbers).
- **Degradation is always to identity, never to a wrong matrix.** Edge kinds
  the evaluator cannot represent as a spatial affine (MapAxis permutations,
  Bijections, Displacement fields) warn once and drop out. If you add support
  for a kind, add it to `evalTransform`'s switch and to
  `transformGraph.test.ts` — nowhere else.
- `ImageLayer.levelPaths` (per pyramid level → world) is NOT selected: the
  octree renderer keeps one matrix per layer plus relative level factors, so
  querying it would pay per-level server path resolutions for nothing. When
  per-level placement lands (e.g. with the translation work below), reselect
  it and feed `levelPaths[level].path` through `composePlacementPath` —
  every level stars into the same intrinsic system, so the registration tail
  is shared.

### 3.2 Per-level scales: pixel factors in, relative factors out

RFC-5 levels are a STAR, not a chain: every level's `toParent` outputs the
same intrinsic system. With intrinsic = the level-0 PIXEL grid, a level edge's
scale IS the true relative factor (derived from actual shapes — a 36-slice z
pyramid gives 1,2,4,9,18,36, not the nominal-but-false 1,2,4,8,16,32), and
physical voxel size lives exclusively on the calibration edge.
`relativeLevelScaleFactors` still divides by level 0 — a no-op now (level 0 =
1), kept so physical-scaled level edges from older data remain correct.
Because `scale·shape == const` per axis, declared factors agree with
`resolveAxisScale`'s shape-ratio fallback by construction — they just
short-circuit it, and pyramids whose edges we can't read (missing `toParent`,
affine level edges) fall back cleanly.

`buildLevelSources` is THE one `LevelSource[]` builder (plan tracker,
residency manager and pool-viability probe all call it). Do not hand-roll a
fourth copy.

**Deferred on purpose — per-level TRANSLATION.** `Sequence[Scale,
Translation]` level edges carry the half-voxel offset introduced by
downsampling (`(f−1)/2`, in intrinsic pixels). The renderer does not consume it
yet: sampling assumes corner-aligned levels, which is the pre-migration
status quo (coarse LODs draw up to half a coarse voxel off — reads as "soft
when zoomed out"). Consuming it is a LOCKSTEP change across
`nodeBaseBox`/`slabLevelZ` (planner), `brickNodeMaterials` (TSL sampling
map), and `brickSampling` (CPU probe march) — see OCTREE_RENDERER.md P15/P14
for why these three must move together. Recommended shape: apply translation
exactly in the *sampling* path, keep brick *addressing* corner-aligned.

**Known planner nit for true-factor pyramids:** adjacent levels need not
divide evenly (z 4→9 is 2.25×), so `childrenOf` boxes don't nest exactly and
the DFS can visit a straddling child from two parents (no visited-set).
Bounded double-accounting; add dedup in `planLayerNodes` when translation
work lands.

### 3.3 Lenses and the crop offset

A cropped lens' voxel coordinates are OFFSET from its dataset's;
`lens.toParent` records that offset. Composition folds it into the layer
matrix, so anything downstream of `affineMatrix` is crop-correct.
Residual pre-existing hole (unchanged by the migration): the octree fetch
path plans in DATASET voxel space and applies `lens.slices` only to
non-spatial dims (`brickResidency.ts` fixed-index collapse) — a spatially
cropped lens fetches the full extent. Fixing that means clamping the
planner's visible box to the lens window; the transform side is already
correct.

`buildSliceSignature` keeps its exact semantics (axis mapping + non-spatial
slices; `currentZ` deliberately excluded — see OCTREE_RENDERER.md P15).

### 3.4 Annotations (the old ROIs)

An `Annotation` is **collection**-anchored, not CS-anchored and not
dataset/dim-string-anchored: the `AnnotationCollection` owns the coordinate
system its shapes' `vectors` are expressed in, and one collection is drawn by
one `AnnotationLayer` per scene. Styling (`strokeColor`/`fillColor`/
`strokeWidth`/`filled`) is per-shape — the layer renders a whole collection, so
a color on the layer could not tell its shapes apart.

Creation (`interactions/RoiDrawer.tsx`): the mutation takes `scene`, and the
server finds the scene's collection or mints it on first use together with its
CS, its registration into the world, and its layer. That registration is an
identity into the world, so the drawn **world** points are submitted as-is —
there is no inverse transform at creation any more, and no per-armed-layer copy.
Arming still gates drawing, but no longer decides where the shape lands.

Reading (`layers/annotation/AnnotationLayer.tsx`): the layer composes its own
server-resolved `pathToWorld` via `composePlacementPath`, the same way the mesh
layer does. `createdWithTransforms` is provenance only — never used for
resolution.

### 3.5 Axis mapping is structural now

`renderAxes` is derived server-side from axis TYPES (SPACE/TIME/CHANNEL), so
the P16 class of bug (`intensityAxis === zAxis`, 16 phantom channels, 512 MB
atlas) is structurally impossible — a dim cannot be two types. The
`resolveAxisIndices` collision guard stays as defense in depth. The spatial
dims are no longer user-editable, and the intensity mapping is persisted
through the render graph (`ChannelSourceNode.intensityAxis`), not a flat
layer field.

---

## 4. Frames: the centering convention and co-registration

The one place the old world and the new world genuinely differ:

- **Image layers** render in `affine ∘ centering(lens.shape, y-flip)`
  (`voxelFrame.buildVolumeVoxelToWorld`) — each layer centers itself on the
  origin. Historically "world" was whatever the layer affine said; now the
  composed matrix targets the scene's world CS (physical µm), and the
  centering still rides on top per layer.
- **Graph-anchored things** (meshes, ROIs from other datasets) composed
  purely through the graph land UNCENTERED and un-flipped relative to that.

Current resolution (v1, encoded in `render/mesh/MeshCollectionLayer.tsx`
`resolveCollectionMatrix`): a mesh collection first looks for an image layer
in the scene whose lens/intrinsic-system/pyramid contains its CS — the labels
layer it was extracted from — and reuses THAT layer's full frame, so meshes
and labels overlap by construction. Only when no such layer exists does it
fall back to composing the mesh layer's own `pathToWorld` (warn once).

The real fix is a **scene-root frame normalization**: compose all transforms
pure (voxel → world µm), apply ONE y-flip + fit matrix on the scene root, and
delete per-layer centering. That touches `sceneFit`, `probeMath`/`probeWorld`,
`RoiDrawer`, `ZSliderPanel` and the 2D slab math in lockstep — do it as its
own change, not as a rider.

---

## 5. Debugging a misplaced layer

1. `console.warn` first — every degradation path warns once with the edge
   type and CS ids (`[transformGraph] …`, `[mesh] …`). A silent wrong
   position means the numbers composed; a warned identity means an edge or
   step didn't. "no path to the scene's world system (unregistered)" means
   the SERVER returned `pathToWorld: null` — the layer isn't registered into
   this scene; that's a data/registration question, not a client bug.
2. Layer renders in raw pixels (1 px = 1 world unit): the path composed but
   contained no calibration edge — inspect `pathToWorld` in Apollo devtools;
   the pixel→physical scale must appear as one of its steps.
3. Check the chain piecewise: `composeLayerAffine` and
   `composePlacementPath` are pure — feed them the fragment from Apollo
   devtools, compare against hand-multiplied step matrices (invert the
   `inverted: true` ones). `transformGraph.test.ts` has worked examples to
   copy from.
4. Axis-order suspicion: arrays are input-CS-ordered. If a CS is missing from
   `scene.coordinateSystems`, its edges evaluate against the layer's dim
   order — check the fragment actually selected `coordinateSystems`.
5. Crop applied twice (or not at all): the local-prefix detection keys off
   the path's start CS (`pathStartId`). Compare the first step's input (or
   output, if inverted) CS id against `lens.coordinateSystem.id` and the
   level-0 array CS id.
6. Level scale suspicion: `relativeLevelScaleFactors` must equal the shape
   ratios (`scale·shape == const` invariant). If they don't, the server wrote
   inconsistent `toParent` edges — that's a data bug, surface it, don't
   patch it client-side.
7. Half-a-coarse-voxel offsets at coarse LOD only: that's the deferred
   translation (§3.2), not a regression.

---

## 6. Server-side performance expectations

The scene query resolves a CS (+axes) per lens, per dataset, a `toParent`
per data array, plus ONE `pathToWorld` graph resolution per layer (the
per-level `levelPaths` field is deliberately unqueried — see §2). That is
fine **if** the resolvers prefetch (`select_related`/dataloaders); if
`levelPaths` is ever reselected, its path search must be memoized per
(dataset, scene) — every level shares the registration tail. If scene loads
regress, profile the backend before touching the client — the fragment shape
is already minimal (see §2's deliberate omissions).

---

## 7. Strict-backend contract (proposed enforcement)

Observed divergences from live payloads (debug scene 82, 2026-07-14) and the
rule that prevents each. The client degrades safely around all of them, but
degradation hides data bugs — enforce these server-side:

1. **Edges self-describe their axis order.** ✅ SHIPPED (2026-07-14):
   `Transformation.inputAxes/outputAxes` are non-null interface fields —
   parameter order for scale/translation/affine columns, SUBSET-only for
   ByDimension children (unnamed axes pass through untouched; the evaluator
   leaves identity rows for them). The client dropped
   `scene.coordinateSystems` from the fragment; axis resolution is
   edge-carried → world-CS index → layer dims.
2. **An ACTIVE layer always has a path to world.** Scene 82's layer ships
   `pathToWorld: null` with empty `registrations` — the layer was
   never registered. Placing a layer into a scene MUST create the
   registration edge (identity by default, editable later); if a layer can
   legitimately be unregistered, give it a distinct `status` so the client
   can badge it instead of silently drawing in the pixel frame.
3. **`ChannelSourceNode.intensityAxis` must name a CHANNEL-typed axis.**
   Live data shipped `intensityAxis: "t"` on a time-lapse — 16 timepoints
   would render as 16 stacked channel slabs (the P16 failure shape) and the
   t-slider would vanish (t counts as "rendered"). The client now guards
   (`resolveIntensityDim`, `core/dims.ts`: graph mapping wins only when it
   doesn't name a spatial/time render axis), but the write path should
   reject it.
4. **Histogram bins are linear — ship the rule, not the samples.** STILL
   OPEN: `ValueHistogram.bins` remains 256 floats of uniformly spaced bin
   EDGES (fully derivable from min/max/count); in scene 82's payload it
   dwarfs everything else. Replace with `binMin/binMax/binCount` (+ keep the
   count array); the levels-editor histogram consumes `bins` today and
   adapts trivially.
5. **`worldCoordinateSystem` non-null** on Scene (the client treats a missing
   world as "nothing registers anywhere").

Shipped alongside item 1 (unconsumed for now): `Scene.epoch` — the
wall-clock origin of the world time axis (`wall_clock = epoch + t·unit`).
The natural consumer is the t-slider's label (absolute timestamps instead of
frame indices) once a TIME calibration edge maps frame → physical time; see
the dim-slider follow-ups in OCTREE_RENDERER.md §2.2.

## 8. Test map

| Concern | Tests |
| --- | --- |
| Edge evaluation, `invert4`, placement-path composition (incl. inverted steps), layer prefix detection, unregistered degradation | `core/transformGraph.test.ts` |
| Pixel-factor and legacy physical-scale level edges, identity/translation edges, fallback | `core/transformGraph.test.ts` ("level scale factors") |
| Planner/geometry under true factors | `core/octree/nodePlanning.test.ts`, `levelGeometry` coverage via existing octree tests |
| Mesh cell math, planning, decoding, cache | `render/mesh/meshCore.test.ts` |

The reference scene document (confocal + FLIM + mesh collection) doubles as
the fixture source — its hand-computed numbers (the 0.325/0.5 µm calibration
scale, the 0.998/±0.021 FLIM affine, true z factors 1,2,4,9,18,36) appear
verbatim in the tests. When the schema evolves, update the tests from a NEW
hand computation, not from the code's output.
