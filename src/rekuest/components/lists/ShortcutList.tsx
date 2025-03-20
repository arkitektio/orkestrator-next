import { ListRender } from "@/components/layout/ListRender";
import { RekuestNode } from "@/linkers";
import {
  AgentFilter,
  OffsetPaginationInput,
  ShortcutFilter,
  useShortcutsQuery,
} from "@/rekuest/api/graphql";
import ShortcutCard from "../cards/ShortcutCard";

export type Props = {
  filters?: ShortcutFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useShortcutsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.shortcuts}
      title={
        <RekuestNode.ListLink className="flex-0">
          Toolboxes
        </RekuestNode.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ShortcutCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
