import { useMikro } from "@/app/Arkitekt";
import { getRefetchableQueriesForEntities } from "@/lib/localactions/helpers/refetch";
import { usePutFilesInFolderMutation } from "@/mikro-next/api/graphql";

/**
 * The one place that knows how to move files between folders.
 *
 * Shared by the picker dialog and the page button so both invalidate the same
 * things: whatever is on screen showing a moved file, plus the destination —
 * which does not mention the file yet and so would not match on its own.
 */
export const useFolderMove = () => {
  const client = useMikro();
  const [putFilesInFolder, { loading }] = usePutFilesInFolderMutation();

  const moveOptions = (files: string[], folder: string) => ({
    variables: { selfs: files, other: folder },
    refetchQueries: getRefetchableQueriesForEntities(client, [
      ...files.map((id) => ({ typename: "File", id })),
      { typename: "Folder", id: folder },
    ]).map(({ query, variables }) => ({ query, variables })),
  });

  return { putFilesInFolder, moveOptions, loading };
};
