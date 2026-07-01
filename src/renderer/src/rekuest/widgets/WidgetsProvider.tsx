import { AlertCircle } from "lucide-react";
import { useState } from "react";
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
    <div className="flex items-center gap-2 rounded border border-destructive/50 bg-destructive/10 px-3 py-2 text-xs text-destructive">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      No widget registered for {port.kind}
      {port?.widget?.__typename ? ` (${port.widget.__typename})` : ""}
    </div>
  );
};

export const UnknownReturnWidget: React.FC<ReturnWidgetProps> = ({ port }) => {
  return (
    <div className="flex items-center gap-1.5 rounded border border-destructive/50 bg-destructive/10 px-2 py-1 text-xs text-destructive">
      <AlertCircle className="h-3 w-3 shrink-0" />
      No return widget for {port.kind}
      {port?.widget?.__typename ? ` (${port.widget.__typename})` : ""}
    </div>
  );
};

export const UnknownEffectWidget: React.FC<EffectWidgetProps> = ({
  children,
  effect,
}) => {
  return (
    <div className="flex flex-col gap-1 rounded border border-destructive/50 bg-destructive/10 px-3 py-2 text-xs text-destructive">
      <span className="flex items-center gap-2">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        No effect registered for: {effect.kind}
      </span>
      {children}
    </div>
  );
};

export const WidgetRegistryProvider: React.FC<WidgetRegistryProviderProps> = ({
  children,
  registry,
}) => {
  const [widgetRegistry] = useState<WidgetRegistryType>(registry);

  return (
    <WidgetRegistryContext.Provider
      value={{
        registry: widgetRegistry,
        setRegistry: () => {},
      }}
    >
      {children}
    </WidgetRegistryContext.Provider>
  );
};
