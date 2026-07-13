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
        ├─ planMeshCells()          pure: LOD level + frustum cull (in the
        │                           collection's OWN voxel space) + near-first
        │                           triangle budget
        ├─ cache hits               mounted into the THREE.Group instantly
        └─ misses ─► MeshParquetSource.fetchCellRows()
                        │   ONE batched `cell IN (...)` SQL per plan
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
  **batched `cell IN (...)` query per plan** fetches geometry. Morton-sorted
  shards + Parquet row-group pruning make that range reads, not full scans.
- **Planning runs at camera-SETTLE cadence** (vanilla store subscription, no
  React re-render per batch — OCTREE_RENDERER.md P17), and eviction goes
  through a byte-bounded LRU whose eviction callback disposes GPU buffers
  (P13). The current plan's cells are protected from eviction.
- v1 plans **one LOD level per view** (nearest available to the screen-space
  desired level). Per-cell octree refinement slots into `meshPlanner.ts`
  without touching the data plane or the manager.

## Parquet data contract (v1 — the writer must match this)

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

Preferred: an image layer in the scene whose lens/dataset/pyramid contains
the collection's coordinate system (i.e. the labels layer the meshes were cut
from) — the mesh group reuses `buildVolumeVoxelToWorld(thatLayer)`, so meshes
and labels overlap by construction, centering/y-flip included. Fallback:
`composeCsToWorld` over the scene graph plus dataset edges gathered from the
scene's layers (`collectDatasetEdges` — an edge is an edge wherever the API
delivered it) — correct in world units but uncentered relative to image
layers until the scene-root frame normalization lands (tracked follow-up;
see `../../COORDINATE_SYSTEMS.md` §4).

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

## Deliberately deferred (do not build without cause)

- **Per-cell octree refinement** (mixed LOD levels in one plan) — slots into
  `meshPlanner.ts` alone; the data plane and manager already handle arbitrary
  cell sets.
- **Catalog-driven attributes** — `colorBy` (e.g. `cell_type`) coloring and a
  per-cell `lodError` metric for the refinement test; both are catalog
  columns, not geometry changes.
- **Decode worker** — decoding is main-thread; cells are small and batched,
  but a repack-dispatcher-style worker pool is the known next lever if
  profiles say otherwise.
- **Instance picking** — per-fragment ids for click→segment resolution
  (needs an id column in the geometry rows first).
