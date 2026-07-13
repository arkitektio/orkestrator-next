# Mesh collection renderer

Renders a `MeshLayer`'s `MeshCollection`: segmentation meshes stored as rows
in Parquet, streamed cell-by-cell through DuckDB-wasm, anchored to a
coordinate system in the scene's transform graph.

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
scene's layers — correct in world units but uncentered relative to image
layers until the scene-root frame normalization lands (tracked follow-up).
