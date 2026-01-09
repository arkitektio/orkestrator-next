import { Position } from "@xyflow/react";

import {
  BaseListCategoryFragment,
  CategoryDefintion,
  GraphFragment,
  GraphNodeInput,
  ListStructureCategoryFragment,
  StructureCategoryDefinition
} from "@/kraph/api/graphql";
import { notEmpty } from "@/lib/utils";
import {
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import DescribeEdge from "./edges/DescribeEdge";
import EntityRoleEdge from "./edges/EntityRoleEdge";
import MeasurementEdge from "./edges/MeasurementEdge";
import ReagentRoleEdge from "./edges/ReagentRoleEdge";
import RelationEdge from "./edges/RelationEdge";
import StructureRelationEdge from "./edges/StructureRelationEdge";
import "./index.css";
import EntityCategoryBuilderNode from "./nodes/builder/EntityCategoryBuilderNode";
import MetricCategoryBuilderNode from "./nodes/builder/MetricCategoryBuilderNode";
import NaturalEventCategoryBuilderNode from "./nodes/builder/NaturalEventCategoryBuilderNode";
import ProtocolEventCategoryBuilderNode from "./nodes/builder/ProtocolEventCategoryBuilderNode";
import ReagentCategoryBuilderNode from "./nodes/builder/ReagentCategoryBuilderNode";
import StructureCategoryBuilderNode from "./nodes/builder/StructureCategoryBuilderNode";
import GenericCategoryNode from "./nodes/EntityCategoryNode";
import MetricCategoryNode from "./nodes/MetricCategoryNode";
import NaturalEventNode from "./nodes/NaturalEventCategoryNode";
import ProtocolEventNode from "./nodes/ProtocolEventCategoryNode";
import ReagentCategoryNode from "./nodes/ReagentCategoryNode";
import StructureCategoryNode from "./nodes/StructureCategoryNode";
import {
  MyEdge,
  MyNode
} from "./types";
import MeasurementBuilderEdge from "./edges/builder/MeasurementBuilderEdge";
import StructureRelationBuilderEdge from "./edges/builder/StructureRelationBuilderEdge";
import RelationBuilderEdge from "./edges/builder/RelationBuilderEdge";
import EntityRoleBuilderEdge from "./edges/builder/EntityRoleBuilderEdge";
import DescribeBuilderEdge from "./edges/builder/DescribeBuilderEdge";
import ReagentRoleBuilderEdge from "./edges/builder/ReagentRoleBuilderEdge";

export const ontologyToNodes = (graph: GraphFragment): MyNode[] => {
  const structureNodes = graph.structureCategories.map((cat, index) => ({
    id: cat.id,
    position: {
      x: cat.positionX || 300,
      y: cat.positionY || 300,
    },
    height: cat.height || 100,
    width: cat.width || 100,
    data: cat,
    type: "structurecategory" as const,
  }));

  const genericNodes = graph.entityCategories.map((entity, index) => ({
    id: entity.id,
    position: {
      x: entity.positionX || 300,
      y: entity.positionY || 300,
    },
    height: entity.height || 100,
    width: entity.width || 100,
    data: entity,
    type: "entitycategory" as const,
  }));

  const reagentNodes = graph.reagentCategories.map((entity, index) => ({
    id: entity.id,
    position: {
      x: entity.positionX || 300,
      y: entity.positionY || 300,
    },
    height: entity.height || 100,
    width: entity.width || 100,
    data: entity,
    type: "reagentcategory" as const,
  }));

  const protocolEventCategory = graph.protocolEventCategories.map(
    (entity, index) => ({
      id: entity.id,
      position: {
        x: entity.positionX || 300,
        y: entity.positionY || 300,
      },
      height: entity.height || 100,
      width: entity.width || 100,
      data: entity,
      type: "protocoleventcategory" as const,
    }),
  );

  const naturalEventCategory = graph.naturalEventCategories.map(
    (entity, index) => ({
      id: entity.id,
      position: {
        x: entity.positionX || 300,
        y: entity.positionY || 300,
      },
      height: entity.height || 100,
      width: entity.width || 100,
      data: entity,
      type: "naturaleventcategory" as const,
    }),
  );

  const metricNode = graph.metricCategories.map((entity, index) => ({
    id: entity.id,
    position: {
      x: entity.positionX || 300,
      y: entity.positionY || 300,
    },
    height: entity.height || 100,
    width: entity.width || 100,
    data: entity,
    type: "metriccategory" as const,
  }));

  return [
    ...structureNodes,
    ...genericNodes,
    ...protocolEventCategory,
    ...naturalEventCategory,
    ...reagentNodes,
    ...metricNode,
  ];
};

const withCategoryFilter = (category: CategoryDefintion) => {
  return (cat: BaseListCategoryFragment) => {
    if (category.tagFilters && category.tagFilters.length > 0) {
      return category.tagFilters.some((tag) =>
        cat.tags.find((t) => t.value == tag),
      );
    }
    if (category.categoryFilters && category.categoryFilters.length > 0) {
      return category.categoryFilters.some((id) => id == cat.id);
    }
    return true;
  };
};

const withStructureCategoryFilter = (category: StructureCategoryDefinition) => {
  return (cat: ListStructureCategoryFragment) => {
    if (category.tagFilters && category.tagFilters.length > 0) {
      return category.tagFilters.some((tag) =>
        cat.tags.find((t) => t.value == tag),
      );
    }
    if (category.categoryFilters && category.categoryFilters.length > 0) {
      return category.categoryFilters.some((id) => id == cat.id);
    }
    if (category.identifierFilters && category.identifierFilters.length > 0) {
      return category.identifierFilters.some(
        (identifier) => identifier == cat.identifier,
      );
    }

    return true;
  };
};

export const ontologyToEdges = (graph: GraphFragment) => {
  const edges: MyEdge[] = [];

  console.log("Relations", graph.relationCategories);

  graph.relationCategories.forEach((cat) => {
    const source_nodes = graph.entityCategories.filter(
      withCategoryFilter(cat.sourceDefinition),
    );
    const target_nodes = graph.entityCategories.filter(
      withCategoryFilter(cat.targetDefinition),
    );

    for (let i = 0; i < source_nodes.length; i++) {
      for (let j = 0; j < target_nodes.length; j++) {
        edges.push({
          id: `${cat.id}-${i}-${j}`,
          source: source_nodes[i].id,
          target: target_nodes[j].id,
          data: cat,
          type: "relation" as const,
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    }
  });

  graph.structureRelationCategories.forEach((cat) => {
    const source_nodes = graph.structureCategories.filter(
      withStructureCategoryFilter(cat.sourceDefinition),
    );

    const target_nodes = graph.structureCategories.filter(
      withStructureCategoryFilter(cat.targetDefinition),
    );

    for (let i = 0; i < source_nodes.length; i++) {
      for (let j = 0; j < target_nodes.length; j++) {
        edges.push({
          id: `${cat.id}-${i}-${j}`,
          source: source_nodes[i].id,
          target: target_nodes[j].id,
          data: cat,
          type: "structure_relation" as const,
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    }
  });

  graph.measurementCategories.forEach((cat) => {
    const source_nodes = graph.structureCategories.filter(
      withStructureCategoryFilter(cat.sourceDefinition),
    );
    const target_nodes = graph.entityCategories.filter(
      withCategoryFilter(cat.targetDefinition),
    );

    for (let i = 0; i < source_nodes.length; i++) {
      for (let j = 0; j < target_nodes.length; j++) {
        edges.push({
          id: `${cat.id}-${i}-${j}`,
          source: source_nodes[i].id,
          target: target_nodes[j].id,
          data: cat,
          type: "measurement" as const,
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    }
  });

  graph.metricCategories.forEach((cat) => {
    const source_nodes = graph.structureCategories.filter(
      (n) => n.id == cat.structureCategory.id,
    );

    for (let i = 0; i < source_nodes.length; i++) {
      for (let j = 0; j < source_nodes.length; j++) {
        edges.push({
          id: `${cat.id}-${i}-${j}`,
          target: source_nodes[i].id,
          source: cat.id,
          data: cat,
          type: "describe" as const,
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    }
  });

  graph.protocolEventCategories.forEach((cat) => {
    cat.sourceEntityRoles.filter(notEmpty).forEach((role) => {
      const source_nodes = graph.entityCategories.filter(
        withCategoryFilter(role.categoryDefinition),
      );

      for (let i = 0; i < source_nodes.length; i++) {
        edges.push({
          id: `${cat.id}-${i}-${role.role}`,
          source: source_nodes[i].id,
          target: cat.id,
          data: role,
          type: "entityrole" as const,

          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    });

    cat.targetEntityRoles.forEach((role) => {
      const targetNodes = graph.entityCategories.filter(
        withCategoryFilter(role.categoryDefinition),
      );

      for (let i = 0; i < targetNodes.length; i++) {
        edges.push({
          id: `${cat.id}-${i}-${role.role}`,
          source: cat.id,
          target: targetNodes[i].id,
          data: role,
          type: "entityrole" as const,
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    });

    cat.sourceReagentRoles.filter(notEmpty).forEach((role) => {
      const source_nodes = graph.reagentCategories.filter(
        withCategoryFilter(role.categoryDefinition),
      );

      for (let i = 0; i < source_nodes.length; i++) {
        edges.push({
          id: `${cat.id}-${i}-${role.role}`,
          source: source_nodes[i].id,
          target: cat.id,
          data: role,
          type: "reagentrole" as const,
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
    });

    cat.targetReagentRoles.forEach((role) => {
      const targetNodes = graph.reagentCategories.filter(
        withCategoryFilter(role.categoryDefinition),
      );

      for (let i = 0; i < targetNodes.length; i++) {
        edges.push({
          id: `${cat.id}-${i}-${role.role}`,
          source: cat.id,
          target: targetNodes[i].id,
          data: role,
          type: "reagentrole" as const,
        });
      }
    });
  });

  graph.naturalEventCategories.forEach((cat) => {
    cat.sourceEntityRoles.filter(notEmpty).forEach((role) => {
      const source_nodes = graph.entityCategories.filter(
        withCategoryFilter(role.categoryDefinition),
      );

      for (let i = 0; i < source_nodes.length; i++) {
        edges.push({
          id: `${cat.id}-${i}-${role.role}`,
          source: source_nodes[i].id,
          target: cat.id,
          data: role,
          type: "entityrole" as const,
        });
      }
    });

    cat.targetEntityRoles.forEach((role) => {
      const targetNodes = graph.entityCategories.filter(
        withCategoryFilter(role.categoryDefinition),
      );

      for (let i = 0; i < targetNodes.length; i++) {
        edges.push({
          id: `${cat.id}-${i}-${role.role}`,
          source: cat.id,
          target: targetNodes[i].id,
          data: role,
          type: "entityrole" as const,
        });
      }
    });
  });

  console.log("edges", edges);

  return [...edges];
};

export const NODE_TYPES = {
  structurecategory: StructureCategoryNode,
  entitycategory: GenericCategoryNode,
  naturaleventcategory: NaturalEventNode,
  protocoleventcategory: ProtocolEventNode,
  reagentcategory: ReagentCategoryNode,
  metriccategory: MetricCategoryNode,
};

export const BUILDER_NODE_TYPES = {
  structurecategory: StructureCategoryBuilderNode,
  entitycategory: EntityCategoryBuilderNode,
  naturaleventcategory: NaturalEventCategoryBuilderNode,
  protocoleventcategory: ProtocolEventCategoryBuilderNode,
  reagentcategory: ReagentCategoryBuilderNode,
  metriccategory: MetricCategoryBuilderNode,
};


export const EDGE_TYPES = {
  measurement: MeasurementEdge,
  structure_relation: StructureRelationEdge,
  relation: RelationEdge,
  entityrole: EntityRoleEdge,
  describe: DescribeEdge,
  reagentrole: ReagentRoleEdge,
};

export const BUILDER_EDGE_TYPES = {
  measurement: MeasurementBuilderEdge,
  structure_relation: StructureRelationBuilderEdge,
  relation: RelationBuilderEdge,
  entityrole: EntityRoleBuilderEdge,
  describe: DescribeBuilderEdge,
  reagentrole: ReagentRoleBuilderEdge,
};



export function calculateMidpoint(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

export const nodeToNodeInput = (node: MyNode): GraphNodeInput | null => {
  // We only update the positions of the node the rest is not needed
  return {
    id: node.id,
    positionX: node.position.x,
    positionY: node.position.y,
    height: node.height,
    width: node.width,
  };
};

export const layeredLayout = {
  "elk.algorithm": "layered",
  "elk.layered.nodePlacement.strategy": "SIMPLE",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.crossingMinimization.minimize": "LAYER_SWEEP",
  "elk.layered.spacing.nodeNode": "100",
  "elk.spacing.nodeNode": "100",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.direction": "RIGHT",
};

export const forceLayout = {
  "elk.algorithm": "force",
  "elk.force.ungroupedNodeRepulsion": "1000",
  "elk.force.groupRepulsion": "1000",
  "elk.force.nodeNodeRepulsion": "1000",
  "elk.layered.spacing.nodeNode": "100",
  "elk.spacing.nodeNode": "100",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.direction": "RIGHT",
};

export const discoLayout = {
  "elk.algorithm": "disco",
  "elk.drawing.strategy": "POLYLINE",
  "elk.spacing.nodeNode": "100",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.layered.spacing.nodeNode": "100",
  "elk.direction": "RIGHT",
  "elk.layered.nodePlacement.strategy": "SIMPLE",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
};

export const treeLayout = {
  "elk.algorithm": "mrtree",
  "elk.layered.nodePlacement.strategy": "SIMPLE",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.crossingMinimization.minimize": "LAYER_SWEEP",
  "elk.layered.spacing.nodeNode": "100",
  "elk.spacing.nodeNode": "100",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.direction": "RIGHT",
  "elk.layered.nodePlacement.bk.fixedAlignment": "LEFT",
};

export const stressLayout = {
  "elk.algorithm": "stress",
  "org.eclipse.elk.stress.desiredEdgeLength": "200",
  "org.eclipse.elk.stress.dimension": "XY",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.crossingMinimization.minimize": "LAYER_SWEEP",
  "elk.layered.spacing.nodeNode": "200",
  "elk.spacing.nodeNode": "200",
  "elk.layered.spacing.nodeNodeBetweenLayers": "200",
  "elk.direction": "RIGHT",
  "elk.layered.nodePlacement.bk.fixedAlignment": "LEFT",
};

export const radialLayout = {
  "elk.algorithm": "radial",
  "elk.radial.radius": "200",
  "elk.radial.compactionStrategy": "NONE",
  "elk.radial.wedgeToLength": "32",
  "elk.spacing.nodeNode": "50",
  "elk.direction": "RIGHT",
};

export const hashGraph = (graph: GraphFragment) => {
  return JSON.stringify(graph);
};

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode, targetNode) {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const { width: intersectionNodeWidth, height: intersectionNodeHeight } =
    intersectionNode.measured;
  const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
  const targetPosition = targetNode.internals.positionAbsolute;

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + targetNode.measured.width / 2;
  const y1 = targetPosition.y + targetNode.measured.height / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1);
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node, intersectionPoint) {
  const n = { ...node.internals.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.measured.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.measured.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source, target) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}


export const identifierToNodeAgeName = (identifier: string) => {
  return identifier.replace("@", "").replace("/", "_").toUpperCase();
}

export const labelToNodeAgeName = (label: string) => {
  return label.replace(" ", "_").toUpperCase();
}


export const labelToEdgeAgeName = (label: string) => {
  return label.replace(" ", "_").toLowerCase();
}
