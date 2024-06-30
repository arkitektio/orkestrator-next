import { PageLayout } from "@/components/layout/PageLayout";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { PopularCarousel } from "@/lok-next/components/PopularCarousel";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout title="Lok">
      <DetailPane className="p-3 @container">
        <PopularCarousel />
        <DetailPaneHeader></DetailPaneHeader>
      </DetailPane>

      <Separator />

      <div className="p-3 @container">
        <DetailPaneTitle>Hi</DetailPaneTitle>
      </div>
    </PageLayout>
  );
};

export default Page;
