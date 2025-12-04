import { AddUserToOrganizationDialog } from "@/dialogs/AddUserToOrganization";
import { AddPropertyDefinitionDialog } from "@/dialogs/AddPropertyDefinition";
import { CreateEntityWithPropertiesDialog } from "@/dialogs/CreateEntityWithProperties";
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
import UpdateEntityCategoryForm from "@/kraph/forms/UpdateEntityCategoryForm";
import { UseModelForDialog } from "@/alpaka/dialogs/UseModelForDialog";
import { CreateOrganizationForm } from "@/lok-next/dialogs/CreateOrganization";

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
  addpropertydefinition: AddPropertyDefinitionDialog,
  createentitywithproperties: CreateEntityWithPropertiesDialog,
  createprotocoleventcategory: CreateProtocolEventCategoryForm,
  createentity: CreateEntityForm,
  createpprotocoleventfrominsandouts: CreateProtocolEventFromInsAndOuts,
  chat: ChatDialog,
  reportbug: ReportBugDialog,
  reportclientbug: ReportClientBugDialog,
  editentitycategory: UpdateEntityCategoryForm,
  usemodelfor: UseModelForDialog,
  createorganization: CreateOrganizationForm
});
