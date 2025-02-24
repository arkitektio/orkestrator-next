import { PageLayout } from "@/components/layout/PageLayout";
import { useBigFileUpload } from "@/datalayer/hooks/useUpload";
import { useCreateFile } from "@/lib/mikro/hooks";
import React from "react";
import { useLatestPlotViewsQuery } from "../api/graphql";
import PopularePlotViewsCarousel from "../components/carousels/PopularePlotViewsCarousel";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const performDataLayerUpload = useBigFileUpload();
  const createFile = useCreateFile();

  const {data} = useLatestPlotViewsQuery();


  return (
    <PageLayout actions={<></>} title="Your data">
      {data?.plotViews && <PopularePlotViewsCarousel plots={data?.plotViews} />}
    </PageLayout>
  );
};

export default Page;
