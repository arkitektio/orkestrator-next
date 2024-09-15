import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";
import {
  DatasetFilter,
  OffsetPaginationInput,
  useGetDatasetsQuery,
} from "../../api/graphql";
import DatasetCard from "../cards/DatasetCard";

export type Props = {
  filters?: DatasetFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useGetDatasetsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.datasets}
      title={
        <MikroDataset.ListLink className="flex-0 ">
          Recently used Datasets
        </MikroDataset.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <DatasetCard key={index} dataset={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
