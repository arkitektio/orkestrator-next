import { Action } from "@/actions/action-registry";
import {
  NotifyUserDocument,
  NotifyUserMutation,
  NotifyUserMutationVariables,
} from "@/lok-next/api/graphql";
import { dialog } from "electron";

export const LOK_ACTIONS: Action[] = [
  {
    name: "Notify User",
    description: "Notify a user",
    title: "Notify User",
    conditions: [
      { type: "identifier", identifier: "@lok/user" },
      { type: "nopartner" },
    ],
    collections: ["notify"],
    execute: async ({ state, services, dialog }) => {


      const users = state.left.filter((item) => item.identifier === "@lok/user").map((item) => item.object);

      dialog.openDialog("notifyusers", { users });
    },
  },
  {
    name: "Add User",
    description: "Add a user to an organization",
    title: "Add User",
    conditions: [
      { type: "identifier", identifier: "@lok/user" },
      { type: "nopartner" },
    ],
    collections: ["notify"],
    execute: async ({ state, services, dialog }) => {


      const users = state.left.filter((item) => item.identifier === "@lok/user").map((item) => item.object);

      dialog.openDialog("addusertoorganization", { users });
    },
  },
];
