import {z} from 'zod';
import type {BlokComponentDefinition} from './components';
import type {BlokInvokeOptions, BlokInvokeResult} from './types';

/**
 * `pure` functions are safe to evaluate while rendering: same args, same
 * result, no observable side effects. `effect` functions (a toast, a log, a
 * network call) are only legal in *action* position — a click handler — and are
 * refused in value position rather than being fired on every render.
 *
 * The default is `effect` on purpose: a function must opt in to being called
 * during render, so forgetting the annotation fails loudly instead of silently
 * re-firing a side effect on every store update.
 */
export type BlokFunctionPurity = 'pure' | 'effect';

export type BlokFunctionDefinition = {
  name: string;
  schema: z.ZodTypeAny;
  returnType?: string;
  purity: BlokFunctionPurity;
  execute: (args: Record<string, unknown>) => unknown;
};

export const createBlokFunction = <TSchema extends z.ZodTypeAny>(
  api: {name: string; schema: TSchema; returnType?: string; purity?: BlokFunctionPurity},
  execute: (args: z.infer<TSchema>) => unknown,
): BlokFunctionDefinition => ({
  name: api.name,
  schema: api.schema,
  returnType: api.returnType,
  purity: api.purity ?? 'effect',
  execute: execute as unknown as (args: Record<string, unknown>) => unknown,
});

export type BlokCatalog = {
  id: string;
  components: Map<string, BlokComponentDefinition>;
  functions: Map<string, BlokFunctionDefinition>;
  invokeFunction: (
    name: string,
    args: Record<string, unknown>,
    options?: BlokInvokeOptions,
  ) => BlokInvokeResult;
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
    // Never throws: a bad payload is a node-level error, not a crashed surface.
    invokeFunction: (name, args, options) => {
      const fn = functionMap.get(name);
      if (!fn) {
        return {ok: false, error: `Function not found in catalog ${id}: ${name}`};
      }

      if (options?.requirePure && fn.purity !== 'pure') {
        return {
          ok: false,
          error: `Function "${name}" has side effects and cannot be used to compute a prop value. Bind it to an action instead.`,
        };
      }

      const parsed = fn.schema.safeParse(normalizeFunctionArgs(fn.schema, args));
      if (!parsed.success) {
        const detail = parsed.error.issues
          .map(issue => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
          .join('; ');
        return {ok: false, error: `Invalid arguments for "${name}": ${detail}`};
      }

      try {
        return {ok: true, value: fn.execute(parsed.data as Record<string, unknown>)};
      } catch (error) {
        return {
          ok: false,
          error: error instanceof Error ? error.message : `Function "${name}" failed.`,
        };
      }
    },
  };
};

export const mergeBlokCatalogs = (
  id: string,
  catalogs: ReadonlyArray<BlokCatalog>,
): BlokCatalog =>
  createBlokCatalog(
    id,
    catalogs.flatMap(catalog => [...catalog.components.values()]),
    catalogs.flatMap(catalog => [...catalog.functions.values()]),
  );

export {normalizeFunctionArgs};
