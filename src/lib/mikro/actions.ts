import { Action } from "@/actions/action-registry";
import { buildDeleteAction } from "@/actions/builders/deleteAction";
import {
  DeleteFileDocument,
  DeleteGraphDocument,
  DeleteImageDocument,
  DeleteOntologyDocument,
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
  buildDeleteAction({
    title: "Delete Graph",
    identifier: "@mikro/graph",
    service: "mikro",
    mutation: DeleteGraphDocument,
  }),
  buildDeleteAction({
    title: "Delete Ontology",
    identifier: "@mikro/ontology",
    service: "mikro",
    mutation: DeleteOntologyDocument,
  }),
];
