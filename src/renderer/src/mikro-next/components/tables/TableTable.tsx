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
  BarChart3,
  ChevronDown,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ImageAccessorFragment,
  type LabelAccessorFragment,
  type TableFragment,
} from "@/mikro-next/api/graphql";
import { cn } from "@/lib/utils";

import {
  type DuckDbColumnFilters,
  type DuckDbHistogramBucket,
  useDuckDbTable,
} from "./useDuckDbTable";

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

const sortLabel = (direction: false | "asc" | "desc") => {
  if (direction === "asc") {
    return "Ascending";
  }

  if (direction === "desc") {
    return "Descending";
  }

  return "Not sorted";
};

const HistogramList = (props: {
  buckets: DuckDbHistogramBucket[];
  onSelectValue: (value: string) => void;
}) => {
  const maxCount = Math.max(...props.buckets.map((bucket) => bucket.count), 1);

  return (
    <div className="space-y-2">
      {props.buckets.map((bucket) => (
        <button
          key={`${bucket.value}:${bucket.count}`}
          type="button"
          onClick={() => props.onSelectValue(bucket.value)}
          className="flex w-full items-center gap-2 rounded-md px-1 py-1 text-left hover:bg-accent"
        >
          <span className="w-24 truncate text-xs text-foreground" title={bucket.value}>
            {bucket.value}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary/70"
              style={{ width: `${(bucket.count / maxCount) * 100}%` }}
            />
          </div>
          <span className="w-10 text-right text-[11px] text-muted-foreground">
            {bucket.count}
          </span>
        </button>
      ))}
    </div>
  );
};

const ColumnHeaderControl = (props: {
  columnName: string;
  columnType: string;
  accessorTypes: string[];
  accessorDetails: Array<{
    id: string;
    label: string;
    keys: string[];
    minIndex?: number | null;
    maxIndex?: number | null;
  }>;
  currentFilter: string;
  sortDirection: false | "asc" | "desc";
  sortIndex: number | null;
  onFilterChange: (value: string) => void;
  onSortAsc: () => void;
  onSortDesc: () => void;
  onClearSort: () => void;
  loadHistogram: () => Promise<DuckDbHistogramBucket[]>;
}) => {
  const [open, setOpen] = React.useState(false);
  const [histogram, setHistogram] = React.useState<DuckDbHistogramBucket[]>([]);
  const [histogramLoading, setHistogramLoading] = React.useState(false);
  const [histogramError, setHistogramError] = React.useState<string | null>(null);
  const {
    accessorDetails,
    accessorTypes,
    columnName,
    columnType,
    currentFilter,
    loadHistogram,
    onClearSort,
    onFilterChange,
    onSortAsc,
    onSortDesc,
    sortDirection,
    sortIndex,
  } = props;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);

      if (!nextOpen) {
        return;
      }

      setHistogramLoading(true);
      setHistogramError(null);

      void loadHistogram()
        .then((nextHistogram) => {
          setHistogram(nextHistogram);
        })
        .catch((error) => {
          setHistogramError(
            error instanceof Error ? error.message : String(error),
          );
        })
        .finally(() => {
          setHistogramLoading(false);
        });
    },
    [loadHistogram],
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <Button
          variant="ghost"
          className={cn(
            "h-8 gap-2 border px-2 font-medium transition-colors",
            (currentFilter || sortDirection) &&
              "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15",
            !currentFilter && !sortDirection && "border-transparent",
          )}
        >
          <span className="max-w-40 truncate">{columnName}</span>
          {sortDirection === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : sortDirection === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-60" />
          )}
          {currentFilter ? <Search className="h-3.5 w-3.5" /> : null}
          {sortDirection ? (
            <div className="flex items-center gap-1">
              {sortIndex != null ? (
                <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  {sortIndex + 1}
                </span>
              ) : null}
              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                {sortDirection}
              </span>
            </div>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <PopoverHeader>
          <PopoverTitle>{columnName}</PopoverTitle>
          <PopoverDescription>
            {sortLabel(sortDirection)}
            {accessorTypes.length
              ? ` • ${accessorTypes.join(", ")}`
              : " • Raw column values"}
          </PopoverDescription>
        </PopoverHeader>

        <div className="grid grid-cols-2 gap-2 rounded-md border bg-muted/30 p-2 text-[11px]">
          <div>
            <div className="text-muted-foreground">Type</div>
            <div className="font-medium">{columnType}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Accessors</div>
            <div className="font-medium">{accessorDetails.length}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Filter</div>
            <div className="truncate font-medium">
              {currentFilter || "No column filter"}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Sort</div>
            <div className="font-medium">
              {sortLabel(sortDirection)}
              {sortIndex != null ? ` (#${sortIndex + 1})` : ""}
            </div>
          </div>
        </div>

        {accessorDetails.length ? (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              Accessor details
            </div>
            <div className="space-y-2">
              {accessorDetails.map((accessor) => (
                <div
                  key={accessor.id}
                  className="rounded-md border bg-background/60 p-2 text-[11px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{accessor.label}</span>
                    {(accessor.minIndex != null || accessor.maxIndex != null) && (
                      <span className="text-muted-foreground">
                        [{accessor.minIndex ?? "?"}:{accessor.maxIndex ?? "?"}]
                      </span>
                    )}
                  </div>
                  <div className="mt-1 break-all text-muted-foreground">
                    {accessor.keys.length
                      ? accessor.keys.join(" / ")
                      : "No key path"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={onSortAsc}>
            <ArrowUp className="mr-1 h-3.5 w-3.5" />
            Asc
          </Button>
          <Button variant="outline" size="sm" onClick={onSortDesc}>
            <ArrowDown className="mr-1 h-3.5 w-3.5" />
            Desc
          </Button>
          <Button variant="outline" size="sm" onClick={onClearSort}>
            <X className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder={`Search ${columnName}`}
              value={currentFilter}
              onChange={(event) => onFilterChange(event.target.value)}
              className="h-8 bg-background"
            />
            <Button
              variant="ghost"
              size="icon"
              disabled={!currentFilter}
              onClick={() => onFilterChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5" />
            Value histogram
          </div>

          {histogramLoading ? (
            <div className="text-xs text-muted-foreground">Loading histogram...</div>
          ) : histogramError ? (
            <div className="text-xs text-destructive">{histogramError}</div>
          ) : histogram.length ? (
            <HistogramList
              buckets={histogram}
              onSelectValue={(value) => onFilterChange(value === "(null)" ? "" : value)}
            />
          ) : (
            <div className="text-xs text-muted-foreground">No values found.</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const calculateColumns = (
  table: TableFragment,
  options: {
    columnFilters: DuckDbColumnFilters;
    rowIndexOffset: number;
    sorting: SortingState;
    onColumnFilterChange: (columnName: string, value: string) => void;
    onColumnSortingChange: (
      columnName: string,
      direction: false | "asc" | "desc",
    ) => void;
    loadColumnHistogram: (columnName: string) => Promise<DuckDbHistogramBucket[]>;
  },
): ColumnDef<Item>[] => {
  const calculatedColumns: ColumnDef<Item>[] = [
    createIndexColumn(options.rowIndexOffset),
    selectionColumn,
  ];

  table.columns.forEach((column) => {
    const activeSort = options.sorting.find((entry) => entry.id === column.name);
    const sortDirection = activeSort ? (activeSort.desc ? "desc" : "asc") : false;
    const sortIndex = options.sorting.findIndex((entry) => entry.id === column.name);

    calculatedColumns.push({
      id: column.name,
      accessorKey: column.name,
      header: () => {
        return (
          <ColumnHeaderControl
            columnName={column.name}
            columnType={String(column.type)}
            accessorTypes={column.accessors.flatMap((accessor) =>
              accessor.__typename ? [accessor.__typename] : [],
            )}
            accessorDetails={column.accessors.map((accessor) => ({
              id: accessor.id,
              label: accessor.__typename ?? "Accessor",
              keys: accessor.keys,
              minIndex: accessor.minIndex,
              maxIndex: accessor.maxIndex,
            }))}
            currentFilter={options.columnFilters[column.name] ?? ""}
            sortDirection={sortDirection}
            sortIndex={sortIndex >= 0 ? sortIndex : null}
            onFilterChange={(value) =>
              options.onColumnFilterChange(column.name, value)
            }
            onSortAsc={() => options.onColumnSortingChange(column.name, "asc")}
            onSortDesc={() => options.onColumnSortingChange(column.name, "desc")}
            onClearSort={() => options.onColumnSortingChange(column.name, false)}
            loadHistogram={() => options.loadColumnHistogram(column.name)}
          />
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
  "use no memo";

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [search, setSearch] = React.useState("");
  const [columnFilters, setColumnFilters] =
    React.useState<DuckDbColumnFilters>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [exporting, setExporting] = React.useState(false);

  const { rows, totalRowCount, loading, error, loadColumnHistogram, exportAsCsv } =
    useDuckDbTable({
      table: props.table,
      pagination,
      sorting,
      search,
      columnFilters,
    });

  const handleColumnFilterChange = React.useCallback(
    (columnName: string, value: string) => {
      setColumnFilters((current) => {
        const nextFilters = { ...current };

        if (value.trim()) {
          nextFilters[columnName] = value;
        } else {
          delete nextFilters[columnName];
        }

        return nextFilters;
      });
    },
    [],
  );

  const handleColumnSortingChange = React.useCallback(
    (columnName: string, direction: false | "asc" | "desc") => {
      setSorting((current) => {
        const existingIndex = current.findIndex((entry) => entry.id === columnName);

        if (direction === false) {
          if (existingIndex === -1) {
            return current;
          }

          return current.filter((entry) => entry.id !== columnName);
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
      calculateColumns(props.table, {
        columnFilters,
        rowIndexOffset: pagination.pageIndex * pagination.pageSize,
        sorting,
        onColumnFilterChange: handleColumnFilterChange,
        onColumnSortingChange: handleColumnSortingChange,
        loadColumnHistogram,
      }),
    [
      columnFilters,
      handleColumnFilterChange,
      handleColumnSortingChange,
      loadColumnHistogram,
      pagination.pageIndex,
      pagination.pageSize,
      props.table,
      sorting,
    ],
  );

  const activeColumnFilters = Object.entries(columnFilters).filter(
    ([, value]) => value.trim().length > 0,
  );

  const clearAllColumnFilters = React.useCallback(() => {
    setColumnFilters({});
  }, []);

  const clearGlobalSearch = React.useCallback(() => {
    setSearch("");
  }, []);

  React.useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }, [props.table.id, search, columnFilters]);

  React.useEffect(() => {
    setColumnFilters({});
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
      const safeName = props.table.name.replace(/[^a-z0-9-_]+/gi, "_").replace(/^_+|_+$/g, "");

      link.href = url;
      link.download = `${safeName || "table"}_${new Date().toISOString().split("T")[0]}.csv`;
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
        {activeColumnFilters.length ? (
          <div className="flex flex-wrap items-center gap-2">
            {activeColumnFilters.map(([columnName, value]) => (
              <Button
                key={columnName}
                variant="outline"
                size="sm"
                className="h-8 gap-2"
                onClick={() => handleColumnFilterChange(columnName, "")}
              >
                <Search className="h-3.5 w-3.5" />
                <span className="max-w-32 truncate">{columnName}: {value}</span>
                <X className="h-3.5 w-3.5" />
              </Button>
            ))}
            <Button variant="ghost" size="sm" onClick={clearAllColumnFilters}>
              Clear filters
            </Button>
          </div>
        ) : null}
        {error && <div className="text-xs text-destructive">{error.message}</div>}

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
