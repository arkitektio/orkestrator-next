import { Button } from "@/components/ui/button";
import { MikroFile } from "@/linkers";
import { UploadIcon } from "lucide-react";
import React from "react";
import FileList from "../components/lists/FileList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <MikroFile.ListPage
      title="Datasets"
      pageActions={
        <>
          <Button variant="outline" size="sm">
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </>
      }
    >
      <FileList pagination={{ limit: 30 }} />
    </MikroFile.ListPage>
  );
};

export default Page;
