import { useDialog } from "@/app/dialog";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import * as LucideIcons from "lucide-react";
import {
  AssignationEventFragment,
  DemandKind,
  ListImplementationFragment,
  PortDemandInput,
  PortKind,
  PrimaryActionFragment,
  useAllPrimaryActionsQuery,
  useImplementationsQuery,
} from "@/rekuest/api/graphql";
import { registeredCallbacks } from "@/rekuest/components/functional/AssignationUpdater";
import { useAssign } from "@/rekuest/hooks/useAssign";
import { Boxes, PlayCircle } from "lucide-react";
import { CommandActionRow } from "../CommandActionRow";
import type { PassDownProps, SmartContextProps } from "../types";

const toPascalCase = (value: string) =>
  value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const resolveActionLogo = (logo?: string | null) => {
  if (!logo || logo.startsWith("custom:")) {
    return null;
  }

  const candidates = [logo, toPascalCase(logo)];

  for (const candidate of candidates) {
    const icon = LucideIcons[candidate as keyof typeof LucideIcons];
    if (typeof icon === "function") {
      return icon as React.ComponentType<{ className?: string }>;
    }
  }

  return null;
};

const getActionVisual = (
  logo?: string | null,
  fallback?: React.ComponentType<{ className?: string }>,
) => {
  if (logo?.startsWith("custom:")) {
    return { svg: logo.slice("custom:".length), icon: undefined };
  }

  return {
    svg: undefined,
    icon: resolveActionLogo(logo) ?? fallback ?? PlayCircle,
  };
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown error";

const formatAssignErrorToast = (message: string) => ({
  title: "Assignment failed",
  detail: message,
});

const buildActionDemands = (
  props: PassDownProps,
  options?: { batch?: boolean },
): PortDemandInput[] => {
  const demands: PortDemandInput[] = [];

  if (props.objects.length > 0) {
    if (props.objects.length === 1 || options?.batch) {
      demands.push({
        kind: DemandKind.Args,
        matches: [
          {
            at: 0,
            kind: PortKind.Structure,
            identifier: props.objects[0].identifier,
            object: props.objects[0].object,
          },
        ],
      });
    } else {
      demands.push({
        kind: DemandKind.Args,
        matches: [
          {
            at: 0,
            kind: PortKind.List,
            children: [
              {
                at: 0,
                kind: PortKind.Structure,
                identifier: props.objects[0].identifier,
                object: props.objects[0].object,
              },
            ],
          },
        ],
      });
    }
  }

  if (props.partners && props.partners.length > 0) {
    if (props.partners.length === 1) {
      demands.push({
        kind: DemandKind.Args,
        matches: [
          {
            at: 1,
            kind: PortKind.Structure,
            identifier: props.partners[0].identifier,
            object: props.partners[0].object,
          },
        ],
      });
    } else {
      demands.push({
        kind: DemandKind.Args,
        matches: [
          {
            at: 1,
            kind: PortKind.List,
            children: [
              {
                at: 0,
                kind: PortKind.Structure,
                identifier: props.partners[0].identifier,
                object: props.partners[0].object,
              },
            ],
          },
        ],
      });
    }
  }

  if (props.returns) {
    demands.push({
      kind: DemandKind.Returns,
      matches: props.returns.map((identifier, index) => ({
        at: index,
        kind: PortKind.Structure,
        identifier,
      })),
    });
  }

  return demands;
};

const buildActionArgs = (
  action: PrimaryActionFragment,
  props: SmartContextProps,
): Record<string, unknown> | null => {
  const keys: Record<string, unknown> = {};

  if (props.objects.length === 1) {
    const key = action.args?.at(0)?.key;
    if (!key) {
      toast.error("No key found for self");
      return null;
    }
    keys[key] = {
      __identifier: props.objects[0].identifier,
      object: props.objects[0].object.id,
    };
  }

  if (props.objects.length > 1) {
    if (action.args.at(0)?.kind !== PortKind.List) {
      toast.error("Should be a list but is not");
      return null;
    }
    const key = action.args?.at(0)?.key;
    if (!key) {
      toast.error("No key found for self");
      return null;
    }
    keys[key] = props.objects.map((item) => ({
      __identifier: item.identifier,
      object: item.object.id,
    }));
  }

  if (props.partners && props.partners.length === 1) {
    const key = action.args?.at(1)?.key;
    if (!key) {
      toast.error("No key found for partner");
      return null;
    }
    keys[key] = {
      __identifier: props.partners[0].identifier,
      object: props.partners[0].object.id,
    };
  }

  if (props.partners && props.partners.length > 1) {
    if (action.args.at(1)?.kind !== PortKind.List) {
      toast.error("Should be a list but is not");
      return null;
    }
    const key = action.args?.at(1)?.key;
    if (!key) {
      toast.error("No key found for partner");
      return null;
    }
    keys[key] = props.partners.map((item) => ({
      __identifier: item.identifier,
      object: item.object.id,
    }));
  }

  return keys;
};

export const DirectImplementationAssignment = (
  props: SmartContextProps & { action: PrimaryActionFragment },
) => {
  const implementations = useImplementationsQuery({
    variables: {
      filters: {
        actionHash: props.action.hash,
      },
    },
  });
  const { assign } = useAssign();
  const { openDialog } = useDialog();

  const onTemplateSelect = async (
    action: PrimaryActionFragment,
    implementation: ListImplementationFragment,
  ) => {
    const key = action.args?.at(0)?.key;
    const firstObject = props.objects[0];

    if (!key || !firstObject) {
      toast.error("No key found");
      return;
    }

    if (action.args.length > 1) {
      openDialog("implementationassign", {
        id: implementation.id,
        args: { [key]:  {"__identifier": firstObject.identifier, object: firstObject.object.id},},
        hidden: { [key]:  {"__identifier": firstObject.identifier, object: firstObject.object.id},},
      });
      return;
    }

    try {
      const reference = uuidv4();

      await assign({
        implementation: implementation.id,
        args: {
          [key]: {"__identifier": firstObject.identifier, object: firstObject.object.id},
        },
        cached: false,
        capture: false,
        ephemeral: props.ephemeral ?? false,
        log: false,
        reference,
      });

      registeredCallbacks.set(reference, (event) => {
        props.onDone?.({ event, kind: "action" });
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <div className="flex flex-row text-xs">Run on</div>
      <div className="flex flex-col gap-2">
        {implementations.data?.implementations.map((implementation) => (
          <Button
            key={implementation.id}
            variant="outline"
            size="lg"
            className="flex flex-col gap-1"
            onClick={() => onTemplateSelect(props.action, implementation)}
          >
            <div className="text-md text-gray-100">{implementation.agent.name}</div>
            <div className="text-xs text-gray-400">{implementation.interface}</div>
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        className="mt-2"
        onClick={() => {
          const firstObject = props.objects[0];
          if (!firstObject) {
            return;
          }
          openDialog("createshortcut", {
            id: props.action.id,
            args: {
              [props.action.args?.at(0)?.key || "object"]: {
                __identifier: firstObject.identifier,
                object: firstObject.object,
              },
            },
          });
        }}
      >
        Create Shortcut
      </Button>
    </>
  );
};

const useAssignActionProgress = (props: SmartContextProps) => {
  const [doing, setDoing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<number | null>(0);
  const [errorFlashActive, setErrorFlashActive] = React.useState(false);
  const errorFlashTimeoutRef = React.useRef<number | null>(null);

  const triggerErrorFeedback = React.useCallback(
    (message: string) => {
      setDoing(false);
      setProgress(null);
      setError(message);
      setErrorFlashActive(true);
      props.onError?.(message);

      if (errorFlashTimeoutRef.current) {
        window.clearTimeout(errorFlashTimeoutRef.current);
      }

      errorFlashTimeoutRef.current = window.setTimeout(() => {
        setErrorFlashActive(false);
        errorFlashTimeoutRef.current = null;
      }, 700);
    },
    [props],
  );

  React.useEffect(() => {
    return () => {
      if (errorFlashTimeoutRef.current) {
        window.clearTimeout(errorFlashTimeoutRef.current);
      }
    };
  }, []);

  const onEvent = React.useCallback(
    (event: AssignationEventFragment) => {
      if (event.kind === "DONE") {
        setDoing(false);
        setProgress(null);
        setError(null);
        props.onDone?.({ event, kind: "action" });
      }
      if (event.kind === "ERROR" || event.kind === "CRITICAL") {
        const message = event.message || "Unknown error";
        triggerErrorFeedback(message);
      }
      if (event.kind === "PROGRESS") {
        setProgress(event.progress || 0);
      }
    },
    [props, triggerErrorFeedback],
  );

  return {
    doing,
    error,
    errorFlashActive,
    progress,
    setDoing,
    setError,
    onEvent,
    triggerErrorFeedback,
  };
};

export const AssignButton = (
  props: SmartContextProps & { action: PrimaryActionFragment },
) => {
  const { assign } = useAssign();
  const { openDialog } = useDialog();
  const {
    doing,
    error,
    errorFlashActive,
    progress,
    setDoing,
    setError,
    onEvent,
    triggerErrorFeedback,
  } =
    useAssignActionProgress(props);

  const conditionalAssign = async (action: PrimaryActionFragment) => {
    const keys = buildActionArgs(action, props);
    if (!keys) {
      return;
    }

    const unknownKeys = action.args.filter((arg) => arg.key && !keys[arg.key]);
    if (unknownKeys.length >= 1) {
      openDialog("actionassign", {
        id: action.id,
        args: keys,
        hidden: keys,
      });
      return;
    }

    try {
      const reference = uuidv4();
      registeredCallbacks.set(reference, onEvent);

      await assign({
        action: action.id,
        args: keys,
        cached: false,
        capture: false,
        reference,
        ephemeral: props.ephemeral ?? false,
        log: false,
      });

      setDoing(true);
      setError(null);
    } catch (error) {
      const message = getErrorMessage(error);
      triggerErrorFeedback(message);
    }
  };

  const inlineErrorToast = error ? formatAssignErrorToast(error) : null;

  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger asChild>
        <CommandActionRow
          onSelect={() => conditionalAssign(props.action)}
          value={props.action.id}
          title={props.action.name}
          description={props.action.description}
          progress={progress}
          className={cn(
            doing && "animate-pulse",
            errorFlashActive &&
              "bg-red/20 data-selected:bg-red-500/20 text-destructive ring-1 ring-inset ring-destructive/35 transition-colors duration-150",
          )}
          {...getActionVisual(props.action.logo, PlayCircle)}
        />
      </ContextMenuTrigger>
      <ContextMenuContent className="text-white border-gray-800 px-2 py-2 items-center">
        <DirectImplementationAssignment {...props} action={props.action} />
      </ContextMenuContent>
    </ContextMenu>
  );
};

export const BatchAssignButton = (
  props: SmartContextProps & { action: PrimaryActionFragment },
) => {
  const { assign } = useAssign();
  const { openDialog } = useDialog();
  const {
    doing,
    error,
    errorFlashActive,
    progress,
    setDoing,
    setError,
    onEvent,
    triggerErrorFeedback,
  } =
    useAssignActionProgress(props);

  const conditionalAssign = async (action: PrimaryActionFragment) => {
    const key = action.args?.at(0)?.key;
    if (!key) {
      toast.error("No key found for self");
      return;
    }

    for (const object of props.objects) {
      const keys: Record<string, unknown> = { [key]: {__identifier: object.identifier, object: object.object.id } };

      if (props.partners && props.partners.length === 1) {
        const partnerKey = action.args?.at(1)?.key;
        if (!partnerKey) {
          toast.error("No key found for partner");
          return;
        }
        keys[partnerKey] = {
          __identifier: props.partners[0].identifier,
          object: props.partners[0].object.id,
        };
      }

      if (props.partners && props.partners.length > 1) {
        if (action.args.at(1)?.kind !== PortKind.List) {
          toast.error("Should be a list but is not");
          return;
        }
        const partnerKey = action.args?.at(1)?.key;
        if (!partnerKey) {
          toast.error("No key found for partner");
          return;
        }
        keys[partnerKey] = props.partners.map((partner) => ({
          __identifier: partner.identifier,
          object: partner.object.id,
        }));
      }

      const unknownKeys = action.args.filter((arg) => arg.key && !keys[arg.key]);
      if (unknownKeys.length >= 1) {
        openDialog("actionassign", {
          id: action.id,
          args: keys,
          hidden: keys,
        });
        return;
      }

      try {
        const reference = uuidv4();
        await assign({
          action: action.id,
          args: keys,
          cached: false,
          capture: false,
          reference,
          ephemeral: props.ephemeral ?? false,
          log: false,
        });
        registeredCallbacks.set(reference, onEvent);
        setDoing(true);
        setError(null);
      } catch (error) {
        const message = getErrorMessage(error);
        triggerErrorFeedback(message);
      }
    }
  };

  const inlineErrorToast = error ? formatAssignErrorToast(error) : null;

  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger asChild>
        <CommandActionRow
          onSelect={() => conditionalAssign(props.action)}
          value={props.action.id}
          title={props.action.name}
          description={props.action.description}
          progress={progress}
          className={cn(
            doing && "animate-pulse",
            errorFlashActive &&
              "bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/35 transition-colors duration-150",
          )}
          trailing={
            <span className="ml-auto flex items-center gap-2">
              {inlineErrorToast ? (
                <span className="max-w-48 rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-right text-[10px] leading-tight text-destructive">
                  <span className="block font-medium">{inlineErrorToast.title}</span>
                  <span className="block truncate">{inlineErrorToast.detail}</span>
                </span>
              ) : null}
            </span>
          }
          {...getActionVisual(props.action.logo, Boxes)}
        />
      </ContextMenuTrigger>
      <ContextMenuContent className="text-white border-gray-800 px-2 py-2 items-center">
        <DirectImplementationAssignment {...props} action={props.action} />
      </ContextMenuContent>
    </ContextMenu>
  );
};

export const ApplicableBatchActions = (props: PassDownProps) => {
  const { data, error } = useAllPrimaryActionsQuery({
    variables: {
      filters: {
        demands: buildActionDemands(props, { batch: true }),
        search: props.filter && props.filter !== "" ? props.filter : undefined,
        inCollection: props.collection,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  if (error) {
    return <span className="font-light text-xs w-full items-center ml-2 w-full">Error</span>;
  }

  if (props.objects.length < 2) {
    return null;
  }

  if (!data || data.actions.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="font-light text-xs w-full items-center ml-2 w-full inline-flex gap-2">

        <span>Batch</span>
      </div>
      {data.actions.map((action) => (
        <BatchAssignButton action={action} {...props} key={action.id} />
      ))}
    </div>
  );
};

export const ApplicableActions = (props: PassDownProps) => {
  const { data, error } = useAllPrimaryActionsQuery({
    variables: {
      filters: {
        demands: buildActionDemands(props),
        search: props.filter && props.filter !== "" ? props.filter : undefined,
        inCollection: props.collection,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  if (error) {
    return <span className="font-light text-xs w-full items-center ml-2 w-full">Error</span>;
  }

  if (!data || data.actions.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="font-light text-xs w-full items-center ml-2 w-full inline-flex gap-2">

        <span>Run</span>
      </div>
      {data.actions.map((action) => (
        <AssignButton action={action} {...props} key={action.id} />
      ))}
    </div>
  );
};
