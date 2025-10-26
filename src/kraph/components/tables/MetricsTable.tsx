"use client";

import * as React from "react";
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
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { LokUser, RekuestAssignation } from "@/linkers";
import { JustUsername } from "@/lok-next/components/UserAvatar";
import { JustClientName } from "@/lok-next/components/ClientAvatar";

export type MetricsTableItem = {
  id: string;
  value: string;
  createdBy?: string | null;
  createdApp?: string | null;
  createdThrough?: string | null;
  category?: { label?: string | null } | null;
};

export type MetricsTableProps = {
  metrics: MetricsTableItem[];
  className?: string;
};

const columns: ColumnDef<MetricsTableItem>[] = [
  {
    id: "category",
    accessorFn: (row) => row.category?.label ?? "",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Metric
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => {
      const label = getValue() as string;
      return <div className="font-medium truncate">{label}</div>;
    },
  },
  {
    id: "value",
    accessorKey: "value",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Value
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="truncate">{row.original.value}</div>,
  },
  {
    id: "createdThrough",
    header: () => <div>Created While</div>,
    cell: ({ row }) =>
      row.original.createdThrough ? (
        <RekuestAssignation.DetailLink
          object={row.original.createdThrough}
          className="text-xs text-scroll font-light"
        >
          View 
        </RekuestAssignation.DetailLink>
      ) : (
        <div className="text-muted-foreground"></div>
      ),
    enableSorting: false,
  },
  {
    id: "createdBy",
    header: () => <div>Created By</div>,
    cell: ({ row }) =>
      row.original.createdBy ? (
        <LokUser.DetailLink object={row.original.createdBy}>
        <JustUsername sub={row.original.createdBy} />
        </LokUser.DetailLink>
      ) : (
        <div className="text-muted-foreground"></div>
      ),
    enableSorting: false,
  },
  {
    id: "createdApp",
    header: () => <div>Creating App</div>,
    cell: ({ row }) =>
      row.original.createdApp ? (
        <JustClientName clientId={row.original.createdApp} />
      ) : (
        <div className="text-muted-foreground"></div>
      ),
    enableSorting: false,
  },
];

export const MetricsTable: React.FC<MetricsTableProps> = ({ metrics, className }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: metrics ?? [],
    columns,
    state: { sorting, columnFilters, columnVisibility },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className={className ?? "w-full"}>
      <div className="w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No metrics.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
