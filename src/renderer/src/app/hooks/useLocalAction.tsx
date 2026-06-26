import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useConnection } from "@/lib/arkitekt/provider";
import { Action, ActionState } from "@/lib/localactions/LocalActionProvider";
import type { ServiceMap } from "@/lib/arkitekt/provider";
import type { OnDone } from "@/providers/smart/extensions/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDialog } from "../dialog";

type LocalActionConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type ModifierState = {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
};

export const usePerformAction = (props: {
  action: Action;
  state: ActionState;
  onDone?: OnDone;
}) => {
  const [progress, setProgress] = useState<number | undefined>(0);
  const [controller, setController] = useState<AbortController | null>(null);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    options: LocalActionConfirmOptions;
    resolver: ((confirmed: boolean) => void) | null;
  } | null>(null);
  const connection = useConnection();
  const dialog = useDialog();
  const navigate = useNavigate();
  const modifierStateRef = useRef<ModifierState>({
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
  });

  useEffect(() => {
    const updateModifierState = (event: KeyboardEvent | MouseEvent) => {
      modifierStateRef.current = {
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
      };
    };

    const resetModifierState = () => {
      modifierStateRef.current = {
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      };
    };

    window.addEventListener("keydown", updateModifierState);
    window.addEventListener("keyup", updateModifierState);
    window.addEventListener("mousedown", updateModifierState);
    window.addEventListener("mouseup", updateModifierState);
    window.addEventListener("blur", resetModifierState);

    return () => {
      window.removeEventListener("keydown", updateModifierState);
      window.removeEventListener("keyup", updateModifierState);
      window.removeEventListener("mousedown", updateModifierState);
      window.removeEventListener("mouseup", updateModifierState);
      window.removeEventListener("blur", resetModifierState);
    };
  }, []);

  const confirm = useCallback((options: LocalActionConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({
        open: true,
        options,
        resolver: resolve,
      });
    });
  }, []);

  const closeConfirm = useCallback((confirmed: boolean) => {
    setConfirmState((current) => {
      current?.resolver?.(confirmed);
      return current ? { ...current, open: false, resolver: null } : null;
    });
  }, []);

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
        services: (connection?.serviceMap || {}) as ServiceMap,
        dialog,
        navigate,
        modifiers: modifierStateRef.current,
        confirm,
        location: window.location,
        state: props.state,
      });
      setController(null);
      setProgress(undefined);
      if (props.onDone) {
        props.onDone({ kind: "local" });
      }
    } catch (e) {
      setProgress(undefined);
      setController(null);
      if (props.onDone) {
        props.onDone({ kind: "local" });
      }
      toast.error(
        e instanceof Error
          ? e.message
          : "An error occurred while performing the action",
      );
    }
  };

  return {
    progress,
    assign,
    confirmationDialog: confirmState ? (
      <AlertDialog
        open={confirmState.open}
        onOpenChange={(open) => {
          if (!open) {
            closeConfirm(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmState.options.title}</AlertDialogTitle>
            {confirmState.options.description ? (
              <AlertDialogDescription>
                {confirmState.options.description}
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {confirmState.options.cancelLabel ?? "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              variant={confirmState.options.destructive ? "destructive" : "default"}
              onClick={() => closeConfirm(true)}
            >
              {confirmState.options.confirmLabel ?? "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ) : null,
  };
};
