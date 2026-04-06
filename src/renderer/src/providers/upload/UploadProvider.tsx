import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { createStore, useStore } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { X, CheckCircle2, AlertCircle, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export type UploadStatus = "pending" | "uploading" | "completed" | "error";

export interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
  abortController?: AbortController;
}

export interface UploadProps {
  uploads: UploadTask[];
  startUpload: <T, U>(
    file: File,
    uploader: (
      file: File,
      options: {
        id: string;
        onProgress: (ev: ProgressEvent) => void;
        signal: AbortSignal;
      }
    ) => Promise<U>,
    creator?: (file: File, result: U) => Promise<T>
  ) => Promise<T | U>;
  cancelUpload: (id: string) => void;
  clearCompleted: () => void;
}

export type UploadStore = ReturnType<typeof createUploadStore>;

export const createUploadStore = () =>
  createStore<UploadProps>((set, get) => ({
    uploads: [],
    startUpload: async <T, U>(
      file: File,
      uploader: (
        file: File,
        options: {
          id: string;
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

      set((state) => ({ uploads: [...state.uploads, newUpload] }));

      let removeProgress: (() => void) | undefined;
      let removeError: (() => void) | undefined;

      try {
        set((state) => ({
          uploads: state.uploads.map((u) =>
            u.id === id ? { ...u, status: "uploading" } : u
          ),
        }));

        if (window.api?.onUploadProgress) {
          removeProgress = window.api.onUploadProgress(id, (progress: any) => {
            set((state) => ({
              uploads: state.uploads.map((u) =>
                u.id === id ? { ...u, progress: (progress.loaded / progress.total) * 100 } : u
              ),
            }));
          });
        }

        const result = await uploader(file, {
          id,
          onProgress: (ev: ProgressEvent) => {
            if (ev.lengthComputable) {
              const progress = (ev.loaded / ev.total) * 100;
              set((state) => ({
                uploads: state.uploads.map((u) =>
                  u.id === id ? { ...u, progress } : u
                ),
              }));
            }
          },
          signal: abortController.signal,
        });

        if (removeProgress) removeProgress();
        if (removeError) removeError();

        if (creator) {
          if (abortController.signal.aborted) {
            throw new DOMException("Aborted", "AbortError");
          }
          const createResult = await creator(file, result);
          set((state) => ({
            uploads: state.uploads.map((u) =>
              u.id === id ? { ...u, status: "completed", progress: 100 } : u
            ),
          }));
          return createResult;
        }

        set((state) => ({
          uploads: state.uploads.map((u) =>
            u.id === id ? { ...u, status: "completed", progress: 100 } : u
          ),
        }));
        return result;
      } catch (err: any) {
        if (removeProgress) removeProgress();
        if (removeError) removeError();

        if (err.name === "AbortError") {
          console.log("Upload cancelled");
          set((state) => ({
            uploads: state.uploads.filter((u) => u.id !== id),
          }));
          throw err;
        } else {
          set((state) => ({
            uploads: state.uploads.map((u) =>
              u.id === id
                ? { ...u, status: "error", error: err.message || "Unknown error" }
                : u
            ),
          }));
          throw err;
        }
      }
    },
    cancelUpload: (id: string) => {
      set((state) => {
        const t = state.uploads.find((u) => u.id === id);
        if (t?.abortController) {
          t.abortController.abort();
        }
        return { uploads: state.uploads.filter((u) => u.id !== id) };
      });
    },
    clearCompleted: () => {
      set((state) => ({
        uploads: state.uploads.filter((u) => u.status !== "completed"),
      }));
    },
  }));

const UploadContext = createContext<UploadStore | null>(null);

const UploadOverlay: React.FC = () => {
  const { uploads, cancelUpload, clearCompleted } = useUpload();
  const [isMinimized, setIsMinimized] = useState(false);

  if (uploads.length === 0) return null;

  const allCompletedOrError = uploads.every(u => u.status === "completed" || u.status === "error");

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-h-96 pointer-events-auto bg-background border shadow-lg rounded-xl overflow-hidden">
      <div className="bg-muted p-3 flex justify-between items-center border-b">
        <span className="text-sm font-semibold">
          Uploads ({uploads.filter(u => u.status !== 'completed' && u.status !== 'error').length} active)
        </span>
        <div className="flex gap-2">
          {allCompletedOrError && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearCompleted}>
              Clear
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col gap-3 p-3 overflow-y-auto max-h-72">
          {uploads.slice().reverse().map(u => (
            <div key={u.id} className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="truncate pr-2 font-medium max-w-[200px]" title={u.file.name}>{u.file.name}</span>
                <div className="flex items-center gap-2">
                  {u.status === "pending" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  {u.status === "uploading" && <span className="text-xs text-muted-foreground">{u.progress.toFixed(0)}%</span>}
                  {u.status === "completed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {u.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" title={u.error} />}
                  {(u.status === "uploading" || u.status === "pending") && (
                    <button onClick={() => cancelUpload(u.id)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              {u.status === "uploading" && (
                <Progress value={u.progress} className="h-1.5" />
              )}
              {u.status === "error" && (
                <span className="text-xs text-red-500 truncate">{u.error}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeRef = useRef<UploadStore>(null);
  if (!storeRef.current) {
    storeRef.current = createUploadStore();
  }
  return (
    <UploadContext.Provider value={storeRef.current}>
      {children}
      <UploadOverlay />
    </UploadContext.Provider>
  );
};

export function useUploadStore<T>(selector: (state: UploadProps) => T): T {
  const store = useContext(UploadContext);
  if (!store) throw new Error("Missing UploadContext.Provider in the tree");
  return useStore(store, selector);
}

export const useUpload = () => {
  const startUpload = useUploadStore((state) => state.startUpload);
  const cancelUpload = useUploadStore((state) => state.cancelUpload);
  const clearCompleted = useUploadStore((state) => state.clearCompleted);
  const uploads = useUploadStore((state) => state.uploads);
  return { startUpload, cancelUpload, clearCompleted, uploads };
};
