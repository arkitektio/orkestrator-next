import {useMemo} from 'react';
import type {ActionArgument, ComponentNode, ComponentProp} from '@/rekuest/api/graphql';
import {cn} from '@/lib/utils';
import {toast} from 'sonner';
import {createStore} from 'zustand/vanilla';
import { myCatalog } from './catalog';
import {
  BlokComponentRenderer,
  BlokRuntimeProvider,
  type BlokRuntimeContext,
} from './runtime';

type BlokRendererProps = {
  surfaceId?: string;
  uiComponents?: unknown;
  demoState?: unknown;
  chrome?: 'default' | 'minimal';
  sizing?: 'fill' | 'intrinsic';
};

const DEFAULT_SURFACE_ID = 'blok-preview';

type ValidationError = {
  path: string;
  message: string;
};

type ComponentNodeLike = {
  id: string;
  component: string;
  children?: ComponentNodeLike[] | null;
  props: Record<string, unknown>;
  raw: ComponentNode;
};

type ComponentPropLike = {
  key: string;
  utilCall?: unknown;
  util_call?: unknown;
  agentAction?: unknown;
  agent_action?: unknown;
  agentCall?: unknown;
  agent_call?: unknown;
  dynamicValue?: unknown;
  dynamic_value?: unknown;
  staticValue?: unknown;
  static_value?: unknown;
};

type PreparedComponent = {
  id: string;
  component: string;
  raw: ComponentNode;
  props: Record<string, unknown>;
};

type PreflightResult = {
  componentMap: Map<string, PreparedComponent>;
  rootIds: string[];
  errors: ValidationError[];
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

const isComponentNodeInput = (
  value: unknown,
): value is {
  id: string;
  component: string;
  props?: unknown;
  children?: unknown;
} => {
  return isRecord(value) && isString(value.id) && isString(value.component);
};

const pickString = (...values: unknown[]): string | undefined => {
  return values.find(isString);
};

const pickDefined = (...values: unknown[]): unknown => {
  return values.find(value => value !== undefined);
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

const isEventActionEnvelope = (
  value: unknown,
): value is {
  event: {
    name: string;
    context?: Record<string, unknown>;
  };
} => {
  return (
    isRecord(value) &&
    isRecord(value.event) &&
    isString(value.event.name)
  );
};

const isRekuestActionEnvelope = (
  value: unknown,
): value is {
  actionType: string;
  operationName: string;
  targetDependencyKey?: string;
  arguments?: Record<string, unknown>;
} => {
  return (
    isRecord(value) &&
    value.actionType === 'rekuestCall' &&
    isString(value.operationName)
  );
};

const normalizeArgumentValue = (value: unknown): unknown => {
  if (!isRecord(value)) {
    return value;
  }

  const utilCall = value.utilCall ?? value.util_call;
  if (utilCall !== undefined && utilCall !== null) {
    return normalizeUtilCall(utilCall);
  }

  const agentCall = value.agentCall ?? value.agent_call;
  if (agentCall !== undefined && agentCall !== null) {
    return normalizeRekuestAction(agentCall);
  }

  if (Array.isArray(value.value_dict)) {
    return Object.fromEntries(
      value.value_dict.flatMap((item, index) => {
        if (!isRecord(item)) {
          return [];
        }

        const entryKey = pickString(item.key) ?? String(index);
        return [[entryKey, normalizeArgumentValue(item)] as const];
      }),
    );
  }

  if (Array.isArray(value.value_list)) {
    return value.value_list.map(item => normalizeArgumentValue(item));
  }

  const valuePath = pickString(value.valuePath, value.value_path, value.path);
  if (valuePath) {
    return {path: valuePath};
  }

  if ('valueLiteral' in value || 'value_literal' in value || 'literal' in value) {
    const literal = pickDefined(value.valueLiteral, value.value_literal, value.literal);
    return isString(literal) ? decodeJsonLiteralString(literal) : literal;
  }

  return value;
};

const normalizeActionArguments = (value: unknown): Record<string, unknown> | undefined => {
  if (Array.isArray(value)) {
    const normalizedEntries = value.flatMap((item, index) => {
      if (!isRecord(item)) {
        return [];
      }

      const entryKey = pickString(item.key) ?? String(index);

      return [[entryKey, normalizeArgumentValue(item)] as const];
    });

    return normalizedEntries.length > 0 ? Object.fromEntries(normalizedEntries) : undefined;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const normalizedEntries = Object.entries(value).map(([key, itemValue]) => {
    return [key, normalizeArgumentValue(itemValue)] as const;
  });

  return normalizedEntries.length > 0 ? Object.fromEntries(normalizedEntries) : undefined;
};

const normalizeUtilCall = (value: unknown): unknown => {
  if (!isRecord(value)) {
    return value;
  }

  const call = pickString(value.call, value.operation);
  if (!call) {
    return value;
  }

  return {
    call,
    args: normalizeActionArguments(value.arguments),
  };
};

const normalizeRekuestAction = (value: unknown): unknown => {
  if (isRekuestActionEnvelope(value) || !isRecord(value)) {
    return value;
  }

  const operationName = pickString(value.operationName, value.operation_name, value.operation);
  if (!operationName) {
    return value;
  }

  return {
    actionType: 'rekuestCall',
    operationName,
    targetDependencyKey: pickString(
      value.targetDependencyKey,
      value.target_dependency_key,
      value.dependency,
    ),
    arguments: normalizeActionArguments(value.arguments),
  };
};

const normalizePropValue = (prop: ComponentPropLike): unknown => {
  const utilCall = prop.utilCall ?? prop.util_call;
  if (utilCall !== undefined && utilCall !== null) {
    return normalizeUtilCall(utilCall);
  }

  const agentAction = prop.agentAction ?? prop.agent_action;
  if (agentAction !== undefined && agentAction !== null) {
    return normalizeRekuestAction(agentAction);
  }

  const agentCall = prop.agentCall ?? prop.agent_call;
  if (agentCall !== undefined && agentCall !== null) {
    return normalizeRekuestAction(agentCall);
  }

  const dynamicValue = prop.dynamicValue ?? prop.dynamic_value;
  if (dynamicValue !== undefined && dynamicValue !== null) {
    if (isRecord(dynamicValue)) {
      const literal = pickString(dynamicValue.literal);
      if (literal !== undefined) {
        return decodeJsonLiteralString(literal);
      }

      const path = pickString(dynamicValue.path);
      if (path) {
        return {path};
      }
    }

    return dynamicValue;
  }

  const staticValue = prop.staticValue ?? prop.static_value;
  return isString(staticValue) ? decodeJsonLiteralString(staticValue) : staticValue ?? null;
};

const normalizeComponentProps = (value: unknown): Record<string, unknown> => {
  if (!Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    value.flatMap(item => {
      if (!isRecord(item) || !isString(item.key)) {
        return [];
      }

      return [[item.key, normalizePropValue(item as ComponentPropLike)] as const];
    }),
  );
};

const normalizeGraphActionArgument = (
  value: unknown,
  fallbackKey?: string,
): ActionArgument | null => {
  if (!isRecord(value)) {
    return null;
  }

  const rawValueDict = value.valueDict ?? value.value_dict;
  const rawValueList = value.valueList ?? value.value_list;

  const valueDict = Array.isArray(rawValueDict)
    ? rawValueDict
        .flatMap((item, index) => normalizeGraphActionArgument(item, String(index)) ?? [])
    : null;
  const valueList = Array.isArray(rawValueList)
    ? rawValueList
        .flatMap(item => normalizeGraphActionArgument(item) ?? [])
    : null;

  return {
    __typename: 'ActionArgument',
    key: pickString(value.key, fallbackKey),
    agentCall: normalizeGraphAgentCall(value.agentCall ?? value.agent_call),
    utilCall: normalizeGraphUtilCall(value.utilCall ?? value.util_call),
    valueDict,
    valueList,
    valueLiteral: pickDefined(value.valueLiteral, value.value_literal, value.literal) as ActionArgument['valueLiteral'],
    valuePath: pickString(value.valuePath, value.value_path, value.path),
  };
};

const normalizeGraphAgentCall = (value: unknown): ComponentProp['agentCall'] => {
  if (!isRecord(value)) {
    return undefined;
  }

  const operation = pickString(value.operation, value.operationName, value.operation_name);
  const dependency = pickString(
    value.dependency,
    value.targetDependencyKey,
    value.target_dependency_key,
  );
  if (!operation || !dependency) {
    return undefined;
  }

  const argumentsList = Array.isArray(value.arguments)
    ? value.arguments.flatMap((item, index) => normalizeGraphActionArgument(item, String(index)) ?? [])
    : null;

  return {
    __typename: 'AgentCall',
    operation,
    dependency,
    arguments: argumentsList,
  };
};

const normalizeGraphUtilCall = (value: unknown): ComponentProp['utilCall'] => {
  if (!isRecord(value)) {
    return undefined;
  }

  const operation = pickString(value.operation, value.call);
  if (!operation) {
    return undefined;
  }

  const argumentsList = Array.isArray(value.arguments)
    ? value.arguments.flatMap((item, index) => normalizeGraphActionArgument(item, String(index)) ?? [])
    : null;

  return {
    __typename: 'UtilCall',
    operation,
    arguments: argumentsList,
  };
};

const normalizeGraphDynamicValue = (value: unknown): ComponentProp['dynamicValue'] => {
  if (!isRecord(value)) {
    return undefined;
  }

  const literal = pickString(value.literal);
  const path = pickString(value.path);
  if (literal === undefined && !path) {
    return undefined;
  }

  return {
    __typename: 'DynamicValue',
    literal,
    path,
  };
};

const normalizeGraphProps = (value: unknown): ComponentProp[] | null => {
  if (!Array.isArray(value)) {
    return null;
  }

  const normalizedProps = value.flatMap(item => {
    if (!isRecord(item) || !isString(item.key)) {
      return [];
    }

    const normalizedAgentCall = normalizeGraphAgentCall(
      item.agentAction ?? item.agent_action ?? item.agentCall ?? item.agent_call,
    );
    const staticValue = pickDefined(item.staticValue, item.static_value);
    const normalizedUtilCall = normalizeGraphUtilCall(item.utilCall ?? item.util_call);

    const prop: ComponentProp = {
      __typename: 'ComponentProp',
      key: item.key,
      staticValue: staticValue as ComponentProp['staticValue'],
      dynamicValue: normalizeGraphDynamicValue(item.dynamicValue ?? item.dynamic_value),
      agentCall: normalizedAgentCall,
      utilCall: normalizedUtilCall,
    };

    return [prop];
  });

  return normalizedProps.length > 0 ? normalizedProps : null;
};

const normalizeComponentNode = (component: unknown): ComponentNodeLike | null => {
  if (!isComponentNodeInput(component)) {
    return null;
  }

  const nestedChildren = Array.isArray(component.children)
    ? component.children.filter(isComponentNodeInput).map(child => normalizeComponentNode(child))
    : [];
  const normalizedChildren = nestedChildren.filter(
    (child): child is ComponentNodeLike => child !== null,
  );
  const hasNestedChildren = normalizedChildren.length > 0;

  const directProps = Object.fromEntries(
    Object.entries(component).filter(([key, value]) => {
      if (key === 'id' || key === 'component' || key === 'props') {
        return false;
      }

      if (key === 'children' && hasNestedChildren) {
        return false;
      }

      return value !== null;
    }),
  );

  const propsFromArray = normalizeComponentProps(component.props);
  const nestedProps = isRecord(component.props) ? component.props : undefined;
  const flattenedProps = nestedProps ? {...directProps, ...nestedProps} : directProps;
  const props = Array.isArray(component.props)
    ? {...directProps, ...propsFromArray}
    : flattenedProps;

  if ('props' in props) {
    delete props.props;
  }

  if (!('action' in props) && 'onClick' in props) {
    props.action = props.onClick;
  }

  if (hasNestedChildren && props.children === undefined) {
    props.children = normalizedChildren.map(child => child.id);
  }

  const raw: ComponentNode = {
    __typename: 'ComponentNode',
    id: component.id,
    component: component.component,
    children: normalizedChildren.length > 0 ? normalizedChildren.map(child => child.raw) : null,
    props: normalizeGraphProps(component.props),
  };

  return {
    id: component.id,
    component: component.component,
    props,
    children: normalizedChildren.length > 0 ? normalizedChildren : null,
    raw,
  };
};

const collectChildReferences = (
  value: unknown,
  allowDirectString = false,
): string[] => {
  if (allowDirectString && isString(value)) {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(item => collectChildReferences(item, true));
  }

  if (isRecord(value)) {
    if (isString(value.id)) {
      return [value.id];
    }

    if (isString(value.componentId)) {
      return [value.componentId];
    }
  }

  return [];
};

const extractUiComponents = (uiComponents: unknown): unknown[] => {
  if (Array.isArray(uiComponents)) {
    return uiComponents;
  }

  if (isRecord(uiComponents) && Array.isArray(uiComponents.uiComponents)) {
    return uiComponents.uiComponents;
  }

  return [];
};

const extractDemoState = (demoState: unknown, uiComponents: unknown): unknown => {
  if (demoState !== undefined) {
    return demoState;
  }

  if (isRecord(uiComponents) && 'demoState' in uiComponents) {
    return uiComponents.demoState;
  }

  return demoState;
};

const prepareComponents = (
  rawComponents: unknown[],
): PreflightResult => {
  const errors: ValidationError[] = [];
  const componentMap = new Map<string, PreparedComponent>();

  const normalizedRoots = rawComponents
    .map(component => normalizeComponentNode(component))
    .filter((component): component is ComponentNodeLike => component !== null);
  const rootIds = normalizedRoots.map(component => component.id);
  const declaredComponentIds = new Set<string>();

  const registerComponent = (component: ComponentNodeLike, basePath: string) => {
    declaredComponentIds.add(component.id);

    const catalogComponent = myCatalog.components.get(component.component);

    if (!catalogComponent) {
      errors.push({
        path: `${basePath}.component`,
        message: `Unknown component "${component.component}" in catalog ${myCatalog.id}.`,
      });
    } else {
      const schemaResult = catalogComponent.schema.safeParse(component.props);
      if (!schemaResult.success) {
        schemaResult.error.issues.forEach(issue => {
          errors.push({
            path: `${basePath}${issue.path.length ? `.${issue.path.join('.')}` : ''}`,
            message: issue.message,
          });
        });
      } else {
        componentMap.set(component.id, {
          id: component.id,
          component: component.component,
          raw: component.raw,
          props: schemaResult.data as Record<string, unknown>,
        });
      }
    }

    component.children?.forEach((child, index) => {
      registerComponent(child, `${basePath}.children[${index}]`);
    });
  };

  normalizedRoots.forEach((component, componentIndex) => {
    registerComponent(component, `uiComponents[${componentIndex}]`);
  });

  const componentIds = new Set(componentMap.keys());
  const pushChildReferenceError = (path: string, childId: string) => {
    if (!declaredComponentIds.has(childId)) {
      errors.push({
        path,
        message: `Referenced child "${childId}" is missing from the payload.`,
      });
      return;
    }

    if (!componentIds.has(childId)) {
      errors.push({
        path,
        message: `Referenced child "${childId}" exists in the payload but failed validation.`,
      });
    }
  };

  componentMap.forEach((component, componentId) => {
    const childFields = ['child', 'header', 'footer', 'content', 'trigger'] as const;
    childFields.forEach(field => {
      collectChildReferences(component.props[field], true).forEach(childId => {
        pushChildReferenceError(`component.${componentId}.${field}`, childId);
      });
    });

    collectChildReferences(component.props.children).forEach(childId => {
      pushChildReferenceError(`component.${componentId}.children`, childId);
    });
  });

  return {
    componentMap,
    rootIds: rootIds.filter(id => componentMap.has(id)),
    errors,
  };
};

export default function BlokRenderer({
  surfaceId = DEFAULT_SURFACE_ID,
  uiComponents,
  demoState,
  chrome = 'default',
  sizing = 'fill',
}: BlokRendererProps) {
  const extractedDemoState = extractDemoState(demoState, uiComponents);
  const prepared = useMemo(
    () => prepareComponents(extractUiComponents(uiComponents)),
    [uiComponents],
  );

  const runtimeStore = useMemo(() => {
    const store = createStore<BlokRuntimeContext>(() => ({
      dataModel: extractedDemoState,
      invokeFunction: (name, args) => myCatalog.invokeFunction(name, args, store.getState()),
      dispatchAction: (action, _component) => {
        if (isRekuestActionEnvelope(action)) {
          toast.info(
            action.targetDependencyKey
              ? `Preview action captured on ${surfaceId}: ${action.operationName} on ${action.targetDependencyKey}`
              : `Preview action captured on ${surfaceId}: ${action.operationName}`,
          );
          return;
        }

        if (isEventActionEnvelope(action)) {
          toast.info(`Preview event captured on ${surfaceId}: ${action.event.name}`);
        }
      },
    }));

    return store;
  }, [extractedDemoState, surfaceId]);

  const renderComponent = (componentId: string, trail: string[] = []): React.ReactNode => {
    if (trail.includes(componentId)) {
      return (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          Recursive child reference detected for component {componentId}.
        </div>
      );
    }

    const component = prepared.componentMap.get(componentId);
    if (!component) {
      return null;
    }

    const definition = myCatalog.components.get(component.component);
    if (!definition) {
      return null;
    }

    return (
      <BlokComponentRenderer
        definition={definition}
        props={{
          ...component.props,
          isValid: true,
          validationErrors: [],
        }}
        buildChild={(childId, _basePath) => renderComponent(childId, [...trail, componentId])}
        component={component.raw}
      />
    );
  };

  const sizingClassName =
    sizing === 'intrinsic'
      ? 'inline-flex max-w-full max-h-full flex-col overflow-auto'
      : 'h-full w-full overflow-auto';

  const containerClassName = cn(
    'a2ui-container',
    sizingClassName,
    chrome === 'minimal'
      ? 'rounded-xl border border-border/50 bg-background/90 p-1 shadow-sm'
      : 'rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur-sm',
  );

  const errorContainerClassName = cn(
    'a2ui-container',
    sizingClassName,
    chrome === 'minimal'
      ? 'rounded-xl border border-destructive/40 bg-background/95 p-2 shadow-sm'
      : 'rounded-2xl border border-destructive/40 bg-destructive/5 p-4 shadow-sm backdrop-blur-sm',
  );

  if (prepared.errors.length > 0) {
    return (
      <div className={errorContainerClassName}>
        <div className={cn('rounded-xl border border-destructive/30 bg-background/80 p-4', chrome === 'minimal' ? 'mb-2' : 'mb-4')}>
          <h3 className="text-sm font-semibold text-destructive">Blok Validation Failed</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            This blok payload does not match the registered blok component catalog, so rendering was skipped.
          </p>
        </div>

        <div className="space-y-3">
          {prepared.errors.map((error, index) => (
            <div
              key={`${error.path}-${index}`}
              className="rounded-xl border border-destructive/20 bg-background/80 p-3"
            >
              <div className="text-xs font-medium text-destructive">{error.path}</div>
              <div className="mt-1 text-sm text-foreground">{error.message}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <BlokRuntimeProvider store={runtimeStore}>
      <div className={containerClassName}>
        {prepared.rootIds.length === 0 && (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30 px-6 text-sm text-muted-foreground">
            No blok components available for this preview yet.
          </div>
        )}
        {prepared.rootIds.map(rootId => (
          <div key={rootId}>{renderComponent(rootId)}</div>
        ))}
      </div>
    </BlokRuntimeProvider>
  );
}
