# Wire in elektro ModelWorkspace

## Context

The elektro backend schema now exposes a `ModelWorkspace` type (already pulled into
`graphql/schemas/elektro.graphql` via `yarn elektro`): a named container that holds
`NeuronModel`s through `WorkspaceMapping` rows (`{ model, workspaceGroup }`), plus
mutations `createModelWorkspace`, `addModelsToWorkspace`, `removeModelsFromWorkspace`,
`deleteModelWorkspace`, `pinModelWorkspace`, and queries `modelWorkspace` /
`modelWorkspaces`. None of this is wired into the renderer yet.

Goal (per user): from any neuron model, spin up a workspace; while that workspace is
the "active" one, every model the user saves from the editor automatically joins it;
and a workspace page renders the **currently active model in its glory** (the big
`NeuronVisualizer`, same treatment as `NeuronModelPage`).

Decisions locked in with the user:
- **Create** = a NeuronModel **local action, no dialog** — auto-names the workspace
  after the model, creates immediately, sets it active, navigates to it.
- **Auto-add scope** = only models created via the **Neuron editor Save**
  (`NeuronModelEditorPage` → `createNeuronModel`).
- **Active state** = **session-only, in-memory** (plain zustand, no persistence). The
  schema has **no** server-side "currently active model" field, so this is purely a
  client concept: an active workspace id + active model id.

## Conventions in play
- Module GraphQL/UI must sit behind `Guard.Elektro` (CLAUDE.md §1). The elektro routes
  already render inside `<Guard.Elektro>` in `ElektroModule.tsx`, so pages are covered;
  the local action reads the apollo client from `services.elektro.client` only at
  execute time, so it's safe too.
- Model-specific actions are **local actions** with `conditions`, registered in a module
  action map (CLAUDE.md §3). They surface in both the context menu and `ObjectButton`.
- Smart models are declared once via `buildSmart(identifier, path, { name })` in
  `linkers.tsx`; that auto-registers the identifier and gives `.ModelPage`, `.ListPage`,
  `.DetailLink`, `.ObjectButton`, `.linkBuilder`, etc.

## Changes

### 1. GraphQL documents (then re-run `yarn elektro`)
Follow the existing fragment/query/mutation split under `graphql/elektro/`.

- `graphql/elektro/fragments/model_workspace.graphql`
  ```graphql
  fragment ListModelWorkspace on ModelWorkspace { id name pinned }
  fragment WorkspaceMapping on WorkspaceMapping {
    id
    workspaceGroup
    model { ...ListNeuronModel }
  }
  fragment DetailModelWorkspace on ModelWorkspace {
    id
    name
    description
    pinned
    mappings { ...WorkspaceMapping }
  }
  ```
  (`ListNeuronModel` already exists in `fragments/neuron_model.graphql`.)
- `graphql/elektro/queries/model_workspace.graphql` — `DetailModelWorkspace($id)` →
  `modelWorkspace(id:)`, and `ListModelWorkspaces($pagination,$filters,$ordering)` →
  `modelWorkspaces(...)`, mirroring `queries/model_collection.graphql`.
- `graphql/elektro/mutations/model_workspace.graphql` — `CreateModelWorkspace`,
  `AddModelsToWorkspace`, `RemoveModelsFromWorkspace`, `DeleteModelWorkspace`
  (`deleteModelWorkspace(input:{id:})` returns `ID!`, mirror `DeleteNeuronModel`).
  `CreateModelWorkspace`/`AddModelsToWorkspace` should select `...DetailModelWorkspace`
  so the cache fills in.

Run `yarn elektro` to regenerate hooks into `src/renderer/src/elektro/api/graphql.ts`
(`useDetailModelWorkspaceQuery`, `useAddModelsToWorkspaceMutation`,
`CreateModelWorkspaceDocument`, `DeleteModelWorkspaceDocument`, …).

### 2. Active-workspace store (session-only)
New `src/renderer/src/elektro/lib/activeWorkspaceStore.ts` — plain zustand `create`
(no persist, mirrors `elektro/lib/neuronPanelStore.ts`):
```ts
interface ActiveWorkspaceState {
  activeWorkspaceId: string | null;
  activeModelId: string | null;
  setActiveWorkspace: (id: string | null) => void;   // clears activeModelId
  setActiveModel: (id: string | null) => void;
  clear: () => void;
}
```
Usable both as a hook (in pages/pane) and imperatively via
`useActiveWorkspaceStore.getState()` (in the local action / editor save).

### 3. Linker + display registration
- `src/renderer/src/linkers.tsx`: add
  ```ts
  export const ElektroModelWorkspace = buildSmart(
    "@elektro/modelworkspace", "elektro/modelworkspaces", { name: "Model Workspace" },
  );
  ```
- `src/renderer/src/app/display.tsx`: register
  `"@elektro/modelworkspace": ModelWorkspaceDisplay` and create a small
  `src/renderer/src/elektro/displays/ModelWorkspaceDisplay.tsx` (uses
  `useDetailModelWorkspaceQuery`, shows name + mapping count). Mirrors
  `displays/NeuronModelDisplay.tsx`.

### 4. Local action: "Create Workspace from Model" (+ delete)
In `src/renderer/src/lib/elektro/actions.ts`, add to `ELEKTRO_ACTIONS`:
- `createElektroWorkspaceFromModel`: a custom `Action`
  - `conditions`: `[{ type: "identifier", identifier: "@elektro/neuronmodel" }, { type: "nopartner" }]`
  - `execute: async ({ state, services, navigate }) => { … }`:
    1. `const model = state.left[0].object;`
    2. `const client = services.elektro.client;` (same access pattern as
       `builders/deleteAction.tsx`).
    3. `client.mutate({ mutation: CreateModelWorkspaceDocument, variables: { input: { name: `${model.name} Workspace` } } })`.
    4. `client.mutate({ mutation: AddModelsToWorkspaceDocument, variables: { input: { workspace: newId, models: [model.id] } } })`.
    5. `useActiveWorkspaceStore.getState().setActiveWorkspace(newId);` then
       `.setActiveModel(model.id);`
    6. `navigate(ElektroModelWorkspace.linkBuilder(newId));`
  - icon: a lucide glyph (e.g. `LayoutDashboard`); `collections: ["io"]`.
- `deleteElektroModelWorkspace`: `buildDeleteAction({ identifier: "@elektro/modelworkspace",
  typename: "ModelWorkspace", service: "elektro", mutation: DeleteModelWorkspaceDocument, … })`.

No `app/dialog.tsx` change — the user chose no dialog.

### 5. Workspace detail page — "currently active model in its glory"
New `src/renderer/src/elektro/pages/ModelWorkspacePage.tsx`, modeled closely on
`pages/ModelCollectionPage.tsx`:
- `asDetailQueryRoute(useDetailModelWorkspaceQuery, ({ data }) => …)`.
- Read `activeModelId` from `useActiveWorkspaceStore`; on mount, if it's null or not in
  this workspace's mappings, default to the first mapping's model. Render inside
  `<ElektroModelWorkspace.ModelPage variant="black" object={data.modelWorkspace} …>`.
- Layout (reuse ModelCollectionPage's grid): **left** = mappings list, grouped by
  `workspaceGroup`, each row a card; clicking calls `setActiveModel(model.id)`; include
  `ElektroNeuronModel.DetailLink`. **right (col-span-9)** = big
  `<NeuronVisualizer model={selectedDetail.neuronModel} key={…} />`, where
  `selectedDetail` comes from a secondary `useDetailNeuronModelQuery({ variables: { id:
  activeModelId }, skip: !activeModelId })` (same secondary-query trick
  ModelCollectionPage already uses for full config).
- Header shows workspace name/description like `NeuronModelPage`.

### 6. Workspaces list page + nav
- New `src/renderer/src/elektro/pages/ModelWorkspacesPage.tsx` using
  `<ElektroModelWorkspace.ListPage title="Workspaces">` + a simple list rendered from
  `useListModelWorkspacesQuery`, each item an `ElektroModelWorkspace.DetailLink` card
  (mirror `NeuronModelsPage` / its list component).
- `src/renderer/src/elektro/ElektroModule.tsx`: add routes
  `modelworkspaces/:id` → `ModelWorkspacePage`, `modelworkspaces` → `ModelWorkspacesPage`.
- `src/renderer/src/elektro/panes/StandardPane.tsx`: add a `PaneLink` to
  `/elektro/modelworkspaces` under the "Neuron" group; optionally show the active
  workspace name (from the store) when set.

### 7. Editor Save → auto-join active workspace
In `src/renderer/src/elektro/pages/NeuronModelEditorPage.tsx` `handleSave`, after the
existing `createModel` succeeds and `newId` is known (before/with the navigate):
```ts
const { activeWorkspaceId, setActiveModel } = useActiveWorkspaceStore.getState();
if (activeWorkspaceId && newId) {
  await addModelsToWorkspace({ variables: { input: { workspace: activeWorkspaceId, models: [newId] } } });
  setActiveModel(newId);
}
```
Add `const [addModelsToWorkspace] = useAddModelsToWorkspaceMutation();` at the top.
Keep the existing toast/navigate behavior; the auto-add is best-effort (wrap in
try/catch, toast on failure) so a workspace error never blocks saving the model.

## Critical files
- `graphql/elektro/{fragments,queries,mutations}/model_workspace.graphql` (new)
- `src/renderer/src/elektro/lib/activeWorkspaceStore.ts` (new)
- `src/renderer/src/elektro/pages/ModelWorkspacePage.tsx`, `ModelWorkspacesPage.tsx` (new)
- `src/renderer/src/elektro/displays/ModelWorkspaceDisplay.tsx` (new)
- `src/renderer/src/linkers.tsx`, `src/renderer/src/app/display.tsx`
- `src/renderer/src/lib/elektro/actions.ts`
- `src/renderer/src/elektro/ElektroModule.tsx`, `panes/StandardPane.tsx`
- `src/renderer/src/elektro/pages/NeuronModelEditorPage.tsx`
- Reuse: `pages/ModelCollectionPage.tsx` (page shape), `components/NeuronRenderer.tsx`
  (`NeuronVisualizer`), `lib/localactions/builders/deleteAction.tsx` (service-client
  access), `lib/neuronPanelStore.ts` (zustand shape), existing `ListNeuronModel` fragment.

## Verification
1. `yarn elektro` regenerates cleanly; confirm new hooks exist in
   `elektro/api/graphql.ts`. Run `yarn typecheck` and confirm no new errors vs the
   known backlog (the no-regression ratchet).
2. Run the app (`/run`). With elektro configured: open a NeuronModel, use the
   ObjectButton / right-click context menu → **Create Workspace from Model** → it lands
   on the new workspace page showing that model big in the visualizer.
3. From that model open the **editor**, tweak, **Save** → confirm the new model appears
   in the active workspace's mapping list and becomes the displayed (active) model.
4. Click another model in the workspace list → the big visualizer switches to it.
5. Navigate via the new **Workspaces** pane link → list shows the workspace; open it.
6. Delete the workspace via its ObjectButton local action; confirm it's removed.
