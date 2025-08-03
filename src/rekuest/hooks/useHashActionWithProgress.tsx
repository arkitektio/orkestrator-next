import { useDialog } from "@/app/dialog";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import {
  AssignationEventFragment,
  AssignInput,
  ReserveMutationVariables,
  useActionByHashQuery
} from "../api/graphql";
import { useAssign } from "./useAssign";
import { registeredCallbacks } from "../components/functional/AssignationUpdater";

export type ActionReserveVariables = Omit<
  ReserveMutationVariables,
  "instanceId"
>;
export type ActionAssignVariables = Omit<AssignInput, "instanceId">;



export type useActionOptions = {
  hash?: string;
  onDone?: (event: AssignationEventFragment) => void;
  onError?: (error: string) => void;
  ephemeral?: boolean;
  object?: string;
};

export const useHashActionWithProgress = (
  options: useActionOptions
) => {

  const { data} = useActionByHashQuery({
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
    (event: AssignationEventFragment) => {
      console.log("Assignation event received:", event);
      if (event.kind == "DONE") {
        setDoing(false);
        setProgress(null);
        options.onDone?.(event);
      }
      if (event.kind == "ERROR" || event.kind == "CRITICAL") {
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

  
    try {
      const reference = uuidv4();

      await postAssign({
        action: data?.action.id,
        args: args,
        reference: reference,
        ephemeral: options.ephemeral,
      });

      setDoing(true);
      setError(null);

      registeredCallbacks.set(reference, doStuff);
    } catch (e) {
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

