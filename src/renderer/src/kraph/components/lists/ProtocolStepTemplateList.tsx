import { ListRender } from "@/components/layout/ListRender";
import { KraphProtocolStepTemplate } from "@/linkers";
import { OffsetPaginationInput } from "../../api/graphql";

// NOTE: "ProtocolStepTemplate" no longer exists in the current backend
// schema (no ProtocolStepFilter / useListProtocolStepTemplatesQuery /
// ProtocolStepTemplateCard remain, and grepping graphql.ts for
// "ProtocolStep" turns up nothing). Nothing in the app currently renders
// this component. Rather than invent a replacement concept or fabricate a
// card for a removed backend type, this is left as an inert placeholder
// that renders nothing, keeping the file compiling until the concept either
// comes back under a new name or this component is removed for good.
export type Props = {
  pagination?: OffsetPaginationInput;
};

const List = (_props: Props) => {
  return (
    <ListRender<never>
      array={undefined}
      title={
        <KraphProtocolStepTemplate.ListLink className="flex-0">
          Steps
        </KraphProtocolStepTemplate.ListLink>
      }
    >
      {() => null}
    </ListRender>
  );
};

export default List;
