import { Assign } from "@/app/agent/message";
import { AppContext, AvailableService } from "@/lib/arkitekt/provider";
import { ImplementationInput } from "@/rekuest/api/graphql";
import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      assignElectronAgentFunction: (name: string, implementation: ImplementationInput) => Promise<void>;
      inspectElectronAgent: () => Promise<ImplementationInput[]>;
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
      initAgent: (context: { token: string, url: string, instanceId: string, agentUrl: string, services: AvailableService[] }) => Promise<void>;
      reportIssue: (opts: {
        title?: string;
        extra?: string;
        includeScreenshot?: boolean;
        labels?: string[];
        template?: string;
      }) => Promise<void>;
      openFilePicker: () => Promise<string | undefined>;
      executeElectron: (assignation: Assign) => Promise<void>;
      onAgentYield: (cb: (data: any) => void) => void;
      onAgentDone: (cb: (data: any) => void) => void;
      onAgentError: (cb: (data: any) => void) => void;
      onAgentLog: (cb: (data: any) => void) => void;
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
