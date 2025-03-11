import { withKabinet } from "@/arkitekt";
import { ListRender } from "@/components/layout/ListRender";
import { KabinetDefinition } from "@/linkers";
import { OffsetPaginationInput, useListPodQuery } from "../../api/graphql";
import PodCard from "../cards/PodCard";

export type Props = {
  pagination?: OffsetPaginationInput;
};

const List = ({ pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = withKabinet(
    useListPodQuery,
  )({
    variables: {},
  });

  return (
    <ListRender
      array={data?.pods}
      title={
        <KabinetDefinition.ListLink className="flex-0 mb-5">
          <h2 className="text-2xl font-bold ">Running Pods</h2>
          <div className="text-muted-foreground text-xs mb-3">
            {data?.pods.length} pods that are currently running
          </div>
        </KabinetDefinition.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <PodCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
