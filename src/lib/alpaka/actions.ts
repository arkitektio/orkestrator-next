
import { DeleteProviderDocument, DeleteRoomDocument } from "@/alpaka/api/graphql";
import { buildDeleteAction } from "../localactions/builders/deleteAction";
import { Action } from "../localactions/LocalActionProvider";

export const ALPAKA_ACTIONS: Record<string, Action> = {
  "alpaka-delete-room": buildDeleteAction({
    title: "Delete Room",
    identifier: "@alpaka/room",
    description: "Delete the Graph",
    service: "alpaka",
    typename: "Room",
    mutation: DeleteRoomDocument,
  }),
  "alpaka-delete-provider": buildDeleteAction({
    title: "Delete Provider",
    identifier: "@alpaka/provider",
    description: "Delete the Provider",
    service: "alpaka",
    typename: "Provider",
    mutation: DeleteProviderDocument,
  }),
}
