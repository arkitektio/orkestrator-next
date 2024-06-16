import { HTML5Backend } from "react-dnd-html5-backend";
import { usePreview } from "react-dnd-preview";

import { Card } from "@/components/ui/card";
import { Structure } from "@/types";
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

const MyPreview = () => {
  const preview = usePreview<Structure[]>();
  if (!preview.display) {
    return null;
  }
  const { itemType, item, style } = preview;
  return (
    <Card className="item-list__item" style={style}>
      hallo
    </Card>
  );
};

export type SmartProviderProps = {
  children: React.ReactNode;
};

export const SmartProvider = (props: SmartProviderProps) => {
  return (
    <DndProvider options={HTML5toTouch}>
      <MyPreview />
      {props.children}
    </DndProvider>
  );
};
