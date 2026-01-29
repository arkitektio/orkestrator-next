import { GraphFragment } from "@/kraph/api/graphql";
import React, { ReactNode } from "react";

import { StagingEdgeParams, StagingNodeParams } from "./types";

export type WhereCondition = {
  property: string;
  operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "CONTAINS" | "STARTS WITH" | "ENDS WITH" | "IN";
  value: string | number | boolean | string[];
};

export type NodeWhereClause = {
  nodeId: string;
  conditions: WhereCondition[];
};

export type ReturnColumn = {
  nodeId: string; // The node this column is for
  property: string; // The property to return (e.g., "label", "id", "metricKind")
  alias?: string; // Optional alias for the column
  cypherExpression?: string; // Optional custom Cypher expression (e.g., "count(n)")
  idfor?: string[]; // Array of node IDs this column serves as an identifier for
};

export type Path = {
  title?: string;
  optional: boolean;
  nodes: string[];
  relations: string[];
  relationDirections?: boolean[]; // true = forward (-->), false = reverse (<--)
  color?: number[]; // RGB color array [r, g, b] with values 0-1
  whereClauses?: NodeWhereClause[]; // WHERE conditions for specific nodes
  startsFromPath?: number; // Index of the path this path starts from (for variable reuse)
  startsFromNodePosition?: number; // Position in the source path where this path starts
};

export type NodeOccurrence = {
  pathIndex: number;
  nodePosition: number;
};

export type OntologyGraphContextType = {
  graph: GraphFragment;
  markedPaths?: Path[];
  possibleNodes?: string[];
  possibleEdges?: string[];
  addStagingEdge: (params: StagingEdgeParams) => void;
  addStagingNode: (params: StagingNodeParams) => void;
  // WHERE clause management (global)
  whereClauses?: NodeWhereClause[];
  setWhereClause?: (nodeId: string, conditions: WhereCondition[]) => void;
  getWhereClause?: (nodeId: string) => NodeWhereClause | undefined;
  // WHERE clause management (per path occurrence)
  setPathWhereConditions?: (pathIndex: number, nodeId: string, conditions: WhereCondition[]) => void;
  getPathWhereConditions?: (pathIndex: number, nodeId: string) => WhereCondition[];
  // Return columns management
  returnColumns?: ReturnColumn[];
  addReturnColumn?: (column: ReturnColumn) => void;
  removeReturnColumn?: (nodeId: string, property: string) => void;
  getNodeReturnColumns?: (nodeId: string) => ReturnColumn[];
  // Node properties
  getNodeProperties?: (nodeId: string) => Array<{ name: string; type: "string" | "number" | "boolean" }>;
};

// Predefined color palette for paths (RGB arrays with values 0-1)
export const PATH_COLORS: number[][] = [
  [34 / 255, 197 / 255, 94 / 255],   // Green
  [59 / 255, 130 / 255, 246 / 255],  // Blue
  [236 / 255, 72 / 255, 153 / 255],  // Pink
  [234 / 255, 179 / 255, 8 / 255],   // Yellow
  [168 / 255, 85 / 255, 247 / 255],  // Purple
  [239 / 255, 68 / 255, 68 / 255],   // Red
  [20 / 255, 184 / 255, 166 / 255],  // Teal
  [249 / 255, 115 / 255, 22 / 255],  // Orange
];

export const OntoloGraphContext = React.createContext<OntologyGraphContextType>(
  {} as unknown as OntologyGraphContextType,
);

export const useOntologyGraph = () => {
  return React.useContext(OntoloGraphContext);
};


export const usePathMarker = (nodeId: string) => {
  const { markedPaths } = useOntologyGraph();
  return markedPaths?.filter((path) => path.nodes.includes(nodeId)) || [];
}

export const useIsNodePossible = (nodeId: string) => {
  const { possibleNodes } = useOntologyGraph();
  // If possibleNodes is undefined, nothing is selectable
  // If it's defined but empty, nothing is selectable
  // Only nodes in the possibleNodes array are selectable
  if (!possibleNodes) {
    return false;
  }
  return possibleNodes.includes(nodeId);
}

export const useIsEdgePossible = (edgeId: string) => {
  const { possibleEdges } = useOntologyGraph();
  // If possibleEdges is undefined, nothing is selectable
  // If it's defined but empty, nothing is selectable
  // Only edges in the possibleEdges array are selectable
  if (!possibleEdges) {
    return false;
  }
  return possibleEdges.includes(edgeId);
}

export const useIsNodeInPath = (nodeId: string) => {
  const { markedPaths } = useOntologyGraph();
  return markedPaths?.some((path) => path.nodes.includes(nodeId)) || false;
}

export const useIsEdgeInPath = (edgeId: string) => {
  const { markedPaths } = useOntologyGraph();
  return markedPaths?.some((path) => path.relations.includes(edgeId)) || false;
}

// Get the path(s) that contain a specific node
export const useNodePaths = (nodeId: string): Path[] => {
  const { markedPaths } = useOntologyGraph();
  return markedPaths?.filter((path) => path.nodes.includes(nodeId)) || [];
}

// Get all occurrences of a node across paths (with path index and position)
export const useNodeOccurrences = (nodeId: string): NodeOccurrence[] => {
  const { markedPaths } = useOntologyGraph();
  const occurrences: NodeOccurrence[] = [];

  markedPaths?.forEach((path, pathIndex) => {
    path.nodes.forEach((nId, nodePosition) => {
      if (nId === nodeId) {
        occurrences.push({ pathIndex, nodePosition });
      }
    });
  });

  return occurrences;
}

// Get the path(s) that contain a specific edge
export const useEdgePaths = (edgeId: string): Path[] => {
  const { markedPaths } = useOntologyGraph();
  return markedPaths?.filter((path) => path.relations.includes(edgeId)) || [];
}

// Get WHERE clause for a specific node
export const useNodeWhereClause = (nodeId: string): NodeWhereClause | undefined => {
  const { getWhereClause } = useOntologyGraph();
  return getWhereClause?.(nodeId);
}

// Get return columns for a specific node
export const useNodeReturnColumns = (nodeId: string): ReturnColumn[] => {
  const { getNodeReturnColumns } = useOntologyGraph();
  return getNodeReturnColumns?.(nodeId) || [];
}

// Hook to manage WHERE clauses for a node
export const useWhereClauseManager = (nodeId: string) => {
  const { setWhereClause, getWhereClause } = useOntologyGraph();
  const whereClause = getWhereClause?.(nodeId);

  return {
    conditions: whereClause?.conditions || [],
    setConditions: (conditions: WhereCondition[]) => {
      setWhereClause?.(nodeId, conditions);
    },
    hasConditions: (whereClause?.conditions?.length || 0) > 0,
  };
};

// Hook to manage return columns for a node
export const useReturnColumnManager = (nodeId: string) => {
  const { addReturnColumn, removeReturnColumn, getNodeReturnColumns } = useOntologyGraph();
  const columns = getNodeReturnColumns?.(nodeId) || [];

  return {
    columns,
    addColumn: (property: string, alias?: string, cypherExpression?: string) => {
      addReturnColumn?.({ nodeId, property, alias, cypherExpression });
    },
    removeColumn: (property: string) => {
      removeReturnColumn?.(nodeId, property);
    },
    hasColumns: columns.length > 0,
  };
};

export const OntologyGraphProvider: React.FC<
  OntologyGraphContextType & { children: ReactNode }
> = ({ children, ...props }) => {
  return (
    <OntoloGraphContext.Provider value={props}>
      {children}
    </OntoloGraphContext.Provider>
  );
};
