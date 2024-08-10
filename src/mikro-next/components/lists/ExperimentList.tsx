import { ListRender } from "@/components/layout/ListRender";
import { MikroExperiment } from "@/linkers";
import {
  ExperimentFilter,
  OffsetPaginationInput,
  useListExperimentsQuery,
} from "../../api/graphql";
import ExperimentCard from "../cards/ExperimentCard";

export type Props = {
  filters?: ExperimentFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListExperimentsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.experiments}
      title={
        <MikroExperiment.ListLink className="flex-0">
          Experiments
        </MikroExperiment.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ExperimentCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
