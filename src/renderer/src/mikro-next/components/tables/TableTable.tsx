"use client";

import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import {
  type ImageAccessorFragment,
  type LabelAccessorFragment,
  type TableFragment,
} from "@/mikro-next/api/graphql";
import { TooltipContent } from "@radix-ui/react-tooltip";

import { useDuckDbTable } from "./useDuckDbTable";

type Item = Record<string, unknown> & {
  id?: string;
};

type ValueAccessorProps<T> = {
  accessor: T;
  value?: unknown;
};

const formatCellValue = (value: unknown) => {
  if (value == null) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const LabelAccessor = ({
  accessor,
  value,
}: ValueAccessorProps<LabelAccessorFragment>) => {
  return (
    <div>
      <div className="text-sm font-semibold">{accessor.__typename}</div>
      <div className="text-xs text-muted-foreground">{formatCellValue(value)}</div>
    </div>
  );
};

const ImageAccessor = ({
  accessor,
  value,
}: ValueAccessorProps<ImageAccessorFragment>) => {
  return (
    <div>
      <div className="text-sm font-semibold">{accessor.__typename}</div>
      <div className="text-xs text-muted-foreground">{formatCellValue(value)}</div>
    </div>
  );
};

const AccessorDisplay = (props: {
  accessor: TableFragment["accessors"][0];
  value?: unknown;
}) => {
  if (props.accessor.__typename === "LabelAccessor") {
    return <LabelAccessor accessor={props.accessor} value={props.value} />;
  }

  if (props.accessor.__typename === "ImageAccessor") {
    return <ImageAccessor accessor={props.accessor} value={props.value} />;
  }

  return (
    <div>
      <div className="text-sm font-semibold">{props.accessor.__typename}</div>
      <div className="text-xs text-muted-foreground">
        {formatCellValue(props.value)}
      </div>
    </div>
  );
};

const DelegatingAccessorDisplay = (props: {
  accessors: TableFragment["accessors"];
  value: unknown;
}) => {
  return (
    <div className="flex flex-row gap-2">
      {props.accessors.map((accessor) => (
        <AccessorDisplay
          key={accessor.id}
          accessor={accessor}
          value={props.value}
        />
      ))}
    </div>
  );
};

const selectionColumn: ColumnDef<Item> = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      className="ring-0 border-gray-500 bg-background"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      className="ring-0 border-gray-500 bg-background"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};

const actionColumns: ColumnDef<Item>[] = [
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const selectedRowId =
        typeof row.original.id === "string" ? row.original.id : undefined;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={!selectedRowId}
              onClick={() => {
                if (selectedRowId) {
                  navigator.clipboard.writeText(selectedRowId);
                }
              }}
            >
              Copy row ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>View row details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const calculateColumns = (table: TableFragment): ColumnDef<Item>[] => {
  const calculatedColumns: ColumnDef<Item>[] = [selectionColumn];

  table.columns.forEach((column) => {
    calculatedColumns.push({
      id: column.name,
      accessorKey: column.name,
      header: ({ column: headerColumn }) => {
        return (
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={() =>
                  headerColumn.toggleSorting(
                    headerColumn.getIsSorted() === "asc",
                  )
                }
                variant="ghost"
              >
                {column.name}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              {column.accessors.map((accessor) => (
                <div key={accessor.keys.join("")}>{accessor.__typename}</div>
              ))}
            </TooltipContent>
          </Tooltip>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="mx-auto text-center">
            {column.accessors.length === 0 ? (
              <div>{formatCellValue(row.getValue(column.name))}</div>
            ) : (
              <DelegatingAccessorDisplay
                accessors={column.accessors}
                value={row.getValue(column.name)}
              />
            )}
          </div>
        );
      },
    });
  });

  return calculatedColumns.concat(actionColumns);
};

export const TableTable = (props: { table: TableFragment }) => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [search, setSearch] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo(() => calculateColumns(props.table), [props.table]);
  const { rows, totalRowCount, loading, error } = useDuckDbTable({
    table: props.table,
    pagination,
    sorting,
    search,
  });

  React.useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }, [props.table.id, search]);

  const pageCount = Math.max(1, Math.ceil(totalRowCount / pagination.pageSize));
  const pageStart = totalRowCount === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const pageEnd = Math.min(
    totalRowCount,
    (pagination.pageIndex + 1) * pagination.pageSize,
  );

  const table = useReactTable({
    data: rows,
    columns,
    pageCount,
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: setPagination,
    getRowId: (row, index) =>
      typeof row.id === "string"
        ? row.id
        : `${pagination.pageIndex}:${index}`,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-initial items-center gap-2 py-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm w-full bg-background"
        />
        {error && (
          <div className="text-xs text-destructive">{error.message}</div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-grow flex-col">
        <Table className="flex-grow">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-initial items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getSelectedRowModel().rows.length} selected. Showing {pageStart}-{pageEnd} of {totalRowCount} rows.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={pagination.pageIndex === 0 || loading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={pagination.pageIndex + 1 >= pageCount || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
