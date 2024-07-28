import { Action } from "@/actions/action-registry";
import { buildDeleteAction } from "@/actions/builders/deleteAction";
import {
  DeleteFileDocument,
  DeleteImageDocument,
} from "@/mikro-next/api/graphql";

export const MIKRO_ACTIONS: Action[] = [
  buildDeleteAction({
    title: "Delete Image",
    identifier: "@mikro/image",
    service: "mikro",
    mutation: DeleteImageDocument,
  }),
  buildDeleteAction({
    title: "Delete File",
    identifier: "@mikro/file",
    service: "mikro",
    mutation: DeleteFileDocument,
  }),
];
