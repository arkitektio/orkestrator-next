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
`core/transformGraph.ts` / `core/layerModel.ts` / `core/octree/levelGeometry.ts`,
re-derive from here.

**R1 — Edges are facts, paths are queries.** The server ships
transformations as edges `(input CS → output CS, params)` and never resolves
`toWorld`: the same dataset in two scenes has two registrations, so a
server-side `toWorld` would be wrong in one of them. THE CLIENT COMPOSES.
That composition lives in exactly one module — `core/transformGraph.ts` — and
its results are attached to view-model state once per scene load. Do not
compose matrices ad-hoc anywhere else.

**R2 — Store what was authored or measured; derive everything else.**
Server-derived (we consume, never re-implement): `Lens.renderAxes` (axis
mapping from axis TYPES), `Lens.toParent` (crop translation from slice
starts), `DataArray.toParent` (absolute per-level scale from actual shapes).
Client-derived (we own): composed matrices, relative level factors, GPU
uniforms, frustums. If you find yourself persisting any of these, stop.

**R3 — Coordinate systems are nodes, not strings.** Everything spatial is
anchored by CS id: datasets, pyramid levels, lenses, mesh collections, ROIs.
Axis names are only meaningful *within* a CS; all name lookups here go
through a specific CS's axis list.

---

## 2. What the server ships (the scene fragment)

```
Scene
├─ worldCoordinateSystem            # spatial-only, per-axis units (µm, …)
├─ coordinateSystems[]              # every CS reachable in this scene, WITH axes
├─ coordinateTransformations[]      # scene-level edges (registrations)
└─ layers[]
   └─ ImageLayer.lens
      ├─ renderAxes {x y z t intensity}   # derived from axis types (server)
      ├─ coordinateSystem                 # the lens' own (cropped) space
      ├─ toParent                         # lens → level-0 array space
      ├─ slices[]                         # authored selection
      └─ dataset
         ├─ coordinateSystem              # intrinsic physical space
         └─ dataArrays[]                  # pyramid levels
            ├─ coordinateSystem           # this level's array space
            └─ toParent                   # level → intrinsic (ABSOLUTE scale
                                          #   [+ translation], from real shapes)
```

GraphQL documents: `graphql/mikro-next/fragments/{scene,lens,layer,
coordinatesystem,dataroi,meshcollection}.graphql`. The `Transformation`
fragment expands composite edges (Sequence / ByDimension / Bijection) to a
FIXED depth — real edges are shallow (a pyramid level is
`Sequence[Scale, Translation]`; a registration is an `Affine` or
`ByDimension[Identity|Affine]`). If the server ever nests deeper, the extra
depth silently drops out of the query — extend the fragment, not the parser.

Gone from the wire (and from `ImageLayerFragment`): `Layer.affineMatrix`,
`ImageLayer.xDim/yDim/zDim/tDim/intensityDim`, `DataArray.scaleFactors`,
`Scene.spatialUnit/temporalUnit`, `DataRoi.dataset/xDim/yDim/zDim`.

**Deliberate fragment omissions (perf):**
- `ZarrStore.accessGrant` / `ParquetStore.accessGrant` are NOT selected in the
  scene fragment — each grant is a server-side STS call; selecting them per
  store would turn one scene query into a dozen credential mints. Grants are
  requested lazily (zarr: existing store flow; parquet: mutation on mesh-layer
  mount).
- `CoordinateAnchor.valueHistogram` IS still selected (clim defaults + the
  brick pool's global min/max normalization need it, `core/dataRange.ts`). If
  the server computes it on demand this is the scene query's heaviest field —
  if scene loads get slow, split it into a deferred query and let clims
  resolve against the dtype range until it lands.

---

## 3. What the client derives, and where

One rule of altitude: **everything below `core/transformGraph.ts` and
`core/layerModel.ts` still sees the pre-migration flat facts.** The octree
planner, culling, slab math, probes and panels were not rewritten — they
consume derived fields with the exact semantics the server fields used to
have. The migration is an adapter, not a rewrite.

| Derived fact | From | Where | Consumed by |
| --- | --- | --- | --- |
| `LayerState.affineMatrix` (voxel→world 4×4, x/y/z rows) | `lens.toParent ∘ level-0 toParent ∘ (dataset CS →BFS→ world)` | `composeLayerAffine` (`core/transformGraph.ts`), once per scene load in `normalizeLayer` | `worldTransform.buildAffineMatrix`, `voxelFrame.buildVolumeVoxelToWorld`, `nodePlanning` 2D slab inverse, `visibility`, `RoiDrawer` |
| `LayerState.xDim/yDim/zDim/tDim/intensityDim` | `lens.renderAxes` | `normalizeLayer` (`core/layerModel.ts`) | `resolveAxisIndices` and ~15 call sites (slice signature, probes, panels) |
| Relative level factors (old `scaleFactors` semantics) | absolute `toParent` scales, `rel = abs_L / abs_0` | `relativeLevelScaleFactors` / `buildLevelSources` (`core/octree/levelGeometry.ts`) | level geometry, plan tracker, residency, pool viability, probe geometry |
| `spatialUnit` | first SPACE axis of the world CS | `sceneStore` | `ScaleBar` |
| Mesh/ROI transforms | `composeCsToWorld` + `collectDatasetEdges` | `core/transformGraph.ts` | `render/mesh/MeshCollectionLayer` |

Raw-fragment code paths that run BEFORE normalization (`lodPlanning`,
`renderCost`, `renderGraph.defaultLayerGraph`, `colormap-utils`) read
`layer.lens.renderAxes` directly.

### 3.1 `composeLayerAffine` — the chain

```
lens voxel ──toParent──▶ level-0 array ──toParent──▶ dataset physical ──BFS──▶ world
 (crop translation)      (absolute voxel size)        (scene registrations)
```

- Arrays (`scale`, `translation`, affine rows/cols) are in the **axis order
  of the edge's input CS**. The spatial subset is extracted **by axis name**
  via `renderAxes` (never by position). Axis orders come from
  `scene.coordinateSystems` (fetched with full axes precisely for this);
  unknown systems fall back to the layer's dim order.
- Affine edges are `M × (N+1)`, rows in OUTPUT axis order, last column the
  translation — `evalTransform` maps the spatial block name-by-name between
  input and output systems (tested against the FLIM registration numbers).
- The BFS (`findPath`) walks scene edges forward only. No path → the layer
  stays in its physical frame (warn once), which is exactly the old
  `affineMatrix: null` behavior.
- **Degradation is always to identity, never to a wrong matrix.** Edge kinds
  the evaluator cannot represent as a spatial affine (MapAxis permutations,
  Bijections, Displacement fields) warn once and drop out. If you add support
  for a kind, add it to `evalTransform`'s switch and to
  `transformGraph.test.ts` — nowhere else.

### 3.2 Per-level scales: absolute in, relative out

RFC-5 levels are a STAR, not a chain: every level's `toParent` outputs the
same intrinsic CS, with **absolute** scale derived from actual shapes — so a
36-slice z pyramid is `0.5, 1, 2, 4.5, 9, 18 µm` (true factors 1,2,4,9,18,36),
not the nominal-but-false 1,2,4,8,16,32. The renderer's internal currency
stays "base voxels per level voxel", so `relativeLevelScaleFactors` divides
by level 0. Because the schema guarantees `scale·shape == const` per axis,
these agree with `resolveAxisScale`'s shape-ratio fallback by construction —
declared scales just short-circuit it, and pyramids whose edges we can't read
(missing `toParent`, affine level edges) fall back cleanly.

`buildLevelSources` is THE one `LevelSource[]` builder (plan tracker,
residency manager and pool-viability probe all call it). Do not hand-roll a
fourth copy.

**Deferred on purpose — per-level TRANSLATION.** `Sequence[Scale,
Translation]` level edges carry the half-voxel offset introduced by
downsampling (`(f−1)/2 · base_spacing`). The renderer does not consume it
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

### 3.4 ROIs

`DataRoi` is CS-anchored (`coordinateSystem` + `vectors` + `selectors`), not
dataset/dim-string-anchored. Creation (`interactions/RoiDrawer.tsx`): the
drawn world points are inverse-transformed through the clicked layer's
composed matrix **once, at creation** — the inverse of
`lens→world` lands them in exactly the lens' CS, which is what the mutation
anchors to. No mirrored world geometry, no reconciliation at read time.
`createdWithTransforms` is provenance only — never used for resolution.

### 3.5 Axis mapping is structural now

`renderAxes` is derived server-side from axis TYPES (SPACE/TIME/CHANNEL), so
the P16 class of bug (`intensityDim === zDim`, 16 phantom channels, 512 MB
atlas) is structurally impossible — a dim cannot be two types. The
`resolveAxisIndices` collision guard stays as defense in depth. The spatial
dims are no longer user-editable; the layer panel persists only
`intensityDim`.

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
in the scene whose lens/dataset/pyramid contains its CS — the labels layer it
was extracted from — and reuses THAT layer's full frame, so meshes and labels
overlap by construction. Only when no such layer exists does it fall back to
the pure graph composition (warn once).

The real fix is a **scene-root frame normalization**: compose all transforms
pure (voxel → world µm), apply ONE y-flip + fit matrix on the scene root, and
delete per-layer centering. That touches `sceneFit`, `probeMath`/`probeWorld`,
`RoiDrawer`, `ZSliderPanel` and the 2D slab math in lockstep — do it as its
own change, not as a rider.

---

## 5. Debugging a misplaced layer

1. `console.warn` first — every degradation path warns once with the edge
   type and CS ids (`[transformGraph] …`, `[mesh] …`). A silent wrong
   position means the numbers composed; a warned identity means an edge
   didn't.
2. Check the chain piecewise: `composeLayerAffine` is pure — feed it the
   scene fragment from Apollo devtools and the layer, compare against
   hand-multiplied `lens.toParent`, `dataArrays[0].toParent`, and the scene
   edge. `transformGraph.test.ts` has worked examples (including the
   reference confocal/FLIM numbers) to copy from.
3. Axis-order suspicion: arrays are input-CS-ordered. If a CS is missing from
   `scene.coordinateSystems`, its edges evaluate against the layer's dim
   order — check the fragment actually selected `coordinateSystems`.
4. Level scale suspicion: `relativeLevelScaleFactors` must equal the shape
   ratios (`scale·shape == const` invariant). If they don't, the server wrote
   inconsistent `toParent` edges — that's a data bug, surface it, don't
   patch it client-side.
5. Half-a-coarse-voxel offsets at coarse LOD only: that's the deferred
   translation (§3.2), not a regression.

---

## 6. Server-side performance expectations

The scene query now resolves a CS (+axes) per lens, per dataset, and a
`toParent` per data array — ~25 objects for a 3-layer, 6-level scene. That is
fine **if** the resolvers prefetch (`select_related`/dataloaders); naive ORM
resolution makes scene loads O(levels × layers) round trips. If scene loads
regress, profile the backend before touching the client — the fragment shape
is already minimal (see §2's deliberate omissions).

---

## 7. Test map

| Concern | Tests |
| --- | --- |
| Edge evaluation, layer composition, CS→world BFS, dataset-edge pool | `core/transformGraph.test.ts` |
| Absolute→relative level scales, identity/translation edges, fallback | `core/transformGraph.test.ts` ("level scale factors") |
| Planner/geometry under true factors | `core/octree/nodePlanning.test.ts`, `levelGeometry` coverage via existing octree tests |
| Mesh cell math, planning, decoding, cache | `render/mesh/meshCore.test.ts` |

The reference scene document (confocal + FLIM + mesh collection) doubles as
the fixture source — its hand-computed numbers (z 4.5 µm at level 3, the
0.998/±0.021 FLIM affine, factors 1,2,4,9,18,36) appear verbatim in the
tests. When the schema evolves, update the tests from a NEW hand computation,
not from the code's output.
