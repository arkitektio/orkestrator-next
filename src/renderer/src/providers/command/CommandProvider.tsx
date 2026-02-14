import React, { useState } from "react";
import { v4 } from "uuid";
import { Action, CommandContext, RegisteredAction } from "./CommandContext";

export interface GenerarMenuProviderProps {
  children: React.ReactNode;
}

export const CommandProvider: React.FC<GenerarMenuProviderProps> = (props) => {
  const [actions, setActions] = useState<RegisteredAction[]>([]);

  const registerAction = (action: Action) => {
    const key = v4();
    setActions((actions) => [{ ...action, key }, ...actions]);

    return () => {
      setActions((actions) => actions.filter((action) => action.key !== key));
    };
  };

  return (
    <CommandContext.Provider
      value={{
        actions,
        registerAction,
      }}
    >
      {props.children}
    </CommandContext.Provider>
  );
};
