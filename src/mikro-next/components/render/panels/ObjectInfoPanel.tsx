import { Button } from "@/components/ui/button";
import { TinyStructureBox } from "@/kraph/boxes/TinyStructureBox";
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

      <div className="text-xs text-gray-500"> Knowledge </div>
      <TinyStructureBox identifier={panel.identifier} object={panel.object} />
    </>
  );
};
