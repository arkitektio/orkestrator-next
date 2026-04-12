import { applyPatch } from "fast-json-patch";
import { useRef, useState } from "react";
import { useCheckoutQuery, useWatchAgentSubscription, useWatchStateSubscription } from "../api/graphql";

export const useLiveState = ({
  stateID
}: {
  stateID: string;
}) => {
  // Start from the latest checkout as our base
    const { data: checkoutData, error: checkoutError } = useCheckoutQuery({
      variables: { state: stateID },
    });

    const [liveValue, setLiveValue] = useState<Record<string, unknown> | null>(null);
    const [revision, setRevision] = useState<number | null>(null);
    const valueRef = useRef<Record<string, unknown> | null>(null);

    const checkoutValue = checkoutData?.checkout?.value;

    const currentLiveValue = liveValue ?? checkoutValue

    // Subscribe to live patches
    useWatchStateSubscription({
      variables: { stateID: stateID },
      onData: ({ data: subData }) => {
        const event = subData.data?.watchState;
        if (!event) return;

        // Lazily initialize the ref from checkout on first patch
        if (valueRef.current === null && checkoutValue) {
          valueRef.current = checkoutValue;
        }

        if (event.__typename === "StateSnapshotEvent") {
          // Full snapshot replaces the value
          valueRef.current = event.value;
          setLiveValue({ ...event.value });
          setRevision(event.globalRevision);
        } else if (event.__typename === "StatePatchEvent") {
          // Apply JSON patch to current value
          if (valueRef.current) {
            const result = applyPatch(
              valueRef.current,
              [{ op: event.op as "replace" | "add" | "remove", path: event.path, value: event.value }],
              false,
              false,
            );
            valueRef.current = result.newDocument;
            setLiveValue({ ...result.newDocument });
            setRevision(event.globalRevision);
          }
        }
      },
    });


  return {
    value: currentLiveValue,
    revision,
    error: checkoutError,
  };
}



export const useAgentLiveState = ({
  agentID,
  stateInterface
}: {
  agentID: string;
  stateInterface: string
}) => {

    const [liveValue, setLiveValue] = useState<Record<string, unknown> | null>(null);
    const [revision, setRevision] = useState<number | null>(null);
    const valueRef = useRef<Record<string, unknown> | null>(null);


    const currentLiveValue = liveValue
    // Subscribe to live patches
    useWatchStateSubscription({
      variables: { agentID: agentID, interface: stateInterface },
      onData: ({ data: subData }) => {
        const event = subData.data?.watchState;
        if (!event) return;

        if (event.__typename === "StateSnapshotEvent") {
          // Full snapshot replaces the value
          valueRef.current = event.value;
          setLiveValue({ ...event.value });
          setRevision(event.globalRevision);
        } else if (event.__typename === "StatePatchEvent") {
          // Apply JSON patch to current value
          if (valueRef.current) {
            const result = applyPatch(
              valueRef.current,
              [{ op: event.op as "replace" | "add" | "remove", path: event.path, value: event.value }],
              false,
              false,
            );
            valueRef.current = result.newDocument;
            setLiveValue({ ...result.newDocument });
            setRevision(event.globalRevision);
          }
        }
      },
      onError: (err) => {
        console.error("Error in state subscription:", err);
      }
    });


  return {
    value: currentLiveValue,
    revision,
  };
}



export const useAgentStates = ({
  agentID
}: {
  agentID: string;
}) => {

    const [liveValue, setLiveValue] = useState<Record<string, Record<string, unknown>> | null>(null);
    const [revision, setRevision] = useState<number | null>(null);
    const valueRef = useRef<Record<string, Record<string, unknown>> | null>(null);


    // Subscribe to live patches
    useWatchAgentSubscription({
      variables: { agentID: agentID },
      onData: ({ data: subData }) => {
        const event = subData.data?.watchAgent;
        if (!event) return;


        if (event.__typename === "AgentSnapshotEvent") {
          valueRef.current = event.values;
          setLiveValue(valueRef.current);
          setRevision(event.globalRevision);
        } else if (event.__typename === "StatePatchEvent") {
          // Apply JSON patch to one state entry in the map
          const currentMap = valueRef.current ?? {};
          const result = applyPatch(
            currentMap[event.stateId] || {},
            [{ op: event.op as "replace" | "add" | "remove", path: event.path, value: event.value }],
            false,
            false,
          );
          const nextMap = {
            ...currentMap,
            [event.stateId]: result.newDocument,
          };
          valueRef.current = nextMap;
          setLiveValue(nextMap);
          setRevision(event.globalRevision);
        }
      },
    });


  return {
    value: liveValue,
    revision,
  };
}
