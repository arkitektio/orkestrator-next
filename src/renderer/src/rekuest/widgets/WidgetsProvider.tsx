import { DelegatingStructureWidget } from "@/components/widgets/returns/DelegatingStructureWidget";
import { useState } from "react";
import { PortKind } from "../api/graphql";
import { WidgetRegistry } from "./Registry";
import { WidgetRegistryContext } from "./WidgetsContext";
import {
  EffectWidgetProps,
  InputWidgetProps,
  ReturnWidgetProps,
  WidgetRegistryType,
} from "./types";

export type WidgetRegistryProviderProps = {
  children: React.ReactNode;
  registry: WidgetRegistryType;
};

export const UnknownInputWidget: React.FC<InputWidgetProps> = ({ port }) => {
  return (
    <div className="text-xl bg-red-200">
      Registry error! No assign Widget registered for: {port.kind} and{" "}
      {port?.assignWidget?.__typename || "unset widget"}
    </div>
  );
};

export const UnknownReturnWidget: React.FC<ReturnWidgetProps> = ({ port }) => {
  return (
    <div className="text-xs bg-red-200">
      {port.kind} and {port?.returnWidget?.__typename || "unset widget"}
    </div>
  );
};

export const UnknownEffectWidget: React.FC<EffectWidgetProps> = ({
  children,
  effect,
}) => {
  return (
    <div className="text-xl bg-red-200">
      Registry error! No effect registered for: {effect.kind}
      {children}
    </div>
  );
};

export const WidgetRegistryProvider: React.FC<WidgetRegistryProviderProps> = ({
  children,
  registry,
}) => {
  const [widgetRegistry, setWidgetRegistry] =
    useState<WidgetRegistryType>(registry);

  return (
    <WidgetRegistryContext.Provider
      value={{
        registry: widgetRegistry,
        setRegistry: (newRegistry: WidgetRegistryType) => {
          alert("This is not implemented yet");
        },
      }}
    >
      {children}
    </WidgetRegistryContext.Provider>
  );
};
