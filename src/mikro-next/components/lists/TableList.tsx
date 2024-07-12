import { ListRender } from "@/components/layout/ListRender";
import { MikroTable } from "@/linkers";
import {
  DatasetFilter,
  OffsetPaginationInput,
  useGetTablesQuery,
} from "../../api/graphql";
import TableCard from "../cards/TableCard";

export type Props = {
  filters?: DatasetFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useGetTablesQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.tables}
      title={
        <MikroTable.ListLink className="flex-0">Datasets</MikroTable.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <TableCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
