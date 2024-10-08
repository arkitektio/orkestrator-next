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
  unknownInputWidget?: React.FC<InputWidgetProps>;
  unknownReturnWidget?: React.FC<ReturnWidgetProps>;
  unknownEffectWidget?: React.FC<EffectWidgetProps>;
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
  unknownInputWidget = UnknownInputWidget,
  unknownReturnWidget = UnknownReturnWidget,
  unknownEffectWidget = UnknownEffectWidget,
}) => {
  const [widgetRegistry, setWidgetRegistry] = useState<WidgetRegistryType>(
    () => {
      let x = new WidgetRegistry(
        unknownInputWidget,
        unknownReturnWidget,
        unknownEffectWidget,
      );

      x.registerReturnWidgetFallback(
        PortKind.Structure,
        DelegatingStructureWidget,
      );

      return x;
    },
  );

  return (
    <WidgetRegistryContext.Provider
      value={{
        registry: widgetRegistry,
        setRegistry: setWidgetRegistry,
      }}
    >
      {children}
    </WidgetRegistryContext.Provider>
  );
};
