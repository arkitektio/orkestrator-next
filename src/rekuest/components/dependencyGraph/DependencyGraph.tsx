import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RekuestNode, RekuestReservation, RekuestTemplate } from "@/linkers";
import { useAppQuery } from "@/lok-next/api/graphql";
import {
  DependencyEdgeFragment,
  DependencyGraphFragment,
  ImplementationEdgeFragment,
  InvalidNodeFragment,
  NodeNodeFragment,
  ReservationStatus,
  TemplateNodeFragment,
  useDetailProvisionQuery,
  useDetailReservationQuery,
  useLinkMutation,
  useProvideMutation,
  useUnlinkMutation,
  useUnprovideMutation,
} from "@/rekuest/api/graphql";
import { LokNextGuard, withLokNext } from "@jhnnsrs/lok-next";
import { withRekuest } from "@jhnnsrs/rekuest-next";
import { Avatar } from "@radix-ui/react-avatar";
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

const nodeWidth = 400;
const nodeHeight = 150;

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

export const ReservationStatusWidget = (props: { id: string }) => {
  const { data } = withRekuest(useDetailReservationQuery)({
    variables: {
      id: props.id,
    },
  });

  return (
    <>
      {data?.reservation.viable ? "Viable" : "Not viable"}
      {data?.reservation.viable ? "Viable" : "Not viable"}
    </>
  );
};

export const ReservationNodeWidget = (
  props: NodeProps<NodeNodeFragment & { reservationId: string }>,
) => {
  const { data } = withRekuest(useDetailReservationQuery)({
    variables: {
      id: props.data.reservationId,
    },
  });

  return (
    <div
      style={{ width: nodeWidth, height: nodeHeight }}
      className={cn(
        "h-full w-full flex justify-center items-center border border-gray-300 rounded-md relative group",
        data?.reservation.viable ? "border-green-100 " : "border-red-600",
      )}
    >
      <CardHeader className="inset-0 flex flex-col justify-between text-center ">
        <RekuestReservation.DetailLink object={props.data.reservationId}>
          <div className="text-3xl">{data?.reservation.title}</div>
        </RekuestReservation.DetailLink>
      </CardHeader>

      {(!data?.reservation.viable || !data.reservation.happy) && (
        <div className="absolute flex flex-row top-0 left-[50%] translate-x-[-50%] translate-y-[-50%]  bg-black z-10 px-3 py-1 rounded rounded-md border-red-600 border text-xs max-w-[90%]">
          {!data?.reservation.happy &&
            "Reservation is not happy and could use more links"}
          {!data?.reservation.viable && "Reservation is not viable"}
        </div>
      )}
    </div>
  );
};

export const NodeNodeWidget = (props: NodeProps<NodeNodeFragment>) => {
  const direction = useOrientation();
  return (
    <>
      <Handle
        type="target"
        position={direction === "LR" ? Position.Left : Position.Top}
        style={{ opacity: 0 }}
      />
      {props.data.reservationId ? (
        <ReservationNodeWidget {...props} />
      ) : (
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
      )}
      <Handle
        type="source"
        position={direction === "LR" ? Position.Right : Position.Bottom}
        style={{ opacity: 0 }}
      />
    </>
  );
};

export const InvalidNodeWidget = (props: NodeProps<InvalidNodeFragment>) => {
  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Card
        style={{ width: nodeWidth, height: nodeHeight }}
        className="h-full w-full flex justify-center items-center"
      >
        <CardHeader>{props.data.initialHash}</CardHeader>
      </Card>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
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
  active: boolean | undefined;
  provisionId: string;
}) => {
  const { data } = withRekuest(useDetailProvisionQuery)({
    variables: {
      id: props.provisionId,
    },
  });

  const refetch = useActiveReservation();

  const [provide, _] = withRekuest(useProvideMutation)({
    variables: {
      provision: props.provisionId,
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
      {!props.active ? (
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

export const NonProvisionedNodeWidget = (
  props: NodeProps<TemplateNodeFragment & { provisionId: undefined }>,
) => {
  return (
    <div
      style={{ width: nodeWidth, height: nodeHeight }}
      className={cn(
        "h-full w-full flex justify-center items-center border border-gray-300 rounded-md relative group",
        !props.data.linked && "opacity-50",
        props.data.active && "border-green-100 bg-green-200",
      )}
    >
      <CardHeader className="h-full flex flex-col justify-between text-center ">
        <RekuestTemplate.DetailLink object={props.data.templateId}>
          <div className="text-xl">{props.data.interface}</div>
        </RekuestTemplate.DetailLink>
        <LokNextGuard>
          <AppInformation clientId={props.data.clientId} />
        </LokNextGuard>
      </CardHeader>

      <div className="flex flex-row gap-2 absolute w-full h-full bg-black bg-opacity-80  justify-center items-center">
        {props.data.provisionId && (
          <ProvideButtons
            provisionId={props.data.provisionId}
            active={props.data.active}
          />
        )}

        {props.data.provisionId && props.data.reservationId && (
          <LinkButtons
            provisionId={props.data.provisionId}
            reservationId={props.data.reservationId}
            linked={props.data.linked}
          />
        )}
      </div>
    </div>
  );
};

export const ProvisionedNodeWidget = (
  props: NodeProps<TemplateNodeFragment & { provisionId: string }>,
) => {
  const { data } = withRekuest(useDetailProvisionQuery)({
    variables: {
      id: props.data.provisionId,
    },
  });

  return (
    <div
      style={{ width: nodeWidth, height: nodeHeight }}
      className={cn(
        "h-full w-full flex justify-center items-center border border-gray-300 rounded-md relative group",
        !props.data.linked && "opacity-50",
        data?.provision.provided ? "border-green-100 " : "border-red-600",
      )}
    >
      <CardHeader className="inset-0 flex flex-col justify-between text-center ">
        <RekuestTemplate.DetailLink object={props.data.templateId}>
          <div className="text-3xl">{props.data.interface}</div>
        </RekuestTemplate.DetailLink>
        <LokNextGuard>
          <AppInformation clientId={props.data.clientId} />
        </LokNextGuard>
      </CardHeader>

      {!data?.provision.dependenciesMet && (
        <div className="absolute top-0 left-[50%] translate-x-[-50%] translate-y[-50%]">
          Dependencies not met
        </div>
      )}

      {!data?.provision.provided && (
        <div className="absolute flex flex-row top-0 left-[50%] translate-x-[-50%] translate-y-[-50%]  bg-black z-10 px-3 py-1 rounded rounded-md border-red-600 border text-xs max-w-[90%]">
          App is not providing. Please Start
        </div>
      )}

      {!data?.provision.active && (
        <div className="absolute flex flex-row top-0 left-[50%] translate-x-[-50%] translate-y-[-50%]  bg-black z-10 px-3 py-1 rounded rounded-md border-red-600 border text-xs max-w-[90%]">
          You need to active the provision
        </div>
      )}

      <div className="flex flex-row gap-2 absolute w-full h-full group-hover:flex hidden  bg-black bg-opacity-80  justify-center items-center">
        {props.data.provisionId && (
          <ProvideButtons
            provisionId={props.data.provisionId}
            active={props.data.active}
          />
        )}

        {props.data.provisionId && props.data.reservationId && (
          <LinkButtons
            provisionId={props.data.provisionId}
            reservationId={props.data.reservationId}
            linked={props.data.linked}
          />
        )}
      </div>
    </div>
  );
};

export const TemplateNodeWidget = (props: NodeProps<TemplateNodeFragment>) => {
  const direction = useOrientation();

  return (
    <>
      <Handle
        type="target"
        position={direction === "LR" ? Position.Left : Position.Top}
        style={{ opacity: 0 }}
      />
      {props.data.provisionId ? (
        <ProvisionedNodeWidget {...props} />
      ) : (
        <NonProvisionedNodeWidget {...props} />
      )}
      <Handle
        type="source"
        position={direction === "LR" ? Position.Right : Position.Bottom}
        style={{ opacity: 0 }}
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
