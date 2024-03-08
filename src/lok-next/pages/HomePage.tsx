import { PageLayout } from "@/components/layout/PageLayout";
import {
  DetailPane,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import React from "react";
import ClientList from "../components/lists/ClientList";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {

  return (
    <PageLayout >
      <DetailPane className="p-3 @container">
        <DetailPaneHeader>
          <DetailPaneTitle>Hi</DetailPaneTitle>
          <ClientList/>
        </DetailPaneHeader>
      </DetailPane>
    </PageLayout>
  );
};

export default Page;
