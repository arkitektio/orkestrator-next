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

app.commandLine.appendSwitch("ignore-certificate-errors", "true");
app.commandLine.appendSwitch("origin-to-force-quic-on", "jhnnsrs-lab:4433");

// Core Services
const appManager = new AppManager();
const transport = new IpcTransport();
const windowManager = new WindowManager(transport);
const appUpdater = new AppUpdater(transport, windowManager);
const downloadManager = new DownloadManager(transport);
const uploadService = new UploadService(transport);
const bigFileUploadService = new BigFileUploadService(transport);

appManager.register(windowManager);
appManager.register(appUpdater);
appManager.register(downloadManager);
appManager.register(uploadService);
appManager.register(bigFileUploadService);

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

// Ensure single instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // Let the AppManager handle the core initialization
  appManager.setup();

  app.whenReady().then(() => {
    registerIssueIpc();
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
