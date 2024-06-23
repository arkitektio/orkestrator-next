import { Arkitekt } from "@/arkitekt";
import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import { useListPodQuery } from "../api/graphql";

export type IRepresentationScreenProps = {};

export const Test = () => {
  const { data } = Arkitekt.withKabinet(useListPodQuery)();

  return (
    <div>
      {data?.pods.map((p) => p.id)}
      {JSON.stringify(data)}
    </div>
  );
};

const Page: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout actions={<></>} title="Data">
      <Test />
    </PageLayout>
  );
};

export default Page;