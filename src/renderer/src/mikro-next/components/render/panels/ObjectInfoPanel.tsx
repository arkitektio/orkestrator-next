import { Button } from "@/components/ui/button";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";
import { BasePanelProps } from "./types";

export const ObjectInfoPanel = ({ panel, setOpenPanels }: BasePanelProps) => {
  return (
    <>
      <ObjectButton
        objects={[{ identifier: panel.identifier, object: panel.object }]}
        onDone={() => setOpenPanels([])}
      >
        <Button variant={"outline"} className="w-6 h-9 text-white">
          Do
        </Button>
      </ObjectButton>

    </>
  );
};
