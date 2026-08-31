/**
 * Kill switch for merged fat-line outline batching (localStorage, default
 * ON): one `LineSegments2` per (collection, stroke width) instead of one
 * `Line2` + material per shape — and a matching shrink of the click-raycast
 * set. Defaulted on once selection became a COLOR-ONLY pass and the batch
 * geometry became plane-independent (`annotationBatch.ts`) — before that a
 * click or a z-scrub rebuilt and re-uploaded every collection's buffers,
 * which is why it shipped dark. `"off"` remains the opt-out. The strategy is
 * a DRAW concern — `features/annotations/annotationBatch.ts` is its first
 * consumer — which is why the flag lives here where both the feature and the
 * DebugPanel can reach it without a sideways feature edge.
 * Read once per collection mount.
 */
const LINE_BATCH_STORAGE_KEY = "orkestrator.annotationBatch";

export function isLineBatchEnabled(): boolean {
  try {
    return window.localStorage.getItem(LINE_BATCH_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setLineBatchEnabled(enabled: boolean): void {
  try {
    window.localStorage.setItem(LINE_BATCH_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* storage unavailable: session keeps its current state */
  }
}
