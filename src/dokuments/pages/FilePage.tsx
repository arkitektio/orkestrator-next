import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { DokumentsDocument, DokumentsFile, LovekitStream } from "@/linkers";
import { useGetFileQuery } from "../api/graphql";
import { 
  DownloadIcon, 
  FileIcon, 
  FolderIcon, 
  DatabaseIcon,
  InfoIcon,
  FileTextIcon
} from "lucide-react";

export default asDetailQueryRoute(
  useGetFileQuery,
  ({ data }) => {
    const file = data?.file;
    
    // Helper functions
    const getFileExtension = (filename: string) => {
      return filename.split('.').pop()?.toUpperCase() || 'FILE';
    };

    const getFileTypeColor = (filename: string) => {
      const extension = filename.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'pdf': return 'bg-red-100 text-red-700 border-red-200';
        case 'doc': 
        case 'docx': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif': return 'bg-green-100 text-green-700 border-green-200';
        case 'mp4':
        case 'avi':
        case 'mov': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'txt': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-orange-100 text-orange-700 border-orange-200';
      }
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
            <Button onClick={handleDownload} variant="outline" size="sm" className="shadow-sm">
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
        <div className="space-y-8">
          {/* File Information Card */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl shadow-sm ${getFileTypeColor(file?.name || '')}`}>
                  <FileIcon className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
                    {file?.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-3 mt-2 text-base">
                    <Badge 
                      variant="secondary" 
                      className={`${getFileTypeColor(file?.name || '')} font-semibold px-3 py-1`}
                    >
                      {getFileExtension(file?.name || '')}
                    </Badge>
                    <span className="text-muted-foreground flex items-center gap-2">
                      <DatabaseIcon className="w-4 h-4" />
                      ID: {file?.id}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3 p-4 bg-white rounded-lg border shadow-sm">
                  <div className="flex items-center gap-2">
                    <FolderIcon className="w-5 h-5 text-blue-600" />
                    <div className="text-sm font-semibold text-gray-900">Storage Location</div>
                  </div>
                  <div className="text-sm font-mono bg-gray-50 p-3 rounded-md border break-all">
                    {file?.store.bucket}/{file?.store.path || file?.store.key}
                  </div>
                </div>
                <div className="space-y-3 p-4 bg-white rounded-lg border shadow-sm">
                  <div className="flex items-center gap-2">
                    <DatabaseIcon className="w-5 h-5 text-green-600" />
                    <div className="text-sm font-semibold text-gray-900">Storage Bucket</div>
                  </div>
                  <div className="text-sm flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                    <FolderIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{file?.store.bucket}</span>
                  </div>
                </div>
                <div className="space-y-3 p-4 bg-white rounded-lg border shadow-sm">
                  <div className="flex items-center gap-2">
                    <InfoIcon className="w-5 h-5 text-purple-600" />
                    <div className="text-sm font-semibold text-gray-900">Storage Key</div>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground p-3 bg-gray-50 rounded-md break-all">
                    {file?.store.key}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Associated Documents Card */}
          {file?.documents && file.documents.length > 0 && (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/30">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileTextIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span>Associated Documents</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                    {file.documents.length}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-base">
                  Documents that have been created from this file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {file.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="group flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-all duration-200 bg-white hover:bg-blue-50/50 hover:border-blue-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg group-hover:from-blue-200 group-hover:to-blue-100 transition-colors">
                          <FileTextIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <DokumentsDocument.DetailLink
                            object={doc.id}
                            className="font-semibold text-lg hover:text-blue-600 transition-colors block truncate"
                          >
                            {doc.title}
                          </DokumentsDocument.DetailLink>
                          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <DatabaseIcon className="w-3 h-3" />
                            Document ID: {doc.id}
                          </div>
                        </div>
                      </div>
                      <DokumentsDocument.DetailLink object={doc.id}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-sm"
                        >
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
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileTextIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <span>Associated Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <FileTextIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No documents created yet
                  </h3>
                  <p className="text-gray-600 mb-1">
                    No documents have been created from this file yet.
                  </p>
                  <p className="text-sm text-gray-500">
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
