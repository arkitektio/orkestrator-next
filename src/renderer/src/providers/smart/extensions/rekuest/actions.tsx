import { useDialog } from "@/app/dialog";
import { Button } from "@/components/ui/button";
import { CommandItem, CommandList } from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import React from "react";
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
import type { PassDownProps, SmartContextProps } from "../types";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown error";

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

  const onEvent = React.useCallback(
    (event: AssignationEventFragment) => {
      if (event.kind === "DONE") {
        setDoing(false);
        setProgress(null);
        props.onDone?.({ event, kind: "action" });
      }
      if (event.kind === "ERROR" || event.kind === "CRITICAL") {
        const message = event.message || "Unknown error";
        setDoing(false);
        setProgress(null);
        setError(message);
        props.onError?.(message);
      }
      if (event.kind === "PROGRESS") {
        setProgress(event.progress || 0);
      }
    },
    [props],
  );

  return { doing, error, progress, setDoing, setError, onEvent };
};

export const AssignButton = (
  props: SmartContextProps & { action: PrimaryActionFragment },
) => {
  const { assign } = useAssign();
  const { openDialog } = useDialog();
  const { doing, error, progress, setDoing, setError, onEvent } =
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
        reference,
        ephemeral: props.ephemeral,
      });

      setDoing(true);
      setError(null);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      setDoing(false);
      setError(message);
    }
  };

  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger asChild>
        <CommandItem
          onSelect={() => conditionalAssign(props.action)}
          value={props.action.id}
          className={cn(
            "flex-grow flex flex-col group cursor-pointer",
            doing && "animate-pulse",
            error && "border border-1 border-red-200",
          )}
          style={{
            backgroundSize: `${progress || 0}% 100%`,
            backgroundImage: `linear-gradient(to right, #10b981 ${progress}%, #10b981 ${progress}%)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
          }}
        >
          <span className="mr-auto text-md text-gray-100">
            {props.action.name} {error && <span className="text-red-800">{error}</span>}
          </span>
          <span className="mr-auto text-xs text-gray-400">
            {props.action.description}
          </span>
        </CommandItem>
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
  const { doing, error, progress, setDoing, setError, onEvent } =
    useAssignActionProgress(props);

  const conditionalAssign = async (action: PrimaryActionFragment) => {
    const key = action.args?.at(0)?.key;
    if (!key) {
      toast.error("No key found for self");
      return;
    }

    for (const object of props.objects) {
      const keys: Record<string, unknown> = { [key]: object.object };

      if (props.partners && props.partners.length === 1) {
        const partnerKey = action.args?.at(1)?.key;
        if (!partnerKey) {
          toast.error("No key found for partner");
          return;
        }
        keys[partnerKey] = {
          __identifier: props.partners[0].identifier,
          object: props.partners[0].object,
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
          object: partner.object,
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
          reference,
          ephemeral: props.ephemeral,
        });
        registeredCallbacks.set(reference, onEvent);
        setDoing(true);
        setError(null);
      } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
        setDoing(false);
        setError(message);
      }
    }
  };

  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger asChild>
        <CommandItem
          onSelect={() => conditionalAssign(props.action)}
          value={props.action.id}
          className={cn(
            "flex-grow flex flex-col group cursor-pointer",
            doing && "animate-pulse",
            error && "border border-1 border-red-200",
          )}
          style={{
            backgroundSize: `${progress || 0}% 100%`,
            backgroundImage: `linear-gradient(to right, #10b981 ${progress}%, #10b981 ${progress}%)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
          }}
        >
          <span className="mr-auto text-md text-gray-100">
            {props.action.name} {error && <span className="text-red-800">{error}</span>}
          </span>
          <span className="mr-auto text-xs text-gray-400">
            {props.action.description}
          </span>
        </CommandItem>
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
    <>
    <div className="font-light text-xs w-full items-center ml-2 w-full">Batch ..</div>
        {data.actions.map((action) => (
          <BatchAssignButton action={action} {...props} key={action.id} />
        ))}
        </>
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
    <>
      <div className="font-light text-xs w-full items-center ml-2 w-full">Run...</div>
      {data.actions.map((action) => (
        <AssignButton action={action} {...props} key={action.id} />
      ))}
    </>
  );
};
