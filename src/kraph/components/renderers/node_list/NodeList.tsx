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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
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
  useSetNodePropertyMutation,
  MetricKind,
  VariableDefinitionFragment,
  PropertyDefinitionFragment,
} from "@/kraph/api/graphql";
import { ViewOptions } from "../DelegatingNodeViewRenderer";
import { KraphNode } from "@/linkers";
import Timestamp from "react-timestamp";
import { Calendar } from "@/components/ui/calendar";
import { DateTimePicker } from "@/components/ui/datetime-picker";

export type FormValues = {
  metrics?: string[];
  kinds?: string[];
  search?: string | null;
};


const EditableCell = ({
  value,
  nodeId,
  propertyDefinition,
}: {
  value: any;
  nodeId: string;
  propertyDefinition: PropertyDefinitionFragment;
}) => {

  const [setNodeProperty] = useSetNodePropertyMutation();

  const [editingValue, setEditingValue] = React.useState(value);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleBlur = () => {
    setIsEditing(false);
    if (editingValue !== value) {
      setNodeProperty({
        variables: {
          input: {
            entity: nodeId,
            variable: propertyDefinition.key,
            value: String(editingValue),
          },
        },
      });
    }
  }

  const handleBooleanChange = (checked: boolean) => {
    setEditingValue(checked);
    setNodeProperty({
      variables: {
        input: {
          entity: nodeId,
          variable: propertyDefinition.key,
          value: String(checked),
        },
      },
    });
  }

  const renderEditWidget = () => {
    const kind = propertyDefinition.valueKind;
    const options = propertyDefinition.options;

    if (options && options.length > 0) {
      return (
        <select
          value={editingValue || ""}
          onChange={(e) => {
            const selectedValue = e.target.value;
            setEditingValue(selectedValue);
            setIsEditing(false);
            setNodeProperty({
              variables: {
                input: {
                  entity: nodeId,
                  variable: propertyDefinition.key,
                  value: String(selectedValue),
                },
              },
            });
          }}
          onBlur={handleBlur}
          autoFocus
          className="h-8 bg-background border border-input rounded-md px-2"
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    switch (kind) {
      case MetricKind.Boolean:
        return (
          <div className="flex items-center justify-center p-2">
            <Switch
              checked={editingValue}
              onCheckedChange={handleBooleanChange}
            />
          </div>
        );

      case MetricKind.Int:
        return (
          <Input
            type="number"
            step="1"
            value={editingValue || ""}
            onChange={(e) => setEditingValue(parseInt(e.target.value) || 0)}
            onBlur={handleBlur}
            autoFocus
            className="h-8"
          />
        );

      case MetricKind.Float:
        return (
          <Input
            type="number"
            step="any"
            value={editingValue || ""}
            onChange={(e) => setEditingValue(parseFloat(e.target.value) || 0)}
            onBlur={handleBlur}
            autoFocus
            className="h-8"
          />
        );

      case MetricKind.Datetime:
        return (
          <DateTimePicker value={editingValue} onChange={setEditingValue} />
        );

      case MetricKind.String:
      case MetricKind.Category:
      default:
        return (
          <Input
            value={editingValue || ""}
            onChange={(e) => setEditingValue(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className="h-8"
          />
        );
    }
  };

  const formatDisplayValue = (val: any, kind: MetricKind) => {
    if (val === null || val === undefined) {
      return <span className="text-muted-foreground italic">None</span>;
    }

    switch (kind) {
      case MetricKind.Boolean:
        return (
          <Badge variant={val ? "default" : "secondary"}>
            {val ? "True" : "False"}
          </Badge>
        );

      case MetricKind.Int:
      case MetricKind.Float:
        return (
          <span className="font-mono text-sm">
            {typeof val === "number" ? val.toLocaleString() : val}
          </span>
        );

      case MetricKind.Datetime:
        return (
          <Timestamp date={value} autoUpdate relative />
        );

      case MetricKind.Category:
        return (
          <Badge variant="outline">
            {String(val)}
          </Badge>
        );

      case MetricKind.String:
      default:
        return <span className="text-sm">{String(val)}</span>;
    }
  };

  const renderDisplayValue = () => {
    const kind = propertyDefinition.valueKind;

    if (kind === MetricKind.Boolean) {
      return (
        <div className="flex items-center justify-center">
          <Switch
            checked={value}
            onCheckedChange={handleBooleanChange}
          />
        </div>
      );
    }

    return (
      <div
        className="cursor-pointer hover:bg-muted/50 px-2 py-1.5 rounded min-h-[32px] flex items-center"
        onClick={() => setIsEditing(true)}
      >
        {formatDisplayValue(value, kind)}
      </div>
    );
  };

  return isEditing ? renderEditWidget() : renderDisplayValue();
};


const calculateColumns = (
  list: NodeListFragment | undefined,
): ColumnDef<NodeListFragment["nodes"][0]>[] => {
  if (!list) {
    return [];
  }


  const defaults = [
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

  list.category.propertyDefinitions?.forEach((variable) => {
    defaults.push({
      id: variable.key,
      accessorFn: (x) =>
        x.__typename === "Entity"
          ? x.properties
            ? (x.properties as Record<string, any>)[variable.key]
            : undefined
          : undefined,
      header: () => <div className="text-center">{variable.key}</div>,
      cell: ({ row }) => {
        const value = row.getValue(variable.key) as string;
        const id = row.getValue("id") as string;
        return <EditableCell value={value} nodeId={id} propertyDefinition={variable} />;
      },
      enableSorting: true,
      enableGlobalFilter: true,
    });
  });




  return defaults;
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
