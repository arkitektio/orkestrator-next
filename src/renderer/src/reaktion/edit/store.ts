import { createStore } from "zustand";
import { FlowNode, FlowEdge, ClickContextualParams } from "../types";
import { GlobalArgFragment } from "@/reaktion/api/graphql";
import { ValidationResult } from "../validation/types";
import { validateState } from "../validation/validate";
import { flowNodeToInput, flowEdgeToInput, globalToInput, handleToStream, nodeIdBuilder } from "../utils";
import { createVanillaTransformEdge, integrate } from "../validation/integrate";
import { NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";

export interface EditFlowState extends ValidationResult {
  updateData: (data: Partial<any>, id: string) => void;
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
  setEdges: (edges: FlowEdge[]) => void;
  setNodes: (nodes: FlowNode[]) => void;
  setStateRaw: (state: ValidationResult | ((prev: ValidationResult) => ValidationResult)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const createEditFlowStore = (initialState: ValidationResult) =>
  createStore<EditFlowState>()((set, get) => ({
    ...initialState,

    setStateRaw: (state) => set(state),
    undo: () => {},
    redo: () => {},
    canUndo: false,
    canRedo: false,

    onNodesChange: (changes) => {
      const state = get();
      if (
        changes.length == 1 &&
        (changes[0].type == "position" || changes[0].type == "dimensions")
      ) {
        set({
          nodes: applyNodeChanges(changes, state.nodes) as FlowNode[],
        });
      } else {
        set(
          validateState({
            ...state,
            nodes: applyNodeChanges(changes, state.nodes) as FlowNode[],
          })
        );
      }
    },

    onEdgesChange: (changes) => {
      const state = get();
      set(
        validateState({
          ...state,
          edges: applyEdgeChanges(changes, state.edges) as FlowEdge[],
        })
      );
    },

    setNodes: (nodes) => {
        set((state) => validateState({ ...state, nodes }));
    },

    setEdges: (edges) => {
        set((state) => validateState({ ...state, edges }));
    },

    updateData: (data, id) => {
      set((state) =>
        validateState({
          ...state,
          nodes: state.nodes.map((n) => {
            if (n.id === id) {
              return { ...n, data: { ...n.data, ...data } } as FlowNode;
            }
            return n;
          }),
        })
      );
    },

    setGlobals: (globals) => {
      set((state) =>
        validateState({
          ...state,
          globals: globals,
        })
      );
    },

    removeGlobal: (globalkey) => {
      set((state) => {
        const nodes = state.nodes.map((n) => {
          const new_data = {
            ...n.data,
            globalsMap: Object.fromEntries(
              Object.entries({...(n.data as any).globalsMap}).filter(
                ([key, value]) => value != globalkey,
              ),
            ),
          };
          return { ...n, data: new_data } as FlowNode;
        });

        return validateState({
          ...state,
          nodes: nodes,
          globals: state.globals.filter((g) => g.key != globalkey),
        });
      });
    },

    removeEdge: (id) => {
      set((state) =>
        validateState({
          ...state,
          edges: state.edges.filter((e) => e.id !== id),
        })
      );
    },

    addNode: (node) => {
      set((state) =>
        validateState({ ...state, nodes: [...state.nodes, node] })
      );
    },

    moveConstantToStream: (nodeId, conindex, instream) => {
      set((state) => {
        const node = state.nodes.find((n) => n.id == nodeId);
        if (!node) return state;

        const data: any = node.data;

        const constant = data.constants.at(conindex);
        if (!constant) return state;

        const new_instream = data.ins.map((s: any, index: any) => {
          if (index == instream) {
            return [...s, constant];
          }
          return s;
        });

        const new_constants = data.constants.filter(
          (i: any, index: any) => index != conindex,
        );

        const targetStreamIndex = instream;
        const updatedEdges = state.edges.map((edge) => {
          if (
            edge.target === nodeId &&
            handleToStream(edge.targetHandle) === targetStreamIndex &&
            edge.data
          ) {
            const streamItems = new_instream[targetStreamIndex]?.map((port: any) => ({
              __typename: "StreamItem" as const,
              kind: port.kind,
              label: port.label ?? port.key,
            }));
            if (!streamItems) return edge;
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

        const new_data = {
          ...data,
          ins: new_instream,
          constants: new_constants,
          constantsMap: { ...data.constantsMap, [constant.key]: undefined },
          globalsMap: { ...data.globalsMap, [constant.key]: undefined },
        };

        return validateState({
          ...state,
          nodes: state.nodes.map((n) => {
            if (n.id === nodeId) {
              return { ...n, data: new_data } as FlowNode;
            }
            return n;
          }),
          edges: updatedEdges,
        });
      });
    },

    moveVoidtoOutstream: (nodeId, voidindex, outstream) => {
      set((state) => {
        const node = state.nodes.find((n) => n.id == nodeId);
        if (!node) return state;
        const data: any = node.data;

        const thevoid = data.voids.at(voidindex);
        if (!thevoid) return state;

        const new_outstream = data.outs.map((s: any, index: any) => {
          if (index == outstream) {
            return [...s, thevoid];
          }
          return s;
        });

        const new_voids = data.voids.filter((i: any, index: any) => index != voidindex);

        const new_data = {
          ...data,
          outs: new_outstream,
          voids: new_voids,
        };

        return validateState({
          ...state,
          nodes: state.nodes.map((n) => {
            if (n.id === nodeId) {
              return { ...n, data: new_data } as FlowNode;
            }
            return n;
          }),
        });
      });
    },

    moveOutStreamToVoid: (nodeId, streamIndex, streamItem) => {
      set((state) => {
        const node = state.nodes.find((n) => n.id == nodeId);
        if (!node) return state;
        const data: any = node.data;

        const streamitem = data.outs.at(streamIndex)?.at(streamItem);
        if (!streamitem) return state;

        const new_outstream = data.outs.map((s: any, index: any) => {
          if (index == streamIndex) {
            return s.filter((i: any, index: any) => index != streamItem);
          }
          return s;
        });

        const new_data = {
          ...data,
          outs: new_outstream,
          voids: [...data.voids, streamitem],
        };

        return validateState({
          ...state,
          nodes: state.nodes.map((n) => {
            if (n.id === nodeId) {
              return { ...n, data: new_data } as FlowNode;
            }
            return n;
          }),
        });
      });
    },

    moveStreamToConstants: (nodeId, streamIndex, streamItem) => {
      set((state) => {
        const node = state.nodes.find((n) => n.id == nodeId);
        if (!node) return state;
        const data: any = node.data;

        const streamitem = data.ins.at(streamIndex)?.at(streamItem);
        if (!streamitem) return state;

        const new_instream = data.ins.map((s: any, index: any) => {
          if (index == streamIndex) {
            return s.filter((i: any, index: any) => index != streamItem);
          }
          return s;
        });

        const new_data = {
          ...data,
          ins: new_instream,
          constants: [...data.constants, streamitem],
          constantsMap: {
            ...data.constantsMap,
            [streamitem.key]: streamitem.default,
          },
        };

        return validateState({
          ...state,
          nodes: state.nodes.map((n) => {
            if (n.id === nodeId) {
              return { ...n, data: new_data } as FlowNode;
            }
            return n;
          }),
        });
      });
    },

    moveConstantToGlobals: (nodeId, conindex, globalkey?) => {
      set((state) => {
        const node = state.nodes.find((n) => n.id == nodeId);
        if (!node) return state;
        const data: any = node.data;

        const constant = data.constants.at(conindex);
        if (!constant) return state;

        let new_globals = state.globals;
        if (!globalkey) {
          new_globals = [...state.globals, { key: constant.key, port: constant }];
          globalkey = constant.key;
        } else {
          new_globals = state.globals.map((g) => {
            if (g.key == globalkey) {
              return { ...g, port: constant };
            }
            return g;
          });
        }

        const new_data = {
          ...data,
          constants: data.constants,
          constantsMap: { ...data.constantsMap, [constant.key]: undefined },
          globalsMap: { ...data.globalsMap, [constant.key]: globalkey },
        };

        return validateState({
          ...state,
          nodes: state.nodes.map((n) => {
            if (n.id === nodeId) {
              return { ...n, data: new_data } as FlowNode;
            }
            return n;
          }),
          globals: new_globals,
        });
      });
    },
  }));
