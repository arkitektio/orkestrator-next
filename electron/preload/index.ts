import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
  startFakts: async (url: string) => {
    // @ts-ignore (define in dts)
    return ipcRenderer.send("fakts-start", url);
  },
  downloadFromUrl: (url: string) =>
    ipcRenderer.invoke('download-from-url', { url }),
  authenticate: async (url: string) => {
    // @ts-ignore (define in dts)
    console.log("Running oauth?", url);

    let response = await fetch(url);
    if (response.status !== 200) {
      throw new Error("Failed to authenticate. Server does not respond");
    }

    const promise = new Promise<string>((resolve, reject) => {
      ipcRenderer.on("oauth-response", (event, arg) => {
        console.log("Got oauth response", arg);
        resolve(arg);
      });
      ipcRenderer.on("oauth-error", (event, arg) => {
        console.error("Got oauth error", arg);
        reject(arg);
      });
    });

    console.log("Running oauth?", url);

    ipcRenderer.send("oauth-start", url);

    return await promise;
  },
  openJitsiWindow: async () => {
    // @ts-ignore (define in dts)
    return ipcRenderer.send("jitsi");
  },
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
