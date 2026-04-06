import { dialog, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { IpcTransport } from './IpcTransport';
import { WindowManager } from './WindowManager';
import { AppModule } from './AppModule';

export class AppUpdater implements AppModule {
    constructor(private ipcTransport: IpcTransport, private windowManager: WindowManager) {}

    setup() {
        log.transports.file.level = "info";
        autoUpdater.logger = log;

        autoUpdater.autoDownload = true;
        autoUpdater.autoInstallOnAppQuit = true;

        autoUpdater.on("checking-for-update", () =>
            this.broadcast("updater:status", "Checking…"),
        );
        autoUpdater.on("update-available", (info) =>
            this.broadcast("updater:available", info),
        );
        autoUpdater.on("update-not-available", () =>
            this.broadcast("updater:none"),
        );
        autoUpdater.on("download-progress", (p) =>
            this.broadcast("updater:progress", p),
        );
        autoUpdater.on("error", (err) =>
            this.broadcast("updater:error", String(err)),
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
        // Periodic check (e.g., every 4 hours)
        setInterval(() => autoUpdater.checkForUpdates(), 4 * 60 * 60 * 1000);

        this.ipcTransport.handleChannel("check-for-updates", async () => {
            try {
                const result = await autoUpdater.checkForUpdates();
                return { success: true, result };
            } catch (error) {
                console.error("Manual update check failed:", error);
                return { success: false, error: String(error) };
            }
        });
    }

    private broadcast(channel: string, ...args: any[]) {
        const mainWindow = this.windowManager.getMainWindow();
        if (mainWindow) {
            this.ipcTransport.sendTo(mainWindow.webContents, channel, ...args);
        }
    }
}
