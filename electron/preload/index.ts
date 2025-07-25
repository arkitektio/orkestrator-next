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
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
