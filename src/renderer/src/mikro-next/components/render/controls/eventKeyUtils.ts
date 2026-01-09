export type EventKey = "shift" | "ctrl" | "alt" | "none";

export interface EventKeyProps {
  event_key?: EventKey;
}

/**
 * Utility function to check if the required event key is pressed
 * @param event The pointer/mouse event
 * @param eventKey The required event key ("shift", "ctrl", "alt", or "none")
 * @returns true if the required key is pressed or if no key is required
 */
export const checkEventKey = (
  event: any,
  eventKey: EventKey = "shift",
): boolean => {
  switch (eventKey) {
    case "shift":
      return event.shiftKey && !event.ctrlKey && !event.altKey;
    case "ctrl":
      return event.ctrlKey && !event.shiftKey && !event.altKey;
    case "alt":
      return event.altKey && !event.shiftKey && !event.ctrlKey;
    case "none":
      return true;
    default:
      return event.shiftKey && !event.ctrlKey && !event.altKey; // Default to "shift" behavior
  }
};

/**
 * Hook-like function to create an event key checker for a specific key
 * @param eventKey The required event key
 * @returns A function that checks if the event matches the required key
 */
export const createEventKeyChecker = (eventKey: EventKey = "shift") => {
  return (event: any) => checkEventKey(event, eventKey);
};
