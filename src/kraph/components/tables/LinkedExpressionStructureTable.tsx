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

import { GraphQLSearchField } from "@/components/fields/GraphQLListSearchField";
import { PageLayout } from "@/components/layout/PageLayout";
import { Form } from "@/components/ui/form";
import { KraphNode, KraphLinkedExpression } from "@/linkers";
import {
  EntityFragment,
  ListEntitiesQuery,
  ListEntitiesQueryVariables,
  ListEntityFragment,
  useGetLinkedExpressionByAgeNameQuery,
  useGetLinkedExpressionQuery,
  useListEntitiesQuery,
  useSearchLinkedExpressionLazyQuery,
} from "@/kraph/api/graphql";
import { useForm } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EntityOverlay } from "@/kraph/overlays/EntityOverlay";
import Timestamp from "react-timestamp";

export const columns: ColumnDef<ListEntityFragment>[] = [
  {
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
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <Timestamp date={row.getValue("createdAt")} />,
    sortingFn: (a, b) => a.getValue("createdAt") - b.getValue("createdAt"),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "object",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Object
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <>{row.getValue("object")}</>,
    sortingFn: (a, b) => a.getValue("object") - b.getValue("object"),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "identifier",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Identifier
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <>{row.getValue("identifier")}</>,
    sortingFn: (a, b) => a.getValue("identifier") - b.getValue("identifier"),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "label",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Label
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.getValue("label")}</div>
    ),
    sortingFn: (a, b) => a.getValue("label") - b.getValue("label"),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Link
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <KraphNode.DetailLink object={row.getValue("id")}>
        {" "}
        Open{" "}
      </KraphNode.DetailLink>
    ),
    sortingFn: (a, b) => a.getValue("id") - b.getValue("id"),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost" className="lowercase">
            {row.getValue("id")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded rounded-xl shadow-xl shadow">
          <EntityOverlay entity={row.getValue("id")} />
        </PopoverContent>
      </Popover>
    ),
    sortingFn: (a, b) => a.getValue("id") - b.getValue("id"),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "Label",
    accessorKey: "linkedExpression.label",
    header: () => <div className="text-center">Type</div>,
    cell: ({ row, getValue }) => {
      const label = row.getValue("Label");

      return <div className="text-center font-small">{label}</div>;
    },
    filterFn: (rows, filterValue) => {
      return rows.filter((row) => {
        return row.getValue("Label").includes(filterValue);
      });
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return <KraphNode.ObjectButton object={row.getValue("id")} />;
    },
  },
];

const initialVariables: ListEntitiesQueryVariables = {
  pagination: {
    limit: 20, // Default page size
    offset: 0, // Start from the first item
  },
};

export const MetricHeader = (props: { ageName: string; graph: string }) => {
  const { data } = useGetLinkedExpressionByAgeNameQuery({
    variables: {
      graph: props.graph,
      ageName: props.ageName,
    },
  });

  if (!data?.linkedExpressionByAgename) {
    return null;
  }

  return (
    <div>
      <Tooltip>
        <TooltipTrigger>
          <KraphLinkedExpression.DetailLink
            object={data?.linkedExpressionByAgename.id}
          >
            {data?.linkedExpressionByAgename?.expression.label}
          </KraphLinkedExpression.DetailLink>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <h1>{data?.linkedExpressionByAgename?.expression.label}</h1>
            <p>{data?.linkedExpressionByAgename?.expression.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export type FormValues = {
  metrics?: string[];
  kinds?: string[];
  search?: string | null;
};

export const LinkedExpressionStructureTable = (props: {
  graph: string;
  linkedExpression: string;
}) => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [searchM] = useSearchLinkedExpressionLazyQuery({});

  const form = useForm<FormValues>({
    defaultValues: {},
  });
  const { metrics, kinds, search } = form.watch();

  const { data, loading, refetch, error } = useListEntitiesQuery({
    variables: {
      filters: {
        graph: props.graph,
        linkedExpression: props.linkedExpression,
      },
      pagination: {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
      },
    },
  });

  React.useEffect(() => {
    const variables = {
      filters: {
        search: search,
        kinds: kinds,
        graph: props.graph,
        linkedExpression: props.linkedExpression,
      },
      metrics: metrics,
      pagination: {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
      },
    };
    refetch(variables);
  }, [metrics, kinds, search, refetch]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data?.entities ?? [],
    columns,
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
      <div className="flex items-center py-4 gap-2">
        <Form {...form}>
          {!props.linkedExpression && (
            <GraphQLSearchField
              placeholder="Filter Kind"
              searchQuery={searchM}
              name="kinds"
            />
          )}
        </Form>
        <Input
          placeholder="Search..."
          value={(table.getColumn("label")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("label")?.setFilterValue(event.target.value)
          }
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
      <div className="w-full h-full">
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
                <TableCell colSpan={columns.length} className="text-center">
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
              refetch();
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
              refetch();
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
