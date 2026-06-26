import {
  LogLevel,
  TaskEventChangeFragment,
  TaskEventFragment,
  TaskEventKind,
} from "../api/graphql";

/**
 * Callbacks keyed by the client-generated task reference. Components
 * that track an task locally register here BEFORE firing the assign
 * mutation, so the subscription can both deliver events to them and suppress
 * the global toast for that task.
 */
export const registeredCallbacks = new Map<
  string,
  (event: TaskEventFragment) => void
>();

export const TERMINAL_EVENT_KINDS = [
  TaskEventKind.Completed,
  TaskEventKind.Cancelled,
  TaskEventKind.Critical,
  TaskEventKind.Failed,
  TaskEventKind.Interrupted,
] as const;

export const isTerminalEvent = (kind: TaskEventKind) =>
  (TERMINAL_EVENT_KINDS as readonly TaskEventKind[]).includes(kind);

/**
 * Register a callback for an task reference. Call this BEFORE awaiting
 * the assign mutation so no early subscription events are missed. Returns an
 * unregister function for cleanup (also called automatically by the
 * subscription handler when a terminal event arrives).
 */
export const trackTask = (
  reference: string,
  callback: (event: TaskEventFragment) => void,
): (() => void) => {
  registeredCallbacks.set(reference, callback);
  return () => {
    registeredCallbacks.delete(reference);
  };
};

/**
 * Bridge between a task's id and its client-generated reference.
 *
 * The non-traversable `TaskEventChange` only carries the task **id**, while
 * local trackers (`registeredCallbacks`) are keyed by the client `reference`.
 * The `TaskChange` (create) payload carries both, so we record the mapping on
 * create and use it to route later id-only events back to the right callback.
 */
const idToReference = new Map<string, string>();
const MAX_ID_REFERENCE = 1000;

export const mapReference = (id: string, reference?: string | null) => {
  if (!reference) return;
  if (!idToReference.has(id) && idToReference.size >= MAX_ID_REFERENCE) {
    const oldest = idToReference.keys().next().value;
    if (oldest !== undefined) idToReference.delete(oldest);
  }
  idToReference.set(id, reference);
};

export const referenceForId = (id: string): string | undefined =>
  idToReference.get(id);

export const forgetId = (id: string) => idToReference.delete(id);

/**
 * Synthesize a cache-shaped `TaskEvent` from the thin `TaskEventChange` delta.
 * The immutable event metadata the subscription no longer sends (`name`,
 * `level`, `delegatedTo`) is filled with placeholders — live readers only need
 * `kind`/`progress`/`returns`/`message`/`createdAt`. `reference` is the resolved
 * task reference so callback consumers that match on `event.task.reference`
 * keep working.
 */
export const taskEventChangeToEvent = (
  change: TaskEventChangeFragment,
  reference?: string | null,
): TaskEventFragment => ({
  __typename: "TaskEvent",
  id: change.id,
  kind: change.kind,
  level: LogLevel.Info,
  returns: change.returns,
  progress: change.progress,
  reference: reference ?? "",
  createdAt: change.createdAt,
  message: change.message,
  task: { __typename: "Task", id: change.task, reference: reference ?? null },
  delegatedTo: null,
});

/**
 * Events can arrive over the subscription before their task's `create`
 * payload (and before the task is hydrated into the cache). Buffer the raw
 * changes per task id and flush them once the task exists.
 */
const bufferedEvents: Record<string, TaskEventChangeFragment[]> = {};

// Cap the number of distinct tasks we buffer. A buffer orphans forever if
// its `create` payload never arrives (so takeBufferedEvents is never called), so
// evict the oldest buffer once we exceed this bound.
const MAX_BUFFERED_TASKS = 500;

export const bufferEvent = (
  taskId: string,
  event: TaskEventChangeFragment,
) => {
  if (
    !(taskId in bufferedEvents) &&
    Object.keys(bufferedEvents).length >= MAX_BUFFERED_TASKS
  ) {
    const oldestKey = Object.keys(bufferedEvents)[0];
    if (oldestKey !== undefined) delete bufferedEvents[oldestKey];
  }
  (bufferedEvents[taskId] ??= []).push(event);
};

export const takeBufferedEvents = (
  taskId: string,
): TaskEventChangeFragment[] => {
  const events = bufferedEvents[taskId] || [];
  delete bufferedEvents[taskId];
  return events;
};
