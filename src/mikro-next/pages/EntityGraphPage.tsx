import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { GraphQLSearchField } from "@/components/fields/GraphQLListSearchField";
import { PageLayout } from "@/components/layout/PageLayout";
import { Form } from "@/components/ui/form";
import cytoscape from "cytoscape";
import cola from "cytoscape-cola";
import { useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useForm } from "react-hook-form";
import {
  GetEntityGraphQuery,
  useGetEntityGraphLazyQuery,
  useGetEntityGraphQuery,
  useGetEntityLazyQuery,
  useSearchOntologiesLazyQuery,
} from "../api/graphql";
import { EntityCard } from "../components/entity/EntityCard";

import { MikroEntity } from "@/linkers";
import cise from "cytoscape-cise";
import dagre from "cytoscape-dagre";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

cytoscape.use(cola);
cytoscape.use(cise);
cytoscape.use(dagre);

export const graphToElements: (graph: GetEntityGraphQuery) => any = (graph) => {
  return {
    nodes: graph.entityGraph.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
        subtitle: node.subtitle,
        color: node.color,
      },
    })),
    edges: graph.entityGraph.edges.map((edge) => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
      },
    })),
  };
};

const nodeStyle = {
  shape: "round-rectangle",
  width: "80px",
  height: "20px",
  label: "data(label)",

  backgroundColor: "data(color)",
  "text-valign": "center",
  color: "#94A3B8",
  "border-color": "#94A3B8",
  "border-width": 0.5,
  "font-size": "6px",
  "font-family":
    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
};

export default asDetailQueryRoute(
  useGetEntityGraphQuery,
  ({ data, refetch }) => {
    const cy = useRef<cytoscape.Core | null>(null); // Reference to the Cytoscape instance

    const [selectedNode, setSelectedNode] = useState<any>(null); // State to manage selected node for popup
    const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 }); // State to manage popup position

    const [queryMore, setQueryMore] = useGetEntityGraphLazyQuery();

    const navigate = useNavigate();

    const handleNodeClick = (event) => {
      if (event.target == cy.current) {
        setSelectedNode(null);
        return;
      }

      const node = event.target;
      const position = node.renderedPosition();

      if (!position) {
        return;
      }

      setSelectedNode(node.data());
      setAnchorPosition({ x: position.x, y: position.y });
    };

    useEffect(() => {
      if (data) {
        let elements = graphToElements(data);
        cy.current?.elements().remove();
        cy.current?.add(elements);
      }
    }, [data]);

    const [loading, setLoading] = useState(false);

    const handleMoreNodeClick = (id) => {
      if (!id) {
        return;
      }

      setLoading(true);
      queryMore({
        variables: {
          id: id,
        },
      })
        .then((data) => {
          if (data.data?.entityGraph) {
            let elements = graphToElements(data.data);

            let cleanedElements = elements.nodes.filter(
              (node) =>
                !cy.current?.nodes().some((n) => n.data("id") === node.data.id),
            );

            let cleanedEdges = elements.edges.filter(
              (edge) =>
                !cy.current?.edges().some((e) => e.data("id") === edge.data.id),
            );

            elements = {
              nodes: cleanedElements,
              edges: cleanedEdges,
            };

            cy.current?.add(elements);
            setLoading(false);
          }
        })
        .catch((e) => {
          setLoading(false);
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
        <div className="w-full h-full relative">
          <CytoscapeComponent
            layout={{
              name: "cise",
              clusters: (node) => {
                return node.data("subtitle");
              },
            }}
            style={{ width: "100%", height: "100%" }}
            stylesheet={[
              {
                selector: "node",
                style: nodeStyle,
              },
              {
                selector: "edge",
                style: {
                  shape: "round-rectangle",
                  width: 2,
                  "target-arrow-shape": "triangle", // Set the shape of the target arrow
                  label: "data(label)", // Show label on edges
                  "font-size": "10px",
                  "curve-style": "bezier", // Make sure the edges are curved if they overlap
                  "text-rotation": "autorotate",
                  color: "#94A3B8",
                  "text-margin-y": -10,

                  "font-family":
                    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                },
              },
            ]} // Apply the styles
            cy={(thecy) => {
              thecy.on("tap", handleNodeClick);
              cy.current = thecy;
            }}
          />
          {selectedNode && (
            <Card
              className="p-2"
              style={{
                position: "absolute",
                zIndex: 1000,
                left: anchorPosition.x,
                top: anchorPosition.y,
                transform: "translate(-50%, -100%)",
              }}
              onClick={handleClosePopover}
            >
              <EntityCard id={selectedNode.id} />
              <div className="flex flex-row justify-between gap-2">
                <Button
                  onClick={() => handleMoreNodeClick(selectedNode.id)}
                  className="flex-1"
                >
                  Expand
                </Button>

                <Button
                  onClick={() => {
                    navigate(MikroEntity.linkBuilder(selectedNode.id));
                  }}
                  className="flex-1"
                >
                  View
                </Button>
              </div>
            </Card>
          )}
          {loading && (
            <>
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 flex justify-center items-center">
                <div className="p-4 rounded">Loading...</div>
              </div>
            </>
          )}
        </div>
      </PageLayout>
    );
  },
);
