import CancelablePromise from "cancelable-promise";
import React, { ComponentType } from "react";
import { Submit } from "./DialogProvider";

export type ConfirmContextType = {
  ask: <T extends {}, P>(
    component: ComponentType<Submit<T> & P>,
    props: Partial<P>,
  ) => CancelablePromise<T>;
  component?: React.ReactNode | undefined;
};

export const DialogContext = React.createContext<ConfirmContextType>({
  ask: null as unknown as ConfirmContextType["ask"],
});
