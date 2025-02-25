import {
  Action,
  ActionState,
  defaultRegistry,
  Structure,
} from "@/actions/action-registry";
import { useArkitekt } from "@/arkitekt/provider";
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
import { cn } from "@/lib/utils";
import { KabinetDefinition } from "@/linkers";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { CommandGroup } from "cmdk";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DemandKind,
  ListTemplateFragment,
  PortKind,
  PrimaryNodeFragment,
  useAllPrimaryNodesQuery,
  useTemplatesQuery,
} from "../api/graphql";
import { useLiveAssignation } from "../hooks/useAssignations";
import { useNodeAction } from "../hooks/useNodeAction";
import { TemplateActionButton } from "./TemplateActionButton";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { NodeAssignForm } from "../forms/NodeAssignForm";
import { useAssign } from "../hooks/useAssign";
import { BiRun } from "react-icons/bi";
import { useHashAction } from "../hooks/useHashActions";
import { KABINET_INSTALL_DEFINITION_HASH } from "@/constants";

export const DirectTemplateAssignment = (
  props: SmartContextProps & { node: PrimaryNodeFragment },
) => {
  const templates = useTemplatesQuery({
    variables: {
      filters: {
        nodeHash: props.node,
      },
    },
  });

  return (
    <>
      <div className="flex flex-row text-xs">Run on</div>
      <div className="flex flex-col gap-2">
        {templates.data?.templates.map((x) => (
          <>
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex flex-col"
              onClick={() => props.onSelectTemplate(props.node, x)}
            >
              <span className="mr-auto text-md text-gray-100">
                {x.agent.name}
              </span>
              <span className="mr-auto text-xs text-gray-400">
                {x.interface}
              </span>
            </Button>
          </>
        ))}
      </div>
    </>
  );
};

export const AssignButton = (
  props: SmartContextProps & { node: PrimaryNodeFragment },
) => {
  const status = useLiveAssignation({
    identifier: props.identifier,
    object: props.object,
    node: props.node.id,
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <CommandItem
          onSelect={() => props.onSelectNode(props.node)}
          value={props.node.id}
          key={props.node.id}
          className="flex-grow  flex flex-col group cursor-pointer"
          style={{
            backgroundSize: `${status?.progress || 0}% 100%`,
            backgroundImage: `linear-gradient(to right, #10b981 ${status?.progress}%, #10b981 ${status?.progress}%)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
          }}
        >
          <span className="mr-auto text-md text-gray-100">
            {props.node.name}
          </span>
          <span className="mr-auto text-xs text-gray-400">
            {props.node.description}
          </span>
        </CommandItem>
      </ContextMenuTrigger>
      <ContextMenuContent className="text-white border-gray-800 px-2 py-2 items-center">
        <DirectTemplateAssignment {...props} node={props.node} />
      </ContextMenuContent>
    </ContextMenu>
  );
};

export const AutoInstallButton = (props: { definition: string }) => {
  const { assign } = useHashAction({
    hash: KABINET_INSTALL_DEFINITION_HASH,
  });

  return (
    <Button
      className="group-hover:block hidden"
      variant={"outline"}
      onClick={(e) => {
        e.preventDefault();
        assign({ args: { definition: props.definition } });
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

export const ApplicableNodes = (props: PassDownProps) => {
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

  const { data } = useAllPrimaryNodesQuery({
    variables: {
      filters: {
        demands: demands,
        search: props.filter && props.filter != "" ? props.filter : undefined,
      },
    },
  });

  if (!data) {
    return null;
  }

  if (data.nodes.length === 0) {
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
      {data?.nodes.map((x) => <AssignButton node={x} {...props} />)}
    </CommandGroup>
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

export const ApplicableActions = (props: PassDownProps) => {
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
  const [filter, setFilterValue] = React.useState<string | undefined>(
    undefined,
  );

  const [dialogNode, setDialogNode] = React.useState<{
    node: PrimaryNodeFragment;
    args: { [key: string]: any };
  } | null>(null);

  const { assign } = useAssign();

  const conditionalAssign = async (node: PrimaryNodeFragment) => {
    let the_key = node.args?.at(0)?.key;

    let neededAdditionalPorts = node.args.filter(
      (x) => !x.nullable && x.key != the_key,
    );
    if (!the_key) {
      toast.error("No key found");
      return;
    }
    if (neededAdditionalPorts.length > 0) {
      setDialogNode({ node: node, args: { [the_key]: props.object } });
      return;
    }

    try {
      await assign({
        node: node.id,
        args: {
          [the_key]: props.object,
        },
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const onTemplateSelect = async (
    node: PrimaryNodeFragment,
    template: ListTemplateFragment,
  ) => {
    let the_key = node.args?.at(0)?.key;

    let neededAdditionalPorts = node.args.filter(
      (x) => !x.nullable && x.key != the_key,
    );
    if (!the_key) {
      toast.error("No key found");
      return;
    }
    if (neededAdditionalPorts.length > 0) {
      setDialogNode(node);
      return;
    }

    try {
      await assign({
        node: node.id,
        args: {
          [the_key]: props.object,
        },
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (props.object === "") {
    return <> Error</>;
  }

  return (
    <>
      <Dialog
        open={dialogNode != null}
        onOpenChange={() => setDialogNode(null)}
      >
        <DialogTrigger asChild>
          <Popover>
            <PopoverTrigger asChild>
              {props.children || (
                <Button variant={"outline"} className="w-6 h-9 text-white">
                  Do
                </Button>
              )}
            </PopoverTrigger>
            <PopoverContent className="text-white border-gray-800 px-2 py-2 items-left">
              <SmartContext
                {...props}
                onSelectNode={conditionalAssign}
                onSelectTemplate={onTemplateSelect}
              />
            </PopoverContent>
          </Popover>
        </DialogTrigger>
        <DialogContent>
          <NodeAssignForm
            id={dialogNode?.node.id || ""}
            args={dialogNode?.args}
            hidden={dialogNode?.args}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export type SmartContextProps = ObjectButtonProps & {
  onSelectNode: (node: PrimaryNodeFragment) => Promise<void>;
  onSelectTemplate: (
    node: PrimaryNodeFragment,
    template: ListTemplateFragment,
  ) => Promise<void>;
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
          <ApplicableActions {...props} filter={filter} />
          <ApplicableNodes {...props} onSelectNode={props.onSelectNode} />
          <ApplicableDefinitions {...props} partners={props.partners} />
        </CommandList>
      </Command>
    </>
  );
};
