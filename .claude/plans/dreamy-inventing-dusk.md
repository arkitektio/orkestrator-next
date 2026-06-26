# Fix perceived "ArkitektProvider re-runs on every navigate" perf regression

## Context

The user reports a massive perf regression: on every page navigation the
ArkitektProvider appears to "run again", with the console flooded by repeated
`lok {...}`, `[ArkitektProvider] Token still valid…`, and ward-registration
messages, plus `popstate` handlers taking 184–522 ms.

**The provider does NOT actually re-bootstrap on navigation.** It is built once
at module scope (`app/Arkitekt.tsx:191` via `buildArkitekt`) and mounted once at
the root (`app/AppProvider.tsx:125`), *above* the routed `children`. Navigation
only swaps `children`; the `<Arkitekt.Provider>` and its `useEffect([], …)`
bootstrap never re-run.

What the user is actually seeing has two causes:

1. **Dev-only double bootstrap** — `main.tsx` wraps `<App/>` in
   `<React.StrictMode>`, which double-invokes effects in development. That is why
   the whole "Bootstrapping…" sequence appears twice at startup. Harmless in
   production; not the regression.

2. **The real cost: leftover debug `console.log`s on hot render/request paths.**
   Logging large objects (the whole `Service`, which contains an `ApolloClient`,
   and query `data`) forces the browser/DevTools to retain references and
   serialize them on every call. With these sitting in render and per-request
   paths, each navigation that mounts query components triggers dozens of
   expensive logs — this is the dominant driver of the 200–500 ms `popstate`
   handlers and the perceived "re-run".

3. **Secondary amplifier: over-broad store subscriptions.** `useArkitekt()`
   subscribes to the *entire* store (`hooks.tsx:34`,
   `useArkitektStore((s) => s)`). Always-mounted components subscribe to it and
   re-render on *any* store mutation. During bootstrap `validateService` mutates
   the store ~9× (once per service), so these re-render many times; on navigation
   the heavy nav bar re-renders fully.

## Changes

### 1. Remove leftover debug logs on hot paths (primary fix)

- `src/renderer/src/lib/lok/hooks.tsx:39` — delete `console.log("lok", lok);`
  inside `useQuery` (fires every lok query render, logs the full Service +
  ApolloClient).
- `src/renderer/src/lib/mikro/hooks.tsx:16` — delete `console.log("data", data);`
- `src/renderer/src/lib/kraph/hooks.tsx:16` — delete `console.log("data", data);`
- `src/renderer/src/lib/arkitekt/provider.tsx:145` — remove (or gate behind a
  debug flag) `console.log("[ArkitektProvider] Token still valid…")`. This fires
  on **every** GraphQL request because `getToken()` is called in the Apollo auth
  link per request (`builders/graphQlServiceBuidler.tsx:27` HTTP and `:40` WS).
- `src/renderer/src/lib/arkitekt/WardRegistrar.tsx:30` — remove the per-ward
  `Registering ward` log (fires ~6×9 during bootstrap due to serviceMap identity
  churn).
- The remaining ~28 `[ArkitektProvider] …` logs in `provider.tsx` and the
  `runtime/connection.ts` logs: gate them behind a single debug flag
  (e.g. `const DEBUG = false`) rather than deleting, so bootstrap tracing stays
  available but is silent by default.

### 2. Narrow over-broad `useArkitekt()` subscriptions (secondary)

- `app/components/navigation/PrivateNavigationBar.tsx:229` — `ModuleNavItem`
  calls `Arkitekt.useArkitekt()` but never uses the result (`arkitekt` is
  unused); it only needs `useAvailableModules()`. Delete the unused call. This is
  rendered once per module (~10×) inside the always-mounted nav bar, so it is a
  meaningful re-render source.
- Audit the other `useArkitekt()` call sites and replace whole-store usage with
  the narrow selectors already exported from `lib/arkitekt/hooks.tsx`
  (`useConnection`, `useServiceState`, `useToken`, `useManifest`, etc.) where the
  component only needs one slice:
  - `app/agent/AgentProvider.tsx`
  - `app/hooks/useLocalAction.tsx`
  - `app/components/fallbacks/Connecting.tsx`
  (`provider.tsx` and `index.tsx` internal uses are fine.)

## Out of scope / notes

- StrictMode double-invocation is expected dev behavior — do **not** remove
  StrictMode to "fix" the double bootstrap.
- The `kraph/ht` CORS/502 errors in the log are an unrelated backend/alias issue
  (kraph service unreachable), not part of this regression.

## Verification

1. `yarn dev`, open DevTools console.
2. Confirm: after the (dev-only, ×2) startup bootstrap, the console no longer
   streams `lok {…}` / `data {…}` / `Token still valid` / `Registering ward`
   while idle or while navigating between pages.
3. Navigate repeatedly between `/rekuest/home`, `/mikro`, `/kraph` and confirm no
   `[ArkitektProvider] Bootstrapping…` lines appear on navigation (proves the
   provider is not re-running).
4. In the Performance tab (or via the `[Violation] 'popstate' handler took …`
   warnings), confirm navigation handler time drops substantially from the
   ~200–520 ms baseline.
5. `yarn typecheck` — no new errors versus the existing backlog (no-regression
   ratchet).
