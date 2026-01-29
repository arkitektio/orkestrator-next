import { useDialog } from "@/app/dialog";
import { usePerformAction } from "@/app/hooks/useLocalAction";
import { useMatchingActions } from "@/app/localactions";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ListDefinitionFragment,
  useAllPrimaryDefinitionsQuery,
} from "@/kabinet/api/graphql";
import {
  ListMaterializedEdgeFragment,
  ListRelationCategoryFragment,
  ListStructureRelationCategoryWithGraphFragment,
  useCreateEntityMutation,
  useCreateMeasurementMutation,
  useCreateRelationMutation,
  useCreateStructureMutation,
  useCreateStructureRelationMutation,
  useListMaterializedEdgesQuery,
  useListMeasurmentCategoryQuery,
  useListRelationCategoryQuery,
  useListStructureRelationCategoryQuery,
} from "@/kraph/api/graphql";
import { Guard, useRekuest } from "@/app/Arkitekt";
import { Action, ActionState } from "@/lib/localactions/LocalActionProvider";
import { cn } from "@/lib/utils";
import { Structure } from "@/types";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { CommandGroup } from "cmdk";
import { PlayIcon } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  AssignationChangeEvent,
  AssignationEventFragment,
  DemandKind,
  ListImplementationFragment,
  ListShortcutFragment,
  PortDemandInput,
  PortKind,
  PrimaryActionFragment,
  useAllActionsQuery,
  useAllPrimaryActionsQuery,
  useImplementationsQuery,
  useShortcutsQuery,
} from "../api/graphql";
import { registeredCallbacks } from "../components/functional/AssignationUpdater";
import { useAssign } from "../hooks/useAssign";
import { useHashActionWithProgress } from "../hooks/useHashActionWithProgress";

export type OnDone = (args: {
  event?: AssignationEventFragment;
  kind: "local" | "action" | "shortcut" | "relation" | "measurement";
}) => void;
export type onError = (args: {
  event?: AssignationEventFragment;
  kind: "local" | "action" | "shortcut" | "relation" | "measurement";
}) => void;

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
    let the_key = action.args?.at(0)?.key;

    if (!the_key) {
      toast.error("No key found");
      return;
    }

    if (action.args.length > 1) {
      openDialog("implementationassign", {
        id: implementation.id,
        args: { [the_key]: props.object },
        hidden: { [the_key]: props.object },
      });
      return;
    }

    try {
      const reference = uuidv4();

      await assign({
        implementation: implementation.id,
        args: {
          [the_key]: props.object,
        },
        reference: reference,
      });

      registeredCallbacks.set(reference, (event: AssignationChangeEvent) => {
        props.onDone?.(event);
      });
    } catch (e) {
      toast.error(e.message);
    }
  };
  return (
    <>
      <div className="flex flex-row text-xs">Run on</div>
      <div className="flex flex-col gap-2">
        {implementations.data?.implementations.map((x) => (
          <>
            <Button
              variant={"outline"}
              size={"lg"}
              className="flex flex-col gap-1"
              onClick={() => onTemplateSelect(props.action, x)}
            >
              <div className="text-md text-gray-100">{x.agent.name}</div>
              <div className="text-xs text-gray-400">{x.interface}</div>
            </Button>
          </>
        ))}
      </div>
      <Button
        onClick={() =>
          openDialog("createshortcut", {
            id: props.action.id,
            args: { [props.action.args?.at(0)?.key || "object"]: props.object },
          })
        }
        variant={"outline"}
        className="mt-2"
      >
        Create Shortcut
      </Button>
    </>
  );
};

export const AssignButton = (
  props: SmartContextProps & { action: PrimaryActionFragment },
) => {
  const [doing, setDoing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<number | null>(0);

  const { assign } = useAssign();
  const { openDialog } = useDialog();

  const doStuff = useCallback(
    (event: AssignationEventFragment) => {
      console.log("Assignation event received:", event);
      if (event.kind == "DONE") {
        setDoing(false);
        setProgress(null);
        props.onDone?.({ event, kind: "action" });
      }
      if (event.kind == "ERROR" || event.kind == "CRITICAL") {
        setDoing(false);
        setProgress(null);
        setError(event.message || "Unknown error");
        props.onError?.(event.message || "Unknown error");
      }
      if (event.kind == "PROGRESS") {
        setProgress(event.progress || 0);
      }
    },
    [setDoing, setProgress, setError, props.onDone, props.onError],
  );

  const conditionalAssign = async (action: PrimaryActionFragment) => {
    const keys = {};

    if (props.objects) {
      if (props.objects.length === 0) {
        console.log("No oject passed");
      }
      if (props.objects.length === 1) {
        const the_key = action.args?.at(0)?.key;
        if (!the_key) {
          toast.error("No key found for self");
          return;
        }
        keys[the_key] = props.objects[0].object;
      }
      if (props.objects.length > 1) {
        if (action.args.at(0)?.kind != PortKind.List) {
          toast.error("Should be a list but is not");
          return;
        }
        const the_key = action.args?.at(0)?.key;
        if (!the_key) {
          toast.error("No key found for self");
          return;
        }
        keys[the_key] = props.objects.map((obj) => obj.object);
      }
    }

    if (props.partners) {
      if (props.partners.length === 0) {
        console.log("No oject passed");
      }
      if (props.partners.length === 1) {
        const the_key = action.args?.at(1)?.key;
        if (!the_key) {
          toast.error("No key found for self");
          return;
        }
        keys[the_key] = props.partners[0].object;
      }
      if (props.partners.length > 1) {
        if (action.args.at(1)?.kind != PortKind.List) {
          toast.error("Should be a list but is not");
          return;
        }
        const the_key = action.args?.at(1)?.key;
        if (!the_key) {
          toast.error("No key found for self");
          return;
        }
        keys[the_key] = props.partners.map((obj) => obj.object);
      }
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
      registeredCallbacks.set(reference, doStuff);

      await assign({
        action: action.id,
        args: keys,
        reference: reference,
        ephemeral: props.ephemeral,
      });

      setDoing(true);
      setError(null);


    } catch (e) {
      toast.error(e.message);
      setDoing(false);
      setError(e.message || "Unknown error");
    }
  };

  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger asChild>
        <CommandItem
          onSelect={() => conditionalAssign(props.action)}
          value={props.action.id}
          key={props.action.id}
          className={cn(
            "flex-grow  flex flex-col group cursor-pointer",
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
            {props.action.name}{" "}
            {error && <span className="text-red-800">{error}</span>}
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
  const [doing, setDoing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<number | null>(0);

  const { assign } = useAssign();
  const { openDialog } = useDialog();

  const doStuff = useCallback(
    (event: AssignationEventFragment) => {
      console.log("Assignation event received:", event);
      if (event.kind == "DONE") {
        setDoing(false);
        setProgress(null);
        props.onDone?.({ event, kind: "action" });
      }
      if (event.kind == "ERROR" || event.kind == "CRITICAL") {
        setDoing(false);
        setProgress(null);
        setError(event.message || "Unknown error");
        props.onError?.(event.message || "Unknown error");
      }
      if (event.kind == "PROGRESS") {
        setProgress(event.progress || 0);
      }
    },
    [setDoing, setProgress, setError, props.onDone, props.onError],
  );

  const conditionalAssign = async (action: PrimaryActionFragment) => {
    const keys = {};

    const the_key = action.args?.at(0)?.key;

    for (const obj of props.objects) {
      if (!the_key) {
        toast.error("No key found for self");
        return;
      }
      keys[the_key] = obj.object;

      if (props.partners) {
        if (props.partners.length === 0) {
          console.log("No oject passed");
        }
        if (props.partners.length === 1) {
          const the_key = action.args?.at(1)?.key;
          if (!the_key) {
            toast.error("No key found for self");
            return;
          }
          keys[the_key] = props.partners[0].object;
        }
        if (props.partners.length > 1) {
          if (action.args.at(1)?.kind != PortKind.List) {
            toast.error("Should be a list but is not");
            return;
          }
          const the_key = action.args?.at(1)?.key;
          if (!the_key) {
            toast.error("No key found for self");
            return;
          }
          keys[the_key] = props.partners.map((obj) => obj.object);
        }
      }

      const unknownKeys = action.args.filter(
        (arg) => arg.key && !keys[arg.key],
      );

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
          reference: reference,
          ephemeral: props.ephemeral,
        });

        setDoing(true);
        setError(null);

        registeredCallbacks.set(reference, doStuff);
      } catch (e) {
        toast.error(e.message);
        setDoing(false);
        setError(e.message || "Unknown error");
      }
    }
  };

  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger asChild>
        <CommandItem
          onSelect={() => conditionalAssign(props.action)}
          value={props.action.id}
          key={props.action.id}
          className={cn(
            "flex-grow  flex flex-col group cursor-pointer",
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
            {props.action.name}{" "}
            {error && <span className="text-red-800">{error}</span>}
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

export const ShortcutButton = (
  props: SmartContextProps & { shortcut: ListShortcutFragment },
) => {
  const { assign } = useAssign();
  const { openDialog } = useDialog();
  const [doing, setDoing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<number | null>(0);

  const doStuff = useCallback(
    (event: AssignationEventFragment) => {
      console.log("Assignation event received:", event);
      if (event.kind == "DONE") {
        setDoing(false);
        setProgress(null);
        props.onDone?.({ event, kind: "action" });
      }
      if (event.kind == "ERROR" || event.kind == "CRITICAL") {
        setDoing(false);
        setProgress(null);
        setError(event.message || "Unknown error");
        props.onError?.(event.message || "Unknown error");
      }
      if (event.kind == "PROGRESS") {
        setProgress(event.progress || 0);
      }
    },
    [setDoing, setProgress, setError, props.onDone, props.onError],
  );

  const conditionalAssign = async (shortcut: ListShortcutFragment) => {
    const keys = {};

    if (props.objects) {
      if (props.objects.length === 0) {
        console.log("No oject passed");
      }
      if (props.objects.length === 1) {
        const the_key = shortcut.args?.at(0)?.key;
        if (!the_key) {
          toast.error("No key found for self");
          return;
        }
        keys[the_key] = props.objects[0].object;
      }
      if (props.objects.length > 1) {
        if (shortcut.args.at(0)?.kind != PortKind.List) {
          toast.error("Should be a list but is not");
          return;
        }
        const the_key = shortcut.args?.at(0)?.key;
        if (!the_key) {
          toast.error("No key found for self");
          return;
        }
        keys[the_key] = props.objects.map((obj) => obj.object);
      }
    }

    if (props.partners) {
      if (props.partners.length === 0) {
        console.log("No oject passed");
      }
      if (props.partners.length === 1) {
        const the_key = shortcut.args?.at(1)?.key;
        if (!the_key) {
          toast.error("No key found for self");
          return;
        }
        keys[the_key] = props.partners[0].object;
      }
      if (props.partners.length > 1) {
        if (shortcut.args.at(1)?.kind != PortKind.List) {
          toast.error("Should be a list but is not");
          return;
        }
        const the_key = shortcut.args?.at(1)?.key;
        if (!the_key) {
          toast.error("No key found for self");
          return;
        }
        keys[the_key] = props.partners.map((obj) => obj.object);
      }
    }

    const unknownKeys = shortcut.args.filter(
      (arg) => arg.key && !keys[arg.key],
    );

    if (unknownKeys.length >= 1) {
      openDialog("actionassign", {
        id: shortcut.action.id,
        args: { keys, ...shortcut.savedArgs },
        hidden: { keys, ...shortcut.savedArgs },
      });
      return;
    }

    try {
      const reference = uuidv4();

      await assign({
        action: shortcut.action.id,
        args: {
          ...keys,
          ...shortcut.savedArgs,
        },
      });

      registeredCallbacks.set(reference, doStuff);
    } catch (e) {
      toast.error(e.message);
      props.onError?.(e.message);
    }
  };

  useEffect(() => {
    if (props.shortcut.bindNumber) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === props.shortcut.bindNumber?.toString()) {
          e.preventDefault();
          conditionalAssign(props.shortcut);
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }

    return () => {
      // No cleanup needed if bindNumber is null/undefined
    };
  }, [props.shortcut.bindNumber, props.shortcut]);

  return (
    <CommandItem
      onSelect={() => conditionalAssign(props.shortcut)}
      value={props.shortcut.id}
      key={props.shortcut.id}
      className="flex-initial flex flex-row group cursor-pointer border border-1 rounded rounded-full bg-slate-800 shadow-xl  h-8 overflow-hidden truncate max-w-[100px] ellipsis px-2"
    >
      {props.shortcut.allowQuick && <LightningBoltIcon className="w-4 h-4" />}
      <span className="mr-auto text-md text-gray-100 ellipsis truncate w-full">
        {props.shortcut.name}{" "}
        {props.shortcut.bindNumber && `(${props.shortcut.bindNumber})`}
      </span>
    </CommandItem>
  );
};

export const AutoInstallButton = (props: { definition: string }) => {
  return (
    <Button
      className="group-hover:opacity-100 opacity-0 transition-opacity duration-300"
      variant={"outline"}
      onClick={(e) => {
        e.preventDefault();
        assign({ definition: props.definition });
      }}
      disabled={installed}
      style={{
        backgroundSize: `${progress || 0}% 100%`,
        backgroundImage: `linear-gradient(to right, #10b981 ${progress}%, #10b981 ${progress}%)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
      }}
    >
      Auto Install
    </Button>
  );
};

export const InstallButton = (props: {
  definition: ListDefinitionFragment;
  action: PrimaryActionFragment;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  const client = useRekuest();

  const { assign, progress, doing, installed, onDone } =
    useHashActionWithProgress({
      hash: props.action.hash,
      onDone: (event) => {
        client.refetchQueries({ include: ["AllPrimaryActions"] });
      },
    });

  return (
    <CommandItem
      value={`install-${props.definition.id}-${props.action.id}`}
      key={`install-${props.definition.id}-${props.action.id}`}
      onSelect={(e) => {
        assign({ definition: props.definition.id });
      }}
      className="flex-1 "
      style={{
        backgroundSize: `${progress || 0}% 100%`,
        backgroundImage: `linear-gradient(to right, #10b981 ${progress}%, #10b981 ${progress}%)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
      }}
      disabled={!installed}
    >
      <Tooltip>
        <TooltipTrigger className="flex flex-row group w-full">
          <div className="flex-col">
            <div className="text-md text-gray-100 text-left">
              {props.definition.name}
            </div>
            <div className="text-xs text-gray-400 text-left">
              {props.definition.description} on{" "}
            </div>
          </div>
          <div className="flex-grow"></div>
        </TooltipTrigger>
        <TooltipContent>{props.definition.description}</TooltipContent>
      </Tooltip>
    </CommandItem>
  );
};

export const ApplicableBatchActions = (props: PassDownProps) => {
  const demands: PortDemandInput[] = [];

  if (!props.objects || props.objects.length < 2) {
    return null;
  }

  if (props.objects) {
    demands.push({
      kind: DemandKind.Args,
      matches: [
        {
          at: 0,
          kind: PortKind.Structure,
          identifier: props.objects[0].identifier,
        },
      ],
    });
  }

  if (props.partners) {
    if (props.partners.length === 0) {
      console.log("No partners");
      // Maybe
    } else {
      demands.push({
        kind: DemandKind.Args,
        matches: [
          {
            at: 1,
            kind: PortKind.Structure,
            identifier: props.partners[0].identifier,
          },
        ],
      });
    }
  }

  if (props.returns) {
    demands.push({
      kind: DemandKind.Returns,
      matches: props.returns.map((r, index) => ({
        at: index,
        kind: PortKind.Structure,
        identifier: r,
      })),
    });
  }

  const { data, error } = useAllPrimaryActionsQuery({
    variables: {
      filters: {
        demands: demands,
        search: props.filter && props.filter != "" ? props.filter : undefined,
        inCollection: props.collection,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  if (error)
    return (
      <span className="font-light text-xs w-full items-center ml-2 w-full">
        Error
      </span>
    );

  if (!data) {
    return null;
  }

  if (data.actions.length === 0) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <span className="font-light text-xs w-full items-center ml-2 w-full">
          Batch ..
        </span>
      }
    >
      {data?.actions.map((x) => (
        <BatchAssignButton action={x} {...props} key={x.id} />
      ))}
    </CommandGroup>
  );
};

export const ApplicableActions = (props: PassDownProps) => {
  const demands: PortDemandInput[] = [];

  if (props.objects) {
    if (props.objects.length === 0) {
      console.log("No objects");
    } else if (props.objects.length === 1) {
      demands.push({
        kind: DemandKind.Args,
        matches: [
          {
            at: 0,
            kind: PortKind.Structure,
            identifier: props.objects[0].identifier,
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
              },
            ],
          },
        ],
      });
    }
  }

  if (props.partners) {
    if (props.partners.length === 0) {
      console.log("No partners");
      // Maybe
    } else if (props.partners.length === 1) {
      demands.push({
        kind: DemandKind.Args,
        matches: [
          {
            at: 1,
            kind: PortKind.Structure,
            identifier: props.partners[0].identifier,
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
      matches: props.returns.map((r, index) => ({
        at: index,
        kind: PortKind.Structure,
        identifier: r,
      })),
    });
  }

  const { data, error } = useAllPrimaryActionsQuery({
    variables: {
      filters: {
        demands: demands,
        search: props.filter && props.filter != "" ? props.filter : undefined,
        inCollection: props.collection,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  if (error)
    return (
      <span className="font-light text-xs w-full items-center ml-2 w-full">
        Error
      </span>
    );

  if (!data) {
    return null;
  }

  if (data.actions.length === 0) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <span className="font-light text-xs w-full items-center ml-2 w-full">
          Run...
        </span>
      }
    >
      {data?.actions.map((x) => (
        <AssignButton action={x} {...props} key={x.id} />
      ))}
    </CommandGroup>
  );
};

export const ApplicableShortcuts = (props: PassDownProps) => {
  const demands: PortDemandInput[] = [];

  if (props.objects) {
    if (props.objects.length === 0) {
      console.log("No objects");
    } else if (props.objects.length === 1) {
      demands.push({
        kind: DemandKind.Args,
        matches: [
          {
            at: 0,
            kind: PortKind.Structure,
            identifier: props.objects[0].identifier,
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
              },
            ],
          },
        ],
      });
    }
  }

  if (props.partners) {
    if (props.partners.length === 0) {
      console.log("No partners");
      // Maybe
    } else if (props.partners.length === 1) {
      demands.push({
        kind: DemandKind.Args,
        matches: [
          {
            at: 1,
            kind: PortKind.Structure,
            identifier: props.partners[0].identifier,
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
                identifier: props.partners[0].identifier,
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
      matches: props.returns.map((r, index) => ({
        at: index,
        kind: PortKind.Structure,
        identifier: r,
      })),
    });
  }

  const { data, error } = useShortcutsQuery({
    variables: {
      filters: {
        demands: demands,
        search: props.filter && props.filter != "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  if (error)
    return (
      <span className="font-light text-xs w-full items-center ml-2 w-full">
        Error
      </span>
    );

  if (!data) {
    return null;
  }

  if (data.shortcuts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row gap-2 p-2">
      {data?.shortcuts.map((x) => (
        <ShortcutButton shortcut={x} {...props} key={x.id} />
      ))}
    </div>
  );
};

export const ApplicableDefinitions = (props: PassDownProps) => {
  const demands: PortDemandInput[] = [];

  const { data: enginesData } = useAllActionsQuery({
    variables: {
      filters: {
        demands: [
          {
            kind: DemandKind.Args,
            matches: [
              {
                at: 0,
                kind: PortKind.Structure,
                identifier: "@kabinet/definition",
              },
            ],
          },
          {
            kind: DemandKind.Returns,
            matches: [
              {
                at: 0,
                kind: PortKind.Structure,
                identifier: "@kabinet/pod",
              },
            ],
          },
        ],
      },
    },
    fetchPolicy: "cache-first",
  });

  if (props.objects) {
    if (props.objects.length === 0) {
      console.log("No objects");
    } else if (props.objects.length === 1) {
      demands.push({
        kind: DemandKind.Args,
        matches: [
          {
            at: 0,
            kind: PortKind.Structure,
            identifier: props.objects[0].identifier,
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
              },
            ],
          },
        ],
      });
    }
  }

  if (props.partners) {
    if (props.partners.length === 0) {
      console.log("No partners");
    } else if (props.partners.length === 1) {
      demands.push({
        kind: DemandKind.Args,
        matches: [
          {
            at: 1,
            kind: PortKind.Structure,
            identifier: props.partners[0].identifier,
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
                at: 1,
                kind: PortKind.Structure,
                identifier: props.partners[0].identifier,
              },
            ],
          },
        ],
      });
    }
  }

  const { data } = useAllPrimaryDefinitionsQuery({
    variables: {
      filters: {
        demands: demands,
        search: props.filter && props.filter != "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  if (!data) {
    return null;
  }

  if (data.definitions.length === 0) {
    return null;
  }

  if (!enginesData || enginesData.actions.length === 0) {
    return <>No install action found</>;
  }

  return (
    <CommandGroup
      heading={
        <span className="font-light text-xs w-full items-center ml-2 w-full">
          Installable
        </span>
      }
    >
      {data?.definitions.map((x) => (
        <>
          {enginesData?.actions.map((action) => (
            <InstallButton
              definition={x}
              key={`${x.id}-${action.id}`}
              action={action}
            >
              {x.name}
            </InstallButton>
          ))}{" "}
        </>
      ))}
    </CommandGroup>
  );
};

export const EntityRelationActions = (props: PassDownProps) => {
  const firstPartner = props.partners?.at(0);
  const firstObject = props.objects?.at(0);

  if (!firstPartner || !firstObject) {
    return null;
  }

  const dialog = useDialog();

  const { data, error } = useListRelationCategoryQuery({
    variables: {
      filters: {
        sourceEntity: firstObject.object,
        targetEntity: firstPartner.object,
        search: props.filter && props.filter != "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  return (
    <CommandGroup
      heading={
        <span className="font-light text-xs w-full items-center ml-2 w-full">
          Relate Entities
        </span>
      }
    >
      {data?.relationCategories.map((x) => (
        <EntityRelateButton
          relation={x}
          right={props.partners || []}
          left={props.objects || []}
          key={x.id}
        >
          {x.label}
        </EntityRelateButton>
      ))}
      {error && (
        <CommandItem value={"error"} className="flex-1">
          <span className="text-red-500">Error: {error.message}</span>
        </CommandItem>
      )}
      <CommandItem
        value={"no-relation"}
        onSelect={() =>
          dialog.openDialog("createnewrelation", {
            left: props.objects || [],
            right: props.partners || [],
          })
        }
        className="flex-1 "
      >
        <Tooltip>
          <TooltipTrigger className="flex flex-row group w-full">
            <div className="flex-col">
              <div className="text-md text-gray-100 text-left">
                Create new Relation
              </div>
              <div className="text-xs text-gray-400 text-left">
                Will create a new relation
              </div>
            </div>
            <div className="flex-grow"></div>
          </TooltipTrigger>
          <TooltipContent>{props.filter}</TooltipContent>
        </Tooltip>
      </CommandItem>
    </CommandGroup>
  );
};

export const StructureRelationActions = (props: PassDownProps) => {
  const firstPartner = props.partners?.at(0);
  const firstObject = props.objects?.at(0);

  if (!firstPartner || !firstObject) {
    return null;
  }

  const dialog = useDialog();

  const { data, error } = useListStructureRelationCategoryQuery({
    variables: {
      filters: {
        sourceIdentifier: firstObject.identifier,
        targetIdentifier: firstPartner.identifier,
        search: props.filter && props.filter != "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  return (
    <CommandGroup
      heading={
        <span className="font-light text-xs w-full items-center ml-2 w-full">
          Relate...
        </span>
      }
    >
      {data?.structureRelationCategories.map((x) => (
        <StructureRelateButton
          relation={x}
          right={firstPartner}
          left={props}
          key={x.id}
        >
          {x.label}
        </StructureRelateButton>
      ))}
      {error && (
        <CommandItem value={"error"} className="flex-1">
          <span className="text-red-500">Error: {error.message}</span>
        </CommandItem>
      )}
      <CommandItem
        value={"no-relation"}
        onSelect={() =>
          dialog.openDialog("createnewrelation", {
            left: props.objects || [],
            right: props.partners || [],
          })
        }
        className="flex-1 "
      >
        <Tooltip>
          <TooltipTrigger className="flex flex-row group w-full">
            <div className="flex-col">
              <div className="text-md text-gray-100 text-left">
                Create.new Relation
              </div>
              <div className="text-xs text-gray-400 text-left">
                Will create a new relation
              </div>
            </div>
            <div className="flex-grow"></div>
          </TooltipTrigger>
          <TooltipContent>{props.filter}</TooltipContent>
        </Tooltip>
      </CommandItem>
    </CommandGroup>
  );
};

export const MeasurementActions = (props: PassDownProps) => {
  const firstObject = props.objects?.at(0);
  const dialog = useDialog();

  if (!firstObject) {
    return null;
  }

  const { data, error } = useListMeasurmentCategoryQuery({
    variables: {
      filters: {
        sourceIdentifier: firstObject.identifier,
        search: props.filter && props.filter != "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  return (
    <CommandGroup
      heading={
        <span className="font-light text-xs w-full items-center ml-2 w-full">
          Relate...
        </span>
      }
    >
      {data?.measurementCategories.map((x) => (
        <StructureRelateButton
          relation={x}
          right={firstPartner}
          left={props}
          key={x.id}
        >
          {x.label}
        </StructureRelateButton>
      ))}
      {error && (
        <CommandItem value={"error"} className="flex-1">
          <span className="text-red-500">Error: {error.message}</span>
        </CommandItem>
      )}
      <CommandItem
        value={"no-relation"}
        onSelect={() =>
          dialog.openDialog("createnewrelation", {
            left: props.objects || [],
            right: props.partners || [],
          })
        }
        className="flex-1 "
      >
        <Tooltip>
          <TooltipTrigger className="flex flex-row group w-full">
            <div className="flex-col">
              <div className="text-md text-gray-100 text-left">
                Create.new Measurement
              </div>
              <div className="text-xs text-gray-400 text-left">
                Will create a a new Measurment
              </div>
            </div>
            <div className="flex-grow"></div>
          </TooltipTrigger>
          <TooltipContent>{props.filter}</TooltipContent>
        </Tooltip>
      </CommandItem>
    </CommandGroup>
  );
};

export const ApplicableRelations = (props: PassDownProps) => {
  const firstPartner = props.partners?.at(0);
  const firstObject = props.objects?.at(0);

  if (!firstPartner && !firstObject) {
    return null;
  }

  if (!firstPartner && firstObject) {
    return <ApplicableMeasurements {...props} />;
  }

  if (
    firstPartner?.identifier == "@kraph/entity" &&
    firstObject?.identifier == "@kraph/entity"
  ) {
    return <EntityRelationActions {...props} />;
  }

  return <StructureRelationActions {...props} />;
};

export const ApplicableMeasurements = (props: PassDownProps) => {
  const firstPartner = props.partners?.at(0);
  const firstObject = props.objects?.at(0);

  if (firstPartner || !firstObject) {
    return null;
  }

  const dialog = useDialog();

  const { data, error } = useListMaterializedEdgesQuery({
    variables: {
      filters: {
        sourceIdentifier: firstObject.identifier,
        search: props.filter && props.filter != "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  return (
    <CommandGroup
      heading={
        <span className="font-light text-xs w-full items-center ml-2 w-full">
          Measures...
        </span>
      }
    >
      {data?.materializedEdges.map((x) => (
        <CreateMeasurementButton edge={x} left={props} key={x.id}>
          {x.relation.label} - {x.target.label}
        </CreateMeasurementButton>
      ))}
      {error && (
        <CommandItem value={"error"} className="flex-1">
          <span className="text-red-500">Error: {error.message}</span>
        </CommandItem>
      )}
      <CommandItem
        value={"no-relation"}
        onSelect={() =>
          dialog.openDialog("createnewmeasurement", {
            left: props.objects || [],
            right: props.partners || [],
          })
        }
        className="flex-1 "
      >
        <Tooltip>
          <TooltipTrigger className="flex flex-row group w-full">
            <div className="flex-col">
              <div className="text-md text-gray-100 text-left">
                Create new Measurement
              </div>
              <div className="text-xs text-gray-400 text-left">
                Will create a new measurement
              </div>
            </div>
            <div className="flex-grow"></div>
          </TooltipTrigger>
          <TooltipContent>{props.filter}</TooltipContent>
        </Tooltip>
      </CommandItem>
    </CommandGroup>
  );
};

export const StructureRelateButton = (props: {
  relation: ListStructureRelationCategoryWithGraphFragment;
  left: PassDownProps;
  right: Structure;
  children: React.ReactNode;
}) => {
  const [createSRelation] = useCreateStructureRelationMutation({
    onCompleted: (data) => {
      console.log("Relation created:", data);
    },
    onError: (error) => {
      console.error("Error creating relation:", error);
    },
  });

  const [createStructure] = useCreateStructureMutation({
    onCompleted: (data) => {
      console.log("Structure created:", data);
    },
    onError: (error) => {
      console.error("Error creating structure:", error);
    },
  });

  const handleRelationCreation = async (
    category: ListStructureRelationCategoryWithGraphFragment,
  ) => {
    for (const obj of props.left.objects) {
      try {
        const leftStructureString = `${obj.identifier}:${obj.object}`;
        const rightStructureString = `${props.right.identifier}:${props.right.object}`;

        const left = await createStructure({
          variables: {
            input: {
              structure: leftStructureString,
              graph: category.graph.id,
            },
          },
        });

        const right = await createStructure({
          variables: {
            input: {
              structure: rightStructureString,
              graph: category.graph.id,
            },
          },
        });

        await createSRelation({
          variables: {
            input: {
              source: left.data?.createStructure.id,
              target: right.data?.createStructure.id,
              category: category.id,
            },
          },
        });

        toast.success("Relation created successfully!");
      } catch (error) {
        toast.error(
          `Failed to create relation: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        console.error("Failed to create relation:", error);
      }
    }
  };

  return (
    <CommandItem
      value={props.relation.label}
      key={props.relation.id}
      onSelect={() => handleRelationCreation(props.relation)}
      className="flex-1 "
    >
      <Tooltip>
        <TooltipTrigger className="flex flex-row group w-full">
          <div className="flex-col">
            <div className="text-md text-gray-100 text-left">
              {props.relation.label}
            </div>
            <div className="text-xs text-gray-400 text-left">
              {props.relation.graph.name}
            </div>
          </div>
          <div className="flex-grow"></div>
        </TooltipTrigger>
        <TooltipContent>{props.relation.description}</TooltipContent>
      </Tooltip>
    </CommandItem>
  );
};

export const CreateMeasurementButton = (props: {
  edge: ListMaterializedEdgeFragment;
  left: PassDownProps;
  children: React.ReactNode;
}) => {
  const [createMeasurment] = useCreateMeasurementMutation({
    onCompleted: (data) => {
      console.log("Relation created:", data);
    },
    onError: (error) => {
      console.error("Error creating relation:", error);
    },
  });

  const dialog = useDialog();

  const [createStructure] = useCreateStructureMutation({
    onCompleted: (data) => {
      console.log("Structure created:", data);
    },
    onError: (error) => {
      console.error("Error creating structure:", error);
    },
  });

  const [createEntity] = useCreateEntityMutation({
    onCompleted: (data) => {
      console.log("Entity created:", data);
    },
  });

  const defaultNew = false;

  const handleDirectCreation = async (edge: ListMaterializedEdgeFragment) => {
    if (!defaultNew) {
      dialog.openDialog("setasmeasurement", {
        left: props.left.objects,
        edge: props.edge,
      });
      toast.error("No default entity category set for measurement target");
      return;
    }

    for (const obj of props.left.objects) {
      try {
        const leftStructureString = `${obj.identifier}:${obj.object}`;

        const left = await createStructure({
          variables: {
            input: {
              structure: leftStructureString,
              graph: edge.graph.id,
            },
          },
        });

        const entityResponse = await createEntity({
          variables: {
            input: {
              entityCategory: defaultNew.id,
            },
          },
        });

        await createMeasurment({
          variables: {
            input: {
              structure: left.data?.createStructure.id,
              entity: entityResponse.data?.createEntity.id,
              category: edge.relation.id,
            },
          },
        });

        toast.success("Relation created successfully!");
      } catch (error) {
        toast.error(
          `Failed to create relation: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        console.error("Failed to create relation:", error);
      }
    }
  };

  return (
    <CommandItem
      value={props.edge.id}
      key={props.edge.id}
      onSelect={() => handleDirectCreation(props.edge)}
      className="flex-1 "
    >
      <Tooltip>
        <TooltipTrigger className="flex flex-row group w-full">
          <div className="flex-1">
            <div className="text-md text-gray-100 text-left flex flex-row gap-2">
              {props.edge.relation.label}{" "}
              <pre className="my-auto">{props.edge.target.label}</pre>
            </div>
            <div className="text-xs text-gray-400 text-left">
              {props.edge.graph.name}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>{props.edge.relation.description}</TooltipContent>
      </Tooltip>
    </CommandItem>
  );
};

export const EntityRelateButton = (props: {
  relation: ListRelationCategoryFragment;
  left: Structure[];
  right: Structure[];
  children: React.ReactNode;
}) => {
  const [createRelation] = useCreateRelationMutation({
    onCompleted: (data) => {
      console.log("Relation created:", data);
    },
    onError: (error) => {
      console.error("Error creating relation:", error);
    },
  });

  const handleRelationCreation = async (
    category: ListRelationCategoryFragment,
  ) => {
    for (const left of props.left) {
      for (const right of props.right) {
        try {
          await createRelation({
            variables: {
              input: {
                source: left.object,
                target: right.object,
                category: category.id,
              },
            },
          });

          toast.success("Relation created successfully!");
        } catch (error) {
          toast.error(
            `Failed to create relation: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
          console.error("Failed to create relation:", error);
        }
      }
    }
  };

  return (
    <CommandItem
      value={props.relation.label}
      key={props.relation.id}
      onSelect={() => handleRelationCreation(props.relation)}
      className="flex-1 "
    >
      <Tooltip>
        <TooltipTrigger className="flex flex-row group w-full">
          <div className="flex-col">
            <div className="text-md text-gray-100 text-left">
              {props.relation.label}
            </div>
            <div className="text-xs text-gray-400 text-left">
              {props.relation.description}
            </div>
          </div>
          <div className="flex-grow"></div>
        </TooltipTrigger>
        <TooltipContent>{props.relation.description}</TooltipContent>
      </Tooltip>
    </CommandItem>
  );
};

export const LocalActionCommand = (props: {
  action: Action;
  state: ActionState;
  onDone?: OnDone;
}) => {
  const { assign, progress } = usePerformAction(props);

  return (
    <CommandItem
      onSelect={assign}
      className="flex-1"
      style={{
        backgroundSize: `${progress || 0}% 100%`,
        backgroundImage: `linear-gradient(to right, #10b981 ${progress}%, #10b981 ${progress}%)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
      }}
    >
      <Tooltip>
        <TooltipTrigger className="flex flex-col">
          <span className="mr-auto text-md text-gray-100 flex">
            {props.action.title}
          </span>
          <span className="mr-auto text-xs text-gray-400">
            {props.action.description}
          </span>
        </TooltipTrigger>
        <TooltipContent>{props.action.description}</TooltipContent>
      </Tooltip>
    </CommandItem>
  );
};

export const Actions = (props: {
  state: ActionState;
  filter?: string;
  onDone?: OnDone;
}) => {
  const actions = useMatchingActions({
    state: props.state,
    search: props.filter,
  });

  if (actions.length === 0) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <span className="font-light text-xs w-full items-center ml-2 w-full">
          Generic
        </span>
      }
    >
      {actions.map((x) => (
        <LocalActionCommand
          key={x.title}
          action={x}
          state={props.state}
          onDone={props.onDone}
        />
      ))}
    </CommandGroup>
  );
};

export const ApplicableLocalActions = (props: PassDownProps) => {
  return (
    <Actions
      state={{
        left: props.objects,
        right: props.partners,
        isCommand: false,
      }}
      filter={props.filter}
      onDone={props.onDone}
    />
  );
};

export type SmartContextProps = {
  children?: React.ReactNode;
  className?: string;
  objects: Structure[];
  partners?: Structure[];
  returns?: string[];
  expect?: string[];
  collection?: string;
  onDone?: OnDone;
  onError?: (error: string) => void;
  ephemeral?: boolean;
  disableShortcuts?: boolean;
  disableKraph?: boolean;
  disableKabinet?: boolean;
  disableActions?: boolean;
  disableBatchActions?: boolean;
};

export type ObjectButtonProps = SmartContextProps & {
  children?: React.ReactNode;
  className?: string;
  variant?: "outline" | "default";
  size?: "sm" | "lg" | "icon";

};

export type PassDownProps = SmartContextProps & {
  filter?: string;
};

export const ObjectButton = (props: ObjectButtonProps) => {
  return (
    <>
      <Popover>
        <PopoverTrigger>
          {props.children || (
            <Button variant={props.variant || "outline"} className={cn(props.className, "text-white")} size={props.size || "icon"}>
              <PlayIcon />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          className="text-white border-gray-800 px-2 py-2 items-left"
          data-nonbreaker
        >
          <SmartContext {...props} />
        </PopoverContent>
      </Popover>
    </>
  );
};

export const SmartContext = (props: SmartContextProps) => {
  const [filter, setFilterValue] = React.useState<string | undefined>(
    undefined,
  );

  return (
    <>
      <div className="flex flex-row text-xs">
        {props.objects && props.objects.length > 1 && (
          <div className="p-2 text-xs">
            {props.objects.length} {props.objects.at(0)?.identifier}
          </div>
        )}
        {props.partners && props.partners.length >= 1 && (
          <div className="p-2 text-xs">
            {" "}
            with {props.partners.length} {props.partners.at(0)?.identifier}
          </div>
        )}
      </div>
      <div className="h-2" />

      <Command shouldFilter={false}>
        <CommandInput
          placeholder={"Search"}
          className="h-9"
          onValueChange={(e) => {
            setFilterValue(e);
          }}
          autoFocus
        />

        <CommandList>
          <ApplicableLocalActions {...props} filter={filter} />
          <CommandEmpty>{"No Action available"}</CommandEmpty>
          <Guard.Rekuest fallback={<></>}>
            <ApplicableShortcuts {...props} filter={filter} />
          </Guard.Rekuest>

          <Guard.Kraph fallback={<></>}>
            {!props.disableKraph && (
              <ApplicableRelations {...props} filter={filter} />
            )}
          </Guard.Kraph>

          <Guard.Rekuest fallback={<></>}>
            {!props.disableActions && (
              <ApplicableActions {...props} filter={filter} />
            )}
            {!props.disableBatchActions && (
              <ApplicableBatchActions {...props} filter={filter} />
            )}
          </Guard.Rekuest>

          <Guard.Kabinet fallback={<></>}>
            <ApplicableDefinitions {...props} filter={filter} />
          </Guard.Kabinet>
        </CommandList>
      </Command>
    </>
  );
};
