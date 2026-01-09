import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import { useNavigate } from "react-router-dom";
import RunList from "../components/lists/RunList";
import RunCarousel from "../edit/carousels/RunCarousel";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Runs"
      pageActions={<div className="flex flex-row gap-2"></div>}
    >
      <RunCarousel />
      <div className="p-6">
        <RunList pagination={{ limit: 30 }} />
      </div>
    </PageLayout>
  );
};

export default Page;
