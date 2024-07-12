import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import React from "react";
import TableList from "../components/lists/TableList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout
      title="Tables"
      pageActions={
        <>
          <Button variant="outline" size="sm">
            <UploadIcon className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </>
      }
    >
      <TableList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
