import {
  Action,
  ActionState,
  defaultRegistry,
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
  usePrimaryDefinitionsQuery,
} from "@/kabinet/api/graphql";
import { KabinetDefinition } from "@/linkers";
import { PlusIcon } from "@radix-ui/react-icons";
import { CommandGroup } from "cmdk";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  PrimaryActionFragment,
  usePrimaryReturnActionsQuery,
  useImplementationsQuery,
} from "../api/graphql";
import { useLiveAssignation } from "../hooks/useAssignations";
import { useAction } from "../hooks/useAction";
import { ImplementationActionButton } from "./ImplementationActionButton";

export const DirectImplementationAssignment = (props: {
  action: PrimaryActionFragment;
  identifier: string;
}) => {
  const implementations = useImplementationsQuery({
    variables: {
      filters: {
        actionHash: props.action.hash,
      },
    },
  });

  return (
    <>
      <div className="flex flex-row text-xs">Run on</div>
      <div className="flex flex-col gap-2">
        {implementations.data?.implementations.map((x) => (
          <>
            <ImplementationActionButton id={x.id} args={{}}>
              <Button variant={"outline"} size={"sm"} className="flex flex-col">
                <span className="mr-auto text-md text-gray-100">
                  {x.agent.name}
                </span>
                <span className="mr-auto text-xs text-gray-400">
                  {x.interface}
                </span>
              </Button>
            </ImplementationActionButton>
          </>
        ))}
      </div>
    </>
  );
};

export const AssignButton = (props: {
  action: PrimaryActionFragment;
  identifier: string;
}) => {
  const { assign, latestAssignation } = useAction({ id: props.action.id });

  const objectAssign = async () => {
    try {
      await assign({
        action: props.action.id,
        args: {},
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const status = useLiveAssignation({
    assignedAction: props.action.id,
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <CommandItem
          onSelect={objectAssign}
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
        <DirectImplementationAssignment
          action={props.action}
          identifier={props.identifier}
        />
      </ContextMenuContent>
    </ContextMenu>
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
        <TooltipTrigger className="flex flex-col">
          <span className="mr-auto text-md text-gray-100 flex">
            {props.definition.name}
          </span>
          <span className="mr-auto text-xs text-gray-400">
            {props.definition.description}
          </span>
        </TooltipTrigger>
        <TooltipContent>{props.definition.description}</TooltipContent>
      </Tooltip>
    </CommandItem>
  );
};

export const ApplicableNewActions = (props: {
  identifier: string;
  filter?: string;
}) => {
  const { data } = usePrimaryReturnActionsQuery({
    variables: {
      identifier: props.identifier,
      search: props.filter,
    },
  });

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
        <AssignButton action={x} identifier={props.identifier} />
      ))}
    </CommandGroup>
  );
};

export const ApplicableNewDefinitions = (props: {
  identifier: string;
  filter?: string;
}) => {
  const { data } = usePrimaryDefinitionsQuery({
    variables: {
      identifier: props.identifier,
      search: props.filter,
    },
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

export const useLocalAction = (props: {
  action: Action;
  state: ActionState;
}) => {
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
        services: app.clients,
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
  const { assign, progress } = useLocalAction(props);

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

export type NewButtonProps = {
  identifier: string;
  children?: React.ReactNode;
  className?: string;
  minimal?: boolean;
};

export const NewButton = (props: NewButtonProps) => {
  const [filter, setFilterValue] = React.useState<string | undefined>(
    undefined,
  );

  return (
    <>
      <>
        <Popover>
          <PopoverTrigger asChild>
            {props.children ||
              (props.minimal ? (
                <Button variant={"ghost"} size={"sm"}>
                  <PlusIcon />
                </Button>
              ) : (
                <Button variant={"outline"} size={"default"}>
                  <>
                    <PlusIcon className="mr-2" />
                    Create
                  </>
                </Button>
              ))}
          </PopoverTrigger>
          <PopoverContent className="text-white border-gray-800 px-2 py-2 items-center">
            <NewContext {...props} />
          </PopoverContent>
        </Popover>
      </>
    </>
  );
};

export const NewContext = (props: NewButtonProps) => {
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
          <ApplicableNewActions identifier={props.identifier} filter={filter} />

          <ApplicableNewDefinitions
            identifier={props.identifier}
            filter={filter}
          />
        </CommandList>
      </Command>
    </>
  );
};
