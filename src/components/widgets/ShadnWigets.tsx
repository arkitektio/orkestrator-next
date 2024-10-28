import { PortKind } from "@/rekuest/api/graphql";
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

export const ShadnWigets = () => {
  const { registry } = useWidgetRegistry();

  useEffect(() => {
    let int = registry.registerInputWidgetFallback(PortKind.Int, IntWidget);
    let list = registry.registerInputWidgetFallback(PortKind.List, ListWidget);
    let bool = registry.registerInputWidgetFallback(PortKind.Bool, BoolWidget);
    let date = registry.registerInputWidgetFallback(PortKind.Date, DateWidget);
    let union = registry.registerInputWidgetFallback(
      PortKind.Union,
      UnionWidget,
    );
    let dict = registry.registerInputWidgetFallback(PortKind.Dict, DictWidget);
    let model = registry.registerInputWidgetFallback(
      PortKind.Model,
      ModelWidget,
    );
    let float = registry.registerInputWidgetFallback(
      PortKind.Float,
      FloatWidget,
    );
    let string = registry.registerInputWidgetFallback(
      PortKind.String,
      StringWidget,
    );
    let structure = registry.registerInputWidgetFallback(
      PortKind.Structure,
      StructureWidget,
    );

    let search = registry.registerInputWidget(
      "SearchAssignWidget",
      SearchWidget,
    );
    let slider = registry.registerInputWidget(
      "SliderAssignWidget",
      SliderWidget,
    );

    let choices = registry.registerInputWidget(
      "ChoiceAssignWidget",
      ChoicesWidget,
    );

    let stateChoise = registry.registerInputWidget(
      "StateChoiceAssignWidget",
      StateChoiceWidget,
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
      union();
      stateChoise();
      choices();
      structure();
      model();
      slider();
    };
  }, []);

  useEffect(() => {
    let int = registry.registerReturnWidgetFallback(
      PortKind.Int,
      IntReturnWidget,
    );
    let string = registry.registerReturnWidgetFallback(
      PortKind.String,
      StringReturnWidget,
    );
    let bool = registry.registerReturnWidgetFallback(
      PortKind.Bool,
      BoolReturnWidget,
    );
    let model = registry.registerReturnWidgetFallback(
      PortKind.Model,
      ModelReturnWidget,
    );
    let list = registry.registerReturnWidgetFallback(
      PortKind.List,
      ListReturnWidget,
    );
    let float = registry.registerReturnWidgetFallback(
      PortKind.Float,
      FloatReturnWidget,
    );

    return () => {
      int();
      string();
      bool();
      model();
      list();
      float();
    };
  }, []);

  return <></>;
};
