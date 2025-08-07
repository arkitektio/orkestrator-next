import { CreateNewMeasurement } from "@/dialogs/CreateNewMeasurement";
import { CreateNewRelation } from "@/dialogs/CreateNewRelation";
import { RelateStructures } from "@/dialogs/RelateStructures";
import { SetAsMeasurement } from "@/dialogs/SetAsMeasurement";
import { createDialogProvider } from "@/lib/generic/providers/DialogProvider";
import { CreateShortcutDialog } from "@/rekuest/components/dialogs/CreateShortcutDialog";
import { ActionAssignForm } from "@/rekuest/forms/ActionAssignForm";
import { ImplementationAssignForm } from "@/rekuest/forms/ImplementationAssignForm";
import { ReserveForm } from "@/rekuest/forms/ShortcutForm";
import { ShortcutForm } from "@/rekuest/pages/Shortcut";

export const { DialogProvider, useDialog } = createDialogProvider({
  actionassign: ActionAssignForm,
  implementationassign: ImplementationAssignForm,
  relatestructure: RelateStructures,
  createnewrelation: CreateNewRelation,
  createnewmeasurement: CreateNewMeasurement,
  setasmeasurement: SetAsMeasurement,
  createshortcut: CreateShortcutDialog,
});
