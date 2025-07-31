import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { DokumentsDocument, DokumentsFile, LovekitStream } from "@/linkers";
import { useGetFileQuery } from "../api/graphql";
import { DownloadIcon, FileIcon, FolderIcon } from "lucide-react";

export default asDetailQueryRoute(
  useGetFileQuery,
  ({ data }) => {
    const file = data?.file;
    
    // Helper function to format file size (placeholder - would need actual size from API)
    const getFileExtension = (filename: string) => {
      return filename.split('.').pop()?.toUpperCase() || 'File';
    };

    const handleDownload = () => {
      if (file?.store.presignedUrl) {
        const link = document.createElement('a');
        link.href = file.store.presignedUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    return (
      <DokumentsFile.ModelPage
        title={file?.name || 'Untitled File'}
        object={file?.id}
        pageActions={
          <div className="flex flex-row gap-2">
            <Button onClick={handleDownload} variant="outline" size="sm">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download
            </Button>
            <DokumentsFile.ObjectButton object={file?.id} />
          </div>
        }
        sidebars={
          <MultiSidebar
            map={{
              Comments: <LovekitStream.Komments object={file?.id} />,
            }}
          />
        }
      >
        <div className="space-y-6">
          {/* File Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{file?.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{getFileExtension(file?.name || '')}</Badge>
                    <span className="text-muted-foreground">File ID: {file?.id}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Storage Location</div>
                  <div className="text-sm font-mono bg-muted p-2 rounded">
                    {file?.store.bucket}/{file?.store.path || file?.store.key}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Storage Bucket</div>
                  <div className="text-sm flex items-center gap-2">
                    <FolderIcon className="w-4 h-4 text-muted-foreground" />
                    {file?.store.bucket}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Storage Key</div>
                  <div className="text-sm font-mono text-muted-foreground">
                    {file?.store.key}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Associated Documents Card */}
          {file?.documents && file.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.text className="w-5 h-5" />
                  Associated Documents
                  <Badge variant="outline">{file.documents.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Documents that have been created from this file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {file.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary/10 rounded">
                          <Icons.text className="w-4 h-4 text-secondary-foreground" />
                        </div>
                        <div>
                          <DokumentsDocument.DetailLink
                            object={doc.id}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {doc.title}
                          </DokumentsDocument.DetailLink>
                          <div className="text-sm text-muted-foreground">
                            Document ID: {doc.id}
                          </div>
                        </div>
                      </div>
                      <DokumentsDocument.DetailLink object={doc.id}>
                        <Button variant="ghost" size="sm">
                          <Icons.externalLink className="w-4 h-4" />
                        </Button>
                      </DokumentsDocument.DetailLink>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Documents Placeholder */}
          {(!file?.documents || file.documents.length === 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.text className="w-5 h-5" />
                  Associated Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Icons.text className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No documents have been created from this file yet.</p>
                  <p className="text-sm mt-1">
                    Upload and process this file to generate documents.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DokumentsFile.ModelPage>
    );
  },
);
