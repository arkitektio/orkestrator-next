// typed-dialog-provider.tsx

import React, { createContext, useContext, useCallback, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Guard } from "@/lib/arkitekt/Arkitekt";

// --- 1. Utility Type ---
type ExtractProps<T> =
  T extends React.ComponentType<infer P> ? Omit<P, "onClose"> : never;

// --- 2. Factory Function ---

export function createDialogProvider<
  Components extends Record<string, React.ComponentType<any>>,
>(registry: Components) {
  type DialogId = keyof Components;
  type DialogPropsMap = {
    [K in keyof Components]: ExtractProps<Components[K]>;
  };

  const DialogContext = createContext<{
    openDialog: <K extends DialogId>(id: K, props: DialogPropsMap[K]) => void;
    closeDialog: () => void;
  }>({
    openDialog: () => {},
    closeDialog: () => {},
  });

  const useDialog = () => useContext(DialogContext);

  const DialogProvider = ({ children }: { children: React.ReactNode }) => {
    const [dialogState, setDialogState] = useState<{
      id: DialogId | null;
      props: Record<string, any>;
    }>({ id: null, props: {} });

    const openDialog = useCallback(
      <K extends DialogId>(id: K, props: DialogPropsMap[K]) => {
        setDialogState({ id, props });
      },
      [],
    );

    const closeDialog = useCallback(() => {
      setDialogState({ id: null, props: {} });
    }, []);

    const DialogComponent = dialogState.id ? registry[dialogState.id] : null;

    return (
      <DialogContext.Provider value={{ openDialog, closeDialog }}>
        <Dialog
          open={!!DialogComponent}
          onOpenChange={closeDialog}
          modal={true}
        >
          {children}
          {DialogComponent && (
            <DialogContent>
              <Guard.Rekuest>
                <DialogComponent {...dialogState.props} />
              </Guard.Rekuest>
            </DialogContent>
          )}
        </Dialog>
      </DialogContext.Provider>
    );
  };

  return {
    DialogProvider,
    useDialog,
  };
}
