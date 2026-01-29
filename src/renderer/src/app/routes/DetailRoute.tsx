import React from "react";
import { useParams } from "react-router-dom";

export type DetailRoute = {
  fallback: React.ReactNode;
};

export type DetailRouteProps = {
  id: string;
};

export const DetailRoute: React.FC<{}> = () => {
  return (
    <div>
      <h1>DetailRoute</h1>
    </div>
  );
};

export const asDetailRoute = (
  component: React.FC<DetailRouteProps>,
  fallback?: React.ReactNode | undefined,
) => {
  return () => {
    const { id } = useParams<{ id: string }>();

    if (id) {
      return component({ id: id });
    } else {
      if (fallback) {
        return fallback;
      } else {
        return <> This route is illconfigured</>;
      }
    }
  };
};
