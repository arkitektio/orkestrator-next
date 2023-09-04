import React from "react";
import ImageList from "../components/lists/ImageList";
import { PageLayout } from "@/components/layout/PageLayout";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout actions={<></>}>
      haahah
      <ImageList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default ImagesPage;
