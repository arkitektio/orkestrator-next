import { UseModelForDialog } from "@/alpaka/dialogs/UseModelForDialog";
import { AddPropertyDefinitionDialog } from "@/dialogs/AddPropertyDefinition";
import { AddUserToOrganizationDialog } from "@/dialogs/AddUserToOrganization";
import { ChatDialog } from "@/dialogs/ChatDialog";
import { CreateEntityWithPropertiesDialog } from "@/dialogs/CreateEntityWithProperties";
import { CreateNewMeasurement } from "@/dialogs/CreateNewMeasurement";
import { CreateNewRelation } from "@/dialogs/CreateNewRelation";
import { NotifyDialog } from "@/dialogs/NotifyDialog";
import { RelateStructures } from "@/dialogs/RelateStructures";
import { ReportBugDialog } from "@/dialogs/ReportBugDialog";
import { ReportClientBugDialog } from "@/dialogs/ReportClientBugDialog";
import { SetAsMeasurement } from "@/dialogs/SetAsMeasurement";
import CreateEntityCategoryForm from "@/kraph/forms/CreateEntityCategoryForm";
import CreateEntityForm from "@/kraph/forms/CreateEntityForm";
import CreateProtocolEventCategoryForm from "@/kraph/forms/CreateProtocolEventCategoryForm";
import UpdateEntityCategoryForm from "@/kraph/forms/UpdateEntityCategoryForm";
import { createDialogProvider } from "@/lib/generic/providers/DialogProvider";
import { CreateOrganizationForm } from "@/lok-next/dialogs/CreateOrganization";
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
  addpropertydefinition: AddPropertyDefinitionDialog,
  createentitywithproperties: CreateEntityWithPropertiesDialog,
  createentitycategory: CreateEntityCategoryForm,
  createprotocoleventcategory: CreateProtocolEventCategoryForm,
  createentity: CreateEntityForm,
  chat: ChatDialog,
  reportbug: ReportBugDialog,
  reportclientbug: ReportClientBugDialog,
  editentitycategory: UpdateEntityCategoryForm,
  usemodelfor: UseModelForDialog,
  createorganization: CreateOrganizationForm
});
