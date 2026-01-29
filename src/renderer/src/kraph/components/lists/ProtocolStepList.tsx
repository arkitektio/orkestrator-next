import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";
import {
  OffsetPaginationInput,
  ProtocolStepFilter,
  useListProtocolStepsQuery,
} from "../../api/graphql";
import ProtocolStepCard from "../cards/ProtocolStepCard";

export type Props = {
  filters?: ProtocolStepFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListProtocolStepsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.protocolSteps}
      title={
        <MikroDataset.ListLink className="flex-0">Steps</MikroDataset.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ProtocolStepCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
