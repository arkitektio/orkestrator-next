import { PortKind } from "@/rekuest/api/graphql";
import { useWidgetRegistry } from "@jhnnsrs/rekuest";
import { useEffect } from "react";
import { IntWidget } from "./fallbacks/IntWidget";
import { SearchWidget } from "./custom/SearchWidget";
import { ListWidget } from "./fallbacks/ListWidget";
import { StringWidget } from "./fallbacks/StringWidget";
import { ChoicesWidget } from "./custom/ChoicesWidget";
import { BoolWidget } from "./fallbacks/BoolWidget";
import { DateWidget } from "./fallbacks/DateWidget";
import { FloatWidget } from "./fallbacks/FloatWidget";
import { UnionWidget } from "./fallbacks/UnionWidget";
import { IntReturnWidget } from "./returns/fallbacks/IntReturnWidget";
import { StringReturnWidget } from "./returns/fallbacks/StringReturnWidget";
import { BoolReturnWidget } from "./returns/fallbacks/BoolReturnWidget";

export const ShadnWigets = () => {
  const { registry } = useWidgetRegistry();

  useEffect(() => {
    let int = registry.registerInputWidgetFallback(PortKind.Int, IntWidget);
    let list = registry.registerInputWidgetFallback(PortKind.List, ListWidget);
    let bool = registry.registerInputWidgetFallback(PortKind.Bool, BoolWidget);
    let date = registry.registerInputWidgetFallback(PortKind.Date, DateWidget);
    let union = registry.registerInputWidgetFallback(
      PortKind.Union,
      UnionWidget
    );
    let float = registry.registerInputWidgetFallback(
      PortKind.Float,
      FloatWidget
    );
    let string = registry.registerInputWidgetFallback(
      PortKind.String,
      StringWidget
    );

    let search = registry.registerInputWidget("SearchWidget", SearchWidget);
    let choices = registry.registerInputWidget("ChoiceWidget", ChoicesWidget);

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
    };
  }, []);

  useEffect(() => {
    let int = registry.registerReturnWidgetFallback(
      PortKind.Int,
      IntReturnWidget
    );
    let list = registry.registerReturnWidgetFallback(
      PortKind.String,
      StringReturnWidget
    );
    let bool = registry.registerReturnWidgetFallback(
      PortKind.Bool,
      BoolReturnWidget
    );

    return () => {
      int();
      list();
      bool();
    };
  }, []);

  return <></>;
};
