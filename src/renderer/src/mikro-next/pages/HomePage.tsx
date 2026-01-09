import { PageLayout } from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";
import { UploadWrapper } from "@/components/upload/wrapper";
import { useBigFileUpload } from "@/datalayer/hooks/useUpload";
import { useCreateFile } from "@/lib/mikro/hooks";

import { asParamlessRoute } from "@/app/routes/ParamlessRoute";
import { CommandMenu } from "@/command/Menu";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { HelpSidebar } from "@/components/sidebars/help";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateTimeRangePicker } from "@/components/ui/date-time-range-picker";
import { PageActionButton } from "@/components/ui/page-action-button";
import { useUpload } from "@/providers/upload/UploadProvider";
import { BarChart3, Database, Network, TrendingUp, Upload } from "lucide-react";
import { Ordering, useHomePageQuery } from "../api/graphql";
import { UploadDialog } from "../components/dialogs/UploadDialog";
import DatasetList from "../components/lists/DatasetList";
import FileList from "../components/lists/FileList";
import ImageList from "../components/lists/ImageList";
import { StatisticsSidebar } from "../components/sidebars/StatisticsSidebar";

// 1. Import from nuqs
import { parseAsIsoDateTime, useQueryState } from "nuqs";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRepresentationScreenProps { }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Page = asParamlessRoute(useHomePageQuery, ({ data }) => {
  const performDataLayerUpload = useBigFileUpload();
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

  const temporalFilter = {
    createdAfter: createdAfter ?? undefined,
    createdBefore: createdBefore ?? undefined,
  };

  const handleFilesSelected = (files: File[]) => {
    files.forEach((file) => {
      startUpload(
        file,
        async (file, { onProgress, signal }) => {
          return await performDataLayerUpload(file, {
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
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Database className="h-8 w-8 text-blue-500" />
                Your Data
              </CardTitle>
              <CardDescription className="text-lg">
                Your recently uploaded and managed data
              </CardDescription>
            </CardHeader>

            <ImageList
              filters={{ notDerived: true, ...temporalFilter }}
            />
            <DatasetList
              filters={{ parentless: true, ...temporalFilter }}
            />
            <Separator className="my-4" />
            <FileList order={{ createdAt: Ordering.Desc }} filters={{ ...temporalFilter }} />
          </div>
        )}
      </UploadWrapper>
    </PageLayout>
  );
});

export default Page;
