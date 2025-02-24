"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ColumnFragment,
  ColumnKind,
  GraphViewFragment,
  MeasurementKind,
  TableFragment,
} from "@/kraph/api/graphql";
import { useForm } from "react-hook-form";
import { KraphNode } from "@/linkers";




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


  export const parseValue = (value: string, valueKind: MeasurementKind | null | undefined) => {
    if (valueKind == MeasurementKind.Int) {
      return parseInt(value);
    }
  
    if (valueKind == MeasurementKind.Float) {
      return parseFloat(value);
    }
  
    return value;
  }

  
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