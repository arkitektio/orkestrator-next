import React from "react";
import ProjectList from "../components/lists/ProjectList";
import { PageLayout } from "@/components/layout/PageLayout";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout actions={<></>}>
      <ProjectList/>
    </PageLayout>
  );
};

export default Page;
