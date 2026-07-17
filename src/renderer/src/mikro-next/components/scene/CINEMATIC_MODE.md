# RFC: cinematic mode (lit volume)

**Status: proposal. Nothing here is implemented.** The code shapes below are
sketches — see §8, none of this TSL has been compiled.

A "cinematic mode" that shades the volume: gradient-derived normals,
Blinn-Phong key/fill, and a surface gate. Today the volume renderer has **no
lighting of any kind** — no gradients, no normals, `material.lights = false`
(`layers/bricks/brickNodeMaterials.ts`, `commonMaterialSettings`, line 688). The
ISOSURFACE projection is a first-hit test that paints a flat colormap colour, so
it renders a silhouette rather than an object.

Sibling documents: `OCTREE_RENDERER.md` — the brick-pool renderer this builds on
(§2.3 brick spec and §2.10 shader traversal are the load-bearing sections here);
`COORDINATE_SYSTEMS.md` — where `LayerState.affineMatrix` and the per-level
scales come from.

---

## 1. Why this is affordable

The naive estimate kills the idea. A central-difference gradient needs six
neighbour samples; each *looked* like it needed its own `emitResolveBrickResidency`
— a page-table walk — inside a fragment already running a 512-step ray loop over
a 16-channel loop over a 10-level walk. That is ~7× the march. Dead on arrival.

**It needs zero extra page-table walks.** 3D bricks carry a 1-voxel replicated
border holding real neighbour data, and the 3D atlas is always linear-filtered.
Six taps off the already-resolved `texelBase` land inside that border — which is
what the border is *for*. Cost drops to ~1.5× on the volume path, and ~2-5% on
the isosurface path (§4).

The chain is structural, not incidental — *3D ⟺ border ⟺ linear*:

| fact | where |
|---|---|
| `border = mode === "3D" ? 1 : 0` | `core/octree/brickSpec.ts:59` |
| `filter: spec.border > 0 ? "linear" : "nearest"` | `managers/brickResidency.ts:657` |
| "3D: payload 64³, border 1 (stored 66³), LinearFilter" | `OCTREE_RENDERER.md` §2.3 |

Note the border is edge-replicated at the *volume's* outer boundary and holds
real neighbour data everywhere else (`core/octree/brickRepack.ts`). At the volume
edge the outward gradient is therefore zero — correct, there is no data out there.

Because 2D is the branch with `border = 0` and nearest filtering, and cinematic is
3D-only, there is no categorical-data caveat: the mode where the trick is unsafe
is the mode it never runs in.

## 2. Why there is no compositing rewrite

Lighting modulates colour **inside** the march, before accumulation. So
`commonMaterialSettings` is untouched — `AdditiveBlending`, `depthWrite = false`,
`toneMapped = false`, and the `vec4(outColor, 1.0)` resolve all stay exactly as
they are. No HDR target, no depth pass, no post-processing, no change to the 2D
plane compositor.

This is worth stating because the *other* reading of "cinematic" — bloom, depth of
field, tone-mapped grading — is genuinely structural and roughly an order of
magnitude more work. It needs the volume writing real alpha **and** depth into a
float target, which means rewriting the final resolve of all four projection modes
plus the 2D plane material, then adding three's own TSL `PostProcessing`. (Note
`@react-three/postprocessing` is in `package.json` but is WebGL-only and cannot
touch a `WebGPURenderer` — the two existing usages are on other canvases.) That
reading is deferred; see §9.

Since `e4feb722 fix: drop webgl support`, TSL only has to compile to WGSL. The
GLSL-parity tax that would have applied to any new shader work is gone.

## 3. Invariants

These are the reason this document exists. Each is cheap to honour and expensive
to rediscover.

**C1 — Lighting modulates colour only.** Never `sampleNorm`, never `weight`,
never `volAlpha`, never the iso hit test. This is what keeps the CPU transfer-math
mirrors (`core/probeMath.ts`, `core/opacityCorrection.ts`,
`core/octree/brickSampling.ts`, `core/phasor.ts`) valid with **zero** changes —
they pin *transfer* math because the probe readout must agree with the picture,
and shading is not transfer. Break C1 and every one of those mirrors, and their
tests, comes into scope.

**C2 — `GRADIENT_H = 0.5` is an invariant, not a tuning knob.** The filter-safe
range of a slot is `[slot + 0.5, slot + slotSize - 0.5]`; the payload occupies
`[slot + 1, slot + 1 + payload)`, leaving exactly 0.5 texel of margin each side.
`h > 0.5` reaches past the border into the neighbouring slot in x/y — and in z
into the neighbouring **channel slab**, because `slotSize.z = stored.z *
channelCount` (`core/octree/levelGeometry.ts:66`). That would silently mix another
channel's data into the normal. If a wider baseline is ever genuinely needed, the
correct move is a full `emitResolveBrickResidency` per tap (~7×), not a bigger `h`.
Guard it with a test (§8).

**C3 — Shade in physical space.** Base-voxel space is anisotropic; 5× z-steps are
routine in microscopy, and a raw base-voxel gradient gives visibly wrong normals.
`gPhys = gLvl / (levelScale * baseScale)` — one componentwise divide, one new vec3
uniform, no matrices.

**C4 — The `toBaseVoxel` y-flip is safe, but only by luck.** N, V and L all live
in the same base-derived space, so the flip is a reflection applied consistently to
all three; reflections are orthogonal, so dot products are invariant and diffuse
and specular are untouched. **This holds only because nothing here uses a cross
product.** Anyone adding one (a tangent frame, anisotropic shading) must handle the
flip explicitly.

**C5 — Gate `surfaceness` on the level-voxel gradient, not the physical one.**
`norm ∈ [0, 1]` over a 1-voxel baseline makes `|gLvl|` roughly dataset-independent;
`|gPhys|` scales with the dataset's physical units and would need per-dataset
retuning. This is what keeps `surfaceGain` a constant instead of a knob.

**C6 — Add no `uniformArray`.** The WebGPU 12-uniform-buffers-per-stage limit
applies to `uniformArray` — each is its own binding, and the material is already
near the limit with five (`uPageOffset`, `uLevelShape`, `uLevelScale`,
`chParamsA`, `chParamsB`; see the note at `brickNodeMaterials.ts:120`). Scalar
`uniform()` nodes share one object UBO and are free. Every uniform this design
adds is scalar or vec3.

**C7 — MIP and attenuated MIP stay unlit, by construction.** Only the
`projectionMode == 2` (VOLUME) and `== 3` (ISOSURFACE) branches consult the
cinematic uniform, so this falls out with no code. Lighting a max-projection would
break its quantitative contract: brightness *is* max intensity. The UI implication
is in §6.

**C8 — This is not a `ProjectionMode` and not a `DisplayMode`.**
`ProjectionMode` is a backend enum (`api/graphql.ts:6402`) — a fifth member needs
a schema change. `DisplayMode` (`"2D" | "3D"`) drives brick planning
(`core/octree/nodePlanning.ts`, `resolveBrickSpec`) and is re-declared as
hand-written literal unions in several files, so a third member would silently
fail to propagate. Cinematic is a session flag that changes *how the existing*
VOLUME/ISOSURFACE branches shade.

## 4. Design

### 4.1 The gradient

Central differences on the **normalized** (post-transfer) field, six taps off the
resolved `texelBase`, no page-table walks.

Normalized rather than raw because the iso surface is *defined* in normalized
space (`sampleNorm >= isoThreshold`), so the normal must be the gradient of that
same field. The transfer is monotone, so raw would give the right direction —
except where clim clamps, where the raw gradient is nonzero but the visible field
is flat, and you would light a region that is not there. `channelNormalize` is
pure ALU, dwarfed by six texture fetches.

Which channel: track the **argmax slot** in the existing channel loop.
`chParamsA.x` is the intensity slab for channels *and* phasors, so one path covers
both kinds; cost is six taps regardless of channel count, and it lights the
structure actually on screen.

```ts
// Emits NO Loop of its own — the only reason it is safe to inline six times
// inside the ray loop (see OCTREE_RENDERER.md on the emitResolveBrickResidency
// shadowing hazard). `slot` must arrive as a .toVar().
const GRADIENT_H = 0.5; // C2 — an invariant, not a knob.

function emitFieldGradient(t, c, resolved, slot, fns) {
  const g = vec3(0.0).toVar("gradLvl");
  // EMPTY brick (status 2) → uniform field → no surface, no normal.
  If(resolved.status.lessThan(1.5), () => {
    const base = vec3(resolved.texelBase).toVar("gradBase");
    base.z.addAssign(float(int(vec4(c.chParamsA.element(slot)).x).mul(t.uChannelSlabDepth)));
    const tap = (off) => float(fns.channelNormalize(slot,
      texture3D(t.brickAtlas, base.add(off).div(t.uAtlasTexels)).r.mul(t.uAtlasScale)));
    const h = float(GRADIENT_H), hn = float(-GRADIENT_H);
    g.assign(vec3(
      tap(vec3(h, 0, 0)).sub(tap(vec3(hn, 0, 0))),
      tap(vec3(0, h, 0)).sub(tap(vec3(0, hn, 0))),
      tap(vec3(0, 0, h)).sub(tap(vec3(0, 0, hn))),
    ).mul(float(0.5).div(h))); // → d(norm)/d(level voxel)
  });
  return g;
}
```

### 4.2 Light model

**Headlight key + fixed object-space fill.** A pure headlight is flat at frame
centre (`dot(N,V) = 1` — no shape cue exactly where you are looking); a pure fixed
key can leave the specimen black. The key is the view vector, the fill is fixed in
the specimen frame — since the specimen is static, that reads as "lit in a room"
while you orbit, and costs no per-frame CPU and no camera-basis derivation.

**The view vector is loop-invariant.** `V_phys = -normalize(dirB * baseScale)`,
because `rayT > 0`. Hoist it out of the ray loop: zero per-sample cost, still
per-fragment correct under perspective.

**`surfaceness` is the term that makes or breaks this.** Where the field is flat —
homogeneous interior, noise floor — there is no surface, and lighting a noise
gradient turns dim tissue into glitter. Levoy's fix, gated per C5:

```ts
const lit = mix(baseColor, shaded, clamp(length(gLvl).mul(uSurfaceGain), 0.0, 1.0));
```

Face N at the viewer before shading (`If(dot(N, V).lessThan(0), () => N.negate())`):
the gradient points up the intensity ramp — into the object from outside, out of
it from inside — so a surface would otherwise go black purely because the ray
entered from the dense side.

Proposed defaults: `ambient 0.25, specular 0.35, shininess 32, surfaceGain 6`.

### 4.3 Where the state lives

`store/modeStore.ts` — `cinematic: boolean` + `setCinematic`, session-only, per
scene, resets on scene change. `BrickVolumeLayer` already imports `useModeStore`
and `SceneOverlay` already reads both stores, so it costs nothing.

Recorded tension: `cinematic` is semantically a *view* setting, and its popover
siblings (`showScaleBar`, `showScaleGrid`, `debug`) all live in `viewerStore`, as
does `probeThreshold` — the closest precedent. `modeStore` was chosen; the move is
one line if it reads wrong in review.

## 5. Phases

**Phase 0 — unblock the iso threshold (~3h).** `isoThreshold` is a uniform node
(`brickNodeMaterials.ts:834`, default 0.5) that **nothing ever writes** — grep
returns only its declaration, its read at line 1040, and its export. Isosurface is
permanently pinned at 0.5, and a shaded iso is worthless without a working
threshold. It *must* be session-only: `ProjectionNode` (`api/graphql.ts:6414`) is
`{children, kind, label, mode}` — there is no threshold field to persist to. Mirror
`viewerStore.probeThreshold` + `panels/ProbeThresholdPanel.tsx` verbatim. Worth
landing on its own merit, independent of cinematic.

**Phase 1 — lit ISOSURFACE (~1 day). The honest first cut.** One gradient per
*ray* — at the hit, then `Break` — so ~2-5% cost. The best win per unit effort in
this document: it turns a flat silhouette into an object.

**Phase 2 — lit VOLUME + governor knob (~0.5-1 day).** One gradient per
*contributing* sample; gate on `uCinematic > 0.5 AND a > 0.01` so samples that
contribute nothing pay nothing. ~1.5-2×. Shade `sampleColor` before
`volColor.addAssign`; `a` and `volAlpha` untouched (C1). Add
`litVolumeWhileActive` to `QualityProfile` (true for HIGH, false for MEDIUM/LOW):
slow GPUs go flat while you drag and snap to lit when you settle — the
active/settled contract the scene already has.

**Phase 3 — AO / shadow probe on ISO (optional, ~1-2 days).** A short march from
the iso hit toward the fill light, O(1)/pixel. Needs the march refactored into a
reusable emitter and a **second Loop nested inside the ray loop** — where the TSL
shadowing hazard bites hardest. Loop iterator names are not auto-renamed the way
`.toVar()` names are, so an explicit unique `name:` is mandatory. Separate project.

## 6. File map

| file | change |
|---|---|
| `core/shading.ts` | **new, pure**: `GRADIENT_H`, `physicalGradient`, `surfaceness`, `blinnPhong`, `CINEMATIC_DEFAULTS`. House style of `core/phasor.ts`. |
| `layers/bricks/brickNodeMaterials.ts` | `length` into the TSL destructure; scalar uniforms `uCinematic`, `uBaseScale`, `uAmbient`, `uSpecular`, `uShininess`, `uSurfaceGain` (C6); `emitFieldGradient` + `emitShade`; argmax `domSlot` in the channel loop (~991); hoist `vPhys`; shade in the ISO (~1039) and VOLUME (~1028) branches. |
| `layers/bricks/BrickVolumeLayer.tsx` | read `useModeStore(s => s.cinematic)`; push `uCinematic` in the existing uniform effect (~179-200); set `uBaseScale` in the `bundle` useMemo beside `uBaseShape`. |
| `store/modeStore.ts` | `cinematic` + setter. |
| `store/viewerStore.ts` | Phase 0: `isoThreshold` + setter. |
| `panels/IsoThresholdPanel.tsx` | Phase 0: new, from `ProbeThresholdPanel.tsx`. |
| `overlays/SceneOverlay.tsx` | one `SettingRow` in the Settings2 popover. |
| `core/qualityGovernor.ts` | Phase 2: `litVolumeWhileActive` + pure `resolveCinematic`. |
| `OCTREE_RENDERER.md` | C2 as a numbered invariant beside the existing pitfalls. |

`uCinematic` is dynamically uniform across the draw, so the branch is coherent on
GPU — no divergence, and one material per pool `structureSignature` still holds.

**UI copy matters here.** `cinematic` is scene-wide but projection is per-layer, so
"disable the toggle when it would do nothing" needs a scene↔layer coupling that
does not exist and is not worth building. Keep the toggle always enabled and put
the truth in the label: *"Lights VOLUME and ISOSURFACE layers. MIP is unaffected."*

## 7. Risks

**R1 — Register pressure (the highest real risk).** Six taps and a dozen vec3s
enter an already-enormous shader, and register allocation is *static* — occupancy
may drop even with cinematic **off**. Plan B: two material variants keyed on
`cinematic` in the `useMemo` deps; the pool is unchanged, so toggling rebuilds only
the material — a one-time hitch on a deliberate toggle. Do not do this
pre-emptively: it doubles compile time and breaks the one-material-per-pool
contract.

**R2 — Camera tours render unlit, exactly where cinematic matters most.**
`CameraMatrixSync`'s `useFrame` calls `updateCameraData(..., true)` during motion,
which sets `viewStore.cameraMoving` (`store/viewStore.ts:62`). `AnimationPlayer`
drives the camera continuously, so a playing tour is permanently "active" → on
MEDIUM/LOW, Phase 2's governor gate renders it flat. A tour is a deliberate
artifact, not an interaction: quality should win over framerate. Compute
`active = (cameraMoving && !animationPlaying) || isStreaming()` **for the cinematic
decision only** (leave DPR and step scale alone); subscribe
`useAnimationStore(s => s.playingId !== null)` — a rare-cadence scalar, P17-clean.

**R3 — Lit VOLUME has no shadows.** Per-sample shadow rays are O(n²). Half-angle
slicing (Kniss) is the correct fix and is a rewrite of the march, not a feature.
`surfaceness` + Blinn-Phong is ~80% of the perceived win at ~0 extra cost. This is
the industry-normal tradeoff; say so rather than promise shadows.

**R4 — Phasor layers**: the gradient is of *intensity* while the colour is the
*lifetime hue*. Correct, and it mirrors the existing "rank by intensity, never by
phasor value" rule (~987-990) — but confirm it on real phasor data.

**R5 — Additive blending + specular** can push a highlight above 1.0 where the
colormap is dark. That is what a specular is; `surfaceness` keeps it on real
surfaces. Watch the first multi-layer scene.

**R6 — Non-uniformly-scaled or sheared layer affines** distort normals. C3 is
exact up to the layer's `affineMatrix` rotation, which only re-aims a fixed light
and does not touch a headlight. Rare. Documented, not fixed.

## 8. What can and cannot be verified

**Automatable (vitest + tsc):**
- `core/shading.ts` pure math: dot-product invariance under the y-flip reflection
  (C4); headlight never dark; `surfaceness` clamps; `physicalGradient` exact under
  anisotropic scale.
- **The highest-value test here:** assert `GRADIENT_H <= resolveBrickSpec(geo,
  "3D", …).border` across the specs `resolveBrickSpec` can produce, including the
  payload-doubling path. If anyone sets `border: 0` for 3D, or bumps `GRADIENT_H`
  "for a smoother normal", this fires — instead of the render silently mixing an
  adjacent channel into the normals (C2).
- `resolveCinematic` truth table (tier × cinematic × active × playing).
- `modeStore.cinematic` and `viewerStore.isoThreshold` defaults + setters.

**Eye-only — no automated path exists:**
- **That this TSL compiles to valid WGSL at all.** `vitest.config.ts` runs
  node/jsdom, `vitest.setup.ts` stubs no GPU, and `WGSLNodeBuilder` needs a real
  device. This is the single biggest unverifiable and the most likely thing to be
  wrong on first run — budget a debug round-trip.
- Normal orientation, specular blowout, whether `surfaceGain = 6` and the fill
  direction flatter real data, actual frame cost.
- `core/shading.ts` would prove the TS is right, **not** that the TSL matches it —
  the same caveat the existing `phasor.ts` / `opacityCorrection.ts` mirrors carry.
  Do not oversell it.

## 9. Deferred on purpose

- **Post-processing** (bloom, DOF, tone-mapped grading) — §2. Needs alpha + depth
  from the volume and a rewrite of every projection mode's resolve. An order of
  magnitude more work than lit volume; genuinely a separate project.
- **Volumetric shadows / half-angle slicing** — R3.
- **Persisting cinematic** — session-only by choice. There is no precedent for
  persisting a viewer preference to the backend; the two options are the
  render-graph mutation (per-layer, wrong granularity for a scene-wide light) or
  the `localStorage` pattern `qualityGovernor` uses for its learned tier.
- **A configurable light rig** (direction, colour, multiple lights) — the zero-
  configuration key+fill is the point. Revisit only if real data demands it.
