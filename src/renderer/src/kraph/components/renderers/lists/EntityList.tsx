"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Download } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDialog } from "@/app/dialog";
import { DisplayWidget } from "@/command/Menu";
import { Card } from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { FancyInput } from "@/components/ui/fancy-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CategoryNodesFilter,
  CategoryNodesOrder,
  EntityCategoryFragment,
  EntityNodesQuery,
  MetricKind,
  NodeCategoryFilter,
  NodeCategoryFragment,
  NodeListFragment,
  OrderDirection,
  PropertyDefinitionFragment,
  PropertyMatch,
  PropertyOrder,
  WhereOperator,
  useEntityNodesQuery,
  useGetEntityQuery,
  useSetNodePropertyMutation
} from "@/kraph/api/graphql";
import { calculateDuration } from "@/kraph/pages/EntityPage";
import { KraphMeasurement, KraphNode, KraphProtocolEvent } from "@/linkers";
import { ArrowDown, ArrowUp, ArrowUpDown, Filter, Plus, RefreshCw, X } from "lucide-react";
import Timestamp from "react-timestamp";
import { ViewOptions } from "../DelegatingNodeViewRenderer";


export type FormValues = {
  metrics?: string[];
  kinds?: string[];
  search?: string | null;
};


const toEditValue = (value: any, kind: MetricKind) => {
  switch (kind) {
    case MetricKind.Int:
      return parseInt(value);
    case MetricKind.Float:
      return parseFloat(value);
    case MetricKind.Boolean:
      return value === "true" || value === true;
    case MetricKind.Datetime:
      return value ? new Date(value * 1000) : undefined;
    default:
      return value;
  }
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
      console.log("Updating value:", editingValue);
      setNodeProperty({
        variables: {
          input: {
            entity: nodeId,
            variable: propertyDefinition.key,
            value: editingValue,
          },
        },
      });
    }
  }

  const onDateChange = (newValue: Date | undefined) => {
    if (!newValue) return;
    setNodeProperty({
      variables: {
        input: {
          entity: nodeId,
          variable: propertyDefinition.key,
          value: newValue.toISOString(),
        },
      },
    });
    setIsEditing(false);
  };

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
          <DateTimePicker value={editingValue} onChange={onDateChange} className="h-8" />
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
          <Timestamp date={val} autoUpdate relative />
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
        className="cursor-pointer hover:bg-muted/50 px-2 py-1.5 rounded min-h-[32px] flex items-center justify-center"
        onClick={() => setIsEditing(true)}
      >
        {formatDisplayValue(value, kind)}
      </div>
    );
  };

  return isEditing ? renderEditWidget() : renderDisplayValue();
};


const calculateColumns = (
  category: EntityCategoryFragment,
): ColumnDef<NodeListFragment["nodes"][0]>[] => {
  if (!category) {
    return [];
  }


  const defaults = [
    {
      id: "select",
      header: () => <div className="text-center">Select</div>,
      cell: ({ row }) => {
        const label = row.getValue("id") as string;

        return (
          <div className="flex items-center justify-center">
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => {
              row.toggleSelected();
            }}>
              {row.getIsSelected() ? (
                <Badge className="h-4 w-4 flex items-center justify-center p-0">
                  ✓
                </Badge>
              ) : (
                <div className="h-4 w-4 border border-gray-400 rounded-sm" />
              )}
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableGlobalFilter: false,
    },
    {
      id: "id",
      accessorKey: "id",
      header: () => <div className="text-center">Open</div>,
      cell: ({ row }) => {
        const label = row.getValue("id") as string;

        return (
          <KraphNode.DetailLink object={label} className={"items-center justify-center flex"}>
            Open
          </KraphNode.DetailLink>
        );
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

  category.propertyDefinitions?.forEach((variable) => {
    defaults.push({
      id: variable.key,
      accessorFn: (x) =>
        x.__typename === "Entity"
          ? x.properties
            ? (x.properties as Record<string, any>)[variable.key]
            : undefined
          : undefined,
      header: () => (
        <div className="flex items-center justify-center gap-1">

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{variable.label || variable.key}</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-1.5">
                  <div>
                    <span className="font-semibold">Key: </span>
                    <span className="font-mono text-xs">{variable.key}</span>
                  </div>
                  {variable.label && (
                    <div>
                      <span className="font-semibold">Label: </span>
                      <span>{variable.label}</span>
                    </div>
                  )}
                  {variable.description && (
                    <div>
                      <span className="font-semibold">Description: </span>
                      <span className="text-sm">{variable.description}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">Type: </span>
                    <span className="font-mono text-xs">
                      {variable.valueKind.replace(/_/g, " ")}
                    </span>
                  </div>
                  {variable.optional !== undefined && (
                    <div>
                      <span className="font-semibold">Optional: </span>
                      <span>{variable.optional ? "Yes" : "No"}</span>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      cell: ({ row }) => {
        const value = row.getValue(variable.key) as string;
        const id = row.getValue("id") as string;
        return <EditableCell value={toEditValue(value, variable.valueKind)} nodeId={id} propertyDefinition={variable} />;
      },
      enableSorting: true,
      enableGlobalFilter: true,
    });
  });




  return defaults;
};

const calculateRows = (entities: EntityNodesQuery["entityNodes"] | undefined) => {
  const rowObjects = entities;
  return rowObjects;
};


export const RowEntity = ({
  row,
}: {
  row: Row<NodeListFragment["nodes"][0]>;
}) => {

  const { data } = useGetEntityQuery({
    variables: {
      id: row.getValue("id")
    }
  })

  return <div className="p-1 w-full h-full overflow-hidden bg-slate-900/70 flex flex-row gap-3">
    {(data?.entity?.measuredBy?.length || 0) > 0 && (
      <>
        {data?.entity.measuredBy.map((measurement) => (
          <KraphMeasurement.DetailLink
            object={measurement.id}
            key={`${measurement.id}`}

          >
            <Card className="p-2 flex flex-col flex-1 h-32 w-32 truncate">

              <pre>{measurement.category.label}</pre>
              {measurement.source.__typename == "Structure" && (
                <DisplayWidget
                  identifier={measurement.source.identifier}
                  object={measurement.source.object}
                  link={true}
                />
              )}
            </Card>
          </KraphMeasurement.DetailLink>
        ))}
      </>
    )}
    {(data?.entity.subjectedTo.length || 0) > 0 && <>
      <div className="p-2">Subjected to</div>

      <div className="flex flex-row gap-2 p-6">
        {(data?.entity.subjectedTo || []).map((subjected) => (
          <Card
            key={`${subjected.id}`}
            className="p-2 flex-row gap-2 flex w-96"
          >
            <div className="my-auto border border-1 rounded  px-2 py-1">
              {subjected.role}
            </div>
            {subjected.target.__typename == "ProtocolEvent" && (
              <div className="flex flex-col">
                <KraphProtocolEvent.DetailLink
                  object={subjected.target.id}
                  className={"text-xl font-bold"}
                >
                  {subjected.target.category.label}
                </KraphProtocolEvent.DetailLink>
                <div className="text-sm text-muted-foreground flex flex-row gap-2">
                  {subjected.target.validFrom && (
                    <Timestamp date={subjected.target.validFrom} relative />
                  )}
                  {subjected.target.validTo && subjected.target.validFrom && (
                    <div>
                      (~
                      {calculateDuration(
                        subjected.target.validFrom,
                        subjected.target.validTo,
                      )}
                      )
                    </div>
                  )}
                  {!subjected.target.validTo && !subjected.target.validFrom && (
                    <div>No validity</div>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>}

    {(data?.entity.targetedBy.length || 0) > 0 && (
      <>
        <div className="p-6">Targeted by</div>


        <div className="flex flex-row gap-2 p-6">
          {data?.entity.targetedBy.map((targeted) => (
            <Card key={`${targeted.id}`} className="p-2 flex-row gap-2 flex w-96">
              <div className="my-auto border border-1 rounded  px-2 py-1">
                {targeted.role}
              </div>
              {targeted.source.__typename == "ProtocolEvent" && (
                <div className="flex flex-col">
                  <KraphProtocolEvent.DetailLink
                    object={targeted.source.id}
                    className={"text-xl font-bold"}
                  >
                    {targeted.source.category.label}
                  </KraphProtocolEvent.DetailLink>
                  <div className="text-sm text-muted-foreground flex flex-row gap-2">
                    {targeted.source.validFrom && (
                      <Timestamp date={targeted.source.validFrom} relative />
                    )}
                    {targeted.source.validTo && targeted.source.validFrom && (
                      <div>
                        (~
                        {calculateDuration(
                          targeted.source.validFrom,
                          targeted.source.validTo,
                        )}
                        )
                      </div>
                    )}
                    {!targeted.source.validTo && !targeted.source.validFrom && (
                      <div>No validity</div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </>
    )}
  </div>
};



export const EntityRow = ({
  row,
}: {
  row: Row<NodeListFragment["nodes"][0]>;
}) => {

  const [moreData, setMoreData] = React.useState(false);




  return <>

    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
    >

      <TableCell className="w-4 px-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => setMoreData(!moreData)}
        >
          <ChevronDown
            className={`ml-2 h-4 w-4 transition-transform ${moreData ? "rotate-180" : ""
              }`}
          />
        </Button>
      </TableCell>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(
            cell.column.columnDef.cell,
            cell.getContext(),
          )}
        </TableCell>
      ))}
    </TableRow>
    {moreData && (
      <tr className="h-[200px] w-full flex flex-grow" >

        <RowEntity row={row} />
      </tr>
    )}
  </>
};

export const EntityList = (props: {
  category: EntityCategoryFragment;
  options?: ViewOptions;
}) => {
  const { openDialog } = useDialog();
  const [search, setSearch] = React.useState<string>("");
  const [searchInput, setSearchInput] = React.useState<string>("");
  const [propertyMatches, setPropertyMatches] = React.useState<PropertyMatch[]>([]);
  const [newFilterKey, setNewFilterKey] = React.useState<string>("");
  const [newFilterOperator, setNewFilterOperator] = React.useState<WhereOperator>(WhereOperator.Equals);
  const [newFilterValue, setNewFilterValue] = React.useState<string>("");
  const [isAddFilterOpen, setIsAddFilterOpen] = React.useState(false);

  const [propertyOrders, setPropertyOrders] = React.useState<PropertyOrder[]>([]);
  const [newOrderKey, setNewOrderKey] = React.useState<string>("");
  const [newOrderDirection, setNewOrderDirection] = React.useState<OrderDirection>(OrderDirection.Asc);
  const [isAddOrderOpen, setIsAddOrderOpen] = React.useState(false);

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
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

  const filters: CategoryNodesFilter = {
    search: search || undefined,
    propertyMatches: propertyMatches.length > 0 ? propertyMatches : undefined,
  };

  const order: CategoryNodesOrder | undefined = propertyOrders.length > 0
    ? { propertyOrder: propertyOrders }
    : undefined;

  const { data, loading, refetch, error } = useEntityNodesQuery({
    variables: {
      category: props.category.id,
      filters,
      ordering: order,
      pagination: {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
      },
    },
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = calculateColumns(props.category);
  const rows = calculateRows(data?.entities || []);

  const exportToCSV = () => {
    if (!rows || rows.length === 0) {
      return;
    }

    // Get all column headers
    const headers = columns
      .filter((col) => col.id !== "select") // Exclude select column
      .map((col) => col.id || "");

    // Build CSV header row
    const csvHeaders = headers.join(",");

    // Build CSV data rows
    const csvRows = rows.map((row) => {
      return headers
        .map((header) => {
          let value = "";

          if (header === "id") {
            value = row.id;
          } else if (header === "label") {
            value = row.__typename === "Entity" ? row.label : "";
          } else {
            // Property value
            const propValue =
              row.__typename === "Entity" && row.properties
                ? (row.properties as Record<string, any>)[header]
                : undefined;

            // Format the value
            if (propValue === null || propValue === undefined) {
              value = "";
            } else if (typeof propValue === "object") {
              value = JSON.stringify(propValue);
            } else {
              value = String(propValue);
            }
          }

          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (value.includes(",") || value.includes('"') || value.includes("\n")) {
            value = `"${value.replace(/"/g, '""')}"`;
          }

          return value;
        })
        .join(",");
    });

    // Combine header and rows
    const csv = [csvHeaders, ...csvRows].join("\n");

    // Create blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${props.category.label || "entities"}_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addFilter = () => {
    if (newFilterKey && newFilterValue) {
      setPropertyMatches([...propertyMatches, {
        key: newFilterKey,
        operator: newFilterOperator,
        value: newFilterValue,
      }]);
      setNewFilterKey("");
      setNewFilterValue("");
      setNewFilterOperator(WhereOperator.Equals);
      setIsAddFilterOpen(false);
    }
  };

  const removeFilter = (index: number) => {
    setPropertyMatches(propertyMatches.filter((_, i) => i !== index));
  };

  const addOrder = () => {
    if (newOrderKey) {
      setPropertyOrders([...propertyOrders, {
        key: newOrderKey,
        direction: newOrderDirection,
      }]);
      setNewOrderKey("");
      setNewOrderDirection(OrderDirection.Asc);
      setIsAddOrderOpen(false);
    }
  };

  const removeOrder = (index: number) => {
    setPropertyOrders(propertyOrders.filter((_, i) => i !== index));
  };

  const getOperatorsForValueKind = (valueKind: MetricKind) => {
    const allOperators = [
      { value: WhereOperator.Equals, label: "Equals" },
      { value: WhereOperator.NotEquals, label: "Not Equals" },
      { value: WhereOperator.Contains, label: "Contains" },
      { value: WhereOperator.StartsWith, label: "Starts With" },
      { value: WhereOperator.EndsWith, label: "Ends With" },
      { value: WhereOperator.GreaterThan, label: "Greater Than" },
      { value: WhereOperator.GreaterOrEqual, label: "Greater Than or Equal" },
      { value: WhereOperator.LessThan, label: "Less Than" },
      { value: WhereOperator.LessOrEqual, label: "Less Than or Equal" },
    ];

    switch (valueKind) {
      case MetricKind.String:
      case MetricKind.Category:
        // String operations
        return allOperators.filter(op =>
          [WhereOperator.Equals, WhereOperator.NotEquals, WhereOperator.Contains,
          WhereOperator.StartsWith, WhereOperator.EndsWith].includes(op.value)
        );

      case MetricKind.Int:
      case MetricKind.Float:
        // Numeric operations
        return allOperators.filter(op =>
          [WhereOperator.Equals, WhereOperator.NotEquals, WhereOperator.GreaterThan,
          WhereOperator.GreaterOrEqual, WhereOperator.LessThan,
          WhereOperator.LessOrEqual].includes(op.value)
        );

      case MetricKind.Boolean:
        // Boolean operations
        return allOperators.filter(op =>
          [WhereOperator.Equals, WhereOperator.NotEquals].includes(op.value)
        );

      case MetricKind.Datetime:
        // DateTime operations
        return allOperators.filter(op =>
          [WhereOperator.Equals, WhereOperator.NotEquals, WhereOperator.GreaterThan,
          WhereOperator.GreaterOrEqual, WhereOperator.LessThan,
          WhereOperator.LessOrEqual].includes(op.value)
        );

      case MetricKind.OneDVector:
      case MetricKind.TwoDVector:
      case MetricKind.ThreeDVector:
      case MetricKind.FourDVector:
      case MetricKind.NVector:
        // Vector operations - only equality
        return allOperators.filter(op =>
          [WhereOperator.Equals, WhereOperator.NotEquals].includes(op.value)
        );

      default:
        // Default to equality operations
        return allOperators.filter(op =>
          [WhereOperator.Equals, WhereOperator.NotEquals].includes(op.value)
        );
    }
  };

  const selectedProperty = props.category.propertyDefinitions?.find(
    prop => prop.key === newFilterKey
  );

  const operatorOptions = selectedProperty
    ? getOperatorsForValueKind(selectedProperty.valueKind)
    : [];

  const table = useReactTable({
    data: rows || [],
    columns: columns || [],
    pageCount: -1,
    manualPagination: true,
    manualFiltering: true,
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
    <div className="w-full h-full bg-card text-card-foreground   border  rounded-xl flex flex-col overflow-hidden">
      {error && (
        <div className="p-4 bg-red-600 text-white">
          Error loading entities: {error.message}
        </div>
      )}
      {!props.options?.minimal && (
        <div className="py-4 bg-secondary/20 px-3 rounded-md rounded-top flex-initial">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2 flex-initial max-w-lg w-lg">
              <FancyInput
                placeholder="Search entities..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  debouncedSetSearch(e.target.value);
                }}
                className="bg-black"
              />

            </div>

            <div className="flex items-center gap-2">
              {/* Active Filters */}
              {propertyMatches.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {propertyMatches.map((match, index) => (
                    <Badge key={index} variant="secondary" className="gap-1 pr-1">
                      <span className="font-mono text-xs">{match.key}</span>
                      <span className="text-xs opacity-70">
                        {match.operator.toLowerCase().replace(/_/g, " ")}
                      </span>
                      <span className="font-semibold text-xs">
                        {String(match.value)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-destructive/20"
                        onClick={() => removeFilter(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Active Orders */}
              {propertyOrders.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {propertyOrders.map((order, index) => (
                    <Badge key={index} variant="outline" className="gap-1 pr-1">
                      <span className="font-mono text-xs">{order.key}</span>
                      {order.direction === OrderDirection.Asc ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-destructive/20"
                        onClick={() => removeOrder(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add Order Dropdown */}
              <DropdownMenu open={isAddOrderOpen} onOpenChange={setIsAddOrderOpen}>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Add Order
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[350px] p-4">
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Add Property Order</div>

                    <div className="space-y-2">
                      <Select
                        value={newOrderKey}
                        onValueChange={setNewOrderKey}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent>
                          {props.category.propertyDefinitions?.map((prop) => (
                            <SelectItem key={prop.key} value={prop.key}>
                              {prop.label || prop.key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={newOrderDirection}
                        onValueChange={(value) => setNewOrderDirection(value as OrderDirection)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={OrderDirection.Asc}>
                            <div className="flex items-center gap-2">
                              <ArrowUp className="h-4 w-4" />
                              Ascending
                            </div>
                          </SelectItem>
                          <SelectItem value={OrderDirection.Desc}>
                            <div className="flex items-center gap-2">
                              <ArrowDown className="h-4 w-4" />
                              Descending
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        className="w-full"
                        onClick={addOrder}
                        disabled={!newOrderKey}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Order
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Add Filter Dropdown */}
              <DropdownMenu open={isAddFilterOpen} onOpenChange={setIsAddFilterOpen}>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Add Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[400px] p-4">
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Add Property Filter</div>

                    <div className="space-y-2">
                      <Select
                        value={newFilterKey}
                        onValueChange={(value) => {
                          setNewFilterKey(value);
                          // Reset operator to first available when property changes
                          const prop = props.category.propertyDefinitions?.find(p => p.key === value);
                          if (prop) {
                            const availableOps = getOperatorsForValueKind(prop.valueKind);
                            if (availableOps.length > 0) {
                              setNewFilterOperator(availableOps[0].value);
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent>
                          {props.category.propertyDefinitions?.map((prop) => (
                            <SelectItem key={prop.key} value={prop.key}>
                              {prop.label || prop.key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={newFilterOperator}
                        onValueChange={(value) =>
                          setNewFilterOperator(value as WhereOperator)
                        }
                        disabled={!newFilterKey}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {operatorOptions.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Enter value"
                        value={newFilterValue}
                        onChange={(e) => setNewFilterValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            addFilter();
                          }
                        }}
                      />

                      <Button
                        className="w-full"
                        onClick={addFilter}
                        disabled={!newFilterKey || !newFilterValue}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Filter
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline">
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
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openDialog("addpropertydefinition", {
                          category: props.category,
                        })
                      }
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Property
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={!rows || rows.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex-grow flex flex-justify-between overflow-y-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-secondary/20">
                <TableHead key={"first"} className=" ">
                  <ChevronDown className="ml-2 h-4 w-4 opacity-0" />
                </TableHead>

                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="">
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

                <EntityRow key={row.id} row={row} />
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
      <div className="flex items-center justify-end space-x-2 py-4 flex-initial px-2 border-t">
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
export default EntityList;
