import { useDialog } from "@/app/dialog";
import { ServiceMap } from "@/lib/arkitekt/provider";
import { KRAPH_ACTIONS } from "@/lib/kraph/actions";
import { MIKRO_ACTIONS } from "@/lib/mikro/actions";
import { REKUEST_ACTIONS } from "@/lib/rekuest/actions";
import { linkBuilder } from "@/providers/smart/builder";
import { smartRegistry } from "@/providers/smart/registry";
import { useNavigate } from "react-router-dom";

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

export type PartnerIsNull = {
  type: "nopartner";
};

export type HasPartner = {
  type: "haspartner";
};

export type CommandSelect = {
  type: "command";
  command: boolean;
};

export type Conditions =
  | IdentifierActive
  | PartnerActive
  | CommandSelect
  | PartnerIsNull
  | HasPartner;

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
  dialog: ReturnType<typeof useDialog>;
  navigate: ReturnType<typeof useNavigate>;
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
        if (condition.type === "nopartner") {
          return !state.right || state.right.length === 0;
        }
        if (condition.type === "haspartner") {
          return state.right && state.right?.length > 0;
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

for (let i of REKUEST_ACTIONS) {
  defaultRegistry.registerAction(i);
}

for (let i of KRAPH_ACTIONS) {
  defaultRegistry.registerAction(i);
}

defaultRegistry.registerAction({
  title: "Open",
  name: "open",
  description: "Open the structure",
  conditions: [
    {
      type: "nopartner",
    },
  ],
  execute: async ({ state, navigate }) => {
    const identifier = state.left[0].identifier;
    const object = state.left[0].object;
    if (!identifier) {
      throw new Error("No identifier provided for Open action");
    }

    const path = smartRegistry.findModel(identifier)?.path;
    if (!path) {
      throw new Error(`No path found for identifier ${identifier}`);
    }
    navigate(linkBuilder(path)(object));
  },
  collections: ["smart"],
});
