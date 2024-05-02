import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestNode, RekuestTemplate } from "@/linkers";
import { useAppQuery } from "@/lok-next/api/graphql";
import {
  DependencyEdge,
  DependencyEdgeFragment,
  DependencyGraphFragment,
  ImplementationEdgeFragment,
  InvalidNodeFragment,
  NodeNodeFragment,
  ProvisionStatus,
  ReservationStatus,
  TemplateNodeFragment,
  useLinkMutation,
  useProvideMutation,
  useUnlinkMutation,
  useUnprovideMutation,
} from "@/rekuest/api/graphql";
import { LokNextGuard, withLokNext } from "@jhnnsrs/lok-next";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { Avatar } from "@radix-ui/react-avatar";
import { dir } from "console";
import dagre from "dagre";
import React, { useMemo } from "react";
import ReactFlow, {
  BaseEdge,
  ConnectionLineType,
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  Handle,
  Node,
  NodeProps,
  Position,
  getSmoothStepPath,
  useStore,
} from "reactflow";

const connectionNodeIdSelector = (state: any) => state.connectionNodeId;

export const DependencyEdgeWidget: React.FC<
  EdgeProps<DependencyEdgeFragment>
> = (props) => {
  const color = "rgb(30 58 138)";

  const {
    id,
    sourcePosition,
    targetPosition,
    targetHandleId,
    sourceX,
    sourceY,
    targetX,
    targetY,
    target,
    source,
    style,
    markerStart,
    markerEnd,
    data,
  } = props;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const connectionNodeId = useStore(connectionNodeIdSelector);

  const isConnecting = !!connectionNodeId;

  return (
    <>
      <BaseEdge
        id={id}
        style={{
          ...style,
          strokeWidth: 1,
        }}
        path={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        {(isConnecting || true) && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            data-edgeid={id}
          ></div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export const ImplementationEdgeWidget: React.FC<
  EdgeProps<ImplementationEdgeFragment>
> = (props) => {
  const color = "rgb(30 58 138)";

  const {
    id,
    sourcePosition,
    targetPosition,
    targetHandleId,
    sourceX,
    sourceY,
    targetX,
    targetY,
    target,
    source,
    style,
    markerStart,
    markerEnd,
    data,
  } = props;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const connectionNodeId = useStore(connectionNodeIdSelector);

  const isConnecting = !!connectionNodeId;

  return (
    <>
      <BaseEdge
        id={id}
        style={{
          ...style,
          strokeWidth: 1,
          opacity: props.data?.linked ? 1 : 0.2,
        }}
        path={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        {(isConnecting || true) && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            data-edgeid={id}
          ></div>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

const nodeWidth = 200;
const nodeHeight = 100;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "LR",
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const buildDagraph = (graph: DependencyGraphFragment, direction = "LR") => {
  const nodes = graph.nodes.map((node) => ({
    id: node.id,
    type: node.__typename,
    data: node,
    position: { x: 0, y: 0 },
  }));

  const edges = graph.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.__typename,
    data: edge,
    animated: edge.__typename == "ImplementationEdge" && edge.linked,
  }));

  return getLayoutedElements(nodes, edges, direction);
};

export const NodeNodeWidget = (props: NodeProps<NodeNodeFragment>) => {
  const direction = useOrientation();
  return (
    <>
      <Handle
        type="target"
        position={direction === "LR" ? Position.Left : Position.Top}
        style={{ background: "#555" }}
      />
      <div
        style={{ width: nodeWidth, height: nodeHeight }}
        className={cn(
          "h-full w-full flex justify-center items-center border border-gray-300 rounded-md relative",
          props.data.status == ReservationStatus.Inactive &&
            "border-red-600 bg-red-600",
          props.data.status == ReservationStatus.Happy &&
            "border-greeb-600 bg-green-600",
        )}
      >
        <RekuestNode.DetailLink object={props.data.nodeId}>
          <CardHeader className="h-full flex flex-col justify-between my-auto mx-auto text-center">
            <div className="text-xs">{props.data.name}</div>

            {props.data.status}
          </CardHeader>
        </RekuestNode.DetailLink>
      </div>
      <Handle
        type="source"
        position={direction === "LR" ? Position.Right : Position.Bottom}
        style={{ background: "#555" }}
      />
    </>
  );
};

export const InvalidNodeWidget = (props: NodeProps<InvalidNodeFragment>) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
      />
      <Card
        style={{ width: nodeWidth, height: nodeHeight }}
        className="h-full w-full flex justify-center items-center"
      >
        <CardHeader>{props.data.initialHash}</CardHeader>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
      />
    </>
  );
};

export const AppInformation = (props: { clientId: string }) => {
  const { data } = withLokNext(useAppQuery)({
    variables: {
      clientId: props.clientId,
    },
  });

  return (
    <>
      <Avatar>
        {data?.app.logo && <AvatarImage src={data?.app.logo} />}
        <AvatarFallback className="px-3 py-1 truncate">
          {" "}
          {data?.app.identifier}
        </AvatarFallback>
      </Avatar>
    </>
  );
};

export const LinkButtons = (props: {
  provisionId: string;
  reservationId: string;
  linked: boolean;
}) => {
  const refetch = useActiveReservation();

  const [link, _] = withRekuest(useLinkMutation)({
    variables: {
      reservation: props.reservationId,
      provision: props.provisionId,
    },
    onCompleted: () => {
      refetch();
    },
  });

  const [unlink, __] = withRekuest(useUnlinkMutation)({
    variables: {
      reservation: props.reservationId,
      provision: props.provisionId,
    },
    onCompleted: () => {
      refetch();
    },
  });

  return (
    <>
      {!props.linked ? (
        <Button size={"sm"} variant={"outline"} onClick={() => link()}>
          Link
        </Button>
      ) : (
        <Button size={"sm"} variant={"outline"} onClick={() => unlink()}>
          Unlink
        </Button>
      )}
    </>
  );
};

export const ProvideButtons = (props: {
  templateId: string;
  provisionId?: string | undefined | null;
}) => {
  const refetch = useActiveReservation();

  const [provide, _] = withRekuest(useProvideMutation)({
    variables: {
      template: props.templateId,
    },
    onCompleted: () => {
      refetch();
    },
  });

  const [unprovide, __] = withRekuest(useUnprovideMutation)({
    onCompleted: () => {
      refetch();
    },
  });

  return (
    <>
      {!props.provisionId ? (
        <Button variant={"outline"} size={"sm"} onClick={() => provide()}>
          Provide
        </Button>
      ) : (
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() =>
            props.provisionId &&
            unprovide({ variables: { provision: props.provisionId } })
          }
        >
          Unprovide
        </Button>
      )}
    </>
  );
};

export const TemplateNodeWidget = (props: NodeProps<TemplateNodeFragment>) => {
  const direction = useOrientation();
  return (
    <>
      <Handle
        type="target"
        position={direction === "LR" ? Position.Left : Position.Top}
        style={{ background: "#555" }}
      />
      <div
        style={{ width: nodeWidth, height: nodeHeight }}
        className={cn(
          "h-full w-full flex justify-center items-center border border-gray-300 rounded-md relative group",
          !props.data.linked && "opacity-50",
          props.data.status == ProvisionStatus.Active && "border-green-100",
        )}
      >
        <CardHeader className="h-full flex flex-col justify-between text-center ">
          <RekuestTemplate.DetailLink object={props.data.templateId}>
            <div className="text-xs">{props.data.interface}</div>
            {props.data.status}
          </RekuestTemplate.DetailLink>
          <LokNextGuard>
            <AppInformation clientId={props.data.clientId} />
          </LokNextGuard>
        </CardHeader>
        <div className="flex flex-row gap-2 absolute w-full h-full bg-black bg-opacity-80 group-hover:flex hidden justify-center items-center">
          <ProvideButtons
            provisionId={props.data.provisionId}
            templateId={props.data.templateId}
          />

          {props.data.provisionId && props.data.reservationId && (
            <LinkButtons
              provisionId={props.data.provisionId}
              reservationId={props.data.reservationId}
              linked={props.data.linked}
            />
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={direction === "LR" ? Position.Right : Position.Bottom}
        style={{ background: "#555" }}
      />
    </>
  );
};

const nodeTypes = {
  NodeNode: NodeNodeWidget,
  InvalidNode: InvalidNodeWidget,
  TemplateNode: TemplateNodeWidget,
};

const edgeTypes = {
  DependencyEdge: DependencyEdgeWidget,
  ImplementationEdge: ImplementationEdgeWidget,
};

export const ActiveReservationContext = React.createContext<() => void>(
  () => {},
);
export const OrientationContext = React.createContext<"LR" | "TB">("LR");
export const useOrientation = () => React.useContext(OrientationContext);

export const useActiveReservation = () =>
  React.useContext(ActiveReservationContext);

export const DependencyGraphFlow = (props: {
  graph: DependencyGraphFragment;
  refetch: () => void;
}) => {
  const direction = "TB";

  const { nodes, edges } = useMemo(
    () => buildDagraph(props.graph, direction),
    [JSON.stringify(props.graph), direction],
  );

  return (
    <div className="w-full h-[500px]">
      <ActiveReservationContext.Provider value={props.refetch}>
        <OrientationContext.Provider value={direction}>
          <ReactFlow
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodes={nodes}
            edges={edges}
            elementsSelectable={false}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
          ></ReactFlow>
        </OrientationContext.Provider>
      </ActiveReservationContext.Provider>
    </div>
  );
};
