import { PageLayout } from "@/components/layout/PageLayout";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { PopularCarousel } from "@/lok-next/components/PopularCarousel";
import React from "react";
import ClientList from "../components/lists/ClientList";
import RedeemTokenList from "../components/lists/RedeemTokenList";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout title="Lok">
      <DetailPane className="p-3 @container">
        <PopularCarousel />
        <DetailPaneHeader>
          <DetailPaneTitle>Hi</DetailPaneTitle>
          <ClientList />
          <RedeemTokenList />
        </DetailPaneHeader>
      </DetailPane>
    </PageLayout>
  );
};

export default Page;
