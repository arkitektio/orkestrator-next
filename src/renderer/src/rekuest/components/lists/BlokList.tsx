import { ListRender } from "@/components/layout/ListRender";
import { RekuestBlok } from "@/linkers";
import {
  AgentFilter,
  OffsetPaginationInput,
  useListBloksQuery,
} from "@/rekuest/api/graphql";
import BlokCard from "../cards/BlokCard";

export type Props = {
  filters?: AgentFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListBloksQuery({});

  return (
    <ListRender
      array={data?.bloks}
      title={
        <RekuestBlok.ListLink className="flex-0">Bloks</RekuestBlok.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <BlokCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
