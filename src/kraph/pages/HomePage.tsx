import { PageLayout } from "@/components/layout/PageLayout";
import { useBigFileUpload } from "@/datalayer/hooks/useUpload";
import { useCreateFile } from "@/lib/mikro/hooks";
import React from "react";
import PopularePlotViewsCarousel from "../components/carousels/PopularePlotViewsCarousel";
import {
  useListGraphQueriesQuery,
  useListPrerenderedGraphQueriesQuery,
} from "../api/graphql";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {
  const performDataLayerUpload = useBigFileUpload();
  const createFile = useCreateFile();

  const { data } = useListPrerenderedGraphQueriesQuery({
    variables: {
      pagination: {
        limit: 5,
        offset: 0,
      },
    },
  });

  return (
    <PageLayout actions={<></>} title="Your data">
      {data?.graphQueries && (
        <PopularePlotViewsCarousel queries={data?.graphQueries} />
      )}
    </PageLayout>
  );
};

export default Page;
