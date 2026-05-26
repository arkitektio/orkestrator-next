import type {StoreApi} from 'zustand/vanilla';
import {z} from 'zod';

export type ChildDescriptor = string | {id: string; basePath?: string};

export type BlokDynamicValue = {
  literal?: string | null;
  path?: string | null;
};

export type BlokActionArgument = {
  key?: string | null;
  value_literal?: unknown;
  value_path?: string | null;
  agent_call?: BlokAgentCall | null;
  util_call?: BlokUtilCall | null;
  value_list?: BlokActionArgument[] | null;
  value_dict?: BlokActionArgument[] | null;
};

export type BlokAgentCall = {
  dependency: string;
  operation: string;
  arguments?: BlokActionArgument[] | null;
};

export type BlokUtilCall = {
  operation: string;
  arguments?: BlokActionArgument[] | null;
};

export type BlokComponentProp = {
  key: string;
  static_value?: unknown;
  dynamic_value?: BlokDynamicValue | null;
  agent_call?: BlokAgentCall | null;
  util_call?: BlokUtilCall | null;
};

export type BlokComponentNode = {
  id: string;
  component: string;
  props?: BlokComponentProp[] | null;
  children?: BlokComponentNode[] | null;
};

export type BlokResolvedAgentCall = {
  dependency: string;
  operation: string;
  arguments?: Record<string, unknown>;
};

export type BlokValidationState = {
  isValid: boolean;
  validationErrors: string[];
};

export type BlokRuntimeDependencies = {
  paths: string[];
  needsInvokeFunction: boolean;
  needsDispatchAction: boolean;
};

export type BlokRuntimeContext = {
  dataModel: unknown;
  pathAliases: Record<string, string>;
  invokeFunction: (name: string, args: Record<string, unknown>) => unknown;
  dispatchAction: (action: BlokResolvedAgentCall, component: BlokComponentNode) => void;
};

export type BlokObjectSchema = z.ZodObject<Record<string, z.ZodTypeAny>>;

export type BlokRuntimeStore = StoreApi<BlokRuntimeContext>;
