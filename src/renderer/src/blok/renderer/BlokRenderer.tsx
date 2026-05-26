import {useEffect, useMemo} from 'react';
import {cn} from '@/lib/utils';
import {toast} from 'sonner';
import {createStore} from 'zustand/vanilla';
import BlokDebugState from './BlokDebugState';
import {myCatalog} from './catalog';
import {
  BlokComponentRenderer,
  BlokSchemas,
  BlokRuntimeProvider,
  type BlokComponentNode,
  type BlokComponentProp,
  type BlokRuntimeContext,
} from './runtime';

type BlokRendererProps = {
  surfaceId?: string;
  uiComponents?: unknown;
  demoState?: unknown;
  state?: unknown;
  chrome?: 'default' | 'minimal';
  sizing?: 'fill' | 'intrinsic';
};

const DEFAULT_SURFACE_ID = 'blok-preview';

type ValidationError = {
  path: string;
  message: string;
};

type PreparedComponent = {
  id: string;
  component: string;
  raw: BlokComponentNode;
  props: ReadonlyArray<BlokComponentProp>;
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
} => {
  return isRecord(value) && isString(value.id) && isString(value.component);
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

const mergeState = (demoState: unknown, state: unknown): unknown => {
  if (!isRecord(demoState) || !isRecord(state)) {
    return state ?? demoState;
  }

  return {
    ...demoState,
    ...state,
  };
};

const prepareComponents = (
  rawComponents: unknown[],
): PreflightResult => {
  const errors: ValidationError[] = [];
  const componentMap = new Map<string, PreparedComponent>();
  const rootIds: string[] = [];
  const declaredComponentIds = new Set<string>();

  const registerComponent = (component: BlokComponentNode, basePath: string) => {
    declaredComponentIds.add(component.id);

    const catalogComponent = myCatalog.components.get(component.component);
    if (!catalogComponent) {
      errors.push({
        path: `${basePath}.component`,
        message: `Unknown component "${component.component}" in catalog ${myCatalog.id}.`,
      });
    } else {
      const allowedKeys = new Set(Object.keys(catalogComponent.schema.shape));
      const componentProps = component.props ?? [];
      const invalidProps = componentProps.filter(prop => !allowedKeys.has(prop.key));
      const requiredProps = Object.entries(catalogComponent.schema.shape)
        .filter(([key, fieldSchema]) => {
          if (key === 'children' && component.children?.length) {
            return false;
          }

          return fieldSchema.safeParse(undefined).success === false;
        })
        .map(([key]) => key);
      const missingProps = requiredProps.filter(
        key => componentProps.some(prop => prop.key === key) === false,
      );

      invalidProps.forEach(prop => {
        errors.push({
          path: `${basePath}.props.${prop.key}`,
          message: `Unknown prop "${prop.key}" for component "${component.component}".`,
        });
      });

      missingProps.forEach(key => {
        errors.push({
          path: `${basePath}.props.${key}`,
          message: `Missing required prop "${key}" for component "${component.component}".`,
        });
      });

      if (invalidProps.length === 0 && missingProps.length === 0) {
        componentMap.set(component.id, {
          id: component.id,
          component: component.component,
          raw: component,
          props: componentProps,
        });
      }
    }

    component.children?.forEach((child, index) => {
      registerComponent(child, `${basePath}.children[${index}]`);
    });
  };

  rawComponents.forEach((rawComponent, componentIndex) => {
    if (!isComponentNodeInput(rawComponent)) {
      errors.push({
        path: `uiComponents[${componentIndex}]`,
        message: 'Invalid component node payload.',
      });
      return;
    }

    const schemaResult = BlokSchemas.ComponentNode.safeParse(rawComponent);
    if (!schemaResult.success) {
      schemaResult.error.issues.forEach(issue => {
        errors.push({
          path: `uiComponents[${componentIndex}]${issue.path.length ? `.${issue.path.join('.')}` : ''}`,
          message: issue.message,
        });
      });
      return;
    }

    rootIds.push(schemaResult.data.id);
    registerComponent(schemaResult.data, `uiComponents[${componentIndex}]`);
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
  state,
  chrome = 'default',
  sizing = 'fill',
}: BlokRendererProps) {
  const extractedDemoState = extractDemoState(demoState, uiComponents);
  const initialRuntimeState = useMemo(
    () => (extractedDemoState !== undefined ? extractedDemoState : state),
    [extractedDemoState, state],
  );
  const resolvedState = useMemo(
    () => mergeState(extractedDemoState, state),
    [extractedDemoState, state],
  );
  const prepared = useMemo(
    () => prepareComponents(extractUiComponents(uiComponents)),
    [uiComponents],
  );

  console.log('BlokRenderer: resolvedState', resolvedState);

  const runtimeStore = useMemo(() => {
    const store = createStore<BlokRuntimeContext>(() => ({
      dataModel: initialRuntimeState,
      pathAliases: {},
      invokeFunction: (name, args) => myCatalog.invokeFunction(name, args, store.getState()),
      dispatchAction: action => {
        toast.info(
          action.dependency
            ? `Preview action captured on ${surfaceId}: ${action.operation} on ${action.dependency}`
            : `Preview action captured on ${surfaceId}: ${action.operation}`,
        );
      },
    }));

    return store;
  }, [initialRuntimeState, surfaceId]);

  useEffect(() => {
    runtimeStore.setState(current => ({
      ...current,
      dataModel: resolvedState,
    }));
  }, [resolvedState, runtimeStore]);

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
        props={component.props}
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
    'a2ui-container relative',
    sizingClassName,
    chrome === 'minimal'
      ? 'rounded-xl border border-border/50 bg-background/90 p-1 shadow-sm'
      : 'rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur-sm',
  );

  const errorContainerClassName = cn(
    'a2ui-container relative',
    sizingClassName,
    chrome === 'minimal'
      ? 'rounded-xl border border-destructive/40 bg-background/95 p-2 shadow-sm'
      : 'rounded-2xl border border-destructive/40 bg-destructive/5 p-4 shadow-sm backdrop-blur-sm',
  );

  if (prepared.errors.length > 0) {
    return (
      <BlokRuntimeProvider store={runtimeStore}>
        <div className={errorContainerClassName}>
          <BlokDebugState surfaceId={surfaceId} />
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
      </BlokRuntimeProvider>
    );
  }

  return (
    <BlokRuntimeProvider store={runtimeStore}>
      <div className={containerClassName}>
        <BlokDebugState surfaceId={surfaceId} />
        {prepared.rootIds.length === 0 && (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30 px-6 text-sm text-muted-foreground">
            No blok components available for this preview yet.
          </div>
        )}

        {prepared.rootIds.map(rootId => (
          <div key={rootId} className="min-w-0">
            {renderComponent(rootId)}
          </div>
        ))}
      </div>
    </BlokRuntimeProvider>
  );
}
