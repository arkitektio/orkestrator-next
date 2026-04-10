import { useMemo, useRef, useState } from "react";
import { useCheckoutQuery, useCheckoutAgentQuery, useWatchStateSubscription } from "../api/graphql";
import { applyPatch } from "fast-json-patch";

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


export type LiveStateEntry = {
  value: Record<string, unknown>;
  globalRevision: number | null;
};

export const useLiveAgentStates = ({
  agentID,
}: {
  agentID: string;
}) => {
  const { data: checkoutData, error: checkoutError, loading } = useCheckoutAgentQuery({
    variables: { agent: agentID },
  });

  // Mutable ref for applying incremental patches — only touched in subscription callbacks
  const valuesRef = useRef<Record<string, Record<string, unknown>>>({});
  const [patchGeneration, setPatchGeneration] = useState(0);

  // Derive initial state map from checkout data
  const checkoutStates = useMemo(() => {
    if (!checkoutData?.checkoutAgent) return {};
    const map: Record<string, LiveStateEntry> = {};
    for (const s of checkoutData.checkoutAgent) {
      map[s.stateId] = {
        value: s.value ?? {},
        globalRevision: s.globalRevision ?? null,
      };
      // Seed refs for patch application
      valuesRef.current[s.stateId] = s.value ?? {};
    }
    return map;
  }, [checkoutData]);

  // Subscribe to all state changes for this agent
  useWatchStateSubscription({
    variables: { agentID },
    onData: ({ data: subData }) => {
      const event = subData.data?.watchState;
      if (!event) return;

      const sid = event.stateId;

      if (event.__typename === "StateSnapshotEvent") {
        valuesRef.current[sid] = event.value;
        setPatchGeneration((g) => g + 1);
      } else if (event.__typename === "StatePatchEvent") {
        const current = valuesRef.current[sid];
        if (current) {
          const result = applyPatch(
            current,
            [{ op: event.op as "replace" | "add" | "remove", path: event.path, value: event.value }],
            false,
            false,
          );
          valuesRef.current[sid] = result.newDocument;
        } else {
          valuesRef.current[sid] = event.value ?? {};
        }
        setPatchGeneration((g) => g + 1);
      }
    },
    onError: (err) => {
      console.error("Error in agent states subscription:", err);
    },
  });

  // Merge checkout base with live patches (re-derives when patches arrive)
  const states = useMemo(() => {
    const merged: Record<string, LiveStateEntry> = { ...checkoutStates };
    // Overlay any values that have been updated via subscription
    for (const [sid, val] of Object.entries(valuesRef.current)) {
      if (val !== checkoutStates[sid]?.value) {
        merged[sid] = { value: { ...val }, globalRevision: merged[sid]?.globalRevision ?? null };
      }
    }
    return merged;
    // patchGeneration triggers re-computation when subscription patches arrive
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutStates, patchGeneration]);

  return {
    states,
    loading,
    error: checkoutError,
  };
};
