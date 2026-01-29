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

import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { MikroPixelView } from "@/linkers";
import {
  ChildrenQuery,
  ImageAccessorFragment,
  LabelAccessorFragment,
  TableFragment,
  useRowsQuery,
} from "@/mikro-next/api/graphql";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { useForm } from "react-hook-form";

export type Item = ChildrenQuery["rows"][0];

export const columns: ColumnDef<Item>[] = [
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
];

const endColumns = [
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

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
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export type ValueAccessorProps<T extends any> = {
  accessor: T;
  value?: any;
};

export const LabelAccessor = ({
  accessor,
  value,
}: ValueAccessorProps<LabelAccessorFragment>) => {
  return (
    <MikroPixelView.DetailLink
      object={accessor.pixelView.id}
      subroute={`value/${parseInt(value?.toString() ?? "0")}`}
    >
      <div className="text-sm font-semibold">{accessor.__typename}</div>
      <div className="text-xs text-muted-foreground">{value}</div>
    </MikroPixelView.DetailLink>
  );
};

export const ImageAccessor = ({
  accessor,
  value,
}: ValueAccessorProps<ImageAccessorFragment>) => {
  return (
    <div>
      <div className="text-sm font-semibold">{accessor.__typename}</div>
      <div className="text-xs text-muted-foreground">{value}</div>
    </div>
  );
};

export const AccessorDiplay = (props: {
  accessor: TableFragment["accessors"][0];
  value?: any;
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
      <div className="text-xs text-muted-foreground">{props.value}</div>
    </div>
  );
};

export const DelegatinAccessorDisplay = (props: {
  accessors: TableFragment["accessors"];
  value: any;
}) => {
  return (
    <div className="flex flex-row gap-2">
      {props.accessors.map((accessor) => (
        <AccessorDiplay
          key={accessor.id}
          accessor={accessor}
          value={props.value}
        />
      ))}
    </div>
  );
};

const calculateColumns = (table: TableFragment) => {
  let calculated_columns = [...columns];

  table.columns.forEach((col, index) => {
    calculated_columns.push({
      id: col.name,
      accessorKey: col.name,
      header: ({ column }) => {
        return (
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                variant="ghost"
              >
                {col.name}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              {col.accessors.map((accessor) => (
                <div key={accessor.keys.join("")}>{accessor.__typename}</div>
              ))}
            </TooltipContent>
          </Tooltip>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-center mx-auto">
            {col.accessors.length == 0 ? (
              <div>{row.getValue(col.name)}</div>
            ) : (
              <DelegatinAccessorDisplay
                accessors={col.accessors}
                value={row.getValue(col.name)}
              />
            )}
          </div>
        );
      },
    });
  });

  return calculated_columns.concat(endColumns);
};

export type FormValues = {
  metrics?: string[];
  kinds?: string[];
  search?: string | null;
};

export const TableTable = (props: { table: TableFragment }) => {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const form = useForm<FormValues>({
    defaultValues: {},
  });

  const initialVariables = {};

  const { kinds, search } = form.watch();

  const { data, loading, refetch, error } = useRowsQuery({
    variables: {
      table: props.table.id,
      ...initialVariables,
    },
  });

  React.useEffect(() => {
    const variables = {
      table: props.table.id,
      pagination: {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
      },
    };
    refetch(variables);

    console.log(variables);
    setColumns(calculateColumns(props.table));
  }, [pagination, kinds, search, refetch]);

  const [columns, setColumns] = React.useState<ColumnDef<Item>[]>(() =>
    calculateColumns(props.table),
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data?.rows ?? [],
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
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center py-4 gap-2 flex-initial">
        {JSON.stringify(error)}
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
      <div className="flex-grow flex flex-col">
        <Table className="flex-grow">
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
      <div className="flex flex-initial items-center justify-end space-x-2 py-4">
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
