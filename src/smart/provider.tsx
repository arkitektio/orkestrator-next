import { type } from "os";
import { HTML5Backend } from "react-dnd-html5-backend";

import { DndProvider, MouseTransition } from "react-dnd-multi-backend";

export const HTML5toTouch = {
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
      preview: true,
      transition: MouseTransition,
    },
  ],
};

export type SmartProviderProps = {
  children: React.ReactNode;
};

export const SmartProvider = (props: SmartProviderProps) => {
  return <DndProvider options={HTML5toTouch}>{props.children}</DndProvider>;
};
