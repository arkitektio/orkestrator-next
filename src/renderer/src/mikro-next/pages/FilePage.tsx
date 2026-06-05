import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { ListRender } from "@/components/layout/ListRender";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMikroBigFileDownload } from "@/datalayer/hooks/useMikroBigFileDownload";
import { WithMikroMediaUrl } from "@/lib/datalayer/mikroAccess";
import { MikroFile, MikroImage } from "@/linkers";
import { useDownload } from "@/providers/download/DownloadProvider";
import {
  DownloadIcon,
  FileIcon,
  ImageIcon,
  LinkIcon
} from "lucide-react";
import { useGetFileQuery, useListFileViewsQuery } from "../api/graphql";
import { ProvenanceSidebar } from "../components/sidebars/ProvenanceSidebar";

// Helper for formatting file size
const formatBytes = (bytes: number | null | undefined): string => {
  if (bytes == null) return "Unknown Size";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper for getting clean file extension
const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toUpperCase() || 'FILE';
};

// Helper for determining color based on extension
const getFileTypeColor = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'doc':
    case 'docx': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'tiff':
    case 'tif': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'mp4':
    case 'avi':
    case 'mov': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'zip':
    case 'tar':
    case 'gz': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'json':
    case 'xml':
    case 'csv':
    case 'txt': return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
    default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  }
};



export const FilePage = asDetailQueryRoute(useGetFileQuery, ({ data }) => {
  const download = useMikroBigFileDownload();
  const { startDownload } = useDownload();

  const file = data?.file;

  const viewsQuery = useListFileViewsQuery({
    variables: { file: file?.id || "" },
    skip: !file?.id,
  });

  if (!file) return null;


  const fileExtension = getFileExtension(file.name);
  const fileTypeColorClass = getFileTypeColor(file.name);

  return (
    <MikroFile.ModelPage
      actions={<MikroFile.Actions object={file} />}
      object={file}
      title={file.name}
      pageActions={
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              startDownload(file.name, async ({ id, signal }) => {
                return await download(file.store.id, file.name, { id, signal });
              }).catch((e) => {
                console.error("Download error:", e);
              });
            }}
            variant="outline"
            className="flex items-center gap-2 shadow-sm"
          >
            <DownloadIcon className="h-4 w-4" />
            Download
          </Button>

          <MikroFile.ObjectButton object={file} />
        </div>
      }
      sidebars={
        <MultiSidebar
          map={{
            Comments: <MikroFile.Komments object={file} />,
            Provenance: (
              <ProvenanceSidebar items={file.provenanceEntries} />
            ),
          }}
        />
      }
    >
      {/* Enhanced File Header / Title Area */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl border shadow-sm ${fileTypeColorClass}`}>
            <FileIcon className="h-8 w-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">
              {file.name}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span>ID: {file.id}</span>
              <span>•</span>
              <span className="font-medium text-foreground">{file.contentType || "Unknown Content Type"}</span>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs font-mono px-2.5 py-1">
            {fileExtension}
          </Badge>
        </div>
      </div>

      {/* File Metadata */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6 text-sm">
          <div>
            <dt className="text-muted-foreground text-xs mb-1">File Size</dt>
            <dd className="font-medium text-base">{formatBytes(file.size)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs mb-1">MIME Type</dt>
            <dd className="font-medium text-base truncate" title={file.contentType || "Unknown"}>
              {file.contentType || "Unknown Type"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs mb-1">Organization</dt>
            <dd className="font-medium text-base">{file.organization?.slug || "Global"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-xs mb-1">File ID</dt>
            <dd className="font-mono text-xs mt-1 bg-muted/50 p-1 rounded max-w-fit">{file.id}</dd>
          </div>
        </dl>

      {/* Origins (Lineage) */}
      {file.origins && file.origins.length > 0 && (
        <div className="space-y-4 mb-8 mt-3">
          <div className="flex items-center gap-2 mb-2 border-b border-border/40 pb-2">
            <LinkIcon className="h-4 w-4 text-indigo-500" />
            <h2 className="text-lg font-bold tracking-tight">Origin Images</h2>
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 font-semibold text-xs ml-auto">
              {file.origins.length} Total
            </Badge>
          </div>

          <ListRender array={file.origins} fit>
            {(origin) => (
              <MikroImage.Smart object={origin} key={origin.id}>
                <div className="relative rounded group text-white bg-center group-hover:scale-102 bg-background shadow-lg aspect-square rounded-lg hover:bg-back-800 transition-all ease-in-out duration-200 group-hover:shadow-xl overflow-hidden">
                  {origin.latestSnapshot?.store ? (
                    <WithMikroMediaUrl media={origin.latestSnapshot.store}>
                      {(url) => (
                        <img
                          src={url}
                          alt={origin.name}
                          className="object-cover w-full h-full transition-transform duration-300 rounded-lg"
                        />
                      )}
                    </WithMikroMediaUrl>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted/30">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                  )}

                  <div className="px-2 py-2 h-full w-full absolute rounded-lg top-0 left-0 bg-black/40 hover:bg-black/20 transition-all ease-in-out duration-200 flex flex-col justify-between overflow-hidden">
                    <div className="flex justify-between items-start gap-2">
                      <MikroImage.DetailLink
                        className="z-10 font-bold text-md cursor-pointer break-words line-clamp-2"
                        object={origin}
                      >
                        {origin.name || "Unnamed Image"}
                      </MikroImage.DetailLink>
                    </div>
                  </div>
                </div>
              </MikroImage.Smart>
            )}
          </ListRender>
        </div>
      )}

      {/* Derived Images */}
      <div className="space-y-4 mt-4">

        <ListRender
          array={viewsQuery.data?.file?.views}
          refetch={async (variables) => {
            return viewsQuery.refetch(variables);
          }}
          title={

        <div className="flex items-center  pb-2">
          <ImageIcon className="h-4 w-4 text-emerald-500" />
          <h2 className="text-lg font-bold tracking-tight">Derived Images</h2>
        </div>
          }
          limit={10}
        >
          {(view, index) => (
            <MikroImage.Smart object={view.image} key={index}>
              <div className="relative rounded group text-white bg-center group-hover:scale-102 bg-background shadow-lg aspect-square rounded-lg hover:bg-back-800 transition-all ease-in-out duration-200 group-hover:shadow-xl overflow-hidden">
                {view.image.latestSnapshot?.store ? (
                  <WithMikroMediaUrl media={view.image.latestSnapshot.store}>
                    {(url) => (
                      <img
                        src={url}
                        alt={view.image.name}
                        className="object-cover w-full h-full transition-transform duration-300 rounded-lg"
                      />
                    )}
                  </WithMikroMediaUrl>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted/30">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                )}

                <div className="px-2 py-2 h-full w-full absolute rounded-lg top-0 left-0 bg-black/40 hover:bg-black/20 transition-all ease-in-out duration-200 flex flex-col justify-between overflow-hidden">
                  <div className="flex justify-between items-start gap-2">
                    <MikroImage.DetailLink
                      className="z-10 font-bold text-md cursor-pointer break-words line-clamp-2"
                      object={view.image}
                    >
                      {view.image?.name || "Unnamed Image"}
                    </MikroImage.DetailLink>

                    {view.seriesIdentifier && (
                      <Badge variant="secondary" className="text-xs shrink-0 bg-background/80 backdrop-blur-sm text-foreground shadow-sm">
                        Series {view.seriesIdentifier}
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
