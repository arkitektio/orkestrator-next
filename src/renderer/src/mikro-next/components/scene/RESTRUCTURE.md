# Scene restructure — working checklist

Transient. Delete when Phase 5 lands. `ARCHITECTURE.md` is the permanent map.

## Phases

- [x] **Phase 0 — prep and edge triage.** Dead files deleted; the move manifest
      (`scripts/scene-manifest.mjs`) maps all 432 files with no collisions; the
      import-graph walker (`scripts/scene-graph.mjs`) and the post-move
      simulator (`scripts/scene-simulate.mjs`) are in place; `ARCHITECTURE.md`
      written.
- [ ] **Phase 1 — the move.** `git mv` + import-specifier rewrite only. No line
      that is not a module specifier may change. Per-module `README.md` with the
      "Owns / Knows nothing about" table. Prose cross-reference sweep.
- [ ] **Phase 2 — demote the shared vocabulary.** Type-only moves into
      `platform/model`; the enhancer/skeletonizer inversion.
- [ ] **Phase 3 — invert and split the stores.**
- [ ] **Phase 4 — split the oversized files.**
- [ ] **Phase 5 — turn on `architecture.test.ts`.**

## Baseline (2026-08-20, before Phase 1)

`pnpm typecheck` 0 errors · `pnpm test` 163 files / 2005 tests passing.

## Edge triage

The simulator applies the manifest to today's import graph and reports which
edges *would* violate the target rules. Starting point was **85** production
violations; choosing better destinations dissolved **59** of them without any
code change — that iteration is the whole point of doing this before Phase 1.

Placement decisions that dissolved edges, and why:

| Decision | Dissolved |
|---|---|
| **`probe` is two things.** The type vocabulary, hit targeting, gating, settling and world markers are infrastructure that bricks, meshes, annotations *and* the camera all use → `platform/probe/`. Only the trackers and readout UI are a feature. | 27 |
| Shared layer-card vocabulary (`cardControls`, `entrySections`, column editors, colormap/contrast utils) → `platform/layerui/` | 12 |
| `BrickLabel{Plane,Volume}Layer` are labels, not bricks → `features/labels` | 6 |
| `instanceColormaps` is colormap vocabulary, not mesh streaming → `platform/gpu` | 5 |
| `volumeCompositor` + `volumeTargetFlags` are pure pass decisions → `platform/gpu` | 2 |
| `animation.ts` is camera-tour math → `platform/camera`; `animationStore` → `platform/stores` | 3 |
| `rafCoalesce` is a scheduling utility misfiled under probe → `platform/perf` | — |
| `keyboardTarget`, `PreviewLine`, `AttributeRowsSection`, `levelGeometry` demoted to platform | 4 |

## Residual violations, and the phase that resolves each

26 production violations remain after the move. None is accidental:

| Edge | Count | Resolved by |
|---|---|---|
| `debug -> bricks`, `debug -> meshes` | 9 | **Phase 4** — `shell/debugRegistry.ts`; each feature contributes its own DebugPanel section |
| `bricks -> annotations` | 7 | **Phase 2** (2: the `brickResidency` → `computeSkeleton` cycle — hand out the renderer instead of constructing the skeletonizer) and **Phase 4** (5: `BrickVolumeLayer` does annotation drawing inline; splitting it moves that out) |
| `probe -> annotations` | 3 | **Phase 4** — `SelectedPointPanel`'s "create annotation from probe" |
| `stores -> bricks/meshes` | 3 | **Phase 3** — the store split by ownership; all type-only today |
| `annotations -> shell/SceneProvider` | 1 | **Phase 2** — extract `SceneGuard`/`useSceneScopeStatus` into `platform/stores/sceneScope.tsx` |
| `platform/draw -> annotations` | 1 | **Phase 2** — type-only; demote the outline type to `platform/model` |
| `platform/coords -> bricks` | 1 | **Phase 2** — `levelGeometry` needs only the `MAX_BRICK_LEVELS` constant; demote it |
| `meshes -> annotations` | 1 | **Phase 4** — `FabriksCollectionLayer` reads the ROI drawing store |

Re-run `node scripts/scene-simulate.mjs` after any manifest change.
