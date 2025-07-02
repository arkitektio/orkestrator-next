import {
  Action,
  ActionState,
  defaultRegistry,
  Structure,
} from "@/actions/action-registry";
import { useArkitekt } from "@/lib/arkitekt/provider";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { KabinetDefinition } from "@/linkers";
import { CommandGroup } from "cmdk";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DemandKind,
  ListShortcutFragment,
  ListImplementationFragment,
  PortKind,
  PrimaryActionFragment,
  ShortcutFragment,
  useAllPrimaryActionsQuery,
  useShortcutsQuery,
  useImplementationsQuery,
} from "../api/graphql";
import { ActionAssignForm } from "../forms/ActionAssignForm";
import { useAssign } from "../hooks/useAssign";
import { useLiveAssignation } from "../hooks/useAssignations";
import { useHashAction } from "../hooks/useHashActions";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { useDialog } from "@/app/dialog";
import { e } from "node_modules/@udecode/plate-emoji/dist/IndexSearch-Dvqq913n";

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
      await assign({
        implementation: implementation.id,
        args: {
          [the_key]: props.object,
        },
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
    </>
  );
};

export const AssignButton = (
  props: SmartContextProps & { action: PrimaryActionFragment },
) => {
  const status = useLiveAssignation({
    identifier: props.identifier,
    object: props.object,
    action: props.action.id,
  });

  const { assign } = useAssign();
  const { openDialog } = useDialog();

  const conditionalAssign = async (action: PrimaryActionFragment) => {
    let the_key = action.args?.at(0)?.key;

    if (!the_key) {
      toast.error("No key found");
      return;
    }
    if (action.args.length > 1) {
      openDialog("actionassign", {
        id: action.id,
        args: { [the_key]: props.object },
        hidden: { [the_key]: props.object },
      });
      event.stopPropagation();
      return;
    }

    try {
      await assign({
        action: action.id,
        args: {
          [the_key]: props.object,
        },
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger asChild>
        <CommandItem
          onSelect={() => conditionalAssign(props.action)}
          value={props.action.id}
          key={props.action.id}
          className="flex-grow  flex flex-col group cursor-pointer"
          style={{
            backgroundSize: `${status?.progress || 0}% 100%`,
            backgroundImage: `linear-gradient(to right, #10b981 ${status?.progress}%, #10b981 ${status?.progress}%)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
          }}
        >
          <span className="mr-auto text-md text-gray-100">
            {props.action.name}
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
  const status = useLiveAssignation({
    identifier: props.identifier,
    object: props.object,
    action: props.shortcut.action.id,
  });

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
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <CommandItem
      onSelect={() => conditionalAssign(props.shortcut)}
      value={props.shortcut.id}
      key={props.shortcut.id}
      className="flex-initial flex flex-row group cursor-pointer border border-1 rounded rounded-full bg-slate-800 shadow-xl  h-8 overflow-hidden truncate max-w-[100px] ellipsis px-2"
      style={{
        backgroundSize: `${status?.progress || 0}% 100%`,
        backgroundImage: `linear-gradient(to right, #10b981 ${status?.progress}%, #10b981 ${status?.progress}%)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        borderColor: props.shortcut.allowQuick ? "#10b981" : "#4B5563",
      }}
    >
      {props.shortcut.allowQuick && <LightningBoltIcon className="w-4 h-4" />}
      <span className="mr-auto text-md text-gray-100 ellipsis truncate w-full">
        {props.shortcut.name}
      </span>
    </CommandItem>
  );
};

export const AutoInstallButton = (props: { definition: string }) => {
  const { assign, action } = useHashAction({
    hash: KABINET_INSTALL_DEFINITION_HASH,
  });

  return (
    <Button
      className="group-hover:block hidden"
      variant={"outline"}
      onClick={(e) => {
        e.preventDefault();
        assign({ action: action?.id, args: { definition: props.definition } });
      }}
      disabled={!action}
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

  const objectAssign = async () => {
    try {
      navigate(KabinetDefinition.linkBuilder(props.definition.id));
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <CommandItem
      value={props.definition.name}
      key={props.definition.id}
      onSelect={objectAssign}
      className="flex-1 "
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
          <AutoInstallButton definition={props.definition.id} />
        </TooltipTrigger>
        <TooltipContent>{props.definition.description}</TooltipContent>
      </Tooltip>
    </CommandItem>
  );
};

export const ApplicableActions = (props: PassDownProps) => {
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

  const { data, error } = useAllPrimaryActionsQuery({
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

  if (data.actions.length === 0) {
    return (
      <span className="font-light text-xs w-full items-center ml-2 w-full">
        No actions...
      </span>
    );
  }

  return (
    <CommandGroup
      heading={
        <span className="font-light text-xs w-full items-center ml-2 w-full">
          Run...
        </span>
      }
    >
      {data?.actions.map((x) => <AssignButton action={x} {...props} />)}
    </CommandGroup>
  );
};

export const AppicableShortcuts = (props: PassDownProps) => {
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
    return (
      <span className="font-light text-xs w-full items-center ml-2 w-full">
        No actions...
      </span>
    );
  }

  return (
    <div className="flex flex-row gap-2 p-2">
      {data?.shortcuts.map((x) => <ShortcutButton shortcut={x} {...props} />)}
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
        <InstallButton definition={x}>{x.name}</InstallButton>
      ))}
    </CommandGroup>
  );
};

export const useAction = (props: { action: Action; state: ActionState }) => {
  const [progress, setProgress] = React.useState<number | undefined>(0);
  const [controller, setController] = React.useState<AbortController | null>(
    null,
  );
  const app = useArkitekt();

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
        state: props.state,
      });
      setController(null);
      setProgress(undefined);
    } catch (e) {
      setProgress(undefined);
      setController(null);
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

export const Actions = (props: { state: ActionState; filter?: string }) => {
  const actions = useActions(props).filter(
    (x) => !props.filter || x.title.includes(props.filter),
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
        <LocalActionButton action={x} state={props.state} />
      ))}
    </CommandGroup>
  );
};

export const ApplicableLocalActions = (props: PassDownProps) => {
  return (
    <Actions
      state={{
        left: [{ object: props.object, identifier: props.identifier }],
        right: props.partners,
        isCommand: false,
      }}
      filter={props.filter}
    />
  );
};

export type ObjectButtonProps = {
  object: string;
  identifier: string;
  children?: React.ReactNode;
  className?: string;
  partners?: Structure[];
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
            <Button variant={"outline"} className="w-6 h-9 text-white">
              Do
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

export type SmartContextProps = ObjectButtonProps & {};

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
          <AppicableShortcuts {...props} filter={filter} />
          <CommandEmpty>{"No Action available"}</CommandEmpty>

          <ApplicableLocalActions {...props} filter={filter} />
          <ApplicableActions {...props} filter={filter} />

          <ApplicableDefinitions
            {...props}
            partners={props.partners}
            filter={filter}
          />
        </CommandList>
      </Command>
    </>
  );
};
function openDialog(
  arg0: string,
  arg1: { id: string; args: { [x: string]: string } },
) {
  throw new Error("Function not implemented.");
}
