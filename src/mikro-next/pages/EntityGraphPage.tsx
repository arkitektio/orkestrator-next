import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { PageLayout } from "@/components/layout/PageLayout";
import { Form } from "@/components/ui/form";
import cytoscape, { ElementDefinition, InputEventObject } from "cytoscape";
import cola from "cytoscape-cola";
import { useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useForm } from "react-hook-form";
import {
  EntityGraphEdgeFragment,
  EntityGraphNodeFragment,
  GetEntityGraphQuery,
  useCreateEntityGraphRelationMutation,
  useCreateEntityRelationMutation,
  useGetEntityGraphLazyQuery,
  useGetEntityGraphNodeLazyQuery,
  useGetEntityGraphQuery,
  useGetEntityQuery,
} from "../api/graphql";

import { SearchField, SearchFunction } from "@/components/fields/SearchField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MikroEntity } from "@/linkers";
import cise from "cytoscape-cise";
import dagre from "cytoscape-dagre";
import { useNavigate, useParams } from "react-router-dom";
import { EntityRelationSearchField } from "../components/fields/EntityRelationSearchField";
import { EntitySearchField } from "../components/fields/EntitySearchField";
import { EntityOverlay } from "../overlays/EntityOverlay";

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

export const graphToElements: (
  graph: GetEntityGraphQuery,
  root: string,
) => any = (graph, root) => {
  return {
    nodes: graph.entityGraph.nodes.map(nodeToElement),
    edges: graph.entityGraph.edges.map(relationToEdge),
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
    const cy = useRef<cytoscape.Core | null>(null); // Reference to the Cytoscape instance

    const [shiftedNode, setShiftedNode] =
      useState<EntityGraphNodeFragment | null>(null); // State to manage selected node for popup

    const [stagingRelation, setStagingRelation] = useState<{
      source: EntityGraphNodeFragment;
      target: EntityGraphNodeFragment;
    } | null>(null); // State to manage selected node

    const [selectedNode, setSelectedNode] = useState<any>(null); // State to manage selected node for popup
    const [selectedEdge, setSelectedEdge] = useState<any>(null); // State to manage selected edge for popup
    const [selectedNaked, setSelectedNaked] = useState<any>(null); // State to manage selected edge for popup
    const [anchorPosition, setAnchorPosition] = useState({
      x: 0,
      y: 0,
      internalX: 0,
      internalY: 0,
    }); // State to manage popup position
    const [edgeAnchorPosition, setEdgeAnchorPosition] = useState({
      x: 0,
      y: 0,
    }); // State to manage popup position

    const [queryMore, setQueryMore] = useGetEntityGraphLazyQuery();

    const [createRelation] = useCreateEntityRelationMutation();

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleTap = (event: InputEventObject) => {
      if (event.originalEvent.shiftKey) {
        setSelectedNode(null);
        setSelectedEdge(null);
        setSelectedNaked(null);
        const target = event.target;
        console.log("Shift Tapped", target);
        if (!target) {
          return;
        }

        if (shiftedNode) {
          if (target.isNode()) {
            setStagingRelation({
              source: shiftedNode,
              target: target.data(),
            });
            setShiftedNode(null);
            setAnchorPosition({
              x: event.renderedPosition.x,
              y: event.renderedPosition.y,
              internalX: event.position.x,
              internalY: event.position.y,
            });

            return;
          }
        }

        if (target.isNode()) {
          setShiftedNode(target.data());
          setStagingRelation(null);
          return;
        }
      }

      if (event.target == cy.current) {
        console.log(event.target);
        if (
          selectedNode ||
          selectedEdge ||
          selectedNaked ||
          shiftedNode ||
          stagingRelation
        ) {
          setSelectedNode(null);
          setSelectedEdge(null);
          setSelectedNaked(null);
          setShiftedNode(null);
          setStagingRelation(null);
          return;
        }

        if (event.originalEvent.detail > 1) {
          const { renderedPosition, position } = event;
          setSelectedNaked({ x: "hallo" });
          console.log("Tapped background", event);
          setAnchorPosition({
            x: renderedPosition.x,
            y: renderedPosition.y,
            internalX: position.x,
            internalY: position.y,
          });
          return;
        }
      }

      const target = event.target;

      console.log("Tapped", target);
      if (!target) {
        return;
      }

      if (target.isNode()) {
        console.log("Not a node");
        const { renderedPosition, position } = event;
        if (!position) {
          return;
        }

        if (event.originalEvent.detail > 1) {
          setSelectedNode(target.data());
          setAnchorPosition({
            x: renderedPosition.x,
            y: renderedPosition.y,
            internalX: position.x,
            internalY: position.y,
          });
        }
      }

      if (target.isEdge()) {
        const position = target.renderedMidpoint();

        if (!position) {
          return;
        }

        setSelectedEdge(target.data());
        setEdgeAnchorPosition({ x: position.x, y: position.y });
      }

      if (target.is()) {
        alert("Background tapped");
        setSelectedNode(null);
        setSelectedEdge(null);
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
            let nodes = data?.data?.entityGraph.nodes.map(
              nodeToElement,
            ) as ElementDefinition[];
            let edges = data?.data?.entityGraph.edges.map(
              relationToEdge,
            ) as ElementDefinition[];

            cy.current?.add(nodes.concat(edges));

            cy.current
              ?.layout({
                name: layout,
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
        relation: null,
      },
    });

    const layout = form.watch("layout");
    const relation = form.watch("relation");

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

    const addNode = (node: EntityGraphNodeFragment) => {
      let cyNode = nodeToElement(node);
      cyNode.position = {
        x: anchorPosition.internalX,
        y: anchorPosition.internalY,
      };

      setSelectedNaked(null);

      cy.current?.add(cyNode);
    };

    const addRelation = (edge: EntityGraphEdgeFragment) => {
      let cyEdge = relationToEdge(edge);

      cy.current?.add(cyEdge);
      setStagingRelation(null);
    };

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

    return (
      <PageLayout
        title="Knowledge Graph"
        pageActions={
          <>
            <Form {...form}>
              <form className="flex flex-row gap-2">
                <EntityRelationSearchField
                  {...form}
                  name="relation"
                  graph={data.entityGraph.graph.id}
                />
                <SearchField {...form} name="layout" search={searchLayouts} />
              </form>
            </Form>
          </>
        }
      >
        <div className="w-full h-full relative">
          <CytoscapeComponent
            userPanningEnabled={true}
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
              <EntityOverlay entity={selectedNode.id} />
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
                  disabled={false}
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
          {selectedNaked && (
            <Card
              className="p-2 "
              style={{
                position: "absolute",
                zIndex: 1000,
                left: anchorPosition.x,
                top: anchorPosition.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <NewNodecard
                addNode={addNode}
                graph={data.entityGraph.graph.id}
              />
            </Card>
          )}
          {stagingRelation && (
            <Card
              className="p-2 "
              style={{
                position: "absolute",
                zIndex: 1000,
                left: anchorPosition.x,
                top: anchorPosition.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <NewRelationCard
                target={stagingRelation.target}
                source={stagingRelation.source}
                addRelation={addRelation}
                graph={data.entityGraph.graph.id}
              />
            </Card>
          )}
          {loading && (
            <>
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 flex justify-center items-center">
                <div className="p-4 rounded">Loading...</div>
              </div>
            </>
          )}
          {shiftedNode && (
            <>
              <div className="absolute top-0 left-0 bg-black opacity-50 flex justify-center items-center">
                <div className="p-4 rounded">Left: {shiftedNode.label}</div>
              </div>
            </>
          )}
        </div>
      </PageLayout>
    );
  },
);
