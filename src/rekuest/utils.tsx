import {
  AssignWidgetFragment,
  AssignWidgetKind,
  ChildPortFragment,
  ChildPortInput,
  PortFragment,
  AssignWidgetInput,
  ReturnWidgetInput,
  PortInput,
  ReturnWidgetFragment,
  ReturnWidgetKind,
  EffectInput,
  PortEffectFragment,
  EffectKind,
} from "./api/graphql";

export type AssignWidgetTypeNames = AssignWidgetFragment["__typename"];
export type ReturnWidgetTypeNames = ReturnWidgetFragment["__typename"];
export type PortEffectTypeNames = PortEffectFragment["__typename"];

// Assign Cleanup
export const assignWidgetTypeToKindMap: {
  [K in AssignWidgetTypeNames]: AssignWidgetKind;
} = {
  ChoiceAssignWidget: AssignWidgetKind.Choice,
  SearchAssignWidget: AssignWidgetKind.Search,
  SliderAssignWidget: AssignWidgetKind.Slider,
  CustomAssignWidget: AssignWidgetKind.Custom,
  StringAssignWidget: AssignWidgetKind.String,
};

export const assignWidgetTypeToKind = (
  typename: AssignWidgetTypeNames,
): AssignWidgetKind => {
  return assignWidgetTypeToKindMap[typename];
};
export const assignWidgetToInput = (
  widget: AssignWidgetFragment,
): AssignWidgetInput => {
  const { __typename, ...rest } = widget;
  const input: AssignWidgetInput = {
    ...rest,
    kind: assignWidgetTypeToKind(widget.__typename),
  };
  return input;
};

// Return Cleanup

export const returnWidgetTypeToKindMap: {
  [K in ReturnWidgetTypeNames]: ReturnWidgetKind;
} = {
  ChoiceReturnWidget: ReturnWidgetKind.Choice,
  CustomReturnWidget: ReturnWidgetKind.Custom,
};

export const returnWidgetTypeToKind = (
  typename: ReturnWidgetTypeNames,
): ReturnWidgetKind => {
  return returnWidgetTypeToKindMap[typename];
};

export const returnWidgetToInput = (
  widget: ReturnWidgetFragment,
): ReturnWidgetInput => {
  const { __typename, ...rest } = widget;
  const input: ReturnWidgetInput = {
    ...rest,
    kind: returnWidgetTypeToKind(widget.__typename),
  };
  return input;
};

// Effect Cleanup

export const effectTypeToKindMap: {
  [K in PortEffectTypeNames]: EffectKind;
} = {
  CustomEffect: EffectKind.Custom,
  MessageEffect: EffectKind.Message,
};

export const effectTypeToKind = (typename: PortEffectTypeNames): EffectKind => {
  return effectTypeToKindMap[typename];
};

export const portEffectToInput = (widget: PortEffectFragment): EffectInput => {
  const { __typename, dependencies, ...rest } = widget;
  const input: EffectInput = {
    ...rest,
    dependencies: dependencies?.map(({ __typename, ...d }) => d) || [],
    kind: effectTypeToKind(widget.__typename),
  };
  return input;
};

//

export const cleanChild = (port: ChildPortFragment): ChildPortInput => {
  const { __typename, child, variants, assignWidget, returnWidget, ...rest } =
    port;

  const input: ChildPortInput = {
    ...rest,
    variants:
      variants && variants.map((c) => cleanChild(c as ChildPortFragment)),
    child: cleanChild(child as ChildPortFragment),
    assignWidget: assignWidget && assignWidgetToInput(assignWidget),
    returnWidget: returnWidget && returnWidgetToInput(returnWidget),
  };

  return input;
};

export const convertPortToInput = (port: PortFragment): PortInput => {
  const { __typename, child, variants, assignWidget, returnWidget, ...rest } =
    port;

  const input: PortInput = {
    ...rest,
    effects: rest.effects?.map(portEffectToInput),
    child: child && cleanChild(child),
    assignWidget: assignWidget && assignWidgetToInput(assignWidget),
    returnWidget: returnWidget && returnWidgetToInput(returnWidget),
  };
  return input;
};
