import { ListRender } from "@/components/layout/ListRender";
import { MikroStage } from "@/linkers";
import {
  DatasetFilter,
  OffsetPaginationInput,
  useGetStagesQuery,
} from "../../api/graphql";
import StageCard from "../cards/StageCard";

export type Props = {
  filters?: DatasetFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useGetStagesQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.stages}
      title={
        <MikroStage.ListLink className="flex-0">Stagess</MikroStage.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <StageCard key={index} stage={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
