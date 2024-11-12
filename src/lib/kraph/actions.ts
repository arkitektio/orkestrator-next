import { Action } from "@/actions/action-registry";
import { buildDeleteAction } from "@/actions/builders/deleteAction";
import {
  DeleteGraphDocument,
  DeleteOntologyDocument,
} from "@/kraph/api/graphql";

export const MIKRO_ACTIONS: Action[] = [
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
