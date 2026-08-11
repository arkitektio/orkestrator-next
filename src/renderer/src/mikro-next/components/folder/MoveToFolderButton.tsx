import { useDialog } from "@/app/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ordering, useGetFoldersQuery } from "@/mikro-next/api/graphql";
import { Check, FolderInput, Search } from "lucide-react";
import { toast } from "sonner";
import { useFolderMove } from "./useFolderMove";

/** How many folders the quick list offers before "Browse all folders…". */
const RECENT_LIMIT = 5;

export type MoveToFolderButtonProps = {
  /** The files this button moves. */
  files: string[];
  /**
   * The folder they sit in now, shown as a badge on the trigger.
   *
   * `undefined` means *unknown* and draws no badge — which is what every caller
   * passes today, because the mikro schema exposes no folder field on `File`
   * (only `FileFilter.folder`, so the relation exists but cannot be read back).
   * `null` is the different, knowable claim "in no folder".
   */
  currentFolder?: { id: string; name: string } | null;
};

/**
 * Move files into a folder, in one click for the common case.
 *
 * The dropdown lists the newest folders — most work happens in something made
 * recently — and hands off to the searchable picker dialog for everything else.
 * It is the same mutation and the same refetching either way; see
 * {@link useFolderMove}.
 */
export const MoveToFolderButton = ({
  files,
  currentFolder,
}: MoveToFolderButtonProps) => {
  const { openDialog } = useDialog();
  const { putFilesInFolder, moveOptions, loading } = useFolderMove();

  // Newest first. Not scoped to the current user: mikro filters `owner` by the
  // creator's *sub*, which nothing in the client can supply — lok's `me` carries
  // an id and a username, and the two are different keys (see the note in
  // ADatasetFilterBar).
  const { data } = useGetFoldersQuery({
    variables: {
      ordering: [{ createdAt: Ordering.Desc }],
      pagination: { limit: RECENT_LIMIT },
    },
  });

  const move = (folder: { id: string; name: string }) => {
    putFilesInFolder(moveOptions(files, folder.id))
      .then(() =>
        toast.success(
          files.length > 1
            ? `${files.length} files moved to ${folder.name}`
            : `Moved to ${folder.name}`,
        ),
      )
      .catch((e: Error) => toast.error("Could not move: " + e.message));
  };

  const folders = data?.folders ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={loading || files.length === 0}
          className="flex items-center gap-2 shadow-sm"
        >
          <FolderInput className="h-4 w-4" />
          Move to Folder
          {currentFolder !== undefined && (
            <Badge variant="secondary" className="max-w-40 truncate">
              {currentFolder?.name ?? "Unfiled"}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Recent folders
        </DropdownMenuLabel>
        {folders.map((folder) => {
          const isCurrent = folder.id === currentFolder?.id;
          return (
            <DropdownMenuItem
              key={folder.id}
              disabled={isCurrent}
              onSelect={() => move({ id: folder.id, name: folder.name })}
              className="flex items-center justify-between gap-2"
            >
              <span className="truncate">{folder.name}</span>
              {isCurrent && <Check className="h-4 w-4 shrink-0" />}
            </DropdownMenuItem>
          );
        })}
        {!folders.length && (
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            No folders yet
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() =>
            openDialog(
              "movetofolder",
              { files, currentFolder: currentFolder?.id ?? null },
              { className: "max-w-lg" },
            )
          }
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Browse all folders…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
