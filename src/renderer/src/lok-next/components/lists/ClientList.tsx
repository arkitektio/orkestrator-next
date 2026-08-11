import { ListRender } from "@/components/layout/ListRender";

import {
  ClientFilter,
  OffsetPaginationInput,
  useClientsQuery,
} from "@/lok-next/api/graphql";
import ClientCard from "../cards/ClientCard";

export type Props = {
  filters?: ClientFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, refetch } = useClientsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.clients}
      title={
        <div className="flex-0">
          Clients
        </div>
      }
      refetch={refetch}
    >
      {(ex, index) => <ClientCard key={index} item={ex} />}
    </ListRender>
  );
};

export default List;
