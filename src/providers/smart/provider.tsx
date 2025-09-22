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
      preview: false,
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
    <Card className="z-100" style={style}>
      hallo
    </Card>
  );
};

export type SmartProviderProps = {
  children: React.ReactNode;
};

export const SmartProvider = (props: SmartProviderProps) => {
  return <DndProvider options={HTML5toTouch}>{props.children}</DndProvider>;
};
