import React, { useCallback, useState } from "react";
import {
  Action,
  Extension,
  CommandContext,
  Modifier,
  RegisteredAction,
} from "./CommandContext";
import { v4 as uuidv4, v4 } from "uuid";

export interface GenerarMenuProviderProps {
  children: React.ReactNode;
}

export const CommandProvider: React.FC<GenerarMenuProviderProps> = (props) => {
  const [actions, setActions] = useState<RegisteredAction[]>([]);

  const registerAction = (action: Action) => {
    let key = v4();
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
