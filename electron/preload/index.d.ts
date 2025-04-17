import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      startFakts: (url: string) => Promise<void>;
      authenticate: (url: string) => Promise<string>;
      openJitsiWindow: () => Promise<void>;
      openSecondWindow: (path: string) => void;
      downloadFromUrl: (url: string) =>  Promise<{ success: boolean; path?: string; error?: string }>;
    };
  }
}
