import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";
import {
  OffsetPaginationInput,
  OntologyFilter,
  useListGraphsQuery
} from "../../api/graphql";
import GraphCard from "../cards/GraphCard";

export type Props = {
  filters?: OntologyFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListGraphsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.graphs}
      title={
        <MikroDataset.ListLink className="flex-0">Graphs</MikroDataset.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <GraphCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
