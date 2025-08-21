import { KRAPH_ACTIONS } from "@/kraph/actions";
import {
  Action,
  createLocalActionProvider,
} from "@/lib/localactions/LocalActionProvider";
import { MIKRO_ACTIONS } from "@/lib/mikro/actions";
import { linkBuilder } from "@/providers/smart/builder";
import { smartRegistry } from "@/providers/smart/registry";

const NavigateAction: Action = {
  title: "Open",
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
};

export const { LocalActionProvider, useAction, useMatchingActions, registry } =
  createLocalActionProvider({
    ...MIKRO_ACTIONS,
    ...KRAPH_ACTIONS,
    navigate: NavigateAction,
  } as const);
