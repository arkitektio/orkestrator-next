import { PageLayout } from "@/components/layout/PageLayout";
import { useBigFileUpload } from "@/datalayer/hooks/useUpload";
import { useCreateFile } from "@/lib/mikro/hooks";
import React from "react";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const performDataLayerUpload = useBigFileUpload();
  const createFile = useCreateFile();

  return (
    <PageLayout actions={<></>} title="Your data">
      <div className="flex flex-col w-full h-full">
        Your insight is our pleasure.
      </div>
    </PageLayout>
  );
};

export default Page;
