import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { app, shell, IpcMainEvent } from "electron";
import { resolve, join } from "path";
import icon from "../../resources/icon.png?asset";
import { machineIdSync } from "node-machine-id";
import { writeFileSync } from "fs";

// Import custom modules
import { AgentGateway } from "./gateway";
import { registerIssueIpc } from "./issue-reporter";
import { IpcTransport } from "./modules/IpcTransport";
import { WindowManager } from "./modules/WindowManager";
import { AppUpdater } from "./modules/AppUpdater";
import { DownloadManager } from "./modules/DownloadManager";
import { AppManager } from "./modules/AppManager";
import { UploadService } from "./modules/UploadService";
import { BigFileUploadService } from "./modules/BigFileUploadService";
import { BigFileDownloadService } from "./modules/BigFileDownloadService";
import { session, protocol } from "electron";
import { readFile } from "node:fs/promises";
import { normalize, sep } from "node:path";
import { ShellService } from "./modules/ShellService";
import { APP_SCHEME } from "./scheme";

// Minimal extension -> MIME map for the app:// static file handler. Kept inline
// to avoid adding a dependency. text/javascript for .js/.mjs is mandatory (ES
// module scripts are rejected otherwise) and application/wasm is required for
// WebAssembly.instantiateStreaming (zarr codecs, duckdb-wasm).
const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".map": "application/json",
  ".wasm": "application/wasm",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".data": "application/octet-stream",
  ".txt": "text/plain",
};

function mimeForPath(filePath: string): string {
  const dot = filePath.lastIndexOf(".");
  const ext = dot >= 0 ? filePath.slice(dot).toLowerCase() : "";
  return MIME_TYPES[ext] ?? "application/octet-stream";
}

// Register the custom `app://` scheme (see ./scheme) as standard + secure. This
// MUST run before the app 'ready' event, hence at module top-level.
protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

app.commandLine.appendSwitch("ignore-certificate-errors", "true");
// WebGPU for the scene renderer: macOS (Metal) and Windows (D3D) enable it by
// default in this Chromium; Linux still needs Vulkan + the unsafe flag. Where
// WebGPU is unavailable anyway, three's WebGPURenderer falls back to its
// WebGL2 backend automatically (TSL shaders compile for both).
if (process.platform === "linux") {
  //pass
}
// Core Services
const appManager = new AppManager();
const transport = new IpcTransport();
const windowManager = new WindowManager(transport);
const appUpdater = new AppUpdater(transport, windowManager);
const downloadManager = new DownloadManager(transport);
const uploadService = new UploadService(transport);
const bigFileUploadService = new BigFileUploadService(transport);
const bigFileDownloadService = new BigFileDownloadService(transport);
const shellService = new ShellService(transport);

appManager.register(windowManager);
appManager.register(appUpdater);
appManager.register(downloadManager);
appManager.register(uploadService);
appManager.register(bigFileUploadService);
appManager.register(bigFileDownloadService);
appManager.register(shellService);

let electronAgent: AgentGateway | null = null;

// Handle default protocol
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("orkestrator", process.execPath, [
      resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("orkestrator");
}

function maybeInstallReactDevTools() {
  if (!is.dev || process.env.ENABLE_ELECTRON_REACT_DEVTOOLS !== "1") {
    return;
  }

  import("electron-devtools-installer")
    .then((installer) => {
      const install = installer.default?.installExtension || installer.installExtension || installer.default;
      return install(installer.REACT_DEVELOPER_TOOLS, {
        loadExtensionOptions: { allowFileAccess: true },
      });
    })
    .then((name) => console.log(`Added Extension: ${name}`))
    .catch((err) => console.log("Failed to install React DevTools", err));
}

// NOTE: Apollo Client DevTools (the browser extension) cannot render its panel
// in Electron — the inspector crashes initializing the renderer for the
// extension's `devtools_page` (`renderer_init: object null is not iterable`),
// an Electron bug that also affects other devtools-panel extensions (Angular,
// Audion). The client is instead exposed via `window.__APOLLO_CLIENT__` in dev
// (see `devtools.enabled` in graphQlServiceBuidler.tsx) for console inspection.

// Ensure single instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // Let the AppManager handle the core initialization
  appManager.setup();

  app.whenReady().then(() => {
    registerIssueIpc();
    // Inside your app.whenReady() or before creating the window
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Cross-Origin-Embedder-Policy': ['require-corp'],
          'Cross-Origin-Opener-Policy': ['same-origin']
        }
      })
    })

    // Serve the packaged renderer from the custom `app://` scheme (registered
    // as standard + secure above) instead of file://. Returning the COOP/COEP
    // trio on this real, secure origin is what makes the document
    // cross-origin isolated, so SharedArrayBuffer is available for the
    // worker-accelerated zarr chunk decoding pipeline. The renderer uses
    // HashRouter, so the only document ever requested is index.html; every
    // other request is a static asset relative to it.
    const rendererRoot = normalize(join(__dirname, "../renderer"))
    protocol.handle(APP_SCHEME, async (request) => {
      const url = new URL(request.url)
      let pathname = decodeURIComponent(url.pathname)
      if (pathname === "/" || pathname === "") pathname = "/index.html"

      // Confine every read to the renderer root (path-traversal guard).
      const filePath = normalize(join(rendererRoot, pathname))
      if (filePath !== rendererRoot && !filePath.startsWith(rendererRoot + sep)) {
        return new Response("Forbidden", { status: 403 })
      }

      try {
        const data = await readFile(filePath)
        const headers = new Headers({
          "Content-Type": mimeForPath(filePath),
          "Cross-Origin-Opener-Policy": "same-origin",
          "Cross-Origin-Embedder-Policy": "require-corp",
          "Cross-Origin-Resource-Policy": "same-origin",
        })
        return new Response(data, { status: 200, headers })
      } catch {
        return new Response("Not Found", { status: 404 })
      }
    })

    windowManager.createMainWindow(icon);

    if (!electronAgent) {
      // NOTE: AgentGateway assumes ipcMain is available, we could refactor it too,
      // but for now we leave it as is or pass standard ipcMain (which it imports directly).
      const { ipcMain } = require('electron');
      electronAgent = new AgentGateway(ipcMain);
    }

    // Handle deep link on Windows/Linux when app starts
    if (process.platform !== 'darwin') {
      const url = process.argv.find(arg => arg.startsWith('orkestrator://'));
      if (url) {
        windowManager.handleOrkestratorUrl(url);
      }
    }

    

  });
}

// App event lifecycle overrides
// app.on("window-all-closed", ...) is handled by the AppManager.

app.on("certificate-error", (event, _, __, ___, ____, callback) => {
  event.preventDefault();
  // Check if we this is a certificate error we want to ignore (you can add more logic here if needed)
  // By default we should only ignore errors for the configure fakt domains, but for now we ignore all to avoid issues with self-signed certs in development and testing
  callback(true);
});

app.whenReady().then(() => {
  maybeInstallReactDevTools();
  electronApp.setAppUserModelId("com.electron");

  import("electron").then(({ session }) => {
    session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
      if (permission === 'clipboard-read' || permission === 'clipboard-sanitized-write') {
        return true;
      }
      return true;
    });
  });

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Remaining general IPC handlers
  transport.onChannel("ping", () => {
    console.log("ping received");
  });

  transport.handleChannel("open-webbrowser", async (_, url: string) => {
    try {
      await shell.openExternal(url);
    } catch (error) {
      console.error("Failed to open URL in web browser:", error);
    }
  });

  transport.onChannel("fakts-start", (_: IpcMainEvent, msg) => {
    shell.openExternal(msg);
  });

  transport.onChannel("ondragstart", (event, structure) => {
    writeFileSync(join(__dirname, "structure.md"), structure);
    event.sender.startDrag({
      file: join(__dirname, "structure.md"),
      icon: icon as unknown as string | Electron.NativeImage,
    });
  });

  transport.handleChannel("get-node-id", () => {
    return machineIdSync(true);
  });
});

if (process.platform == "darwin") {
  app.on("open-url", (event, url) => {
    event.preventDefault();
    windowManager.handleOrkestratorUrl(url);
  });
}

