import { ListRender } from "@/components/layout/ListRender";
import { MikroDataset } from "@/linkers";

import { ProviderFilter, useListLlModelsQuery } from "@/alpaka/api/graphql";
import { OffsetPaginationInput } from "@/lok-next/api/graphql";
import LLMModelCard from "../cards/LLMModelCard";

export type Props = {
  filters?: ProviderFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } = useListLlModelsQuery({
    variables: { filter: filters, pagination },
  });

  if (error) {
    return <div>Error loading models</div>;
  }

  return (
    <ListRender
      array={data?.llmModels}
      title={
        <MikroDataset.ListLink className="flex-0">
          Chroma Collections
        </MikroDataset.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => <LLMModelCard key={index} item={ex} mates={[]} />}
    </ListRender>
  );
};

export default List;
