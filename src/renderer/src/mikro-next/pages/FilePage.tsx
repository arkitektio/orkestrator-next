import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { Sidebars } from "@/components/layout/Sidebars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMikroBigFileDownload } from "@/datalayer/hooks/useMikroBigFileDownload";
import { MikroFile } from "@/linkers";
import { useDownload } from "@/providers/download/DownloadProvider";
import { DownloadIcon, FileIcon, Grid3x3 } from "lucide-react";
import { useGetFileQuery } from "../api/graphql";
import { MoveToFolderButton } from "../components/folder/MoveToFolderButton";
import ADatasetList from "../components/lists/ADatasetList";
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
          {/* No `currentFolder`: `File` is the one filable type with no `folder`
              field, so the badge stays dark until the schema can answer where
              this file sits. Moving works regardless. */}
          <MoveToFolderButton subject={{ kind: "file", ids: [file.id] }} />
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
        <Sidebars>
          <Sidebars.Tab label="Comments">
            <MikroFile.Komments object={file} />
          </Sidebars.Tab>
          <Sidebars.Tab label="Provenance">
            <ProvenanceSidebar items={file.provenanceEntries} />
          </Sidebars.Tab>
        </Sidebars>
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

      {/* The "Origin Images" section used to sit here. `File.origins` was
          removed from the mikro schema, so there is nothing left to render:
          what a file came from is now told by its provenance entries. */}

      {/* Derived Datasets — the array datasets a converter wrote out of these
          bytes. Filtered server-side with `sourceFile` rather than walking
          `file.derivedContainers`: that field is kind-blind (tables, meshes and
          annotation collections come back on it too), and going through the
          list keeps the same card, pagination and empty state as every other
          dataset list. */}
      <div className="space-y-4 mt-4">
        <ADatasetList
          filters={{ sourceFile: file.id }}
          title={
            <div className="flex items-center pb-2">
              <Grid3x3 className="h-4 w-4 text-sky-500" />
              <h2 className="text-lg font-bold tracking-tight">
                Derived Datasets
              </h2>
            </div>
          }
          emptyTitle="No datasets from this file"
          emptyDescription="Nothing has been converted out of these bytes yet."
          defaultLimit={10}
        />
      </div>

    </MikroFile.ModelPage>
  );
});

export default FilePage;
