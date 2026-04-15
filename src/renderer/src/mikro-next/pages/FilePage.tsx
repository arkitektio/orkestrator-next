import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMikroBigFileDownload } from "@/datalayer/hooks/useMikroBigFileDownload";
import { MikroFile, MikroImage } from "@/linkers";
import { useDownload } from "@/providers/download/DownloadProvider";
import { DownloadIcon, FileIcon, ImageIcon } from "lucide-react";
import { useGetFileQuery } from "../api/graphql";
import { WithMikroMediaUrl } from "@/lib/datalayer/mikroAccess";

export const FilePage = asDetailQueryRoute(useGetFileQuery, ({ data }) => {
  const download = useMikroBigFileDownload();
  const { startDownload } = useDownload();

  // Get file extension for icon display
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const fileExtension = getFileExtension(data.file.name);

  return (
    <MikroFile.ModelPage
      actions={<MikroFile.Actions object={data.file} />}
      object={data.file}
      title={data.file.name}
      pageActions={
        <>
          <Button
            onClick={() => {
              startDownload(data.file.name, async ({ id, signal }) => {
                return await download(data.file.store.id, data.file.name, { id, signal });
              }).catch((e) => {
                console.error("Download error:", e);
              });
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <DownloadIcon className="h-4 w-4" />
            Download
          </Button>

          <MikroFile.ObjectButton object={data.file} />
        </>
      }
    >
      {/* Enhanced File Header */}
      <div className="mb-6 border-none shadow-sm ">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10  shadow-sm">
                <FileIcon className="h-8 w-8 text-primary " />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  <MikroFile.DetailLink object={data.file}>
                    {data?.file?.name}
                  </MikroFile.DetailLink>
                </CardTitle>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs font-mono">
              {fileExtension.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
      </div>

      <Separator className="my-6" />

      {/* Enhanced Image Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold">Derived Images</h2>
          {data?.file?.views?.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {data.file.views.length} {data.file.views.length === 1 ? 'image' : 'images'}
            </Badge>
          )}
        </div>

        <ListRender array={data?.file?.views} title="">
          {(view) => (
            <MikroImage.Smart object={view.image} key={view.image.id}>
              <div className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden rounded-lg rounded border-border ">
                <div className="relative w-full h-full">
                  <WithMikroMediaUrl media={view.image.latestSnapshot?.store}>
                    {(url) => (
                      <img
                        src={url}
                        alt={view.image.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </WithMikroMediaUrl>



                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform  transition-transform duration-300 truncate">
                    <MikroImage.DetailLink
                      className="font-semibold text-lg block hover:text-primary transition-colors line-clamp-2"
                      object={view.image}
                    >
                      {view.image?.name}
                    </MikroImage.DetailLink>

                    {view.seriesIdentifier && (
                      <Badge variant={"default"} className="mt-1 bg-black  text-xs text-primary">
                        Series: {view.seriesIdentifier}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </MikroImage.Smart>
          )}
        </ListRender>
      </div>
    </MikroFile.ModelPage>
  );
});


export default FilePage;
