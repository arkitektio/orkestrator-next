import {z} from 'zod';
import type {BlokComponentDefinition} from './components';
import type {BlokRuntimeContext} from './types';

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

const isNumericKey = (value: string): boolean => /^\d+$/.test(value);

const normalizeFunctionArgs = (
  schema: z.ZodTypeAny,
  args: Record<string, unknown>,
): Record<string, unknown> => {
  if (!(schema instanceof z.ZodObject)) {
    return args;
  }

  const shape = schema.shape as Record<string, z.ZodTypeAny>;
  const schemaKeys = Object.keys(shape);
  if (schemaKeys.length === 0) {
    return args;
  }

  const positionalEntries = Object.entries(args)
    .filter(([key]) => isNumericKey(key))
    .sort(([leftKey], [rightKey]) => Number(leftKey) - Number(rightKey));

  if (positionalEntries.length === 0) {
    return args;
  }

  const normalizedArgs = {...args};
  let didMapPositionalEntry = false;

  positionalEntries.forEach(([numericKey, value], index) => {
    const schemaKey = schemaKeys[index];
    if (!schemaKey || normalizedArgs[schemaKey] !== undefined) {
      return;
    }

    normalizedArgs[schemaKey] = value;
    delete normalizedArgs[numericKey];
    didMapPositionalEntry = true;
  });

  return didMapPositionalEntry ? normalizedArgs : args;
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

      const safeArgs = fn.schema.parse(normalizeFunctionArgs(fn.schema, args));
      return fn.execute(safeArgs as Record<string, unknown>, context);
    },
  };
};
