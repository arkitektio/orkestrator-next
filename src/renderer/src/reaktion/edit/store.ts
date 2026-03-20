import { GlobalArgFragment } from "@/reaktion/api/graphql";
import {
  ClickContextualParams,
  ConnectContextualParams,
  DropContextualParams,
  EdgeContextualParams,
  FlowEdge,
  ContextualParams,
  FlowNode,
  SubflowDropContextualParams,
} from "@/reaktion/types";
import {
  createVanillaTransformEdge,
  integrate,
} from "@/reaktion/validation/integrate";
import { ValidationResult } from "@/reaktion/validation/types";
import { validateState } from "@/reaktion/validation/validate";
import { handleToStream, nodeIdBuilder } from "@/reaktion/utils";
import {
  EdgeChange,
  NodeChange,
  OnConnectStartParams,
  ReactFlowInstance,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import { temporal } from "zundo";
import { createStore } from "zustand";

type TemporalEditFlowState = Pick<
  ValidationResult,
  "nodes" | "edges" | "globals" | "remainingErrors" | "solvedErrors" | "valid"
>;

const getClientPoint = (event: MouseEvent | TouchEvent) => {
  if ("touches" in event && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  if ("changedTouches" in event && event.changedTouches.length > 0) {
    return {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };
  }

  if ("clientX" in event) {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  return null;
};

export interface EditFlowState extends ValidationResult {
  showEdgeLabels: boolean;
  showNodeErrors: boolean;
  contextuals: ContextualParams[];
  reactFlowInstance: ReactFlowInstance | null;
  relativeWrapperRef: React.RefObject<HTMLDivElement | null> | null;
  connectingStart?: OnConnectStartParams;
  replaceValidationResult: (
    next: ValidationResult | ((state: EditFlowState) => ValidationResult),
  ) => void;
  updateData: (data: Partial<FlowNode["data"]>, id: string) => void;
  setGlobals: (data: GlobalArgFragment[]) => void;
  removeGlobal: (key: string) => void;
  removeEdge: (id: string) => void;
  addNode: (node: FlowNode) => void;
  moveConstantToGlobals: (
    nodeId: string,
    conindex: number,
    globalkey?: string | undefined,
  ) => void;
  moveStreamToConstants: (
    nodeId: string,
    streamIndex: number,
    itemIndex: number,
  ) => void;
  moveConstantToStream: (
    nodeId: string,
    conindex: number,
    streamIndex: number,
  ) => void;
  moveOutStreamToVoid: (
    nodeId: string,
    conindex: number,
    streamIndex: number,
  ) => void;
  moveVoidtoOutstream: (
    nodeId: string,
    conindex: number,
    streamIndex: number,
  ) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  setReactFlowInstance: (instance: ReactFlowInstance | null) => void;
  setConnectingStart: (params: OnConnectStartParams | undefined) => void;
  setShowEdgeLabels: (value: boolean) => void;
  setShowNodeErrors: (value: boolean) => void;
  toggleShowEdgeLabels: () => void;
  toggleShowNodeErrors: () => void;
  addContextual: (contextual: ContextualParams) => void;
  removeContextual: (id: string) => void;
  clearPanels: () => void;
  addClickNode: (node: FlowNode, params: ClickContextualParams) => void;
  addConnectContextualNode: (
    node: FlowNode,
    params: ConnectContextualParams,
  ) => void;
  addEdgeContextualNode: (node: FlowNode, params: EdgeContextualParams) => void;
  addContextualNode: (
    node: FlowNode,
    params: DropContextualParams | SubflowDropContextualParams,
  ) => void;
  setRelativeWrapperRef: (ref: React.RefObject<HTMLDivElement | null>) => void;



}

export const createEditFlowStore = (initialState: ValidationResult) =>
  createStore<EditFlowState>()(
    temporal(
      (set, get) => ({
        ...initialState,
        showEdgeLabels: false,
        showNodeErrors: true,
        contextuals: [],
        reactFlowInstance: null,
        connectingStart: undefined,

        replaceValidationResult: (next) => {
          set((state) => (typeof next === "function" ? next(state) : next));
        },

        onNodesChange: (changes) => {
          const state = get();
          const nextNodes = applyNodeChanges(changes, state.nodes) as FlowNode[];

          if (
            changes.length === 1 &&
            (changes[0].type === "position" || changes[0].type === "dimensions")
          ) {
            set({ nodes: nextNodes });
            return;
          }

          set(
            validateState({
              ...state,
              nodes: nextNodes,
            }),
          );
        },

        onEdgesChange: (changes) => {
          const state = get();
          set(
            validateState({
              ...state,
              edges: applyEdgeChanges(changes, state.edges) as FlowEdge[],
            }),
          );
        },

        updateData: (data, id) => {
          set((state) =>
            validateState({
              ...state,
              nodes: state.nodes.map((node) => {
                if (node.id !== id) {
                  return node;
                }

                return {
                  ...node,
                  data: { ...node.data, ...data },
                } as FlowNode;
              }),
            }),
          );
        },

        setGlobals: (globals) => {
          set((state) =>
            validateState({
              ...state,
              globals,
            }),
          );
        },

        removeGlobal: (globalkey) => {
          set((state) => {
            const nodes = state.nodes.map((node) => ({
              ...node,
              data: {
                ...node.data,
                globalsMap: Object.fromEntries(
                  Object.entries(node.data.globalsMap ?? {}).filter(
                    ([, value]) => value !== globalkey,
                  ),
                ),
              },
            })) as FlowNode[];

            return validateState({
              ...state,
              nodes,
              globals: state.globals.filter((globalArg) => globalArg.key !== globalkey),
            });
          });
        },

        removeEdge: (id) => {
          set((state) =>
            validateState({
              ...state,
              edges: state.edges.filter((edge) => edge.id !== id),
            }),
          );
        },

        addNode: (node) => {
          set((state) =>
            validateState({
              ...state,
              nodes: [...state.nodes, node],
            }),
          );
        },

        moveConstantToStream: (nodeId, conindex, instream) => {
          set((state) => {
            const node = state.nodes.find((candidate) => candidate.id === nodeId);
            if (!node) {
              return state;
            }

            const constant = node.data.constants.at(conindex);
            if (!constant) {
              return state;
            }

            const newInstream = node.data.ins.map((stream, index) =>
              index === instream ? [...stream, constant] : stream,
            );

            const newConstants = node.data.constants.filter(
              (_, index) => index !== conindex,
            );

            const updatedEdges = state.edges.map((edge) => {
              if (
                edge.target === nodeId &&
                handleToStream(edge.targetHandle) === instream &&
                edge.data
              ) {
                const streamItems = newInstream[instream]?.map((port) => ({
                  __typename: "StreamItem" as const,
                  kind: port.kind,
                  label: port.label ?? port.key,
                }));

                if (!streamItems) {
                  return edge;
                }

                return {
                  ...edge,
                  data: {
                    ...edge.data,
                    stream: streamItems,
                  },
                };
              }

              return edge;
            });

            return validateState({
              ...state,
              nodes: state.nodes.map((candidate) => {
                if (candidate.id !== nodeId) {
                  return candidate;
                }

                return {
                  ...candidate,
                  data: {
                    ...candidate.data,
                    ins: newInstream,
                    constants: newConstants,
                    constantsMap: {
                      ...candidate.data.constantsMap,
                      [constant.key]: undefined,
                    },
                    globalsMap: {
                      ...candidate.data.globalsMap,
                      [constant.key]: undefined,
                    },
                  },
                } as FlowNode;
              }),
              edges: updatedEdges,
            });
          });
        },

        moveVoidtoOutstream: (nodeId, voidindex, outstream) => {
          set((state) => {
            const node = state.nodes.find((candidate) => candidate.id === nodeId);
            if (!node) {
              return state;
            }

            const outputVoid = node.data.voids.at(voidindex);
            if (!outputVoid) {
              return state;
            }

            const newOutstream = node.data.outs.map((stream, index) =>
              index === outstream ? [...stream, outputVoid] : stream,
            );

            const newVoids = node.data.voids.filter((_, index) => index !== voidindex);

            return validateState({
              ...state,
              nodes: state.nodes.map((candidate) => {
                if (candidate.id !== nodeId) {
                  return candidate;
                }

                return {
                  ...candidate,
                  data: {
                    ...candidate.data,
                    outs: newOutstream,
                    voids: newVoids,
                  },
                } as FlowNode;
              }),
            });
          });
        },

        moveOutStreamToVoid: (nodeId, streamIndex, streamItem) => {
          set((state) => {
            const node = state.nodes.find((candidate) => candidate.id === nodeId);
            if (!node) {
              return state;
            }

            const output = node.data.outs.at(streamIndex)?.at(streamItem);
            if (!output) {
              return state;
            }

            const newOutstream = node.data.outs.map((stream, index) =>
              index === streamIndex
                ? stream.filter((_, itemIndex) => itemIndex !== streamItem)
                : stream,
            );

            return validateState({
              ...state,
              nodes: state.nodes.map((candidate) => {
                if (candidate.id !== nodeId) {
                  return candidate;
                }

                return {
                  ...candidate,
                  data: {
                    ...candidate.data,
                    outs: newOutstream,
                    voids: [...candidate.data.voids, output],
                  },
                } as FlowNode;
              }),
            });
          });
        },

        moveStreamToConstants: (nodeId, streamIndex, streamItem) => {
          set((state) => {
            const node = state.nodes.find((candidate) => candidate.id === nodeId);
            if (!node) {
              return state;
            }

            const input = node.data.ins.at(streamIndex)?.at(streamItem);
            if (!input) {
              return state;
            }

            const newInstream = node.data.ins.map((stream, index) =>
              index === streamIndex
                ? stream.filter((_, itemIndex) => itemIndex !== streamItem)
                : stream,
            );

            return validateState({
              ...state,
              nodes: state.nodes.map((candidate) => {
                if (candidate.id !== nodeId) {
                  return candidate;
                }

                return {
                  ...candidate,
                  data: {
                    ...candidate.data,
                    ins: newInstream,
                    constants: [...candidate.data.constants, input],
                    constantsMap: {
                      ...candidate.data.constantsMap,
                      [input.key]: input.default,
                    },
                  },
                } as FlowNode;
              }),
            });
          });
        },

        moveConstantToGlobals: (nodeId, conindex, globalkey) => {
          set((state) => {
            const node = state.nodes.find((candidate) => candidate.id === nodeId);
            if (!node) {
              return state;
            }

            const constant = node.data.constants.at(conindex);
            if (!constant) {
              return state;
            }

            let nextGlobalKey = globalkey;
            let globals = state.globals;

            if (!nextGlobalKey) {
              nextGlobalKey = constant.key;
              globals = [...state.globals, { key: constant.key, port: constant }];
            } else {
              globals = state.globals.map((globalArg) =>
                globalArg.key === nextGlobalKey
                  ? { ...globalArg, port: constant }
                  : globalArg,
              );
            }

            return validateState({
              ...state,
              nodes: state.nodes.map((candidate) => {
                if (candidate.id !== nodeId) {
                  return candidate;
                }

                return {
                  ...candidate,
                  data: {
                    ...candidate.data,
                    constantsMap: {
                      ...candidate.data.constantsMap,
                      [constant.key]: undefined,
                    },
                    globalsMap: {
                      ...candidate.data.globalsMap,
                      [constant.key]: nextGlobalKey,
                    },
                  },
                } as FlowNode;
              }),
              globals,
            });
          });
        },

        setReactFlowInstance: (reactFlowInstance) => set({ reactFlowInstance }),
        setConnectingStart: (connectingStart) => set({ connectingStart }),
        setShowEdgeLabels: (showEdgeLabels) => set({ showEdgeLabels }),
        setShowNodeErrors: (showNodeErrors) => set({ showNodeErrors }),
        toggleShowEdgeLabels: () => {
          set((state) => ({ showEdgeLabels: !state.showEdgeLabels }));
        },
        toggleShowNodeErrors: () => {
          set((state) => ({ showNodeErrors: !state.showNodeErrors }));
        },
        addContextual: (contextual) => set((state) => ({ contextuals: [...state.contextuals, contextual] })),
        removeContextual: (id) => set((state) => ({ contextuals: state.contextuals.filter(c => c.id !== id) })),


        clearPanels: () => {
          set({
            contextuals: [],
          });
        },

        addClickNode: (stagingNode, params) => {
          const state = get();
          const point = getClientPoint(params.event);
          if (!state.reactFlowInstance || !point) {
            return;
          }

          const position = state.reactFlowInstance.screenToFlowPosition(point);

          set(
            validateState({
              ...state,
              nodes: state.nodes.concat({ ...stagingNode, position }),
            }),
          );

          set({ contextuals: [] });
        },

        addConnectContextualNode: (stagingNode, params) => {
          const state = get();
          if (!state.reactFlowInstance) {
            return;
          }

          const oldNodeSourceId = params.connection.source;
          const oldNodeSourceStreamId = handleToStream(params.connection.sourceHandle);
          const targetNodeSourceStreamId = handleToStream(
            params.connection.targetHandle,
          );
          const targetNodeSourceId = params.connection.target;

          if (!oldNodeSourceId || !targetNodeSourceId) {
            return;
          }

          const leftNodeDims = { width: 200, height: 100 };
          const rightNodeDims = { width: 200, height: 100 };

          const centerLeft = {
            x: params.leftNode.position.x + leftNodeDims.width / 2,
            y: params.leftNode.position.y + leftNodeDims.height / 2,
          };
          const centerRight = {
            x: params.rightNode.position.x + rightNodeDims.width / 2,
            y: params.rightNode.position.y + rightNodeDims.height / 2,
          };

          const position = {
            x: (centerLeft.x + centerRight.x) / 2,
            y: (centerLeft.y + centerRight.y) / 2,
          };

          const nextState = validateState({
            ...state,
            nodes: state.nodes.concat({ ...stagingNode, position }),
            edges: state.edges.concat(
              createVanillaTransformEdge(
                nodeIdBuilder(),
                oldNodeSourceId,
                oldNodeSourceStreamId,
                stagingNode.id,
                0,
              ),
              createVanillaTransformEdge(
                nodeIdBuilder(),
                stagingNode.id,
                0,
                targetNodeSourceId,
                targetNodeSourceStreamId,
              ),
            ),
          });

          set(nextState);
          set({ contextuals: [] });
        },

        addEdgeContextualNode: (stagingNode, params) => {
          const state = get();
          if (!state.reactFlowInstance) {
            return;
          }

          const leftNodeDims = { width: 200, height: 100 };
          const rightNodeDims = { width: 200, height: 100 };

          const centerLeft = {
            x: params.leftNode.position.x + leftNodeDims.width / 2,
            y: params.leftNode.position.y + leftNodeDims.height / 2,
          };
          const centerRight = {
            x: params.rightNode.position.x + rightNodeDims.width / 2,
            y: params.rightNode.position.y + rightNodeDims.height / 2,
          };

          const position = {
            x: (centerLeft.x + centerRight.x) / 2,
            y: (centerLeft.y + centerRight.y) / 2,
          };

          const nextState = validateState({
            ...state,
            nodes: state.nodes.concat({ ...stagingNode, position }),
            edges: state.edges
              .filter((edge) => edge.id !== params.edgeId)
              .concat(
                createVanillaTransformEdge(
                  nodeIdBuilder(),
                  params.leftNode.id,
                  params.leftStream,
                  stagingNode.id,
                  0,
                ),
                createVanillaTransformEdge(
                  nodeIdBuilder(),
                  stagingNode.id,
                  0,
                  params.rightNode.id,
                  params.rightStream,
                ),
              ),
          });

          set(nextState);
          set({ contextuals: [] });
        },

        addContextualNode: (stagingNode, params) => {
          const state = get();
          if (!state.reactFlowInstance) {
            return;
          }

          const connectionParams = params.connectionParams;
          if (!connectionParams.nodeId || !connectionParams.handleId) {
            return;
          }

          const oldNode = state.reactFlowInstance.getNode(connectionParams.nodeId);
          const point = getClientPoint(params.event);

          if (!oldNode || !point) {
            return;
          }

          const targetSubflowNode =
            "subflowNodeId" in params
              ? state.nodes.find((node) => node.id === params.subflowNodeId)
              : undefined;
          const flowPosition = state.reactFlowInstance.screenToFlowPosition(point);
          const position =
            targetSubflowNode && "subflowNodeId" in params
              ? {
                  x: flowPosition.x - targetSubflowNode.position.x,
                  y: flowPosition.y - targetSubflowNode.position.y,
                }
              : flowPosition;
          const nextStagingNode =
            targetSubflowNode && "subflowNodeId" in params
              ? {
                  ...stagingNode,
                  parentId: params.subflowNodeId,
                  extent: "parent" as const,
                }
              : stagingNode;

          if (connectionParams.handleType === "source") {
            const oldNodeSourceId = oldNode.id;
            const oldNodeSourceStreamId = handleToStream(connectionParams.handleId);

            const stagedState = {
              ...state,
              nodes: state.nodes.concat({ ...nextStagingNode, position }),
              edges: state.edges.concat(
                createVanillaTransformEdge(
                  nodeIdBuilder(),
                  oldNodeSourceId,
                  oldNodeSourceStreamId,
                  nextStagingNode.id,
                  0,
                ),
              ),
            };

            const integratedState = integrate(stagedState, {
              source: oldNodeSourceId,
              sourceHandle: connectionParams.handleId,
              target: nextStagingNode.id,
              targetHandle: "arg_0",
            });

            set(validateState(integratedState));
            set({ contextuals: [] });
            return;
          }

          if (connectionParams.handleType === "target") {
            const oldNodeTargetId = oldNode.id;
            const oldNodeTargetStreamId = handleToStream(connectionParams.handleId);

            const stagedState = {
              ...state,
              nodes: state.nodes.concat({ ...nextStagingNode, position }),
              edges: state.edges.concat(
                createVanillaTransformEdge(
                  nodeIdBuilder(),
                  nextStagingNode.id,
                  0,
                  oldNodeTargetId,
                  oldNodeTargetStreamId,
                ),
              ),
            };

            const integratedState = integrate(stagedState, {
              source: nextStagingNode.id,
              sourceHandle: "return_0",
              target: oldNodeTargetId,
              targetHandle: connectionParams.handleId,
            });

            set(validateState(integratedState));
            set({ contextuals: [] });
          }
        },
      }),
      {
        limit: 100,
        partialize: (state): TemporalEditFlowState => ({
          nodes: state.nodes,
          edges: state.edges,
          globals: state.globals,
          remainingErrors: state.remainingErrors,
          solvedErrors: state.solvedErrors,
          valid: state.valid,
        }),
      },
    ),
  );
