import { ListRender } from "@/components/layout/ListRender";
import { MikroADataset } from "@/linkers";
import {
  ADatasetFilter,
  OffsetPaginationInput,
  useGetADatasetsQuery,
} from "../../api/graphql";
import ADatasetCard from "../cards/ADatasetCard";

export type Props = {
  filters?: ADatasetFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, refetch } = useGetADatasetsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.adatasets}
      title={
        <MikroADataset.ListLink className="flex-0">
          Latest Array Datasets
        </MikroADataset.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ADatasetCard key={index} adataset={ex} />}
    </ListRender>
  );
};

export default List;
