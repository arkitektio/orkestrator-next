import { ipcMain, IpcMainInvokeEvent, IpcMainEvent } from 'electron';
import EventEmitter from 'events';

export class IpcTransport extends EventEmitter {
    constructor() {
        super();
    }

    /**
     * Listen for IPC events from the renderer process.
     */
    onChannel(channel: string, listener: (event: IpcMainEvent, ...args: any[]) => void) {
        ipcMain.on(channel, listener);
    }

    /**
     * Handle IPC invocations from the renderer process.
     */
    handleChannel(channel: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any) {
        ipcMain.handle(channel, listener);
    }

    /**
     * Send a message to the provided WebContents (like a BrowserWindow).
     */
    sendTo(webContents: Electron.WebContents, channel: string, ...args: any[]) {
        if (!webContents.isDestroyed()) {
            webContents.send(channel, ...args);
        }
    }
}
