import { ListRender } from "@/components/layout/ListRender";
import { KraphProtocolStepTemplate } from "@/linkers";
import {
  OffsetPaginationInput,
  ProtocolStepFilter,
  useListProtocolStepTemplatesQuery
} from "../../api/graphql";
import ProtocolStepTemplateCard from "../cards/ProtocolStepTemplateCard";

export type Props = {
  filters?: ProtocolStepFilter;
  pagination?: OffsetPaginationInput;
};

const List = ({ filters, pagination }: Props) => {
  const { data, error, subscribeToMore, refetch } =
    useListProtocolStepTemplatesQuery({
      variables: { filters, pagination },
    });

  return (
    <ListRender
      array={data?.protocolStepTemplates}
      title={
        <KraphProtocolStepTemplate.ListLink className="flex-0">
          Steps
        </KraphProtocolStepTemplate.ListLink>
      }
      refetch={refetch}
    >
      {(ex, index) => (
        <ProtocolStepTemplateCard key={index} item={ex} mates={[]} />
      )}
    </ListRender>
  );
};

export default List;
