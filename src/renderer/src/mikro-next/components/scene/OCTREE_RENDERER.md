# The pyramidal octree (brick pool) renderer

Design notes for the scene renderer. It replaced both legacy paths — the
per-chunk 2D tile meshes (`ChunkPlane`) and the monolithic single-LOD 3D
volume texture (`VolumeTextureMesh`), both deleted at cutover — with one
hierarchical, view-dependent streaming system in the style of
Neuroglancer / BigVolumeViewer.

This document has two halves: **concepts** (how it works, and why each piece is
shaped the way it is) and **pitfalls** (everything that bit us during live
testing, so nobody re-learns it).

---

## 1. The big picture

```
camera / z / mode / view ranges
        │
        ▼
  nodePlanTracker ──────────── planLayerNodes() ──► LayerNodePlan (per layer)
  (debounced driver)           (pure, tested)          │
                                                       ▼
  BrickResidencyManager.reconcile(plan)
        │  diff vs. resident set
        ├─ abort fetches for dropped bricks
        ├─ enqueue missing bricks (priority: coarse-first, then plan order)
        │
        ▼
  fetch zarr chunks (worker pool, shared in-flight, byte-LRU cache)
        │
        ▼
  repackBrick(): chunks ─► canonical x-fastest brick buffer (+border, +channels)
        │
        ▼
  drainUploads() in useFrame (byte/brick budget per frame)
        ├─ texSubImage3D into the layer's brick ATLAS (one Data3DTexture)
        ├─ page-table mirror write + flush (RGBA8UI Data3DTexture)
        └─ residencyVersion++ → invalidate()
        │
        ▼
  shader: sampleBrick(p, desiredLevel, ch)
        page-table texelFetch ─► resident? sample atlas slot
                              ─► empty?    return uniform fill value
                              ─► unmapped? walk to coarser levels (per SAMPLE)
```

The per-sample coarse fallback in the shader is the keystone: it is what lets
the planner have only two roles (`target`, `keep`) and removes the entire
cover/substitute/render-feedback machinery the legacy 2D planner needed.
Anything not yet streamed simply renders coarser, per pixel, with no CPU
involvement.

**2D is not a separate renderer.** It is the degenerate case of the same
system: the plan is a quadtree over a single z-slab, bricks are `256×256×1`
slabs, and the plane material composites with the same `sampleBrick` tap.

---

## 2. Concepts

### 2.1 Level geometry (`core/octree/levelGeometry.ts`)

`buildLayerLevelGeometry(dims, layer, allLevels)` normalizes a layer's zarr
pyramid into canonical `[x, y, z]` spatial order with per-level scale factors.
Scale resolution order: explicit `scaleFactors` → shape ratio vs. base →
`2^levelIndex` (z falls back to 1, matching typical microscopy pyramids that
never downsample z).

Channel count is `min(16, intensity extent)` — 16 is the compositor limit
shared with the legacy path.

**Duplicate levels are deduped by spatial shape.** Real datasets ship two
level-0 `dataArrays` (one with `scaleFactors: null`, one with `[1,1,1,1]`)
pointing at different stores. Without dedupe the planner planned — and the
residency manager fetched — the same voxels twice (see pitfall P6).

### 2.2 Node addressing (`core/octree/nodeAddress.ts`)

A node is one brick on one pyramid level, keyed `"level:bx:by:bz"` on that
level's own brick grid. Channels are **not** part of the key — all channels of
a brick live stacked inside one atlas slot. Non-spatial dims (t, extra slices)
fold into the layer's slice signature; a signature change flushes the layer's
residency wholesale. `currentZ` is deliberately NOT in the signature — z is a
spatial axis of the brick address (the page table holds every slab), so
z-scrubbing keeps residency and revisited slabs render instantly (see P15).

**A brick is not a zarr chunk.** The fetch unit stays the zarr chunk (keeps
the worker pipeline and caches untouched); `chunksTouchingBrick` maps a brick's
fetch box to the 1–N chunks that intersect it, and repack cuts the brick out of
the decoded chunks.

### 2.3 Brick spec (`core/octree/brickSpec.ts`)

Per (layer, mode):

- **3D:** payload `64³`, border 1 (stored `66³`), LinearFilter. The 1-voxel
  border is edge-replicated at volume boundaries and is what makes
  linear-filtered inter-brick seams invisible.
- **2D:** payload `[256, 256, 1]`, border 0, NearestFilter — pixel-parity with
  the legacy `ChunkPlane` look.

The payload auto-doubles per axis until every level's *page grid* fits the 3D
texture limit (2048 under ANGLE). In 2D the z payload only doubles when the z
page grid itself exceeds the limit — otherwise 3000-slice stacks force
pointless fat slabs (pitfall P1).

### 2.4 Page table (`core/octree/pageTableLayout.ts`, `render/bricks/gpu/pageTableTexture.ts`)

One packed `RGBA8UI` `Data3DTexture` per (layer, mode). **All pyramid levels
live in this single texture**, stacked along one axis with per-level
`uPageOffset[level]` uniforms, because GLSL ES 3.0 forbids indexing a sampler
array with a non-uniform value — one texture with offsets is the only way to
walk levels in a per-sample loop.

A texel is `(slot.x, slot.y, slot.z, flag)` with flag ∈
`{0 UNMAPPED, 1 RESIDENT, 2 EMPTY}`. `EMPTY` marks a uniform-fill brick: it
consumes **no atlas slot**; its fill value is encoded 8-bit into the R channel
(raw value, see pitfall P11). CPU `Uint8Array` mirrors per level with dirty
flags; dirty levels are re-uploaded whole (they are tiny).

### 2.5 Brick atlas + slot LRU (`render/bricks/gpu/brickAtlas.ts`, `core/octree/brickPoolState.ts`)

One `Data3DTexture` per (layer, mode), format `R8` or `R32F` only — the zarr
worker emits only `Uint8Array` or `Float32Array` (uint16 is promoted). Slot
depth is `stored.z × channelCount` (channel slabs stacked in z).

Slot count: `min(totalBrickCount(geometry), max(minSlots, budgetShare /
slotBytes))` where `budgetShare = min(MAX_LAYER_POOL_BYTES = 128 MB,
globalBudget / plannableLayers)`. The `totalBrickCount` cap matters: a tiny
4-brick debug layer must not allocate a 296-slot float32 atlas (pitfall P4).

`BrickPoolState` is a pure CPU class: Map-insertion-order LRU with a
protected-key set. The current plan's `target` + `keep` nodes are protected
each reconcile; coarsest-level bricks are effectively permanent (always in
`keep` chains), so a fallback of last resort is always resident. Eviction
unmaps the evicted brick's page entry.

A CPU backing mirror of every uploaded brick is kept (bounded by the same
budget). It serves synchronous probes (`sampleResident`), context-loss
restore, and remap-without-refetch.

### 2.6 The unified planner (`core/octree/nodePlanning.ts`)

`planLayerNodes()` produces `LayerNodePlan { mode, sliceSignature, targetLevel,
slabZ, nodes, planBytes }` with exactly two roles:

- `target` — fetch and protect,
- `keep` — ancestor chain: protect, fetch only if missing.

Refinement is a closest-first DFS from the coarsest level: a node splits into
children while its screen footprint (`px per voxel × finerFactor × lodBias`)
says finer data would be visible **and** the byte budget allows. Closest-first
ordering means budget exhaustion degrades *distant* regions first.

Culling happens in **layer voxel space**: the world frustum is pulled through
`buildVolumeVoxelToWorld(layer)⁻¹` so the per-node test is a cheap AABB check
on the node's voxel box. 2D restricts the DFS to a single z-slab quadtree at
`resolveLevelZ(level)`.

**The budget floor is chunk-granular** (`visibleBytesAtLevel`): it counts
*chunk-aligned decoded bytes* touched by the visible region, not GPU slot
bytes. This is the fix for plane-chunked SPIM data where one 64³ brick forces
a 14 MB `[2, 2048, 2048]` chunk decode — GPU-byte accounting made absurdly
optimistic plans (pitfall P5). `budgetMinLevel` is the finest level whose
chunk-aligned visible cost fits `maxPlanBytes`; `fixedLOD` overrides it.

### 2.7 The plan driver (`managers/nodePlanTracker.ts`)

Subscribes to `layerViewRanges`, `lodBias`, `currentZ`, the flag, scene layers,
`viewProjectionMatrix`, and `displayMode`. Two deliberate absences:

- **`residencyVersion` is NOT a trigger.** Plans describe *desire*; residency
  describes *state*. Feeding residency back into planning recreated the legacy
  feedback loop and caused replan storms while streaming (pitfall P7).
- **Replans are debounced** (`MIN_REPLAN_INTERVAL_MS = 200`): camera emissions
  arrive at ~16 Hz during a drag; replanning per tick burned the main thread
  for zero visual gain (pitfall P9). Tests must wait ≥ 280 ms (`settle()`).

Plan writes are identity-stable (`sameNodePlan`): a value-equal replan does not
touch the store, so downstream React sees nothing.

### 2.8 Residency manager (`managers/brickResidency.ts`)

A plain class (registered in `viewerStore`, like `canvas`). Key mechanics:

- **Shared in-flight chunk fetches** (`fetchChunkShared`): a promise map keyed
  `storeId:chunkCoords`. Without it, 12 concurrent bricks touching the same
  plane chunk each triggered their own 14 MB decode — a measured **73×
  fetch amplification** (pitfall P8, the single worst bug of the bring-up).
- **Byte-bounded decoded-chunk cache** (`zarr/caches/byteBudgetChunkCache.ts`,
  512 MB LRU). The runner's default cache is *count*-bounded; 500 entries of
  plane chunks pinned multiple GB (pitfall P6).
- **In-flight ceiling** `MAX_INFLIGHT_BRICKS = 12`, abort-on-drop per brick via
  the worker runner's signal path.
- **Frame upload budget** 6 MB / 12 bricks, drained in
  `BrickSystemProvider`'s `useFrame`; every batch ends with page flush,
  `residencyVersion++`, `invalidate()` (demand frameloop).
- **Stats are first-seen-honest**: `bytesDecoded` counts a chunk key once, not
  per cache hit (pitfall P10). `buildDebugReport()` backs the DebugPanel's
  "Copy debug report" button — paste that JSON when reporting perf issues.

### 2.9 Repack (`core/octree/brickRepack.ts` + `repackDispatcher.ts`)

Pure, golden-buffer-tested, and — since the P17 hardening — run **off the UI
thread**: `BrickResidencyManager` submits jobs through a `RepackDispatcher`
(`core/octree/repackDispatcher.ts`), a 2-worker pool around the unchanged pure
function (`repack-worker.ts`; sync fallback when `Worker` is unavailable —
vitest/jsdom). Strided copy from decoded chunks into the canonical output
layout `((c·storedZ + z)·storedY + y)·storedX + x` (x-fastest — this is why
the shaders have no `dimRemap`), then per-axis edge replication for the
border, then a min/max scan; `min == max` flags the brick EMPTY. Decoded
chunks travel to the repack worker zero-copy (SharedArrayBuffer-backed — the
app is crossOriginIsolated and `getChunkWorker` forwards
`useSharedArrayBuffer`) while STAYING in the main-side chunk cache; the output
brick returns as a transferable. `stats.repackMs` is therefore wall time
(queue + worker), not main-thread time. No cancellation: jobs are a few ms and
stale results are absorbed by the existing `protectedKeys`/`staleDrops` gate.

Related main-thread costs, assessed: the per-upload CPU backing-mirror copy in
`writeBrickToAtlas` (§2.5) is KEPT — `sampleResident` (probes) and
context-loss restore both read `atlas.backing`, and the copy is bounded by the
6 MB/frame upload budget. Per-chunk `zarr.json` re-parsing on the main thread
was removed via a per-array metadata memo
(`lib/zarr/runner/get-worker.ts` `readArrayMetadataCached`).

### 2.10 Shader traversal (`glsl/brickTraversal.ts`)

`sampleBrickEx(p01, desiredLevel, channel)` → `0 unmapped / 1 resident / 2
empty`. Resident path: page `texelFetch` → atlas tap at
`slotOrigin + border + inBrickOffset (+ channel-slab z)`. Unmapped path: loop
to coarser levels (bounded by `MAX_BRICK_LEVELS = 10`).

- **3D** (`layers/bricks/BrickVolumeLayer.tsx`): unit-box raymarcher marching
  in **base voxel space** (`toBaseVoxel(p) = (p.x+0.5, 0.5−p.y, p.z+0.5) ·
  uBaseShape`), ≤ 256 steps, per-sample perspective LOD
  (`desiredLevelAt(dist)`, clamped to the plan's floor `uDesiredLevel`),
  empty-space skipping via `brickExitRel` when a page entry is unmapped or
  uniformly empty, ≤ 16-channel per-sample compositing into
  MIP / AttenuatedMIP / Volume / Iso accumulators, picking pass. While
  `cameraMoving`, `uStepScale = 3` triples the step size (~3× fewer samples);
  the camera-settle emission restores full quality automatically.
- **2D** (`layers/bricks/BrickPlaneLayer.tsx`): ONE full-layer quad (the
  per-chunk React mesh churn of `ChunkPlane` is gone); the legacy multi-channel
  compositor with its texture tap replaced by `sampleBrick(vec3(uv, slabZ),
  uDesiredLevel, ch)`.

### 2.11 Probes (`core/octree/brickSampling.ts`)

`marchResidentBricks` is a CPU march in **lockstep with the GLSL
normalization**, sampling through `sampleResident` (the CPU brick mirrors).
Keep the two in sync when touching either.

---

## 3. File map

| Area | Files |
| --- | --- |
| Pure core | `core/octree/{levelGeometry, brickSpec, nodeAddress, pageTableLayout, brickPoolState, nodePlanning, brickRepack, brickSampling, voxelFrame}.ts` (each with a `.test.ts`) |
| Drivers | `managers/nodePlanTracker.ts`, `managers/brickResidency.ts`, `managers/BrickSystemProvider.tsx`, started from `managers/VisibilityManager.tsx` |
| GPU | `render/bricks/gpu/{texSubImage3d, brickAtlas, pageTableTexture}.ts` |
| Shaders | `glsl/brickTraversal.ts`, `layers/bricks/channelUniforms.ts` |
| Materials | `layers/bricks/{BrickPlaneLayer, BrickVolumeLayer}.tsx` |
| Registry entries | `render/image/{ImagePlaneLayer, ImageVolumeLayer}.tsx` (thin wrappers over the brick components) |
| Debug | `panels/DebugPanel.tsx` (plan/pool/lifetime stats, **Copy debug report**), `overlays/BrickResidencyOverlay.tsx` (per-level wireframes) |
| Store | `store/viewerStore.ts` (`nodePlans`, `residencyVersion`, `brickSystem`), `store/viewStore.ts` (`cameraPose`, `cameraMoving`) |
| Cache | `zarr/caches/byteBudgetChunkCache.ts` |

The legacy paths (`ChunkPlane`, `PlaneLayer`, `VolumeLayer`,
`VolumeTextureMesh`, `core/chunkPlanning.ts`, `managers/chunkPlanTracker.ts`,
`core/volumeTexture.ts`) and the `useOctreeRenderer` migration flag were
deleted at cutover; `buildSliceSignature` survives in
`core/sliceSignature.ts`. Kept: `core/slab.ts`, `core/viewportPlanning.ts`,
`core/probeMath.ts`, `core/lodPlanning.ts` (budget source +
`planDefaultVolumeLods` for `fixedLOD` defaults).

---

## 4. Pitfalls — what actually bit us

Everything below was found in live testing on real scenes (a small 4-layer
float32 debug set and plane-chunked SPIM HepaRG stacks, `[2, 2048, 2048]`
chunks). Ordered roughly by pain.

**P8 — Fetch amplification without in-flight dedup (73×).** 12 concurrent
brick fetches touching the same plane chunk each decoded it independently:
8.4 GB decoded for 115 MB uploaded. Any brick/chunk mismatch **requires**
in-flight request sharing (`fetchChunkShared`), not just a decoded cache — the
cache only dedups *completed* fetches.

**P5 — Budgeting in GPU bytes lies when chunks are planes.** A 64³ brick costs
~1.1 MB on the GPU but ~14 MB of decode when the chunk is `[2, 2048, 2048]`.
Plans that looked cheap in slot bytes downloaded entire levels. The refinement
floor must count *chunk-aligned decoded bytes* of the visible region.

**P4 — Sizing atlases by budget share, ignoring dataset size.** A 4-brick toy
layer got a 296-slot / ~140 MB float32 atlas — ×4 layers ≈ 1.1 GB of zeroed
VRAM and a hard perf cliff. Always cap `desiredSlots` by
`totalBrickCount(geometry, spec)`.

**P6 — Duplicate pyramid levels + count-bounded caches.** Two level-0
`dataArrays` (`scaleFactors: null` and `[1,1,1,1]`) → everything planned and
fetched twice *from different stores* (so even a perfect chunk cache can't
save you). Dedupe levels by spatial shape at geometry-build time. Separately,
the runner's count-bounded chunk cache (500 entries) pinned GBs of plane
chunks — caches over variable-size items must be **byte**-bounded.
Corollary: after dedupe, level *indices* shift — anything reading
`dataArrays[i]` directly (the 2D probe did) breaks; always go through the
pool's geometry.

**P7 — Residency feedback into planning.** Bumping a replan on every
`residencyVersion` change recreated the legacy render-feedback loop: streaming
→ replan → new fetches → streaming… The shader fallback exists precisely so
plans never need to know what is resident. Plans react to *view* changes only.

**P9 — Per-camera-tick work during interaction.** Three separate instances:
(a) replanning at 16 Hz during a drag (→ 200 ms debounce); (b) unbounded
mirror+upload traffic per frame (→ 6 MB/12-brick frame budget); (c)
`BrickVolumeLayer` subscribing to `cameraPose`/`viewportSize` **objects** —
fresh identities per camera write re-rendered every volume layer ~16×/s. The
fix for (c) is the general rule: zustand selectors in render-hot components
must return **scalars** (here: `pxPerVoxelAtUnitDistance` computed inside the
selector; camera position reaches the shader via `vOrigin` anyway).

**P2 — GLSL ES 3.0 sampler indexing.** You cannot index `sampler3D
pageTables[N]` with a loop variable. The single packed page-table texture with
`uPageOffset[level]` offsets is a *requirement*, not a style choice.

**P3 — WebGL unpack state is global and three leaks it.** three sets
`UNPACK_FLIP_Y_WEBGL` / `UNPACK_PREMULTIPLY_ALPHA_WEBGL` for 2D uploads (e.g.
colormap atlases) and leaves them set; WebGL2 then hard-errors on any
`texSubImage3D`. Our upload helper (`texSubImage3d.ts`) force-clears **all**
UNPACK_* state every call. It also binds through three's internal
`renderer.state.bindTexture` — this keeps three's binding cache coherent *and*
avoids a per-upload `gl.getParameter(TEXTURE_BINDING_3D)`, which is a
potential sync point under ANGLE (13×/frame while streaming).

**P1 — Texture-extent limits shape the design.** `MAX_3D_TEXTURE_SIZE` is 2048
under ANGLE. Page grids of deep stacks (3000 z-slices in 2D mode) exceed it;
payload auto-doubling must be axis-aware (only double 2D z when the z grid
itself overflows). The page table's level-stacking also has to try multiple
axes before giving up.

**P10 — Debug stats must not lie.** `bytesDecoded` originally counted every
cache *hit* as a decode — a 4.96 GB phantom that sent diagnosis down the wrong
path for a round. Count first-seen chunk keys only. Bad telemetry is worse
than none; the debug report is the primary remote-diagnosis tool.

**P11 — EMPTY-brick values are raw, not scaled — and only 8-bit precise.** The
uniform value from the repack min/max scan is already in raw data units; running
it through `dataScale` before 8-bit encoding double-applied normalization. Encode
raw (`encodeEmptyValue`), normalize in the shader like every other sample.

Because an EMPTY brick survives only as ONE 8-bit page-table byte
(`round((v-min)/(max-min)·255)`), the value the GPU renders is the encode→decode
round-trip, **not** the raw value — a quantization of ≈`(max-min)/255` raw units
(≈257 for uint16 over `[0,65535]`, so uniform uint16 bricks with a narrow useful
window band). This is inherent to the 8-bit page encoding. The CPU probe path
(`sampleResident`) applies the SAME round-trip (`decodeEmptyValue(encodeEmptyValue
(v))`) so `marchResidentBricks` stays in lockstep with the rendered image rather
than reporting the exact-but-not-rendered raw value. Tested in
`glsl/brickTraversal.test.ts`.

**Atlas format must mirror the worker's promotion, not the dtype string.**
`atlasKindForDtype` (`render/bricks/gpu/brickAtlas.ts`) picks R8 only for unsigned
8-bit and R32F for everything else — matching the codec worker's DEFAULT-fidelity
promotion (`lib/zarr/runner/codec-worker.ts`: only `Uint8Array` stays uint8, all
else → `Float32Array`). An earlier `dtype.includes("8")` test wrongly routed
`int8` (a signed Float32Array) into a Uint8 R8 atlas, wrapping its negatives. Two
standing constraints: (1) the scene never sets `textureFidelity`, so it assumes
`'default'` — the `'low'`/`'high'` paths per-chunk-normalize to uint8/uint16 and
would break both this format choice and the global `pool.minValue/maxValue`
normalization; (2) `uint16` is (still) promoted to raw-valued float32 in R32F —
native `R16` atlases remain deferred (§5). Tested in `brickAtlas.test.ts`.

**Contrast limits are raw dtype units.** `climToUnit` (`core/dataRange.ts`) maps an
absolute clim into the shader's `[0,1]` via `pool.minValue/maxValue`. This is
correct ONLY if `channel.transfer.climMin/Max` and `layer.climMin/Max` arrive in
raw dtype units (e.g. 0..4000 for a uint16 layer, not a normalized 0..1). A
normalized clim on a uint16 layer collapses to ~0 after `climToUnit` with
`[0,65535]`. See [[clim-absolute-native-units]].

**P12 — Guard the coordinate frames.** `buildVolumeVoxelToWorld` centers
x/y/z and flips y (the 3D frame). The 2D slab z is **uncentered**, matching
legacy `chunkPlanning`. Mixing these up produces plans that look plausible but
cull/fetch the wrong region. `voxelFrame.ts` documents both; the raymarcher's
`toBaseVoxel` must stay in lockstep.

**P14 — Ray-step sizing: constant steps make grain, unstable jitter makes
flicker.** The raymarcher originally used one constant `delta =
max(rayLen/MAX_STEPS, uMinDelta) · uStepScale` per ray. Two failure modes:
(a) on elongated volumes `rayLen/MAX_STEPS` dominates (~11 base voxels on a
SPIM diagonal) — jittered MIP over level-0 bricks at that pitch is per-pixel
noise ("incredibly grainy"; legacy got away with 32 steps only because its
monolithic texture was coarse and linear-filtered); (b) the jitter offset was
`delta · rand(gl_FragCoord)` with `delta` a function of per-fragment ray
length and the moving↔settled `uStepScale` toggle — so the noise realization
changed every frame during motion and swapped wholesale on drag start/end
(shimmer + full-screen "flicker"). Fixes: **step length must be LOD-adaptive
per sample** (`stepLen = max(max(uMinDelta, rayLen/MAX_STEPS), 0.75 ·
uLevelScale[lvl].x) · uStepScale` — fine pitch only where fine data is
sampled, so 512 steps stay affordable), and **jitter must be
motion-invariant** (`t = bounds.x + rand(gl_FragCoord) · uMinDelta` — no
rayLen, no uStepScale).

Consequence for VOLUME projection: since `stepLen` varies with per-sample LOD
and `uStepScale`, front-to-back opacity accumulation must be **step-size
corrected** or coarse levels / camera-moving frames render dimmer (fewer, larger
steps accumulate less opacity). The volume accumulator uses
`a = 1 − (1 − sampleNorm)^(stepLen / refStep)` where `refStep` is the
finest-shown level's settled pitch (`uDesiredLevel`, no `uStepScale`) — identity
at the finest settled sample, brighter as the step grows. Mirrored/tested by
`core/opacityCorrection.ts` (+ `.test.ts`). MIP/AttenuatedMIP are `max()` and
need no correction; **MIP coarse-dimming is a separate, inherent effect** — a
mean-downsampled zarr pyramid stores lower peaks and normalization is
LOD-independent (`brickResidency.ts` `pool.minValue/maxValue` from level 0), so
coarse MIP is faithfully dimmer. Not fixable in the renderer; the real fix is a
max-downsampled pyramid upstream.

**P15 — Slab z must floor-divide from ONE base z, and levels that don't
cover the slab must drop out of the chain.** Two live failures, same shape
(refinement silently stuck at the coarsest level for *certain* z values):
(a) computing each level's slab as `round(localZ / scaleZ)` independently —
for z=150 with scales 32/16 that yields slab 5 coarse but slab 9 fine, and 9
is a child of brick 4, not 5, so the DFS finds no matching children. Derive
every level's index by floor-division from the same base index (floor chains
compose: `floor(floor(z/a)/b) = floor(z/ab)`), which also matches the shader
(`floor(baseZ / scale)` per level). (b) truncated pyramids genuinely LOSE
tail slices at coarse levels (81 base slices → z shape 2 at scale 32 covers
only base z < 64): for z=76 the coarsest level has no data at all. Clamping
to its last slice shows the wrong z and stalls the chain exactly like (a) —
instead, such levels drop out and the DFS roots at the coarsest level that
still covers the slab.

Related change: `currentZ` is NOT part of the residency slice signature — z
is a spatial axis of the brick address (the page table holds every slab), so
z-scrubbing must not flush the layer; revisited slabs come straight from the
pool. Flushing per z was legacy ChunkPlane semantics and made every slider
step a multi-second refetch on plane-chunked data.

**P16 — Guard axis-mapping collisions from layer config.** `intensityDim` is
server/user data; a live layer shipped `intensityDim === zDim === "z"` on a
single-channel 256³ stack. The geometry builder read the z extent as the
channel count → 16 phantom channels → every brick slot, fetch and atlas
inflated 16× (4 MB slots, a 512 MB atlas blowing straight through the 128 MB
pool cap, since the coarsest-level slot floor overrides the byte budget).
`resolveAxisIndices` now resolves an intensity axis that collides with a
spatial axis to -1 (no channel dim). Trust nothing about dim mappings.

**P17 — Render-cadence state must not live in React-subscribed store fields.**
The scene has two planes: the render plane (trackers, managers, three.js
objects — all vanilla `store.subscribe` + imperative updates + `invalidate()`)
and the UI plane (React). The rule: **React-subscribed store fields may only
change at UI cadence** (user action or camera-settle). Continuous render facts
flow through vanilla subscriptions / `useFrame` / uniforms; if the UI must
display one, publish a throttled or settled snapshot — and subscribe to
**scalars, never objects** (the P9c corollary). Violations found in one audit,
all the same shape (render fact → React store field → per-tick re-render of a
heavy subtree):

- `worldUnitsPerPixel` was written per frame (`camera.position.length()`
  changes during pan/orbit too, not just zoom) → ScaleBar re-rendered per frame
  and both probe-marker components rebuilt their geometry memo per frame. Fix:
  probe markers compute the radius from the camera in their own `useFrame`
  (`core/probeWorld.ts` splits camera-independent geometry from
  `probeMarkerRadius`); `CanvasSync` publishes the store value throttled
  (150 ms leading + trailing) for the HTML ScaleBar only.
- `residencyVersion` (per-upload-batch) was the layers' only way to catch the
  rare "pool appeared/rebuilt" event → every streaming batch re-rendered every
  layer. Fix: `poolsVersion`, bumped only on pool create/rebuild/dispose;
  `residencyVersion` remains for the debug UI, whose components are now
  MOUNT-gated on `debug` (`WhenDebug` in `Scene.tsx`) so their subscriptions
  don't exist otherwise.
- The layers subscribed to the `nodePlans[layerId]` OBJECT (new identity per
  replan, ≤5/s during a pan) to courier three scalars into uniforms. Fix:
  scalar selectors (`targetLevel` / `slabZ` / `mode` / `nodes.length > 0`);
  event-time consumers read the full plan via `storeApi.getState()`.
- `viewStore.updateCameraData` minted fresh `viewportSize`/`cameraPose` object
  identities per 16 Hz emission; it now preserves the previous references when
  value-equal, so object selectors can't re-render at frame rate by accident.
- Corollary for write-side dedup gates (`sameViewRanges`): never gate a hot
  store write on a continuously-varying cosmetic field (the `viewportFraction`
  regression) — compare only what downstream consumers need per-tick.

**P18 — A single-level dataset makes the "cheap pinned coarsest level"
assumption catastrophically false.** The whole design leans on coarsest =
tiny + always-resident: the planner's budget floor falls back to it, reconcile
pins all of it, and `ensurePool` floors the atlas slot count at the coarsest
grid — deliberately overriding the byte budget (P16). With NO multiscale
pyramid, coarsest = level 0 = full resolution, and every valve inverts at
once: a 2048×2048×1024 uint16 volume floors the 3D atlas at ~18.9 GB (the
`Float32Array` backing throws an uncaught RangeError inside `ensurePool`,
which also aborted reconciliation of the REMAINING layers until reconcileAll
got its per-layer try/catch), and the planner emits the entire full-res grid
as unconditional root `target`s (`maxPlanBytes` only gates refinement into
children, never roots) → a full-dataset fetch storm re-triggered per
interaction. The same volume floors the 2D atlas at ~16 GB — the 2D slot
floor spans EVERY z slab (that is what makes z-scrubbing instant).

The guard: `assessPoolViability` (`core/octree/poolViability.ts`) computes
the coarsest-grid floor with the same helpers `ensurePool` uses and refuses
the layer when it exceeds `getInitialVolumeTextureBudgetBytes()` — the
device-scaled GLOBAL budget, NOT `MAX_LAYER_POOL_BYTES` (128 MB), which
known-good deep 2D stacks legitimately exceed (a 3000-slice SPIM stack floors
at ~200 MB+ after P1's z-payload doubling). Enforced PRIMARILY in
`nodePlanTracker` (it plans every visible store layer whether or not a mesh
is mounted, so an unmount-only guard would not stop the fetch storm): a
refused layer gets no plan → the brick layer components render nothing → no
pool, no fetch, no atlas. `ensurePool` re-checks as a hard stop for direct
callers. The refusal is surfaced via `viewerStore.unplannableLayers` — an
amber strip on the layer card (with a one-click switch to the other display
mode when THAT one is affordable) and a DebugPanel line. Affordable
single-level cubes are untouched (the check is budget-based, not
"single-level ⇒ refuse"). Do NOT try to budget-cap roots inside the planner
instead — partial coarsest coverage would violate the shader's fallback
invariant. The real fix for such data is a server-side pyramid.

**P19 — Byte budgets lie on integrated GPUs: budget main-thread GPU uploads by
TIME.** The 6 MB / 12-brick per-frame upload budget was calibrated on a
dedicated GPU where a `texSubImage3D` costs ≪1 ms. On an Apple M2 (ANGLE-Metal)
the SAME call measured **~17.5 ms per 256² brick** — a full batch stalled the
main thread for >200 ms per streaming frame (perf-recorder signature:
`cpuMs.max ≈ 250 ms`, jank landing in the post-gesture streaming burst,
`movingFrames 0`). The stall also delayed the repack workers' response
messages, inflating repack WALL time ~6× past exec time. Fixes, in
`managers/uploadBudget.ts` + `drainUploads`:
- the drain loop is additionally capped by **wall clock** (`maxMs = 4`,
  `shouldContinueDrain`) with a guaranteed first-brick-per-frame — fast GPUs
  still fit their whole batch, slow ones self-limit to ~1 brick/frame;
- `cameras/AdaptiveResolution.tsx` halves the DPR during camera motion ONLY
  when the rolling frame time shows the machine can't hold ~45 fps (an M2 at
  Retina DPR 2 was GPU-bound at ~19 ms/frame just compositing 2D layers);
  restores on settle, machines that hold rate never regress;
- the repack pool scales mildly with cores (2–4 workers).
Diagnosis path: perf recorder → DebugPanel `upload X ms/brick` chip
(`stats.uploadMs / bricksUploaded`). If per-brick upload stays >5 ms after
these, the next lever is three.js' texStorage3D/immutable-texture path on
ANGLE-Metal — measure before building.

**The quality GOVERNOR generalizes this** (`core/qualityGovernor.ts`): the
one-shot motion-DPR regress still janked because the real jank window is
STREAMING, not motion — after any gesture, bricks stream for seconds and every
residency bump renders a "settled" full-quality frame (DPR 2 + full-pitch
raymarch) at 25–50 ms. The governor:
- learns a machine tier (High/Medium/Low) from CONSECUTIVE slow/fast frame
  deltas (15 slow → demote; 120 fast + 30 s post-demote cooldown → promote;
  streak counting on deltas, not the EMA — a stale EMA from the old tier would
  cascade demotes before the cheaper tier could prove itself);
- persists the tier per GPU (`localStorage` `scene-quality-tier:<UNMASKED_RENDERER>`),
  so later sessions start right; DebugPanel has an Auto/High/Medium/Low
  override for testing;
- drives every knob from one profile table: settled/active DPR
  (`cameras/QualityAdapter.tsx`), 3D `uStepScale` settled/active
  (`BrickVolumeLayer`), upload time budget, per-layer in-flight fetches, and
  the residency-bump cadence (`brickResidency.ts`), where **active = camera
  moving OR bricks streaming** (the drain loop feeds the streaming edge).
The decoded-chunk cache also halves on ≤8 GiB machines (GC pressure). A
dedicated GPU stays at High forever — zero behavior change.

**P13 — three.js overlay geometries don't dispose themselves.** The residency
overlay rebuilds wireframe `BufferGeometry`s on every residency change; without
an effect-cleanup `dispose()`, that's an unbounded GPU leak on exactly the
debugging tool you have open while chasing memory issues.

Repo-wide gotchas that apply here: no `React.lazy` in the renderer (Electron
`file://` chunk loads fail — flag switches use static imports), and the
typecheck ratchet (never raise the pre-existing error count; syntax errors
mask everything downstream, so check touched files individually).

---

## 5. WebGPU backend (migration, 2026-07)

The scene renders through three's **`WebGPURenderer`** (async init in
`Scene.tsx`'s Canvas `gl` factory): native WebGPU where available (macOS =
Metal — eliminating the ANGLE `texSubImage3D` upload stalls of P19), and its
automatic **WebGL2 fallback backend** elsewhere (Linux needs the Electron
switches added in `src/main/index.ts`; the startup log prints the active
backend). Consequences and contracts:

- **TSL only — no raw GLSL `ShaderMaterial`s.** `WebGPURenderer` does not run
  them on either backend. The brick shaders live in
  `layers/bricks/brickNodeMaterials.ts` (TSL → WGSL or GLSL per backend); the
  old GLSL strings are kept `@deprecated` as reference until visual parity is
  confirmed, then deleted. NodeMaterials go through the renderer's output
  transform, so the brick materials pin `toneMapped = false` for parity with
  the raw FragColor path. Uniform updates go through the returned NODE records
  (`bundle.nodes.uDesiredLevel.value = …`), not a `.uniforms` map.
- **Backend internals are isolated in `render/gpu/sceneRenderer.ts`** (device,
  fallback GL context, texture handles, `maxTextureDimension3D`, GPU identity
  for the quality governor). Nothing else may touch `renderer.backend`.
- **Uploads** (`render/bricks/gpu/texSubImage3d.ts`): WebGPU backend →
  `device.queue.writeTexture` partial 3D writes (no alignment constraints, no
  unpack state — P3 is obsolete there); WebGL backend → the historical raw
  `gl.texSubImage3D` path with UNPACK resets; uninitialized texture → full
  `needsUpdate` re-spec from the CPU backing mirror.
- **Integer page table**: three maps `RGBAIntegerFormat` + `UnsignedByteType`
  → `rgba8uint`; the TSL walk uses `textureLoad` (texelFetch equivalent). The
  R32F atlas's LinearFilter relies on the `float32-filterable` device feature,
  which three requests automatically when the adapter supports it.
- **GPU frame timing** (`PerfFrameProbe`): the GL timer only runs on the
  fallback backend; under native WebGPU `gpuMs` is null for now
  (timestamp-query integration is a follow-up).
- Deferred WebGPU-era upgrades: storage-buffer page table (obsoletes the P2
  packed-texture workaround), compute-shader repack, timestamp queries.

## 6. Status & what's deliberately deferred

Done and verified: all six migration phases (including the Phase 6 cutover:
legacy renderers, trackers, and the migration flag deleted), three rounds of
live performance hardening plus the grain/flicker fix (P14), scene tests
green, typecheck at baseline.

**Deferred on purpose** (measured as non-bottlenecks or memory trade-offs; do
not implement without cause):

- per-mode pool retention (instant 2D↔3D toggles; doubles per-layer memory),
- `texStorage3D` allocation (skips the one-time zeroed 128 MB upload per pool),
- lazy backing-mirror (drop the per-upload CPU memcpy in `writeBrickToAtlas`;
  entangled with `sampleResident` probes + context-loss restore, see §2.9),
- motion-time reduced-resolution rendering (only if `uStepScale = 3` proves
  insufficient),
- uint16-native `R16` atlases (worker currently promotes to float32).

No longer deferred: worker-side repack shipped with the P17 hardening
(`repackDispatcher.ts`), alongside the per-array zarr-metadata memo and the
`useSharedArrayBuffer` forwarding fix in `getChunkWorker`.
