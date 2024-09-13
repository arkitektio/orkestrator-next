import { Arkitekt } from "@/arkitekt/Arkitekt";
import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const { fakts } = Arkitekt.useFakts();

  return (
    <PageLayout actions={<></>} title="Home">
      <pre>{JSON.stringify(fakts, null, 3)}</pre>
    </PageLayout>
  );
};

export default Page;
