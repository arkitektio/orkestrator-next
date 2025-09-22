import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import { DashboardLayout } from "../components/sections/DashboardLayout";

export type IRepresentationScreenProps = Record<string, never>;

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout title="Lok">
      <DashboardLayout />
    </PageLayout>
  );
};

export default Page;
