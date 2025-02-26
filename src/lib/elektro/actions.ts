import { Action } from "@/actions/action-registry";
import { buildDeleteAction } from "@/actions/builders/deleteAction";
import { DeleteRoomDocument } from "@/alpaka/api/graphql";

export const ALPAKA_ACTIONS: Action[] = [
  buildDeleteAction({
    title: "Delete Room",
    identifier: "@alpaka/room",
    description: "Delete the Graph",
    service: "alpaka",
    typename: "Room",
    mutation: DeleteRoomDocument,
  }),
];
