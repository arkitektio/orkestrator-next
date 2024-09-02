import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { GraphQLSearchField } from "@/components/fields/GraphQLListSearchField";
import { PageLayout } from "@/components/layout/PageLayout";
import { Form } from "@/components/ui/form";
import cytoscape from "cytoscape";
import cola from "cytoscape-cola";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  GetKnowledgeGraphQuery,
  useGetGraphQuery,
  useSearchOntologiesLazyQuery,
} from "../api/graphql";

cytoscape.use(cola);

export const graphToElements: (graph: GetKnowledgeGraphQuery) => any = (
  graph,
) => {
  return {
    nodes: graph.knowledgeGraph.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
      },
    })),
    edges: graph.knowledgeGraph.edges.map((edge) => ({
      data: {
        source: edge.source,
        target: edge.target,
        label: edge.label,
      },
    })),
  };
};

const nodeStyle = {
  shape: "round-rectangle",
  width: "100px",
  height: "40px",
  label: "data(label)",
  backgroundColor: "#121E2B",
  "text-valign": "center",
  color: "#94A3B8",
  "border-color": "#94A3B8",
  "border-width": 0.5,
  "font-family":
    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
};

export default asDetailQueryRoute(useGetGraphQuery, ({ data, refetch }) => {
  const cy = useRef<cytoscape.Core | null>(null); // Reference to the Cytoscape instance

  const [selectedNode, setSelectedNode] = useState<any>(null); // State to manage selected node for popup
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 }); // State to manage popup position

  const handleNodeClick = (event) => {
    const node = event.target;
    const position = node.renderedPosition();

    setSelectedNode(node.data());
    setAnchorPosition({
      x: position.x,
      y: position.y,
    });
  };

  const handlePaneClick = (event) => {
    // Ensure the click is on the background
    if (event.target !== cy.current) {
      return;
    }
    const pos = event.position; // Get the position where the user clicked
    const newNodeId = "dd";
    // Add the new node to the graph
    cy.current?.add({
      group: "nodes",
      data: { id: newNodeId, label: newNodeId },
      position: { x: pos.x, y: pos.y },
      style: nodeStyle,
    });
  };

  const handleClosePopover = (e) => {
    setSelectedNode(null);
  };

  const form = useForm({
    defaultValues: {
      ontologies: null,
    },
  });

  const ontologies = form.watch("ontologies");

  useEffect(() => {
    if (ontologies) {
      refetch({
        ontologies: ontologies,
      }).then((data) => {
        if (cy.current) {
          cy.current
            .layout({
              name: "cola",
            })
            .run();
        }
      });
    }
  }, [ontologies]);

  const [searchOntology] = useSearchOntologiesLazyQuery();

  return (
    <PageLayout
      title="Knowledge Graph"
      pageActions={
        <>
          <Form {...form}>
            <form>
              <GraphQLSearchField
                {...form}
                name="ontologies"
                searchQuery={searchOntology}
              />
            </form>
          </Form>
        </>
      }
    >
      <div className="w-full h-full">{data.graph.name}</div>
    </PageLayout>
  );
});
