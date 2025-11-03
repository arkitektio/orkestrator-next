import { MyEdge, MyNode } from "./types";
import { Path, WhereCondition, ReturnColumn, NodeWhereClause } from "./OntologyGraphProvider";
import { ColumnInput, ColumnKind, MetricKind, ViewKind, GraphQueryInput } from "@/kraph/api/graphql";

export interface EnrichedPath {
  path: Path;
  nodeDetails: MyNode[];
  edgeDetails: MyEdge[];
}

export interface NodeMapping {
  nodeId: string;
  variable: string;
  type: string;
  label: string;
  name: string;
  pathIndices: number[]; // Which paths use this node
  positionInPath?: number; // Position of this occurrence in the path
}

/**
 * Enriches a path with full node and edge data
 */
export function enrichPath(
  path: Path,
  allNodes: MyNode[],
  allEdges: MyEdge[]
): EnrichedPath {
  const nodeDetails = path.nodes
    .map((nodeId) => allNodes.find((n) => n.id === nodeId))
    .filter((n): n is MyNode => n !== undefined);

  const edgeDetails = path.relations
    .map((edgeId) => allEdges.find((e) => e.id === edgeId))
    .filter((e): e is MyEdge => e !== undefined);

  return {
    path,
    nodeDetails,
    edgeDetails,
  };
}

/**
 * Generates a variable name for a relationship in Cypher
 */
function getRelationshipVariable(index: number, relationType: string): string {
  // Create friendly variable names like: rel0, measurement1, relation2
  const baseType = relationType.toLowerCase();
  return `${baseType}${index}`;
}

/**
 * Generates a Cypher label from node type
 */
function getNodeLabel(node: MyNode): string {
  return node.data.ageName
}

/**
 * Generates a Cypher relationship type from edge type
 */
function getRelationshipType(edge: MyEdge): string {
  switch (edge.type) {
    case "measurement":
      return edge.data?.ageName || "MEASURED_BY";
    case "relation":
      return edge.data?.ageName || "RELATED_TO";
    case "structure_relation":
      return "STRUCTURE_RELATION";
    case "reagentrole":
      return "PARTICIPATES";
    case "entityrole":
      return "PARTICIPATES";
    case "describe":
      return "DESCRIBES";
    default:
      return edge.data?.ageName || "CONNECTED_TO";
  }
}

/**
 * Builds a unified node mapping across all paths
 * Each occurrence of a node (even if same nodeId) gets its own unique variable
 *
 * This handles cases where the same node appears multiple times in a path:
 * Example: Entity1 -> Structure1 -> Entity1
 * - First Entity1 occurrence: entity0
 * - Second Entity1 occurrence: entity1
 * - Generated Cypher: MATCH (entity0:Entity)-[rel:STRUCTURE]->(entity1:Entity)
 *
 * The key is a composite of pathIndex:nodeId:positionInPath to ensure uniqueness
 */
function buildNodeMapping(
  enrichedPaths: EnrichedPath[],
  allNodes: MyNode[]
): Map<string, NodeMapping> {
  const nodeMap = new Map<string, NodeMapping>();
  const nodeTypeCounters = new Map<string, number>();

  enrichedPaths.forEach((ep, pathIndex) => {
    ep.path.nodes.forEach((nodeId, positionInPath) => {
      // Create a unique key for this occurrence: pathIndex + nodeId + position
      const occurrenceKey = `${pathIndex}:${nodeId}:${positionInPath}`;

      if (!nodeMap.has(occurrenceKey)) {
        const node = allNodes.find((n) => n.id === nodeId);
        if (node) {
          const nodeType = node.type || "node";
          const baseType = nodeType.toLowerCase().replace("category", "");

          // Check if this is the first node and the path starts from another path
          // If so, reuse the variable from the source path
          let variable: string;
          if (positionInPath === 0 &&
              ep.path.startsFromPath !== undefined &&
              ep.path.startsFromNodePosition !== undefined) {
            // Reuse the variable from the source path node
            const sourceKey = `${ep.path.startsFromPath}:${nodeId}:${ep.path.startsFromNodePosition}`;
            const sourceMapping = nodeMap.get(sourceKey);
            if (sourceMapping) {
              variable = sourceMapping.variable;
            } else {
              // Fallback: create new variable if source not found
              const currentCount = nodeTypeCounters.get(baseType) || 0;
              nodeTypeCounters.set(baseType, currentCount + 1);
              variable = `${baseType}${currentCount}`;
            }
          } else {
            // Get next index for this node type
            const currentCount = nodeTypeCounters.get(baseType) || 0;
            nodeTypeCounters.set(baseType, currentCount + 1);
            variable = `${baseType}${currentCount}`;
          }

          const nodeLabel = getNodeLabel(node);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const nodeName = (node.data as any).ageName || (node.data as any).label || (node.data as any).identifier || node.id;

          nodeMap.set(occurrenceKey, {
            nodeId,
            variable,
            type: nodeType,
            label: nodeLabel,
            name: nodeName,
            pathIndices: [pathIndex],
            positionInPath,
          });
        }
      }
    });
  });

  return nodeMap;
}

/**
 * Formats a WHERE condition value for Cypher
 */
function formatWhereValue(value: string | number | boolean | string[]): string {
  if (typeof value === "string") {
    return `"${value}"`;
  } else if (Array.isArray(value)) {
    return `[${value.map((v) => `"${v}"`).join(", ")}]`;
  }
  return String(value);
}

/**
 * Generates WHERE clause conditions for a node
 */
function generateWhereConditions(
  variable: string,
  conditions: WhereCondition[]
): string[] {
  return conditions.map((cond) => {
    const { property, operator, value } = cond;
    const formattedValue = formatWhereValue(value);

    switch (operator) {
      case "=":
      case "!=":
      case ">":
      case "<":
      case ">=":
      case "<=":
        return `${variable}.${property} ${operator} ${formattedValue}`;
      case "CONTAINS":
        return `${variable}.${property} CONTAINS ${formattedValue}`;
      case "STARTS WITH":
        return `${variable}.${property} STARTS WITH ${formattedValue}`;
      case "ENDS WITH":
        return `${variable}.${property} ENDS WITH ${formattedValue}`;
      case "IN":
        return `${variable}.${property} IN ${formattedValue}`;
      default:
        return `${variable}.${property} = ${formattedValue}`;
    }
  });
}

/**
 * Generates MATCH clause for a single path with relationship direction support
 */
function generateUnifiedPathMatchClause(
  enrichedPath: EnrichedPath,
  nodeMap: Map<string, NodeMapping>,
  relCounterStart: number,
  pathIndex: number
): { matchClause: string; relCount: number } {
  const { edgeDetails, path } = enrichedPath;

  if (path.nodes.length === 0) {
    return { matchClause: "", relCount: 0 };
  }

  const parts: string[] = [];
  let relCounter = relCounterStart;

  // Interleave nodes and relationships
  for (let i = 0; i < path.nodes.length; i++) {
    const nodeId = path.nodes[i];
    // Use occurrence-based key to get the right variable for this position
    const occurrenceKey = `${pathIndex}:${nodeId}:${i}`;
    const mapping = nodeMap.get(occurrenceKey);

    if (!mapping) continue;    // Add node pattern with variable only (no properties in MATCH)
    parts.push(`(${mapping.variable}:${mapping.label})`);

    // Add relationship pattern if there's a next node
    if (i < path.nodes.length - 1 && edgeDetails[i]) {
      const edge = edgeDetails[i];
      const relVar = getRelationshipVariable(relCounter, edge.type || "rel");
      const relType = getRelationshipType(edge);
      relCounter++;

      // Use stored direction if available, otherwise fall back to source/target comparison
      let isForward = true;
      if (path.relationDirections && path.relationDirections[i] !== undefined) {
        isForward = path.relationDirections[i];
      } else {
        // Fallback: determine direction based on source/target
        const sourceNodeId = path.nodes[i];
        const targetNodeId = path.nodes[i + 1];
        isForward = edge.source === sourceNodeId && edge.target === targetNodeId;
      }

      if (isForward) {
        parts.push(`-[${relVar}:${relType}]->`);
      } else {
        parts.push(`<-[${relVar}:${relType}]-`);
      }
    }
  }

  const matchClause = path.optional
    ? `OPTIONAL MATCH ${parts.join("")}`
    : `MATCH ${parts.join("")}`;

  return { matchClause, relCount: relCounter };
}

/**
 * Generates a unified Cypher query from multiple paths with WHERE clauses
 */
export function generateUnifiedCypherQuery(
  enrichedPaths: EnrichedPath[],
  allNodes: MyNode[]
): string {
  if (enrichedPaths.length === 0) {
    return "// No paths defined yet\n// Click nodes and relationships to build a path";
  }

  const lines: string[] = [];

  // Build unified node mapping
  const nodeMap = buildNodeMapping(enrichedPaths, allNodes);

  // Generate MATCH clauses
  let relCounter = 0;
  enrichedPaths.forEach((ep, pathIndex) => {
    if (pathIndex > 0) lines.push("");
    lines.push(`// Path ${pathIndex + 1}: ${ep.path.title || `Path ${pathIndex + 1}`}`);

    const { matchClause, relCount } = generateUnifiedPathMatchClause(
      ep,
      nodeMap,
      relCounter,
      pathIndex
    );
    relCounter = relCount;

    if (matchClause) {
      lines.push(matchClause);
    }
  });

  // Generate WHERE clauses
  const allWhereConditions: string[] = [];

  // Collect WHERE conditions from all paths
  enrichedPaths.forEach((ep) => {
    if (ep.path.whereClauses && ep.path.whereClauses.length > 0) {
      ep.path.whereClauses.forEach((whereClause) => {
        const mapping = nodeMap.get(whereClause.nodeId);
        if (mapping && whereClause.conditions.length > 0) {
          const conditions = generateWhereConditions(
            mapping.variable,
            whereClause.conditions
          );
          allWhereConditions.push(...conditions);
        }
      });
    }
  });

  // Add WHERE clause if there are conditions
  if (allWhereConditions.length > 0) {
    lines.push("");
    lines.push("// Filter conditions");
    lines.push(`WHERE ${allWhereConditions.join(" AND ")}`);
  }

  // Generate RETURN clause
  const allNodeVars = Array.from(nodeMap.values())
    .map((mapping) => mapping.variable)
    .sort();

  lines.push("");
  lines.push("// Return all matched nodes");
  lines.push(`RETURN ${allNodeVars.join(", ")}`);

  return lines.join("\n");
}

/**
 * Generates a unified Cypher query with custom RETURN columns
 */
export function generateUnifiedCypherQueryWithColumns(
  enrichedPaths: EnrichedPath[],
  allNodes: MyNode[],
  returnColumns: ReturnColumn[],
  globalWhereClauses?: NodeWhereClause[],
  useDistinct?: boolean
): string {
  if (enrichedPaths.length === 0) {
    return "// No paths defined yet\n// Click nodes and relationships to build a path";
  }

  const lines: string[] = [];

  // Build unified node mapping
  const nodeMap = buildNodeMapping(enrichedPaths, allNodes);

  // Generate MATCH clauses
  let relCounter = 0;
  enrichedPaths.forEach((ep, pathIndex) => {
    if (pathIndex > 0) lines.push("");
    lines.push(`// Path ${pathIndex + 1}: ${ep.path.title || `Path ${pathIndex + 1}`}`);

    const { matchClause, relCount } = generateUnifiedPathMatchClause(
      ep,
      nodeMap,
      relCounter,
      pathIndex
    );
    relCounter = relCount;

    if (matchClause) {
      lines.push(matchClause);
    }
  });

  // Generate WHERE clauses
  const allWhereConditions: string[] = [];

  // Use global WHERE clauses if provided, otherwise use path-specific ones
  if (globalWhereClauses && globalWhereClauses.length > 0) {
    globalWhereClauses.forEach((whereClause) => {
      // Find all occurrences of this nodeId in the node map
      const matchingMappings = Array.from(nodeMap.values()).filter(
        mapping => mapping.nodeId === whereClause.nodeId
      );

      // Apply WHERE clause to all occurrences of this node
      matchingMappings.forEach(mapping => {
        if (whereClause.conditions.length > 0) {
          const conditions = generateWhereConditions(
            mapping.variable,
            whereClause.conditions
          );
          allWhereConditions.push(...conditions);
        }
      });
    });
  } else {
    // Fallback to path-specific WHERE clauses
    enrichedPaths.forEach((ep) => {
      if (ep.path.whereClauses && ep.path.whereClauses.length > 0) {
        ep.path.whereClauses.forEach((whereClause) => {
          // Find all occurrences of this nodeId in the node map
          const matchingMappings = Array.from(nodeMap.values()).filter(
            mapping => mapping.nodeId === whereClause.nodeId
          );

          // Apply WHERE clause to all occurrences of this node
          matchingMappings.forEach(mapping => {
            if (whereClause.conditions.length > 0) {
              const conditions = generateWhereConditions(
                mapping.variable,
                whereClause.conditions
              );
              allWhereConditions.push(...conditions);
            }
          });
        });
      }
    });
  }

  // Add WHERE clause if there are conditions
  if (allWhereConditions.length > 0) {
    lines.push("");
    lines.push("// Filter conditions");
    lines.push(`WHERE ${allWhereConditions.join(" AND ")}`);
  }

  // Generate RETURN clause with custom columns
  lines.push("");

  if (returnColumns.length > 0) {
    lines.push("// Return selected columns");
    const returnParts: string[] = [];

    returnColumns.forEach((col) => {
      // Find all occurrences of this nodeId in the node map
      const matchingMappings = Array.from(nodeMap.values()).filter(
        mapping => mapping.nodeId === col.nodeId
      );

      // Generate return for each occurrence
      matchingMappings.forEach((mapping, occurrenceIndex) => {
        if (col.cypherExpression) {
          // Custom Cypher expression - replace any node reference with the specific variable
          const expression = col.cypherExpression.replace(/\$node/g, mapping.variable);
          const alias = matchingMappings.length > 1
            ? `${col.alias || col.property}_${occurrenceIndex}`
            : col.alias;
          const part = alias
            ? `${expression} AS ${alias}`
            : expression;
          returnParts.push(part);
        } else {
          // Node property
          const alias = matchingMappings.length > 1
            ? `${col.alias || col.property}_${occurrenceIndex}`
            : col.alias;
          const part = alias
            ? `${mapping.variable}.${col.property} AS ${alias}`
            : `${mapping.variable}.${col.property}`;
          returnParts.push(part);
        }
      });
    });

    const distinctKeyword = useDistinct !== false ? "DISTINCT " : "";
    lines.push(`RETURN ${distinctKeyword}${returnParts.join(", ")}`);
  } else {
    // Default: return all nodes
    lines.push("// Return all matched nodes");
    const allNodeVars = Array.from(nodeMap.values())
      .map((mapping) => mapping.variable)
      .sort();
    lines.push(`RETURN ${allNodeVars.join(", ")}`);
  }

  return lines.join("\n");
}

/**
 * Generates a GraphQueryInput for creating/updating a graph query
 */
export function generateGraphQueryInput(
  enrichedPaths: EnrichedPath[],
  allNodes: MyNode[],
  returnColumns: ReturnColumn[],
  graphId: string,
  name: string,
  description?: string,
  globalWhereClauses?: NodeWhereClause[]
): GraphQueryInput {
  // Generate the Cypher query
  const query = generateUnifiedCypherQueryWithColumns(
    enrichedPaths,
    allNodes,
    returnColumns,
    globalWhereClauses
  );

  // Build node mapping for column generation
  const nodeMap = buildNodeMapping(enrichedPaths, allNodes);

  // Generate columns from return columns
  const columns: ColumnInput[] = [];

  returnColumns.forEach((col) => {
    // Find all occurrences of this nodeId
    const matchingMappings = Array.from(nodeMap.values()).filter(
      mapping => mapping.nodeId === col.nodeId
    );
    const node = allNodes.find((n) => n.id === col.nodeId);

    if (!node) {
      columns.push({
        name: col.alias || col.property,
        kind: ColumnKind.Value,
        label: col.alias || col.property,
      });
      return;
    }

    // Generate a column for each occurrence
    matchingMappings.forEach((mapping, occurrenceIndex) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nodeData = node.data as any;

      // Determine column kind based on property
      let columnKind = ColumnKind.Value;
      let valueKind: MetricKind | undefined = undefined;
      let idfor: string[] | undefined = undefined;

      if (col.property === "id") {
        columnKind = ColumnKind.Node;
        // Use idfor from column if provided, otherwise default to nodeId
        idfor = col.idfor || [col.nodeId];
      } else if (col.property === "metricKind") {
        columnKind = ColumnKind.Value;
      } else if (col.property === "label" || col.property === "identifier") {
        columnKind = ColumnKind.Value;
      }

      // Try to infer MetricKind if it's a metric node
      if (node.type === "metriccategory" && nodeData?.metricKind) {
        valueKind = nodeData.metricKind as MetricKind;
      }

      // Generate unique names when there are multiple occurrences
      const name = matchingMappings.length > 1
        ? `${col.alias || `${mapping.variable}_${col.property}`}_${occurrenceIndex}`
        : col.alias || `${mapping.variable}_${col.property}`;

      const label = matchingMappings.length > 1
        ? `${col.alias || col.property} ${occurrenceIndex + 1}`
        : col.alias || col.property;

      columns.push({
        name,
        kind: columnKind,
        label,
        description: `${col.property} from ${mapping.name} (occurrence ${occurrenceIndex + 1})`,
        valueKind,
        idfor,
        searchable: col.property === "label" || col.property === "identifier",
      });
    });
  });

  // Determine view kind based on columns
  let kind = ViewKind.Table;
  if (returnColumns.length === 0) {
    kind = ViewKind.NodeList;
  }

  return {
    graph: graphId,
    name,
    description: description || `Generated query: ${name}`,
    query,
    kind,
    columns: columns.length > 0 ? columns : undefined,
  };
}

/**
 * Legacy function for backward compatibility
 * Now calls the unified version
 */
export function generateCypherQueryWithComments(
  enrichedPaths: EnrichedPath[]
): string {
  // Extract all unique nodes from paths
  const allNodeIds = new Set<string>();
  enrichedPaths.forEach((ep) => {
    ep.nodeDetails.forEach((node) => allNodeIds.add(node.id));
  });

  const allNodes = enrichedPaths.flatMap((ep) => ep.nodeDetails);
  const uniqueNodes = Array.from(
    new Map(allNodes.map((node) => [node.id, node])).values()
  );

  return generateUnifiedCypherQuery(enrichedPaths, uniqueNodes);
}
