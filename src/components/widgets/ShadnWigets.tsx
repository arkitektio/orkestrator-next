import { PortKind } from "@/rekuest/api/graphql";
import { useWidgetRegistry } from "@/rekuest/widgets/WidgetsContext";
import { useEffect } from "react";
import { ChoicesWidget } from "./custom/ChoicesWidget";
import { SearchWidget } from "./custom/SearchWidget";
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
import { StringReturnWidget } from "./returns/fallbacks/StringReturnWidget";

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
    let choices = registry.registerInputWidget(
      "ChoiceAssignWidget",
      ChoicesWidget,
    );

    return () => {
      int();
      list();
      string();
      search();
      date();
      bool();
      float();
      union();
      choices();
      structure();
      model();
    };
  }, []);

  useEffect(() => {
    let int = registry.registerReturnWidgetFallback(
      PortKind.Int,
      IntReturnWidget,
    );
    let list = registry.registerReturnWidgetFallback(
      PortKind.String,
      StringReturnWidget,
    );
    let bool = registry.registerReturnWidgetFallback(
      PortKind.Bool,
      BoolReturnWidget,
    );

    return () => {
      int();
      list();
      bool();
    };
  }, []);

  return <></>;
};
