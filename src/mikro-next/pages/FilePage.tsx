import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadButton } from "@/components/ui/download-button";
import { Image } from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import { useResolve } from "@/datalayer/hooks/useResolve";
import { MikroFile, MikroImage } from "@/linkers";
import { DownloadIcon, FileIcon, FolderIcon, ImageIcon, UserIcon } from "lucide-react";
import { useGetFileQuery } from "../api/graphql";
import { ProvenanceSidebar } from "../components/sidebars/ProvenanceSidebar";

export default asDetailQueryRoute(useGetFileQuery, ({ data }) => {
  const resolve = useResolve();

  // Get file extension for icon display
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const fileExtension = getFileExtension(data.file.name);

  return (
    <MikroFile.ModelPage
      actions={<MikroFile.Actions object={data.file.id} />}
      object={data.file.id}
      title={data.file.name}
      sidebars={
        <MultiSidebar
          map={{
            Comments: <MikroFile.Komments object={data.file.id} />,
            Provenance: <ProvenanceSidebar items={data?.file.provenanceEntries} />,
          }}
        />
      }
      pageActions={
        <DownloadButton
          url={resolve(data.file.store.presignedUrl)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <DownloadIcon className="h-4 w-4" />
          Download
        </DownloadButton>
      }
    >
      {/* Enhanced File Header */}
      <Card className="mb-6 border-none shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <FileIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  <MikroFile.DetailLink object={data.file.id} className="hover:text-blue-600 transition-colors">
                    {data?.file?.name}
                  </MikroFile.DetailLink>
                </CardTitle>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <UserIcon className="h-4 w-4" />
                  <span>@ {data.file.organization.slug}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs font-mono">
              {fileExtension.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderIcon className="h-4 w-4" />
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
              {data?.file?.store.bucket}/{data?.file?.store.key}
            </code>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* Enhanced Image Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Converted Images</h2>
          {data?.file?.views?.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {data.file.views.length} {data.file.views.length === 1 ? 'image' : 'images'}
            </Badge>
          )}
        </div>

        <ListRender array={data?.file?.views} title="">
          {(view) => (
            <MikroImage.Smart object={view.image?.id} key={view.image?.id}>
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  {view.image.latestSnapshot?.store.presignedUrl ? (
                    <Image
                      src={resolve(view.image.latestSnapshot?.store.presignedUrl)}
                      className="object-cover h-full w-full transition-all duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  {/* Overlay with improved gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <MikroImage.DetailLink
                      className="font-semibold text-lg block hover:text-blue-300 transition-colors line-clamp-2"
                      object={view.image.id}
                    >
                      {view.image?.name}
                    </MikroImage.DetailLink>

                    {view.seriesIdentifier && (
                      <Badge className="mt-2 bg-blue-600/90 hover:bg-blue-600 text-white border-0">
                        Series: {view.seriesIdentifier}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </MikroImage.Smart>
          )}
        </ListRender>
      </div>
    </MikroFile.ModelPage>
  );
});
