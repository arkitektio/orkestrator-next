
import { DeletePodDocument } from "@/kabinet/api/graphql";
import { buildDeleteAction } from "../localactions/builders/deleteAction";
import { Action } from "../localactions/LocalActionProvider";

export const KABINET_ACTIONS: Record<string, Action> = {
  "delete-pod": buildDeleteAction({
    title: "Delete Agent",
    identifier: "@kabinet/pod",
    description: "Delete the pod",
    service: "kabinet",
    typename: "Pod",
    mutation: DeletePodDocument,
  }),
} as const;
