import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import DatasetList from "../components/lists/DatasetList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout actions={<></>}>
      <DatasetList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default Page;
