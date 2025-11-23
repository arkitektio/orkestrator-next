import React, { createContext, useContext, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export type UploadStatus = "pending" | "uploading" | "completed" | "error";

export interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
  abortController?: AbortController;
}

export interface UploadContextType {
  uploads: UploadTask[];
  startUpload: <T, U>(
    file: File,
    uploader: (
      file: File,
      options: {
        onProgress: (ev: ProgressEvent) => void;
        signal: AbortSignal;
      }
    ) => Promise<U>,
    creator?: (file: File, result: U) => Promise<T>
  ) => Promise<T | U>;
  cancelUpload: (id: string) => void;
  clearCompleted: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
};

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [uploads, setUploads] = useState<UploadTask[]>([]);

  const startUpload = useCallback(
    async <T, U>(
      file: File,
      uploader: (
        file: File,
        options: {
          onProgress: (ev: ProgressEvent) => void;
          signal: AbortSignal;
        }
      ) => Promise<U>,
      creator?: (file: File, result: U) => Promise<T>
    ) => {
      const id = uuidv4();
      const abortController = new AbortController();

      const newUpload: UploadTask = {
        id,
        file,
        progress: 0,
        status: "pending",
        abortController,
      };

      setUploads((prev) => [...prev, newUpload]);

      try {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: "uploading" } : u
          )
        );

        const result = await uploader(file, {
          onProgress: (ev: ProgressEvent) => {
            if (ev.lengthComputable) {
              const progress = (ev.loaded / ev.total) * 100;
              setUploads((prev) =>
                prev.map((u) =>
                  u.id === id ? { ...u, progress } : u
                )
              );
            }
          },
          signal: abortController.signal,
        });

        if (creator) {
          if (abortController.signal.aborted) {
            throw new DOMException("Aborted", "AbortError");
          }
          const createResult = await creator(file, result);
          setUploads((prev) =>
            prev.map((u) =>
              u.id === id ? { ...u, status: "completed", progress: 100 } : u
            )
          );
          return createResult;
        }

        setUploads((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: "completed", progress: 100 } : u
          )
        );
        return result;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          // Handled by cancelUpload usually
        }
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id
              ? { ...u, status: "error", error: error instanceof Error ? error.message : "Unknown error" }
              : u
          )
        );
        throw error;
      }
    },
    []
  );

  const cancelUpload = useCallback((id: string) => {
    setUploads((prev) => {
      const upload = prev.find((u) => u.id === id);
      if (upload && upload.status === "uploading") {
        upload.abortController?.abort();
      }
      return prev.filter((u) => u.id !== id);
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads((prev) => prev.filter((u) => u.status !== "completed"));
  }, []);

  return (
    <UploadContext.Provider
      value={{ uploads, startUpload, cancelUpload, clearCompleted }}
    >
      {children}
    </UploadContext.Provider>
  );
};
