import React from "react";
import { useHerre } from "./HerreContext";

export const HerreGuard: React.FC<{
  key?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ key, children, fallback }) => {
  const { token } = useHerre();

  if (token) return <>{children}</>;

  return <>{fallback || `No user login`}</>;
};

export const herreGuarded = <T extends {}>(
  Child: React.ComponentType<T>,
  fallback?: React.ReactNode,
) => {
  return (props: any) => (
    <HerreGuard fallback={fallback}>
      <Child {...props} />
    </HerreGuard>
  );
};
