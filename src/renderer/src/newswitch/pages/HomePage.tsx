import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const handleCreateRoom = async () => {
    alert("Creating room");
  };

  return (
    <PageLayout
      title="Lovekit"
      pageActions={
        <>
          <Button
            onClick={handleCreateRoom}
            title="Create Room"
            variant={"outline"}
          >
            Create Stream
          </Button>
        </>
      }
    >
      <Separator />
    </PageLayout>
  );
};

export default Page;
