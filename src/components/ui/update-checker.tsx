import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./button";
import { Alert, AlertDescription } from "./alert";
import { Progress } from "./progress";
import { CheckCircle, Download, RefreshCw, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpdateStatus {
    isChecking: boolean;
    updateAvailable: boolean;
    updateInfo?: any;
    progress?: number;
    error?: string;
    status?: string;
    checkComplete: boolean;
}

export const UpdateChecker: React.FC = () => {
    const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
        isChecking: false,
        updateAvailable: false,
        checkComplete: false,
    });

    const [showAlert, setShowAlert] = useState(false);

    // Set up event listeners for update events
    useEffect(() => {
        if (!window.updates) return;

        const handleStatus = (status: string) => {
            setUpdateStatus(prev => ({ ...prev, status, isChecking: true }));
        };

        const handleUpdateAvailable = (info: any) => {
            setUpdateStatus(prev => ({
                ...prev,
                updateAvailable: true,
                updateInfo: info,
                isChecking: false,
                checkComplete: true
            }));
            setShowAlert(true);
        };

        const handleUpdateNone = () => {
            setUpdateStatus(prev => ({
                ...prev,
                updateAvailable: false,
                isChecking: false,
                checkComplete: true,
                error: undefined
            }));
            setShowAlert(true);
        };

        const handleProgress = (progress: any) => {
            setUpdateStatus(prev => ({ ...prev, progress: progress.percent }));
        };

        const handleError = (error: any) => {
            setUpdateStatus(prev => ({
                ...prev,
                error: String(error),
                isChecking: false,
                checkComplete: true
            }));
            setShowAlert(true);
        };

        // Register event listeners
        window.updates.onStatus(handleStatus);
        window.updates.onAvailable(handleUpdateAvailable);
        window.updates.onNone(handleUpdateNone);
        window.updates.onProgress(handleProgress);
        window.updates.onError(handleError);

        // Note: electron-updater doesn't provide a way to remove listeners,
        // so we can't properly clean up. This is a limitation of the current setup.
    }, []);

    const checkForUpdates = useCallback(async () => {
        if (!window.updates) {
            setUpdateStatus(prev => ({
                ...prev,
                error: "Update system not available",
                checkComplete: true
            }));
            setShowAlert(true);
            return;
        }

        setUpdateStatus(prev => ({
            ...prev,
            isChecking: true,
            error: undefined,
            checkComplete: false
        }));
        setShowAlert(false);

        try {
            const result = await window.updates.checkForUpdates();
            if (!result.success || result.error) {
                setUpdateStatus(prev => ({
                    ...prev,
                    error: result.error,
                    isChecking: false,
                    checkComplete: true
                }));
                setShowAlert(true);
            }
            // If successful, the event listeners will handle the response
        } catch (error) {
            setUpdateStatus(prev => ({
                ...prev,
                error: String(error),
                isChecking: false,
                checkComplete: true
            }));
            setShowAlert(true);
        }
    }, []);

    const dismissAlert = () => {
        setShowAlert(false);
    };

    const getStatusIcon = () => {
        if (updateStatus.isChecking) {
            return <RefreshCw className="h-4 w-4 animate-spin" />;
        }
        if (updateStatus.error) {
            return <AlertTriangle className="h-4 w-4" />;
        }
        if (updateStatus.updateAvailable) {
            return <Download className="h-4 w-4" />;
        }
        if (updateStatus.checkComplete) {
            return <CheckCircle className="h-4 w-4" />;
        }
        return <RefreshCw className="h-4 w-4" />;
    };

    const getButtonText = () => {
        if (updateStatus.isChecking) {
            return updateStatus.status || "Checking for updates...";
        }
        return "Check for Updates";
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Button
                    onClick={checkForUpdates}
                    disabled={updateStatus.isChecking}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    {getStatusIcon()}
                    {getButtonText()}
                </Button>
            </div>

            {updateStatus.progress !== undefined && updateStatus.progress > 0 && (
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        Downloading update: {Math.round(updateStatus.progress)}%
                    </div>
                    <Progress value={updateStatus.progress} />
                </div>
            )}

            {showAlert && (
                <Alert
                    variant={updateStatus.error ? "destructive" : "default"}
                    className="relative"
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6"
                        onClick={dismissAlert}
                    >
                        <X className="h-4 w-4" />
                    </Button>

                    <div className="pr-8">
                        {updateStatus.error && (
                            <>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>Update check failed:</strong> {updateStatus.error}
                                </AlertDescription>
                            </>
                        )}

                        {updateStatus.updateAvailable && updateStatus.updateInfo && (
                            <>
                                <Download className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>Update available:</strong> Version {updateStatus.updateInfo.version} is ready to download.
                                    {updateStatus.updateInfo.releaseNotes && (
                                        <div className="mt-2 text-sm">
                                            <strong>Release Notes:</strong>
                                            <div className="mt-1 max-h-32 overflow-y-auto text-xs">
                                                {updateStatus.updateInfo.releaseNotes}
                                            </div>
                                        </div>
                                    )}
                                </AlertDescription>
                            </>
                        )}

                        {updateStatus.checkComplete && !updateStatus.updateAvailable && !updateStatus.error && (
                            <>
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>You're up to date!</strong> No updates are available at this time.
                                </AlertDescription>
                            </>
                        )}
                    </div>
                </Alert>
            )}
        </div>
    );
};