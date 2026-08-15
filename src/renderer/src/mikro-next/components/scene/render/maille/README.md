# The maille mesh renderer

Renders a `MeshLayer`'s collection: segmentation surfaces stored as a
[maille](https://github.com/jhnnsrs/maille) prefix — a self-describing tree of
Parquet files — streamed **one row group at a time** and anchored to a
coordinate system in the scene's transform graph (see
`../../COORDINATE_SYSTEMS.md`; planning discipline inherited from
`../../OCTREE_RENDERER.md`).

maille is the format's own specification and is authoritative. This document
describes the *client*: how the prefix is read, and every decision the format
leaves to a renderer.

## The big picture

```
MeshLayer.collection  ──►  mailleSource.openMailleCollection()
        │                    prefix + general grant → MailleStore
        ▼
   GET <prefix>/maille.json        (grid, encoding, every file + its LENGTH)
        │
        ▼
MailleCollectionLayer.tsx ── resolveCollectionMatrix()
        │                     (anchor image layer's frame, else graph compose)
        │  camera SETTLE (vanilla viewStore subscription — never per frame)
        ▼
MailleCollectionManager.updatePlan()
        │
        ├─ GET catalog/cells.parquet     ONE whole-file read, once
        │      └─ buildMailleCellIndex() boxes → WORLD space, lodError scaled
        │
        ├─ planMailleCells()   pure: descend from the coarsest level, keep a
        │                      cell when its SCREEN ERROR fits the budget, else
        │                      descend into the children `child_mask` names.
        │                      Budget exhaustion COARSENS; it never drops.
        │
        └─ groupByRowGroup()  ─►  MailleCollection.readFetchGroup()
                        │           footer once per part (cached), then the
                        │           byte span of the row group alone
                        ▼
                  decodeGeometryRow()   BLOB → dequantized Float32 positions,
                        │               Uint32 indices, per-vertex ordinals
                        ▼
                  BufferGeometry per cell (normals computed — maille has none)
                        │
                        ├─ LruByteCache (plan-protected, evict → dispose)
                        └─ group.add + invalidate()   (demand frameloop)
```

## Module boundaries (one concern per file)

| File | Owns | Knows nothing about |
| --- | --- | --- |
| `mailleManifest.ts` | `maille.json` → typed manifest; every refusal | HTTP, Parquet, three |
| `mortonCell.ts` | Morton cell codes | the rest of the world |
| `mailleGrid.ts` | cell → grid box, `child_mask` descent | Parquet, three |
| `rowValues.ts` | Parquet cell values → numbers/bytes; the only bigint site | everything |
| `mailleStore.ts` | authenticated whole-object + **ranged** GETs, rotation, 403 retry | Parquet, planning |
| `parquetPart.ts` | one part's footer + row-group reads | maille semantics, three |
| `mailleCatalogs.ts` | the two catalogs; the WORLD-space cell index | HTTP, three objects |
| `mailleDecode.ts` | blobs → typed arrays (dequantize, stride, meshopt, zstd) | HTTP, three |
| `maillePlanner.ts` | which cells at which level; row-group grouping | fetching, drawing |
| `mailleCollection.ts` | the read plan: which file, which row group, which columns | three, React |
| `mailleSource.ts` | API node → prefix + credentials | everything above |
| `mailleManager.ts` | THREE objects, reconcile, abort generation | React, HTTP, bytes |
| `MailleCollectionLayer.tsx` | lifecycle, transforms, settle cadence | everything above's internals |

## Why there is no DuckDB here

The v1 renderer issued SQL against a list of Parquet shards. maille's cell
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
  the asymmetry maille's 512 KiB row-group sizing is chosen against.
- **Fetch by ROW GROUP, not by cell.** A row group is the smallest thing a
  reader can fetch and a plan routinely puts several cells in one, so
  `groupByRowGroup` dedupes before any I/O.
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

## Client-side decisions the format leaves open

- **Planning happens in WORLD space.** `lodError` and the catalog's boxes are in
  voxels, and voxels are not world units — with a 5× z-step, planning in voxel
  space is wrong by 5× in exactly the direction that matters. So
  `buildMailleCellIndex` transforms the boxes once at load and scales `lodError`
  by the matrix's **max** basis length (an LOD error is a scalar under an
  anisotropic map; the max can only over-refine, never under-refine).
- **Hysteresis.** maille's planner has none. This one runs at settle cadence, so
  a camera parked on the budget threshold would flip a region between levels —
  and refetch it — on consecutive plans. A cell that was drawn last time keeps a
  looser budget (`LOD_HYSTERESIS`, ±15%); one that was not must clear a tighter
  one.
- **Roots.** maille takes roots at the *declared* `grid.levels - 1`, which plans
  nothing when a collection declares more levels than its catalog reached. We
  fall back to the coarsest level present and warn — an empty render is the
  worst possible reading of a collection that has geometry.
- **Ordinals, not ids, on the GPU.** The per-vertex attribute carries the dense
  `ordinal` as **Float32**. An integer vertex attribute needs
  `gpuType = THREE.IntType` on WebGL2 and a `uint` TSL declaration on WebGPU;
  a float needs neither and is exact to 2^24 — which is also maille's own
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

maille has its **own** grant — `requestGeneralMailleAccess` — and a zarr grant
does not authorize a maille prefix. So `getGeneralAccess` is keyed by
`(client, kind)`: the two coexist in the cache instead of evicting each other,
and a maille caller can never be handed the zarr grant that happened to be
warm. Both are bucket-wide, so one round-trip still covers every store of a
kind, and both produce the same `S3FetchConfig` shape — `buildS3FetchConfig`
consumes either without knowing which it was given.

One grant covers a whole prefix: the manifest, both catalogs and every level.
`access.test.ts` asserts the separation directly, including that forcing a
refresh of one kind leaves the other untouched.

## Spec version — deliberately not gated

`manifest.specVersion` is parsed and kept, and nothing refuses on it.

The label is in flux — the upstream Python writer and the deployment disagree on
it while describing byte-identical trees — so gating would reject data this
reader decodes cell for cell. What actually determines how bytes are read is the
**`encoding` block**, and that is validated strictly: every key required (a
missing one is fatal, never defaulted), every value checked against the format's
vocabulary, and the undecodable `MESHOPT` + `ZSTD` pair refused outright. A wrong
`codec` is garbage geometry; a surprising version string, on its own, is not.

If the version stabilises and starts carrying meaning, `parseMailleManifest` is
the one place to reinstate a check.

## Fixtures

`__fixtures__/` holds three collections written by **maille itself** (see
`generate.py`) — `raw`, `zstd` and `meshopt` — with a deliberately small row-group
budget so parts carry several row groups and the locator is actually exercised.
Testing the decoder against the real writer rather than against our reading of
the spec is what caught the stride and the offset conventions.

Regenerate with `python __fixtures__/generate.py <out>` in an environment with
`maille`, `trimesh` and `meshoptimizer` installed.

## Known gaps

- **The server has no `MailleStore` yet.** `mailleSource.ts` derives the prefix
  from the catalog object's key and borrows the general *parquet* grant. That
  file is the whole shim; when `MeshCollection.store: MailleStore!` lands it
  becomes `collection.store.key` and grant kind `"maille"`, and nothing else
  changes.
- **Axis slots are assumed to match axis names.** maille's `cellSize` and
  `bbox_*` components are slots in the vertex order, while
  `resolveCollectionMatrix` derives spatial axes from the coordinate system's
  names. A collection whose components run `(z, y, x)` renders transposed with
  no error anywhere. Needs one such collection to test against.
- **Decode is main-thread.** The whole path is `await` over network I/O, so this
  is deliberate for now; `WorkerPool` (`lib/zarr/pool/`) is the vehicle if
  profiles say otherwise — but give maille its **own pool instance**, because
  pool slots are untyped and a recycled zarr codec worker cannot answer maille
  messages.
- **No per-object colour, visibility or picking yet.** The data is all here —
  ordinals on the vertices, the inverted index in `objects.parquet` — but
  `MeshLayer` has no way to persist render state (`updateLayer` returns
  `ImageLayer`; there is no `updateMeshLayer`), so there is nothing to wire it
  to.
