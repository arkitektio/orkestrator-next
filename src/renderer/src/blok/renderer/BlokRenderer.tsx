import {useEffect, useMemo, useState} from 'react';
import {MessageProcessor, type A2uiMessage} from '@a2ui/web_core/v0_9';
import {A2uiSurface} from '@a2ui/react/v0_9';
import { myCatalog } from './catalog';

type BlokRendererProps = {
  surfaceId?: string;
  uiComponents?: unknown;
  demoState?: unknown;
};

const DEFAULT_SURFACE_ID = 'blok-preview';

type ValidationError = {
  path: string;
  message: string;
};

type PreflightResult = {
  messages: A2uiMessage[];
  errors: ValidationError[];
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

const ensureRootComponent = (components: unknown[]): unknown[] => {
  if (components.length === 0) {
    return components;
  }

  const hasRoot = components.some(
    component => isRecord(component) && component.id === 'root',
  );

  if (hasRoot) {
    return components;
  }

  const firstComponent = components.find(isRecord);
  if (!firstComponent) {
    return components;
  }

  return [{...firstComponent, id: 'root'}, ...components];
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

const validateMessages = (messages: A2uiMessage[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  messages.forEach((message, messageIndex) => {
    if (!('updateComponents' in message)) {
      return;
    }

    const components = message.updateComponents.components as unknown[];
    const componentIds = new Set(
      components
        .filter(isRecord)
        .map(component => component.id)
        .filter(isString),
    );

    components.forEach((component, componentIndex) => {
      const basePath = `messages[${messageIndex}].updateComponents.components[${componentIndex}]`;

      if (!isRecord(component)) {
        errors.push({
          path: basePath,
          message: 'Component must be an object.',
        });
        return;
      }

      if (!isString(component.component)) {
        errors.push({
          path: `${basePath}.component`,
          message: 'Component name must be a string.',
        });
        return;
      }

      if (!isString(component.id)) {
        errors.push({
          path: `${basePath}.id`,
          message: 'Component id must be a string.',
        });
      }

      const catalogComponent = myCatalog.components.get(component.component);
      if (!catalogComponent) {
        errors.push({
          path: `${basePath}.component`,
          message: `Unknown component "${component.component}" in catalog ${myCatalog.id}.`,
        });
        return;
      }

      const schemaResult = catalogComponent.schema.safeParse(component);
      if (!schemaResult.success) {
        schemaResult.error.issues.forEach(issue => {
          errors.push({
            path: `${basePath}${issue.path.length ? `.${issue.path.join('.')}` : ''}`,
            message: issue.message,
          });
        });
      }

      const childFields = ['child', 'children', 'header', 'footer', 'content', 'trigger'];
      childFields.forEach(field => {
        collectChildReferences(component[field]).forEach(childId => {
          if (!componentIds.has(childId)) {
            errors.push({
              path: `${basePath}.${field}`,
              message: `Referenced child "${childId}" is missing from the component list.`,
            });
          }
        });
      });
    });
  });

  return errors;
};

const isEnvelopeMessage = (value: unknown): value is A2uiMessage => {
  return (
    isRecord(value) &&
    value.version === 'v0.9' &&
    ('createSurface' in value ||
      'updateComponents' in value ||
      'updateDataModel' in value ||
      'deleteSurface' in value)
  );
};

const normalizeMessage = (
  message: A2uiMessage,
  surfaceId: string,
): A2uiMessage => {
  if ('createSurface' in message) {
    return {
      ...message,
      createSurface: {
        ...message.createSurface,
        surfaceId: String(message.createSurface.surfaceId ?? surfaceId),
        catalogId: myCatalog.id,
      },
    };
  }

  if ('updateComponents' in message) {
    const components = ensureRootComponent(
      message.updateComponents.components as unknown[],
    );

    return {
      ...message,
      updateComponents: {
        ...message.updateComponents,
        surfaceId: String(message.updateComponents.surfaceId ?? surfaceId),
        components: components as never,
      },
    };
  }

  if ('updateDataModel' in message) {
    return {
      ...message,
      updateDataModel: {
        ...message.updateDataModel,
        surfaceId: String(message.updateDataModel.surfaceId ?? surfaceId),
      },
    };
  }

  if ('deleteSurface' in message) {
    return {
      ...message,
      deleteSurface: {
        ...message.deleteSurface,
        surfaceId: String(message.deleteSurface.surfaceId ?? surfaceId),
      },
    };
  }

  return message;
};

const buildMessages = (
  surfaceId: string,
  uiComponents: unknown,
  demoState: unknown,
): A2uiMessage[] => {
  const baseMessages: A2uiMessage[] = [
    {
      version: 'v0.9',
      createSurface: {surfaceId, catalogId: myCatalog.id},
    },
  ];

  if (Array.isArray(uiComponents)) {
    if (uiComponents.every(isEnvelopeMessage)) {
      return uiComponents.map(message => normalizeMessage(message, surfaceId));
    }

    return [
      ...baseMessages,
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId,
          components: ensureRootComponent(uiComponents) as never,
        },
      },
      ...(demoState === undefined
        ? []
        : [
            {
              version: 'v0.9' as const,
              updateDataModel: {
                surfaceId,
                value: demoState,
              },
            },
          ]),
    ];
  }

  if (isEnvelopeMessage(uiComponents)) {
    return [normalizeMessage(uiComponents, surfaceId)];
  }

  if (isRecord(uiComponents)) {
    const nestedMessages = uiComponents.messages;
    if (Array.isArray(nestedMessages) && nestedMessages.every(isEnvelopeMessage)) {
      return nestedMessages.map(message => normalizeMessage(message, surfaceId));
    }

    const nestedComponents = uiComponents.components;
    const nestedState = uiComponents.demoState ?? uiComponents.dataModel ?? demoState;
    if (Array.isArray(nestedComponents)) {
      return [
        ...baseMessages,
        {
          version: 'v0.9',
          updateComponents: {
            surfaceId,
            components: ensureRootComponent(nestedComponents) as never,
          },
        },
        ...(nestedState === undefined
          ? []
          : [
              {
                version: 'v0.9' as const,
                updateDataModel: {
                  surfaceId,
                  value: nestedState,
                },
              },
            ]),
      ];
    }
  }

  return baseMessages;
};

const preflightMessages = (
  surfaceId: string,
  uiComponents: unknown,
  demoState: unknown,
): PreflightResult => {
  const messages = buildMessages(surfaceId, uiComponents, demoState);
  return {
    messages,
    errors: validateMessages(messages),
  };
};

export default function BlokRenderer({
  surfaceId = DEFAULT_SURFACE_ID,
  uiComponents,
  demoState,
}: BlokRendererProps) {
  const {messages, errors} = useMemo(
    () => preflightMessages(surfaceId, uiComponents, demoState),
    [demoState, surfaceId, uiComponents],
  );

  const processor = useMemo(() => {
    if (errors.length > 0) {
      return null;
    }

    const nextProcessor = new MessageProcessor([myCatalog]);
    nextProcessor.processMessages(messages);
    return nextProcessor;
  }, [errors.length, messages]);

  const [surfaces, setSurfaces] = useState(() =>
    processor ? Array.from(processor.model.surfacesMap.values()) : [],
  );

  useEffect(() => {
    if (!processor) {
      return;
    }

    let cancelled = false;
    const sync = () => {
      if (!cancelled) {
        setSurfaces(Array.from(processor.model.surfacesMap.values()));
      }
    };

    queueMicrotask(sync);

    const createdSub = processor.onSurfaceCreated(sync);
    const deletedSub = processor.onSurfaceDeleted(sync);

    return () => {
      cancelled = true;
      createdSub.unsubscribe();
      deletedSub.unsubscribe();
    };
  }, [processor]);

  if (errors.length > 0) {
    return (
      <div className="a2ui-container h-full w-full overflow-auto rounded-2xl border border-destructive/40 bg-destructive/5 p-4 shadow-sm backdrop-blur-sm">
        <div className="mb-4 rounded-xl border border-destructive/30 bg-background/80 p-4">
          <h3 className="text-sm font-semibold text-destructive">Catalog Validation Failed</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            This blok payload does not match the registered A2UI catalog, so rendering was skipped.
          </p>
        </div>

        <div className="space-y-3">
          {errors.map((error, index) => (
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
      {surfaces.length === 0 && (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30 px-6 text-sm text-muted-foreground">
          No A2UI surface available for this blok yet.
        </div>
      )}
      {surfaces.map(surface => (
        <A2uiSurface key={surface.id} surface={surface} />
      ))}
    </div>
  );
}
