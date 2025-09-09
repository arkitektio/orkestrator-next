import React, { useContext, useEffect } from "react";

export type Action = {
  extension?: string;
  description?: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  run: (x?: CommandState) => Promise<SetCommandState>;
};

export type RegisteredAction = Action & {
  key: string;
};

export type CommandState = {
  modifiers: Modifier[];
  open: boolean;
  query: string;
};

export type SetCommandState = {
  modifiers?: Modifier[];
  open?: boolean;
  query?: string;
} | void;

export type Modifier<T extends { [key: string]: any } = {}> = {
  key: string;
  label: string;
  params?: T;
};

export type FilterParams = {
  query: string;
  activeModifiers: Modifier[];
};

export type ModifyingAction<T> = Action & {
  handler: "modify";
  params: T;
};

export type Extension = {
  key: string;
  label: string;
  filter: (options: CommandState) => Promise<Action[] | []>;
  do: (action: Action) => Promise<SetCommandState>;
};
export type GeneralMenuContextType = {
  actions: RegisteredAction[];
  registerAction: (action: Action) => () => void;
};

export const CommandContext = React.createContext<GeneralMenuContextType>({
  actions: [],
  registerAction: () => () => { },
});

export const useCommand = () => useContext(CommandContext);

export const useAction = (action: Action) => {
  const { registerAction } = useCommand();

  useEffect(() => {
    return registerAction(action);
  }, []);
};
