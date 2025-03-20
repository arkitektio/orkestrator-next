import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";

import {
  ClientFilter,
  LayerFilter,
  OffsetPaginationInput,
  useAppsQuery,
  useClientsQuery,
  useLayersQuery,
} from "@/lok-next/api/graphql";
import ClientCard from "../cards/ClientCard";
import AppCard from "../cards/AppCard";
import LayerCard from "../cards/LayerCard";

export type Props = {
  filters?: LayerFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useLayersQuery({
    variables: { filters, pagination },
  });

  return (
    <ListRender
      array={data?.layers} // changed from clients to apps  here
      title={
        <MikroDataset.ListLink className="flex-0">Apps</MikroDataset.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <LayerCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
