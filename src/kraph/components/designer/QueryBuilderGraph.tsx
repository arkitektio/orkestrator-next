import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  GraphFragment,
  useCreateGraphQueryMutation,
  GraphQueryFragment
} from "@/kraph/api/graphql";
import { KraphGraph } from "@/linkers";
import { SelectiveGraphQueryRenderer } from "@/kraph/components/renderers/GraphQueryRenderer";
import {
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ELK from "elkjs/lib/elk.bundled.js";
import React, { useState, useMemo } from "react";
import { Filter, Plus, X } from "lucide-react";
import "./index.css";
import { OntologyGraphProvider, Path, PATH_COLORS, WhereCondition, ReturnColumn, NodeWhereClause } from "./OntologyGraphProvider";
import {
  MyEdge,
  MyNode
} from "./types";
import { BUILDER_EDGE_TYPES, BUILDER_NODE_TYPES, discoLayout, forceLayout, hashGraph, layeredLayout, ontologyToEdges, ontologyToNodes, radialLayout, stressLayout, treeLayout } from "./utils";
import { enrichPath, generateUnifiedCypherQueryWithColumns, generateGraphQueryInput } from "./cypherGenerator";
import { CypherQueryDisplay } from "./components/CypherQueryDisplay";
import { ReturnColumnBuilder } from "./components/ReturnColumnBuilder";

// Node property configurations
const NODE_PROPERTIES: Record<string, Array<{ name: string; type: 'string' | 'number' | 'boolean' }>> = {
  Entity: [
    { name: "label", type: "string" },
    { name: "ageName", type: "string" },
    { name: "description", type: "string" },
  ],
  Structure: [
    { name: "label", type: "string" },
    { name: "ageName", type: "string" },
    { name: "kind", type: "string" },
  ],
  Metric: [
    { name: "label", type: "string" },
    { name: "ageName", type: "string" },
    { name: "value", type: "number" },
  ],
  default: [
    { name: "label", type: "string" },
    { name: "ageName", type: "string" },
  ],
};

// Inline WHERE clause editor component
interface InlineWhereEditorProps {
  nodeId: string;
  nodeLabel: string;
  initialConditions: WhereCondition[];
  onSave: (conditions: WhereCondition[]) => void;
  onCancel: () => void;
}

const InlineWhereEditor: React.FC<InlineWhereEditorProps> = ({
  nodeLabel,
  initialConditions,
  onSave,
  onCancel,
}) => {
  const [conditions, setConditions] = useState<WhereCondition[]>(
    initialConditions.length > 0 ? initialConditions : [{ property: "", operator: "=", value: "" }]
  );

  const nodeType = nodeLabel.split(" (")[0] || "default";
  const properties = NODE_PROPERTIES[nodeType] || NODE_PROPERTIES.default;

  const addCondition = () => {
    setConditions([...conditions, { property: "", operator: "=", value: "" }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, field: keyof WhereCondition, value: string) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], [field]: value };
    setConditions(updated);
  };

  const getOperatorsForProperty = (propertyName: string) => {
    const prop = properties.find((p) => p.name === propertyName);
    if (!prop) return ["=", "!="];

    if (prop.type === "string") {
      return ["=", "!=", "CONTAINS", "STARTS WITH", "ENDS WITH"];
    } else if (prop.type === "number") {
      return ["=", "!=", "<", ">", "<=", ">="];
    } else if (prop.type === "boolean") {
      return ["=", "!="];
    }
    return ["=", "!="];
  };

  return (
    <div className="border rounded-lg p-3 bg-muted/50 space-y-2">
      <div className="text-xs font-semibold mb-2">WHERE Filters for {nodeLabel}</div>

      {conditions.map((condition, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select
            value={condition.property}
            onValueChange={(value) => updateCondition(index, "property", value)}
          >
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue placeholder="Property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((prop) => (
                <SelectItem key={prop.name} value={prop.name}>
                  {prop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={condition.operator}
            onValueChange={(value) => updateCondition(index, "operator", value)}
          >
            <SelectTrigger className="h-8 text-xs w-32">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              {getOperatorsForProperty(condition.property).map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            className="h-8 text-xs flex-1"
            placeholder="Value"
            value={String(condition.value)}
            onChange={(e) => updateCondition(index, "value", e.target.value)}
          />

          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => removeCondition(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <div className="flex items-center justify-between pt-2">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={addCondition}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Condition
        </Button>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              // Filter out empty conditions
              const validConditions = conditions.filter(
                (c) => c.property && c.operator && c.value
              );
              onSave(validConditions);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};




export const QueryBuilderGraph = ({ graph }: { graph: GraphFragment }) => {

  const [paths, setPaths] = useState<Path[]>([]); // All completed paths
  const [activePath, setActivePath] = useState<Path | null>(null); // Current path being built
  const [nextColorIndex, setNextColorIndex] = useState(0);

  // WHERE clause builder state - track which node is being edited inline
  const [editingWhereNode, setEditingWhereNode] = useState<{ pathIndex: number; nodeId: string } | null>(null);

  // RETURN columns state
  const [returnColumns, setReturnColumns] = useState<ReturnColumn[]>([]);
  const [returnBuilderOpen, setReturnBuilderOpen] = useState(false);

  // WHERE clauses state - now global for all nodes
  const [whereClauses, setWhereClauses] = useState<NodeWhereClause[]>([]);

  // Query execution state
  const [executedGraphQuery, setExecutedGraphQuery] = useState<GraphQueryFragment | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [createGraphQuery] = useCreateGraphQueryMutation();

  const reactFlowWrapper = React.useRef<HTMLDivElement | null>(null);

  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<ReactFlowInstance<MyNode, MyEdge> | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<MyNode>(
    ontologyToNodes(graph),
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<MyEdge>(
    ontologyToEdges(graph),
  );

  // Calculate possible nodes and edges based on current path
  const [possibleNodes, possibleEdges] = React.useMemo((): [string[], string[]] => {
    // If no active path, allow starting from any node that's in an existing path or any node if no paths exist
    if (!activePath || activePath.nodes.length === 0) {
      if (paths.length === 0) {
        // First path - can start from any node
        return [nodes.map(n => n.id), []];
      } else {
        // Subsequent paths - can only start from nodes in existing paths
        const existingPathNodes = new Set(paths.flatMap(p => p.nodes));
        return [Array.from(existingPathNodes), []];
      }
    }

    const lastNodeId = activePath.nodes[activePath.nodes.length - 1];

    // After clicking a node, we need to select an edge (relation)
    // Nodes and relations alternate: node -> edge -> node -> edge...
    if (activePath.nodes.length === activePath.relations.length + 1) {
      // Just clicked a node, now need to click an edge connected to that node
      // Edges can be traversed in either direction (bidirectional)
      const connectedEdges = edges.filter(e =>
        e.source === lastNodeId || e.target === lastNodeId
      );
      const possibleEdgeIds = connectedEdges.map(e => e.id);
      return [[], possibleEdgeIds];
    }

    // If we have equal nodes and relations, we just selected an edge
    // Now we need to click the other node of the last relation (whichever end we didn't come from)
    if (activePath.nodes.length === activePath.relations.length) {
      const lastRelationId = activePath.relations[activePath.relations.length - 1];
      const lastEdge = edges.find(e => e.id === lastRelationId);
      if (lastEdge) {
        // Find which end of the edge to go to (the one we didn't come from)
        const previousNodeId = activePath.nodes[activePath.nodes.length - 1];
        const nextNodeId = lastEdge.source === previousNodeId ? lastEdge.target : lastEdge.source;
        return [[nextNodeId], []];
      }
    }

    return [[], []];
  }, [activePath, nodes, edges, paths]);

  // Automatically clean up orphaned WHERE clauses and return columns when paths change
  React.useEffect(() => {
    if (paths.length === 0) return;

    const validNodeIds = new Set<string>();
    paths.forEach((path) => {
      path.nodes.forEach((nodeId) => validNodeIds.add(nodeId));
    });

    // Filter WHERE clauses
    setWhereClauses((prev) => {
      const filtered = prev.filter((wc) => validNodeIds.has(wc.nodeId));
      // Only update if something changed to avoid infinite loops
      if (filtered.length !== prev.length) {
        return filtered;
      }
      return prev;
    });

    // Filter return columns
    setReturnColumns((prev) => {
      const filtered = prev.filter((col) => validNodeIds.has(col.nodeId));
      // Only update if something changed to avoid infinite loops
      if (filtered.length !== prev.length) {
        return filtered;
      }
      return prev;
    });
  }, [paths]);

  React.useEffect(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
      setNodes(ontologyToNodes(graph));
      setEdges(ontologyToEdges(graph));
    }
  }, [reactFlowInstance, hashGraph(graph)]);




  const layout = (layout: { [key: string]: string }) => {
    const elk = new ELK();
    const the_nodes = nodes;

    const graph = {
      id: "root",
      layoutOptions: layout,
      children: the_nodes.map((node) => ({
        id: node.id,
        x: node.position.x,
        y: node.position.y,
        width: node.width,
        height: node.height,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };

    elk.layout(graph).then(({ children }) => {
      // By mutating the children in-place we saves ourselves from creating a
      // needless copy of the nodes array.
      if (!children) {
        return;
      }

      const newNodes = children.map((node) => {
        const child = the_nodes.find((n) => n.id === node.id);
        return { ...child, position: { x: node.x, y: node.y } };
      });

      setNodes(newNodes);
    });
  };

  const nodelayout = (layout: { [key: string]: string }, root: string) => {
    const elk = new ELK();
    const the_nodes = nodes;

    // Filter out self-referencing edges and duplicate edges to prevent cycles
    const filteredEdges = edges.filter((edge, index, arr) => {
      // Remove self-referencing edges
      if (edge.source === edge.target) {
        return false;
      }

      // Remove duplicate edges (same source and target)
      const firstIndex = arr.findIndex(
        (e) => e.source === edge.source && e.target === edge.target,
      );
      return index === firstIndex;
    });

    const graph = {
      id: "root",
      layoutOptions: {
        ...layout,
        "elk.radial.rootNode": root, // Specify the root node for radial layout
      },
      children: the_nodes.map((node) => ({
        id: node.id,
        x: node.position.x,
        y: node.position.y,
        width: node.width,
        height: node.height,
      })),
      edges: filteredEdges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };

    elk
      .layout(graph)
      .then(({ children }) => {
        // By mutating the children in-place we saves ourselves from creating a
        // needless copy of the nodes array.
        if (!children) {
          return;
        }

        const newNodes = children.map((node) => {
          const child = the_nodes.find((n) => n.id === node.id);
          return { ...child, position: { x: node.x, y: node.y } };
        });

        setNodes(newNodes);
      })
      .catch((error) => {
        console.error("ELK Layout failed:", error);
        console.error(
          "This might be due to circular dependencies or self-referencing nodes",
        );
        // Fallback: Just arrange nodes in a simple circle manually
        const centerX = 400;
        const centerY = 300;
        const radius = 200;
        const angleStep = (2 * Math.PI) / the_nodes.length;

        const fallbackNodes = the_nodes.map((node, index) => {
          const angle = index * angleStep;
          return {
            ...node,
            position: {
              x: centerX + radius * Math.cos(angle),
              y: centerY + radius * Math.sin(angle),
            },
          };
        });

        setNodes(fallbackNodes);
      });
  };


  const onNodeClick = (_event: React.MouseEvent, node: MyNode) => {
    // Only allow clicking nodes that are in the possibleNodes list
    if (!possibleNodes.includes(node.id)) {
      return;
    }

    // If no active path, start a new one
    if (!activePath) {
      const color = PATH_COLORS[nextColorIndex % PATH_COLORS.length];
      setActivePath({
        nodes: [node.id],
        relations: [],
        optional: false,
        title: `Path ${paths.length + 1}`,
        color,
      });
      return;
    }

    // Add the node to the active path
    const newPath = {
      ...activePath,
      nodes: [...activePath.nodes, node.id],
    };
    setActivePath(newPath);
  };

  const onEdgeClick = (_event: React.MouseEvent, edge: MyEdge) => {
    // Only allow clicking edges that are in the possibleEdges list
    if (!possibleEdges.includes(edge.id)) {
      return;
    }

    if (!activePath) return;

    // Determine if the edge is being traversed in forward or reverse direction
    const lastNodeId = activePath.nodes[activePath.nodes.length - 1];
    const isForward = edge.source === lastNodeId;

    // Add the edge/relation to the path with its direction
    const newPath = {
      ...activePath,
      relations: [...activePath.relations, edge.id],
      relationDirections: [...(activePath.relationDirections || []), isForward],
    };
    setActivePath(newPath);
  };

  const finishPath = () => {
    if (activePath && activePath.nodes.length > 0) {
      setPaths([...paths, activePath]);
      setNextColorIndex(nextColorIndex + 1);
      setActivePath(null);
    }
  };

  const startNewPath = () => {
    if (activePath) {
      // Finish current path first
      finishPath();
    } else {
      // Just reset to allow starting a new path
      setActivePath(null);
    }
  };

  const clearAllPaths = () => {
    setPaths([]);
    setActivePath(null);
    setNextColorIndex(0);
    setExecutedGraphQuery(null);
    setReturnColumns([]);
    setWhereClauses([]);
  };

  // Delete a specific path
  const deletePath = (pathIndex: number) => {
    const updatedPaths = paths.filter((_, index) => index !== pathIndex);
    setPaths(updatedPaths);

    // Clean up WHERE clauses and return columns that reference deleted nodes
    cleanupOrphanedReferences(updatedPaths);
  };

  // Clean up WHERE clauses and return columns for nodes not in any path
  const cleanupOrphanedReferences = (currentPaths: Path[]) => {
    // Get all node IDs that exist in current paths
    const validNodeIds = new Set<string>();
    currentPaths.forEach((path) => {
      path.nodes.forEach((nodeId) => validNodeIds.add(nodeId));
    });

    // Filter WHERE clauses to only keep those referencing valid nodes
    setWhereClauses((prev) =>
      prev.filter((wc) => validNodeIds.has(wc.nodeId))
    );

    // Filter return columns to only keep those referencing valid nodes
    setReturnColumns((prev) =>
      prev.filter((col) => validNodeIds.has(col.nodeId))
    );
  };

  // Run the query
  const runQuery = async () => {
    if (!graphQueryInput) return;

    setIsRunning(true);
    try {
      const result = await createGraphQuery({
        variables: {
          input: graphQueryInput
        }
      });

      if (result.data?.createGraphQuery) {
        setExecutedGraphQuery(result.data.createGraphQuery);
      }
    } catch (error) {
      console.error("Failed to run query:", error);
    } finally {
      setIsRunning(false);
    }
  };

  // Toggle WHERE clause editor for a specific node in a path
  const toggleWhereEditor = (pathIndex: number, nodeId: string) => {
    if (editingWhereNode?.pathIndex === pathIndex && editingWhereNode?.nodeId === nodeId) {
      setEditingWhereNode(null);
    } else {
      setEditingWhereNode({ pathIndex, nodeId });
    }
  };

  // Save WHERE conditions for a node
  const saveWhereConditions = (pathIndex: number, nodeId: string, conditions: WhereCondition[]) => {
    const updatedPaths = [...paths];
    const path = updatedPaths[pathIndex];

    if (!path) return;

    // Initialize whereClauses if not present
    if (!path.whereClauses) {
      path.whereClauses = [];
    }

    // Remove existing WHERE clause for this node
    path.whereClauses = path.whereClauses.filter((wc) => wc.nodeId !== nodeId);

    // Add new WHERE clause if there are conditions
    if (conditions.length > 0) {
      path.whereClauses.push({ nodeId, conditions });
    }

    setPaths(updatedPaths);
    setEditingWhereNode(null); // Close inline editor
  };

  // Generate Cypher query from all completed paths
  const cypherQuery = useMemo(() => {
    if (paths.length === 0) {
      return "// No paths defined yet\n// Click nodes and relationships to build a path";
    }

    const enrichedPaths = paths.map((path) => enrichPath(path, nodes, edges));
    return generateUnifiedCypherQueryWithColumns(enrichedPaths, nodes, returnColumns, whereClauses);
  }, [paths, nodes, edges, returnColumns, whereClauses]);

  // Generate GraphQueryInput
  const graphQueryInput = useMemo(() => {
    if (paths.length === 0) return null;

    const enrichedPaths = paths.map((path) => enrichPath(path, nodes, edges));
    return generateGraphQueryInput(
      enrichedPaths,
      nodes,
      returnColumns,
      graph.id,
      "Query Builder Result",
      "Generated from Query Builder",
      whereClauses
    );
  }, [paths, nodes, edges, returnColumns, graph.id, whereClauses]);

  // WHERE clause management functions
  const setWhereClause = (nodeId: string, conditions: WhereCondition[]) => {
    setWhereClauses(prev => {
      const filtered = prev.filter(wc => wc.nodeId !== nodeId);
      if (conditions.length > 0) {
        return [...filtered, { nodeId, conditions }];
      }
      return filtered;
    });
  };

  const getWhereClause = (nodeId: string): NodeWhereClause | undefined => {
    return whereClauses.find(wc => wc.nodeId === nodeId);
  };

  // Return column management functions
  const addReturnColumn = (column: ReturnColumn) => {
    setReturnColumns(prev => {
      // Check if column already exists
      const exists = prev.some(
        c => c.nodeId === column.nodeId && c.property === column.property
      );
      if (exists) return prev;
      return [...prev, column];
    });
  };

  const removeReturnColumn = (nodeId: string, property: string) => {
    setReturnColumns(prev =>
      prev.filter(c => !(c.nodeId === nodeId && c.property === property))
    );
  };

  const getNodeReturnColumns = (nodeId: string): ReturnColumn[] => {
    return returnColumns.filter(c => c.nodeId === nodeId);
  };

  // Combine all paths (completed + active)
  const allPaths = activePath ? [...paths, activePath] : paths;

  return (
    <OntologyGraphProvider
      graph={graph}
      markedPaths={allPaths}
      possibleNodes={possibleNodes}
      possibleEdges={possibleEdges}
      addStagingEdge={() => { }}
      addStagingNode={() => { }}
      whereClauses={whereClauses}
      setWhereClause={setWhereClause}
      getWhereClause={getWhereClause}
      returnColumns={returnColumns}
      addReturnColumn={addReturnColumn}
      removeReturnColumn={removeReturnColumn}
      getNodeReturnColumns={getNodeReturnColumns}
    >
      <div
        ref={reactFlowWrapper}
        style={{ width: "100%", height: "100%" }}
        className="relative"
      >
        <ReactFlow<MyNode, MyEdge>
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={BUILDER_NODE_TYPES}
          edgeTypes={BUILDER_EDGE_TYPES}
          onInit={(r) => setReactFlowInstance(r)}
          fitView
          proOptions={{ hideAttribution: true }}
        />
        <div className="absolute top-0 left-0 p-3 gap-2 flex flex-row">
          <Button onClick={() => layout(stressLayout)} variant={"outline"}>
            Stress
          </Button>
          <Button onClick={() => layout(forceLayout)} variant={"outline"}>
            Force
          </Button>
          <Button onClick={() => layout(discoLayout)} variant={"outline"}>
            Disco
          </Button>
          <Button onClick={() => layout(treeLayout)} variant={"outline"}>
            Tree
          </Button>
          <Button onClick={() => layout(layeredLayout)} variant={"outline"}>
            Layered
          </Button>
          <Button
            onClick={() => {
              const rootNode = nodes.at(0)?.id;
              if (rootNode) {
                nodelayout(radialLayout, rootNode);
              }
            }}
            variant={"outline"}
          >
            Circle
          </Button>

          <KraphGraph.DetailLink
            object={graph.id}
            subroute={"reagentcategories"}
            className="text-sm"
          >
            Reagent Categories
          </KraphGraph.DetailLink>
        </div>
        <div className="absolute top-0 right-0 p-3 gap-2 flex flex-col items-end max-w-lg">
          <div className="flex flex-row gap-2">
            {activePath && (
              <Button onClick={finishPath} variant={"default"}>
                Finish Path
              </Button>
            )}
            {paths.length > 0 && (
              <Button onClick={clearAllPaths} variant={"destructive"}>
                Clear All
              </Button>
            )}
          </div>

          {/* Display Return Columns */}
          {returnColumns.length > 0 && (
            <div className="bg-background/90 p-3 rounded border flex flex-col gap-2 w-full">
              <div className="font-semibold text-sm">Return Columns</div>
              <div className="flex flex-col gap-1">
                {returnColumns.map((col, index) => {
                  const node = nodes.find((n) => n.id === col.nodeId);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const nodeLabel = node ? ((node.data as any)?.ageName || (node.data as any)?.label || (node.data as any)?.identifier || col.nodeId) : col.nodeId;
                  return (
                    <div key={index} className="text-xs text-muted-foreground">
                      {col.alias || `${nodeLabel}.${col.property}`}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Display Cypher Query */}
          {paths.length > 0 && (
            <CypherQueryDisplay query={cypherQuery} />
          )}


          {/* Display Query Results */}
          {executedGraphQuery && (
            <div className="bg-background/90 p-3 rounded border flex flex-col gap-2 w-full border-green-500">
              <div className="font-semibold text-sm text-green-600">Query Results</div>
              <div className="w-full h-96 overflow-auto">
                <SelectiveGraphQueryRenderer
                  graphQuery={executedGraphQuery}
                  options={{ minimal: true }}
                />
              </div>
            </div>
          )}

          {/* Display all completed paths */}
          {paths.map((path, pathIndex) => {
            const pathWhereClauses = path.whereClauses || [];

            return (
              <div key={pathIndex} className="bg-background/90 p-3 rounded border flex flex-col gap-2 w-full" style={{ borderColor: path.color }}>
                <div className="font-semibold flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: path.color }}></div>
                    {path.title || `Path ${pathIndex + 1}`}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={() => deletePath(pathIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {path.nodes.length} node{path.nodes.length !== 1 ? 's' : ''}, {path.relations.length} relation{path.relations.length !== 1 ? 's' : ''}
                </div>

                {/* Display nodes with WHERE buttons */}
                <div className="flex flex-col gap-1 mt-2">
                  {path.nodes.map((nodeId) => {
                    const node = nodes.find((n) => n.id === nodeId);
                    if (!node) return null;

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const nodeData = node.data as any;
                    const nodeLabel = nodeData?.ageName || nodeData?.label || nodeData?.identifier || nodeId;
                    const nodeWhereClause = pathWhereClauses.find((wc) => wc.nodeId === nodeId);
                    const hasFilters = nodeWhereClause && nodeWhereClause.conditions.length > 0;

                    const isEditing = editingWhereNode?.pathIndex === pathIndex && editingWhereNode?.nodeId === nodeId;

                    return (
                      <div key={nodeId} className="space-y-2">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="flex-1 truncate">{nodeLabel}</span>
                          <Button
                            size="sm"
                            variant={hasFilters ? "default" : "outline"}
                            className="h-6 px-2 text-xs"
                            onClick={() => toggleWhereEditor(pathIndex, nodeId)}
                          >
                            <Filter className="h-3 w-3 mr-1" />
                            {hasFilters ? `${nodeWhereClause.conditions.length}` : "WHERE"}
                          </Button>
                        </div>

                        {/* Inline WHERE clause editor */}
                        {isEditing && (
                          <InlineWhereEditor
                            nodeId={nodeId}
                            nodeLabel={nodeLabel}
                            initialConditions={nodeWhereClause?.conditions || []}
                            onSave={(conditions) => saveWhereConditions(pathIndex, nodeId, conditions)}
                            onCancel={() => setEditingWhereNode(null)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Action buttons */}
          {paths.length > 0 && (
            <div className="flex flex-row gap-2 w-full">
              <Button
                onClick={() => setReturnBuilderOpen(true)}
                variant={"outline"}
                className="flex-1"
              >
                Add Return ({returnColumns.length})
              </Button>
              <Button
                onClick={runQuery}
                variant={"default"}
                className="flex-1"
                disabled={isRunning || !graphQueryInput}
              >
                {isRunning ? "Running..." : "Run Query"}
              </Button>
            </div>
          )}

          {/* Display active path */}
          {activePath && activePath.nodes.length > 0 && (
            <div className="bg-background/90 p-3 rounded border flex flex-col gap-2 w-full" style={{ borderColor: activePath.color }}>
              <div className="font-semibold flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activePath.color }}></div>
                {activePath.title || 'Current Path'} (Building...)
              </div>
              <div className="text-sm">
                {activePath.nodes.length} node{activePath.nodes.length !== 1 ? 's' : ''}, {activePath.relations.length} relation{activePath.relations.length !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-muted-foreground">
                {activePath.nodes.length === activePath.relations.length + 1
                  ? "Click on a highlighted relation to continue"
                  : activePath.nodes.length === activePath.relations.length
                    ? "Click on the highlighted node to continue"
                    : "Click on a node to start the path"}
              </div>
            </div>
          )}

          {/* Instructions when no active path */}
          {!activePath && (
            <div className="bg-background/90 p-3 rounded border flex flex-col gap-2 w-full">
              <div className="font-semibold">Start New Path</div>
              <div className="text-xs text-muted-foreground">
                {paths.length === 0
                  ? "Click any node to start your first path"
                  : "Click a node from an existing path to start a new path"}
              </div>
            </div>
          )}
        </div>
      </div>



      {/* Return Column Builder Dialog */}
      {returnBuilderOpen && (() => {
        // Get all unique nodes from all paths
        const allNodeIds = new Set<string>();
        paths.forEach((path) => {
          path.nodes.forEach((nodeId) => allNodeIds.add(nodeId));
        });
        const availableNodes = nodes.filter((n) => allNodeIds.has(n.id));

        return (
          <ReturnColumnBuilder
            nodes={availableNodes}
            existingColumns={returnColumns}
            isOpen={returnBuilderOpen}
            onClose={() => setReturnBuilderOpen(false)}
            onSave={(columns) => {
              setReturnColumns(columns);
              setReturnBuilderOpen(false);
            }}
          />
        );
      })()}
    </OntologyGraphProvider>
  );
};

export default QueryBuilderGraph; // --- IGNORE ---
