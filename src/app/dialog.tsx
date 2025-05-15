import { createDialogProvider } from "@/lib/generic/providers/DialogProvider";
import { ActionAssignForm } from "@/rekuest/forms/ActionAssignForm";
import { ImplementationAssignForm } from "@/rekuest/forms/ImplementationAssignForm";

export const { DialogProvider, useDialog } = createDialogProvider({
  actionassign: ActionAssignForm,
  implementationassign: ImplementationAssignForm,
});
