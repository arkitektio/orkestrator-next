import { ListRender } from "@/components/layout/ListRender";
import { RekuestAction } from "@/linkers";
import {
  OffsetPaginationInput,
  StructurePackageFilter,
  useListStructurePackageQuery,
} from "@/rekuest/api/graphql";
import StructurePackageCard from "../cards/StructurePackageCard";

export type Props = {
  filters?: StructurePackageFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } =
    useListStructurePackageQuery({
      variables: { filters, pagination },
    });

  return (
    <ListRender
      array={data?.structurePackages}
      title={
        <RekuestAction.ListLink className="flex-0">
          Toolboxes
        </RekuestAction.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <StructurePackageCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
