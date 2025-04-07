import { createContext, useContext } from "react";

type Value = {
    role: string;
    value: string;
}

export type RoleContextType = {
  values: Value[];
}

const RoleValueContext = createContext<RoleContextType | null>(null);

export const RoleValueProvider = (props : RoleContextType & {children: React.ReactNode}) => {
  const { values } = props;

  return (
    <RoleValueContext.Provider value={{ values }}>
      {props.children}
    </RoleValueContext.Provider>
  );
}

export const useRoleValue = (role: string) => {
  const context = useContext(RoleValueContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context.values.find((v) => v.role === role);
}