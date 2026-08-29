import { Explainer } from "@/components/explainer/Explainer";
import { Button } from "@/components/ui/button";
import { MikroFolder } from "@/linkers";
import { PlusIcon } from "lucide-react";
import React from "react";
import { GetFoldersDocument, useCreateFolderMutation } from "../api/graphql";
import FolderList from "../components/lists/FolderList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const [createFolder] = useCreateFolderMutation({
    variables: {
      input: { name: "New Folder" }
    },
    refetchQueries: [GetFoldersDocument]
  });

  return (
    <MikroFolder.ListPage
      title="Folders"
      pageActions={
        <>
          <Button variant="outline" size="sm" onClick={() => createFolder()}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New
          </Button>
        </>
      }
    >
      <div className="p-3">
        <Explainer
          title="Folders"
          description="Folders group your datasets and files together, just like folders in a file system."
        />
        <FolderList defaultLimit={30} filters={{ parentless: true }} />
      </div>
    </MikroFolder.ListPage>
  );
};

export default Page;
