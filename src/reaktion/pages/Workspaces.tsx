import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import { useNavigate } from "react-router-dom";
import WorkspaceList from "../components/lists/WorkspaceList";
import WorkspaceCarousel from "../edit/carousels/WorkspaceCarousel";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Workspaces"
      pageActions={<div className="flex flex-row gap-2"></div>}
    >
      <WorkspaceCarousel />
      <div className="p-6">
        <WorkspaceList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default Page;
