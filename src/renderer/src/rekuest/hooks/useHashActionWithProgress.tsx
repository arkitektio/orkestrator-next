import { useCallback, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { buildAssignInput } from "@/rekuest/assign";
import {
  TaskEventFragment,
  TaskEventKind,
  useActionByHashQuery
} from "../api/graphql";
import { trackTask } from "../lib/taskTracker";
import { useAssign } from "./useAssign";

export type useActionOptions = {
  hash?: string;
  onDone?: (event: TaskEventFragment) => void;
  onError?: (error: string) => void;
  ephemeral?: boolean;
  object?: string;
};

export const useHashActionWithProgress = (
  options: useActionOptions
) => {

  const { data } = useActionByHashQuery({
    variables: {
      hash: options.hash,
    },
  });

  const [doing, setDoing] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { assign: postAssign } = useAssign();

  const doStuff = useCallback(
    (event: TaskEventFragment) => {
      if (event.kind == TaskEventKind.Completed) {
        setDoing(false);
        setProgress(null);
        options.onDone?.(event);
      }
      if (
        event.kind == TaskEventKind.Failed ||
        event.kind == TaskEventKind.Critical
      ) {
        setDoing(false);
        setProgress(null);
        setError(event.message || "Unknown error");
        options.onError?.(event.message || "Unknown error");
      }
      if (event.kind == TaskEventKind.Progress) {
        setProgress(event.progress || 0);
      }
    },
    [setDoing, setProgress, setError, options.onDone, options.onError],
  );

  const assign = async (args: { [key: string]: unknown }) => {
    const reference = uuidv4();
    const untrack = trackTask(reference, doStuff);

    try {
      await postAssign(buildAssignInput({
        action: data?.action.id,
        args: args,
        reference: reference,
        ephemeral: options.ephemeral ?? false,
      }));

      setDoing(true);
      setError(null);
    } catch (e) {
      untrack();
      const message = e instanceof Error ? e.message : "Unknown error";
      toast.error(message);
      setDoing(false);
      setError(message);
    }
  };


  return {
    assign,
    doing,
    progress,
    error,
    action: data?.action,
    installed: data?.action != undefined,
  };
};

