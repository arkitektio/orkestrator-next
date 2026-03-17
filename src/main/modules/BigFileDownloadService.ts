import { IpcTransport } from './IpcTransport';
import { AppModule } from './AppModule';
import { ipcMain, app } from 'electron';
import fs from 'fs';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { pipeline } from 'stream/promises';
import { Readable, Transform } from 'stream';
import { BigFileAccessGrant } from '../schemas/mikro';

export class BigFileDownloadService implements AppModule {
    private ipcTransport: IpcTransport;
    private activeDownloads: Map<string, any> = new Map(); // AbortController for downloads

    setup() {
        // Required for implementing AppModule
    }

    constructor(ipcTransport: IpcTransport) {
        this.ipcTransport = ipcTransport;

        ipcMain.handle("download:bigFile", async (event, args: { downloadId: string, grant: BigFileAccessGrant, endpointUrl: string, fileName: string, savePath?: string }) => {
            return this.handleDownload(event, args);
        });

        ipcMain.handle("download:cancel", async (_event, args: { downloadId: string }) => {
            const controller = this.activeDownloads.get(args.downloadId);
            if (controller) {
                controller.abort();
                this.activeDownloads.delete(args.downloadId);
            }
        });
    }

    async handleDownload(event: Electron.IpcMainInvokeEvent, args: { downloadId: string, grant: BigFileAccessGrant, endpointUrl: string, fileName: string, savePath?: string }) {
        const { downloadId, grant, fileName } = args;
        const path = require('path');
        const savePath = args.savePath || path.join(app.getPath('downloads'), fileName || 'download');
        console.log(args)

        const s3Client = new S3Client({
            region: "us-east-1",
            endpoint: args.endpointUrl || undefined,
            credentials: {
                accessKeyId: grant.accessKey,
                secretAccessKey: grant.secretKey,
                sessionToken: grant.sessionToken,
            },
            forcePathStyle: true,
        });

        const abortController = new AbortController();
        this.activeDownloads.set(downloadId, abortController);

        try {
            const response = await s3Client.send(new GetObjectCommand({
                Bucket: grant.bucket,
                Key: grant.key,
            }), { abortSignal: abortController.signal });

            const bodyStream = response.Body as Readable;

            console.log("Starting download:", downloadId);

            if (!bodyStream) {
                throw new Error("No body stream in response");
            }

            const total = response.ContentLength || 0;
            let loaded = 0;

            let lastUpdate = 0;
            const progressStream = new Transform({
                transform: (chunk, _encoding, callback) => {
                    loaded += chunk.length;
                    const now = Date.now();
                    if (now - lastUpdate > 250 || loaded === total) {
                        try {
                            this.ipcTransport.sendTo(event.sender, `download-progress-${downloadId}`, {
                                loaded,
                                total,
                            });
                        } catch(e) {}
                        lastUpdate = now;
                    }
                    callback(null, chunk);
                }
            });

            const fileStream = fs.createWriteStream(savePath);
            await pipeline(bodyStream, progressStream, fileStream, { signal: abortController.signal });

            this.activeDownloads.delete(downloadId);
            return savePath;
        } catch (e: any) {
            this.activeDownloads.delete(downloadId);
            if (e.name === 'AbortError') {
                console.log("Download aborted:", downloadId);
                // Optionally clean up partial file
                fs.unlink(savePath, () => {});
            } else {
                console.error("Download error:", e);
                this.ipcTransport.sendTo(event.sender, `download-error-${downloadId}`, { error: e.message });
            }
            throw e;
        }
    }
}
