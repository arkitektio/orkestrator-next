import React, { useContext } from "react";


export type DebugContextType = {
  debug: boolean;
  setDebug: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DebugContext = React.createContext<DebugContextType>({
  debug: false,
  setDebug: () => { },
});

export const useDebug = () => useContext(DebugContext);
