import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretDownIcon } from "@radix-ui/react-icons";
import React from "react";
import { toast } from "sonner";
import { PrimaryNodeFragment, usePrimaryNodesQuery } from "../api/graphql";
import { useAssignProgress } from "../hooks/useAssignProgress";
import { useNodeAction } from "../hooks/useNodeAction";
import { App } from "@/arkitekt/types";
import { Action, ActionState, defaultRegistry } from "@/app/action-registry";
import { useArkitekt } from "@/arkitekt/provider";

export const AssignButton = (props: {
  object: string;
  node: PrimaryNodeFragment;
  children: React.ReactNode;
  identifier: string;
}) => {
  const { assign, latestAssignation } = useNodeAction({ id: props.node.id });

  const objectAssign = async () => {
    let the_key = props.node.args?.at(0)?.key;
    if (!the_key) {
      toast.error("No key found");
      return;
    }
    try {
      await assign({
        node: props.node.id,
        args: {
          [the_key]: props.object,
        },
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const progress = useAssignProgress({
    identifier: props.identifier,
    object: props.object,
    node: props.node.id,
  });

  return (
    <Button
      onClick={objectAssign}
      variant={"outline"}
      size="sm"
      className="flex-1"
      style={{
        backgroundSize: `${progress?.progress || 0}% 100%`,
        backgroundImage: `linear-gradient(to right, #10b981 ${progress?.progress}%, #10b981 ${progress?.progress}%)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
      }}
    >
      {props.children}
    </Button>
  );
};

export const ApplicableNodes = (props: {
  object: string;
  identifier: string;
}) => {
  const { data } = usePrimaryNodesQuery({
    variables: {
      identifier: props.identifier,
    },
  });

  return (
    <div className="grid grid-cols-1 w-full gap-2 ">
      {data?.nodes.map((x) => (
        <AssignButton
          node={x}
          object={props.object}
          identifier={props.identifier}
        >
          {x.name}
        </AssignButton>
      ))}
    </div>
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

export const useActions = (props: { state: ActionState }) => {
  return defaultRegistry.getActionsForState(props.state);
};

export const LocalActionButton = (props: {
  action: Action;
  state: ActionState;
}) => {
  const { assign, progress } = useAction(props);

  return (
    <Button
      onClick={assign}
      variant={"outline"}
      className="flex-1"
      style={{
        backgroundSize: `${progress || 0}% 100%`,
        backgroundImage: `linear-gradient(to right, #10b981 ${progress}%, #10b981 ${progress}%)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
      }}
    >
      {props.action.name}
    </Button>
  );
};

export const Actions = (props: { state: ActionState }) => {
  const actions = useActions(props);

  return (
    <div className="grid grid-cols-1 w-full gap-2 ">
      {actions.map((x) => (
        <LocalActionButton action={x} state={props.state} />
      ))}
    </div>
  );
};

export const ApplicableActions = (props: {
  object: string;
  identifier: string;
}) => {
  return (
    <div className="grid grid-cols-1 w-full gap-2 ">
      <Actions state={{ left: [props], isCommand: false }} />
    </div>
  );
};

export type ObjectButtonProps = {
  object: string;
  identifier: string;
  children?: React.ReactNode;
  className?: string;
};

export const ObjectButton = (props: ObjectButtonProps) => {
  return (
    <>
      <>
        <Popover>
          <PopoverTrigger asChild>
            {props.children || (
              <Button size={"icon"} variant={"outline"} className="w-4 h-4">
                <CaretDownIcon className={cn("w-3 h-3", props.className)} />
              </Button>
            )}
          </PopoverTrigger>
          <PopoverContent className="text-white border-gray-800 px-2 py-2 items-center">
            <div className="text-xs text-muted-foreground mx-auto mb-2">
              Assign to
            </div>
            <ApplicableNodes
              object={props.object}
              identifier={props.identifier}
            />
            <ApplicableActions
              object={props.object}
              identifier={props.identifier}
            />
          </PopoverContent>
        </Popover>
      </>
    </>
  );
};
