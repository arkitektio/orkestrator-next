import {
  PortEffectFragment,
  AssignWidgetFragment,
  PortFragment,
  PortGroupFragment,
  PortKind,
  ReturnWidgetFragment,
} from "../api/graphql";

export interface InputWidgetProps<
  W extends AssignWidgetFragment = AssignWidgetFragment,
> {
  port: PortFragment;
  widget?: W | null;
  options?: PortOptions;
  parentKind?: PortKind;
  path: string[];
}

export type Returns =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: Returns }
  | Returns[];

export type Port = PortFragment;
export type MappablePort = {
  kind: PortKind;
  assignWidget?:
    | {
        __typename: InputWidgetTypes;
      }
    | null
    | undefined;
  returnWidget?:
    | {
        __typename: ReturnWidgetTypes;
      }
    | null
    | undefined;
};

export type InputWidgetTypes = AssignWidgetFragment["__typename"];
export type ReturnWidgetTypes = ReturnWidgetFragment["__typename"];
export type PortEffectTypes = PortEffectFragment["__typename"];

export interface ReturnWidgetProps<
  W extends ReturnWidgetFragment = ReturnWidgetFragment,
> {
  port: Port;
  widget?: W | null;
  value?: any;
  options?: PortOptions;
}

export type EffectWidgetProps = {
  children: React.ReactNode;
  effect: PortEffectFragment;
  port: Port;
};

export type Effect = PortEffectFragment;

export type PortGroup = PortGroupFragment;

export type RunQueryFunc<T extends any> = (options: {
  query: string;
  variables: any;
}) => Promise<T>;

export type PortOptions = {
  disable: boolean;
};

export interface Ward {
  search: (options: {
    query: string;
    variables: any;
  }) => Promise<({ label: string; value: any } | null | undefined)[]>;
}

export type LabellablePort = {
  key: string;
  kind: PortKind;
  identifier?: string;
  nullable?: boolean;
  children?: (LabellablePort | null)[] | null;
};

export type PortablePort = LabellablePort & {
  key: string;
  default?: any | null | undefined;
  validators?: PortFragment["validators"];
};

export interface WidgetRegistryType {
  registerWard: (ward_key: string, ward: Ward) => () => void;
  getWard: (ward_key: string) => Ward;
  registerInputWidget: (
    widget_type: InputWidgetTypes,
    widget: React.FC<InputWidgetProps<any>>,
  ) => () => void;
  registerInputWidgetFallback: (
    port_type: PortKind,
    widget: React.FC<InputWidgetProps>,
  ) => () => void;
  registerReturnWidget: (
    widget_type: ReturnWidgetTypes,
    widget: React.FC<ReturnWidgetProps<any>>,
  ) => () => void;
  registerEffectWidget: (
    effect_type: PortEffectTypes,
    widget: React.FC<EffectWidgetProps>,
  ) => () => void;
  registerReturnWidgetFallback: (
    port_type: PortKind,
    widget: React.FC<ReturnWidgetProps<any>>,
  ) => () => void;
  getReturnWidgetForPort: (
    port: MappablePort,
    allowFallback?: boolean,
  ) => React.FC<ReturnWidgetProps<any>>;
  getInputWidgetForPort: (
    port: MappablePort,
    allowFallback?: boolean,
  ) => React.FC<InputWidgetProps>;
  getEffectWidget: (effect: PortEffectTypes) => React.FC<EffectWidgetProps>;
}
