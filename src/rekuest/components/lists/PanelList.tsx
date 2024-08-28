import { ListRender } from "@/components/layout/ListRender";
import { RekuestDashboard } from "@/linkers";
import {
  AgentFilter,
  OffsetPaginationInput,
  useListPanelsQuery,
} from "@/rekuest/api/graphql";
import PanelCard from "../cards/PanelCard";

export type Props = {
  filters?: AgentFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListPanelsQuery({});

  return (
    <ListRender
      array={data?.panels}
      title={
        <RekuestDashboard.ListLink className="flex-0">
          Panels
        </RekuestDashboard.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <PanelCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
