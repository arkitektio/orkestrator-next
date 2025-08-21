import {
  Action,
  ActionState,
  defaultRegistry,
  Structure,
} from "@/actions/action-registry";
import { useDialog } from "@/app/dialog";
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
import { KABINET_INSTALL_DEFINITION_HASH } from "@/constants";
import {
  ListDefinitionFragment,
  useAllPrimaryDefinitionsQuery,
} from "@/kabinet/api/graphql";
import {
  ListMeasurementCategoryWithGraphFragment,
  ListStructureRelationCategoryWithGraphFragment,
  useCreateStructureMutation,
  useCreateStructureRelationMutation,
  useListMeasurmentCategoryQuery,
  useListStructureRelationCategoryQuery,
} from "@/kraph/api/graphql";
import { Guard, useRekuest } from "@/lib/arkitekt/Arkitekt";
import { useArkitekt } from "@/lib/arkitekt/provider";
import { cn } from "@/lib/utils";
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
  useAllPrimaryActionsQuery,
  useImplementationsQuery,
  useShortcutsQuery,
} from "../api/graphql";
import { registeredCallbacks } from "../components/functional/AssignationUpdater";
import { useAssign } from "../hooks/useAssign";
import { useHashActionWithProgress } from "../hooks/useHashActionWithProgress";
import { Identifier, ObjectID } from "@/types";

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

    if (props.identifier && props.object) {
      const the_key = action.args?.at(0)?.key;
      if (!the_key) {
        toast.error("No key found for self");
        return;
      }
      keys[the_key] = props.object;
    }

    if (props.partners && props.partners.length > 0) {
      for (let i = 0; i < props.partners.length; i++) {
        const port = action.args.at(i + 1);
        if (!port) {
          toast.error("No key found for partner " + i);
          return;
        }
        if (port.identifier !== props.partners[i].identifier) {
          toast.error(
            `Key mismatch for partner ${i}: expected ${port.identifier}, got ${props.partners[i].identifier}`,
          );
          return;
        }
        const partner = props.partners[i];
        keys[port.key] = partner.object;
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

  const conditionalAssign = async (shortcut: ListShortcutFragment) => {
    let the_key = shortcut.args?.at(0)?.key;

    if (!the_key) {
      toast.error("No key found");
      return;
    }
    if (shortcut.args.length > 1) {
      openDialog("actionassign", {
        id: shortcut.action.id,
        args: { [the_key]: props.object, ...shortcut.savedArgs },
        hidden: { [the_key]: props.object, ...shortcut.savedArgs },
      });
      return;
    }

    try {
      await assign({
        action: shortcut.action.id,
        args: {
          [the_key]: props.object,
          ...shortcut.savedArgs,
        },
      });
      if (props.onDone) {
        props.onDone();
      }
    } catch (e) {
      toast.error(e.message);
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
  const { assign, progress, doing, installed } = useHashActionWithProgress({
    hash: KABINET_INSTALL_DEFINITION_HASH,
  });

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
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  const client = useRekuest();

  const { assign, progress, doing, installed, onDone } =
    useHashActionWithProgress({
      hash: KABINET_INSTALL_DEFINITION_HASH,
      onDone: (event) => {
        client.refetchQueries({ include: ["AllPrimaryActions"] });
      },
    });

  return (
    <CommandItem
      value={props.definition.id}
      key={props.definition.id}
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
              {props.definition.description}
            </div>
          </div>
          <div className="flex-grow"></div>
        </TooltipTrigger>
        <TooltipContent>{props.definition.description}</TooltipContent>
      </Tooltip>
    </CommandItem>
  );
};

export const ApplicableActions = (props: PassDownProps) => {
  const demands: PortDemandInput[] = [];

  if (props.identifier) {
    demands.push({
      kind: DemandKind.Args,
      matches: [
        { at: 0, kind: PortKind.Structure, identifier: props.identifier },
      ],
    });
  }

  const firstPartner = props.partners?.at(0);

  if (firstPartner) {
    demands.push({
      kind: DemandKind.Args,
      matches: [
        {
          at: 1,
          kind: PortKind.Structure,
          identifier: firstPartner.identifier,
        },
      ],
    });
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
  const demands = [
    {
      kind: DemandKind.Args,
      matches: [
        { at: 0, kind: PortKind.Structure, identifier: props.identifier },
      ],
    },
  ];

  let firstPartner = props.partners?.at(0);

  if (firstPartner) {
    demands.push({
      kind: DemandKind.Args,
      matches: [
        {
          at: 1,
          kind: PortKind.Structure,
          identifier: firstPartner.identifier,
        },
      ],
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
  const demands = [
    {
      kind: DemandKind.Args,
      matches: [
        { at: 0, kind: PortKind.Structure, identifier: props.identifier },
      ],
    },
  ];

  let firstPartner = props.partners?.at(0);

  if (firstPartner) {
    demands.push({
      kind: DemandKind.Args,
      matches: [
        {
          at: 1,
          kind: PortKind.Structure,
          identifier: firstPartner.identifier,
        },
      ],
    });
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

  return (
    <CommandGroup
      heading={
        <span className="font-light text-xs w-full items-center ml-2 w-full">
          Installable
        </span>
      }
    >
      {data?.definitions.map((x) => (
        <InstallButton definition={x} key={x.id}>
          {x.name}
        </InstallButton>
      ))}
    </CommandGroup>
  );
};

export const ApplicableRelations = (props: PassDownProps) => {
  const firstPartner = props.partners?.at(0);

  if (!firstPartner) {
    return null;
  }

  const dialog = useDialog();

  const { data, error } = useListStructureRelationCategoryQuery({
    variables: {
      filters: {
        sourceIdentifier: props.identifier,
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
        <RelateButton relation={x} right={firstPartner} left={props} key={x.id}>
          {x.label}
        </RelateButton>
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
            left: [
              {
                identifier: props.identifier,
                object: props.object,
              },
            ],
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

export const ApplicableMeasurements = (props: PassDownProps) => {
  const firstPartner = props.partners?.at(0);

  if (firstPartner) {
    return null;
  }

  const dialog = useDialog();

  const { data, error } = useListMeasurmentCategoryQuery({
    variables: {
      filters: {
        sourceIdentifier: props.identifier,
        search: props.filter && props.filter != "" ? props.filter : undefined,
      },
    },
    fetchPolicy: "network-only",
  });

  return (
    <CommandGroup
      heading={
        <span className="font-light text-xs w-full items-center ml-2 w-full">
          Set as ...
        </span>
      }
    >
      {data?.measurementCategories.map((x) => (
        <MeasurementButton measurement={x} left={props} key={x.id}>
          {x.label}
        </MeasurementButton>
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
            left: [
              {
                identifier: props.identifier,
                object: props.object,
              },
            ],
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

export const RelateButton = (props: {
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
    try {
      const leftStructureString = `${props.left.identifier}:${props.left.object}`;
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

export const MeasurementButton = (props: {
  measurement: ListMeasurementCategoryWithGraphFragment;
  left: PassDownProps;
  children: React.ReactNode;
}) => {
  const dialog = useDialog();

  return (
    <CommandItem
      value={props.measurement.label}
      key={props.measurement.id}
      onSelect={() =>
        dialog.openDialog("setasmeasurement", {
          left: [
            {
              identifier: props.left.identifier,
              object: props.left.object,
            },
          ],
          measurement: props.measurement,
        })
      }
      className="flex-1 "
    >
      <Tooltip>
        <TooltipTrigger className="flex flex-row group w-full">
          <div className="flex-col">
            <div className="text-md text-gray-100 text-left">
              {props.measurement.label}
            </div>
            <div className="text-xs text-gray-400 text-left">
              {props.measurement.graph.name}
            </div>
          </div>
          <div className="flex-grow"></div>
        </TooltipTrigger>
        <TooltipContent>{props.measurement.description}</TooltipContent>
      </Tooltip>
    </CommandItem>
  );
};

export const useAction = (props: {
  action: Action;
  state: ActionState;
  onDone?: OnDone;
}) => {
  const [progress, setProgress] = React.useState<number | undefined>(0);
  const [controller, setController] = React.useState<AbortController | null>(
    null,
  );
  const app = useArkitekt();
  const dialog = useDialog();
  const navigate = useNavigate();

  const assign = async () => {
    if (controller) {
      controller.abort();
      return;
    }
    let newController = new AbortController();

    setController(newController);

    try {
      await props.action.execute({
        onProgress: (p) => {
          setProgress(p);
        },
        abortSignal: newController.signal,
        services: app.connection?.clients || {},
        dialog,
        navigate,
        state: props.state,
      });
      setController(null);
      setProgress(undefined);
      if (props.onDone) {
        props.onDone();
      }
    } catch (e) {
      setProgress(undefined);
      setController(null);
      if (props.onDone) {
        props.onDone();
      }
      console.error(e);
    }
  };

  return {
    progress,
    assign,
  };
};

export const useActions = (props: { state: ActionState; filter?: string }) => {
  return defaultRegistry.getActionsForState(props.state);
};

export const LocalActionButton = (props: {
  action: Action;
  state: ActionState;
  onDone?: OnDone;
}) => {
  const { assign, progress } = useAction(props);

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
  const actions = useActions(props).filter(
    (x) =>
      !props.filter ||
      x.title.toLowerCase().includes(props.filter.toLowerCase()),
  );

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
        <LocalActionButton
          key={x.name}
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
        left:
          props.identifier && props.object
            ? [{ object: props.object, identifier: props.identifier }]
            : [],
        right: props.partners,
        isCommand: false,
      }}
      filter={props.filter}
      onDone={props.onDone}
    />
  );
};

export type SmartContextProps = {
  object?: ObjectID;
  identifier?: Identifier;
  children?: React.ReactNode;
  className?: string;
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
};

export type ObjectButtonProps = SmartContextProps & {
  children?: React.ReactNode;
  className?: string;
};

export type PassDownProps = SmartContextProps & {
  filter?: string;
};

export const ObjectButton = (props: ObjectButtonProps) => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          {props.children || (
            <Button variant={"outline"} className="text-white">
              <PlayIcon />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="text-white border-gray-800 px-2 py-2 items-left">
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
          </Guard.Rekuest>

          <ApplicableLocalActions {...props} filter={filter} />
          <Guard.Kabinet fallback={<></>}>
            <ApplicableDefinitions
              {...props}
              partners={props.partners}
              filter={filter}
            />
          </Guard.Kabinet>
        </CommandList>
      </Command>
    </>
  );
};
