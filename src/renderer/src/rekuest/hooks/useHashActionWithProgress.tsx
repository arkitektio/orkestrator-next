import { useDialog } from "@/app/dialog";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import {
  TaskEventFragment,
  AssignInput,
  useActionByHashQuery
} from "../api/graphql";
import { trackTask } from "../lib/taskTracker";
import { useAssign } from "./useAssign";

export type ActionAssignVariables = AssignInput;



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
  const { openDialog } = useDialog();

  const doStuff = useCallback(
    (event: TaskEventFragment) => {
      console.log("Task event received:", event);
      if (event.kind == "COMPLETED") {
        setDoing(false);
        setProgress(null);
        options.onDone?.(event);
      }
      if (event.kind == "FAILED" || event.kind == "CRITICAL") {
        setDoing(false);
        setProgress(null);
        setError(event.message || "Unknown error");
        options.onError?.(event.message || "Unknown error");
      }
      if (event.kind == "PROGRESS") {
        setProgress(event.progress || 0);
      }
    },
    [setDoing, setProgress, setError, options.onDone, options.onError],
  );

  const assign = async (args: { [key: string]: any }) => {

    let actionArgs = data?.action?.args || [];

    actionArgs = actionArgs.map((arg) => {
      if (arg.key in args) {
        return args[arg.key];
      }
      return arg;
    });


    const reference = uuidv4();
    const untrack = trackTask(reference, doStuff);

    try {
      await postAssign({
        action: data?.action.id,
        args: args,
        reference: reference,
        ephemeral: options.ephemeral,
      });

      setDoing(true);
      setError(null);
    } catch (e) {
      untrack();
      toast.error(e.message);
      setDoing(false);
      setError(e.message || "Unknown error");
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

