import { AddUserToOrganizationDialog } from "@/dialogs/AddUserToOrganization";
import { ChatDialog } from "@/dialogs/ChatDialog";
import { CreateNewMeasurement } from "@/dialogs/CreateNewMeasurement";
import { CreateNewRelation } from "@/dialogs/CreateNewRelation";
import { NotifyDialog } from "@/dialogs/NotifyDialog";
import { RelateStructures } from "@/dialogs/RelateStructures";
import { ReportBugDialog } from "@/dialogs/ReportBugDialog";
import { ReportClientBugDialog } from "@/dialogs/ReportClientBugDialog";
import { SetAsMeasurement } from "@/dialogs/SetAsMeasurement";
import CreateEntityForm from "@/kraph/forms/CreateEntityForm";
import CreateProtocolEventCategoryForm from "@/kraph/forms/CreateProtocolEventCategoryForm";
import CreateProtocolEventFromInsAndOuts from "@/kraph/forms/CreateProtocolEventFromInsAndOuts";
import { createDialogProvider } from "@/lib/generic/providers/DialogProvider";
import { CreateShortcutDialog } from "@/rekuest/components/dialogs/CreateShortcutDialog";
import { ActionAssignForm } from "@/rekuest/forms/ActionAssignForm";
import { ImplementationAssignForm } from "@/rekuest/forms/ImplementationAssignForm";

export const { DialogProvider, useDialog, registry } = createDialogProvider({
  actionassign: ActionAssignForm,
  implementationassign: ImplementationAssignForm,
  relatestructure: RelateStructures,
  createnewrelation: CreateNewRelation,
  createnewmeasurement: CreateNewMeasurement,
  setasmeasurement: SetAsMeasurement,
  createshortcut: CreateShortcutDialog,
  notifyusers: NotifyDialog,
  addusertoorganization: AddUserToOrganizationDialog,
  createprotocoleventcategory: CreateProtocolEventCategoryForm,
  createentity: CreateEntityForm,
  createpprotocoleventfrominsandouts: CreateProtocolEventFromInsAndOuts,
  chat: ChatDialog,
  reportbug: ReportBugDialog,
  reportclientbug: ReportClientBugDialog,
});
