import React from "react";
import { PortKind } from "../api/graphql";
import {
  EffectWidgetProps,
  InputWidgetProps,
  InputWidgetTypes,
  MappablePort,
  Port,
  PortEffectTypes,
  ReturnWidgetProps,
  ReturnWidgetTypes,
  Ward,
} from "./types";

export const fakeWard: Ward = {
  search: async () => {
    throw new Error("No ward set");
  },
};

export class WardRegistry {
  ward_registry: { [ward_key: string]: Ward };

  constructor() {
    this.ward_registry = {};
  }

  public registerWard(ward_key: string, ward: Ward): void {
    this.ward_registry[ward_key] = ward;
  }

  public getWard(ward_key: string): Ward {
    return this.ward_registry[ward_key] || fakeWard;
  }

  public deleteWard(ward_key: string): void {
    delete this.ward_registry[ward_key];
  }

  public printWards(): void {
    console.log("Wards", this.ward_registry);
  }
}

export type HookWidget = (props: { value: string }) => React.ReactNode;

export class HookRegistry {
  hook_registry: {
    [ward_key: string]: HookWidget;
  };

  constructor() {
    this.hook_registry = {};
  }

  public registerHook(hook_key: string, widget: HookWidget): void {
    this.hook_registry[hook_key] = widget;
  }

  public getHook(hook_key: string): HookWidget {
    return this.hook_registry[hook_key] || {};
  }
}

export class WidgetRegistry {
  portTypeInputFallbackMap: {
    [ward_key: string]: React.FC<InputWidgetProps>;
  };
  typeInputWidgetMap: {
    [widget_type: string]: React.FC<InputWidgetProps>;
  };
  portTypeReturnFallbackMap: {
    [ward_key: string]: React.FC<ReturnWidgetProps<any>>;
  };
  typeReturnWidgetMap: {
    [widget_type: string]: React.FC<ReturnWidgetProps<any>>;
  };
  effectWidgetMap: {
    [effect_type: string]: React.FC<EffectWidgetProps>;
  };
  ward_registry: WardRegistry;
  hook_registry: HookRegistry;
  unknownEffectWidget: React.FC<EffectWidgetProps>;
  unknownInputWidget: React.FC<InputWidgetProps>;
  unknownReturnWidget: React.FC<ReturnWidgetProps>;

  constructor(
    unknownInputWidget: React.FC<InputWidgetProps>,
    unknownReturnWidget: React.FC<ReturnWidgetProps>,
    unknownEffectWidget: React.FC<EffectWidgetProps>
  ) {
    this.portTypeInputFallbackMap = {};
    this.typeInputWidgetMap = {};
    this.portTypeReturnFallbackMap = {};
    this.typeReturnWidgetMap = {};
    this.effectWidgetMap = {};
    this.ward_registry = new WardRegistry();
    this.hook_registry = new HookRegistry();
    this.unknownInputWidget = unknownInputWidget;
    this.unknownReturnWidget = unknownReturnWidget;
    this.unknownEffectWidget = unknownEffectWidget;
  }

  public registerInputWidgetFallback(
    port_type: PortKind,
    widget: React.FC<InputWidgetProps>
  ): () => void {
    this.portTypeInputFallbackMap[port_type] = widget;
    return () => {
      delete this.portTypeInputFallbackMap[port_type];
    };
  }

  public registerWard(ward_key: string, ward: Ward): () => void {
    this.ward_registry.registerWard(ward_key, ward);
    return () => {
      this.ward_registry.deleteWard(ward_key);
    };
  }

  public getWard(ward_key: string): Ward {
    return this.ward_registry.getWard(ward_key);
  }

  public registerInputWidget(
    widget_type: InputWidgetTypes,
    widget: React.FC<InputWidgetProps<any>>
  ): () => void {
    this.typeInputWidgetMap[widget_type || "Unkown"] = widget;
    return () => {
      delete this.typeInputWidgetMap[widget_type || "Unkown"];
    };
  }

  public getEffectWidget(x: PortEffectTypes): React.FC<EffectWidgetProps> {
    return this.effectWidgetMap[x] || this.unknownEffectWidget;
  }

  public getInputWidgetForPort(
    port: MappablePort,
    allowFallback: boolean = true
  ): React.FC<InputWidgetProps> {
    if (!port?.assignWidget?.__typename) {
      let widget =
        (port?.kind &&
          allowFallback &&
          this.portTypeInputFallbackMap[port?.kind]) ||
        this.unknownInputWidget;

      return widget;
    }
    console.log("Getting widget for port", port);

    let widget =
      this.typeInputWidgetMap[port?.assignWidget?.__typename] ||
      this.unknownInputWidget;

    return widget;
  }

  public registerReturnWidgetFallback(
    port_type: PortKind,
    widget: React.FC<ReturnWidgetProps<any>>
  ): () => void {
    this.portTypeReturnFallbackMap[port_type] = widget;
    return () => {
      delete this.portTypeReturnFallbackMap[port_type];
    };
  }

  public registerReturnWidget(
    widget_type: ReturnWidgetTypes,
    widget: React.FC<ReturnWidgetProps<any>>
  ): () => void {
    this.typeReturnWidgetMap[widget_type || "Unknown"] = widget;
    return () => {
      delete this.typeReturnWidgetMap[widget_type || "Unknown"];
    };
  }

  public registerEffectWidget(
    effect_type: PortEffectTypes,
    widget: React.FC<EffectWidgetProps>
  ): () => void {
    this.effectWidgetMap[effect_type] = widget;
    return () => {
      delete this.effectWidgetMap[effect_type || "Unknown"];
    };
  }

  public getReturnWidgetForPort(
    port: MappablePort,
    allowFallback: boolean = true
  ): React.FC<ReturnWidgetProps<any>> {
    if (!port?.returnWidget?.__typename) {
      return (
        (port?.kind &&
          allowFallback &&
          this.portTypeReturnFallbackMap[port?.kind]) ||
        this.unknownReturnWidget
      );
    }

    return (
      this.typeReturnWidgetMap[port?.returnWidget?.__typename] ||
      this.unknownReturnWidget
    );
  }
}
