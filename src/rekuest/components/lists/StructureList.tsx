import { ListRender } from "@/components/layout/ListRender";
import { RekuestStructure } from "@/linkers";
import {
  OffsetPaginationInput,
  StructurePackageFilter,
  useListStructuresQuery,
} from "@/rekuest/api/graphql";
import StructureCard from "../cards/StructureCard";

export type Props = {
  filters?: StructurePackageFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListStructuresQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.structures}
      title={
        <RekuestStructure.ListLink className="flex-0">
          Structures
        </RekuestStructure.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <StructureCard key={ex.id} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
