"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PairsFragment, useRenderGraphQueryQuery, GraphQueryFilters, GraphQueryPagination } from "@/kraph/api/graphql";
import * as React from "react";
import { ViewOptions } from "../DelegatingNodeViewRenderer";
import { Input } from "@/components/ui/input";
import { PairsViewerStateProvider, usePairsViewerState } from "./PairsViewerStateProvider";
import { Button } from "@/components/ui/button";
import { p } from "node_modules/@udecode/plate-media/dist/BasePlaceholderPlugin-Dmi28cCy";
import { DisplayWidget } from "@/command/Menu";
import { SmartModel } from "@/providers/smart/SmartModel";
import { ObjectButton } from "@/rekuest/buttons/ObjectButton";
import { SmartLink } from "@/providers/smart/builder";

export type FormValues = {
  metrics?: string[];
  kinds?: string[];
  search?: string | null;
};

export const EntityCell = ({ entity }: { entity: PairsFragment["pairs"][number]["source"] }) => {

  const { viewerState } = usePairsViewerState();

  if (entity.__typename === "Metric") {
    return (
      <TableCell>
        <Button variant="link">Metric {entity.id}</Button>
      </TableCell>
    );
  }

  if (entity.__typename === "Structure") {
    return (

      <TableCell>
        <ObjectButton objects={[{ object: entity.object, identifier: entity.category.identifier }]} ></ObjectButton>
        <SmartLink
          identifier={entity.category.identifier}
          object={entity.object}
        >
          {viewerState.showWidgets ? <DisplayWidget object={entity.object} identifier={entity.category.identifier} /> : <span>Structure {entity.id}</span>}
        </SmartLink>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <Button variant="link">{entity.id}</Button>
    </TableCell>
  );
};

export const PairRow = ({ pair }: { pair: PairsFragment["pairs"][number] }) => {
  return (
    <TableRow >
      <EntityCell entity={pair.source} />
      <EntityCell entity={pair.target} />
    </TableRow>
  );
};

export const PairsInner = ({ pairs }: { pairs?: PairsFragment }) => {

  const { viewerState, setViewerState } = usePairsViewerState();
  return (
    <div className="w-full h-full">
      <Button
        onClick={() =>
          setViewerState((s) => ({ ...s, showWidgets: !s.showWidgets }))
        }
      >
        {viewerState.showWidgets ? "Hide" : "Show"} Widgets
      </Button>

      {pairs?.pairs && pairs.pairs.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Source</TableHead>
              <TableHead className="w-[100px]">Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pairs.pairs.map((pair) => (
              <PairRow key={pair.source.id + pair.target.id} pair={pair} />
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-muted-foreground">
          No pairs available
        </div>
      )}
    </div>
  );
};


export const Pairs = (props: { pairs?: PairsFragment }) => {
  return (
    <PairsViewerStateProvider>
      <PairsInner {...props} />
    </PairsViewerStateProvider>
  );
};

export const RenderGraphQueryPairs = (props: { 
  graphQueryId: string, 
  options?: ViewOptions 
}) => {
  const [search, setSearch] = React.useState<string>("");
  const [page, setPage] = React.useState(0);
  const pageSize = 20;

  // Prepare GraphQL variables
  const filters: GraphQueryFilters = {
    search: search || undefined,
    limit: pageSize,
    offset: page * pageSize,
  };

  const paginationInput: GraphQueryPagination = {
    limit: pageSize,
    offset: page * pageSize,
  };

  const { data, loading, error } = useRenderGraphQueryQuery({
    variables: {
      id: props.graphQueryId,
      filters,
      pagination: paginationInput,
    },
  });

  // Extract the Pairs from the response
  const pairs = data?.renderGraphQuery?.__typename === "Pairs" ? data.renderGraphQuery : undefined;

  // Handle search with debouncing
  const debouncedSetSearch = React.useCallback(
    React.useMemo(
      () => {
        let timeoutId: NodeJS.Timeout;
        return (value: string) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setSearch(value);
            setPage(0); // Reset to first page on search
          }, 300);
        };
      },
      []
    ),
    []
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PairsViewerStateProvider>
      <div className="w-full h-full">
        {!props.options?.minimal && (
          <div className="flex items-center py-4 gap-2">
            <Input
              placeholder="Search pairs..."
              onChange={(event) => debouncedSetSearch(event.target.value)}
              className="max-w-sm w-full bg-background"
            />
          </div>
        )}
        <PairsInner pairs={pairs} />
        {pairs && pairs.pairs.length > 0 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {pairs.pairs.length} pairs
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0 || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={loading || (pairs.pairs.length < pageSize)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </PairsViewerStateProvider>
  );
};
