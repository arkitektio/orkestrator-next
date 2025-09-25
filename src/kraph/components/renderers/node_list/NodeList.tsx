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
  NodeListFragment,
  useRenderGraphQueryQuery,
  GraphQueryFilters,
  GraphQueryPagination,
  GraphQueryOrder,
} from "@/kraph/api/graphql";
import { ViewOptions } from "../DelegatingNodeViewRenderer";
import { KraphNode } from "@/linkers";

export type FormValues = {
  metrics?: string[];
  kinds?: string[];
  search?: string | null;
};

const calculateColumns = (
  list: NodeListFragment | undefined,
): ColumnDef<NodeListFragment["nodes"][0]>[] => {
  if (!list) {
    return [];
  }

  return [
    {
      id: "id",
      accessorKey: "id",
      header: () => <div className="text-center">Id</div>,
      cell: ({ row }) => {
        const label = row.getValue("id") as string;

        return (
          <KraphNode.Smart object={label}>
            <KraphNode.DetailLink object={label}>
              {label || ""}
            </KraphNode.DetailLink>
          </KraphNode.Smart>
        );
      },
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      id: "externalID",
      accessorFn: (x) => x.externalId,
      header: () => <div className="text-center">External ID</div>,
      cell: ({ row }) => {
        const label = row.getValue("externalID") as string;

        return <div className="text-center">{label || ""}</div>;
      },
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      id: "label",
      accessorFn: (x) => x.__typename === "Entity" && x.label,
      header: () => <div className="text-center">Label</div>,
      cell: ({ row }) => {
        const label = row.getValue("label") as string;

        return <div className="text-center">{label || ""}</div>;
      },
      enableSorting: true,
      enableGlobalFilter: true,
    },
  ];
};

const calculateRows = (list: NodeListFragment | undefined) => {
  const rowObjects = list?.nodes;
  return rowObjects;
};

export const NodeListRender = (props: {
  list?: NodeListFragment;
  options?: ViewOptions;
}) => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = calculateColumns(props.list);
  const rows = calculateRows(props.list);

  const table = useReactTable({
    data: rows || [],
    columns: columns || [],
    pageCount: -1,
    manualPagination: true,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="w-full h-full">
      {!props.options?.minimal && (
        <div className="flex items-center py-4 gap-2">
          <Input
            placeholder="Search..."
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm w-full bg-background"
          />
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
      )}
      <div className="flex-grow flex flex-justify-between">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export const RenderGraphQueryNodeList = (props: {
  graphQueryId: string;
  options?: ViewOptions;
}) => {
  const [search, setSearch] = React.useState<string>("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Prepare GraphQL variables
  const filters: GraphQueryFilters = {
    search: search || undefined,
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
  };

  const paginationInput: GraphQueryPagination = {
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
  };

  const order: GraphQueryOrder | undefined =
    sorting.length > 0
      ? {
          field: sorting[0].id,
          direction: sorting[0].desc ? "DESC" : "ASC",
        }
      : undefined;

  const { data, loading, error } = useRenderGraphQueryQuery({
    variables: {
      id: props.graphQueryId,
      filters,
      pagination: paginationInput,
      order,
    },
  });

  // Extract the NodeList from the response
  const nodeList =
    data?.renderGraphQuery?.__typename === "NodeList"
      ? data.renderGraphQuery
      : undefined;

  const columns = calculateColumns(nodeList);
  const rows = calculateRows(nodeList);

  const table = useReactTable({
    data: rows || [],
    columns: columns || [],
    pageCount: -1,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  // Handle search with debouncing
  const debouncedSetSearch = React.useCallback(
    React.useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearch(value);
          setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page on search
        }, 300);
      };
    }, []),
    [],
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-full h-full">
      {!props.options?.minimal && (
        <div className="flex items-center py-4 gap-2">
          <Input
            placeholder="Search..."
            onChange={(event) => debouncedSetSearch(event.target.value)}
            className="max-w-sm w-full bg-background"
          />
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
      )}
      <div className="flex-grow flex flex-justify-between">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage() || loading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage() || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
