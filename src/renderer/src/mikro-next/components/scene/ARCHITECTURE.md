# The scene renderer — module map

417 files, ~82k LOC. This file is the map: what lives where, what may import
what, and the invariants a refactor must not break. Read it before adding a
file, and before moving one.

## Three tiers

**`shell/` knows every feature; `features/` know `platform/`; `platform/` knows
nothing about any feature.**

```
scene/
  Scene.tsx      the public API — the only entry point outside code should use
  shell/         composition root: provider, viewport, mode subtrees, chrome,
                 the registries. Mounts everything; nothing imports it back.
  platform/      the generic engine. Layer model, coordinates, camera, GPU,
                 visibility, quality, stores. Has no idea what a "label" or a
                 "mesh" is.
  features/      one folder per concern, each readable end-to-end: its math,
                 its GPU code, its layer component, its panel, its store.
```

### `platform/`

| Dir | Owns | Knows nothing about |
|---|---|---|
| `model/` | the layer vocabulary: normalisation, guards, dims, data range, render graph, scene signatures | rendering, React, any feature |
| `coords/` | world transform, axis selection, level geometry, units | how anything is drawn |
| `camera/` | pose ⇄ server state, fitting, navigation, pan/orbit, tour interpolation, the R3F camera components | what is in the scene |
| `visibility/` | frustum tests, visible voxel ranges, pass/capture partitioning, the tracker | why anything is visible |
| `quality/` | the quality governor, LOD budgets, render cost, upload budget | which layer it is throttling |
| `gpu/` | the WebGPU renderer handle, capability gate, colormaps, buffer readback | scene semantics |
| `probe/` | the probe type vocabulary, hit targeting, gating, settling, world markers | the probe UI |
| `draw/` | WebGPU-native drei replacements: lines, grid, picking | what is being drawn |
| `layerui/` | the shared layer-card vocabulary every feature card builds on | any specific layer kind |
| `attributes/` | the DuckDB/Parquet column layer shared by meshes and labels | who is asking |
| `input/` | keyboard target guards | which shortcut |
| `perf/` | perf monitor, cold-open timeline, rAF coalescing, commit profiler | what it is measuring |
| `sources/` | zarr store construction and array opening | rendering |
| `stores/` | the scene-scoped zustand stores | feature internals |

### `features/`

`bricks/` is a **shared engine, not a peer feature**: it is the pyramidal octree
volume renderer, and `volume/`, `labels/` and `probe/` are its consumers. It is
the one folder other features may import.

| Feature | Owns |
|---|---|
| `bricks/` | `octree/` planning + addressing, `gpu/` atlas/page-table/materials/repack, `residency/` the streaming state machine, `layers/` the brick layer components, `shaderspec/` CPU mirrors of the TSL shaders |
| `volume/` | intensity image layers, the two-pass compositor shell, levels + phasor editors, the render-graph editor |
| `labels/` | label-mask layers, label materials and uniforms, the object-id colour LUT, the label card |
| `annotations/` | ROI geometry, drawing gestures, the drawers and handles, annotation layers and panels, the ROI stores, and `enhancers/` (vector trace, brush skeleton, smooth blob) |
| `meshes/` | the fabriks Parquet mesh-collection renderer end-to-end |
| `probe/` | the probe trackers, readout settler, axis guides, and the readout UI |
| `animation/` | the camera-tour editor and player |
| `debug/` | the debug panel shell and the residency overlay |

### The registries

Feature-vertical layouts normally collapse where shared UI has to render
per-kind pieces. `shell/` owns the dispatch tables, and **each feature
contributes one entry to each**:

```
shell/layerRegistry.ts            __typename -> { Layer2D, Layer3D }   exists
shell/layerPanel/cardRegistry.ts  __typename -> LayerCard              PLANNED
shell/debugRegistry.ts            feature    -> DebugSection           PLANNED
```

Adding a layer type is: one folder under `features/`, two registry lines.
`features/annotations/enhancers/registry.tsx` already follows the same shape.

## Import rules

1. `platform/**` imports nothing from `features/**` or `shell/**`.
2. `features/<a>/**` imports nothing from `features/<b>/**`, except:
   `volume -> bricks`, `labels -> bricks`, `probe -> bricks`,
   `annotations -> bricks`.
3. `platform/model/**` and `platform/coords/**` are leaves within `scene/`.
4. `shell/**` is imported by nothing except `Scene.tsx`.

**Keep the allowlist closed.** When a new cross-edge appears the answer is to
invert it, or to demote the shared symbol to `platform/` — not to widen rule 2.
Adding an entry needs a justification line here. The absence of any such check
is precisely what turned the old `core/` into a 153-file grab-bag.

`node scripts/scene-graph.mjs` reports the current graph and any violation
today. `architecture.test.ts`, which will assert the same rules inside
`pnpm test`, is PLANNED — see `RESTRUCTURE.md`.

## Invariants a restructure must not break

- **P17 — the two-plane rule.** The scene has a *render plane* (vanilla
  `store.subscribe` + imperative mutation + `invalidate()`) and a *UI plane*
  (React). React-subscribed store fields may only change at UI cadence;
  subscribe to scalars, never objects. Several components are shaped the way
  they are *because* of this and say so in their docblocks. **Never convert a
  `useFrame` / `getState()` read into a `useStore(selector)` while moving code.**
- **P20** — handler *attachment* is the raycast gate. Pass `undefined`, never a
  no-op handler.
- **P13** — three.js overlay geometries need an explicit `dispose()` in effect
  cleanup.
- **No `React.lazy` in the renderer** — Electron `file://` chunk loads fail.
  This also rules out lazy barrels.
- **The typecheck ratchet stays at 0.** Syntax errors mask everything
  downstream, so check touched files individually during a mass rewrite.
- **`COORDINATE_SYSTEMS.md` §0 is settled** — corner-anchored frames, half-voxel
  convention, no client-injected flips. Do not re-litigate.
- **Pitfall numbers P1–P24 are cross-referenced between documents.** Keep the
  numbering when splitting docs.

### Three sibling pairs that must stay siblings

These resolve at *bundle* time via `import.meta.url`, and two name a `.js` file
that does not exist on disk — neither typecheck nor a `.ts` grep will catch a
break:

| File | Reference | Sibling |
|---|---|---|
| `features/bricks/octree/repackDispatcher.ts` | `new URL("./repack-worker.js", …)` | `repack-worker.ts` |
| `features/meshes/fabriks/fabriksDecodeDispatcher.ts` | `new URL("./fabriksDecode-worker.js", …)` | `fabriksDecode-worker.ts` |
| `features/meshes/fabriks/fabriksCore.test.ts` | `dirname(fileURLToPath(import.meta.url))` | `__fixtures__/` |

## Open items

- **The scene is not multi-instance-safe.** `platform/perf/perfMonitor.ts` and
  `coldOpenTimeline.ts` are module-level singletons imported by 20+ files,
  despite the per-scene scoped stores. Known and deferred.
- **`platform/stores/viewerStore.ts` is a service locator.** It holds handles to
  the brick system and the fabriks manager so components can find them. This is
  deliberate, and it is the reason a few `platform -> features` type edges
  survive.
