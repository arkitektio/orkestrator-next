import { Action } from "@/actions/action-registry";
import { buildDeleteAction } from "@/actions/builders/deleteAction";
import { KabinetPod } from "@/linkers";

export const KABINET_ACTIONS: Action[] = [
  buildDeleteAction({
    title: "Delete Pod",
    identifier: KabinetPod,
    service: "kabinet",
    mutation: KabinetPod.deleteMutation,
  }),
];
