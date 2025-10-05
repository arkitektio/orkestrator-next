// main/issue-reporter.ts
import { ipcMain, BrowserWindow, shell, clipboard, nativeImage } from "electron";
import os from "node:os";

// ✅ Adjust these for your repo
const GITHUB_OWNER = "arkitektio";       // or "arkitekt-io" if that’s your org
const GITHUB_REPO = "orkestrator-next"; // repo name

function encode(s: string) {
    return encodeURIComponent(s);
}

function buildIssueUrl({
    title,
    body,
    labels,
    template,
}: {
    title: string;
    body: string;
    labels?: string[];
    template?: string;
}) {
    const base = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/new`;
    const params = new URLSearchParams();
    if (title) params.set("title", title);
    if (body) params.set("body", body);
    if (labels?.length) params.set("labels", labels.join(","));
    if (template) params.set("template", template); // e.g. "bug_report.md"
    return `${base}?${params.toString()}`;
}

/**
 * Register the IPC handler. Call registerIssueIpc() in app.whenReady().
 *
 * Renderer can call:
 *   await window.api.reportIssue({ title?, extra?, includeScreenshot? })
 */
export function registerIssueIpc() {
    ipcMain.handle("arkitekt.reportIssue", async (event, args: {
        title?: string;
        extra?: string;           // extra notes from renderer (e.g., user text)
        includeScreenshot?: boolean;
        labels?: string[];
        template?: string;        // e.g. "bug_report.md"
    }) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        const currentUrl = win?.webContents.getURL() || "unknown";

        // Optional screenshot -> copy to clipboard so user can paste into GitHub
        let screenshotNote = "";
        if (args?.includeScreenshot && win) {
            const image = await win.webContents.capturePage();
            if (!image.isEmpty()) {
                clipboard.writeImage(image as nativeImage);
                screenshotNote =
                    "\n\n**Screenshot:** Copied to clipboard — paste it here (Ctrl/Cmd+V).";
            }
        }

        // Basic environment info (helps triage)
        const appVersion = process.env.npm_package_version ?? "unknown";
        const platform = `${os.platform()} ${os.release()}`;
        const arch = process.arch;

        // Construct prefilled issue
        const title =
            args?.title ??
            "Bug: unexpected behavior in Orkestrator Next";

        const body = [
            `### What happened?`,
            args?.extra?.trim() || "_Describe the issue..._",
            "",
            `### Reproduction / Context`,
            `- Current page: \`${currentUrl}\``,
            "",
            `### Environment`,
            `- App version: \`${appVersion}\``,
            `- OS: \`${platform}\``,
            `- Arch: \`${arch}\``,
            screenshotNote,
        ].join("\n");

        const url = buildIssueUrl({
            title,
            body,
            labels: args?.labels ?? ["bug"],
            template: args?.template, // if you have e.g. bug_report.md
        });

        await shell.openExternal(url);

        return { ok: true, url, copiedScreenshot: !!screenshotNote };
    });
}