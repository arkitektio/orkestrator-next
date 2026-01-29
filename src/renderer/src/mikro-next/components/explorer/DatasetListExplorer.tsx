import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/ui/dropzone";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FormDialog } from "@/components/dialog/FormDialog";
import { MikroDataset, MikroImage, MikroFile } from "@/linkers";

import {
  DatasetFragment,
  useChildrenQuery,
  usePutDatasetsInDatasetMutation,
  usePutImagesInDatasetMutation,
} from "@/mikro-next/api/graphql";
import { ViewType } from "@/mikro-next/pages/DatasetPage";
import {
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  List,
  Table,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronDown,
  Folder,
  Image as ImageIcon,
  File as FileIcon,
  RefreshCw,
  Plus
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams } from "react-router-dom";
import DatasetCard from "../cards/DatasetCard";
import FileCard from "../cards/FileCard";
import ImageCard from "../cards/ImageCard";
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
  data: any;
  loading: boolean;
  error: any;
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
  selection: any[];
  bselection: any[];
  refetch?: () => void;
}



interface DatasetListExplorerProps {
  dataset: DatasetFragment;
  setView: (type: ViewType) => void;
  explorerState: ReturnType<typeof useDatasetExplorer>;
}

export const DatasetListExplorer = (props: DatasetListExplorerProps) => {
  const [putDatasets] = usePutDatasetsInDatasetMutation({
    refetchQueries: ['Children'],
    awaitRefetchQueries: true,
  });
  const [putImages] = usePutImagesInDatasetMutation({
    refetchQueries: ['Children'],
    awaitRefetchQueries: true,
  });

  // Use the explorer state passed from parent
  const {
    filters,
    viewMode,
    loading,
    error,
    filteredAndSortedData,
    getTypeIcon,
    refetch,
    debouncedSearch,
  } = props.explorerState;

  return (
    <div className="h-full w-full flex flex-col">

      {/* Toolbar moved to page header */}

      {/* Content Area */}
      <div className="flex-1 overflow-auto">

        {/* Quick Stats */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
          <span>{filteredAndSortedData.length} items</span>
          {debouncedSearch && (
            <span>• Filtered by &quot;{debouncedSearch}&quot;</span>
          )}
          {filters.type !== "all" && (
            <span>• Showing {filters.type} only</span>
          )}
        </div>

        {/* Items Grid/List */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredAndSortedData.map((child) => {
              return (
                <div key={child.id} className="relative group">
                  {/* Render appropriate card - cards already have Smart wrappers */}
                  {child.__typename === "Dataset" && (
                    <DatasetCard item={child} className="h-20 w-full" />
                  )}
                  {child.__typename === "Image" && (
                    <ImageCard item={child} className="h-20 w-full" />
                  )}
                  {child.__typename === "File" && (
                    <FileCard item={child} className="h-20 w-full" />
                  )}
                </div>
              );
            })}
          </div>
        )}          {viewMode === "list" && (
          <div className="space-y-2">
            {filteredAndSortedData.map((child) => {
              // Each card type has its own Smart wrapper, so we create simple list items
              // wrapped in the appropriate Smart component
              const SmartComponent = child.__typename === "Dataset" ? MikroDataset.Smart :
                child.__typename === "Image" ? MikroImage.Smart :
                  child.__typename === "File" ? MikroFile.Smart :
                    MikroDataset.Smart; // fallback

              return (
                <SmartComponent key={child.id} object={child.id}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border transition-colors hover:bg-muted/50">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {getTypeIcon(child.__typename || "")}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{child.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {child.__typename}
                        </div>
                      </div>
                    </div>
                  </div>
                </SmartComponent>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12 text-red-500">
            {error.message}
          </div>
        )}

        {filteredAndSortedData.length === 0 && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Folder className="w-12 h-12 mb-2" />
            <div className="text-lg font-medium">No items found</div>
            <div className="text-sm">
              {debouncedSearch || filters.type !== "all"
                ? "Try adjusting your search or filters"
                : "This dataset appears to be empty"}
            </div>
          </div>
        )}
      </div>

      {/* Drop Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <DropZone
          accepts={["item:@mikro/image", "list:@mikro/image"]}
          className="border border-dashed border-muted-foreground/25 cursor-pointer rounded-lg p-6 text-center hover:border-muted-foreground/50 hover:bg-muted/25 transition-colors"
          onDrop={async (item) => {
            try {
              await putImages({
                variables: {
                  selfs: item.map((i) => i.id),
                  other: props?.dataset?.id,
                },
              });
              // The refetchQueries should handle this, but we can also manually refetch
              refetch();
            } catch (error) {
              console.error('Failed to add images to dataset:', error);
            }
          }}
          canDropLabel={
            <div className="flex flex-col items-center space-y-2">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <div>Drop images here to add to this dataset</div>
            </div>
          }
          overLabel={"Release to add images"}
        />
        <DropZone
          accepts={["item:@mikro/dataset", "list:@mikro/dataset"]}
          className="border border-dashed border-muted-foreground/25 cursor-pointer rounded-lg p-6 text-center hover:border-muted-foreground/50 hover:bg-muted/25 transition-colors"
          onDrop={async (item) => {
            try {
              await putDatasets({
                variables: {
                  selfs: item.map((i) => i.id),
                  other: props?.dataset?.id,
                },
              });
              // The refetchQueries should handle this, but we can also manually refetch
              refetch();
            } catch (error) {
              console.error('Failed to add datasets to dataset:', error);
            }
          }}
          canDropLabel={
            <div className="flex flex-col items-center space-y-2">
              <Folder className="w-8 h-8 text-muted-foreground" />
              <div>Drop datasets here to add to this dataset</div>
            </div>
          }
          overLabel={"Release to add datasets"}
        />
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
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search files and folders..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 w-64"
          />
          {searchInput !== debouncedSearch && (
            <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin" />
          )}
        </div>

        {/* Type Filter */}
        <Select value={filters.type} onValueChange={(value: FilterType) => updateFilters({ type: value })}>
          <SelectTrigger className="w-40">
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
          <SelectTrigger className="w-48">
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

      <div className="flex items-center space-x-2">
        {/* New Dataset Button */}
        <FormDialog
          trigger={
            <Button variant="outline" size="sm">
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
        <div className="flex items-center space-x-1">
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
    (searchParams.get('viewMode') as ViewMode) || 'grid'
  );

  const [pagination, setPagination] = useState({
    limit: parseInt(searchParams.get('limit') || '30'),
    offset: parseInt(searchParams.get('offset') || '0'),
  });

  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync state to URL parameters
  useEffect(() => {
    const newParams = new URLSearchParams();

    if (searchInput) newParams.set('search', searchInput);
    if (filters.type !== 'all') newParams.set('type', filters.type);
    if (filters.sortField !== 'name') newParams.set('sortField', filters.sortField);
    if (filters.sortDirection !== 'asc') newParams.set('sortDirection', filters.sortDirection);
    if (viewMode !== 'grid') newParams.set('viewMode', viewMode);
    if (pagination.limit !== 30) newParams.set('limit', pagination.limit.toString());
    if (pagination.offset !== 0) newParams.set('offset', pagination.offset.toString());

    setSearchParams(newParams, { replace: true });
  }, [searchInput, filters, viewMode, pagination, setSearchParams]);

  // Reset pagination offset when search or filters change
  useEffect(() => {
    refetch();
    if (pagination.offset > 0) {
      setPagination(prev => ({ ...prev, offset: 0 }));
    }
  }, [debouncedSearch, filters.type, filters.sortField, filters.sortDirection]);

  // Use debounced search for server-side filtering (other filters will be client-side for now)
  const { data, loading, error, refetch } = useChildrenQuery({
    variables: {
      id: dataset.id,
      pagination: pagination,
      filters: {
        search: debouncedSearch || undefined,
        // TODO: Add type filtering when server supports it
        // TODO: Add sorting when server supports it
      },
    },
    // Enable polling for automatic updates (optional, can be disabled for performance)
    // pollInterval: 30000, // Poll every 30 seconds
    // Refetch on focus
    notifyOnNetworkStatusChange: true,
    // Fetch policy to ensure fresh data
    fetchPolicy: 'cache-and-network',
    // Error policy
    errorPolicy: 'all',
  });

  // Refetch when dataset ID changes
  useEffect(() => {
    refetch();
  }, [dataset.id, refetch, searchParams]);

  // Server-side search, client-side type filtering and sorting (until server supports them)
  const filteredAndSortedData = useCallback(() => {
    if (!data?.children) return [];

    let items = [...data.children];

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
  }, [data?.children, filters])();

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
    setSearchInput,
    setFilters,
    setViewMode,
    setPagination,
    updateFilters,
    getTypeCount,
    getTypeIcon,
    refetch,
  };
};
