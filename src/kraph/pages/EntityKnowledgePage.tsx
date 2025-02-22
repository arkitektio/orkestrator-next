import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { PageLayout } from "@/components/layout/PageLayout";
import { Form } from "@/components/ui/form";
import cytoscape from "cytoscape";
import cola from "cytoscape-cola";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  EntityGraphEdgeFragment,
  EntityGraphNodeFragment,
  GetEntityGraphQuery,
  useCreateEntityGraphRelationMutation,
  useGetEntityGraphNodeLazyQuery,
  useGetEntityGraphQuery,
  useGetEntityQuery,
} from "../api/graphql.js";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import cise from "cytoscape-cise";
import dagre from "cytoscape-dagre";
import { EntityRelationSearchField } from "../components/fields/EntityRelationSearchField.js";
import { EntitySearchField } from "../components/fields/EntitySearchField.js";
import { KnowledgeGraph } from "../components/renderers/graph/KnowledgeGraph.js";

cytoscape.use(cola);
cytoscape.use(cise);
cytoscape.use(dagre);

const nodeToElement = (node: EntityGraphNodeFragment) => {
  return {
    data: {
      id: node.id,
      label: node.label,
      subtitle: node.kindName,
      color: node.linkedExpression.color,
      metrics: node.metrics,
    },
  };
};

const relationToEdge = (edge: EntityGraphEdgeFragment) => {
  return {
    data: {
      id: edge.id,
      source: edge.leftId,
      target: edge.rightId,
      label: edge.label,
      metrics: edge.metrics,
    },
  };
};

export const graphToElements: (graph: GetEntityGraphQuery) => any = (graph) => {
  return [
    ...graph.entityGraph.nodes.map(nodeToElement),
    ...graph.entityGraph.edges.map(relationToEdge),
  ];
};

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null;
  return function (...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const nodeStyle = {
  shape: "round-rectangle",
  width: "80px",
  height: "20px",
  label: "data(label)",

  backgroundColor: "#000000",
  "border-color": "data(color)",
  "text-valign": "center",
  color: "#94A3B8",
  "border-width": 0.5,
  "font-size": "6px",
  "font-family":
    'ui-sans-serif, system-ui, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
};

const edgeStyle = {
  shape: "round-rectangle",
  width: 1,
  "target-arrow-shape": "triangle", // Set the shape of the target arrow
  "target-arrow-width": 0.5, // Set the width of the target arrow
  "arrow-scale": 0.5,
  label: "data(label)", // Show label on edges
  "font-size": "4px",
  "curve-style": "bezier", // Make sure the edges are curved if they overlap
  "text-rotation": "autorotate",
  color: "#94A3B8",
  "text-margin-y": -4,
  "font-family":
    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
};

const layoutOptions = [
  { value: "cise", label: "CISE" },
  { value: "dagre", label: "Dagre" },
  { value: "cola", label: "Cola" },
];

const NewNodecard = (props: {
  addNode: (x: EntityGraphNodeFragment) => void;
  graph: string;
}) => {
  const [get] = useGetEntityGraphNodeLazyQuery();

  const form = useForm({
    defaultValues: {
      node: null,
    },
  });

  const data = form.watch();

  useEffect(() => {
    if (data.node) {
      onSubmit(data);
    }
  }, [data.node]);

  const onSubmit = (values: any) => {
    console.log("Adding node", values);
    get({
      variables: {
        id: values.node,
      },
    }).then((data) => {
      let entity = data.data?.entity;
      if (entity) {
        props.addNode(entity);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        Add Entity to Graph
        <EntitySearchField name="node" graph={props.graph} />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
};

const NewRelationCard = (props: {
  source: EntityGraphNodeFragment;
  target: EntityGraphNodeFragment;
  graph: string;
  addRelation: (x: EntityGraphEdgeFragment) => void;
}) => {
  const [create] = useCreateEntityGraphRelationMutation();

  const form = useForm({
    defaultValues: {
      relation: null,
    },
  });

  const data = form.watch();

  useEffect(() => {
    if (data.relation) {
      onSubmit(data);
    }
  }, [data.relation]);

  const onSubmit = (values: any) => {
    console.log("Adding node", values);
    create({
      variables: {
        input: {
          left: props.source.id,
          right: props.target.id,
          kind: values.relation,
        },
      },
    }).then((data) => {
      let entity = data.data?.createEntityRelation;
      if (entity) {
        props.addRelation(entity);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        New Relation
        <EntityRelationSearchField name="relation" graph={props.graph} />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
};

export const DetailEntityCard = ({ entity }: { entity: string }) => {
  const { data } = useGetEntityQuery({ variables: { id: entity } });

  if (!data) {
    return null;
  }

  return (
    <Card>
      <div className="p-4">
        {data.entity.subjectedTo.map((spec) => (
          <div className="flex flex-row justify-between">
            <div>{spec.id}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default asDetailQueryRoute(
  useGetEntityGraphQuery,
  ({ data, refetch }) => {
    return (
      <PageLayout
        title="Knowledge Graph"
        pageActions={<div className="flex flex-row gap-2"></div>}
      >
        <KnowledgeGraph graph={data.entityGraph} />
      </PageLayout>
    );
  },
);
