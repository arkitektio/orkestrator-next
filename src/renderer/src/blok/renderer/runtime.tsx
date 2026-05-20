import * as React from 'react';
import type {ComponentNode} from '@/rekuest/api/graphql';
import {z} from 'zod';

export type ChildDescriptor = string | {id: string; basePath?: string};

export type BlokValidationState = {
  isValid: boolean;
  validationErrors: string[];
};

export type BlokRuntimeContext = {
  dataModel: unknown;
  invokeFunction: (name: string, args: Record<string, unknown>) => unknown;
  dispatchAction: (action: unknown, component: ComponentNode) => void;
};

export type BlokRenderArgs<TProps> = {
  props: TProps & BlokValidationState;
  buildChild: (id: string, basePath?: string) => React.ReactNode;
  component: ComponentNode;
  context: BlokRuntimeContext;
};

export type BlokComponentDefinition = {
  name: string;
  schema: z.ZodTypeAny;
  render: (args: BlokRenderArgs<Record<string, unknown>>) => React.ReactNode;
};

export const createBlokComponent = <TSchema extends z.ZodTypeAny>(
  api: {name: string; schema: TSchema},
  render: (args: BlokRenderArgs<z.infer<TSchema>>) => React.ReactNode,
): BlokComponentDefinition => ({
  name: api.name,
  schema: api.schema,
  render: render as unknown as (args: BlokRenderArgs<Record<string, unknown>>) => React.ReactNode,
});

export const createBinderlessBlokComponent = createBlokComponent;

export type BlokFunctionDefinition = {
  name: string;
  schema: z.ZodTypeAny;
  returnType?: string;
  execute: (args: Record<string, unknown>, context: BlokRuntimeContext) => unknown;
};

export const createBlokFunction = <TSchema extends z.ZodTypeAny>(
  api: {name: string; schema: TSchema; returnType?: string},
  execute: (args: z.infer<TSchema>, context: BlokRuntimeContext) => unknown,
): BlokFunctionDefinition => ({
  name: api.name,
  schema: api.schema,
  returnType: api.returnType,
  execute: execute as unknown as (args: Record<string, unknown>, context: BlokRuntimeContext) => unknown,
});

export type BlokCatalog = {
  id: string;
  components: Map<string, BlokComponentDefinition>;
  functions: Map<string, BlokFunctionDefinition>;
  invokeFunction: (
    name: string,
    args: Record<string, unknown>,
    context: BlokRuntimeContext,
  ) => unknown;
};

export const createBlokCatalog = (
  id: string,
  components: ReadonlyArray<BlokComponentDefinition>,
  functions: ReadonlyArray<BlokFunctionDefinition> = [],
): BlokCatalog => {
  const componentMap = new Map(components.map(component => [component.name, component]));
  const functionMap = new Map(functions.map(fn => [fn.name, fn]));

  return {
    id,
    components: componentMap,
    functions: functionMap,
    invokeFunction: (name, args, context) => {
      const fn = functionMap.get(name);
      if (!fn) {
        throw new Error(`Function not found in catalog ${id}: ${name}`);
      }

      const safeArgs = fn.schema.parse(args);
      return fn.execute(safeArgs, context);
    },
  };
};

export const BlokSchemas = {
  ComponentId: z.string(),
  ChildList: z
    .array(
      z.union([
        z.string(),
        z.object({
          id: z.string(),
          basePath: z.string().optional(),
        }),
      ]),
    )
    .optional(),
  DynamicString: z.string(),
  DynamicBoolean: z.boolean(),
  Action: z.object({
    targetDependencyKey: z.string().optional(),
    payload: z.record(z.string(), z.unknown()).optional(),
  }),
  Checkable: z.object({
    checks: z.array(z.any()).optional(),
  }),
};
