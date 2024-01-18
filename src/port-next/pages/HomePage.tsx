import React from "react";
import PodList from "../components/lists/PodList";
import { PageLayout } from "@/components/layout/PageLayout";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout actions={<></>}>
      <PodList/>
    </PageLayout>
  );
};

export default Page;
