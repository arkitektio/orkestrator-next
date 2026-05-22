import * as React from 'react';
import type {ComponentNode} from '@/rekuest/api/graphql';
import {useStore} from 'zustand';
import type {StoreApi} from 'zustand/vanilla';
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

export type BlokRuntimeStore = StoreApi<BlokRuntimeContext>;

const BlokRuntimeStoreContext = React.createContext<BlokRuntimeStore | null>(null);

export const BlokRuntimeProvider = (
  props: {store: BlokRuntimeStore; children: React.ReactNode},
) => {
  return (
    <BlokRuntimeStoreContext.Provider value={props.store}>
      {props.children}
    </BlokRuntimeStoreContext.Provider>
  );
};

const useBlokRuntimeStoreApi = (): BlokRuntimeStore => {
  const store = React.useContext(BlokRuntimeStoreContext);
  if (!store) {
    throw new Error('useBlokRuntime must be used within a BlokRuntimeProvider');
  }

  return store;
};

export const useBlokRuntime = <T,>(selector: (state: BlokRuntimeContext) => T): T => {
  const store = useBlokRuntimeStoreApi();
  return useStore(store, selector);
};

export type BlokRenderArgs<TProps> = {
  props: TProps & BlokValidationState;
  buildChild: (id: string, basePath?: string) => React.ReactNode;
  component: ComponentNode;
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

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

const decodeJsonLiteralString = (value: string): unknown => {
  const trimmed = value.trim();
  if (!trimmed) {
    return value;
  }

  const firstCharacter = trimmed[0];
  const looksLikeJsonLiteral =
    firstCharacter === '"' ||
    firstCharacter === '[' ||
    firstCharacter === '{' ||
    firstCharacter === '-' ||
    (firstCharacter >= '0' && firstCharacter <= '9') ||
    trimmed === 'true' ||
    trimmed === 'false' ||
    trimmed === 'null';

  if (!looksLikeJsonLiteral) {
    return value;
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return value;
  }
};

const isFunctionCallEnvelope = (
  value: unknown,
): value is {
  call: string;
  args?: Record<string, unknown>;
} => {
  return isRecord(value) && isString(value.call);
};

const isWrappedFunctionCallEnvelope = (
  value: unknown,
): value is {
  functionCall: {
    call: string;
    args?: Record<string, unknown>;
  };
} => {
  return isRecord(value) && isFunctionCallEnvelope(value.functionCall);
};

const isEventActionEnvelope = (
  value: unknown,
): value is {
  event: {
    name: string;
    context?: Record<string, unknown>;
  };
} => {
  return isRecord(value) && isRecord(value.event) && isString(value.event.name);
};

const isRekuestActionEnvelope = (
  value: unknown,
): value is {
  actionType: string;
  operationName: string;
  targetDependencyKey?: string;
  arguments?: Record<string, unknown>;
} => {
  return isRecord(value) && value.actionType === 'rekuestCall' && isString(value.operationName);
};

const isActionValue = (value: unknown): boolean => {
  return (
    typeof value === 'function' ||
    isEventActionEnvelope(value) ||
    isFunctionCallEnvelope(value) ||
    isWrappedFunctionCallEnvelope(value) ||
    isRekuestActionEnvelope(value)
  );
};

const getValueAtPath = (dataModel: unknown, path: string): unknown => {
  if (!path) {
    return dataModel;
  }

  const segments = path
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean);

  let current: unknown = dataModel;
  for (const segment of segments) {
    if (Array.isArray(current)) {
      const index = Number(segment);
      current = Number.isInteger(index) ? current[index] : undefined;
      continue;
    }

    if (!isRecord(current)) {
      return undefined;
    }

    current = current[segment];
  }

  return current;
};

const resolveDynamicValue = (
  value: unknown,
  runtimeContext: BlokRuntimeContext,
): unknown => {
  if (isString(value)) {
    return decodeJsonLiteralString(value);
  }

  if (isWrappedFunctionCallEnvelope(value)) {
    return resolveDynamicValue(value.functionCall, runtimeContext);
  }

  if (isFunctionCallEnvelope(value)) {
    const args = Object.fromEntries(
      Object.entries(value.args ?? {}).map(([key, argValue]) => [
        key,
        resolveDynamicValue(argValue, runtimeContext),
      ]),
    );

    return runtimeContext.invokeFunction(value.call, args);
  }

  if (isRecord(value)) {
    if (isString(value.literal)) {
      return decodeJsonLiteralString(value.literal);
    }

    if (isString(value.path)) {
      return getValueAtPath(runtimeContext.dataModel, value.path);
    }
  }

  if (Array.isArray(value)) {
    return value.map(item => resolveDynamicValue(item, runtimeContext));
  }

  if (isRecord(value) && !isActionValue(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, itemValue]) => [
        key,
        resolveDynamicValue(itemValue, runtimeContext),
      ]),
    );
  }

  return value;
};

const invokeAction = (
  action: unknown,
  component: ComponentNode,
  runtimeContext: BlokRuntimeContext,
): void => {
  if (isRekuestActionEnvelope(action) || isEventActionEnvelope(action)) {
    runtimeContext.dispatchAction(action, component);
    return;
  }

  if (isWrappedFunctionCallEnvelope(action)) {
    invokeAction(action.functionCall, component, runtimeContext);
    return;
  }

  if (isFunctionCallEnvelope(action)) {
    runtimeContext.invokeFunction(
      action.call,
      Object.fromEntries(
        Object.entries(action.args ?? {}).map(([key, value]) => [
          key,
          resolveDynamicValue(value, runtimeContext),
        ]),
      ),
    );
  }
};

const createActionHandler = (
  action: unknown,
  component: ComponentNode,
  runtimeContext: BlokRuntimeContext,
): (() => void) | unknown => {
  if (typeof action === 'function') {
    return action;
  }

  if (!isActionValue(action)) {
    return action;
  }

  return () => invokeAction(action, component, runtimeContext);
};

const materializeRuntimeValue = (
  value: unknown,
  component: ComponentNode,
  runtimeContext: BlokRuntimeContext,
): unknown => {
  if (isActionValue(value)) {
    return createActionHandler(value, component, runtimeContext);
  }

  if (Array.isArray(value)) {
    return value.map(item => materializeRuntimeValue(item, component, runtimeContext));
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, itemValue]) => [
        key,
        materializeRuntimeValue(itemValue, component, runtimeContext),
      ]),
    );
  }

  return value;
};

export const useResolvedBlokProps = <TProps extends Record<string, unknown>>(
  props: TProps,
  component: ComponentNode,
): TProps => {
  const runtimeContext = useBlokRuntime(state => state);

  return React.useMemo(
    () => materializeRuntimeValue(props, component, runtimeContext) as TProps,
    [component, props, runtimeContext],
  );
};

export const BlokComponentRenderer = (props: {
  definition: BlokComponentDefinition;
  props: Record<string, unknown> & BlokValidationState;
  buildChild: (id: string, basePath?: string) => React.ReactNode;
  component: ComponentNode;
}) => {
  const resolvedProps = useResolvedBlokProps(props.props, props.component);

  return props.definition.render({
    props: resolvedProps,
    buildChild: props.buildChild,
    component: props.component,
  });
};

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
      return fn.execute(safeArgs as Record<string, unknown>, context);
    },
  };
};

const functionCallSchema = z.object({
  call: z.string(),
  args: z.record(z.string(), z.unknown()).optional(),
});

const dynamicReferenceSchema = z
  .object({
    literal: z.string().optional(),
    path: z.string().optional(),
  })
  .refine(value => value.literal !== undefined || value.path !== undefined);

const dynamicRuntimeValueSchema = z.union([
  dynamicReferenceSchema,
  functionCallSchema,
  z.object({
    functionCall: functionCallSchema,
  }),
]);

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
  DynamicString: z.union([z.string(), dynamicRuntimeValueSchema]),
  DynamicBoolean: z.union([z.boolean(), dynamicRuntimeValueSchema]),
  Action: z.union([
    z.function().optional().transform(fn => fn),
    z.object({
      actionType: z.literal('rekuestCall'),
      operationName: z.string(),
      targetDependencyKey: z.string().optional(),
      arguments: z.record(z.string(), z.unknown()).optional(),
    }),
    z.object({
      event: z.object({
        name: z.string(),
        context: z.record(z.string(), z.unknown()).optional(),
      }),
    }),
    functionCallSchema,
    z.object({
      functionCall: functionCallSchema,
    }),
    z.object({
      targetDependencyKey: z.string().optional(),
      payload: z.record(z.string(), z.unknown()).optional(),
    }),
  ]),
  Checkable: z.object({
    checks: z.array(z.any()).optional(),
  }),
};
