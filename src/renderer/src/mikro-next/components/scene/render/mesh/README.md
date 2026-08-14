# Mesh collection renderer

Renders a `MeshLayer`'s `MeshCollection`: segmentation meshes stored as rows
in Parquet, streamed cell-by-cell through DuckDB-wasm, anchored to a
coordinate system in the scene's transform graph (see
`../../COORDINATE_SYSTEMS.md`; planning discipline inherited from
`../../OCTREE_RENDERER.md`).

## The big picture

```
scene fragment (MeshCollection: coordinateSystem, grid, encoding,
                geometry: ParquetStore[])
        │
        ▼
MeshCollectionLayer.tsx ── resolveCollectionMatrix()
        │                    (anchor image layer's frame, else graph compose)
        │  camera SETTLE (vanilla viewStore subscription — never per frame)
        ▼
MeshCollectionManager.updatePlan()
        │
        ├─ planMeshCells()          pure: PER-CELL LOD (each coarsest-level
        │                           root picks its own level from its own
        │                           distance and descends via Morton
        │                           arithmetic — mixed levels per plan) +
        │                           hysteresis (±15% band per root) +
        │                           frustum cull (collection voxel space,
        │                           against boxes precomputed at index load)
        │                           + near-first triangle budget
        ├─ cache hits               mounted into the THREE.Group instantly
        └─ misses ─► MeshParquetSource.fetchCellRows()
                        │   ONE batched `cell IN (...)` SQL per LEVEL in
                        │   the plan (bounded by pyramid depth)
                        ▼
                  decodeGeometryRow()   BLOB → dequantized Float32/Uint16
                        │               (meshopt / raw, oct normals)
                        ▼
                  BufferGeometry per fragment ─► per-cell Group
                        │
                        ├─ LruByteCache (plan-protected, evict → dispose)
                        └─ group.add + invalidate()   (demand frameloop)
```

The cell index behind `planMeshCells` is ONE aggregate query per collection
`version` (collections are immutable per version), projected to the count
columns so the geometry BLOBs are never scanned for it.

## Module boundaries (one concern per file)

| File | Owns | Knows nothing about |
| --- | --- | --- |
| `mortonCell.ts` | Morton cell codes | Parquet, three, React |
| `meshSpec.ts` | `grid`/`encoding` JSON parsing, cell → voxel box | everything else |
| `meshPlanner.ts` | which cells to show (LOD + frustum + budget) | how cells are fetched or drawn |
| `meshDecode.ts` | BLOB bytes → typed arrays (dequant, oct normals, meshopt) | SQL, three |
| `meshParquet.ts` | grants, scoped secrets, SQL, row conversion | three, planning |
| `lruByteCache.ts` | byte-bounded LRU + protected keys | value semantics |
| `meshManager.ts` | THREE objects, reconcile, in-flight bookkeeping | React, SQL, bytes |
| `MeshCollectionLayer.tsx` | lifecycle, transform resolution, settle cadence | everything above's internals |

## Performance rules encoded here

- **One DuckDB instance per process** — shared with the table UI
  (`useDuckDbTable.getDuckDb`). Secrets are per-store **named + scoped**, so
  mesh layers and the table UI never clobber each other's credentials.
- **One aggregate query per collection version** builds the cell index
  (projected columns only — geometry BLOBs are never scanned for it); one
  **batched `cell IN (...)` query per LEVEL in the plan** (bounded by pyramid
  depth) fetches geometry. Morton-sorted shards + Parquet row-group pruning
  make that range reads, not full scans.
- **Planning runs at camera-SETTLE cadence** (vanilla store subscription, no
  React re-render per batch — OCTREE_RENDERER.md P17), and eviction goes
  through a byte-bounded LRU whose eviction callback disposes GPU buffers
  (P13). The current plan's cells are protected from eviction.
- **Per-cell LOD (mixed levels per plan)**: each coarsest-level root region
  picks its own level from ITS OWN screen-space footprint and descends via
  Morton arithmetic (children of code c are exactly 8c…8c+7 under the LSB-x
  interleave — no decode). Depth-spanning collections render fine near the
  camera and coarse in the distance; regions with no finer rows stay covered
  by their coarser cell (sparse pyramids).
- **Hysteresis**: a root sticks to its previous level until the footprint
  clears the threshold by ~15% (`LOD_HYSTERESIS`) — settling near a boundary
  cannot flip a region between levels (and refetch it) on consecutive plans.
  The manager feeds the previous plan's `rootLevels` back into the next.
- **No Morton decode on the plan path**: cell voxel boxes and keys are
  precomputed once per collection version (`buildMeshCellIndex`).

## Parquet data contract (v1 — the writer must match this)

> The v2 contract — object identity, a real catalog, hive-partitioned files,
> and the crack/coverage invariants v1 leaves implicit — is specified in
> `MESH_FORMAT.md`, selected by `MeshCollection.specVersion`. What follows is
> what the shipped renderer reads today.

Geometry shards (`MeshCollection.geometry`), one row per mesh fragment; a
cell renders as the union of its rows:

| column | type | meaning |
| --- | --- | --- |
| `level` | INT | octree level, 0 = finest; level-L cells span `cellSize·2^L` voxels |
| `cell` | BIGINT | Morton code of the cell on its level's grid (x least-significant bit; see `mortonCell.ts`) |
| `positions` | BLOB | `vertex_count` vertices; `UINT16_QUANTIZED_PER_CELL` = uint16 x,y,z,PAD (stride 8, 4-byte aligned for meshopt), quantized over the cell's voxel box; or `FLOAT32` xyz |
| `normals` | BLOB? | `OCT16` octahedral; codec NONE → int16 u,v; codec MESHOPT → meshopt OCTAHEDRAL filter output (int16 xyzw). Omit → renderer computes vertex normals |
| `indices` | BLOB | triangle list, `UINT16` or `UINT32`; UINT16 is safe because a cell bounds the fragment |
| `vertex_count` / `index_count` | INT | element counts |

`encoding.codec = "MESHOPT"` means the BLOBs are meshopt vertex/index streams
(decoded via three's `MeshoptDecoder`); `"NONE"` = raw little-endian.
`encoding.compression = "ZSTD"` refers to **Parquet page compression** —
DuckDB decompresses it transparently; the client never sees zstd bytes.

The catalog store is not consumed yet (the cell index is aggregated from the
geometry shards, which needs no extra contract); it becomes relevant for
attribute-driven coloring (`colorBy` columns) and per-cell `lodError`.

## Transform / co-registration

Preferred: an image layer in the scene whose lens/intrinsic-system/pyramid
contains the collection's coordinate system (i.e. the labels layer the meshes
were cut from) — the mesh group reuses `buildVolumeVoxelToWorld(thatLayer)`,
so meshes and labels overlap by construction, centering/y-flip included.
Fallback: compose the mesh layer's own server-resolved `pathToWorld` via
`composePlacementPath` — correct in world units but uncentered relative to
image layers until the scene-root frame normalization lands (tracked
follow-up; see `../../COORDINATE_SYSTEMS.md` §4).

Vertices decode to the collection CS's VOXEL coordinates — never micrometres.
Storing physical units would bake a calibration into millions of vertices; a
registration refinement here is one `group.matrix` update, no geometry
rebuild, no refetch.

## Conventions inherited from the brick renderer

- **P17 (render-cadence state):** planning subscribes to the vanilla
  viewStore and reacts only to the moving→settled edge; streaming mutates the
  THREE.Group imperatively and calls `invalidate()`. Nothing here writes a
  React-subscribed store field per batch.
- **P13 (disposal):** every eviction/unmount path funnels through
  `disposeCellGroup` / `LruByteCache.clear` — three never disposes GPU
  buffers for you, and a streaming layer is exactly the kind of unbounded
  leak that doc warns about.
- **Plans describe desire, residency describes state:** a replan never waits
  on fetches; cells stream in and mount only if still planned (stale results
  are absorbed by the cache, mirroring the brick `protectedKeys` gate).
- **Budget degrades distance-first:** near-first ordering before the
  triangle/cell caps, same rationale as the brick planner's closest-first
  DFS.

## Reuse and optimization backlog

Ranked by payoff ÷ effort. **v1** = applies to the shipped renderer today and
is independent of the wire format; **v2** = gated on `MESH_FORMAT.md`.
Every item names the existing symbol to reuse — this renderer was written
alongside the brick renderer, not after reading it, and most of what follows is
adoption rather than invention.

**Land 1, 2 and 5 before any format work begins.** They are correctness, they
are small, and they need no new bytes.

| # | Item | Reuse | Gate | Effort |
| --- | --- | --- | --- | --- |
| 1 | **Abort superseded work.** `meshManager.drainFetches` has only a `fetching` latch and a `pendingPlan` slot, so a replan mid-flight still decodes and caches the entire superseded batch. Add a per-drain `AbortController` + generation counter, checked after the SQL await and between cells. | `managers/brickResidency.ts` — `inFlight` controller map, `AbortSignal.any([dispose, item])`, `Promise.race([work, abortPromise])` to free a concurrency slot *without* aborting a shared decode, `fetchGeneration` as worker priority | v1 | S |
| 2 | **Report streaming to the quality governor.** Only `brickResidency` calls `qualityGovernor.setStreaming`, so a mesh collection streaming for seconds reads as *settled* and the DPR ladder renders full-quality while it hitches. | `core/qualityGovernor.ts` | v1 | S |
| 3 | **Kill the region round-trip.** `ParquetAccessGrant.region` already exists on the per-store grant; the client fragment just does not select it, which is why `MeshParquetSource` takes a `requestRegion` dep and fires a second `requestGeneralParquetAccess` mutation at every layer mount. | add `region` to `fragment ParquetAccessGrant` (`graphql/mikro-next/fragments/datalayer.graphql`), re-run codegen, delete `MeshParquetDeps.requestRegion`. Same removal applies to `components/tables/useDuckDbTable.ts` | v1 | XS |
| 4 | **Persistent connection + lazy per-level secrets.** `withConnection` opens and closes a connection per query, discarding DuckDB's parquet footer cache between the index read and every geometry fetch; `ensureSecrets` then installs a secret for *every* geometry store on *every* connection. Under `MESH_FORMAT` L1+L3 that is thousands of grant mutations at mount. | `lib/attributes/lookupEngine.ts` — `ensureConnection()` keeps one connection explicitly for the footer cache; its secret installer and `grantUrl` rule are the model | v1 | M |
| 5 | **Anisotropic footprint.** `MeshCollectionLayer` computes `pxPerVoxelAtUnitDistance` and then measures distance in *voxel* space as if one voxel were one world unit (its own comment concedes the "uniform-scale approximation"). With a 5× z-step this is wrong by up to 5× in exactly the direction that matters for z-dominant views. Divide by the max axis scale of `group.matrix`. | rationale mirrors `core/octree/nodePlanning.ts`'s conservative-MAX rule — different cause, same justification; cross-reference both ways as the brick code does with its shader | v1 | XS |
| 6 | **Frame-budgeted geometry build.** `drainFetches` builds every `BufferGeometry` of a batch in one synchronous loop with no time budget — the exact hitch `uploadBudget` exists to prevent. Needs #2 to pick the right tier budget, and `MESH_FORMAT` L5 to make a per-row budget enforceable. | `managers/uploadBudget.ts` — `shouldContinueDrain`, `shouldContinueStaleDrain`, `resolveDrainPolicy(tierBudget, interacting)`, `FRAME_UPLOAD_BUDGET` (6 MB / 12 / 4 ms); driven from `useFrame` as `managers/BrickSystemProvider.tsx` does | v1 | M |
| 7 | **Ref-count the source.** `cellIndexPromise` is memoized per *instance*, and the instance is rebuilt by `MeshCollectionLayer`'s `useMemo`, so a remount re-runs the index query **and drops the whole geometry cache**. | `lib/attributes/attributeService.ts` `acquireAttributeService` — ref-counted, WeakMap-on-client, 30 s dispose linger | v1 | M |
| 8 | **Worker decode.** Decoding is main-thread. | `lib/zarr/pool/workerpool.ts` `class WorkerPool` (priority, `cancel()`, `updatePriority`) with the process-wide singleton at `mikro-next/workers/pool.ts`; pairs with #1 via `fetchGeneration`-as-priority | v1 | L |
| 9 | **Run-compressed `cell BETWEEN` predicates.** Net-new, ~15 lines; nothing in the repo does this. **Only worth it with the gap-merge and interval cap** — see `MESH_FORMAT.md` §6, since the queried set is culled and budget-truncated, not the contiguous set the descent emits. | none | v1 | S |
| 10 | **Stop duplicating SQL/secret plumbing.** `escapeSqlLiteral` is exported and unit-tested yet copied privately here and into `useDuckDbTable`; the S3 `CREATE SECRET` builder is written three times. Do it while doing #4 — same code path. | `lib/attributes/sqlBind.ts` (`escapeSqlLiteral`, `escapeSqlIdentifier`, `bindSqlLiteral`). Careful: `useDuckDbTable` uses a **global** `parquet_access` secret while the other two are named + scoped; unifying must not regress that | v1 | S |
| 11 | **Device-derived budgets** instead of the hard-coded cache bytes / index / cell ceilings in `meshManager`. | `core/lodPlanning.ts` `getInitialVolumeTextureBudgetBytes()`; `core/renderCost.ts` `selectLayersWithinBudget` for sharing across layers | v1 | S |
| 12 | **Foveated fetch ordering** instead of plain box distance. Ordering only, and this renderer plans at settle cadence, so it shapes the stream-in experience rather than frame pacing. | `core/octree/nodePlanning.ts` `foveatedScore(center, origin, viewDirection, foveaWeight)` — pure. Needs a voxel-space view direction the layer does not compute today | v1 | S |
| 13 | **Replan gate + scratch objects.** `updatePlan` replans unconditionally, and the layer allocates a `Frustum`, two `Matrix4` clones and a `Vector3` per plan. **Ranked last deliberately:** this runs at *settle* cadence, roughly once per second, so the allocations are noise. The signature gate has slightly more value (it skips an O(cells) plan + sort) and is still a per-second cost. | `core/octree/planInputSignature.ts`, `nodePlanning.sameNodePlan`, `managers/nodePlanTracker.ts` module-level scratch | v1 | S |
| 14 | **`cells.parquet` replaces the mount-time `GROUP BY`** — today's cell index aggregates over every geometry row, an O(collection) scan for an O(cells) answer, and it is the single largest fixed cost at layer mount. | — | **v2** | M |
| 15 | **Writer emits P1/P3, with a validator.** Geometry under a missing root is never planned, never fetched, silently absent, no error. Nothing client-side fixes it. | — | **v2** | — |
| 16 | **Exact-bbox culling + `lod_error` refinement + `child_mask` descent.** Replaces the address-box cull (a cell with one triangle in a corner culls as if full) and the pure-footprint heuristic; `child_mask` removes the cross-level code expansion in `planMeshCells.collect`. Requires P3. | — | **v2** | M |
| 17 | **No metrics at all.** `timeToSharpMs` is the honest number to judge #1–#13 by. | `managers/perfMonitor.ts` `markUpload(count, bytes)`; model a `MeshSystemStats` on `BrickSystemStats` | v1 | S |

### Two suggested reuses that do NOT transfer — analysis kept so nobody re-proposes them

- **`brickPoolState.selectTrimCandidates` for level-aware eviction.** It skips
  any key with `levelOf(key) >= minTargetLevel`. A mesh plan is *mixed-level* by
  design, so any plan containing a level-0 cell gives `minTargetLevel = 0` and
  **nothing is ever a victim** — it is a no-op here, not a fix. A mesh version
  would have to define reachability *per root* (unreachable = finer than the
  target level of the root containing it, root = `mortonParent` applied
  `rootLevel - level` times, which `planMeshCells` already returns as
  `rootLevels`). Low payoff regardless: `LruByteCache`'s recency ordering
  already approximates this, and the brick problem was a fixed *slot pool*, not
  a byte budget.
- **`repackDispatcher.createBufferFreeList` for worker transfer recycling.** It
  keys by exact `byteLength`. Brick buffers are uniformly sized; mesh geometry
  byte lengths are effectively unique per cell, so the hit rate is ~0 unless it
  is size-classed to powers of two first.

### Caveat on #1: DuckDB cannot cancel a query

`AsyncDuckDBConnection` exposes `cancelSent()`, which cancels only a query
started with `send()`. Everything here uses `query()`. So #1 aborts **decode
and mount**, not the SQL — the round-trip completes and its result is
discarded. That is still most of the win (decode is the expensive half and the
one that blocks the main thread), but do not describe it as cancellation.

## Adopting v2

Per-file, once `MESH_FORMAT.md`'s bytes exist. Everything else — the settle
cadence, the byte-LRU with plan protection, the disposal discipline, the
transform resolution — is untouched. v2 is a data change, not an architecture
change.

| File | Change |
| --- | --- |
| `meshSpec.ts` | parse `boundary` / `decimation`; keep `cellVoxelBox` (still the dequantization box) |
| `meshPlanner.ts` | cull against catalog `bbox_*`; screen-space-error test on `lod_error` scaled by the max axis factor (#5); `child_mask` for descent; run-compress planned cells into intervals (#9) |
| `meshParquet.ts` | read `cells.parquet` / `objects.parquet` instead of the `GROUP BY`; per-level store subsets from the `level=` key segment; range predicates |
| `meshDecode.ts` | emit the per-vertex **`objectOrdinal` `Float32Array`** from the offset lists — not a `Uint32Array` of ids: an integer vertex attribute needs `gpuType = THREE.IntType` on WebGL2 and a `uint` TSL declaration on WebGPU, plumbing this repo does not have. Retaining the offsets and ids per cached cell also adds bytes the cache budget must account for |
| `meshManager.ts` | one `Mesh` per cell row; ordinal-indexed LUT texture for colour/visibility; face → object binary search for picking |
| `MeshCollectionLayer.tsx` | branch on `specVersion`; wire `colorBy` / selection state |

Per-object rendering pieces, with the existing symbol for each:

| Need | Reuse |
| --- | --- |
| ordinal → colour/visibility LUT | **2D**, indexed `u = ordinal % W, v = ordinal / W` (W ≈ 2048). `render/colormaps.tsx` `createDiscreteColormapTexture` builds an N×1 texture and is the wrong shape past the max texture width; `render/bricks/pageTableTexture.ts` (CPU mirror + dirty-bbox partial `writeTexture`) is the right precedent. Budget it: 1 M objects ≈ 4 MB, 10 M ≈ 40 MB |
| **LUT lifetime** | Create the texture **once per collection and never replace it**; edits copy into `image.data` and set `needsUpdate`. Swapping the texture *object* on a TSL uniform leaves the compiled material's bind group pointing at a disposed GPUTexture, which three silently replaces with white — the failure `render/bricks/brickNodeMaterials.ts` `adoptDataTexture` exists to prevent |
| ordinal → distinct hue | `rainbowColormap`'s golden-angle `(i * 137.508) % 360` with index 0 transparent — already the semantics of `LabelRender.seed` / `background` |
| DataTexture recipe | `render/bricks/channelUniforms.ts` (NearestFilter, ClampToEdge, no mipmaps) |
| selection store | copy `store/roiSelectionStore.ts`'s verbs (`selectOnly` / `replace` / `merge` / `toggle` / `remove` / `clear`) |
| click wiring | `layers/annotation/AnnotationLayer.tsx` — `selectedIds` Set + `onSelect(appendSelection)` |
| probe etiquette | `core/probe/probeTargeting.ts` `layerAnswersProbe` — decline **without** `stopPropagation` so R3F carries the event to the next intersected object. Non-negotiable if this layer joins picking |
| hover coalescing | `core/probe/rafCoalesce.ts` `createRafCoalescer` |
| bulk attribute read for `colorBy` | `lib/attributes/lookupEngine.ts`'s connection, secrets and `grantUrl` — but **not** `attributesAt`, which is a point lookup behind a 256-row LRU. A LUT needs every row of one column; that method is net-new |
| colormap picker / object list panel | `panels/layer/colormap-utils.ts` (`COLORMAP_OPTIONS`, `colormapGradientCSS`); `panels/AnnotationsPanel.tsx` as the template — `MeshLayer` has **no panel UI at all** today |

**Picking is cheap but not free.** Face index → object is a binary search, but
the raycast itself is three's linear per-triangle test per `Mesh`, over a plan
that admits millions of indices across thousands of cells. Per-mesh bounding-box
rejection makes it O(visible cells) box tests plus the triangles in the hit
cells — fine, but say so rather than claiming no picking pass.

**None of this can be persisted yet.** `MeshLayer` exposes `materialColor` /
`wireframe` / `opacity`, `updateLayer` returns `ImageLayer` and carries no mesh
fields, and there is no `updateMeshLayer` — so today not even `wireframe` can be
changed after creation. The minimal schema delta follows `updateLabelLayer`'s
precedent and reuses `LabelColorBy` verbatim, but `selected` must be
`[String!]!` (decimal ids) rather than `LabelRender`'s `[Int!]!`, which would
cap object ids at 2^31 for no reason. Server-side work, tracked separately.
