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
    description: "Delete the image",
    service: "mikro",
    typename: "Image",
    mutation: DeleteImageDocument,
  }),
  buildDeleteAction({
    title: "Delete File",
    identifier: "@mikro/file",
    description: "Delete the file",
    service: "mikro",
    typename: "File",
    mutation: DeleteFileDocument,
  }),
];
