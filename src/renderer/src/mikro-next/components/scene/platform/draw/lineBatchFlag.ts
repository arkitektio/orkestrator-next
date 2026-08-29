/**
 * Kill switch for merged fat-line outline batching (localStorage, default
 * OFF — shipped dark pending live validation, same pattern as
 * `platform/gpu/volumeTargetFlags.ts`): one `LineSegments2` per (collection,
 * stroke width) instead of one `Line2` + material per shape. The strategy is
 * a DRAW concern — `features/annotations/annotationBatch.ts` is its first
 * consumer — which is why the flag lives here where both the feature and the
 * DebugPanel can reach it without a sideways feature edge.
 * Read once per collection mount.
 */
const LINE_BATCH_STORAGE_KEY = "orkestrator.annotationBatch";

export function isLineBatchEnabled(): boolean {
  try {
    return window.localStorage.getItem(LINE_BATCH_STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

export function setLineBatchEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(LINE_BATCH_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* storage unavailable: session keeps its current state */
  }
}
