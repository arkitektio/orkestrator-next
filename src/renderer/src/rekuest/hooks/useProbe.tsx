import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { useRekuest } from "@/app/Arkitekt";
import {
  ProbeEventFragment,
  TaskEventKind,
  useCancelProbeMutation,
  usePauseProbeMutation,
  useResumeProbeMutation,
  useStartProbeMutation,
  WatchProbeEventsDocument,
  WatchProbeEventsSubscription,
  WatchProbeEventsSubscriptionVariables,
} from "../api/graphql";
import { isTerminalEvent } from "../lib/taskTracker";

export type useProbeOptions = {
  /** Target the probe by action id, implementation id, or action hash. */
  action?: string;
  implementation?: string;
  actionHash?: string;
  /** Every YIELD payload, as it arrives. */
  onYield?: (event: ProbeEventFragment) => void;
  /** Fired once, on the terminal event. */
  onDone?: (event: ProbeEventFragment) => void;
  onError?: (error: string) => void;
};

/**
 * Run an action as a **probe**: a zero-persistence invocation, redis-held under
 * a TTL, never in task history and never replayable. Only actions declaring
 * `allowProbe` may be probed.
 *
 * Deliberately *not* routed through `taskTracker` / `taskCache`. Those exist to
 * survive the assign path's arrival-before-hydration race; `probeEvents` is
 * per-probe and payload-carrying, and emits a state snapshot first when events
 * already happened, so there is nothing to buffer or hydrate. A probe has no
 * cache entity, no `myTasks` membership, and no notification.
 *
 * Unlike `useHashActionWithProgress`, this retains the probe id, so it can
 * actually cancel / pause / resume.
 */
export const useProbe = (options: useProbeOptions) => {
  const client = useRekuest();

  const [startProbe] = useStartProbeMutation();
  const [postCancel] = useCancelProbeMutation();
  const [postPause] = usePauseProbeMutation();
  const [postResume] = useResumeProbeMutation();

  const [probeId, setProbeId] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [returns, setReturns] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  // Held in a ref so unmount can tear the stream down without re-subscribing
  // every render.
  const streamRef = useRef<{ unsubscribe: () => void } | null>(null);

  const teardown = useCallback(() => {
    streamRef.current?.unsubscribe();
    streamRef.current = null;
  }, []);

  useEffect(() => teardown, [teardown]);

  const handleEvent = useCallback(
    (event: ProbeEventFragment) => {
      switch (event.kind) {
        case TaskEventKind.Progress:
          setProgress(event.progress ?? 0);
          return;
        case TaskEventKind.Yield:
          setReturns(event.returns ?? null);
          options.onYield?.(event);
          return;
        case TaskEventKind.Paused:
          setPaused(true);
          return;
        case TaskEventKind.Resumed:
          setPaused(false);
          return;
        default:
          break;
      }

      // Go through `isTerminalEvent` rather than hand-listing kinds, so
      // Cancelled/Interrupted settle the hook too (and a future terminal kind
      // is picked up for free).
      if (!isTerminalEvent(event.kind)) return;

      setRunning(false);
      setPaused(false);
      setProgress(null);
      teardown();

      if (
        event.kind === TaskEventKind.Failed ||
        event.kind === TaskEventKind.Critical
      ) {
        const message = event.message || "Unknown error";
        setError(message);
        options.onError?.(message);
        return;
      }

      if (event.kind === TaskEventKind.Completed) {
        setReturns(event.returns ?? null);
      }
      options.onDone?.(event);
    },
    [options.onYield, options.onDone, options.onError, teardown],
  );

  const probe = useCallback(
    async (args: { [key: string]: unknown }) => {
      if (!client) {
        toast.error("Rekuest is not available");
        return undefined;
      }

      // Only one probe in flight per hook instance.
      teardown();
      setError(null);
      setReturns(null);
      setProgress(null);
      setPaused(false);

      try {
        const result = await startProbe({
          variables: {
            input: {
              action: options.action,
              implementation: options.implementation,
              actionHash: options.actionHash,
              args,
              reference: uuidv4(),
            },
          },
        });

        const started = result.data?.probe;
        if (!started) throw new Error("Probe did not start");

        setProbeId(started.id);
        setRunning(!started.isDone);

        streamRef.current = client
          .subscribe<
            WatchProbeEventsSubscription,
            WatchProbeEventsSubscriptionVariables
          >({
            query: WatchProbeEventsDocument,
            variables: { probe: started.id },
          })
          .subscribe({
            next: (res) => {
              const event = res.data?.probeEvents;
              if (event) handleEvent(event);
            },
            error: (e: unknown) => {
              const message =
                e instanceof Error ? e.message : "Probe stream failed";
              setRunning(false);
              setError(message);
              options.onError?.(message);
              teardown();
            },
          });

        return started;
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        toast.error(message);
        setRunning(false);
        setError(message);
        return undefined;
      }
    },
    [
      client,
      startProbe,
      options.action,
      options.implementation,
      options.actionHash,
      options.onError,
      handleEvent,
      teardown,
    ],
  );

  // All three are idempotent server-side: acting on a finished probe is a no-op
  // that returns its terminal state.
  const act = useCallback(
    async (
      run: (vars: { variables: { input: { probe: string } } }) => Promise<unknown>,
    ) => {
      if (!probeId) return;
      try {
        await run({ variables: { input: { probe: probeId } } });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Unknown error");
      }
    },
    [probeId],
  );

  const cancel = useCallback(() => act(postCancel), [act, postCancel]);
  const pause = useCallback(() => act(postPause), [act, postPause]);
  const resume = useCallback(() => act(postResume), [act, postResume]);

  return {
    probe,
    cancel,
    pause,
    resume,
    probeId,
    running,
    paused,
    progress,
    returns,
    error,
  };
};
