// typed-dialog-provider.tsx

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Guard } from "@/lib/arkitekt/Arkitekt";
import { cn } from "@/lib/utils";
import React, { createContext, useCallback, useContext, useState } from "react";

/**
 * Enhanced Dialog Provider with Sheet Support
 *
 * Usage Examples:
 *
 * 1. Basic Dialog:
 * const { openDialog } = useDialog();
 * openDialog("mydialog", { prop1: "value" });
 *
 * 2. Dialog with custom className:
 * openDialog("mydialog", { prop1: "value" }, {
 *   className: "max-w-4xl"
 * });
 *
 * 3. Basic Sheet (right side, default):
 * const { openSheet } = useDialog();
 * openSheet("mysheet", { prop1: "value" });
 *
 * 4. Sheet with custom width:
 * openSheet("mysheet", { prop1: "value" }, {
 *   className: "!w-[600px] !max-w-none"
 * });
 *
 * 5. Sheet from different side:
 * openSheet("mysheet", { prop1: "value" }, {
 *   side: "left",
 *   className: "!w-96"
 * });
 *
 * 6. Full-width bottom sheet:
 * openSheet("mysheet", { prop1: "value" }, {
 *   side: "bottom",
 *   className: "!h-[80vh]"
 * });
 */

// --- 1. Utility Types ---
type ExtractProps<T> =
  T extends React.ComponentType<infer P> ? Omit<P, "onClose"> : never;

// Dialog/Sheet state type
type ModalState = {
  id: string | null;
  props: Record<string, unknown>;
  type: "dialog" | "sheet";
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
};

// --- 2. Factory Function ---

export function createDialogProvider<
  Components extends Record<string, React.ComponentType<unknown>>,
>(registry: Components) {
  type DialogId = keyof Components;
  type DialogPropsMap = {
    [K in keyof Components]: ExtractProps<Components[K]>;
  };

  const DialogContext = createContext<{
    openDialog: <K extends DialogId>(
      id: K,
      props: DialogPropsMap[K],
      options?: { className?: string },
    ) => void;
    openSheet: <K extends DialogId>(
      id: K,
      props: DialogPropsMap[K],
      options?: {
        className?: string;
        side?: "top" | "bottom" | "left" | "right";
      },
    ) => void;
    closeDialog: () => void;
  }>({
    openDialog: () => {},
    openSheet: () => {},
    closeDialog: () => {},
  });

  const useDialog = () => useContext(DialogContext);

  const DialogProvider = ({ children }: { children: React.ReactNode }) => {
    const [modalState, setModalState] = useState<ModalState>({
      id: null,
      props: {},
      type: "dialog",
    });

    const openDialog = useCallback(
      <K extends DialogId>(
        id: K,
        props: DialogPropsMap[K],
        options?: { className?: string },
      ) => {
        setModalState({
          id: id as string,
          props,
          type: "dialog",
          className: options?.className,
        });
      },
      [],
    );

    const openSheet = useCallback(
      <K extends DialogId>(
        id: K,
        props: DialogPropsMap[K],
        options?: {
          className?: string;
          side?: "top" | "bottom" | "left" | "right";
        },
      ) => {
        setModalState({
          id: id as string,
          props,
          type: "sheet",
          className: options?.className,
          side: options?.side || "right",
        });
      },
      [],
    );

    const closeDialog = useCallback(() => {
      setModalState({ id: null, props: {}, type: "dialog" });
    }, []);

    const Component = modalState.id ? registry[modalState.id] : null;

    return (
      <DialogContext.Provider value={{ openDialog, openSheet, closeDialog }}>
        <Dialog
          open={!!Component && modalState.type === "dialog"}
          onOpenChange={closeDialog}
          modal={true}
        >
          {Component && (
            <DialogContent className={modalState.className}>
              <Guard.Rekuest>
                <Component {...modalState.props} />
              </Guard.Rekuest>
            </DialogContent>
          )}
        </Dialog>

        <Sheet
          open={!!Component && modalState.type === "sheet"}
          onOpenChange={closeDialog}
        >
          {Component && (
            <SheetContent
              side={modalState.side}
              className={cn(
                "text-foreground",
                // Reset default width/height classes when custom dimensions are provided
                modalState.className &&
                  (modalState.className.includes("w-") ||
                    modalState.className.includes("!w-") ||
                    modalState.className.includes("max-w-")) &&
                  "!w-auto !max-w-none",
                modalState.className &&
                  (modalState.className.includes("h-") ||
                    modalState.className.includes("!h-") ||
                    modalState.className.includes("max-h-")) &&
                  "!h-auto !max-h-none",
                modalState.className,
              )}
            >
              <Guard.Rekuest>
                <Component {...modalState.props} />
              </Guard.Rekuest>
            </SheetContent>
          )}
        </Sheet>

        {!Component && children}
      </DialogContext.Provider>
    );
  };

  return {
    DialogProvider,
    useDialog,
  };
}
