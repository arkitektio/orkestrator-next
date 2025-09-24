
import {
  DeleteAgentDocument,
  DeleteShortcutDocument,
} from "@/rekuest/api/graphql";
import { buildDeleteAction } from "../localactions/builders/deleteAction";
import { Action } from "../localactions/LocalActionProvider";

export const REKUEST_ACTIONS: Record<string, Action> = {
  "rekuest-delete-agent": buildDeleteAction({
    title: "Delete Agent",
    identifier: "@rekuest/agent",
    description: "Delete the agent",
    service: "rekuest",
    typename: "Agent",
    mutation: DeleteAgentDocument,
  }),
  "rekuest-delete-shortcut": buildDeleteAction({
    title: "Delete Shortcut",
    identifier: "@rekuest/shortcut",
    description: "Delete the shortcut",
    service: "rekuest",
    typename: "Shortcut",
    mutation: DeleteShortcutDocument,
  }),
} as const;
