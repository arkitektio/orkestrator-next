import { PageLayout } from "@/components/layout/PageLayout";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React from "react";
import TraceList from "../components/lists/TraceList";
export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout title="Elektro" actions={<></>}>
      <TraceList />

      <Separator />
    </PageLayout>
  );
};

export default Page;
