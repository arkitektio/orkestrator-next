import React from "react";
import { useUpload } from "@/providers/upload/UploadProvider";
import { Progress } from "@/components/ui/progress";
import { Activity, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const UploadProgress = () => {
  const { uploads, cancelUpload } = useUpload();
  const activeUploads = uploads.filter(
    (u) => u.status === "uploading" || u.status === "pending"
  );

  if (activeUploads.length === 0) return (
    <div className="w-full flex flex-col items-center justify-center space-y-4 bg-foreground/5 p-4 rounded-t-lg border-t border-t-border border-t-gray-600 text-muted-foreground">
      No active uploads
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4 bg-foreground/5 p-4 rounded-t-lg border-t border-t-border border-t-gray-600">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <Activity className="h-4 w-4 animate-pulse text-blue-500" />
        Active Uploads ({activeUploads.length})
      </h3>
      <div className="space-y-3">
        {activeUploads.map((upload) => (
          <div key={upload.id} className="space-y-1">
            <div className="flex justify-between text-xs items-center">
              <span className="truncate max-w-[150px]">{upload.file.name}</span>
              <div className="flex items-center gap-2">
                <span>{Math.round(upload.progress)}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full"
                  onClick={() => cancelUpload(upload.id)}
                >
                  <X className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            </div>
            <Progress value={upload.progress} className="h-1" />
          </div>
        ))}
      </div>
    </div>
  );
};
