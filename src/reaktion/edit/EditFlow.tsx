import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SMART_MODEL_DROP_TYPE } from "@/constants";
import {
  ConstantNodeDocument,
  ConstantNodeQuery,
  FlowFragment,
  GlobalArg,
  GraphEdgeKind,
  GraphInput,
  GraphNodeFragment,
  GraphNodeKind,
  PortFragment,
  ReactiveImplementation,
  ReactiveTemplateDocument,
  ReactiveTemplateQuery,
} from "@/rekuest/api/graphql";
import { useRekuest } from "@jhnnsrs/rekuest-next";
import React, { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import {
  Connection,
  ReactFlowInstance,
  XYPosition,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { Graph } from "../base/Graph";
import {
  ArkitektNodeData,
  EdgeTypes,
  FlowEdge,
  FlowNode,
  FlowNodeData,
  NodeData,
  NodeTypes,
} from "../types";
import {
  arkitektNodeToFlowNode,
  edges_to_flowedges,
  flowEdgeToInput,
  flowNodeToInput,
  listPortToSingle,
  nodeIdBuilder,
  nodes_to_flownodes,
  reactiveTemplateToFlowNode,
} from "../utils";
import { EditRiverContext } from "./context";
import { LabeledShowEdge } from "./edges/LabeledShowEdge";
import { ArkitektTrackNodeWidget } from "./nodes/ArkitektWidget";
import { ReactiveTrackNodeWidget } from "./nodes/ReactiveWidget";
import { ArgTrackNodeWidget } from "./nodes/generic/ArgShowNodeWidget";
import { ReturnTrackNodeWidget } from "./nodes/generic/ReturnShowNodeWidget";
import { FlowState, SolvedError, ValidationError } from "../validation/types";
import { validateState } from "../validation/validate";
import { integrate } from "../validation/integrate";

const nodeTypes: NodeTypes = {
  ArkitektGraphNode: ArkitektTrackNodeWidget,
  ReactiveNode: ReactiveTrackNodeWidget,
  ArgNode: ArgTrackNodeWidget,
  ReturnNode: ReturnTrackNodeWidget,
};

const edgeTypes: EdgeTypes = {
  VanillaEdge: LabeledShowEdge,
  LoggingEdge: LabeledShowEdge,
};

export type Props = {
  flow: FlowFragment;
  onSave?: (graph: GraphInput) => void;
};

export const EditFlow: React.FC<Props> = ({ flow, onSave }) => {
  const { client: arkitektapi } = useRekuest();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    nodes_to_flownodes(flow.graph?.nodes),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    edges_to_flowedges(flow.graph?.edges),
  );

  const [globals, setGlobals] = useState<GlobalArg[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([
    { type: "node", id: "1", message: "hallo", level: "critical" },
  ]);
  const [solvedError, setSolvedErrors] = useState<SolvedError[]>([]);

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const updateNodeData = (data: Partial<ArkitektNodeData>, id: string) => {
    console.log("updateNodeData", data, id);
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          n.data = { ...n.data, ...data };
          console.log("found node", n);
          return n;
        }
        return n;
      }),
    );
  };

  const save = () => {
    const nodes = (reactFlowInstance?.getNodes() as FlowNode[]) || [];
    const edges = (reactFlowInstance?.getEdges() as FlowEdge[]) || [];

    const validated = validateState({
      nodes: nodes,
      edges: edges,
      globals: [],
    });

    if (validated.valid) {
      const graph: GraphInput = {
        nodes: validated.state.nodes.map((n) => flowNodeToInput(n)),
        edges: validated.state.edges.map((e) => flowEdgeToInput(e)),
        globals: [],
      };
      console.log("Saving", graph)
      onSave && onSave(graph);
    } else {
      console.log("not valid");
    }
  };

  const addNode = (node: FlowNode) => {
    setNodes((nds) => [...nds, node]);
  };

  const validate = (newState?: Partial<FlowState> | undefined) => {
    const nodes = (reactFlowInstance?.getNodes() as FlowNode[]) || [];
    const edges = (reactFlowInstance?.getEdges() as FlowEdge[]) || [];

    if (!newState) {
      newState = { nodes: nodes, edges: edges, globals: [] };
    } else {
      newState = {
        nodes: newState.nodes || nodes,
        edges: newState.edges || edges,
        globals: newState.globals || [],
      };
    }

    console.log(newState);
    const validated = validateState(newState as FlowState);

    console.log(validated);

    setNodes(validated.state.nodes);
    setEdges(validated.state.edges);
    setGlobals(validated.state.globals);
    setErrors(validated.remainingErrors);
    setSolvedErrors(validated.solvedErrors);
  };

  const onConnect = (connection: Connection) => {
    console.log("onConnect", connection);

    const nodes = (reactFlowInstance?.getNodes() as FlowNode[]) || [];
    const edges = (reactFlowInstance?.getEdges() as FlowEdge[]) || [];

    const validated = integrate(
      { nodes: nodes, edges: edges, globals: [] },
      connection,
    );
    setNodes(validated.state.nodes);
    setEdges(validated.state.edges);
    setGlobals(validated.state.globals);
    setErrors(validated.remainingErrors);
    setSolvedErrors(validated.solvedErrors);
  };

  const [{ isOver, canDrop, type }, dropref] = useDrop(() => {
    return {
      accept: [SMART_MODEL_DROP_TYPE],

      drop: (items: { id: string; identifier: string }[], monitor) => {
        if (!monitor.didDrop()) {
          console.log("Ommitting Parent Drop");
        }

        console.log("hallo");

        const reactFlowBounds =
          reactFlowWrapper?.current?.getBoundingClientRect();

        let x = monitor && monitor.getClientOffset()?.x;
        let y = monitor && monitor.getClientOffset()?.y;

        const flowInstance = reactFlowInstance;

        items.map((i, index) => {
          const id = i.id;

          const type = i.identifier;

          console.log(id, flowInstance, reactFlowBounds, x, y);

          if (id && reactFlowInstance && reactFlowBounds && x && y && type) {
            const position = reactFlowInstance.project({
              x: x - reactFlowBounds.left,
              y: y - reactFlowBounds.top + index * 100,
            });

            if (type == "@rekuest-next/node") {
              arkitektapi &&
                arkitektapi
                  .query<ConstantNodeQuery>({
                    query: ConstantNodeDocument,
                    variables: { id: id },
                  })
                  .then(async (event) => {
                    console.log(event);
                    if (event.data?.node) {
                      const flowNode = arkitektNodeToFlowNode(
                        event.data?.node,
                        position,
                      );
                      addNode(flowNode);
                    }
                  });
            }

            if (type == "@rekuest-next/reactive-template") {
              arkitektapi &&
                arkitektapi
                  .query<ReactiveTemplateQuery>({
                    query: ReactiveTemplateDocument,
                    variables: { id: id },
                  })
                  .then(async (event) => {
                    console.log(event);
                    if (event.data?.reactiveTemplate) {
                      const flowNode = reactiveTemplateToFlowNode(
                        event.data?.reactiveTemplate,
                        position,
                      );
                      addNode(flowNode);
                    }
                  });
            }
          }
        });

        return {};
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        type: monitor.getItemType(),
        canDrop: !!monitor.canDrop(),
      }),
    };
  }, [reactFlowInstance, reactFlowWrapper]);

  return (
    <EditRiverContext.Provider
      value={{
        flow,
        updateData: updateNodeData,
      }}
    >
      <div
        ref={reactFlowWrapper}
        className="flex flex-grow h-full w-full"
        data-disableselect
      >
        <div ref={dropref} className="flex flex-grow h-full w-full relative">
          <div className="absolute top-0 right-0  mr-3 mt-5 z-50">
            <Card>
              <CardHeader>
                <CardTitle>Errors </CardTitle>
                <CardDescription>
                  We found these errors in your graph{" "}
                </CardDescription>
                <Button onClick={() => validate()}> Validate all </Button>
                <Button onClick={() => save()}> Save </Button>
              </CardHeader>
              <CardContent>
                {errors.map((e) => (
                  <div className="p-1 text-xs">
                    {e.type} {e.message}
                  </div>
                ))}
                {solvedError.length > 0 && (
                  <>
                    <CardDescription> Solved Errors </CardDescription>
                    {solvedError.map((e) => (
                      <div className="p-1 text-xs">
                        {e.type} {e.message} {e.solvedBy}
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          {isOver && (
            <div className="absolute top-[50%] left-[50%]">Drop me {":D"} </div>
          )}
          <Graph
            nodes={nodes as FlowNode[]}
            edges={edges as FlowEdge[]}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            elementsSelectable={true}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={(e) => setReactFlowInstance(e)}
            fitView
            attributionPosition="bottom-right"
          />
        </div>
      </div>
    </EditRiverContext.Provider>
  );
};
