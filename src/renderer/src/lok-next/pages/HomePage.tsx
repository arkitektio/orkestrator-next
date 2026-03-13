import { MultiSidebar } from "@/components/layout/MultiSidebar";
import { PageLayout } from "@/components/layout/PageLayout";
import { HelpSidebar } from "@/components/sidebars/help";
import { Link } from "@/components/ui/link";
import React from "react";
import { DashboardLayout } from "../components/sections/DashboardLayout";
import { HomePageStatisticsSidebar } from "../sidebars/HomePageStatisticsSidebar";

export type IRepresentationScreenProps = Record<string, never>;

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout title="Lok" sidebars={
      <MultiSidebar map={{
        Statistics: <HomePageStatisticsSidebar />,
        Help: <HelpSidebar />
      }}></MultiSidebar>

    } pageActions={<>
      <Link to="/lok/record">Record

      </Link></>}>
      <DashboardLayout />
    </PageLayout>
  );
};

export default Page;
