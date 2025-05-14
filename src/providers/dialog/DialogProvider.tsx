import { Dialog, DialogContent } from "@/components/ui/dialog";
import CancelablePromise from "cancelable-promise";
import React, { ComponentType, useRef } from "react";
import { DialogContext } from "./DialogContext";
import { Guard } from "@/arkitekt/Arkitekt";

export type Submit<T extends {} | undefined = undefined> = {
  submit: (endState: T) => void;
  buttonref: React.RefObject<HTMLButtonElement>;
  reject: (reason?: any) => void;
};

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [Component, setComponent] = React.useState<
    React.ReactNode | undefined
  >();
  const focusRef = useRef<HTMLButtonElement>(null);

  const ask = <T extends {}, P>(
    Component: ComponentType<Submit<T> & P>,
    props: P,
  ): CancelablePromise<T> => {
    const p = new CancelablePromise<T>((resolve, rejects, onCancel) => {
      const submit = (endState: T) => {
        setComponent(undefined);
        resolve(endState);
      };

      const reject = (reason?: any) => {
        setComponent(undefined);
        rejects(reason);
      };

      const onCancelHandler = () => {
        setComponent(undefined);
      };
      onCancel(onCancelHandler);

      setComponent(
        <Dialog
          open={Component != undefined}
          onOpenChange={() => {
            setComponent(undefined), reject("User canceled");
          }}
        >
          <DialogContent>
            <Guard.Rekuest>
              <Component
                {...props}
                submit={submit}
                reject={reject}
                buttonref={focusRef}
              />
            </Guard.Rekuest>
          </DialogContent>
        </Dialog>,
      );
    });
    return p;
  };

  return (
    <DialogContext.Provider value={{ ask, component: Component }}>
      {children}
    </DialogContext.Provider>
  );
};
