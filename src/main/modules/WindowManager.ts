import { is } from '@electron-toolkit/utils';
import { app, BrowserWindow, dialog, Menu, shell } from 'electron';
import Store from 'electron-store';
import { join } from 'path';
import { AppModule } from './AppModule';
import { IpcTransport } from './IpcTransport';

import { autoUpdater } from 'electron-updater';

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

export class WindowManager implements AppModule {
    private mainWindow: BrowserWindow | null = null;
    private windows: Set<BrowserWindow> = new Set();
    private store: Store;
    private ipcTransport: IpcTransport;
    private debouncedSetZoomFactor: (zoomLevel: number, window: BrowserWindow) => void;

    constructor(ipcTransport: IpcTransport) {
        this.store = new Store();
        this.ipcTransport = ipcTransport;
        this.debouncedSetZoomFactor = debounce((zoomLevel: number, window: BrowserWindow) => {
            window.webContents.setZoomFactor(zoomLevel);
        }, 150);
    }

    setup() {
        this.setupIpcHandlers();
        this.setupApplicationMenu();
    }

    onSecondInstance(_: any, commandLine: string[], __: string) {
        // Someone tried to run a second instance, we should focus our window.
        if (this.mainWindow) {
            if (this.mainWindow.isMinimized()) this.mainWindow.restore();
            this.mainWindow.focus();
        }

        // Handle deep link on Windows/Linux
        const url = commandLine.find(arg => arg.startsWith('orkestrator://'));
        if (url) {
            this.handleOrkestratorUrl(url);
        }
    }

    getMainWindow(): BrowserWindow | null {
        return this.mainWindow;
    }

    handleOrkestratorUrl(url: string) {
        try {
            console.log(url);
            const parsedUrl = new URL(url);
            // Remove the protocol and get everything after orkestrator://
            const fullPath = parsedUrl.hostname + parsedUrl.pathname;

            if (this.mainWindow) {
                if (this.mainWindow.isMinimized()) this.mainWindow.restore();
                this.mainWindow.focus();
            }

            this.createSecondaryWindow(fullPath, "");
        } catch (err) {
            console.error("Invalid orkestrator URL", url);
            dialog.showErrorBox(
                "Invalid Link",
                `The URL '${url}' could not be processed.`
            );
        }
    }

    createMainWindow(iconPath: string): BrowserWindow {
        this.mainWindow = new BrowserWindow({
            width: 900,
            height: 670,
            show: false,
            title: "Orkestrator",
            icon: iconPath,
            autoHideMenuBar: true,
            ...(process.platform === "linux" ? { icon: iconPath } : {}),
            webPreferences: {
                preload: join(__dirname, "../preload/index.mjs"),
                sandbox: false,
                nodeIntegrationInWorker: false,
                contextIsolation: true,
            },
        });

        // Try restoring zoom factor
        const zoom = this.store.get("zoomFactor", 0.7) as number;
        this.mainWindow.webContents.setZoomFactor(zoom);

        this.mainWindow.webContents.setWindowOpenHandler((details) => {
            return { action: "deny" };
        });

        this.mainWindow.on("resize", () => {
            if (this.mainWindow) {
                this.mainWindow.webContents.setZoomFactor(this.store.get("zoomFactor", 0.7) as number);
            }
        });

        this.mainWindow.on('ready-to-show', () => {
            this.mainWindow?.show();
            this.mainWindow?.webContents.setZoomFactor(1.0);
            if (is.dev) {
                this.mainWindow?.webContents.openDevTools({ mode: 'right' });
            }
        });

        this.mainWindow.webContents.on('devtools-opened', () => {
            this.mainWindow?.webContents.openDevTools({ mode: 'right' });
        });

        // HMR for renderer
        if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
            this.mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
        } else {
            this.mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
        }

        const currentWindow = this.mainWindow;
        this.mainWindow.on('closed', () => {
            this.windows.delete(currentWindow);
            if (this.mainWindow === currentWindow) {
                this.mainWindow = null;
            }
        });

        this.windows.add(this.mainWindow);
        return this.mainWindow;
    }

    createSecondaryWindow(path: string, iconPath: string): BrowserWindow {
        const secondaryWindow = new BrowserWindow({
            width: 900,
            height: 670,
            show: false,
            autoHideMenuBar: true,
            ...(process.platform === "linux" ? { icon: iconPath } : {}),
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

        if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
            const loaded_url = process.env["ELECTRON_RENDERER_URL"] + "#" + path;
            secondaryWindow.loadURL(loaded_url);
        } else {
            secondaryWindow
                .loadFile(join(__dirname, "../renderer/index.html"))
                .then(() => {
                    secondaryWindow.webContents.executeJavaScript(
                        `window.location = '#${path}'`
                    );
                });
        }

        secondaryWindow.on('closed', () => {
            this.windows.delete(secondaryWindow);
        });

        this.windows.add(secondaryWindow);
        return secondaryWindow;
    }

    createFaktsWindow(url: string, iconPath: string): void {
        const faktsWindows = new BrowserWindow({
            width: 900,
            height: 670,
            show: false,
            autoHideMenuBar: true,
            ...(process.platform === "linux" ? { icon: iconPath } : {}),
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

        faktsWindows.webContents.session.webRequest.onBeforeRequest(
            {
                urls: [
                    `${baseUrl.origin}${baseRoot}/success*`,
                    `${baseUrl.origin}${baseRoot}/failure*`,
                ],
            },
            async ({ url }, callback) => {
                faktsWindows.close();
                callback({});
            }
        );

        faktsWindows.loadURL(url);
    }

    getAllWindows() {
        return Array.from(this.windows);
    }

    private setupIpcHandlers() {
        this.ipcTransport.handleChannel("reload-window", () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
                focusedWindow.reload();
                return { success: true };
            } else if (this.mainWindow) {
                this.mainWindow.reload();
                return { success: true };
            }
            return { success: false, error: "No window to reload" };
        });

        this.ipcTransport.handleChannel("force-reload-window", () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
                focusedWindow.webContents.reloadIgnoringCache();
                return { success: true };
            } else if (this.mainWindow) {
                this.mainWindow.webContents.reloadIgnoringCache();
                return { success: true };
            }
            return { success: false, error: "No window to reload" };
        });

        this.ipcTransport.handleChannel("set-zoom-level", (_, zoomLevel: number) => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
                this.store.set("zoomFactor", zoomLevel);
                this.debouncedSetZoomFactor(zoomLevel, focusedWindow);
                return { success: true };
            } else if (this.mainWindow) {
                this.store.set("zoomFactor", zoomLevel);
                this.debouncedSetZoomFactor(zoomLevel, this.mainWindow);
                return { success: true };
            }
            return { success: false, error: "No window to set zoom level" };
        });

        this.ipcTransport.handleChannel("get-zoom-level", () => {
            if (BrowserWindow.getFocusedWindow() || this.mainWindow) {
                return {
                    success: true,
                    zoomLevel: this.store.get("zoomFactor", 0.7),
                };
            }
            return { success: false, error: "No window to get zoom level" };
        });

        this.ipcTransport.onChannel("open-second-window", (_, path) => this.createSecondaryWindow(path, ""));

        this.ipcTransport.handleChannel("dialog:openFile", async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog({});
            if (canceled) { return; }
            return filePaths[0];
        });
    }

    private setupApplicationMenu() {
        const reloadCurrentWindow = () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
                focusedWindow.reload();
            } else if (this.mainWindow) {
                this.mainWindow.reload();
            }
        };

        const stayOnTop = () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow) {
                const isAlwaysOnTop = focusedWindow.isAlwaysOnTop();
                focusedWindow.setAlwaysOnTop(!isAlwaysOnTop);
            }
        };

        const menu = Menu.buildFromTemplate([
            {
                label: app.name,
                submenu: [
                    {
                        label: "Check for Updates…",
                        click: () => autoUpdater.checkForUpdates()
                    },
                    { type: "separator" },
                    { role: "quit" },
                ],
            },
            {
                label: "Edit",
                submenu: [
                    { label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo" },
                    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
                    { type: "separator" },
                    { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
                    { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
                    { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
                    { label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectAll" }
                ]
            },
            {
                label: "View",
                submenu: [
                    { label: "Reload", accelerator: "CmdOrCtrl+R", click: reloadCurrentWindow },
                    {
                        label: "Force Reload",
                        accelerator: "CmdOrCtrl+Shift+R",
                        click: () => {
                            const focusedWindow = BrowserWindow.getFocusedWindow();
                            if (focusedWindow) {
                                focusedWindow.webContents.reloadIgnoringCache();
                            } else if (this.mainWindow) {
                                this.mainWindow.webContents.reloadIgnoringCache();
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
    }
}
