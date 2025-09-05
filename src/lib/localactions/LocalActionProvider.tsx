import React, { createContext, useContext } from "react";

import { useDialog } from "@/app/dialog";
import { ServiceMap } from "@/lib/arkitekt/provider";
import { useNavigate } from "react-router-dom";

export type IdentifierActive = {
  type: "identifier";
  optional?: boolean;
  identifier: string;
};

export type MixtureActive = {
  type: "mixture";
  identifiers: string[];
};

export type PartnerIdentifierActive = {
  type: "pidentifier";
  identifier: string;
};

export type PartnerMixtureActive = {
  type: "pmixture";
  identifiers: string[];
};

export type ObjectHomogenous = {
  type: "homogenous";
};

export type PartnerHomogenous = {
  type: "phomogenous";
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

export type OnRoute = {
  type: "onroute";
  route: string;
};

export type CommandSelect = {
  type: "command";
  command: boolean;
};

export type Condition =
  | IdentifierActive
  | PartnerActive
  | CommandSelect
  | PartnerIsNull
  | ObjectHomogenous
  | HasPartner
  | OnRoute
  | PartnerIdentifierActive
  | PartnerHomogenous
  | MixtureActive
  | PartnerMixtureActive;

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
  location: Location;
  services: ServiceMap;
  onProgress: (progress: number) => void;
  abortSignal: AbortSignal;
  dialog: ReturnType<typeof useDialog>;
  navigate: ReturnType<typeof useNavigate>;
};

export type SetAction = ActionState;

export type Action = {
  title: string;
  description: string;
  conditions: readonly Condition[];
  collections?: readonly string[];
  execute: (action: ActionParams) => Promise<ActionState | void>;
};

export type ActionRegistry = Record<string, Action>;

export const getActionsForState = (
  registry: ActionRegistry,
  state: ActionState,
): Action[] => {
  return Object.values(registry).filter((action) => {
    return action.conditions.every((condition) => {
      if (condition.type === "identifier") {
        return state.left.some(
          (structure) => structure.identifier === condition.identifier,
        );
      }
      if (condition.type === "homogenous") {
        const identifier = state.left.at(0)?.identifier;
        if (!identifier) {
          return true;
        }
        return state.left.every(
          (structure) => structure.identifier === identifier,
        );
      }
      if (condition.type === "pidentifier") {
        return state.right?.some(
          (structure) => structure.identifier === condition.identifier,
        );
      }
      if (condition.type === "mixture") {
        return condition.identifiers.some((id) =>
          state.left.some((structure) => structure.identifier === id),
        );
      }
      if (condition.type === "pmixture") {
        return condition.identifiers.some((id) =>
          state.right?.some((structure) => structure.identifier === id),
        );
      }

      if (condition.type === "phomogenous") {
        const identifier = state.right?.at(0)?.identifier;
        if (!identifier) {
          return true;
        }
        return state.right?.every(
          (structure) => structure.identifier === identifier,
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
      if (condition.type === "onroute") {
        return window.location.pathname.includes(condition.route);
      }

      if (condition.type === "command") {
        return state.isCommand === condition.command;
      }
      return false;
    });
  });
};

// --- Factory Function Following Dialog Provider Pattern ---
export function createLocalActionProvider<
  const TRegistry extends Record<string, Action>,
>(registry: TRegistry) {
  type LocalActionId = keyof TRegistry;

  const LocalActionContext = createContext<{
    registry: TRegistry;
  }>({
    registry,
  });

  const useLocalActions = () => useContext(LocalActionContext);

  const useMatchingActions = (options: {
    state: ActionState;
    search?: string;
  }) => {
    const { registry } = useLocalActions();
    return getActionsForState(registry, options.state).filter((action) => {
      if (options.search) {
        return (
          action.title.toLowerCase().includes(options.search.toLowerCase()) ||
          action.description
            .toLowerCase()
            .includes(options.search.toLowerCase())
        );
      }
      return true;
    });
  };

  const useAction = <T extends LocalActionId>(identifier: T): TRegistry[T] => {
    const { registry } = useLocalActions();
    return registry[identifier];
  };

  const LocalActionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    return (
      <LocalActionContext.Provider value={{ registry: registry }}>
        {children}
      </LocalActionContext.Provider>
    );
  };

  return {
    LocalActionProvider,
    useAction,
    useMatchingActions,
    registry,
  };
}
