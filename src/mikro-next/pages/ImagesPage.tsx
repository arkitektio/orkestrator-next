import { PageLayout } from "@/components/layout/PageLayout";
import React from "react";
import ImageList from "../components/lists/ImageList";

export type IRepresentationScreenProps = {};

const ImagesPage: React.FC<IRepresentationScreenProps> = () => {
  return (
    <PageLayout actions={<></>}>
      <ImageList pagination={{ limit: 30 }} />
    </PageLayout>
  );
};

export default ImagesPage;
