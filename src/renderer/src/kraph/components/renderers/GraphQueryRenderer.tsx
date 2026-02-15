import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
  GraphQueryFragment,
  useRenderGraphQueryQuery,
  ViewKind
} from "@/kraph/api/graphql";
import { Calendar, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import React from "react";
import { ViewOptions } from "./DelegatingNodeViewRenderer";
import { PathGraph } from "./graph/PathGraph";
import { NodeListRender } from "./lists/NodeList";
import { Pairs } from "./pairs/Pairs";
import { GraphTable } from "./table/GraphTable";

export const SelectiveGraphQueryRenderer = (props: {
  graphQuery: GraphQueryFragment;
  options?: ViewOptions;
}) => {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [showDateFilter, setShowDateFilter] = React.useState(false);
  const [validFrom, setValidFrom] = React.useState<Date | undefined>(undefined);
  const [validTo, setValidTo] = React.useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);

  // Debounce search input
  const debouncedSetSearch = React.useCallback(
    React.useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setDebouncedSearch(value);
        }, 300);
      };
    }, []),
    [],
  );

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    debouncedSetSearch(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setValidFrom(undefined);
    setValidTo(undefined);
    setShowDateFilter(false);
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = debouncedSearch || validFrom || validTo;

  // Build filters object - Note: validFrom/validTo would need backend support
  const filters = React.useMemo(() => {
    const filterObj: Record<string, string> = {};
    if (debouncedSearch) {
      filterObj.search = debouncedSearch;
    }
    // Note: These would need to be supported by the GraphQL schema
    if (validFrom) {
      filterObj.validFrom = validFrom.toISOString();
    }
    if (validTo) {
      filterObj.validTo = validTo.toISOString();
    }
    return Object.keys(filterObj).length > 0 ? filterObj : undefined;
  }, [debouncedSearch, validFrom, validTo]);

  // Build pagination object
  const pagination = React.useMemo(
    () => ({
      limit: limit,
      offset: (currentPage - 1) * limit,
    }),
    [currentPage, limit],
  );

  const { data, error, loading } = useRenderGraphQueryQuery({
    variables: {
      id: props.graphQuery.id,
      filters,
      pagination,
    },
  });

  return (
    <div className="w-full h-full flex flex-col">
      {!props.options?.minimal && (
        <div className="flex flex-col py-4 gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={handleSearchChange}
                className="pl-10 bg-background"
              />
            </div>
            <Toggle
              pressed={showDateFilter}
              onPressedChange={setShowDateFilter}
              variant="outline"
              aria-label="Toggle date filter"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Date Filter
            </Toggle>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}

            {props.graphQuery.kind == ViewKind.Table ||
              (props.graphQuery.kind == ViewKind.NodeList && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage}
                    </span>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="text-sm border rounded px-2 py-1 bg-background"
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={
                        loading ||
                        (data?.renderGraphQuery.__typename === "Table"
                          ? data?.renderGraphQuery.rows.length < limit
                          : data?.renderGraphQuery.__typename === "NodeList"
                            ? data?.renderGraphQuery.nodes.length < limit
                            : false)
                      }
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </>
              ))}
          </div>

          {showDateFilter && (
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Valid From
                </label>
                <DateTimePicker
                  value={validFrom}
                  onChange={setValidFrom}
                  granularity="minute"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Valid To
                </label>
                <DateTimePicker
                  value={validTo}
                  onChange={setValidTo}
                  granularity="minute"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {loading && <div>Loading...</div>}
      {error && <div>Error: {JSON.stringify(error)}</div>}

      {data && (
        <>
          <div className="flex-grow">
            {data.renderGraphQuery.__typename === "Pairs" && (
              <Pairs pairs={data.renderGraphQuery} />
            )}

            {data.renderGraphQuery.__typename === "Path" && (
              <PathGraph path={data.renderGraphQuery} options={props.options} />
            )}

            {data.renderGraphQuery.__typename === "Table" && (
              <GraphTable
                table={data.renderGraphQuery}
                options={props.options}
              />
            )}

            {data.renderGraphQuery.__typename === "NodeList" && (
              <NodeListRender
                list={data.renderGraphQuery}
                options={props.options}
              />
            )}

            {data.renderGraphQuery.__typename !== "Pairs" &&
              data.renderGraphQuery.__typename !== "Path" &&
              data.renderGraphQuery.__typename !== "Table" &&
              data.renderGraphQuery.__typename !== "NodeList" && (
                <div>Unknown Type</div>
              )}
          </div>
        </>
      )}
    </div>
  );
};
