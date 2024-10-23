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
  buildDeleteAction({
    title: "Delete Graph",
    identifier: "@mikro/graph",
    description: "Delete the Graph",

    service: "mikro",
    typename: "Graph",
    mutation: DeleteGraphDocument,
  }),
  buildDeleteAction({
    title: "Delete Ontology",
    identifier: "@mikro/ontology",
    description: "Delete the Ontology",
    service: "mikro",
    typename: "Ontology",
    mutation: DeleteOntologyDocument,
  }),
];
