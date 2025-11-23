import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { Assign } from "../main/message";

// Custom APIs for renderer
const api = {
  startFakts: async (url: string) => {
    return ipcRenderer.send("fakts-start", url);
  },
  inspectElectronAgent: () =>
    ipcRenderer.invoke("agent:inspect-electron-agent"),

  downloadFromUrl: (url: string) =>
    ipcRenderer.invoke("download-from-url", { url }),
  startDrag: (structure) => {
    ipcRenderer.send("ondragstart", structure);
  },
  openSecondWindow: (path: string) => {
    ipcRenderer.send("open-second-window", path);
  },
  discoverBeacons: () => ipcRenderer.invoke("discover-beacons"),
  reloadWindow: () => ipcRenderer.invoke("reload-window"),
  forceReloadWindow: () => ipcRenderer.invoke("force-reload-window"),
  setZoomLevel: (zoomLevel: number) => ipcRenderer.invoke("set-zoom-level", zoomLevel),
  getZoomLevel: () => ipcRenderer.invoke("get-zoom-level"),
  openWebbrowser: (url: string) => ipcRenderer.invoke("open-webbrowser", url),
  reportIssue: (opts: {
    title?: string;
    extra?: string;
    includeScreenshot?: boolean;
    labels?: string[];
    template?: string;
  }) => ipcRenderer.invoke("arkitekt.reportIssue", opts),
  openFilePicker: () => ipcRenderer.invoke("dialog:openFile"),
  initAgent: (context: any) => ipcRenderer.invoke("agent:init", context),
  executeElectron: (assignation: Assign) => ipcRenderer.invoke("agent:execute", assignation),
  onAgentYield: (cb: (data: any) => void) => ipcRenderer.on("agent:yield", (_e, data) => {console.log(data); cb(data)}),
  onAgentDone: (cb: (data: any) => void) => ipcRenderer.on("agent:done", (_e, data) => {console.log(data); cb(data)}),
  onAgentError: (cb: (data: any) => void) => ipcRenderer.on("agent:error", (_e, data) =>{console.log(data); cb(data)}),
  onAgentLog: (cb: (data: any) => void) => ipcRenderer.on("agent:log", (_e, data) =>{console.log(data); cb(data)}),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("electronAPI", api);
    contextBridge.exposeInMainWorld("updates", {
      checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
      onStatus: (cb) => ipcRenderer.on("updater:status", (_e, s) => cb(s)),
      onAvailable: (cb) => ipcRenderer.on("updater:available", (_e, info) => cb(info)),
      onNone: (cb) => ipcRenderer.on("updater:none", cb),
      onProgress: (cb) => ipcRenderer.on("updater:progress", (_e, p) => cb(p)),
      onError: (cb) => ipcRenderer.on("updater:error", (_e, err) => cb(err))
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI;
  // @ts-expect-error (define in dts)
  window.api = api;
  // @ts-expect-error (define in dts)
  window.electronAPI = api;
}
