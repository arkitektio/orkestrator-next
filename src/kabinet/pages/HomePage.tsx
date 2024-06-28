import { Arkitekt } from "@/arkitekt";
import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import { useListDefinitionsQuery } from "../api/graphql";
import { PopularCarousel } from "../components/PopularCarousel";
import DefinitionList from "../components/lists/DefinitionList";

export type IRepresentationScreenProps = {};

export const Test = () => {
  const { data } = Arkitekt.withKabinet(useListDefinitionsQuery)();

  return <div>{data?.definitions.map((p) => p.name)}</div>;
};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout actions={<></>} title="Data">
      <PopularCarousel />
      <DefinitionList />
    </PageLayout>
  );
};

export default Page;
