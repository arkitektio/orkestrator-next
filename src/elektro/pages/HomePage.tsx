import { PageLayout } from "@/components/layout/PageLayout";
import { ActionButton } from "@/components/ui/action";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useCreateRoomMutation } from "../api/graphql";
import RoomsCarousel from "../components/carousels/RoomsCarousel";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  

  return (
    <PageLayout
      title="Elektro"
      actions={
        <>
        </>
      }
    >
      No Datatypes yet, come back later

      <Separator />
    </PageLayout>
  );
};

export default Page;
