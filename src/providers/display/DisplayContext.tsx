import React, { useContext } from "react";

export type DisplayComponentProps = {
  small: boolean;
  object: string;
};

export type DisplayComponent = (props: DisplayComponentProps) => JSX.Element;

export type DisplayContextType = {
  registry: { [key: string]: DisplayComponent | undefined };
  registerDisplay: (identifier: string, node: DisplayComponent) => () => void;
};

export const DisplayContext = React.createContext<DisplayContextType>({
  registry: {},
  registerDisplay: () => () => { },
});

export const useDisplay = () => useContext(DisplayContext);

export const useDisplayComponent = (identifier: string) => {
  const { registry } = useDisplay();

  return registry[identifier];
};
