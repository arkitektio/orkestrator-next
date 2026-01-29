import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";

import {
  ProviderFilter,
  useListChromaCollectionsQuery
} from "@/alpaka/api/graphql";
import {
  OffsetPaginationInput
} from "@/lok-next/api/graphql";
import CollectionCard from "../cards/CollectionCard";

export type Props = {
  filters?: ProviderFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } =
    useListChromaCollectionsQuery({
      variables: { filter: filters, pagination },
    });

  return (
    <ListRender
      array={data?.chromaCollections}
      title={
        <MikroDataset.ListLink className="flex-0">
          Chroma Collections
        </MikroDataset.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <CollectionCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
