import React from "react";
import { useFakts } from "./FaktsContext";

export const FaktsGuard: React.FC<{
  key?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ key, children, fallback }) => {
  const { fakts } = useFakts();

  if (key) {
    if (fakts && fakts[key]) {
      return <>{children}</>;
    } else {
      return <>{fallback || `Did not find fakts for ${key}`}</>;
    }
  }

  if (fakts) return <>{children}</>;

  return <>{fallback || `Did not find fakts!`}</>;
};

export const faktsGuarded = <T extends {}>(
  Child: React.ComponentType<T>,
  fallback?: React.ReactNode,
) => {
  return (props: T) => (
    <FaktsGuard fallback={fallback}>
      <Child {...props} />
    </FaktsGuard>
  );
};
