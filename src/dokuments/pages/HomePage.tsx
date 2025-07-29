import { PageLayout } from "@/components/layout/PageLayout";
import { Separator } from "@radix-ui/react-dropdown-menu";
import FileList from "@/dokuments/components/lists/FileList";
import React from "react";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const handleCreateRoom = async () => {
    alert("Creating room");
  };

  return (
    <PageLayout
      title="Dokuments"
      pageActions={
        <>
        </>
      }
    >
      <Separator />
      <FileList />
    </PageLayout>
  );
};

export default Page;
