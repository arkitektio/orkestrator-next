import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import React from "react";
import FileList from "../components/lists/FileList";
import { MikroFile } from "@/linkers";

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
