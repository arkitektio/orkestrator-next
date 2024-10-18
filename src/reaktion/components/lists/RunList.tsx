import { ListRender } from "@/components/layout/ListRender";
import { FlussWorkspace } from "@/linkers";
import {
  OffsetPaginationInput,
  useListRunsQuery,
} from "@/reaktion/api/graphql";
import RunCard from "../cards/RunCard";

export type Props = {
  pagination?: OffsetPaginationInput;
};

const List = ({ pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListRunsQuery({
    variables: { pagination },
  });

  return (
    <ListRender
      array={data?.runs}
      title={
        <FlussWorkspace.ListLink className="flex-0">
          Runs
        </FlussWorkspace.ListLink>
      }
      refetch={refetch}
    >
      {(item, index) => <RunCard key={index} item={item} mates={[]} />}
    </ListRender>
  );
};

export default List;
