import { ListRender } from "@/components/layout/ListRender";
import { KabinetDefinition } from "@/linkers";
import {
  DatasetFilter,
  OffsetPaginationInput,
  useListDefinitionsQuery,
} from "../../api/graphql";
import DefinitionCard from "../cards/DefinitionCard";

export type Props = {
  filters?: DatasetFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListDefinitionsQuery({
    variables: {},
  });

  return (
    <ListRender
      array={data?.definitions}
      title={
        <KabinetDefinition.ListLink className="flex-0 mb-5">
          <h2 className="text-2xl font-bold ">Latest Nodes</h2>
          <div className="text-muted-foreground text-xs mb-3">
            {data?.definitions.length} nodes that your peers have been working
            on
          </div>
        </KabinetDefinition.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <DefinitionCard key={ex.id} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
