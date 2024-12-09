import { ListRender } from "@/components/layout/ListRender";
import { LokService, MikroDataset } from "@/linkers";

import {
  ClientFilter,
  OffsetPaginationInput,
  ServiceFilter,
  useClientsQuery,
  useListServicesQuery,
} from "@/lok-next/api/graphql";
import ClientCard from "../cards/ClientCard";
import ServiceCard from "../cards/ServiceCard";
import { PlusIcon } from "lucide-react";

export type Props = {
  filters?: ServiceFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListServicesQuery({
    variables: { pagination, filters },
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ListRender
      array={data?.services}
      title={
        <LokService.ListLink className="flex-0">Services</LokService.ListLink>
      }
      refetch={refetch}
      actions={
        <>
          <PlusIcon></PlusIcon>
        </>
      }
    >
      {(ex, index) => <ServiceCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
