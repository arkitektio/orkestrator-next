import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset, MikroReagent } from "@/linkers";
import {
  OffsetPaginationInput,
  OntologyFilter,
  useListOntologiesQuery,
  useListReagentsQuery,
} from "../../api/graphql";
import OntologyCard from "../cards/OntologyCard";
import ReagentCard from "../cards/ReagentCard";

export type Props = {
  filters?: OntologyFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListReagentsQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.reagents}
      title={
        <MikroReagent.ListLink className="flex-0">
          Reagents
        </MikroReagent.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <ReagentCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
