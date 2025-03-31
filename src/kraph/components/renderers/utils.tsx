"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  ColumnFragment,
  ColumnKind,
  MetricKind,
  TableFragment,
} from "@/kraph/api/graphql";
import { KraphNode } from "@/linkers";
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
          <KraphNode.DetailLink object={concat_id}>
            {label || ""}
          </KraphNode.DetailLink>
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
