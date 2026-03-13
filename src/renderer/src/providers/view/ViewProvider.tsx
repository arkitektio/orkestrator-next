import React, { useCallback, useEffect, useState } from "react";
import { View, ViewContext } from "./ViewContext";

export interface ViewProviderProps {
  children: React.ReactNode;
  initialView?: View;
  persistKey?: string;
}

export const ViewProvider: React.FC<ViewProviderProps> = ({
  initialView = {},
  ...props
}) => {
  const [activeView, setActiveView] = useState<View>(initialView);

  useEffect(() => {
    if (props.persistKey) {
      localStorage.setItem(props.persistKey, JSON.stringify(activeView));
    }
  }, [activeView]);

  useEffect(() => {
    if (props.persistKey) {
      const view = localStorage.getItem(props.persistKey);
      if (view) {
        setActiveView(JSON.parse(view));
      }
    }
  }, [props.persistKey]);

  const extendToInclude = useCallback(
    (view: View) => {
      throw new Error("Not implemented");
    },
    [setActiveView],
  );

  const setWith = useCallback(
    (newView: View) => {
      setActiveView((view) => {
        return { ...view, ...newView };
      });
    },
    [setActiveView],
  );

  return (
    <ViewContext.Provider
      value={{
        activeView,
        setActiveView,
        extendToInclude,
        setWith,
      }}
    >
      {props.children}
    </ViewContext.Provider>
  );
};

export type TwoDViewProviderProps = ViewProviderProps & {
  initialC: number;
  initialT: number;
  initialZ: number;
};

export const TwoDViewProvider: React.FC<TwoDViewProviderProps> = (props) => {
  return (
    <ViewProvider
      initialView={{
        cMin: props.initialC,
        cMax: props.initialC,
        tMin: props.initialT,
        tMax: props.initialT,
        zMin: props.initialZ,
        zMax: props.initialZ,
      }}
      {...props}
    />
  );
};
