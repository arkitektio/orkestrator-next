import {
  ArgChildPortFragment,
  ArgPortFragment,
  ArgPortInput,
  AssignWidgetFragment,
  AssignWidgetInput,
  AssignWidgetKind,
  EffectInput,
  EffectKind,
  PortEffectFragment,
  ReturnChildPortFragment,
  ReturnPortFragment,
  ReturnPortInput,
  ReturnWidgetFragment,
  ReturnWidgetInput,
  ReturnWidgetKind,
  ValidatorFragment,
  ValidatorInput,
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
  ProxyWidget: AssignWidgetKind.Proxy,
  StateChoiceAssignWidget: AssignWidgetKind.StateChoice,
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
  // `filters` on a SearchAssignWidget arrives as read fragments, not inputs; the
  // backend tolerates the same-shaped data the old converter forwarded. Cast to
  // bridge the fragment→input nominal gap.
  const input: AssignWidgetInput = {
    ...rest,
    kind: assignWidgetTypeToKind(widget.__typename),
  } as AssignWidgetInput;
  if (input.choices)
    [
      (input.choices = input.choices.map((c) => ({
        ...c,
        __typename: undefined,
      }))),
    ];

  return input;
};

export const validatorToInput = (widget: ValidatorFragment): ValidatorInput => {
  const { __typename, ...rest } = widget;
  return { ...rest };
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
  if (input.choices)
    [
      (input.choices = input.choices.map((c) => ({
        ...c,
        __typename: undefined,
      }))),
    ];

  return input;
};

// Effect Cleanup

export const effectTypeToKindMap: {
  [K in PortEffectTypeNames]: EffectKind;
} = {
  CustomEffect: EffectKind.Custom,
  MessageEffect: EffectKind.Message,
  HideEffect: EffectKind.Hide,
};

export const effectTypeToKind = (typename: PortEffectTypeNames): EffectKind => {
  return effectTypeToKindMap[typename];
};

export const portEffectToInput = (effect: PortEffectFragment): EffectInput => {
  const { __typename, ...rest } = effect;
  const input: EffectInput = {
    ...rest,
    kind: effectTypeToKind(effect.__typename),
  };
  return input;
};

// Port -> Input. Ports were split into ArgPort (inputs) and ReturnPort (outputs);
// each carries a single `widget` field of a different union, so conversion is
// split per kind rather than handled by one generic function.

export const argCleanChild = (port: ArgChildPortFragment): ArgPortInput => {
  const { __typename, children, widget, ...rest } = port;

  return {
    ...rest,
    children:
      children && children.map((c) => argCleanChild(c as ArgChildPortFragment)),
    widget: widget ? assignWidgetToInput(widget) : undefined,
    choices: rest.choices?.map((c) => ({
      ...c,
      __typename: undefined,
    })),
  };
};

export const argPortToInput = (port: ArgPortFragment): ArgPortInput => {
  const { __typename, children, widget, ...rest } = port;

  return {
    ...rest,
    effects: rest.effects?.map(portEffectToInput),
    children: children && children.map((c) => argCleanChild(c)),
    widget: widget ? assignWidgetToInput(widget) : undefined,
    validators: rest.validators?.map(validatorToInput) || [],
    choices: rest.choices?.map((c) => ({
      ...c,
      __typename: undefined,
    })),
  };
};

export const returnCleanChild = (
  port: ReturnChildPortFragment,
): ReturnPortInput => {
  const { __typename, children, widget, ...rest } = port;

  return {
    ...rest,
    children:
      children &&
      children.map((c) => returnCleanChild(c as ReturnChildPortFragment)),
    widget: widget ? returnWidgetToInput(widget) : undefined,
    choices: rest.choices?.map((c) => ({
      ...c,
      __typename: undefined,
    })),
  };
};

export const returnPortToInput = (
  port: ReturnPortFragment,
): ReturnPortInput => {
  const { __typename, children, widget, ...rest } = port;

  return {
    ...rest,
    effects: rest.effects?.map(portEffectToInput),
    children: children && children.map((c) => returnCleanChild(c)),
    widget: widget ? returnWidgetToInput(widget) : undefined,
    provides: rest.provides?.map(({ __typename, ...p }) => p),
    choices: rest.choices?.map((c) => ({
      ...c,
      __typename: undefined,
    })),
  };
};
