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
import { ArrowUpDown, ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

import { GraphQLSearchField } from "@/components/fields/GraphQLListSearchField";
import { Form } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MikroEntity, MikroLinkedExpression } from "@/linkers";
import {
  EntityFragment,
  EntityRelationFragment,
  ListEntitiesQueryVariables,
  ListEntityRelationsQuery,
  useGetLinkedExpressionByAgeNameQuery,
  useListEntityRelationsQuery,
  useSearchLinkedExpressionLazyQuery,
} from "@/mikro-next/api/graphql";
import { EntityOverlay } from "@/mikro-next/overlays/EntityOverlay";
import { useForm } from "react-hook-form";

export const columns: ColumnDef<EntityRelationFragment>[] = [
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
    id: "leftId",
    accessorKey: "leftId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Left Entity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost" className="lowercase">
            {row.getValue("leftId")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded rounded-xl shadow-xl shadow">
          <EntityOverlay entity={row.getValue("leftId")} />
        </PopoverContent>
      </Popover>
    ),
  },
  {
    id: "rightId",
    accessorKey: "rightId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Right Entity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost" className="lowercase">
            {row.getValue("rightId")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded rounded-xl shadow-xl shadow">
          <EntityOverlay entity={row.getValue("rightId")} />
        </PopoverContent>
      </Popover>
    ),
  },
  {
    id: "Label",
    accessorKey: "linkedExpression.label",
    header: () => <div className="text-center">Type</div>,
    cell: ({ row, getValue }) => {
      const label = row.getValue("Label");

      return <div className="text-center font-medium">{label}</div>;
    },
  },
  {
    id: "Ontology",
    accessorKey: "linkedExpression.expression.label",
    header: () => <div className="text-center">Ontology</div>,
    cell: ({ row, getValue }) => {
      const label = row.getValue("Ontology") as string;

      return <div className="text-center font-medium">{label || ""}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return <MikroEntity.ObjectButton object={row.getValue("id")} />;
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
          <MikroLinkedExpression.DetailLink
            object={data?.linkedExpressionByAgename.id}
          >
            {data?.linkedExpressionByAgename?.expression.label}
          </MikroLinkedExpression.DetailLink>
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

const calculateColumns = (
  graph: string,
  data?: ListEntityRelationsQuery | undefined,
) => {
  let calculated_columns = columns;
  let other_columns = [];

  for (let rel of data?.entityRelations || []) {
    Object.keys(rel.metricMap).forEach((metric) => {
      console.log("FOUND", metric);
      if (!other_columns.find((column) => column.id === `metric-${metric}`)) {
        other_columns.push({
          id: `metric-${metric}`,
          accessorKey: `metricMap.${metric}`,
          header: () => (
            <div className="text-center">
              <MetricHeader ageName={metric} graph={graph} />
            </div>
          ),
          cell: ({ row, getValue }) => {
            const label = row.getValue(`metric-${metric}`);

            return <div className="text-center font-medium">{label}</div>;
          },
        } as ColumnDef<EntityRelationFragment>);
      }
    });
  }

  console.log(other_columns);

  calculated_columns = calculated_columns.concat(other_columns);
  return calculated_columns;
};

export type FormValues = {
  metrics?: string[];
  kinds?: string[];
  search?: string | null;
};

export const LinkedExpressionRelationTable = (props: {
  graph: string;
  linkedExpression?: string;
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

  const { data, loading, refetch, error } = useListEntityRelationsQuery({
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
    refetch(variables).then((d) => {
      setColumns(calculateColumns(props.graph, d.data));
    });
  }, [metrics, kinds, search, refetch]);

  const [columns, setColumns] = React.useState<
    ColumnDef<EntityRelationFragment>[]
  >(() => calculateColumns(props.graph, data));

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data?.entityRelations ?? [],
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
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
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
