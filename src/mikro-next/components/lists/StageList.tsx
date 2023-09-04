import { withMikroNext } from "@jhnnsrs/mikro-next";
import {
  DatasetFilter,
  OffsetPaginationInput,
  useGetStagesQuery,
} from "../../api/graphql";
import StageCard from "../cards/StageCard";
import { ListRender } from "@/components/layout/ListRender";
import { MikroStage } from "@/linkers";

export type Props = {
  filters?: DatasetFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = withMikroNext(
    useGetStagesQuery,
  )({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.stages}
      title={
        <MikroStage.ListLink className="flex-0">Stages</MikroStage.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <StageCard key={index} stage={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
