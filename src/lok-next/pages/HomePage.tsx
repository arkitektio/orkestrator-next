import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import { DashboardLayout } from "../components/sections/DashboardLayout";
import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { HomePageStatisticsSidebar } from "../sidebars/HomePageStatisticsSidebar";
import { HelpSidebar } from "@/components/sidebars/help";

export type IRepresentationScreenProps = Record<string, never>;

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout title="Lok" sidebars={
      <MultiSidebar map={{
        Statistics: <HomePageStatisticsSidebar />,
        Help: <HelpSidebar />
      }} />
    }>
      <DashboardLayout />
    </PageLayout>
  );
};

export default Page;
