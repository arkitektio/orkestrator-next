import { createContext, useContext } from "react";

type Option = {
    label: string;
    value: string;
}

export type RoleContextType = {
  roles: Option[];
}

const RoleContext = createContext<RoleContextType | null>(null);

export const RoleProvider = (props : RoleContextType & {children: React.ReactNode}) => {
  const { roles } = props;

  return (
    <RoleContext.Provider value={{ roles }}>
      {props.children}
    </RoleContext.Provider>
  );
}

export const useRoles = () => {
  const context = useContext(RoleContext);
  if (context === null) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
}