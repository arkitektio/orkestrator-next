import { PageLayout } from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { PopularCarousel } from "../components/PopularCarousel";
import DefinitionList from "../components/lists/DefinitionList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout actions={<></>} title="App Store">
      <div className="p-3">
        <PopularCarousel />

        <Separator className="mt-8 mb-2" />

        <DefinitionList />
      </div>
    </PageLayout>
  );
};

export default Page;
