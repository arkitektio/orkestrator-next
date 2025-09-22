import { SmartContext } from "@/rekuest/buttons/ObjectButton";
import { BasePanelProps } from "./types";

export const ContextMenuPanel = ({ panel, setOpenPanels }: BasePanelProps) => {
  return (
    <SmartContext
      objects={[{ identifier: panel.identifier, object: panel.object }]}
      onDone={() => setOpenPanels([])}
    />
  );
};
