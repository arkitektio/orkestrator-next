import { Action } from "@/actions/action-registry";
import { buildDeleteAction } from "@/actions/builders/deleteAction";
import {
  DeleteAgentDocument,
  DeleteShortcutDocument,
} from "@/rekuest/api/graphql";

export const REKUEST_ACTIONS: Action[] = [
  buildDeleteAction({
    title: "Delete Agent",
    identifier: "@rekuest/agent",
    description: "Delete the agent",
    service: "rekuest",
    typename: "Agent",
    mutation: DeleteAgentDocument,
  }),
  buildDeleteAction({
    title: "Delete Shortcut",
    identifier: "@rekuest/shortcut",
    description: "Delete the shortcut",
    service: "rekuest",
    typename: "Shortcut",
    mutation: DeleteShortcutDocument,
  }),
];
