import { downloadElektroBigFile } from "@/datalayer/hooks/useElektroBigFileDownload";
import {
  GetFileDocument,
  GetFileQuery,
  GetFileQueryVariables,
} from "@/elektro/api/graphql";
import { TaskHook } from "@/lib/taskhooks/types";
import { toast } from "sonner";

export const ELEKTRO_FILE_IDENTIFIER = "@elektro/file";
export const ELEKTRO_DOWNLOAD_HOOK = "elektro.download";

/**
 * Download an `@elektro/file` returned by a completed task to the local machine.
 * Attach it to an exporter (via `addPendingHook({ hookType: "elektro.download",
 * ... })`); the runner invokes this when the task yields.
 */
const downloadHook: TaskHook = {
  type: ELEKTRO_DOWNLOAD_HOOK,
  onSuccess: async (ctx) => {
    const name = (ctx.params.modelName as string | undefined) ?? "model";

    const client = ctx.getClient("elektro");
    if (!client) {
      toast.error("Elektro is not available to download the file.");
      return;
    }
    if (!ctx.datalayerEndpoint) {
      toast.error("No datalayer endpoint configured.");
      return;
    }

    // `returns` is positional, aligned to the task action's return ports.
    const returnPorts = ctx.task.action?.returns ?? [];
    const fileIndex = returnPorts.findIndex(
      (p) => p.identifier === ELEKTRO_FILE_IDENTIFIER,
    );
    const fileId = ctx.returns[fileIndex >= 0 ? fileIndex : 0] as
      | string
      | undefined;
    if (!fileId) {
      toast.error(`Export of ${name} produced no file.`);
      return;
    }

    const res = await client.query<GetFileQuery, GetFileQueryVariables>({
      query: GetFileDocument,
      variables: { id: fileId },
    });
    const file = res.data?.file;
    if (!file) throw new Error("Exported file not found");

    await ctx.startDownload(file.name, ({ id, signal, onProgress }) =>
      downloadElektroBigFile(client, ctx.datalayerEndpoint!, file.store.id, file.name, {
        id,
        signal,
        onProgress,
      }),
    );

    toast.success(`Exported ${name} — ${file.name} downloaded.`);
  },
};

export const ELEKTRO_TASK_HOOKS: TaskHook[] = [downloadHook];
