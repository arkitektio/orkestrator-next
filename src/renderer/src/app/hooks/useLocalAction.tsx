import { useArkitekt } from "@/lib/arkitekt/provider";
import { Action, ActionState } from "@/lib/localactions/LocalActionProvider";
import { OnDone } from "@/rekuest/buttons/ObjectButton";
import { useState } from "react";
import { useDialog } from "../dialog";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const usePerformAction = (props: {
  action: Action;
  state: ActionState;
  onDone?: OnDone;
}) => {
  const [progress, setProgress] = useState<number | undefined>(0);
  const [controller, setController] = useState<AbortController | null>(null);
  const app = useArkitekt();
  const dialog = useDialog();
  const navigate = useNavigate();

  const assign = async () => {
    if (controller) {
      controller.abort();
      return;
    }
    const newController = new AbortController();

    setController(newController);

    try {
      await props.action.execute({
        onProgress: (p) => {
          setProgress(p);
        },
        abortSignal: newController.signal,
        services: app.connection?.clients || {},
        dialog,
        navigate,
        location: window.location,
        state: props.state,
      });
      setController(null);
      setProgress(undefined);
      if (props.onDone) {
        props.onDone();
      }
    } catch (e) {
      setProgress(undefined);
      setController(null);
      if (props.onDone) {
        props.onDone();
      }
      toast.error(e.message || "An error occurred while performing the action");
    }
  };

  return {
    progress,
    assign,
  };
};
