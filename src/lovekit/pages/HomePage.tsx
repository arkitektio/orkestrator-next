import { PageLayout } from "@/components/layout/PageLayout";
import { ActionButton } from "@/components/ui/action";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AlpakaRoom } from "@/linkers";

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
          <ActionButton
            run={handleCreateRoom}
            title="Create Room"
            variant={"outline"}
            label="Create Room"
          >
            Create Stream
          </ActionButton>
        </>
      }
    >
      <Separator />
    </PageLayout>
  );
};

export default Page;
