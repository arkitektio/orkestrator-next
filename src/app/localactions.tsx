import { KRAPH_ACTIONS } from "@/kraph/actions";
import { ALPAKA_ACTIONS } from "@/lib/alpaka/actions";
import { ELEKTRO_ACTIONS } from "@/lib/elektro/actions";
import { KABINET_ACTIONS } from "@/lib/kabinet/actions";
import {
  Action,
  createLocalActionProvider,
} from "@/lib/localactions/LocalActionProvider";
import { LOK_ACTIONS } from "@/lib/lok/actions";
import { MIKRO_ACTIONS } from "@/lib/mikro/actions";
import { REKUEST_ACTIONS } from "@/lib/rekuest/actions";
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
const PopOutAction: Action = {
  title: "Open in new window",
  description: "Open the structure in a new window",
  conditions: [
    {
      type: "nopartner",
    },
  ],
  execute: async ({ state }) => {
    for (const item of state.left) {
      const identifier = item.identifier;
      const object = item.object;
      if (!identifier) {
        throw new Error("No identifier provided for Open action");
      }

      const path = smartRegistry.findModel(identifier)?.path;
      if (!path) {
        throw new Error(`No path found for identifier ${identifier}`);
      }
      window.api.openSecondWindow(linkBuilder(path)(object));
    }
  },
  collections: ["smart"],
};

export const { LocalActionProvider, useAction, useMatchingActions, registry } =
  createLocalActionProvider({
    ...MIKRO_ACTIONS,
    ...KRAPH_ACTIONS,
    ...LOK_ACTIONS,
    ...KABINET_ACTIONS,
    ...REKUEST_ACTIONS,
    ...ELEKTRO_ACTIONS,
    ...ALPAKA_ACTIONS,
    popout: PopOutAction,
    navigate: NavigateAction,
  } as const);
