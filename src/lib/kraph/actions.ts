import { Action } from "@/actions/action-registry";
import { buildDeleteAction } from "@/actions/builders/deleteAction";
import {
  DeleteGraphDocument,
  DeleteOntologyDocument,
} from "@/kraph/api/graphql";

export const KRAPH_ACTIONS: Action[] = [
  buildDeleteAction({
    title: "Delete Graph",
    identifier: "@kraph/graph",
    description: "Delete the Graph",
    service: "kraph",
    typename: "Graph",
    mutation: DeleteGraphDocument,
  }),
  buildDeleteAction({
    title: "Delete Ontology",
    identifier: "@kraph/ontology",
    description: "Delete the Ontology",
    service: "kraph",
    typename: "Ontology",
    mutation: DeleteOntologyDocument,
  }),
];
