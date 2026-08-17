# The fabriks mesh renderer

Renders a `MeshLayer`'s collection: segmentation surfaces stored as a
[fabriks](https://github.com/jhnnsrs/fabriks) prefix — a self-describing tree of
Parquet files — streamed **one row group at a time** and anchored to a
coordinate system in the scene's transform graph (see
`../../COORDINATE_SYSTEMS.md`; planning discipline inherited from
`../../OCTREE_RENDERER.md`).

fabriks is the format's own specification and is authoritative. This document
describes the *client*: how the prefix is read, and every decision the format
leaves to a renderer.

## The big picture

```
MeshLayer.collection  ──►  fabriksSource.openFabriksCollection()
        │                    prefix + general grant → FabriksStore
        ▼
   GET <prefix>/fabriks.json        (grid, encoding, every file + its LENGTH)
        │
        ▼
FabriksCollectionLayer.tsx ── resolveCollectionMatrix()
        │                     (graph compose of the layer's pathToWorld — nothing else)
        │  camera SETTLE (vanilla viewStore subscription — never per frame)
        ▼
FabriksCollectionManager.updatePlan()
        │
        ├─ GET catalog/cells.parquet     ONE whole-file read, once
        │      └─ buildFabriksCellIndex() boxes → WORLD space, lodError scaled
        │
        ├─ planFabriksCells()   pure: descend from the coarsest level, keep a
        │                      cell when its SCREEN ERROR fits the budget, else
        │                      descend into the children `child_mask` names.
        │                      Budget exhaustion COARSENS; it never drops.
        │
        └─ groupByRowGroup()  ─►  FabriksCollection.readFetchGroup()
                        │           footer once per part (cached), then the
                        │           byte span of the row group alone
                        ▼
                  decodeGeometryRow()   BLOB → dequantized Float32 positions,
                        │               Uint32 indices, per-vertex ordinals
                        ▼
                  BufferGeometry per cell (no normals by default — the
                        │                  material shades flat by derivatives;
                        │                  bounds come from the catalog)
                        ├─ LruByteCache (plan-protected, evict → dispose)
                        └─ ONE BatchedMesh per collection (fabriksBatch.ts)
                             + invalidate()   (demand frameloop)
```

## Module boundaries (one concern per file)

| File | Owns | Knows nothing about |
| --- | --- | --- |
| `fabriksManifest.ts` | `fabriks.json` → typed manifest; every refusal | HTTP, Parquet, three |
| `mortonCell.ts` | Morton cell codes | the rest of the world |
| `fabriksGrid.ts` | cell → grid box, `child_mask` descent | Parquet, three |
| `rowValues.ts` | Parquet cell values → numbers/bytes; the only bigint site | everything |
| `fabriksStore.ts` | authenticated whole-object + **ranged** GETs, rotation, 403 retry | Parquet, planning |
| `parquetPart.ts` | one part's footer + row-group reads | fabriks semantics, three |
| `fabriksCatalogs.ts` | the two catalogs; the WORLD-space cell index | HTTP, three objects |
| `fabriksDecode.ts` | blobs → typed arrays (dequantize, stride, meshopt, zstd) | HTTP, three |
| `fabriksPlanner.ts` | which cells at which level; row-group grouping | fetching, drawing |
| `fabriksCollection.ts` | the read plan: which file, which row group, which columns | three, React |
| `fabriksSource.ts` | API node → prefix + credentials | everything above |
| `fabriksBatch.ts` | the BatchedMesh: capacity, slots, compaction | plans, fetching, caches |
| `fabriksManager.ts` | THREE objects, reconcile, abort generation | React, HTTP, bytes |
| `FabriksCollectionLayer.tsx` | lifecycle, transforms, settle cadence | everything above's internals |

## Why there is no DuckDB here

The v1 renderer issued SQL against a list of Parquet shards. fabriks's cell
catalog names the `(part, row_group)` holding every cell, and its manifest
records every file's length — and **DuckDB cannot address a row group**, so SQL
structurally cannot use the locator that is the point of the format.

Reading it directly with `hyparquet` also removed three problems the SQL path
had: DuckDB-wasm cannot cancel a `query()`, every fetch re-opened a connection
and re-installed secrets, and each query re-read footers. DuckDB is still the
app's Parquet engine for the table UI and `lib/attributes` — it just is not on
the render path.

## Performance rules encoded here

- **One footer per part, per session.** `ParquetPart` memoizes the parsed
  metadata, so the second cell out of a part costs only its row group. This is
  the asymmetry fabriks's 512 KiB row-group sizing is chosen against.
- **Fetch by ROW GROUP, not by cell.** A row group is the smallest thing a
  reader can fetch and a plan routinely puts several cells in one, so
  `groupByRowGroup` dedupes before any I/O.
- **One ranged GET per row group.** hyparquet slices per column chunk and a
  geometry row group has ten columns, so the raw reader would pay ten small
  authenticated round trips per group. `ParquetPart.readRowGroup` prefetches
  the group's whole byte span (column chunks of one row group are contiguous)
  and serves hyparquet's slices from it.
- **A few row groups in flight.** The drain runs `CONCURRENT_FETCHES` workers
  pulling from one near-first cursor: priority order is preserved, round trips
  overlap instead of summing, and every worker checks the plan generation.
- **Range reads are signed.** `fetchS3Path` folds caller headers into the SigV4
  canonical headers, so a `Range` header is covered by the signature. A gateway
  that answers 200 to a ranged request is detected (no `Content-Range`) and
  sliced locally rather than handed to the Parquet reader at the wrong offset.
- **Planning runs at camera-SETTLE cadence** (vanilla store subscription, no
  React re-render per batch — OCTREE_RENDERER.md P17), and eviction goes through
  a byte-bounded LRU whose callback disposes GPU buffers (P13). The current
  plan's cells are protected.
- **Superseded work is abandoned.** Every drain carries a generation; a replan
  bumps it and a stale drain stops at its next await. (The v1 path had no abort
  at all — it decoded and mounted the whole superseded batch.)
- **The object catalog is lazy.** Nothing needs it to draw; it carries the
  format's only `list<struct<>>`, and identity questions are rare.
- **A placement change never rebuilds the manager.** The layer keeps its matrix
  VALUE-stable (identity churn from unrelated store writes used to rebuild the
  manager and refetch every cell), and `setVoxelToWorld` rebuilds only the
  world-space index from kept catalog rows — the caches hold voxel-space
  geometry and survive any placement.
- **No normals by default.** `computeVertexNormals` was the largest main-thread
  cost on the streaming path and per-cell smooth normals seam at cell borders;
  the material shades flat via screen-space derivatives instead (a debug-panel
  toggle restores smooth). Bounding volumes come from the catalog's boxes, not
  a walk over positions.
- **One render object per collection.** Mounted cells live in a single
  `THREE.BatchedMesh` (`fabriksBatch.ts`): on the WebGPU backend that is one
  pipeline + bind group with a per-range draw loop and PER-INSTANCE frustum
  culling from the analytic bounds, where per-cell `Mesh` objects cost a
  render object, a bind group and a render-list sort entry each. BatchedMesh's
  allocator only appends — deleted ranges return via `optimize()` or a
  capacity rebuild, both owned by `fabriksBatch.ts`. The per-cell path
  survives behind the panel's `batched` toggle as the A/B fallback.
- **Two plan budgets.** `maxCells` caps cell count; `maxIndices` caps what the
  cells weigh. Both coarsen, never drop. `pixelBudget` and the budgets are
  runtime knobs (`setPlanConfig`), steered from the debug panel between
  settles.
- **Everything is instrumented.** `FabriksStore` counts requests,
  `FabriksCollectionManager.stats` times plan/stream/build, and
  `buildDebugReport()` feeds the DebugPanel's "Fabriks Mesh" section and the
  copy-able octree debug report (`fabriks` key) — the
  `BrickResidencyManager` idiom.

## Client-side decisions the format leaves open

- **Planning happens in WORLD space.** `lodError` and the catalog's boxes are in
  voxels, and voxels are not world units — with a 5× z-step, planning in voxel
  space is wrong by 5× in exactly the direction that matters. So
  `buildFabriksCellIndex` transforms the boxes once at load and scales `lodError`
  by the matrix's **max** basis length (an LOD error is a scalar under an
  anisotropic map; the max can only over-refine, never under-refine).
- **Hysteresis.** fabriks's planner has none. This one runs at settle cadence, so
  a camera parked on the budget threshold would flip a region between levels —
  and refetch it — on consecutive plans. A cell that was drawn last time keeps a
  looser budget (`LOD_HYSTERESIS`, ±15%); one that was not must clear a tighter
  one.
- **Roots.** fabriks takes roots at the *declared* `grid.levels - 1`, which plans
  nothing when a collection declares more levels than its catalog reached. We
  fall back to the coarsest level present and warn — an empty render is the
  worst possible reading of a collection that has geometry.
- **Ordinals, not ids, on the GPU.** The per-vertex attribute carries the dense
  `ordinal` as **Float32**. An integer vertex attribute needs
  `gpuType = THREE.IntType` on WebGL2 and a `uint` TSL declaration on WebGPU;
  a float needs neither and is exact to 2^24 — which is also fabriks's own
  ordinal ceiling.

## Byte-contract traps (each is silent corruption, not an error)

- **`utf8: false` on every Parquet read.** hyparquet defaults it to *true* and
  treats any bare `BYTE_ARRAY` as a string — which is exactly what `positions`
  and `indices` are. `rowValues.toBytes` throws with this explanation if it ever
  sees a string.
- **Position stride is codec-dependent**: 6 bytes for `codec: NONE` (three bare
  uint16, no padding), 8 for `MESHOPT` (padded to four components for meshopt's
  stride rule, fourth dropped on decode).
- **Object offsets are START offsets of length n, not n+1 fenceposts.** Object
  `k` spans `[off[k], off[k+1] ?? total)` — hence `objectRange` rather than
  inline arithmetic.
- **Uint16 indices are gated on `vertexCount`, not on `encoding.indices`.**
  Indices address the cell's *concatenated* vertex array, which can exceed
  65535 even when the writer declared UINT16.
- **Per-blob ZSTD length comes from the row's counts** (`6·vertexCount`,
  `4·indexCount`) — the frame carries none. This is why the format refuses to
  pair ZSTD with MESHOPT.

## Credentials are their own kind

fabriks has its **own** grant — `requestGeneralFabriksAccess` — and a zarr grant
does not authorize a fabriks prefix. So `getGeneralAccess` is keyed by
`(client, kind)`: the two coexist in the cache instead of evicting each other,
and a fabriks caller can never be handed the zarr grant that happened to be
warm. Both are bucket-wide, so one round-trip still covers every store of a
kind, and both produce the same `S3FetchConfig` shape — `buildS3FetchConfig`
consumes either without knowing which it was given.

One grant covers a whole prefix: the manifest, both catalogs and every level.
`access.test.ts` asserts the separation directly, including that forcing a
refresh of one kind leaves the other untouched.

**A 403 here is usually not about credentials.** fabriks is the only reader in
the app that fetches by *overlapping byte ranges* — a Parquet footer, then a row
group running to EOF over the same tail — and `range` is a SigV4-signed header
that the browser's cache is allowed to rewrite before the request leaves. That
combination produces a `SignatureDoesNotMatch` on the geometry read while every
other store in the app keeps working. It is fixed in `s3-request.ts`
(`cache: 'no-store'` for ranged requests); the mechanism, the diagnosis recipe,
and the long list of things that are *not* the cause are in
`lib/zarr/runner/SIGV4_SIGNING.md`. Start there before suspecting the grant.

## Spec version — deliberately not gated

`manifest.specVersion` is parsed and kept, and nothing refuses on it.

The writer and the deployment are both at **1**, and the format's changes so far
— the manifest, the row-group locator, the object catalog — landed inside that
version rather than bumping it. So the label carries no decision today, and
gating on one that has never moved would only be a way to reject a collection
over a string.

What actually determines how bytes are read is the **`encoding` block**, and
that is validated strictly: every key required (a missing one is fatal, never
defaulted), every value checked against the format's vocabulary, and the
undecodable `MESHOPT` + `ZSTD` pair refused outright. A wrong `codec` is garbage
geometry; a surprising version string, on its own, is not.

If the version starts carrying meaning, `parseFabriksManifest` is the one place
to reinstate a check.

## Fixtures

`__fixtures__/` holds three collections written by **fabriks itself** (see
`generate.py`) — `raw`, `zstd` and `meshopt` — with a deliberately small row-group
budget so parts carry several row groups and the locator is actually exercised.
Testing the decoder against the real writer rather than against our reading of
the spec is what caught the stride and the offset conventions.

Regenerate with `python __fixtures__/generate.py <out>` in an environment with
`fabriks`, `trimesh` and `meshoptimizer` installed.

## Known gaps

- **The server has no `FabriksStore` yet.** `fabriksSource.ts` derives the prefix
  from the catalog object's key and borrows the general *parquet* grant. That
  file is the whole shim; when `MeshCollection.store: FabriksStore!` lands it
  becomes `collection.store.key` and grant kind `"fabriks"`, and nothing else
  changes.
- **Axis slots are assumed to match axis names.** fabriks's `cellSize` and
  `bbox_*` components are slots in the vertex order, while
  `resolveCollectionMatrix` derives spatial axes from the coordinate system's
  names. A collection whose components run `(z, y, x)` renders transposed with
  no error anywhere. Needs one such collection to test against.
- **Decode is main-thread.** The whole path is `await` over network I/O, so this
  is deliberate for now; `WorkerPool` (`lib/zarr/pool/`) is the vehicle if
  profiles say otherwise — but give fabriks its **own pool instance**, because
  pool slots are untyped and a recycled zarr codec worker cannot answer fabriks
  messages.
- **No per-object colour, visibility or picking yet.** The data is all here —
  ordinals on the vertices, the inverted index in `objects.parquet` — but
  `MeshLayer` has no way to persist render state (`updateLayer` returns
  `ImageLayer`; there is no `updateMeshLayer`), so there is nothing to wire it
  to.
