import { PageLayout } from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";
import { UploadWrapper } from "@/components/upload/wrapper";
import { useBigFileUpload } from "@/datalayer/hooks/useUpload";
import { useCreateFile } from "@/lib/mikro/hooks";

import { asParamlessRoute } from "@/app/routes/ParamlessRoute";
import { CommandMenu } from "@/command/Menu";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageActionButton } from "@/components/ui/page-action-button";
import { BarChart3, Database, Network, TrendingUp, Upload } from "lucide-react";
import { Ordering, useHomePageQuery } from "../api/graphql";
import { UploadDialog } from "../components/dialogs/UploadDialog";
import DatasetList from "../components/lists/DatasetList";
import FileList from "../components/lists/FileList";
import ImageList from "../components/lists/ImageList";
import { HelpSidebar } from "@/components/sidebars/help";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { StatisticsSidebar } from "../components/sidebars/StatisticsSidebar";
import { useUpload } from "@/providers/upload/UploadProvider";
import { DateTimeRangePicker } from "@/components/ui/date-time-range-picker";

// 1. Import from nuqs
import { parseAsIsoDateTime, useQueryState } from "nuqs";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRepresentationScreenProps { }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Page = asParamlessRoute(useHomePageQuery, ({ data, refetch }) => {
  const performDataLayerUpload = useBigFileUpload();
  const createFile = useCreateFile({
    onCompleted: () => {
      refetch();
    },
  });
  const { startUpload } = useUpload();

  // 2. Use the hook. It automatically detects it's running inside React Router
  // via the adapter we added in Step 1.
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
          <div className="min-h-full w-full bg-gradient-to-br from-slate-50/20 to-slate-100/20 dark:from-slate-900/30 dark:to-slate-800/30 flex items-center justify-center rounded-lg">
            {/* ... (Hero content omitted for brevity) ... */}
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
