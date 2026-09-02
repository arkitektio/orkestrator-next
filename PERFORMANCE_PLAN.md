# Performance plan — high-impact, high-frequency offenders

Audit date: 2026-09-01. Implementation: 2026-09-02 (branch `new-stuff`,
uncommitted). Scope: `src/renderer/src`. Items were ranked by
(cost per execution × how often it fires × how many places mount it).
Verification per change set: `pnpm typecheck` (clean) and `pnpm test`
(242 files / 2962 tests passing); the Electron app is not launched from agent
sessions, so the render-count claims below still want a React Profiler
recording by a human (see "Verify by hand").

Already good, do not re-audit: zustand selector discipline outside
`reaktion/` (498 selector calls, 2 without), all `setInterval`s cleaned up,
no Apollo client or socket built inside components, no `console.log` inside
`useFrame`, scene camera/canvas sync, quality adapter, rAF coalescers, brick
residency probe path, Arkitekt provider context, `linkers.tsx` registry.
The worker RPC `pending` map is NOT leaked on abort: the abort path disposes
the worker, which rejects and clears every pending request.

---

## Done

### Every list page (cards, grids, smart objects)
- **auto-animate re-init per render** — `components/layout/ContainerGrid.tsx`
  now attaches once via `useAutoAnimate` (was re-run on every render,
  stacking per-child observers and 2 s intervals).
- **Smart-model ref callback churn** — `providers/smart/useSmartModel.tsx`:
  drag state read through `useLatestRef`, so the ref callback is stable and
  a drag starting anywhere no longer re-registers every card;
  `data-object` carries `object.id` instead of the serialized fragment; the
  `[object Object]` URL/key bugs are fixed. Same treatment in
  `useSmartDropZone.tsx` (also keyed on `object.id`).
- **Selection store O(n²) registration** — `providers/selection/store.tsx`:
  node-keyed `Map`, microtask-batched register/unregister (one store
  notification per commit), `flushSelectables()`, and a marquee rect cache
  (`beginMarquee`/`endMarquee`, invalidated on scroll). `SelectionProvider`
  reads `selectables` on demand instead of subscribing. Tests extended.
- **Dialog / display / debug / widget-registry context values** memoized
  (`lib/generic/providers/DialogProvider.tsx`, `lib/display/registry.tsx`,
  `providers/debug/DebugProvider.tsx`, `rekuest/widgets/WidgetsProvider.tsx`).
- **Card memoization** — 80 card components under `**/components/cards/`
  export `React.memo(...)`; `createList` memoizes the merged `cardProps`.
- **`ListRender` duplicate refetch** skipped when the parent already
  paginated; `createList` serializes filters once per identity and honours a
  new `fetchPolicy` option.
- **Console logging** removed from `useResolve`, `useKraphMediaResolve`,
  `mikroAccess`, `rekuestAccess`, the four reaktion contextuals,
  `ReactiveWidget`, `TrackFlow`, `LiveTracker`, `RangeTracker`.
- **Snapshot backdrops** — `lib/datalayer/mikroAccess.tsx`: shared,
  ref-counted blob-URL cache (`acquireBlobUrl`) with a 30 s release grace,
  and `WithMikroMediaUrl` defers the fetch until the element nears the
  viewport.

### App-root subscriptions and data layer
- `ConnectedGuard` uses the new shallow `useConnectionStatus()`;
  `WardRegistrar`, `ConnectingFallback`, `TaskHookRunner` use narrow hooks;
  `AgentProvider` reads the Arkitekt store imperatively and pushes context
  refreshes through a store subscription (no whole-store rerender);
  `useAgent` is shallow-compared.
- `AgentUpdater` inserts/deletes through `cache.modify` on the root field
  (reaches every paginated `agents` variant).
- `TaskFlow` retries with exponential backoff and a ceiling.
- `chat.tsx` and `TaskEventLog` sort once per input identity with string
  comparison (no `Date` per comparison).
- `RoomPage` dedupes redelivered subscription messages.

### Action forms and widgets
- `HideEffect`: one shared `ShadowRealm`, compiled functions cached per
  source string, subscribed via `useWatch` to the port and its dependencies.
- `useWidgetDependencies`: `useWatch` on the resolved dependency paths;
  `values` only changes when a dependency value changes (no search request
  per unrelated keystroke).
- `form.watch()` removed from `ActionAssignForm`, `ShortcutForm`,
  `CreateShortcutDialog`; the description is a `FormActionDescription` leaf.
- `ActionDescription` caches compiled Handlebars templates and derives text
  with `useMemo`.
- `ArgsContainer` resolves widgets/paths/effects once per port set, keys by
  `port.key`, and no longer mutates its `groups` prop.
- `SearchField` holds `search` in a ref, debounces queries (200 ms) and
  guards against out-of-order responses; `ChoicesField` and
  `StateChoiceWidget` memoize their search inputs.

### Reaktion flow editor
- `useEditRiver()` is gone; all 22 call sites use atomic
  `useEditFlowStore(s => s.field)` selectors or the new `useEditTemporal()`.
- `useEditNodeErrors` is shallow-compared; `LabeledShowEdge` looks the target
  node up through `nodeLookup` instead of scanning `useNodes()`.
- zundo history: a node drag is recorded as ONE undo step from the pre-drag
  state (intermediate ticks skipped). Test: `reaktion/edit/store.drag.test.ts`.
- `LiveTracker` / `RangeTracker` collapse events per source in O(n)
  (`latestEvents.ts`), and the live list is capped at 2000 events.

### Scene per-frame residuals
- `passVisibility.ts`: no per-leaf array/closure in the classifier;
  allocation-free `hideObjectsInto` / `disableColorWriteInto` used by
  `VolumeCompositor` with persistent scratch.
- `layersPlanKey` memoized per `layers` array identity; `layerIndexOf`
  gives selectors an id→index map (used by `BrickVolumeLayer`).
- `getMetaId` has an identity fast path (no stringify per chunk).
- `useBrickPlaneProbe` memoizes the probe geometry context and uses scratch
  matrices; `AnimationPlayer` / `readDimSelections` no longer allocate per
  frame; `FabriksCollectionLayer` pointer moves use a scratch vector and
  numeric dedupe; `drainUploads` reuses one progress object;
  `CanvasHueProbe` throttles during streaming too; `PointsLayer` mutates the
  cull-bounds uniforms in place; `AnnotationLayerCard` counts without
  allocating.

---

## Not done (and why)

- **`MyTasks` unpaginated at app root** (`TaskUpdater` /
  `rekuest/api/graphql.ts`): `graphql/schemas/rekuest.graphql` declares
  `myTasks: [Task!]!` with no arguments. Needs the server to add pagination
  first; then add `$pagination` to `graphql/rekuest-next/queries/task.graphql`,
  regenerate with `pnpm rekuest`, and window the cache in
  `rekuest/lib/taskCache.ts`.
- **Radix `ContextMenu`/`HoverCard` roots on every card**
  (`providers/smart/SmartModel.tsx`): optional; measure after the above.
- **`AnnotationLayerRenderer` 5 s poll per annotation layer**: already
  skipped mid-gesture; hoisting one poll per collection needs a structural
  change and was left out.
- **`useFilteredTasks` per-consumer filtering** (`rekuest/hooks/useTasks.tsx`).
- **`mergedChannelUniforms` builds/disposes textures per member per rebuild**:
  per structural edit only; refactor deferred.

## Verify by hand (React Profiler in dev)

- List page with two lists: opening a dialog, starting a drag, and typing in
  a filter should commit only the affected components.
- Action form with two search ports: one request per search-port change,
  none for unrelated keystrokes.
- 30-node flow: dragging a node commits only that node and its edges; the
  undo stack gains one entry per drag.
- Scene: existing vitest suites under `mikro-next/components/scene/**` and
  `lib/zarr/**`; debug panel frame stats while streaming.

## Conventions introduced

- `hooks/useLatestRef.ts`: read a changing value from a stable callback
  without a ref write during render (the React Compiler lint rules reject
  `ref.current = x` in the render body).
- Selection registration is batched; call `flushSelectables()` before a
  synchronous read of `selectables`.
- Flow-store consumers select fields; there is intentionally no
  whole-state hook.
