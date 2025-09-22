import { Action } from "@/actions/action-registry";
import { buildDeleteAction } from "@/actions/builders/deleteAction";
import { DeleteRoomDocument } from "@/dokuments/api/graphql";

export const DOKUMENTS_ACTIONS: Action[] = [
  buildDeleteAction({
    title: "Delete File",
    identifier: "@dokuments/file",
    description: "Delete the File",
    service: "dokuments",
    typename: "File",
    mutation: DeleteRoomDocument,
  }),
];
