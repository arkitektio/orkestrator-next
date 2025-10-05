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

const store = new Store();

app.commandLine.appendSwitch("ignore-certificate-errors", "true");

let mainWindow: BrowserWindow | null = null;

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
    console.log("Manual update check result:", result);
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
    const { host: modelIdentifier, pathname } = new URL(url);
    const id = pathname.replace(/^\/+/, ""); // strip leading slashes
    const fullPath = `${modelIdentifier}/${id}`;
    console.log("Handling orkestrator URL:", fullPath);

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
    },
  });

  mainWindow.webContents.setZoomFactor(store.get("zoomFactor", 0.7));


  mainWindow.webContents.setWindowOpenHandler((details) => {
    return { action: "deny" };
  });



  mainWindow.on("resize", () => {
    const [width, height] = mainWindow?.getSize() || [900, 670];
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
    // Set initial zoom level (1.0 = 100%)
    mainWindow?.webContents.setZoomFactor(1.0);
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
    console.log("Main window closed");
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
  console.log(baseUrl, baseUrl.origin);

  const baseRoot = baseUrl.pathname.split("/").slice(0, -2).join("/");
  console.log(`${baseUrl.origin}${baseRoot}/success*`);

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

    console.log("URL", parsedUrl);

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
    let loaded_url = process.env["ELECTRON_RENDERER_URL"] + "#" + path;
    console.log("Loading URL", loaded_url);
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

function createAuthWindow(url: string): void {
  // Create the browser window.

  console.log("Creating auth window");
  const authWindow = new BrowserWindow({
    width: 900,
    height: 670,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    ...(process.platform === "linux" ? { icon } : {}),
  });

  authWindow.on("ready-to-show", () => {
    authWindow.show();
  });

  const callback = "http://127.0.0.1:9999/callback";

  const redirect_url = new URL(url);
  redirect_url.searchParams.set("redirect_uri", callback);
  authWindow.loadURL(redirect_url.toString());

  console.log("Loading auth window", redirect_url);

  const {
    session: { webRequest },
  } = authWindow.webContents;
  const filter = { urls: [`${callback}*`] };
  webRequest.onBeforeRequest(filter, async ({ url }) => {
    const parsedUrl = new URL(url);

    const code = parsedUrl.searchParams.get("code");
    if (!code) {
      console.log("Received no code in the response");
      mainWindow?.webContents.send("oauth-error", "No code in the response");
    }
    // Do the rest of the authorization flow with the code.
    else {
      console.log("Received code", code);
      mainWindow?.webContents.send("oauth-response", code);
    }

    authWindow.close();
  });
}

if (process.platform == "darwin") {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.

  // Handle the protocol. In this case, we choose to show an Error Box.
  app.on("open-url", (_, url) => {
    dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
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
    // the commandLine is array of strings in which last element is deep link url
    dialog.showErrorBox(
      "Welcome Back",
      `You arrived from: ${commandLine.pop()}`,
    );
  });

  // Create mainWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    registerIssueIpc();
    createWindow();
  });
}

app.on("window-all-closed", () => {
  console.log("All windows closed");
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

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  mainWindow = createWindow();

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

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

  ipcMain.on("fakts-start", (_: IpcMainEvent, msg) => createFaktsWindow(msg));
  ipcMain.on("oauth-start", (_: IpcMainEvent, url) => createAuthWindow(url));
  ipcMain.on("open-second-window", (_: IpcMainEvent, path) =>
    openSecondaryWindow(path),
  );

  // Zoom level handlers
  ipcMain.handle("set-zoom-level", (_, zoomLevel: number) => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      store.set("zoomFactor", zoomLevel);
      focusedWindow.webContents.setZoomFactor(zoomLevel);
      return { success: true };
    } else if (mainWindow) {
      store.set("zoomFactor", zoomLevel);
      mainWindow.webContents.setZoomFactor(zoomLevel);
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
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
