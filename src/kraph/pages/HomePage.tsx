import { PageLayout } from "@/components/layout/PageLayout";
import { useBigFileUpload } from "@/datalayer/hooks/useUpload";
import { useCreateFile } from "@/lib/mikro/hooks";
import React from "react";
import {
  useListPrerenderedGraphQueriesQuery
} from "../api/graphql";
import PopularePlotViewsCarousel from "../components/carousels/PopularePlotViewsCarousel";
import GraphList from "../components/lists/GraphList";

export type IRepresentationScreenProps = {};

const Page: React.FC<IRepresentationScreenProps> = () => {

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
      <GraphList></GraphList>
    </PageLayout>
  );
};

export default Page;
