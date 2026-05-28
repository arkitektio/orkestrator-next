import { FormDialog } from "@/components/dialog/FormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MikroDataset, MikroFile, MikroImage } from "@/linkers";

import { useDebounce } from "@/hooks/use-debounce";
import {
  ChildrenQuery,
  DatasetFragment,
  useChildrenQuery,
  usePutDatasetsInDatasetMutation,
  usePutImagesInDatasetMutation,
} from "@/mikro-next/api/graphql";
import { ViewType } from "@/mikro-next/pages/DatasetPage";
import { useSelection } from "@/providers/selection/SelectionContext";
import { useSmartDrop } from "@/providers/smart/hooks";
import { Structure } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  File as FileIcon,
  Filter,
  Folder,
  Image as ImageIcon,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Search,
  SortAsc,
  SortDesc,
  Table
} from "lucide-react";
import { createElement, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CreateDatasetForm } from "../../forms/CreateDatasetForm";


type ViewMode = "grid" | "list" | "table";
type SortField = "name" | "created" | "size";
type SortDirection = "asc" | "desc";
type FilterType = "all" | "datasets" | "images" | "files";

interface ExplorerFilters {
  type: FilterType;
  sortField: SortField;
  sortDirection: SortDirection;
}

interface DatasetExplorerState {
  searchInput: string;
  filters: ExplorerFilters;
  viewMode: ViewMode;
  pagination: { limit: number; offset: number };
  debouncedSearch: string;
  data?: ChildrenQuery;
  loading: boolean;
  error?: { message: string } | null;
}

interface DatasetExplorerActions {
  setSearchInput: (value: string) => void;
  setFilters: React.Dispatch<React.SetStateAction<ExplorerFilters>>;
  setViewMode: (mode: ViewMode) => void;
  setPagination: React.Dispatch<React.SetStateAction<{ limit: number; offset: number }>>;
  updateFilters: (updates: Partial<ExplorerFilters>) => void;
  getTypeCount: (type: FilterType) => number;
}

interface DatasetToolbarProps extends DatasetExplorerState, DatasetExplorerActions {
  dataset: DatasetFragment;
  selection: Structure[];
  bselection: Structure[];
  refetch?: () => unknown;
}



interface DatasetListExplorerProps {
  dataset: DatasetFragment;
  setView: (type: ViewType) => void;
  explorerState: ReturnType<typeof useDatasetExplorer>;
}

type ExplorerItem = ChildrenQuery["children"][number];

const formatFileSize = (fileSizeInBytes?: number | null) => {
  if (!fileSizeInBytes) return "-";

  let size = fileSizeInBytes;
  let unitIndex = -1;
  const byteUnits = ["kB", "MB", "GB", "TB", "PB"];

  do {
    size /= 1024;
    unitIndex++;
  } while (size > 1024 && unitIndex < byteUnits.length - 1);

  return `${Math.max(size, 0.1).toFixed(1)} ${byteUnits[unitIndex]}`;
};

const getItemTypeLabel = (item: ExplorerItem) => {
  switch (item.__typename) {
    case "Dataset":
      return "Folder";
    case "Image":
      return "Image";
    case "File":
      return "File";
    default:
      return "Item";
  }
};

const getItemMeta = (item: ExplorerItem) => {
  switch (item.__typename) {
    case "Dataset":
      return item.description || "Nested dataset";
    case "Image":
      return item.latestSnapshot ? "Preview available" : "Image object";
    case "File":
      return item.contentType || formatFileSize(item.size);
    default:
      return "";
  }
};

const ExplorerItemIcon = (props: { item: ExplorerItem; className?: string }) => {
  const Icon =
    props.item.__typename === "Dataset"
      ? Folder
      : props.item.__typename === "Image"
        ? ImageIcon
        : FileIcon;

  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground",
        props.className,
      )}
    >
      {createElement(Icon, { className: "h-4 w-4" })}
    </span>
  );
};

const ExplorerItemSmart = (props: {
  item: ExplorerItem;
  children: React.ReactNode;
}) => {
  if (props.item.__typename === "Dataset") {
    return <MikroDataset.Smart object={props.item}>{props.children}</MikroDataset.Smart>;
  }

  if (props.item.__typename === "Image") {
    return <MikroImage.Smart object={props.item}>{props.children}</MikroImage.Smart>;
  }

  return <MikroFile.Smart object={props.item}>{props.children}</MikroFile.Smart>;
};

const ExplorerItemLink = (props: {
  item: ExplorerItem;
  className?: string;
  children: React.ReactNode;
}) => {
  if (props.item.__typename === "Dataset") {
    return (
      <MikroDataset.DetailLink object={props.item} className={props.className}>
        {props.children}
      </MikroDataset.DetailLink>
    );
  }

  if (props.item.__typename === "Image") {
    return (
      <MikroImage.DetailLink object={props.item} className={props.className}>
        {props.children}
      </MikroImage.DetailLink>
    );
  }

  return (
    <MikroFile.DetailLink object={props.item} className={props.className}>
      {props.children}
    </MikroFile.DetailLink>
  );
};

const ExplorerGridItem = (props: { item: ExplorerItem }) => {
  return (
    <ExplorerItemSmart item={props.item}>
      <div className="group rounded-xl border border-border/60 bg-background/70 p-3 transition-colors hover:bg-muted/30">
        <div className="flex flex-col items-start gap-3">
          <ExplorerItemIcon item={props.item} className="h-12 w-12 rounded-xl" />
          <div className="min-w-0">
            <ExplorerItemLink
              item={props.item}
              className="line-clamp-2 text-sm font-medium text-foreground"
            >
              {props.item.name}
            </ExplorerItemLink>
            <p className="mt-1 text-xs text-muted-foreground">
              {getItemTypeLabel(props.item)}
            </p>
          </div>
        </div>
      </div>
    </ExplorerItemSmart>
  );
};

const ExplorerListItem = (props: { item: ExplorerItem; detailed?: boolean }) => {
  return (
    <ExplorerItemSmart item={props.item}>
      <div
        className={cn(
          "grid items-center gap-3 border-b border-border/50 px-3 py-2 transition-colors hover:bg-muted/30",
          props.detailed
            ? "grid-cols-[minmax(0,1.6fr)_120px_minmax(0,0.9fr)]"
            : "grid-cols-[minmax(0,1fr)_120px]",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <ExplorerItemIcon item={props.item} />
          <div className="min-w-0">
            <ExplorerItemLink
              item={props.item}
              className="block truncate text-sm font-medium text-foreground"
            >
              {props.item.name}
            </ExplorerItemLink>
            <p className="truncate text-xs text-muted-foreground">
              {getItemMeta(props.item)}
            </p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">{getItemTypeLabel(props.item)}</div>
        {props.detailed ? (
          <div className="truncate text-xs text-muted-foreground">
            {props.item.__typename === "File"
              ? formatFileSize(props.item.size)
              : getItemMeta(props.item)}
          </div>
        ) : null}
      </div>
    </ExplorerItemSmart>
  );
};

export const DatasetListExplorer = (props: DatasetListExplorerProps) => {
  const [putDatasets] = usePutDatasetsInDatasetMutation({
    refetchQueries: ['Children'],
    awaitRefetchQueries: true,
  });
  const [putImages] = usePutImagesInDatasetMutation({
    refetchQueries: ['Children'],
    awaitRefetchQueries: true,
  });
  const { selection, bselection } = useSelection();

  // Use the explorer state passed from parent
  const {
    filters,
    viewMode,
    loading,
    error,
    filteredAndSortedData,
    refetch,
    debouncedSearch,
  } = props.explorerState;

  const totalItems = filteredAndSortedData.length;

  const [{ isOver, canDrop }, dropRef] = useSmartDrop(
    async (structures: Structure[]) => {
      const imageIds = structures
        .filter((item) => item.identifier === "@mikro/image")
        .map((item) => item.object.id);
      const datasetIds = structures
        .filter((item) => item.identifier === "@mikro/dataset")
        .map((item) => item.object.id)
        .filter((id) => id !== props.dataset.id);

      try {
        if (imageIds.length > 0) {
          await putImages({
            variables: {
              selfs: imageIds,
              other: props.dataset.id,
            },
          });
        }

        if (datasetIds.length > 0) {
          await putDatasets({
            variables: {
              selfs: datasetIds,
              other: props.dataset.id,
            },
          });
        }

        if (imageIds.length > 0 || datasetIds.length > 0) {
          refetch?.();
        }
      } catch (dropError) {
        console.error("Failed to add dropped items to dataset:", dropError);
      }
    },
    [props.dataset.id, putDatasets, putImages, refetch],
  );

  const explorerDropRef = useCallback(
    (node: HTMLDivElement | null) => {
      dropRef(node);
    },
    [dropRef],
  );

  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-background/80 shadow-sm">
      <div className="border-b border-border/70 bg-background/50 px-4 py-1">
          <DatasetExplorerToolbar
            {...props.explorerState}
            dataset={props.dataset}
            selection={selection}
            bselection={bselection}
          />
      </div>

      <div
        className="relative flex min-h-0 w-full flex-1 flex-col"
        ref={explorerDropRef}
      >
        {canDrop ? (
          <div
            className={cn(
              "pointer-events-none absolute inset-3 z-20 rounded-2xl border border-dashed border-emerald-500/60 bg-emerald-500/8 transition-opacity",
              isOver ? "opacity-100" : "opacity-70",
            )}
          >
            <div className="absolute inset-x-6 top-6 rounded-xl border border-emerald-500/40 bg-background/95 px-4 py-3 shadow-lg backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                  <Folder className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {isOver ? "Release to move items into this dataset" : "Drop images or folders here"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Supported: images and nested datasets
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex min-h-0 w-full flex-1 flex-col">
          <div className="border-b border-border/70 px-4 py-2 text-xs text-muted-foreground">
            {viewMode === "grid" ? "Large icons" : viewMode === "list" ? "List" : "Details"}
          </div>

          <div className="flex-1 overflow-auto p-2">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {filteredAndSortedData.map((child) => (
                  <ExplorerGridItem key={child.id} item={child} />
                ))}
              </div>
            ) : null}

            {viewMode === "list" ? (
              <div>
                {filteredAndSortedData.map((child) => (
                  <ExplorerListItem key={child.id} item={child} />
                ))}
              </div>
            ) : null}

            {viewMode === "table" ? (
              <div>
                <div className="grid grid-cols-[minmax(0,1.6fr)_120px_minmax(0,0.9fr)] gap-3 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  <div>Name</div>
                  <div>Type</div>
                  <div>Details</div>
                </div>
                {filteredAndSortedData.map((child) => (
                  <ExplorerListItem key={child.id} item={child} detailed />
                ))}
              </div>
            ) : null}

            {loading && (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-12 text-red-500">
                {error.message}
              </div>
            )}

            {filteredAndSortedData.length === 0 && !loading && !error && (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Folder className="mb-3 h-12 w-12" />
                <div className="text-lg font-medium">This folder is empty</div>
                <div className="mt-1 text-sm">
                  {debouncedSearch || filters.type !== "all"
                    ? "Try adjusting the search or active filter"
                    : "Drag images or folders here to populate this dataset"}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border/70 px-4 py-2 text-xs text-muted-foreground">
            <span>{totalItems} item(s)</span>
            <span>{filters.type === "all" ? "All content" : `Filtered to ${filters.type}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toolbar component that can be used in page headers
export const DatasetExplorerToolbar = ({
  searchInput,
  setSearchInput,
  filters,
  updateFilters,
  viewMode,
  setViewMode,
  debouncedSearch,
  dataset,
  selection,
  bselection,
  pagination,
  setPagination,
  data,
  getTypeCount,
  refetch
}: DatasetToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl py-2 ">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search files and folders..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border-border/70 bg-background/80 pl-10"
          />
          {searchInput !== debouncedSearch && (
            <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin" />
          )}
        </div>

        {/* Type Filter */}
        <Select value={filters.type} onValueChange={(value: FilterType) => updateFilters({ type: value })}>
          <SelectTrigger className="w-40 border-border/70 bg-background/80">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              All ({getTypeCount("all")})
            </SelectItem>
            <SelectItem value="datasets">
              <div className="flex items-center">
                <Folder className="w-4 h-4 mr-2" />
                Datasets ({getTypeCount("datasets")})
              </div>
            </SelectItem>
            <SelectItem value="images">
              <div className="flex items-center">
                <ImageIcon className="w-4 h-4 mr-2" />
                Images ({getTypeCount("images")})
              </div>
            </SelectItem>
            <SelectItem value="files">
              <div className="flex items-center">
                <FileIcon className="w-4 h-4 mr-2" />
                Files ({getTypeCount("files")})
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Options */}
        <Select
          value={`${filters.sortField}_${filters.sortDirection}`}
          onValueChange={(value) => {
            const [field, direction] = value.split('_') as [SortField, SortDirection];
            updateFilters({ sortField: field, sortDirection: direction });
          }}
        >
          <SelectTrigger className="w-48 border-border/70 bg-background/80">
            {filters.sortDirection === "asc" ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            <SelectItem value="created_desc">Newest First</SelectItem>
            <SelectItem value="created_asc">Oldest First</SelectItem>
            <SelectItem value="size_desc">Largest First</SelectItem>
            <SelectItem value="size_asc">Smallest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* New Dataset Button */}
        <FormDialog
          trigger={
            <Button variant="outline" size="sm" className="border-border/70 bg-background/80">
              <Plus className="w-4 h-4 mr-2" />
              New Dataset
            </Button>
          }
          onSubmit={() => {
            // Refetch will be handled by the mutation
          }}
        >
          <CreateDatasetForm parentDatasetId={dataset.id} />
        </FormDialog>

        <Separator orientation="vertical" className="h-6" />

        {/* Selection Info */}
        {(selection.length > 0 || bselection.length > 0) && (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {selection.length} selected
            </Badge>
            {bselection.length > 0 && (
              <Badge variant="destructive">
                +{bselection.length}
              </Badge>
            )}
          </div>
        )}

        {/* Bulk Actions */}
        {selection.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log("Bulk actions for:", selection);
            }}
          >
            Actions <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* View Mode Toggles */}
        <div className="flex items-center rounded-lg border border-border/70 bg-background/80 p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <Table className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="sm"
          className="border border-transparent bg-background/80 hover:border-border/70"
          onClick={() => {
            // Use refetch from the hook instead of page reload
            if (refetch) {
              refetch();
            } else {
              window.location.reload();
            }
          }}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>

        {/* Pagination */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border/70 bg-background/80"
            onClick={() => {
              const newOffset = Math.max(0, pagination.offset - pagination.limit);
              setPagination({
                limit: pagination.limit,
                offset: newOffset,
              });
            }}
            disabled={pagination.offset <= 0}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border/70 bg-background/80"
            onClick={() => {
              const newOffset = pagination.offset + pagination.limit;
              setPagination({
                limit: pagination.limit,
                offset: newOffset,
              });
            }}
            disabled={
              data?.children && data.children.length < pagination.limit
            }
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Hook to manage dataset explorer state
export const useDatasetExplorer = (dataset: DatasetFragment) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize all states from URL params or defaults
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || ''
  );

  const [filters, setFilters] = useState<ExplorerFilters>({
    type: (searchParams.get('type') as FilterType) || 'all',
    sortField: (searchParams.get('sortField') as SortField) || 'name',
    sortDirection: (searchParams.get('sortDirection') as SortDirection) || 'asc',
  });

  const [viewMode, setViewMode] = useState<ViewMode>(
    (searchParams.get('viewMode') as ViewMode) || 'table'
  );

  const [pagination, setPagination] = useState({
    limit: parseInt(searchParams.get('limit') || '30'),
    offset: parseInt(searchParams.get('offset') || '0'),
  });

  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, loading, error, refetch } = useChildrenQuery({
    variables: {
      id: dataset.id,
      pagination: pagination,
      filters: {
        search: debouncedSearch || undefined,
      },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  // Sync state to URL parameters
  useEffect(() => {
    const newParams = new URLSearchParams();

    if (searchInput) newParams.set('search', searchInput);
    if (filters.type !== 'all') newParams.set('type', filters.type);
    if (filters.sortField !== 'name') newParams.set('sortField', filters.sortField);
    if (filters.sortDirection !== 'asc') newParams.set('sortDirection', filters.sortDirection);
    if (viewMode !== 'table') newParams.set('viewMode', viewMode);
    if (pagination.limit !== 30) newParams.set('limit', pagination.limit.toString());
    if (pagination.offset !== 0) newParams.set('offset', pagination.offset.toString());

    setSearchParams(newParams, { replace: true });
  }, [searchInput, filters, viewMode, pagination, setSearchParams]);

  const filteredAndSortedData = (() => {
    const children = data?.children ?? [];
    let items = [...children];

    // Filter by type (client-side for now)
    if (filters.type !== "all") {
      items = items.filter((item) => {
        switch (filters.type) {
          case "datasets": return item.__typename === "Dataset";
          case "images": return item.__typename === "Image";
          case "files": return item.__typename === "File";
          default: return true;
        }
      });
    }

    // Sort items (client-side for now)
    items.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (filters.sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "created":
          aValue = a.__typename === "Dataset" && "createdAt" in a ? new Date(a.createdAt as string).getTime() : a.name.toLowerCase();
          bValue = b.__typename === "Dataset" && "createdAt" in b ? new Date(b.createdAt as string).getTime() : b.name.toLowerCase();
          break;
        case "size":
          aValue = 0;
          bValue = 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return filters.sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return filters.sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return items;
  })();

  const setSearchInputValue = useCallback((value: string) => {
    setSearchInput(value);
    setPagination((previous) =>
      previous.offset === 0 ? previous : { ...previous, offset: 0 },
    );
  }, []);

  const updateFilters = useCallback((updates: Partial<ExplorerFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
    // Reset pagination when filters change
    setPagination({ limit: 30, offset: 0 });
  }, []);



  const getTypeIcon = (typename: string) => {
    switch (typename) {
      case "Dataset": return <Folder className="w-4 h-4" />;
      case "Image": return <ImageIcon className="w-4 h-4" />;
      case "File": return <FileIcon className="w-4 h-4" />;
      default: return <FileIcon className="w-4 h-4" />;
    }
  };

  const getTypeCount = (type: FilterType) => {
    if (type === "all") return data?.children?.length || 0;
    return data?.children?.filter(item => {
      switch (type) {
        case "datasets": return item.__typename === "Dataset";
        case "images": return item.__typename === "Image";
        case "files": return item.__typename === "File";
        default: return true;
      }
    }).length || 0;
  };

  return {
    // State
    searchInput,
    filters,
    viewMode,
    pagination,
    debouncedSearch,
    data,
    loading,
    error,
    filteredAndSortedData,

    // Actions
    setSearchInput: setSearchInputValue,
    setFilters,
    setViewMode,
    setPagination,
    updateFilters,
    getTypeCount,
    getTypeIcon,
    refetch,
  };
};
