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
import { useHomePageQuery } from "../api/graphql";
import { UploadDialog } from "../components/dialogs/UploadDialog";
import DatasetList from "../components/lists/DatasetList";
import FileList from "../components/lists/FileList";
import ImageList from "../components/lists/ImageList";
import { HelpSidebar } from "@/components/sidebars/help";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { StatisticsSidebar } from "../components/sidebars/StatisticsSidebar";

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

  const handleFilesSelected = (files: File[]) => {
    files.forEach((file) => {
      const abortController = new AbortController();
      performDataLayerUpload(file, {
        signal: abortController.signal,
      })
        .then((key) => {
          return createFile(file, key);
        })
        .catch((e) => {
          console.error("Upload error:", e);
        });
    });
  };

  return (
    <PageLayout
      pageActions={
        <UploadDialog onFilesSelected={handleFilesSelected}>
          <PageActionButton className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Files
          </PageActionButton>
        </UploadDialog>
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
          // Empty State with Hero Design
          <div className="min-h-full w-full bg-gradient-to-br from-slate-50/20 to-slate-100/20 dark:from-slate-900/30 dark:to-slate-800/30 flex items-center justify-center rounded-lg">
            <div className="max-w-4xl mx-auto text-center px-6 py-16">
              {/* Hero Section */}
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-200/20 dark:border-blue-700/20">
                    <Database className="h-16 w-16 text-blue-500" />
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome to Mikro
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Images, Datasets, and Files at your fingertips. Upload and
                  manage your data with ease.
                </p>
              </div>

              {/* Action Section */}
              <div className="mt-12 space-y-6">
                <UploadDialog onFilesSelected={handleFilesSelected}>
                  <div className="flex items-center justify-center border-2 border-dashed border-muted rounded-lg h-48 cursor-pointer hover:bg-accent/50 transition-colors">
                    Drag and drop files here to upload, or click to select files
                  </div>
                </UploadDialog>
                <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Visualize Images</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    <span>Explore Stages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analyze Tables</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Dashboard View with Data
          <div className="space-y-8 p-3">
            {/* Welcome Header */}
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
              pagination={{ limit: 30 }}
              filters={{ notDerived: true }}
            />
            <Separator className="my-4" />
            <DatasetList
              pagination={{ limit: 30 }}
              filters={{ parentless: true }}
            />
            <Separator className="my-4" />
            <FileList pagination={{ limit: 30 }} />
          </div>
        )}
      </UploadWrapper>
    </PageLayout>
  );
});

export default Page;
