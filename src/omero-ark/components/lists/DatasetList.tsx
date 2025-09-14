import { ListRender } from "@/components/layout/ListRender";
import { OmeroArkProject } from "@/linkers";

import { useListDatasetsQuery, useListProjectsQuery } from "@/omero-ark/api/graphql";
import DatasetCard from "../cards/DatasetCard";

const TList = () => {
  const { data, error, subscribeToMore, refetch } = useListDatasetsQuery({
    variables: {},
  });

  return (
    <>
      {error && <div>Error: {error.message}</div>}
      <ListRender
        array={data?.datasets}
        title={
          <OmeroArkProject.ListLink className="flex-0">
            Datasets
          </OmeroArkProject.ListLink>
        }
        refetch={refetch}
      >
        {(ex, index) => <DatasetCard key={index} dataset={ex} mates={[]} />}
      </ListRender>
    </>
  );
};

export default TList;
