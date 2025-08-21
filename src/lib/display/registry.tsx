import { Identifier } from "@/types";
import React, { createContext, useContext } from "react";

export type DisplayWidgetProps = {
  identifier: Identifier;
  object: string;
  small?: boolean; // Optional prop for small display
};

export type HookWidget = (props: { value: string }) => React.ReactNode;

// --- Factory Function Following Dialog Provider Pattern ---
export function createDisplayProvider<
  TRegistry extends Record<string, React.ComponentType<DisplayWidgetProps>>,
>(registry: TRegistry) {
  type DisplayId = keyof TRegistry;

  const DisplayContext = createContext<{
    registry: TRegistry;
  }>({
    registry,
  });

  const useDisplay = () => useContext(DisplayContext);

  const useDisplayComponent = (identifier: DisplayId) => {
    const { registry } = useDisplay();
    return (
      registry[identifier] ||
      (() => <div>Display not found for {identifier}</div>)
    );
  };

  const DisplayProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    return (
      <DisplayContext.Provider value={{ registry: registry }}>
        {children}
      </DisplayContext.Provider>
    );
  };

  return {
    DisplayProvider,
    useDisplay,
    useDisplayComponent,
  };
}
