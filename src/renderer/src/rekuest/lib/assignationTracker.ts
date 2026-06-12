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

export const bufferEvent = (
  assignationId: string,
  event: AssignationEventFragment,
) => {
  (bufferedEvents[assignationId] ??= []).push(event);
};

export const takeBufferedEvents = (
  assignationId: string,
): AssignationEventFragment[] => {
  const events = bufferedEvents[assignationId] || [];
  delete bufferedEvents[assignationId];
  return events;
};
