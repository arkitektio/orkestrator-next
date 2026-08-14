# MeshCollection wire format — v2 (`specVersion: "2"`)

The Parquet contract behind `MeshCollection`: what the writer must produce and
what the renderer is allowed to assume. This document is normative for the
**writer**. The rule for what belongs here: *does a writer need to read this to
produce correct bytes?* If no, it lives in `README.md` (the renderer doc) —
including the v2 adoption checklist and the renderer backlog.

Sibling documents: `README.md` (this renderer, and the shipped v1 contract),
`../../OCTREE_RENDERER.md` (the planning discipline this inherits),
`../../COORDINATE_SYSTEMS.md` (how a collection is placed in a scene).
`MeshCollection.specVersion` selects the contract: `"1"` is shipped (see
README), `"2"` is this document.

---

## 1. The choice, and what it rules out

Multiscale for meshes is three independent decisions, and v1 fused all three
into one `level` column:

1. **Spatial partition** — how geometry is cut into independently fetchable,
   independently cacheable pieces.
2. **Detail reduction** — what "coarser" means.
3. **Identity granularity** — is a collection a triangle soup partitioned by
   space, or a set of *segments*, each with its own representation?

v2 chooses: **partition by octree cell (space-major), detail by decimated
self-contained copies per level, identity carried as object ranges inside the
cell row.**

The consequence worth stating up front: **space is the primary key, identity is
a secondary index.** Streaming stays a frustum query — the planner asks for
`(level, cell)` keys and never for objects — and everything object-shaped
(hide segment 4711, colour by `cell_type`, click-to-pick) is served by an
inverted index in the catalog plus per-vertex ordinals inside the cell, not by
re-partitioning the geometry.

Rejected alternatives, with reasons, in §7.

---

## 2. Files and layout

A collection is immutable per `version`. A new version writes a new prefix; no
file is ever rewritten in place. **This immutability is why attributes are not
in this format** (§4.2): attributes change, geometry does not.

```
<geometry prefix>/level=0/part-00000.parquet     ← MeshCollection.geometry[]
                  level=0/part-00001.parquet        (one ParquetStore per FILE)
                  level=1/part-00000.parquet
                  level=2/part-00000.parquet
<catalog prefix>/cells.parquet                   ← MeshCollection.catalog[0]
                 objects.parquet                 ← MeshCollection.catalog[1]
```

### L1 — level lives in the key

Each geometry store's `key` MUST contain a `level=<N>/` path segment. The
renderer builds its per-level `read_parquet([…])` list by matching that
segment, so a `level = 2` fetch opens only level-2 footers. A store list with
no `level=` segment is read as v1 (all files, every query) — the compatibility
path, not a target.

Globbing `s3://bucket/prefix/level=2/*.parquet` from a single prefix-keyed
store would be tidier, but DuckDB's httpfs glob needs `ListObjects` on the
prefix, and access grants are scoped to objects (`SCOPE 's3://bucket/key'`).
See §9-Q1 — this constraint is worth re-checking on the server before the
shard count gets large.

### L2 — shard by Morton range, not round-robin

Within a level, a shard holds a contiguous `cell` interval, so its row-group
min/max is a tight range and the planner's cell predicates prune to range
reads. Round-robin or hash-sharding defeats every zone map in the file.

### L3 — size shards and row groups by BYTES

~64–256 MB per shard, ~8–32 MB per row group. DuckDB's default of 122,880 rows
per row group is meaningless here: rows carry multi-megabyte BLOBs, and one row
group per handful of cells destroys pruning granularity.

**Interaction with L1 to watch:** L1 + L3 mean a TB-scale collection is
thousands of `ParquetStore`s, and a naive client requests one access grant and
issues one `CREATE SECRET` per store. The renderer must install secrets lazily,
per level, for the stores a query actually reads — see README's backlog. If
shard counts are expected to exceed ~1000, resolve §9-Q1 instead.

### L4 — `catalog` is TWO stores

`cells.parquet` and `objects.parquet`, one `ParquetStore` each, role encoded in
the key exactly as L1 encodes level. **Not a prefix holding two files**: an
object-scoped grant on a prefix key cannot authorize its children, and a URL
that misses its secret's `SCOPE` falls back to the default AWS endpoint and
dies as a confusing CORS error rather than a permission error (the failure
`lib/attributes/lookupEngine.ts` documents at its `grantUrl` helper).

This requires widening `MeshCollection.catalog: ParquetStore!` to
`[ParquetStore!]!` — a **schema delta v2 depends on**, not a convention the
writer can adopt unilaterally. If a breaking change is unacceptable, keep
`catalog` meaning `cells.parquet` and add `objectCatalog: ParquetStore`.

### L5 — bound the encoded bytes per cell row

**A single cell row's encoded geometry SHOULD NOT exceed 8 MB.** A cell that
exceeds this at level 0 is a signal that `cellSize` is too large.

This is a real constraint, not tidiness. Three things depend on it: a decode
worker must **copy** the BLOB across the postMessage boundary (Arrow buffers
are views into a shared record batch — see `meshDecode.ts`'s `alignedCopy`
note); a frame-budgeted upload drain can only be budgeted if one row fits
inside the budget; and DuckDB-wasm materializes the whole result set.

### L6 — numeric limits

`lib/duckdb/duckdb.ts` opens DuckDB with `castBigIntToDouble: true`, globally.
Every `BIGINT` reaches JS as a float64, so every id in this format is exact
only below 2^53. Three limits follow, and a writer that exceeds any of them
produces a collection that renders wrong with **no error**:

| quantity | limit | consequence of exceeding |
| --- | --- | --- |
| `cell` Morton code | < 2^53 → **17 bits per axis**, i.e. ≤ 131072 level-0 cells on any axis | `mortonChildren`'s `code * 8 + k` loses precision; descent addresses the wrong cells |
| `object_id` | < 2^53 | ids collide silently on arrival |
| `ordinal` (§3.1) | < 2^24 (16.7 M objects per collection) | the Float32 vertex attribute loses precision; wrong colours, wrong picks |

`mortonCell.ts` already documents the 17-bit budget on the client side; this is
the writer-side half of the same contract.

---

## 3. The geometry table

**One row per `(level, cell)`.** Not per fragment, not per object — §3.3 for
why. A cell's geometry is exactly one row.

| column | type | meaning |
| --- | --- | --- |
| `level` | `INT` | octree level, 0 = finest; a level-L cell spans `cellSize · 2^L` voxels |
| `cell` | `BIGINT` | Morton code on that level's grid, x in the least-significant bit (`mortonCell.ts`) |
| `positions` | `BLOB` | `vertex_count` vertices, layout per `encoding.positions` |
| `normals` | `BLOB?` | per `encoding.normals`; omit → renderer computes vertex normals |
| `indices` | `BLOB` | triangle list, `UINT16` or `UINT32` |
| `vertex_count` | `INT` | |
| `index_count` | `INT` | multiple of 3 |
| `object_ids` | `LIST<BIGINT>` | objects present in this cell, **strictly ascending** |
| `object_ordinals` | `LIST<INT>` | each object's `ordinal` from `objects.parquet`, parallel to `object_ids` |
| `object_vertex_offsets` | `LIST<INT>` | length `n+1`, prefix offsets into the vertex array |
| `object_index_offsets` | `LIST<INT>` | length `n+1`, prefix offsets into the index array |

Position/normal/index encodings are unchanged from v1
(`UINT16_QUANTIZED_PER_CELL` over the cell's voxel box, `OCT16` normals,
`MESHOPT` or `NONE` codec). Parquet page compression stays `ZSTD`: meshopt's
output is deliberately designed to be handed to a general-purpose compressor
afterwards, so the two are complementary, not redundant.

### 3.1 Object ranges, ids, and ordinals

Object `k` occupies vertices `[object_vertex_offsets[k], object_vertex_offsets[k+1])`
and indices `[object_index_offsets[k], object_index_offsets[k+1])`. The last
entry of each offset list equals `vertex_count` / `index_count`.

**Why both `object_ids` and `object_ordinals`.** The id is the segmentation
label — the thing a user names and a `colorBy` table joins on. The **ordinal**
is its dense 0-based rank in `objects.parquet`, and it is what the renderer
actually puts on the GPU:

- A per-vertex attribute carrying raw ids would need `Uint32Array` +
  `attribute.gpuType = THREE.IntType` on WebGL2 and a `uint` declaration in TSL
  on WebGPU — plumbing nothing in this repo does today. A **Float32** attribute
  carrying an ordinal needs neither and is exact to 2^24 (L6).
- The colour/visibility LUT is indexed directly by ordinal: no hashing, no
  sparse id→slot map, no per-frame lookup structure.

Three invariants, all load-bearing:

- **I1 — an object's vertices are contiguous, and its triangles index only its
  own vertex range.** No triangle straddles two objects. (Trivially true for
  segmentation meshes; stated so a writer that merges touching surfaces does
  not break decoding.)
- **I2 — `object_ids` is ascending and duplicate-free**, so a raycast face
  index binary-searches back to an object.
- **I3 — `object_ordinals[k]` equals the 0-based row rank of `object_ids[k]` in
  `objects.parquet`**, consistently across every cell and level of the version.

This requires the writer to sort vertices and triangles by object within a
cell. That also helps the meshopt index codec, which rewards locality, and
costs nothing versus an arbitrary order.

### 3.2 What the renderer gets from the ranges

Decoding gains one cheap fill loop: a `Float32Array` per-vertex `objectOrdinal`
attribute, written from the offsets. From there the renderer can colour by a
LUT texture, hide objects through the same LUT, and resolve a raycast hit to an
object by binary-searching `object_index_offsets` — one `THREE.Mesh` per cell,
as today. The mechanics (2D LUT layout, in-place texture adoption, raycast
cost, the bytes the offsets add to the cache budget) are renderer concerns and
live in `README.md`.

### 3.3 Why one row per cell rather than one row per (cell, object)

Per-`(cell, object)` rows are the obvious way to carry identity, and they are
wrong here. In a dense segmentation a 128³-voxel cell touches hundreds of
segments; row-per-object multiplies the row count by that factor, shrinks each
BLOB to kilobytes, and both the compression ratio and DuckDB's per-row overhead
go with it. Worse, the renderer would then have to merge N geometries per cell
at decode time to keep one draw call — doing at runtime the concatenation the
writer can do once. List columns give the same information with the row count,
BLOB sizes and merge cost of v1.

---

## 4. The catalog

### 4.1 `cells.parquet` — one row per `(level, cell)`

This is what removes the `GROUP BY level, cell` over every geometry row that v1
runs at layer mount — an O(collection) scan to answer an O(cells) question.

| column | type | meaning |
| --- | --- | --- |
| `level`, `cell` | `INT`, `BIGINT` | the cell address |
| `vertex_count`, `index_count` | `INT` | budget accounting, no scan |
| `bbox_min_x/y/z`, `bbox_max_x/y/z` | `FLOAT` | **exact geometry bounds** in collection voxel coordinates |
| `lod_error` | `FLOAT` | see below |
| `object_count` | `INT` | |
| `child_mask` | `UTINYINT` | bit *k* set ⟺ Morton child `8·cell + k` exists at level-1. Requires **P3**. |

Two of these change planner behaviour rather than just saving a query:

- **`bbox_*` replaces the address box.** v1 culls against the cell's *address*
  box, so a cell holding one triangle in a corner culls as if it were full. The
  exact box is strictly tighter and costs six floats per cell.
- **`lod_error` replaces the pure footprint heuristic**, which adapts to
  geometry that decimates well versus geometry that does not — something a
  footprint rule cannot see.

**`lod_error` is an L∞ distance in voxels** of the collection's coordinate
system: the maximum *per-axis* displacement of this cell's decimated geometry
from the finest level, not a Euclidean norm.

Voxels, not micrometres, for the same reason vertices are in voxels: physical
units would bake a calibration into the artifact, and a registration refinement
would stale every `lod_error` in the collection. Converting to screen-space
error is the renderer's job, and it must scale by the **maximum axis scale** of
the voxel→world matrix so the test never under-refines an anisotropic grid.
Refine while `lod_error · maxAxisScale · pxPerWorldUnit > τ`, τ ≈ 1 px.

### 4.2 `objects.parquet` — one row per object, geometry facts only

| column | type | meaning |
| --- | --- | --- |
| `object_id` | `BIGINT` | segmentation label id; **ascending, unique** |
| `ordinal` | `INT` | dense 0-based rank of this row — the LUT index (§3.1, I3) |
| `bbox_min_x/y/z`, `bbox_max_x/y/z` | `FLOAT` | voxel-space bounds |
| `vertex_count`, `index_count` | `BIGINT` | at the finest level present |
| `cells` | `LIST<STRUCT<level INT, cell BIGINT>>` | the inverted index: where to find this object |

`cells` is what makes "isolate segment 4711" a catalog lookup returning the
cell keys to fetch, instead of a scan over the geometry table. The reverse
direction is already in the geometry row's `object_ids`, so it is not
duplicated here.

**Attributes are deliberately not in this file.** `cell_type`, `volume_um3` and
everything like them live in the `TableDataset` the collection's FIELD edge
keys into, named by `colorBy.table` / `colorBy.column` exactly as a
`LabelLayer`'s are, and reached through `attributePlans(system:)`. Two reasons,
in order of weight:

1. **Mutability.** A collection is immutable per `version` (§2) and the client
   caches on that key. Attributes are not immutable: a user recomputes a
   classification, adds a column, fixes a label. Baking them in means either
   rewriting a file the format promises is never rewritten, or bumping
   `version` — invalidating the entire geometry cache and re-fetching, for a
   column edit. That is the wrong coupling.
2. **The schema already made this call.** `LabelColorBy` names a table and not
   a join, because the edge that makes the lookup possible is already in the
   coordinate graph; `LabelAccessor` declares the mask-value → table-row join
   explicitly. A second, format-level join would contradict it.

A writer MAY emit additional columns as a denormalized cache. The renderer uses
them **only when `colorBy.table` is null**, and never in preference to the
table. Stating precedence is what keeps the two from silently disagreeing.

See §9-Q2: whether an attribute plan is discoverable from a `MeshCollection`'s
own coordinate system has not been verified, and this decision rests on it.

---

## 5. Grid, encoding, and the pyramid invariants

`grid` (unchanged from v1) is `{ cellSize: [x,y,z] (voxels), levels: N,
sortKey: "MORTON" }`. `encoding` gains two keys:

```jsonc
{
  "positions": "UINT16_QUANTIZED_PER_CELL",
  "normals": "OCT16",
  "indices": "UINT16",
  "codec": "MESHOPT",
  "compression": "ZSTD",
  "boundary": "LOCKED",        // NEW — crack policy, §5.2
  "decimation": "QUARTER"      // NEW — what a level means, §5.1
}
```

### P1 — Parent coverage (geometric, not row-existence)

**If a cell exists at level L, its Morton parent exists at L+1 up to the
coarsest level — and by P2 that parent is a complete standalone representation
of everything inside its box, including everything in this cell.**

The geometric half is the point. `planMeshCells` starts from roots at the
coarsest available level and descends; geometry sitting under a *missing* root
is unreachable — never planned, never fetched, silently absent from the render
with no error anywhere. An empty parent row satisfies the letter of a
row-existence rule and still breaks rendering, because it is coverage that
makes "a region with no finer rows stays covered by its coarser cell" sound.

This should ship with a **validator**, not just prose.

### P2 — Levels are self-contained, not deltas

A level-L cell is a complete, standalone representation of everything inside
its box. It is never a refinement of its parent. This is what lets any cell be
fetched, decoded, cached and evicted independently — the property the whole
planner, LRU and mixed-level plan rest on.

### P3 — Levels are contiguous

**The set of levels present is `0 … levels-1`, with no gaps.** A collection
with a genuinely empty level must emit it as a copy of the level below.

Without this, `child_mask` is unsound: it describes the *immediate* Morton
child, but a planner facing a gap (say 3 → 1) must expand codes across the gap,
and a level-3 row's 8 bits say nothing about level 1 — so a planner that trusts
the mask prunes real geometry. P3 also makes "snap to the nearest available
level" a no-op. The alternative (a `descendant_mask` at the next present level
— 64 bits for a one-level gap, 512 for two) is not worth it.

### 5.1 `decimation` — what "coarser" means

`"QUARTER"`: each level targets ~¼ the triangles per unit surface area of the
level below, so on-screen triangle density is roughly constant as a region
changes level. Total storage is then the geometric series ≈ 1.33× the finest
level alone — the price of the format, and the right price.

### 5.2 `boundary` — the crack policy

Adjacent cells rendering at different levels produce T-junction cracks. This is
a *writer* property; the renderer cannot repair it, so it must be declared.

- `"OPEN"` — no guarantee. Seams appear where neighbours differ in level.
- `"LOCKED"` — during decimation at level L, vertices lying on the face planes
  of the level-L grid **and of every coarser level's grid** are pinned: neither
  collapsed nor moved. Crack-free by construction, at the cost of retained
  boundary detail (a fixed triangle overhead per cell face, growing with depth).

**`OPEN` is not compatible with object isolation, and therefore not with the
feature v2 exists for.** The tolerance argument for `OPEN` is a dense-field
argument — neighbours usually agree on level, so a seam is a seam between two
surfaces. Render one isolated object and every level mismatch on its boundary
becomes a hole against empty space. **A collection intended to support
per-object visibility MUST declare `boundary: "LOCKED"`.**

Unconditionally, and independent of the policy: **compute normals on the
unclipped surface, before splitting into cells** — otherwise every cell face
gets a rim of wrong-facing normals and the seam is lit as a crease even when
the geometry matches perfectly.

### 5.3 Quantization

`UINT16_QUANTIZED_PER_CELL` stays: `q/65535` spans the cell's *address* box per
axis (not the exact bbox — the address box is derivable from `level`/`cell`
alone, which is why dequantization needs no per-row columns). Two cells at the
same level sharing a face quantize a vertex on that face to `65535` in one and
`0` in the other, both exact, so same-level neighbours never crack from
quantization. Across levels the coarse step is `2^Δ` larger — which is what
`boundary: "LOCKED"` exists to handle.

---

## 6. Query shapes

**Cell index — one small file read, no aggregate:**

```sql
SELECT level, cell, vertex_count, index_count,
       bbox_min_x, bbox_min_y, bbox_min_z,
       bbox_max_x, bbox_max_y, bbox_max_z,
       lod_error, object_count, child_mask
FROM read_parquet('s3://…/catalog/cells.parquet')
```

**Geometry — per level, run-compressed ranges over that level's files only:**

```sql
SELECT cell, positions, normals, indices, vertex_count, index_count,
       object_ids, object_ordinals, object_vertex_offsets, object_index_offsets
FROM read_parquet([<only the level=2 stores>])
WHERE (cell BETWEEN 8192 AND 8199) OR (cell BETWEEN 8320 AND 8327) OR …
```

Morton descent emits sibling runs, so the cells a plan *emits* are largely
contiguous. **The cells a plan finally queries are not**: they are frustum-
culled and then truncated by a distance-sorted budget, so the set is spatially
perforated. Building the predicate therefore requires three rules, and skipping
them can make this optimization *worse* than the `cell IN (…)` it replaces:

1. Sort the plan's cells by `cell` and run-length encode — the emitted order is
   distance order, not code order.
2. **Merge runs separated by a gap of ≤ G cells.** A short gap is cheaper to
   read through than a second range is to evaluate.
3. **Cap the predicate at ~512 intervals**, falling back to a single span
   `cell BETWEEN min AND max` beyond that.

---

## 7. Rejected alternatives

**Object-major multiresolution** (rows keyed `(object_id, lod, fragment)`; the
Neuroglancer precomputed shape). Selection, per-object colour and picking fall
out for free, and it is the natural fit for "show me these 40 neurons". It
loses on view-dependent streaming: a dense field of 200k small objects becomes
200k independent fetch decisions with no way to express "everything in this
frustum" without scanning an object bbox index, and the triangle budget
degrades per object rather than per region — distant objects stay at full
detail until they vanish entirely. §3's list columns buy the identity benefits
without giving up the frustum query.

**Native columnar geometry** (one row per vertex, one per triangle; positions
as `INT16` columns). DuckDB could then filter, join and aggregate over
geometry, and Arrow would hand buffers to the GPU with no decoder. But 10⁸ rows
is a different order of cost in DuckDB-wasm, meshopt's vertex-cache reordering
is gone, and "this cell's triangles" needs a self-join. Worth revisiting only
if meshes become something we *analyse* rather than draw.

**Progressive / cluster-DAG** (coarse level as a base, fine levels as
refinement deltas; Nanite-shaped). ~1× storage instead of 1.33×, crack-free by
construction. It also makes decoding a cell require all of its ancestors, which
destroys independent fetch/cache/evict — the property P2 exists to protect. A
1.33× storage factor is not worth that.

---

## 8. Deliberately deferred

- **Per-object LOD.** An object smaller than a cell gets the cell's level.
  Correct-looking, occasionally wasteful; fixing it means object-major
  fragments for small objects, i.e. re-opening §7's first alternative.
- **Per-object silhouettes** (the mesh analogue of `LabelRender.contour`). An
  object crossing a cell boundary is genuinely two meshes there, so a naive
  outline draws an internal edge at every crossing. Needs either a shader that
  suppresses edges where the neighbouring fragment's ordinal matches, or
  nothing.
- **Time.** Nothing here is 4D. A `t` column would partition alongside `level`,
  but the transform graph, not this format, decides what that means.

---

## 9. Open questions for the server

Three of this document's positions rest on server behaviour nobody has
verified. They are listed rather than asserted, because burying them as
confident prose is how a format ships wrong.

**Q1 — the grant scope model.** L1 rejects prefix globbing and L4 rejects a
prefix catalog, both because grants are object-scoped. If a *prefix*-scoped
grant is issuable, both decisions loosen: globbing becomes legal, the catalog
can be one prefix, and L3's shard count stops implying thousands of grant
round-trips at mount. Worth answering before shard counts grow.

**Q2 — attribute-plan reachability.** §4.2 defers attributes to the
`TableDataset` path on the assumption that `attributePlans(system:)` resolves
from a `MeshCollection`'s own coordinate system, across `derivedFrom`, to the
label array's system where the FIELD edge lives. Plan discovery is documented
as crossing derivation edges but never registrations; **nobody has run that
query for a mesh collection.** If it does not resolve, the denormalized-column
escape hatch in §4.2 is the fallback.

**Q3 — the `catalog` field shape.** L4 needs `catalog: [ParquetStore!]!` (or
`+ objectCatalog`). This is a schema change, not a writer convention.
