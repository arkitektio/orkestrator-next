import { ListRender } from "@/components/layout/ListRender";
import { RekuestAction, RekuestSpace } from "@/linkers";
import {
  AgentFilter,
  OffsetPaginationInput,
  useSpacesQuery,
  useToolboxesQuery,
} from "@/rekuest/api/graphql";
import ToolboxCard from "../cards/ToolboxCard";
import SpaceCard from "../cards/SpaceCard";

export type Props = {
  filters?: AgentFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useSpacesQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.spaces}
      title={
        <RekuestSpace.ListLink className="flex-0">
          Spaces
        </RekuestSpace.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <SpaceCard key={index} item={ex} />}
    </ListRender>
  );
};

export default List;
