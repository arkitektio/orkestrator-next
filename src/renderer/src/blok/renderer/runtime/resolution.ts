import {z} from 'zod';
import type {
  BlokActionArgument,
  BlokComponentNode,
  BlokComponentProp,
  BlokDynamicValue,
  BlokResolvedAgentCall,
  BlokRuntimeDependencies,
  BlokRuntimeContext,
} from './types';
import {getValueAtPath, normalizeLiteralValue, splitPathSegments} from './utils';

const resolveRuntimePath = (
  path: string,
  runtimeContext: Pick<BlokRuntimeContext, 'pathAliases'>,
): string => {
  const normalizedPath = path.replace(/^\//, '');
  const [head, ...tail] = splitPathSegments(normalizedPath);
  if (!head) {
    return normalizedPath;
  }

  const aliasedBasePath = runtimeContext.pathAliases[head];
  if (!aliasedBasePath) {
    return normalizedPath;
  }

  const normalizedBasePath = aliasedBasePath.replace(/^\//, '');
  return tail.length > 0 ? `${normalizedBasePath}/${tail.join('/')}` : normalizedBasePath;
};

const getRuntimeValueAtPath = (
  runtimeContext: BlokRuntimeContext,
  path: string,
): unknown => {
  return getValueAtPath(runtimeContext.dataModel, resolveRuntimePath(path, runtimeContext));
};

const emptyRuntimeDependencies = (): BlokRuntimeDependencies => ({
  paths: [],
  needsInvokeFunction: false,
  needsDispatchAction: false,
});

const mergeRuntimeDependencies = (
  ...dependencySets: Array<BlokRuntimeDependencies | null | undefined>
): BlokRuntimeDependencies => {
  const paths = new Set<string>();
  let needsInvokeFunction = false;
  let needsDispatchAction = false;

  dependencySets.forEach(dependencySet => {
    if (!dependencySet) {
      return;
    }

    dependencySet.paths.forEach(path => {
      if (path) {
        paths.add(path);
      }
    });
    needsInvokeFunction = needsInvokeFunction || dependencySet.needsInvokeFunction;
    needsDispatchAction = needsDispatchAction || dependencySet.needsDispatchAction;
  });

  return {
    paths: [...paths],
    needsInvokeFunction,
    needsDispatchAction,
  };
};

const getActionArgumentRuntimeDependencies = (
  argument: BlokActionArgument,
): BlokRuntimeDependencies => {
  const nestedDependencies = mergeRuntimeDependencies(
    ...(argument.value_list ?? []).map(getActionArgumentRuntimeDependencies),
    ...(argument.value_dict ?? []).map(getActionArgumentRuntimeDependencies),
    ...(argument.util_call?.arguments ?? []).map(getActionArgumentRuntimeDependencies),
    ...(argument.agent_call?.arguments ?? []).map(getActionArgumentRuntimeDependencies),
  );

  return mergeRuntimeDependencies(nestedDependencies, {
    paths: argument.value_path ? [argument.value_path] : [],
    needsInvokeFunction: argument.util_call != null,
    needsDispatchAction: false,
  });
};

const getActionArgumentsRuntimeDependencies = (
  argumentsList: BlokActionArgument[] | null | undefined,
): BlokRuntimeDependencies => {
  return mergeRuntimeDependencies(...(argumentsList ?? []).map(getActionArgumentRuntimeDependencies));
};

const resolveDynamicValue = (
  dynamicValue: BlokDynamicValue | null | undefined,
  runtimeContext: BlokRuntimeContext,
): unknown => {
  if (!dynamicValue) {
    return undefined;
  }

  const literalFallback = dynamicValue.literal != null
    ? normalizeLiteralValue(dynamicValue.literal)
    : undefined;

  if (dynamicValue.path) {
    const resolved = getRuntimeValueAtPath(runtimeContext, dynamicValue.path);
    return resolved === undefined ? literalFallback : resolved;
  }

  return literalFallback;
};

const resolveActionArgumentValue = (
  argument: BlokActionArgument,
  runtimeContext: BlokRuntimeContext,
): unknown => {
  if (argument.util_call) {
    return runtimeContext.invokeFunction(
      argument.util_call.operation,
      resolveActionArguments(argument.util_call.arguments, runtimeContext),
    );
  }

  if (argument.agent_call) {
    return {
      dependency: argument.agent_call.dependency,
      operation: argument.agent_call.operation,
      arguments: resolveActionArguments(argument.agent_call.arguments, runtimeContext),
    } satisfies BlokResolvedAgentCall;
  }

  if (Array.isArray(argument.value_list)) {
    return argument.value_list.map(item => resolveActionArgumentValue(item, runtimeContext));
  }

  if (Array.isArray(argument.value_dict)) {
    return Object.fromEntries(
      argument.value_dict.flatMap((item, index) => {
        const entryKey = item.key ?? String(index);
        return [[entryKey, resolveActionArgumentValue(item, runtimeContext)] as const];
      }),
    );
  }

  if (argument.value_path) {
    const resolved = getRuntimeValueAtPath(runtimeContext, argument.value_path);
    if (resolved !== undefined) {
      return resolved;
    }
  }

  return normalizeLiteralValue(argument.value_literal);
};

const resolveActionArguments = (
  argumentsList: BlokActionArgument[] | null | undefined,
  runtimeContext: BlokRuntimeContext,
): Record<string, unknown> => {
  if (!Array.isArray(argumentsList) || argumentsList.length === 0) {
    return {};
  }

  return Object.fromEntries(
    argumentsList.map((argument, index) => [
      argument.key ?? String(index),
      resolveActionArgumentValue(argument, runtimeContext),
    ]),
  );
};

const isActionSchema = (schema: z.ZodTypeAny): boolean => {
  return schema.safeParse(() => undefined).success;
};

const getComponentPropRuntimeDependencies = (
  prop: BlokComponentProp | undefined,
  targetSchema: z.ZodTypeAny,
): BlokRuntimeDependencies => {
  if (!prop) {
    return emptyRuntimeDependencies();
  }

  if (prop.agent_call) {
    if (!isActionSchema(targetSchema)) {
      return emptyRuntimeDependencies();
    }

    return mergeRuntimeDependencies(getActionArgumentsRuntimeDependencies(prop.agent_call.arguments), {
      paths: [],
      needsInvokeFunction: false,
      needsDispatchAction: true,
    });
  }

  if (prop.util_call) {
    return mergeRuntimeDependencies(getActionArgumentsRuntimeDependencies(prop.util_call.arguments), {
      paths: [],
      needsInvokeFunction: true,
      needsDispatchAction: false,
    });
  }

  if (prop.dynamic_value?.path) {
    return {
      paths: [prop.dynamic_value.path],
      needsInvokeFunction: false,
      needsDispatchAction: false,
    };
  }

  return emptyRuntimeDependencies();
};

const resolveComponentPropValue = (
  prop: BlokComponentProp | undefined,
  targetSchema: z.ZodTypeAny,
  component: BlokComponentNode,
  runtimeContext: BlokRuntimeContext,
): unknown => {
  if (!prop) {
    return undefined;
  }

  if (prop.agent_call) {
    if (!isActionSchema(targetSchema)) {
      return prop.agent_call;
    }

    const agentCall = prop.agent_call;
    return () => {
      runtimeContext.dispatchAction(
        {
          dependency: agentCall.dependency,
          operation: agentCall.operation,
          arguments: resolveActionArguments(agentCall.arguments, runtimeContext),
        },
        component,
      );
    };
  }

  if (prop.util_call) {
    const utilCall = prop.util_call;
    if (isActionSchema(targetSchema)) {
      return () => {
        runtimeContext.invokeFunction(
          utilCall.operation,
          resolveActionArguments(utilCall.arguments, runtimeContext),
        );
      };
    }

    return runtimeContext.invokeFunction(
      utilCall.operation,
      resolveActionArguments(utilCall.arguments, runtimeContext),
    );
  }

  const dynamicValue = resolveDynamicValue(prop.dynamic_value, runtimeContext);
  if (dynamicValue !== undefined) {
    return dynamicValue;
  }

  return normalizeLiteralValue(prop.static_value);
};

const getPropMap = (
  props: ReadonlyArray<BlokComponentProp> | null | undefined,
): Map<string, BlokComponentProp> => {
  return new Map((props ?? []).map(prop => [prop.key, prop]));
};

export {getPropMap, resolveActionArguments, resolveComponentPropValue, resolveDynamicValue};
export {getComponentPropRuntimeDependencies};
export {getRuntimeValueAtPath, resolveRuntimePath};
