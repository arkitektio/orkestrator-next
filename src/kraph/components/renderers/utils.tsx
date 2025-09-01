"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  ColumnFragment,
  ColumnKind,
  MetricKind,
  TableFragment,
} from "@/kraph/api/graphql";
import { KraphEntity, KraphNode } from "@/linkers";
import Timestamp from "react-timestamp";

const columnToDef = (
  column: ColumnFragment,
  table: TableFragment,
): ColumnDef<{ [key: string]: any }> => {
  if (column.kind == ColumnKind.Node) {
    return {
      id: column.name,
      accessorKey: column.name,
      header: () => (
        <div className="text-center">{column.label || column.name}</div>
      ),
      cell: ({ row, getValue }) => {
        const label = row.getValue(column.name) as string;

        const concat_id = table.graph.ageName + ":" + label;

        return (
          <KraphEntity.Smart object={concat_id}>
            <KraphEntity.DetailLink object={concat_id}>
              {label || ""}{concat_id}
            </KraphEntity.DetailLink>
          </KraphEntity.Smart>
        );
      },
      enableSorting: true,
      enableGlobalFilter: true,
    };
  }

  if (column.kind == ColumnKind.Edge) {
    return {
      id: column.name,
      accessorKey: column.name,
      header: () => (
        <div className="text-center">{column.label || column.name}</div>
      ),
      cell: ({ row, getValue }) => {
        const label = row.getValue(column.name) as string;

        return <div className="text-center font-medium">{label || ""}</div>;
      },
      enableSorting: true,
      enableGlobalFilter: true,
    };
  }

  if (column.kind == ColumnKind.Value) {
    if (column.valueKind == MetricKind.Datetime) {
      return {
        id: column.name,
        accessorKey: column.name,
        header: () => (
          <div className="text-center">{column.label || column.name}</div>
        ),
        cell: ({ row, getValue }) => {
          const label = row.getValue(column.name) as string;

          if (!label) {
            return (
              <div className="text-center font-medium">
                No Date
              </div>
            );
          }

          return (
            <div className="text-center font-medium">
              <Timestamp date={label.replaceAll('"', "")} relative />
            </div>
          );
        },
        enableSorting: true,
        enableGlobalFilter: true,
      };
    }

    return {
      id: column.name,
      accessorKey: column.name,
      header: () => (
        <div className="text-center">{column.label || column.name}</div>
      ),
      cell: ({ row, getValue }) => {
        const label = row.getValue(column.name) as string;

        return <div className="text-center font-medium">{label || ""}</div>;
      },
      enableSorting: true,
      enableGlobalFilter: true,
    };
  }

  throw new Error(`Unknown column kind: ${column.kind}`);
};

export const parseValue = (
  value: string,
  valueKind: MetricKind | null | undefined,
) => {
  if (valueKind == MetricKind.Int) {
    return parseInt(value);
  }

  if (valueKind == MetricKind.Float) {
    return parseFloat(value);
  }

  return value;
};

export const calculateColumns = (
  table: TableFragment | undefined,
): ColumnDef<{ [key: string]: any }>[] => {
  if (!table) {
    return [];
  }

  return table.columns.map((c, item) => {
    return columnToDef(c, table);
  });
};

export const calculateRows = (table: TableFragment | undefined) => {
  if (!table) {
    return [];
  }

  const rowObjects = table.rows.map((row) =>
    table.columns.reduce(
      (acc, column, index) => {
        acc[column.name] = parseValue(row[index], column.valueKind);
        return acc;
      },
      {} as Record<string, any>,
    ),
  );
  return rowObjects;
};


export const buildCypherSchemaFromGraph = (graph: GraphFragment): CypherSchema => {
  const schema: CypherSchema = { nodes: {}, relationships: {} };

  // Build the schema from the graph data
  graph.entityCategories.forEach((node) => {
    schema.nodes[node.ageName] = {
      type: node.__typename || "Unknown",
      label: node.label,
      description: node.description || "No Description",
      properties: {
        created_at: { description: "Creation timestamp" },
        category_id: { description: "ID linking to the category group" },
      },
    };
  });

  graph.structureCategories.forEach((node) => {
    schema.nodes[node.ageName] = {
      type: node.__typename || "Unknown",
      label: node.identifier,
      description: node.description || "No Description",
      properties: {
        identifier: { description: "Unique identifier" },
        object: { description: "The object being described as an ID" },
        created_at: { description: "Creation timestamp" },
        category_id: { description: "ID linking to the category group" },
      },
    };
  });

  graph.naturalEventCategories.forEach((node) => {
    schema.nodes[node.ageName] = {
      type: node.__typename || "Unknown",
      label: node.label,
      description: node.description || "No Description",
      properties: {
        created_at: { description: "Creation timestamp" },
        category_id: { description: "ID linking to the category group" },
      },
    };
  });

  graph.metricCategories.forEach((node) => {
    schema.nodes[node.ageName] = {
      type: node.__typename || "Unknown",
      label: node.label,
      description: node.description || "No Description",
      properties: {
        created_at: { description: "Creation timestamp" },
        category_id: { description: "ID linking to the category group" },
      },
    };
  });

  graph.protocolEventCategories.forEach((node) => {
    schema.nodes[node.ageName] = {
      type: node.__typename || "Unknown",
      label: node.label,
      description: node.description || "No Description",
      properties: {
        created_at: { description: "Creation timestamp" },
        category_id: { description: "ID linking to the category group" },
      },
    };
  });

  graph.relationCategories.forEach((relation) => {
    schema.relationships[relation.ageName] = {
      type: relation.__typename || "Unknown",
      label: relation.label,
      description: relation.description || "No Description",
      properties: {
        created_at: { description: "Creation timestamp" },
        category_id: { description: "ID linking to the category group" },
      },
    };
  });


  graph.structureRelationCategories.forEach((relation) => {
    schema.relationships[relation.ageName] = {
      type: relation.__typename || "Unknown",
      label: relation.label,
      description: relation.description || "No Description",
      properties: {
        created_at: { description: "Creation timestamp" },
        category_id: { description: "ID linking to the category group" },
      },
    };
  });

  graph.measurementCategories.forEach((relation) => {
    schema.relationships[relation.ageName] = {
      type: relation.__typename || "Unknown",
      label: relation.label,
      description: relation.description || "No Description",
      properties: {
        created_at: { description: "Creation timestamp" },
        category_id: { description: "ID linking to the category group" },
      },
    };
  });

  schema.relationships["DESCRIBES"] = {
    type: "Unknown",
    label: "Describes",
    description: "A description edge",
    properties: {
      hallo: { description: "A description" },
    },
  };

  return schema;
};