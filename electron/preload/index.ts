import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
  startFakts: async (url: string) => {
    // @ts-ignore (define in dts)
    return ipcRenderer.send("fakts-start", url);
  },
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
