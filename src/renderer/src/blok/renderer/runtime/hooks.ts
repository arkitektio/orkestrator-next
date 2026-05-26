import * as React from 'react';
import {z} from 'zod';
import {useShallow} from 'zustand/react/shallow';
import {useBlokRuntime, useBlokRuntimeStoreApi} from './context';
import {
  getComponentPropRuntimeDependencies,
  getPropMap,
  getRuntimeValueAtPath,
  resolveComponentPropValue,
} from './resolution';
import type {
  BlokComponentNode,
  BlokComponentProp,
  BlokObjectSchema,
  BlokRuntimeContext,
  BlokValidationState,
} from './types';

type BlokSchemaShape<TSchema extends BlokObjectSchema> =
  TSchema extends z.ZodObject<infer TShape> ? TShape : never;

export type BlokPropHandle<TSchema extends z.ZodTypeAny = z.ZodTypeAny> = {
  component: BlokComponentNode;
  key: string;
  schema: TSchema;
  prop?: BlokComponentProp;
};

export type Blok<TSchema extends BlokObjectSchema> = {
  [TKey in keyof BlokSchemaShape<TSchema> & string]: BlokPropHandle<BlokSchemaShape<TSchema>[TKey]>;
};

type AnyBlok = Record<string, BlokPropHandle<z.ZodTypeAny>>;

type BlokValueForKey<TBlok extends AnyBlok, TKey extends keyof TBlok & string> =
  TBlok[TKey] extends BlokPropHandle<infer TSchema>
    ? z.output<TSchema> | undefined
    : never;

const toBlokPropHandle = <TSchema extends z.ZodTypeAny>(
  component: BlokComponentNode,
  key: string,
  schema: TSchema,
  prop: BlokComponentProp | undefined,
): BlokPropHandle<TSchema> => ({
  component,
  key,
  schema,
  prop,
});

const getSelectedRuntimeValues = (
  state: BlokRuntimeContext,
  handle: BlokPropHandle<z.ZodTypeAny>,
): unknown[] => {
  const dependencies = getComponentPropRuntimeDependencies(handle.prop, handle.schema);
  const selectedValues = dependencies.paths.map(path => getRuntimeValueAtPath(state, path));

  if (dependencies.needsInvokeFunction) {
    selectedValues.push(state.invokeFunction);
  }

  if (dependencies.needsDispatchAction) {
    selectedValues.push(state.dispatchAction);
  }

  return selectedValues;
};

const isBlokPropHandle = (value: unknown): value is BlokPropHandle<z.ZodTypeAny> => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return 'component' in value && 'key' in value && 'schema' in value;
};

const resolveHandle = (
  handleOrBlok: BlokPropHandle<z.ZodTypeAny> | AnyBlok | undefined,
  key?: string,
): BlokPropHandle<z.ZodTypeAny> | undefined => {
  if (!handleOrBlok) {
    return undefined;
  }

  if (isBlokPropHandle(handleOrBlok)) {
    return handleOrBlok;
  }

  if (!key) {
    throw new Error('Missing blok prop key.');
  }

  return handleOrBlok[key];
};

export const useBlok = <TSchema extends BlokObjectSchema>(
  component: BlokComponentNode,
  schema: TSchema,
): Blok<TSchema> => {
  return React.useMemo(() => {
    const propMap = getPropMap(component.props);
    const shape = schema.shape as BlokSchemaShape<TSchema>;

    return Object.fromEntries(
      (Object.keys(shape) as Array<keyof BlokSchemaShape<TSchema> & string>).map(key => [
        key,
        toBlokPropHandle(component, key, shape[key], propMap.get(key)),
      ]),
    ) as Blok<TSchema>;
  }, [component, schema]);
};

export function useValue<TSchema extends z.ZodTypeAny>(
  handle: BlokPropHandle<TSchema> | undefined,
): z.output<TSchema> | undefined;
export function useValue<TBlok extends AnyBlok, TKey extends keyof TBlok & string>(
  blok: TBlok,
  key: TKey,
): BlokValueForKey<TBlok, TKey>;
export function useValue(
  handleOrBlok: BlokPropHandle<z.ZodTypeAny> | AnyBlok | undefined,
  key?: string,
): unknown {
  const handle = resolveHandle(handleOrBlok, key);
  const store = useBlokRuntimeStoreApi();
  const selectedRuntimeValues = useBlokRuntime(
    useShallow((state: BlokRuntimeContext) => (handle ? getSelectedRuntimeValues(state, handle) : [])),
  );

  return React.useMemo(() => {
    void selectedRuntimeValues;
    if (!handle) {
      return undefined;
    }

    const runtimeContext = store.getState();
    const resolvedValue =
      handle.key === 'children' && !handle.prop && handle.component.children?.length
        ? handle.component.children.map(child => child.id)
        : resolveComponentPropValue(handle.prop, handle.schema, handle.component, runtimeContext);

    const result = handle.schema.safeParse(resolvedValue);
    return result.success ? result.data : undefined;
  }, [handle, selectedRuntimeValues, store]);
};

export function useAction<TSchema extends z.ZodTypeAny>(
  handle: BlokPropHandle<TSchema> | undefined,
): z.output<TSchema> | undefined;
export function useAction<TBlok extends AnyBlok, TKey extends keyof TBlok & string>(
  blok: TBlok,
  key: TKey,
): BlokValueForKey<TBlok, TKey>;
export function useAction(
  handleOrBlok: BlokPropHandle<z.ZodTypeAny> | AnyBlok | undefined,
  key?: string,
): unknown {
  return useValue(resolveHandle(handleOrBlok, key));
}

export const useValidation = <TSchema extends BlokObjectSchema>(
  component: BlokComponentNode,
  schema: TSchema,
): BlokValidationState => {
  const store = useBlokRuntimeStoreApi();
  const selectedRuntimeValues = useBlokRuntime(
    useShallow((state: BlokRuntimeContext) => {
      const propMap = getPropMap(component.props);
      const shape = schema.shape as Record<string, z.ZodTypeAny>;

      return Object.entries(shape).flatMap(([key, fieldSchema]) => {
        const handle = toBlokPropHandle(component, key, fieldSchema, propMap.get(key));
        return getSelectedRuntimeValues(state, handle);
      });
    }),
  );

  return React.useMemo(() => {
    void selectedRuntimeValues;
    const runtimeContext = store.getState();
    const shape = schema.shape as Record<string, z.ZodTypeAny>;
    const propMap = getPropMap(component.props);
    const resolvedValues = Object.fromEntries(
      Object.entries(shape).map(([key, fieldSchema]) => {
        const resolvedValue =
          key === 'children' && !propMap.has(key) && component.children?.length
            ? component.children.map(child => child.id)
            : resolveComponentPropValue(propMap.get(key), fieldSchema, component, runtimeContext);

        return [key, resolvedValue] as const;
      }),
    );

    const parsed = schema.safeParse(resolvedValues);
    if (parsed.success) {
      return {
        isValid: true,
        validationErrors: [],
      };
    }

    return {
      isValid: false,
      validationErrors: parsed.error.issues.map(issue => {
        const issuePath = issue.path.join('.');
        return issuePath ? `${issuePath}: ${issue.message}` : issue.message;
      }),
    };
  }, [component, schema, selectedRuntimeValues, store]);
};
