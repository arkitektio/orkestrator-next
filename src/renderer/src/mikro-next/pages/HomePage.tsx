import { PageLayout } from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";
import { UploadWrapper } from "@/components/upload/wrapper";
import { useCreateFile } from "@/lib/mikro/hooks";

import { asParamlessRoute } from "@/app/routes/ParamlessRoute";
import { CommandMenu } from "@/command/Menu";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { HelpSidebar } from "@/components/sidebars/help";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CollapsibleSearch } from "@/components/ui/collapsible-search";
import { DateTimeRangePicker } from "@/components/ui/date-time-range-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageActionButton } from "@/components/ui/page-action-button";
import { useUpload } from "@/providers/upload/UploadProvider";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpWideNarrow,
  BarChart3,
  Database,
  Network,
  TrendingUp,
  Upload,
} from "lucide-react";
import {
  DatasetOrder,
  FileOrder,
  ImageOrder,
  Ordering,
  useHomePageQuery,
} from "../api/graphql";
import { UploadDialog } from "../components/dialogs/UploadDialog";
import DatasetList from "../components/lists/DatasetList";
import FileList from "../components/lists/FileList";
import ImageList from "../components/lists/ImageList";
import { StatisticsSidebar } from "../components/sidebars/StatisticsSidebar";
import { useMikroBigFileUpload } from "@/datalayer/hooks/useMikroBigFileUpload";
import { parseAsIsoDateTime, parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";


export interface IRepresentationScreenProps { }


const Page = asParamlessRoute(useHomePageQuery, ({ data }) => {
  const performDataLayerUpload = useMikroBigFileUpload();
  const createFile = useCreateFile();
  const { startUpload } = useUpload();

  const [createdAfter, setCreatedAfter] = useQueryState(
    "after",
    parseAsIsoDateTime.withDefault(undefined)
  );

  const [createdBefore, setCreatedBefore] = useQueryState(
    "before",
    parseAsIsoDateTime.withDefault(undefined)
  );

  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));

  const [sortField, setSortField] = useQueryState(
    "sort",
    parseAsStringLiteral(["createdAt", "name"] as const).withDefault("createdAt")
  );

  const [sortDirection, setSortDirection] = useQueryState(
    "dir",
    parseAsStringLiteral(["ASC", "DESC"] as const).withDefault("DESC")
  );

  const temporalFilter = {
    createdAfter: createdAfter ?? undefined,
    createdBefore: createdBefore ?? undefined,
  };

  const searchTerm = search.trim();
  const searchFilter = searchTerm ? { search: searchTerm } : {};

  const ordering = Ordering[sortDirection === "ASC" ? "Asc" : "Desc"];
  // Image/File/Dataset orders are @oneOf inputs that share createdAt/name keys.
  const imageOrdering: ImageOrder[] = [{ [sortField]: ordering }];
  const fileOrdering: FileOrder[] = [{ [sortField]: ordering }];
  const datasetOrdering: DatasetOrder[] = [{ [sortField]: ordering }];

  const sortFieldLabels = { createdAt: "Date created", name: "Name" } as const;
  // Defaults the dashboard ships with — a tag is shown when the user diverges.
  const isCustomOrder = sortField !== "createdAt" || sortDirection !== "DESC";

  const handleFilesSelected = (files: File[]) => {
    files.forEach((file) => {
      startUpload(
        file,
        async (file, { id, onProgress, signal }) => {
          return await performDataLayerUpload(file, {
            id,
            signal,
            onProgress,
          });
        },
        async (file, key) => {
          return await createFile(file, key);
        }
      ).catch((e) => {
        console.error("Upload error:", e);
      });
    });
  };

  return (
    <PageLayout
      pageActions={
        <>
          <UploadDialog onFilesSelected={handleFilesSelected}>
            <PageActionButton className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Files
            </PageActionButton>
          </UploadDialog>

          {/* Collapsible search drives the `search` filter on every list */}
          <CollapsibleSearch
            value={search}
            onChange={(value) => setSearch(value || null)}
            placeholder="Search images, datasets and files…"
          />

          {/* Ordering: field + direction in a dropdown, shared across lists.
              A tag surfaces the active sort whenever it differs from default. */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
                {isCustomOrder && (
                  <Badge variant="secondary" className="gap-1">
                    {sortFieldLabels[sortField]}
                    {sortDirection === "ASC" ? (
                      <ArrowUpWideNarrow />
                    ) : (
                      <ArrowDownWideNarrow />
                    )}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={sortField}
                onValueChange={(value) =>
                  setSortField(value as "createdAt" | "name")
                }
              >
                <DropdownMenuRadioItem value="createdAt">
                  Date created
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Direction</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={sortDirection}
                onValueChange={(value) =>
                  setSortDirection(value as "ASC" | "DESC")
                }
              >
                <DropdownMenuRadioItem value="DESC">
                  Descending
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ASC">
                  Ascending
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 3. Picker updates the URL params */}
          <DateTimeRangePicker
            // Optional: bind value to keep picker UI in sync on page refresh
            initialDateFrom={createdAfter || null}
            initialDateTo={createdBefore || null}
            onUpdate={({ range }) => {
              setCreatedAfter(range.from || null);
              setCreatedBefore(range.to || null);
            }}
          />
        </>
      }
      sidebars={
        <MultiSidebar map={{
          Statistics: <StatisticsSidebar />,
          Help: <HelpSidebar />
        }} />
      }
      title="Home"
    >
      <CommandMenu />



      <UploadWrapper
        uploadFile={performDataLayerUpload}
        createFile={createFile}
      >
        {data?.images?.length == 0 && data.files.length == 0 ? (
          <div className="min-h-full w-full  flex items-center justify-center rounded-lg">
            <div className="max-w-4xl mx-auto text-center px-6 py-16">
              {/* Hero Section */}
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 ">
                    <Database className="h-16 w-16 text-primary" />
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Welcome to Mikro
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Your powerful data visualization and knowledge graph platform.
                  Create your first graph to start exploring and organizing your
                  data relationships.
                </p>
              </div>




              {/* Action Section */}
              <div className="mt-12 space-y-6">
                <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Visualize Relationships</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    <span>Build Connections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analyze Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 p-3">
            <CardHeader className="px-0">
              <CardTitle className="text-3xl flex items-center gap-3">
                <Database className="h-8 w-8 text-primary" />
                Your Data
              </CardTitle>
              <CardDescription className="text-lg">
                Your recently uploaded and managed data
              </CardDescription>
            </CardHeader>

            <ImageList
              filters={{ notDerived: true, ...temporalFilter, ...searchFilter }}
              ordering={imageOrdering}
            />
            <DatasetList
              filters={{ parentless: true, ...temporalFilter, ...searchFilter }}
              ordering={datasetOrdering}
            />
            <Separator className="my-4" />
            <FileList
              filters={{ ...temporalFilter, ...searchFilter }}
              ordering={fileOrdering}
            />
          </div>
        )}
      </UploadWrapper>
    </PageLayout>
  );
});

export default Page;
