import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      startFakts: (url: string) => Promise<void>;
      authenticate: (url: string) => Promise<string>;
      openJitsiWindow: () => Promise<void>;
      openSecondWindow: (path: string) => void;
      downloadFromUrl: (url: string) => Promise<{ success: boolean; path?: string; error?: string }>;
      reloadWindow: () => Promise<{ success: boolean; error?: string }>;
      forceReloadWindow: () => Promise<{ success: boolean; error?: string }>;
      setZoomLevel: (zoomLevel: number) => Promise<{ success: boolean; error?: string }>;
      getZoomLevel: () => Promise<{ success: boolean; zoomLevel?: number; error?: string }>;
      openWebbrowser: (url: string) => Promise<void>;
      reportIssue: (opts: {
        title?: string;
        extra?: string;
        includeScreenshot?: boolean;
        labels?: string[];
        template?: string;
      }) => Promise<void>;
    };
    updates: {
      checkForUpdates: () => Promise<{ success: boolean; result?: any; error?: string }>;
      onStatus: (callback: (status: string) => void) => void;
      onAvailable: (callback: (info: any) => void) => void;
      onNone: (callback: () => void) => void;
      onProgress: (callback: (progress: any) => void) => void;
      onError: (callback: (error: any) => void) => void;
    };
  }
}
