import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainEvent,
  Menu,
  shell,
} from "electron";
import { writeFileSync } from "fs";
import { join, resolve } from "path";
import icon from "../../resources/icon.png?asset";
import { fileURLToPath } from "url";
import { download } from "electron-dl";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import Store from "electron-store";
import { registerIssueIpc } from "./issue-reporter";
import { AgentGateway } from "./gateway";
import { machineIdSync } from "node-machine-id";


const store = new Store();

app.commandLine.appendSwitch("ignore-certificate-errors", "true");

let mainWindow: BrowserWindow | null = null;
let electronAgent: AgentGateway | null = null;

// Debounce helper function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Debounced zoom factor setter
const debouncedSetZoomFactor = debounce((zoomLevel: number, window: BrowserWindow) => {
  window.webContents.setZoomFactor(zoomLevel);
}, 150); // 150ms debounce delay

ipcMain.handle("download-from-url", async (event, { url }: { url: string }) => {
  // Check if the URL is valid
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return { success: false, error: "No active window" };

  try {
    const dl = await download(win, url);
    return { success: true, path: dl.getSavePath() };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});

function setupAutoUpdater() {
  // Logging helps a LOT when debugging user update issues
  log.transports.file.level = "info";
  autoUpdater.logger = log;

  // Optional: opt into prereleases / channels (see section 4)
  // autoUpdater.allowPrerelease = true;       // allow beta/alpha if installed version has prerelease
  // autoUpdater.channel = "beta";             // force the channel this client follows

  // Don’t auto-install while running – safer UX
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  // Events -> wire to your UI
  autoUpdater.on("checking-for-update", () =>
    mainWindow?.webContents.send("updater:status", "Checking…"),
  );
  autoUpdater.on("update-available", (info) =>
    mainWindow?.webContents.send("updater:available", info),
  );
  autoUpdater.on("update-not-available", () =>
    mainWindow?.webContents.send("updater:none"),
  );
  autoUpdater.on("download-progress", (p) =>
    mainWindow?.webContents.send("updater:progress", p),
  );
  autoUpdater.on("error", (err) =>
    mainWindow?.webContents.send("updater:error", String(err)),
  );
  autoUpdater.on("update-downloaded", async (info) => {
    const r = await dialog.showMessageBox({
      type: "info",
      buttons: ["Restart now", "Later"],
      defaultId: 0,
      message: `Update ${info.version} downloaded`,
      detail: "Restart to install.",
    });
    if (r.response === 0) autoUpdater.quitAndInstall();
  });

  // Start the first check a little after launch
  setTimeout(() => autoUpdater.checkForUpdates(), 5000);
  // And a periodic check (e.g., every 4 hours)
  setInterval(() => autoUpdater.checkForUpdates(), 4 * 60 * 60 * 1000);
}

ipcMain.handle("discover-beacons", async () => {
  // Placeholder for mDNS/Bonjour beacon discovery
  // In a real implementation, this would use libraries like 'bonjour-service' or 'mdns'
  // to discover Arkitekt instances on the local network

  try {
    // For now, return some example local network probes
    // In the future, this could discover actual services via mDNS
    return [];
  } catch (error) {
    console.error("Beacon discovery failed:", error);
    return [];
  }
});

ipcMain.handle("check-for-updates", async () => {
  try {
    const result = await autoUpdater.checkForUpdates();

    return { success: true, result };
  } catch (error) {
    console.error("Manual update check failed:", error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle("open-webbrowser", async (_, url: string) => {
  try {
    await shell.openExternal(url);
  } catch (error) {
    console.error("Failed to open URL in web browser:", error);
  }
});

function handleOrkestratorUrl(url: string) {
  try {
    console.log(url);
    const parsedUrl = new URL(url);
    // Remove the protocol and get everything after orkestrator://
    // e.g., "orkestrator://model/some/path" -> "model/some/path"
    const fullPath = parsedUrl.hostname + parsedUrl.pathname;

    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }

    openSecondaryWindow(fullPath);
  } catch (err) {
    console.error("Invalid orkestrator URL", url);
    dialog.showErrorBox(
      "Invalid Link",
      `The URL '${url}' could not be processed.`,
    );
  }
}

function createWindow(): BrowserWindow {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    title: "Orkestrator",
    icon: icon,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: fileURLToPath(new URL("../preload/index.mjs", import.meta.url)),
      sandbox: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
    },
  });

  if (!electronAgent) {
    electronAgent = new AgentGateway(ipcMain);
  }


  if (!mainWindow) {
    throw new Error("Failed to create main window");
  }

  // We will soon use this #arkitekt-gateway
  //mainWindow.webContents.session.setProxy({ proxyRules: 'socks5://127.0.0.1:8080' });

  mainWindow.webContents.setZoomFactor(store.get("zoomFactor", 0.7));


  mainWindow.webContents.setWindowOpenHandler((details) => {
    return { action: "deny" };
  });




  mainWindow.on("resize", () => {
    const [width, height] = mainWindow?.getSize() || [900, 670];
    mainWindow?.webContents.setZoomFactor(store.get("zoomFactor", 0.7));
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
    // Set initial zoom level (1.0 = 100%)
    mainWindow?.webContents.setZoomFactor(1.0);
  });

  mainWindow.webContents.on('devtools-opened', () => {
    // This updates the position without closing/reopening the tools
    mainWindow?.webContents.openDevTools({ mode: 'right' });
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  // Add this right after creating the main window in createWindow function
  mainWindow.on("closed", () => {

    mainWindow = null;
    app.quit();
  });

  return mainWindow;
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("orkestrator", process.execPath, [
      resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("orkestrator");
}

function createFaktsWindow(url: string): void {
  // Create the browser window.
  const faktsWindows = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
  });

  faktsWindows.on("ready-to-show", () => {
    faktsWindows.show();
  });

  faktsWindows.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  const baseUrl = new URL(url);


  const baseRoot = baseUrl.pathname.split("/").slice(0, -2).join("/");


  const {
    session: { webRequest },
  } = faktsWindows.webContents;

  const filter = {
    urls: [
      `${baseUrl.origin}${baseRoot}/success*`,
      `${baseUrl.origin}${baseRoot}/failure*`,
    ],
  };

  webRequest.onBeforeRequest(filter, async ({ url }, callback) => {
    const parsedUrl = new URL(url);



    faktsWindows.close();
    callback({});
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  faktsWindows.loadURL(url);
}

ipcMain.on("ondragstart", (event, structure) => {
  writeFileSync(join(__dirname, "structure.md"), structure);
  event.sender.startDrag({
    file: join(__dirname, "structure.md"),
    icon: icon,
  });
});

ipcMain.handle("get-node-id", (event) => {
  return machineIdSync(true);
});


function openSecondaryWindow(path: string): void {
  // Create the browser window.
  const secondaryWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false,
      contextIsolation: true,
    },
  });

  secondaryWindow.on("ready-to-show", () => {
    secondaryWindow.show();
  });

  secondaryWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    const loaded_url = process.env["ELECTRON_RENDERER_URL"] + "#" + path;

    secondaryWindow.loadURL(loaded_url);
  } else {
    secondaryWindow
      .loadFile(join(__dirname, "../renderer/index.html"))
      .then(() => {
        secondaryWindow.webContents.executeJavaScript(
          `window.location = '#${path}'`,
        );
      });
  }
}


if (process.platform == "darwin") {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.

  // Handle the protocol on macOS
  app.on("open-url", (event, url) => {
    event.preventDefault();
    handleOrkestratorUrl(url);
  });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (_, commandLine) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }

    // Handle deep link on Windows/Linux
    // The protocol URL is passed as a command line argument
    const url = commandLine.find(arg => arg.startsWith('orkestrator://'));
    if (url) {
      handleOrkestratorUrl(url);
    }
  });

  // Create mainWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    registerIssueIpc();
    createWindow();

    // Handle deep link on Windows/Linux when app is not running
    if (process.platform !== 'darwin') {
      const url = process.argv.find(arg => arg.startsWith('orkestrator://'));
      if (url) {
        handleOrkestratorUrl(url);
      }
    }
  });
}

app.on("window-all-closed", () => {

  app.quit();
});

app.on("certificate-error", (event, _, __, ___, ____, callback) => {
  // Prevent having error
  event.preventDefault();
  // and continue
  callback(true);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  setupAutoUpdater();

  // Set up permission handler for clipboard access
  import("electron").then(({ session }) => {
    session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
      // Allow clipboard permissions
      if (permission === 'clipboard-read' || permission === 'clipboard-sanitized-write') {
        return true;
      }
      return true; // Allow other permissions by default
    });
  });

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  mainWindow = createWindow();

  // IPC test
  ipcMain.on("ping", () => {
    console.log("ping received");
  });

  // Reload handlers
  ipcMain.handle("reload-window", () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.reload();
      return { success: true };
    } else if (mainWindow) {
      mainWindow.reload();
      return { success: true };
    }
    return { success: false, error: "No window to reload" };
  });
  ipcMain.handle("force-reload-window", () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.webContents.reloadIgnoringCache();
      return { success: true };
    } else if (mainWindow) {
      mainWindow.webContents.reloadIgnoringCache();
      return { success: true };
    }
    return { success: false, error: "No window to reload" };
  });

  ipcMain.on("fakts-start", (_: IpcMainEvent, msg) => {
    shell.openExternal(msg);
  });
  ipcMain.on("open-second-window", (_: IpcMainEvent, path) =>
    openSecondaryWindow(path),
  );

  // Zoom level handlers
  ipcMain.handle("set-zoom-level", (_, zoomLevel: number) => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      // Store immediately for consistency
      store.set("zoomFactor", zoomLevel);
      // Apply zoom factor with debouncing to avoid excessive updates
      debouncedSetZoomFactor(zoomLevel, focusedWindow);
      return { success: true };
    } else if (mainWindow) {
      // Store immediately for consistency
      store.set("zoomFactor", zoomLevel);
      // Apply zoom factor with debouncing to avoid excessive updates
      debouncedSetZoomFactor(zoomLevel, mainWindow);
      return { success: true };
    }
    return { success: false, error: "No window to set zoom level" };
  });

  ipcMain.handle("get-zoom-level", () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      return {
        success: true,
        zoomLevel: store.get("zoomFactor", 0.7),
      };
    } else if (mainWindow) {
      return {
        success: true,
        zoomLevel: store.get("zoomFactor", 0.7),
      };
    }
    return { success: false, error: "No window to get zoom level" };
  });

  // Create reload function
  const reloadCurrentWindow = () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      focusedWindow.reload();
    } else if (mainWindow) {
      mainWindow.reload();
    }
  };


  const stayOnTop = () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      const isAlwaysOnTop = focusedWindow.isAlwaysOnTop();
      focusedWindow.setAlwaysOnTop(!isAlwaysOnTop);
    }
  }

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          label: "Check for Updates…",
          click: () => autoUpdater.checkForUpdates(),
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:", role: "undo" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:", role: "redo" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:", role: "cut" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:", role: "copy" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:", role: "paste" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:", role: "selectAll" }
        ]},
    {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click: reloadCurrentWindow,
        },
        {
          label: "Force Reload",
          accelerator: "CmdOrCtrl+Shift+R",
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
              focusedWindow.webContents.reloadIgnoringCache();
            } else if (mainWindow) {
              mainWindow.webContents.reloadIgnoringCache();
            }
          },
        },
        { label: "Toggle Always on Top", click: stayOnTop },
        { type: "separator" },
        { role: "toggleDevTools" },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  ipcMain.handle("dialog:openFile", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({});
    if (canceled) {
      return;
    } else {
      return filePaths[0];
    }
  });
});
