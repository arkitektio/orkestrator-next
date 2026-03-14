import {
	ObjectButton as SmartObjectButton,
	SmartContext as SmartContextComponent,
} from "@/providers/smart/extensions/context";
import {
	Actions as LocalActions,
	ApplicableLocalActions as LocalApplicableActions,
	LocalActionCommand as LocalActionCommandComponent,
} from "@/providers/smart/extensions/local/localactions";
import {
	ApplicableMeasurements as KraphApplicableMeasurements,
	ApplicableRelations as KraphApplicableRelations,
	CreateMeasurementButton as KraphCreateMeasurementButton,
	EntityRelateButton as KraphEntityRelateButton,
	EntityRelationActions as KraphEntityRelationActions,
	MeasurementActions as KraphMeasurementActions,
	StructureRelateButton as KraphStructureRelateButton,
	StructureRelationActions as KraphStructureRelationActions,
} from "@/providers/smart/extensions/kraph/relations";
import {
	ApplicableActions as RekuestApplicableActions,
	ApplicableBatchActions as RekuestApplicableBatchActions,
	AssignButton as RekuestAssignButton,
	BatchAssignButton as RekuestBatchAssignButton,
	DirectImplementationAssignment as RekuestDirectImplementationAssignment,
} from "@/providers/smart/extensions/rekuest/actions";
import {
	ApplicableShortcuts as RekuestApplicableShortcuts,
	ShortcutButton as RekuestShortcutButton,
} from "@/providers/smart/extensions/rekuest/shortcuts";
import {
	ApplicableDefinitions as KabinetApplicableDefinitions,
	InstallButton as KabinetInstallButton,
} from "@/providers/smart/extensions/kabinet/definitions";
import type {
	ObjectButtonProps as SmartObjectButtonProps,
	OnDone as SmartOnDone,
	OnError as SmartOnError,
	PassDownProps as SmartPassDownProps,
	SmartContextProps as SmartContextPropsType,
} from "./types";

export const ObjectButton = SmartObjectButton;
export const SmartContext = SmartContextComponent;
export const Actions = LocalActions;
export const ApplicableLocalActions = LocalApplicableActions;
export const LocalActionCommand = LocalActionCommandComponent;
export const ApplicableMeasurements = KraphApplicableMeasurements;
export const ApplicableRelations = KraphApplicableRelations;
export const CreateMeasurementButton = KraphCreateMeasurementButton;
export const EntityRelateButton = KraphEntityRelateButton;
export const EntityRelationActions = KraphEntityRelationActions;
export const MeasurementActions = KraphMeasurementActions;
export const StructureRelateButton = KraphStructureRelateButton;
export const StructureRelationActions = KraphStructureRelationActions;
export const ApplicableActions = RekuestApplicableActions;
export const ApplicableBatchActions = RekuestApplicableBatchActions;
export const AssignButton = RekuestAssignButton;
export const BatchAssignButton = RekuestBatchAssignButton;
export const DirectImplementationAssignment = RekuestDirectImplementationAssignment;
export const ApplicableShortcuts = RekuestApplicableShortcuts;
export const ShortcutButton = RekuestShortcutButton;
export const ApplicableDefinitions = KabinetApplicableDefinitions;
export const InstallButton = KabinetInstallButton;

export type ObjectButtonProps = SmartObjectButtonProps;
export type OnDone = SmartOnDone;
export type OnError = SmartOnError;
export type PassDownProps = SmartPassDownProps;
export type SmartContextProps = SmartContextPropsType;
