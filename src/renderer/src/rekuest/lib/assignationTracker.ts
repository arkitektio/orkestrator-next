import {
  AssignationEventFragment,
  AssignationEventKind,
} from "../api/graphql";

/**
 * Callbacks keyed by the client-generated assignation reference. Components
 * that track an assignation locally register here BEFORE firing the assign
 * mutation, so the subscription can both deliver events to them and suppress
 * the global toast for that assignation.
 */
export const registeredCallbacks = new Map<
  string,
  (event: AssignationEventFragment) => void
>();

export const TERMINAL_EVENT_KINDS = [
  AssignationEventKind.Done,
  AssignationEventKind.Cancelled,
  AssignationEventKind.Critical,
  AssignationEventKind.Error,
  AssignationEventKind.Interupted,
] as const;

export const isTerminalEvent = (kind: AssignationEventKind) =>
  (TERMINAL_EVENT_KINDS as readonly AssignationEventKind[]).includes(kind);

/**
 * Register a callback for an assignation reference. Call this BEFORE awaiting
 * the assign mutation so no early subscription events are missed. Returns an
 * unregister function for cleanup (also called automatically by the
 * subscription handler when a terminal event arrives).
 */
export const trackAssignation = (
  reference: string,
  callback: (event: AssignationEventFragment) => void,
): (() => void) => {
  registeredCallbacks.set(reference, callback);
  return () => {
    registeredCallbacks.delete(reference);
  };
};

/**
 * Events can arrive over the subscription before their assignation's `create`
 * payload. Buffer them per assignation id and merge them when the create
 * arrives.
 */
const bufferedEvents: Record<string, AssignationEventFragment[]> = {};

// Cap the number of distinct assignations we buffer. A buffer orphans forever if
// its `create` payload never arrives (so takeBufferedEvents is never called), so
// evict the oldest buffer once we exceed this bound.
const MAX_BUFFERED_ASSIGNATIONS = 500;

export const bufferEvent = (
  assignationId: string,
  event: AssignationEventFragment,
) => {
  if (
    !(assignationId in bufferedEvents) &&
    Object.keys(bufferedEvents).length >= MAX_BUFFERED_ASSIGNATIONS
  ) {
    const oldestKey = Object.keys(bufferedEvents)[0];
    if (oldestKey !== undefined) delete bufferedEvents[oldestKey];
  }
  (bufferedEvents[assignationId] ??= []).push(event);
};

export const takeBufferedEvents = (
  assignationId: string,
): AssignationEventFragment[] => {
  const events = bufferedEvents[assignationId] || [];
  delete bufferedEvents[assignationId];
  return events;
};
