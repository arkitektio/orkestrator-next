import React, { useCallback, useRef, useState } from "react";
import { DisplayComponent, DisplayContext } from "./DisplayContext";

export interface DisplayProviderProps {
  children: React.ReactNode;
  registry: { [key: string]: DisplayComponent | undefined };
}

export const DisplayProvider: React.FC<DisplayProviderProps> = (props) => {
  const [registry, setRegistry] = useState<{
    [key: string]: DisplayComponent | undefined;
  }>(props.registry);

  const registerDisplay = (identifier: string, node: DisplayComponent) => {
    setRegistry((registry) => {
      return {
        ...registry,
        [identifier]: node,
      };
    });

    return () => {
      setRegistry((registry) => {
        return {
          ...registry,
          [identifier]: undefined,
        };
      });
    };
  };

  return (
    <DisplayContext.Provider
      value={{
        registry,
        registerDisplay,
      }}
    >
      {props.children}
    </DisplayContext.Provider>
  );
};
