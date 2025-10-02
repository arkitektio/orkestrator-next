import { ListRender } from "@/components/layout/ListRender";
import { RekuestInterface } from "@/linkers";
import {
  InterfaceFilter,
  OffsetPaginationInput,
  useListInterfacesQuery,
} from "@/rekuest/api/graphql";
import InterfaceCard from "../cards/InterfaceCard";

export type Props = {
  filters?: InterfaceFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListInterfacesQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.interfaces}
      title={
        <RekuestInterface.ListLink className="flex-0">
          Interfaces
        </RekuestInterface.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <InterfaceCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
