import { registry as localActionRegistry } from "@/app/localactions";
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import {
  Action,
  ActionState,
  getActionsForState,
} from "@/lib/localactions/LocalActionProvider";
import { Structure } from "@/types";
import { NativeTypes } from "react-dnd-html5-backend";

export type SmartDragItem = {
  structures: Structure[];
  omitDefaultBehaviour?: boolean;
};

export type ResolvedSmartDrop = {
  partners: Structure[];
  omitDefaultBehaviour: boolean;
};

export const getSmartDropObjects = (selection: Structure[], self: Structure) =>
  selection.length > 1 ? selection : [self];

const isStructure = (value: unknown): value is Structure => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "identifier" in value && "object" in value;
};

const isSmartDragItem = (value: unknown): value is SmartDragItem => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "structures" in value && Array.isArray(value.structures);
};

export const resolveSmartDrop = (
  item: unknown,
  itemType: string | symbol | null,
): ResolvedSmartDrop | null => {
  if (itemType === SMART_MODEL_DROP_TYPE) {
    if (Array.isArray(item) && item.every(isStructure)) {
      return {
        partners: item,
        omitDefaultBehaviour: false,
      };
    }

    if (isSmartDragItem(item)) {
      return {
        partners: item.structures,
        omitDefaultBehaviour: Boolean(item.omitDefaultBehaviour),
      };
    }
  }

  if (itemType === NativeTypes.URL && item && typeof item === "object" && "urls" in item) {
    const urls = Array.isArray(item.urls) ? item.urls : [];
    const partners: Structure[] = [];

    for (const url of urls) {
      if (typeof url !== "string") {
        continue;
      }

      const match = url.match(/arkitekt:\/\/([^:]+):([^\/]+)/);
      if (!match) {
        continue;
      }

      const [, identifier, object] = match;
      partners.push({ identifier, object: JSON.parse(object) });
    }

    return partners.length > 0
      ? {
          partners,
          omitDefaultBehaviour: false,
        }
      : null;
  }

  if (item && typeof item === "object" && "text" in item && typeof item.text === "string") {
    try {
      const parsed = JSON.parse(item.text) as unknown;
      if (!isStructure(parsed)) {
        return null;
      }

      return {
        partners: [parsed],
        omitDefaultBehaviour: false,
      };
    } catch {
      return null;
    }
  }

  return null;
};

export const getMatchingActions = async (
  objects: Structure[],
  partners: Structure[],
): Promise<Action[]> => {
  const state: ActionState = {
    left: objects,
    right: partners,
    isCommand: false,
  };

  return getActionsForState(localActionRegistry, state);
};
