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
  useGetEntityQuery,
  useSearchOntologiesLazyQuery,
} from "../api/graphql";

import { SearchField, SearchFunction } from "@/components/fields/SearchField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MikroEntity } from "@/linkers";
import cise from "cytoscape-cise";
import dagre from "cytoscape-dagre";
import { useNavigate, useParams } from "react-router-dom";

cytoscape.use(cola);
cytoscape.use(cise);
cytoscape.use(dagre);

export const graphToElements: (
  graph: GetEntityGraphQuery,
  root: string,
) => any = (graph, root) => {
  return {
    nodes: graph.entityGraph.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.metrics.find((m) => m.key == "Label")?.value || node.label,
        subtitle: node.name,
        color: node.linkedExpression.color,
        metrics: node.metrics,
      },
    })),
    edges: graph.entityGraph.edges.map((edge) => ({
      data: {
        id: edge.id,
        source: edge.leftId,
        target: edge.rightId,
        label: edge.label,
        metrics: edge.metrics,
      },
    })),
  };
};

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


export const DetailEntityCard = ({ entity }: {entity: string}) => {

  const {data } = useGetEntityQuery({variables: {id: entity}});


  if (!data) {
    return null;
  }

  return (
    <Card>
      <div className="p-4">
        {data.entity.specimens.map((spec) => (
          <div className="flex flex-row justify-between">
            <div>{spec.id}</div>
          </div>
        ))}
      </div>
    </Card>
  );

}




export default asDetailQueryRoute(
  useGetEntityGraphQuery,
  ({ data, refetch }) => {
    const cy = useRef<cytoscape.Core | null>(null); // Reference to the Cytoscape instance

    const [selectedNode, setSelectedNode] = useState<any>(null); // State to manage selected node for popup
    const [selectedEdge, setSelectedEdge] = useState<any>(null); // State to manage selected edge for popup
    const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 }); // State to manage popup position
    const [edgeAnchorPosition, setEdgeAnchorPosition] = useState({
      x: 0,
      y: 0,
    }); // State to manage popup position

    const [queryMore, setQueryMore] = useGetEntityGraphLazyQuery();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleTap = (event) => {
      if (event.target == cy.current) {
        setSelectedNode(null);
        setSelectedEdge(null);
        return;
      }

      const target = event.target;

      console.log("Tapped", target);

      if (target.isNode()) {
        console.log("Not a node");
        const position = target.renderedPosition();

        if (!position) {
          return;
        }

        setSelectedNode(target.data());
        setAnchorPosition({ x: position.x, y: position.y });
      }

      if (target.isEdge()) {
        const position = target.renderedMidpoint();

        if (!position) {
          return;
        }

        setSelectedEdge(target.data());
        setEdgeAnchorPosition({ x: position.x, y: position.y });
      }
    };

    useEffect(() => {
      if (data) {
        let elements = graphToElements(data, id);
        setGraphElements(elements);
      }
    }, [data]);

    const setGraphElements = (elements: any) => {
      cy.current?.elements().remove();
      cy.current?.add(elements);
      cy.current
        ?.layout({
          name: "cise",
          clusters: (node) => {
            return node.data("label");
          },
        })
        .run();
    };

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
            let elements = graphToElements(data.data, id);

            for (let node of elements.nodes) {
              console.log("Adding node", node);
              cy.current?.nodes().add(node);
            }

            for (let edge of elements.edges) {
              console.log("Adding edge", edge);
              cy.current?.edges().add(edge);
            }

            cy.current
              ?.layout({
                name: "cise",
                clusters: (node) => {
                  return node.data("label");
                },
              })
              .run();
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
        layout: "dagre",
      },
    });

    const layout = form.watch("layout");

    useEffect(() => {
      if (layout) {
        cy.current
          ?.layout({
            name: layout,
            clusters: (node) => {
              return node.data("label");
            },
          })
          .run();
      }
    }, [layout]);

    const searchLayouts: SearchFunction = async ({ search, values }) => {
      if (values) {
        return layoutOptions.filter((option) => {
          return values.includes(option.value);
        });
      }
      return layoutOptions.filter((option) => {
        return option.label.toLowerCase().includes(search || "".toLowerCase());
      });
    };

    const [searchOntology] = useSearchOntologiesLazyQuery();

    return (
      <PageLayout
        title="Knowledge Graph"
        pageActions={
          <>
            <Form {...form}>
              <form className="flex flex-row gap-2">
                <GraphQLSearchField
                  {...form}
                  name="ontologies"
                  searchQuery={searchOntology}
                />
                <SearchField {...form} name="layout" search={searchLayouts} />
              </form>
            </Form>
          </>
        }
      >
        <div className="w-full h-full relative">
          <CytoscapeComponent
            style={{ width: "100%", height: "100%" }}
            stylesheet={[
              {
                selector: "node",
                style: nodeStyle,
              },
              {
                selector: "edge",
                style: edgeStyle,
              },
            ]} // Apply the styles
            cy={(thecy) => {
              console.log("cy", thecy);
              thecy.on("tap", handleTap);

              cy.current = thecy;
            }}
          />
          {selectedNode && (
            <Card
              className="p-4 "
              style={{
                position: "absolute",
                zIndex: 1000,
                left: anchorPosition.x,
                top: anchorPosition.y,
                transform: "translate(-50%, -50%)",
              }}
              onClick={handleClosePopover}
            >
              <DetailEntityCard entity={selectedNode.id} />
              ddd
            <div className="p-4">
              {selectedNode.metrics.map((metric) => (
                <div className="flex flex-row justify-between">
                  <div>{metric.key}</div>
                  <div>{metric.value}</div>
                </div>
              ))}
              </div>

              <div className="flex flex-row justify-between rounded rounded-md">
                <Button
                  onClick={() => handleMoreNodeClick(selectedNode.id)}
                  className="flex-1 rounded-l-full"
                  disabled={true}
                >
                  Expand
                </Button>

                <Button
                  onClick={() => {
                    navigate(MikroEntity.linkBuilder(selectedNode.id));
                  }}
                  className="flex-1 rounded-r-full"
                >
                  View
                </Button>
              </div>
            </Card>
          )}
          {selectedEdge && (
            <Card
              className="p-2 "
              style={{
                position: "absolute",
                zIndex: 1000,
                left: edgeAnchorPosition.x,
                top: edgeAnchorPosition.y,
                transform: "translate(-50%, -50%)",
              }}
              onClick={handleClosePopover}
            >
              {selectedEdge.metrics.length == 0 && (
                <div>No metrics available</div>
              )}
              {selectedEdge.metrics.map((metric) => (
                <div className="flex flex-row justify-between">
                  <p className={"text-muted mr-2"}>{metric.key}</p>
                  <div>{metric.value}</div>
                </div>
              ))}
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
