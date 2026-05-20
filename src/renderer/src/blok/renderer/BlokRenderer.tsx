import {useMemo} from 'react';
import type {ComponentNode} from '@/rekuest/api/graphql';
import {toast} from 'sonner';
import { myCatalog } from './catalog';
import type {BlokRuntimeContext} from './runtime';

type BlokRendererProps = {
  surfaceId?: string;
  components?: ComponentNode[] | null;
  uiComponents?: unknown;
  demoState?: unknown;
};

const DEFAULT_SURFACE_ID = 'blok-preview';

type ValidationError = {
  path: string;
  message: string;
};

type ComponentNodeLike = {
  id: string;
  component: string;
  children?: string[] | null;
  props?: Record<string, unknown> | null;
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
  runtimeContext: BlokRuntimeContext;
  errors: ValidationError[];
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

const isFunctionCallEnvelope = (
  value: unknown,
): value is {
  call: string;
  args?: Record<string, unknown>;
} => {
  return (
    isRecord(value) &&
    isString(value.call)
  );
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

  if (isRecord(value) && isString(value.path)) {
    return getValueAtPath(runtimeContext.dataModel, value.path);
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
  if (isRekuestActionEnvelope(action)) {
    runtimeContext.dispatchAction(action, component);
    return;
  }

  if (isEventActionEnvelope(action)) {
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

const normalizeComponentNode = (component: unknown): ComponentNodeLike | null => {
  if (!isRecord(component) || !isString(component.id) || !isString(component.component)) {
    return null;
  }

  const nestedProps = isRecord(component.props) ? component.props : undefined;
  const flattenedComponent = nestedProps ? {...component, ...nestedProps} : {...component};

  if ('props' in flattenedComponent) {
    delete flattenedComponent.props;
  }

  if (!('action' in flattenedComponent) && 'onClick' in flattenedComponent) {
    flattenedComponent.action = flattenedComponent.onClick;
  }

  const children = Array.isArray(flattenedComponent.children)
    ? flattenedComponent.children.filter(isString)
    : undefined;

  const props = Object.fromEntries(
    Object.entries(flattenedComponent).filter(([key]) => key !== 'id' && key !== 'component'),
  );

  return {
    id: component.id,
    component: component.component,
    children,
    props,
  };
};

const collectChildReferences = (value: unknown): string[] => {
  if (isString(value)) {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(item => collectChildReferences(item));
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

const extractComponents = (
  components: ComponentNode[] | null | undefined,
  uiComponents: unknown,
): unknown[] => {
  if (Array.isArray(components) && components.length > 0) {
    return components;
  }

  if (Array.isArray(uiComponents)) {
    return uiComponents;
  }

  if (isRecord(uiComponents) && Array.isArray(uiComponents.components)) {
    return uiComponents.components;
  }

  return [];
};

const prepareComponents = (
  surfaceId: string,
  rawComponents: unknown[],
  demoState: unknown,
): PreflightResult => {
  const errors: ValidationError[] = [];
  const componentMap = new Map<string, PreparedComponent>();

  const runtimeContext: BlokRuntimeContext = {
    dataModel: demoState,
    invokeFunction: (name, args) =>
      myCatalog.invokeFunction(name, args, runtimeContext),
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
  };

  const normalizedComponents = rawComponents
    .map(component => normalizeComponentNode(component))
    .filter((component): component is ComponentNodeLike => component !== null);

  normalizedComponents.forEach((component, componentIndex) => {
    const basePath = `components[${componentIndex}]`;
    const catalogComponent = myCatalog.components.get(component.component);

    if (!catalogComponent) {
      errors.push({
        path: `${basePath}.component`,
        message: `Unknown component "${component.component}" in catalog ${myCatalog.id}.`,
      });
      return;
    }

    const graphComponent: ComponentNode = {
      __typename: 'ComponentNode',
      id: component.id,
      component: component.component,
      children: component.children ?? null,
      props: component.props ?? null,
    };

    const resolvedProps = Object.fromEntries(
      Object.entries(component.props ?? {}).map(([key, value]) => {
        if (key === 'children') {
          return [key, value];
        }

        if (isActionValue(value)) {
          return [key, createActionHandler(value, graphComponent, runtimeContext)];
        }

        return [key, resolveDynamicValue(value, runtimeContext)];
      }),
    );

    const schemaResult = catalogComponent.schema.safeParse(resolvedProps);
    if (!schemaResult.success) {
      schemaResult.error.issues.forEach(issue => {
        errors.push({
          path: `${basePath}${issue.path.length ? `.${issue.path.join('.')}` : ''}`,
          message: issue.message,
        });
      });
      return;
    }

    componentMap.set(component.id, {
      id: component.id,
      component: component.component,
      raw: graphComponent,
      props: schemaResult.data,
    });
  });

  const componentIds = new Set(componentMap.keys());
  componentMap.forEach((component, componentId) => {
    const childFields = ['child', 'children', 'header', 'footer', 'content', 'trigger'];
    childFields.forEach(field => {
      collectChildReferences(component.props[field]).forEach(childId => {
        if (!componentIds.has(childId)) {
          errors.push({
            path: `component.${componentId}.${field}`,
            message: `Referenced child "${childId}" is missing from the component list.`,
          });
        }
      });
    });
  });

  const referencedChildren = new Set<string>();
  componentMap.forEach(component => {
    collectChildReferences(component.props.children).forEach(childId => referencedChildren.add(childId));
    ['child', 'header', 'footer', 'content', 'trigger'].forEach(field => {
      collectChildReferences(component.props[field]).forEach(childId => referencedChildren.add(childId));
    });
  });

  const rootIds = componentMap.has('root')
    ? ['root']
    : Array.from(componentMap.keys()).filter(id => !referencedChildren.has(id));

  return {
    componentMap,
    rootIds,
    runtimeContext,
    errors,
  };
};

export default function BlokRenderer({
  surfaceId = DEFAULT_SURFACE_ID,
  components,
  uiComponents,
  demoState,
}: BlokRendererProps) {
  const prepared = useMemo(
    () => prepareComponents(surfaceId, extractComponents(components, uiComponents), demoState),
    [components, demoState, surfaceId, uiComponents],
  );

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

    return definition.render({
      props: {
        ...component.props,
        isValid: true,
        validationErrors: [],
      },
      buildChild: (childId, _basePath) => renderComponent(childId, [...trail, componentId]),
      component: component.raw,
      context: prepared.runtimeContext,
    });
  };

  if (prepared.errors.length > 0) {
    return (
      <div className="a2ui-container h-full w-full overflow-auto rounded-2xl border border-destructive/40 bg-destructive/5 p-4 shadow-sm backdrop-blur-sm">
        <div className="mb-4 rounded-xl border border-destructive/30 bg-background/80 p-4">
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
    <div className="a2ui-container h-full w-full overflow-auto rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur-sm">
      {prepared.rootIds.length === 0 && (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30 px-6 text-sm text-muted-foreground">
          No blok components available for this preview yet.
        </div>
      )}
      {prepared.rootIds.map(rootId => (
        <div key={rootId}>{renderComponent(rootId)}</div>
      ))}
    </div>
  );
}
