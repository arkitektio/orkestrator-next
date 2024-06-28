import { withKabinet } from "@/arkitekt";
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
  const { data, error, subscribeToMore, refetch } = withKabinet(
    useListDefinitionsQuery,
  )({
    variables: {},
  });

  return (
    <ListRender
      array={data?.definitions}
      title={
        <KabinetDefinition.ListLink className="flex-0">
          Definition
        </KabinetDefinition.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <DefinitionCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
