import { usePerformAction } from "@/app/hooks/useLocalAction";
import { useMatchingActions } from "@/app/localactions";
import {
  CommandItem,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Action, ActionState } from "@/lib/localactions/LocalActionProvider";
import { CommandGroup } from "cmdk";
import type { OnDone, PassDownProps } from "../types";

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
      {actions.map((action) => (
        <LocalActionCommand
          key={action.title}
          action={action}
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
