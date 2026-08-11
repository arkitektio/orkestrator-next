import { useDialog } from "@/app/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  describeSubject,
  useFolderMove,
  type FolderMoveSubject,
} from "@/mikro-next/components/folder/useFolderMove";
import { useState } from "react";
import { toast } from "sonner";
import { useGetFoldersQuery } from "../api/graphql";

/** Pick the folder to file files or array datasets into. */
export type MoveToFolderFormProps = {
  /** What is being moved. */
  subject: FolderMoveSubject;
  /** The folder it sits in now, when known — marked and unclickable. */
  currentFolder?: string | null;
};

const FOLDER_LIMIT = 20;

export const MoveToFolderForm = (props: MoveToFolderFormProps) => {
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<string>();
  const { closeDialog } = useDialog();
  const { move: moveTo } = useFolderMove();

  const { data, loading } = useGetFoldersQuery({
    variables: {
      filters: { search: search || undefined },
      pagination: { limit: FOLDER_LIMIT },
    },
  });

  const move = (folder: { id: string; name: string }) => {
    setPending(folder.id);
    moveTo(props.subject, folder.id)
      .then(() => {
        toast.success(`Moved to ${folder.name}`);
        closeDialog();
      })
      .catch((e: Error) => toast.error("Could not move: " + e.message))
      .finally(() => setPending(undefined));
  };

  const folders = data?.folders ?? [];

  return (
    <>
      <DialogHeader>
        <DialogTitle>Move to Folder</DialogTitle>
        <DialogDescription>
          Move {describeSubject(props.subject)} into a folder
        </DialogDescription>
      </DialogHeader>
      <div className="mt-2 flex flex-col gap-2">
        <Input
          placeholder="Search folders…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex max-h-[50vh] flex-col gap-1 overflow-y-auto">
          {folders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              disabled={
                pending !== undefined || folder.id === props.currentFolder
              }
              onClick={() => move({ id: folder.id, name: folder.name })}
              className="flex w-full items-center justify-between gap-2 rounded border border-input p-2 text-left transition-colors hover:bg-accent disabled:opacity-50"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{folder.name}</div>
                {folder.description && (
                  <div className="truncate text-xs text-muted-foreground">
                    {folder.description}
                  </div>
                )}
              </div>
              {pending === folder.id ? (
                <Badge variant="outline">Moving…</Badge>
              ) : folder.id === props.currentFolder ? (
                <Badge variant="outline">Current</Badge>
              ) : (
                folder.isDefault && <Badge variant="outline">Default</Badge>
              )}
            </button>
          ))}
          {!loading && !folders.length && (
            <div className="text-xs text-muted-foreground">No folders found</div>
          )}
          {/* The list is capped, so a full page is indistinguishable from "your
              folder does not exist" unless it says so. */}
          {folders.length === FOLDER_LIMIT && (
            <div className="pt-1 text-xs text-muted-foreground">
              Showing the first {FOLDER_LIMIT} folders — search to narrow.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
