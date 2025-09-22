import React, { useContext } from "react";
import { WidgetRegistryType } from "./types";
import { THE_WIDGET_REGISTRY } from "@/app/shadCnWidgetRegistry";

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
    registry: null,
    setRegistry: () => {
      throw new Error(
        "Set registry is not implemented. Do you have a Registry provider?",
      );
    },
  });

export const useWidgetRegistry = () => {
  const { registry, setRegistry } = useContext(WidgetRegistryContext);
  if (!registry) {
    throw new Error(
      "WidgetRegistryContext is not set. Did you forget to wrap your component in a WidgetRegistryProvider?",
    );
  }

  return {
    registry,
    setRegistry,
  };
};
