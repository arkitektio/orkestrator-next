import { ReactNode, createContext } from "react";
import { useContext } from "react-resizable-panels/dist/declarations/src/vendor/react";
import { App } from "./types";

export type AppContext = {
  app: App;
};

export const ArkitektContext = createContext<AppContext>({
  app: undefined as unknown as App,
});
export const useArkitekt = () => useContext(ArkitektContext);

export const ArkitektProvider = ({
  children,
  app,
}: {
  children: ReactNode;
  app: App;
}) => {
  return (
    <ArkitektContext.Provider value={{ app: app }}>
      {children}
    </ArkitektContext.Provider>
  );
};
