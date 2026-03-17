import { IpcTransport } from './IpcTransport';
import { AppModule } from './AppModule';
import { ipcMain } from 'electron';
import fs from 'fs';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { BigFileUploadGrant } from '../schemas/mikro'; // or whatever the type is, I can use any here

export class BigFileUploadService implements AppModule {
    private ipcTransport: IpcTransport;
    private s3Clients: Map<string, S3Client> = new Map();
    private activeUploads: Map<string, Upload> = new Map();

    setup() {
        // Required for implementing AppModule
    }

    constructor(ipcTransport: IpcTransport) {
        this.ipcTransport = ipcTransport;

        ipcMain.handle("upload:bigFile", async (event, args: { uploadId: string, path: string, grant: BigFileUploadGrant, endpointUrl: string }) => {
            return this.handleUpload(event, args);
        });

        ipcMain.handle("upload:cancel", async (event, args: { uploadId: string }) => {
            const upload = this.activeUploads.get(args.uploadId);
            if (upload) {
                await upload.abort();
                this.activeUploads.delete(args.uploadId);
            }
        });
    }

    async handleUpload(event: Electron.IpcMainInvokeEvent, args: { uploadId: string, path: string, grant: BigFileUploadGrant, endpointUrl: string }) {
        const { uploadId, path, grant } = args;

        const s3Client = new S3Client({
            region: "us-east-1", // MinIO doesn't care but needs an AWS region
            endpoint: args.endpointUrl || undefined, // Endpoint isn't in grant usually, wait it's passed or defined otherwise
            credentials: {
                accessKeyId: grant.accessKey,
                secretAccessKey: grant.secretKey,
                sessionToken: grant.sessionToken,
            },
            forcePathStyle: true,
        });

        const fileStream = fs.createReadStream(path);
        fileStream.on('error', (err) => {
            console.error("File stream error:", err);
            this.ipcTransport.sendTo(event.sender, `upload-error-${uploadId}`, { error: err.message });
        });

        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: grant.bucket,
                Key: grant.key,
                Body: fileStream,
            },
            partSize: 5 * 1024 * 1024,
            leavePartsOnError: false, // delete parts on error
        });

        this.activeUploads.set(uploadId, upload);

        upload.on("httpUploadProgress", (progress) => {
            this.ipcTransport.sendTo(event.sender, `upload-progress-${uploadId}`, {
                loaded: progress.loaded,
                total: progress.total,
            });
        });

        try {
            await upload.done();
            this.activeUploads.delete(uploadId);
            return grant.store;
        } catch (e: any) {
            this.activeUploads.delete(uploadId);
            throw e;
        }
    }
}
