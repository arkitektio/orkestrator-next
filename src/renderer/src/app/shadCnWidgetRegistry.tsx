import { ChoicesWidget } from "@/components/widgets/custom/ChoicesWidget";
import { SearchWidget } from "@/components/widgets/custom/SearchWidget";
import { SliderWidget } from "@/components/widgets/custom/SliderWidget";
import { StateChoiceWidget } from "@/components/widgets/custom/StateChoiceWidget";
import { HideEffect } from "@/components/widgets/effects/HideEffect";
import { BoolWidget } from "@/components/widgets/fallbacks/BoolWidget";
import { DateWidget } from "@/components/widgets/fallbacks/DateWidget";
import { DictWidget } from "@/components/widgets/fallbacks/DictWidget";
import { EnumWidget } from "@/components/widgets/fallbacks/EnumWidget";
import { FloatWidget } from "@/components/widgets/fallbacks/FloatWidget";
import { IntWidget } from "@/components/widgets/fallbacks/IntWidget";
import { ListWidget } from "@/components/widgets/fallbacks/ListWidget";
import { MemoryStructureWidget } from "@/components/widgets/fallbacks/MemoryStructureWidget";
import { ModelWidget } from "@/components/widgets/fallbacks/ModelWidget";
import { StringWidget } from "@/components/widgets/fallbacks/StringWidget";
import { StructureWidget } from "@/components/widgets/fallbacks/StructureWidget";
import { UnionWidget } from "@/components/widgets/fallbacks/UnionWidget";
import { DelegatingStructureWidget } from "@/components/widgets/returns/DelegatingStructureWidget";
import { BoolReturnWidget } from "@/components/widgets/returns/fallbacks/BoolReturnWidget";
import { DateReturnWidget } from "@/components/widgets/returns/fallbacks/DateReturnWidget";
import { EnumReturnWidget } from "@/components/widgets/returns/fallbacks/EnumReturnWidget";
import { FloatReturnWidget } from "@/components/widgets/returns/fallbacks/FloatReturnWidget";
import { IntReturnWidget } from "@/components/widgets/returns/fallbacks/IntReturnWidget";
import { ListReturnWidget } from "@/components/widgets/returns/fallbacks/ListReturnWidget";
import { ModelReturnWidget } from "@/components/widgets/returns/fallbacks/ModelReturnWidget";
import { StringReturnWidget } from "@/components/widgets/returns/fallbacks/StringReturnWidget";
import { UnionReturnWidget } from "@/components/widgets/returns/fallbacks/UnionReturnWidget";
import { PortFragment, PortKind } from "@/rekuest/api/graphql";
import { WidgetRegistry } from "@/rekuest/widgets/Registry";
import {
  EffectWidgetProps,
  InputWidgetProps,
  ReturnWidgetProps,
} from "@/rekuest/widgets/types";

export const UnknownInputWidget = ({ port }: InputWidgetProps) => {
  return (
    <div className="text-xl bg-red-200">
      Registry error! No assign Widget registered for: {port.kind} and{" "}
      {port?.assignWidget?.__typename || "unset widget"}
    </div>
  );
};

export const UnknownReturnWidget = ({ port }: ReturnWidgetProps) => {
  return (
    <div className="text-xl bg-red-200">
      Registry error! No assign Widget registered for: {port.kind} and{" "}
      {port?.returnWidget?.__typename || "unset widget"}
      {JSON.stringify(port)}
    </div>
  );
};

export const UnknownEffectWidget = ({
  children,
  effect,
}: EffectWidgetProps) => {
  return (
    <div className="text-xl bg-red-200">
      Registry error! No effect registered for: {effect.kind}
      {children}
    </div>
  );
};

const registry = new WidgetRegistry(
  UnknownInputWidget,
  UnknownReturnWidget,
  UnknownEffectWidget,
);

registry.registerReturnWidgetFallback(
  PortKind.Structure,
  DelegatingStructureWidget,
);

const int = registry.registerInputWidgetFallback(PortKind.Int, IntWidget);
const list = registry.registerInputWidgetFallback(PortKind.List, ListWidget);
const bool = registry.registerInputWidgetFallback(PortKind.Bool, BoolWidget);
const date = registry.registerInputWidgetFallback(PortKind.Date, DateWidget);
const enumwi = registry.registerInputWidgetFallback(PortKind.Enum, EnumWidget);
const union = registry.registerInputWidgetFallback(PortKind.Union, UnionWidget);
const dict = registry.registerInputWidgetFallback(PortKind.Dict, DictWidget);
const model = registry.registerInputWidgetFallback(PortKind.Model, ModelWidget);
const float = registry.registerInputWidgetFallback(PortKind.Float, FloatWidget);
const string = registry.registerInputWidgetFallback(
  PortKind.String,
  StringWidget,
);
const mstructure = registry.registerInputWidgetFallback(
  PortKind.MemoryStructure,
  MemoryStructureWidget,
);
const structure = registry.registerInputWidgetFallback(
  PortKind.Structure,
  StructureWidget,
);

const hideEffect = registry.registerEffectWidget("HideEffect", HideEffect);

const search = registry.registerInputWidget("SearchAssignWidget", SearchWidget);
const slider = registry.registerInputWidget("SliderAssignWidget", SliderWidget);

const choices = registry.registerInputWidget(
  "ChoiceAssignWidget",
  ChoicesWidget,
);

const stateChoise = registry.registerInputWidget(
  "StateChoiceAssignWidget",
  StateChoiceWidget,
);

const intReturn = registry.registerReturnWidgetFallback(
  PortKind.Int,
  IntReturnWidget,
);
const floatReturn = registry.registerReturnWidgetFallback(
  PortKind.Float,
  FloatReturnWidget,
);
const stringReturn = registry.registerReturnWidgetFallback(
  PortKind.String,
  StringReturnWidget,
);
const modelReturn = registry.registerReturnWidgetFallback(
  PortKind.Model,
  ModelReturnWidget,
);


const listReturn = registry.registerReturnWidgetFallback(
  PortKind.List,
  ListReturnWidget,
);
const boolReturn = registry.registerReturnWidgetFallback(
  PortKind.Bool,
  BoolReturnWidget,
);
const dateReturn = registry.registerReturnWidgetFallback(
  PortKind.Date,
  DateReturnWidget,
);

const enumReturn = registry.registerReturnWidgetFallback(
  PortKind.Enum,
  EnumReturnWidget,
);
const unionReturn = registry.registerReturnWidgetFallback(
  PortKind.Union,
  UnionReturnWidget,
);

const structureReturn = registry.registerReturnWidgetFallback(
  PortKind.Structure,
  DelegatingStructureWidget,
);

export const THE_WIDGET_REGISTRY = registry;
