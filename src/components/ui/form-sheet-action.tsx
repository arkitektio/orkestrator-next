import { Action, useAction } from "@/providers/command/CommandContext";
import React, { useCallback, useState } from "react";
import { FormDialogContext } from "../dialog/FormDialog";
import { Button, ButtonProps } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";

export type FormDialogActionProps = Omit<Action, "run"> &
  ButtonProps & {
    children: React.ReactNode;
    buttonChildren?: React.ReactNode;
    onSubmit?: (v: any) => void;
    onError?: (err: any) => void;
  };

export type Defered = {
  resolve: (any: any) => void;
  reject: (any: any) => void;
};

const createDefered = (): [Promise<any>, Defered] => {
  let resolve: any;
  let reject: any;
  let promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return [promise, { resolve, reject } as Defered];
};

/**
 *  A form dialog action component.
 *
 * @remarks
 * This component creates a button that will cause a dialog to open when clicked.
 * This dialog is wrapped in a form context provider, so that any form components
 * inside the dialog can be used to submit a form.
 *
 * Additionally, the dialog is runnable and registered with the command provider,
 * so that it can be opened by a command.
 *
 * @component
 */
export const FormSheetAction: React.FC<FormDialogActionProps> = ({
  onSubmit,
  onError,
  children,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const [defered, setDefered] = useState<Defered | undefined>(undefined);

  useAction({
    run: async (state) => {
      console.log("run");

      setOpen(true);

      const [promise, defered] = createDefered();
      setDefered(defered);
      try {
        let x = await promise;
        setDefered(undefined);
        return x;
      } catch (e) {
        setDefered(undefined);
        alert(e);
        throw e;
      }
    },
    ...props,
  });

  const bonSubmit = useCallback(
    (v: any) => {
      console.log("submit");
      setOpen(false);
      if (defered) {
        defered.resolve(v);
      }
      onSubmit?.(v);
    },
    [setOpen, onSubmit],
  );

  const bonError = useCallback(
    (e: any) => {
      console.log("error", e);
      setOpen(false);
      if (defered) {
        defered.reject(e);
      }
      onError?.(e);
    },
    [setOpen, onError],
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button {...props}>{props.buttonChildren || props.label}</Button>
      </SheetTrigger>
      <SheetContent className="border-gray-700 text-foreground">
        <FormDialogContext.Provider
          value={{ onSubmit: bonSubmit, onError: bonError }}
        >
          {children}
        </FormDialogContext.Provider>
      </SheetContent>
    </Sheet>
  );
};
