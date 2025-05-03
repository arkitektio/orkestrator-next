import { ListRender } from "@/components/layout/ListRender";
import { RekuestAction } from "@/linkers";
import {
  ActionFilter,
  OffsetPaginationInput,
  useAllActionsQuery,
} from "@/rekuest/api/graphql";
import ActionCard from "../cards/ActionCard";

export type Props = {
  filters?: ActionFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useAllActionsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.actions}
      title={
        <RekuestAction.ListLink className="flex-0">Actions</RekuestAction.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ActionCard key={index} action={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
