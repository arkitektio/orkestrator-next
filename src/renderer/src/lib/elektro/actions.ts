import { DeleteBlockDocument } from "@/elektro/api/graphql";
import { Action } from "../localactions/LocalActionProvider";
import { buildDeleteAction } from "../localactions/builders/deleteAction";

export const ELEKTRO_ACTIONS: Record<string, Action> = {
  deleteElektroBlock: buildDeleteAction({
    title: "Delete Block",
    identifier: "@elektro/block",
    description: "Delete the Block",
    service: "elektro",
    typename: "Block",
    mutation: DeleteBlockDocument,
  }),
};
