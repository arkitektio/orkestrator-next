import { EffectKind, PortKind } from "@/rekuest/api/graphql";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { useEffect } from "react";
import { ChoicesWidget } from "./custom/ChoicesWidget";
import { SearchWidget } from "./custom/SearchWidget";
import { StateChoiceWidget } from "./custom/StateChoiceWidget";
import { BoolWidget } from "./fallbacks/BoolWidget";
import { DateWidget } from "./fallbacks/DateWidget";
import { DictWidget } from "./fallbacks/DictWidget";
import { FloatWidget } from "./fallbacks/FloatWidget";
import { IntWidget } from "./fallbacks/IntWidget";
import { ListWidget } from "./fallbacks/ListWidget";
import { ModelWidget } from "./fallbacks/ModelWidget";
import { StringWidget } from "./fallbacks/StringWidget";
import { StructureWidget } from "./fallbacks/StructureWidget";
import { UnionWidget } from "./fallbacks/UnionWidget";
import { BoolReturnWidget } from "./returns/fallbacks/BoolReturnWidget";
import { IntReturnWidget } from "./returns/fallbacks/IntReturnWidget";
import { ListReturnWidget } from "./returns/fallbacks/ListReturnWidget";
import { ModelReturnWidget } from "./returns/fallbacks/ModelReturnWidget";
import { StringReturnWidget } from "./returns/fallbacks/StringReturnWidget";
import { FloatReturnWidget } from "./returns/fallbacks/FloatReturnWidget";
import { SliderWidget } from "./custom/SliderWidget";
import { MemoryStructureWidget } from "./fallbacks/MemoryStructureWidget";
import { EnumWidget } from "./fallbacks/EnumWidget";
import { hi } from "date-fns/locale";
import { HideEffect } from "./effects/HideEffect";
import { DateReturnWidget } from "./returns/fallbacks/DateReturnWidget";
import { EnumReturnWidget } from "./returns/fallbacks/EnumReturnWidget";
import { UnionReturnWidget } from "./returns/fallbacks/UnionReturnWidget";
import { DelegatingStructureWidget } from "./returns/DelegatingStructureWidget";

export const ShadnWigets = () => {
  const { registry } = useWidgetRegistry();

  useEffect(() => {
    const int = registry.registerInputWidgetFallback(PortKind.Int, IntWidget);
    const list = registry.registerInputWidgetFallback(
      PortKind.List,
      ListWidget,
    );
    const bool = registry.registerInputWidgetFallback(
      PortKind.Bool,
      BoolWidget,
    );
    const date = registry.registerInputWidgetFallback(
      PortKind.Date,
      DateWidget,
    );
    const enumwi = registry.registerInputWidgetFallback(
      PortKind.Enum,
      EnumWidget,
    );
    const union = registry.registerInputWidgetFallback(
      PortKind.Union,
      UnionWidget,
    );
    const dict = registry.registerInputWidgetFallback(
      PortKind.Dict,
      DictWidget,
    );
    const model = registry.registerInputWidgetFallback(
      PortKind.Model,
      ModelWidget,
    );
    const float = registry.registerInputWidgetFallback(
      PortKind.Float,
      FloatWidget,
    );
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

    const search = registry.registerInputWidget(
      "SearchAssignWidget",
      SearchWidget,
    );
    const slider = registry.registerInputWidget(
      "SliderAssignWidget",
      SliderWidget,
    );

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

    return () => {
      int();
      list();
      string();
      search();
      dict();
      date();
      bool();
      float();
      enumwi();
      union();
      hideEffect();
      mstructure();
      stateChoise();
      choices();
      structure();
      model();
      slider();
      intReturn();
      listReturn();
      boolReturn();
      dateReturn();
      floatReturn();
      enumReturn();
      unionReturn();
      structureReturn();
    };
  }, []);

  return <></>;
};
