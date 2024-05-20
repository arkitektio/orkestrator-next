import React, { useContext } from "react";
import { WidgetRegistry } from "./Registry";
import { WidgetRegistryType } from "./types";

export type Ward = (...args: any[]) => Promise<any | undefined>;

const fakeWidgetRegistry: WidgetRegistryType = {
  registerWard: () => {
    throw new Error("No registry set");
  },
  registerInputWidget: () => {
    throw new Error("No registry set");
  },
  registerInputWidgetFallback: () => {
    throw new Error("No registry set");
  },
  registerReturnWidget: () => {
    throw new Error("No registry set");
  },
  getEffectWidget: () => {
    throw new Error("No registry set");
  },
  registerEffectWidget: () => {
    throw new Error("No registry set");
  },
  registerReturnWidgetFallback: () => {
    throw new Error("No registry set");
  },
  getReturnWidgetForPort: () => {
    throw new Error("No registry set");
  },
  getInputWidgetForPort: () => {
    throw new Error("No registry set");
  },
  getWard: () => {
    throw new Error("No registry set");
  },
};
export type WidgetRegistryContextType = {
  registry: WidgetRegistryType;
  setRegistry: (postman: WidgetRegistryType) => void;
};

export const WidgetRegistryContext =
  React.createContext<WidgetRegistryContextType>({
    registry: fakeWidgetRegistry,
    setRegistry: (postman: WidgetRegistryType) => {
      throw new Error(
        "Set registry is not implemented. Do you have a Registry provider?"
      );
    },
  });

export const useWidgetRegistry = () => useContext(WidgetRegistryContext);
