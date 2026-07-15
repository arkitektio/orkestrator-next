"use client";

import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  X,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
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
import { type TableDatasetFragment } from "@/mikro-next/api/graphql";
import { cn } from "@/lib/utils";

import {
  type DuckDbColumnFilters,
  useDuckDbTable,
} from "./useDuckDbTable";

type Item = Record<string, unknown>;

type TableDatasetColumn = TableDatasetFragment["columns"][number];

const formatCellValue = (value: unknown) => {
  if (value == null) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const createIndexColumn = (rowIndexOffset: number): ColumnDef<Item> => ({
  id: "index",
  header: () => <div className="text-center font-medium">#</div>,
  cell: ({ row }) => (
    <div className="text-center text-sm text-muted-foreground">
      {rowIndexOffset + row.index + 1}
    </div>
  ),
  enableSorting: false,
  enableHiding: false,
});

// A COORDINATE column is an axis of the table's coordinate system — surface that
// so the reader can tell measurement columns apart from the space they live in.
const ColumnHeader = (props: {
  column: TableDatasetColumn;
  sortDirection: false | "asc" | "desc";
  onToggleSort: () => void;
}) => {
  const { column, sortDirection, onToggleSort } = props;

  return (
    <Button
      variant="ghost"
      onClick={onToggleSort}
      className={cn(
        "h-auto flex-col items-start gap-1 border px-2 py-1 font-medium transition-colors",
        sortDirection
          ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
          : "border-transparent",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="max-w-40 truncate">
          {column.longName ?? column.name}
        </span>
        {sortDirection === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : sortDirection === "desc" ? (
          <ArrowDown className="h-3.5 w-3.5" />
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
        )}
      </div>
      <div className="flex items-center gap-1">
        <Badge variant="outline" className="px-1 py-0 text-[10px] font-normal">
          {column.role}
        </Badge>
        <span className="font-mono text-[10px] text-muted-foreground">
          {column.dtype}
          {column.unit ? ` · ${column.unit}` : ""}
        </span>
      </div>
    </Button>
  );
};

const calculateColumns = (
  columns: TableDatasetColumn[],
  options: {
    rowIndexOffset: number;
    sorting: SortingState;
    onColumnSortingChange: (
      columnName: string,
      direction: false | "asc" | "desc",
    ) => void;
  },
): ColumnDef<Item>[] => {
  const calculatedColumns: ColumnDef<Item>[] = [
    createIndexColumn(options.rowIndexOffset),
  ];

  [...columns]
    .sort((a, b) => a.order - b.order)
    .forEach((column) => {
      const activeSort = options.sorting.find(
        (entry) => entry.id === column.name,
      );
      const sortDirection = activeSort
        ? activeSort.desc
          ? "desc"
          : "asc"
        : false;

      calculatedColumns.push({
        id: column.name,
        accessorKey: column.name,
        header: () => (
          <ColumnHeader
            column={column}
            sortDirection={sortDirection}
            // Cycle asc → desc → none so a single control drives all three states.
            onToggleSort={() =>
              options.onColumnSortingChange(
                column.name,
                sortDirection === "asc"
                  ? "desc"
                  : sortDirection === "desc"
                    ? false
                    : "asc",
              )
            }
          />
        ),
        cell: ({ row }) => (
          <div className="text-center font-mono text-sm">
            {formatCellValue(row.getValue(column.name))}
          </div>
        ),
      });
    });

  return calculatedColumns;
};

export const TableDatasetTable = (props: { table: TableDatasetFragment }) => {
  "use no memo";

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [search, setSearch] = React.useState("");
  const [columnFilters] = React.useState<DuckDbColumnFilters>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [exporting, setExporting] = React.useState(false);

  const { rows, totalRowCount, loading, error, exportAsCsv } = useDuckDbTable({
    table: props.table,
    pagination,
    sorting,
    search,
    columnFilters,
  });

  const handleColumnSortingChange = React.useCallback(
    (columnName: string, direction: false | "asc" | "desc") => {
      setSorting((current) => {
        const existingIndex = current.findIndex(
          (entry) => entry.id === columnName,
        );

        if (direction === false) {
          return existingIndex === -1
            ? current
            : current.filter((entry) => entry.id !== columnName);
        }

        if (existingIndex === -1) {
          return [...current, { id: columnName, desc: direction === "desc" }];
        }

        return current.map((entry, index) =>
          index === existingIndex
            ? { ...entry, desc: direction === "desc" }
            : entry,
        );
      });
    },
    [],
  );

  const columns = React.useMemo(
    () =>
      calculateColumns(props.table.columns, {
        rowIndexOffset: pagination.pageIndex * pagination.pageSize,
        sorting,
        onColumnSortingChange: handleColumnSortingChange,
      }),
    [
      handleColumnSortingChange,
      pagination.pageIndex,
      pagination.pageSize,
      props.table.columns,
      sorting,
    ],
  );

  const clearGlobalSearch = React.useCallback(() => {
    setSearch("");
  }, []);

  React.useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }, [props.table.id, search]);

  React.useEffect(() => {
    setSearch("");
    setSorting([]);
  }, [props.table.id]);

  const pageCount = Math.max(1, Math.ceil(totalRowCount / pagination.pageSize));
  const pageStart =
    totalRowCount === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const pageEnd = Math.min(
    totalRowCount,
    (pagination.pageIndex + 1) * pagination.pageSize,
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns,
    pageCount,
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: setPagination,
    getRowId: (row, index) =>
      typeof row.id === "string" ? row.id : `${pagination.pageIndex}:${index}`,
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const visibleExportColumns = React.useMemo(
    () =>
      props.table.columns
        .map((column) => column.name)
        .filter((columnName) => table.getColumn(columnName)?.getIsVisible()),
    [props.table.columns, table],
  );

  const handleExportCsv = React.useCallback(async () => {
    setExporting(true);

    try {
      const csv = await exportAsCsv(visibleExportColumns);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeName = props.table.name
        .replace(/[^a-z0-9-_]+/gi, "_")
        .replace(/^_+|_+$/g, "");

      link.href = url;
      link.download = `${safeName || "tabledataset"}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, [exportAsCsv, props.table.name, visibleExportColumns]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-initial flex-wrap items-center gap-2 py-4">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search all columns..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-background pr-9"
          />
          {search ? (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={clearGlobalSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
        {error && (
          <div className="text-xs text-destructive">{error.message}</div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCsv}
          disabled={loading || exporting || totalRowCount === 0}
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          {exporting ? "Exporting..." : "Export as CSV"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
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
                <TableRow key={row.id}>
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-initial items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {pageStart}-{pageEnd} of {totalRowCount} rows.
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

export default TableDatasetTable;
