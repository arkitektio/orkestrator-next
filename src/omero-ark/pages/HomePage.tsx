import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import ProjectList from "../components/lists/ProjectList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout title="title" actions={<></>}>
      <ProjectList />
    </PageLayout>
  );
};

export default Page;
