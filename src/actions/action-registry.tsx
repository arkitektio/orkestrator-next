import { ServiceMap } from "@/arkitekt/provider";
import { MIKRO_ACTIONS } from "@/lib/mikro/actions";
import { DeleteFileDocument } from "@/mikro-next/api/graphql";

export type Condition = {
  type: string;
};

export type IdentifierActive = {
  type: "identifier";
  identifier: string;
};

export type PartnerActive = {
  type: "partner";
  partner: string;
};

export type CommandSelect = {
  type: "command";
  command: boolean;
};

export type Conditions = IdentifierActive | PartnerActive | CommandSelect;

export type Structure = {
  object: string;
  identifier: string;
};

export type ActionState = {
  left: Structure[];
  right?: Structure[]; // Potentiall if there was a drag and drop on another group
  isCommand: boolean;
};

export type ActionParams = {
  state: ActionState;
  services: ServiceMap;
  onProgress: (progress: number) => void;
  abortSignal: AbortSignal;
};

export type SetAction = ActionState;

export type Action = {
  name: string;
  title: string;
  description: string;
  conditions: Conditions[];
  collections?: string[];
  execute: (action: ActionParams) => Promise<ActionState | void>;
};

export class ActionRegistry {
  registry: Record<string, Action>;

  constructor() {
    this.registry = {};
  }

  registerAction(action: Action) {
    this.registry[action.name] = action;
  }

  getAction(name) {
    return this.registry[name];
  }

  getActionsForState(state: ActionState): Action[] {
    return Object.values(this.registry).filter((action) => {
      return action.conditions.every((condition) => {
        if (condition.type === "identifier") {
          return state.left.some(
            (structure) => structure.identifier === condition.identifier,
          );
        }
        if (condition.type === "partner") {
          return state.right?.some(
            (structure) => structure.identifier === condition.partner,
          );
        }
        if (condition.type === "command") {
          return state.isCommand === condition.command;
        }
        return false;
      });
    });
  }
}

export const defaultRegistry = new ActionRegistry();

export const get_action_registry = () => {
  return defaultRegistry;
};

for (let i of MIKRO_ACTIONS) {
  defaultRegistry.registerAction(i);
}
