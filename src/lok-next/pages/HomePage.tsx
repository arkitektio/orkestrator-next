import { PageLayout } from "@/components/layout/PageLayout";
import { ActionButton } from "@/components/ui/action";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useCreateRoomMutation, useMeQuery } from "../api/graphql";
import { ThreadsCarousel } from "../components/carousels/ThreadsCarousel";
import ServiceList from "../components/lists/ServiceList";
import AppList from "../components/lists/AppList";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout title="Lok">
      <ThreadsCarousel />

      <AppList />

      <Separator />
    </PageLayout>
  );
};

export default Page;
