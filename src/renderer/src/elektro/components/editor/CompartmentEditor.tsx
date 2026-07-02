import { Label } from "@/components/ui/label";
import { EditableCompartment } from "../../lib/modelSerialization";
import { IonListEditor } from "./IonListEditor";
import { MechanismPicker } from "./MechanismPicker";
import { SectionParamsEditor } from "./SectionParamsEditor";

/**
 * Edits a single compartment's biophysics — its mechanisms, ions and
 * section parameters. Controlled: every change re-emits the whole compartment.
 */
export const CompartmentEditor = ({
  compartment,
  onChange,
}: {
  compartment: EditableCompartment;
  onChange: (update: Partial<EditableCompartment>) => void;
}) => (
  <div className="flex flex-col gap-4 pt-2 px-1">
    <div className="space-y-1.5">
      <Label className="text-xs">Mechanisms</Label>
      <MechanismPicker
        value={compartment.mechanisms}
        onChange={(mechanisms) => onChange({ mechanisms })}
      />
    </div>
    <div className="space-y-1.5">
      <Label className="text-xs">Ions</Label>
      <IonListEditor
        ions={compartment.ions}
        onChange={(ions) => onChange({ ions })}
      />
    </div>
    <div className="space-y-1.5">
      <Label className="text-xs">Section parameters</Label>
      <SectionParamsEditor
        value={compartment.sectionParams}
        onChange={(sectionParams) => onChange({ sectionParams })}
      />
    </div>
  </div>
);
