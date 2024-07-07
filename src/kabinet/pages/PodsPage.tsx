import { PageLayout } from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";
import React from "react";
import PodsList from "../components/lists/PodsList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout actions={<></>} title="Pods">
      <div className="p-3">

      <PodsList />
        <Separator className="mt-8 mb-2" />

      </div>
    </PageLayout>
  );
};

export default Page;
