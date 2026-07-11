import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";
import { useListDatasetsQuery } from "@/omero-ark/api/graphql";
import DatasetCard from "../cards/DatasetCard";

const List = () => {
  const { data, error, refetch } = useListDatasetsQuery({
    variables: {},
  });

  return (
    <>
      {error && <div>Error: {error.message}</div>}
      <ListRender
        array={data?.datasets}
        title={
          <MikroDataset.ListLink className="flex-0">
            Latest Datasets
          </MikroDataset.ListLink>
        }
        refetch={() => refetch()}
      >
        {(ex, index) => <DatasetCard key={index} item={ex} />}
      </ListRender>
    </>
  );
};

export default List;
