import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { createStore, useStore } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { X, CheckCircle2, AlertCircle, Loader2, ChevronUp, ChevronDown, FolderOpen, ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export type DownloadStatus = "pending" | "downloading" | "completed" | "error";

export interface DownloadTask {
  id: string;
  fileName: string;
  progress: number;
  status: DownloadStatus;
  error?: string;
  savePath?: string;
  abortController?: AbortController;
}

export interface DownloadProps {
  downloads: DownloadTask[];
  startDownload: <T>(
    fileName: string,
    downloader: (
      options: {
        id: string;
        onProgress: (ev: { loaded: number; total: number }) => void;
        signal: AbortSignal;
      }
    ) => Promise<T>,
  ) => Promise<T>;
  cancelDownload: (id: string) => void;
  clearCompleted: () => void;
}

export type DownloadStore = ReturnType<typeof createDownloadStore>;

export const createDownloadStore = () =>
  createStore<DownloadProps>((set, get) => ({
    downloads: [],
    startDownload: async <T,>(
      fileName: string,
      downloader: (
        options: {
          id: string;
          onProgress: (ev: { loaded: number; total: number }) => void;
          signal: AbortSignal;
        }
      ) => Promise<T>
    ) => {
      const id = uuidv4();
      const abortController = new AbortController();

      const newDownload: DownloadTask = {
        id,
        fileName,
        progress: 0,
        status: "pending",
        abortController,
      };

      set((state) => ({ downloads: [...state.downloads, newDownload] }));

      let removeProgress: (() => void) | undefined;

      try {
        set((state) => ({
          downloads: state.downloads.map((d) =>
            d.id === id ? { ...d, status: "downloading" } : d
          ),
        }));

        if (window.api?.onDownloadProgress) {
          removeProgress = window.api.onDownloadProgress(id, (progress: any) => {
            set((state) => ({
              downloads: state.downloads.map((d) =>
                d.id === id ? { ...d, progress: progress.total > 0 ? (progress.loaded / progress.total) * 100 : 0 } : d
              ),
            }));
          });
        }

        const result = await downloader({
          id,
          onProgress: (ev: { loaded: number, total: number }) => {
             const progress = ev.total > 0 ? (ev.loaded / ev.total) * 100 : 0;
             set((state) => ({
                downloads: state.downloads.map((d) =>
                  d.id === id ? { ...d, progress } : d
                ),
             }));
          },
          signal: abortController.signal,
        });

        if (removeProgress) removeProgress();

        set((state) => ({
          downloads: state.downloads.map((d) =>
            d.id === id ? { ...d, status: "completed", progress: 100, savePath: typeof result === "string" ? result : undefined } : d
          ),
        }));
        return result;
      } catch (err: any) {
        if (removeProgress) removeProgress();

        if (err.name === "AbortError" || err.message?.includes("Abort")) {
          set((state) => ({
            downloads: state.downloads.filter((d) => d.id !== id),
          }));
          throw err;
        } else {
          set((state) => ({
            downloads: state.downloads.map((d) =>
              d.id === id
                ? { ...d, status: "error", error: err.message || "Unknown error" }
                : d
            ),
          }));
          throw err;
        }
      }
    },
    cancelDownload: (id: string) => {
      set((state) => {
        const t = state.downloads.find((d) => d.id === id);
        if (t?.abortController) {
          t.abortController.abort();
        }
        return { downloads: state.downloads.filter((d) => d.id !== id) };
      });
    },
    clearCompleted: () => {
      set((state) => ({
        downloads: state.downloads.filter((d) => d.status !== "completed"),
      }));
    },
  }));

const DownloadContext = createContext<DownloadStore | null>(null);

const DownloadOverlay: React.FC = () => {
  const { downloads, cancelDownload, clearCompleted } = useDownload();
  const [isMinimized, setIsMinimized] = useState(false);

  if (downloads.length === 0) return null;

  const allCompletedOrError = downloads.every(d => d.status === "completed" || d.status === "error");

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 w-80 max-h-96 pointer-events-auto bg-background border shadow-lg rounded-xl overflow-hidden">
      <div className="bg-muted p-3 flex justify-between items-center border-b">
        <span className="text-sm font-semibold">
          Downloads ({downloads.filter(d => d.status !== 'completed' && d.status !== 'error').length} active)
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
          {downloads.slice().reverse().map(d => (
            <div key={d.id} className="flex flex-col gap-1.5 text-sm group">
              <div className="flex justify-between items-center">
                <span className="truncate pr-2 font-medium max-w-[200px]" title={d.fileName}>{d.fileName}</span>
                <div className="flex items-center gap-2">
                  {d.status === "pending" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  {d.status === "downloading" && <span className="text-xs text-muted-foreground">{d.progress.toFixed(0)}%</span>}
                  {d.status === "completed" && (
                    <>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.savePath && (
                          <>
                            <button onClick={() => window.api.showItemInFolder(d.savePath!)} title="Show in folder" className="text-muted-foreground hover:text-foreground">
                              <FolderOpen className="h-4 w-4" />
                            </button>
                            <button onClick={() => window.api.openPath(d.savePath!)} title="Open file" className="text-muted-foreground hover:text-foreground">
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </>
                  )}
                  {d.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" title={d.error} />}
                  {(d.status === "downloading" || d.status === "pending") && (
                    <button onClick={() => cancelDownload(d.id)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              {d.status === "downloading" && (
                <Progress value={d.progress} className="h-1.5" />
              )}
              {d.status === "error" && (
                <span className="text-xs text-red-500 truncate">{d.error}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const DownloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeRef = useRef<DownloadStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createDownloadStore();
  }
  return (
    <DownloadContext.Provider value={storeRef.current}>
      {children}
      <DownloadOverlay />
    </DownloadContext.Provider>
  );
};

export function useDownloadStore<T>(selector: (state: DownloadProps) => T): T {
  const store = useContext(DownloadContext);
  if (!store) throw new Error("Missing DownloadContext.Provider in the tree");
  return useStore(store, selector);
}

export const useDownload = () => {
  const startDownload = useDownloadStore((state) => state.startDownload);
  const cancelDownload = useDownloadStore((state) => state.cancelDownload);
  const clearCompleted = useDownloadStore((state) => state.clearCompleted);
  const downloads = useDownloadStore((state) => state.downloads);
  return { startDownload, cancelDownload, clearCompleted, downloads };
};
