import { ViewFragment } from "@/mikro-next/api/graphql";
import React, { useContext } from "react";

export type View = Omit<ViewFragment, "__typename">;

export type ActiveView = View & {};

// Is a view that is currently active

export type ViewType = ViewFragment & {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  extendToInclude: (view: ActiveView) => void;
  setWith: (view: View) => void;
};

export const ViewContext = React.createContext<ViewType>({
  activeView: {},
  setActiveView: () => { },
  extendToInclude: () => { },
  setWith: () => { },
});

export const useView = () => useContext(ViewContext);

export const nullOrSmaller = (
  a: number | undefined | null,
  b: number | undefined | null,
) => {
  if (a == undefined || a == null) {
    return true;
  }
  if (b == undefined || b == null) {
    return true;
  }
  console.log("is_smaller", a, b);
  return a <= b;
};

export const nullOrBigger = (
  a: number | undefined | null,
  b: number | undefined | null,
) => {
  if (a == undefined || a == null) {
    return true;
  }
  if (b == undefined || b == null) {
    return true;
  }
  console.log("is_bigger", a, b);
  return a >= b;
};

export const viewIncludesView = (
  viewToCheck: ActiveView,
  activeView: ActiveView,
) => {
  let result =
    nullOrBigger(viewToCheck.cMax, activeView.cMin) &&
    nullOrSmaller(viewToCheck.cMin, activeView.cMax) &&
    nullOrBigger(viewToCheck.tMax, activeView.tMin) &&
    nullOrSmaller(viewToCheck.tMin, activeView.tMax) &&
    nullOrBigger(viewToCheck.zMax, activeView.zMin) &&
    nullOrSmaller(viewToCheck.zMin, activeView.zMax);
  console.log(activeView, viewToCheck, result);
  return result;
};

export const useMatchedView = (view: View) => {
  const { activeView, setWith, setActiveView } = useView();

  if (viewIncludesView(view, activeView)) {
    return {
      active: true,
      setWithMe: () => {
        setWith(view);
      },
      justMe: () => {
        setActiveView(view);
      },
    };
  }
  return {
    active: false,
    setWithMe: () => {
      setWith(view);
    },
    justMe: () => {
      setActiveView(view);
    },
  };
};
