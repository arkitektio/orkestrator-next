import { ListRender } from "@/components/layout/ListRender";
import { KraphReagent } from "@/linkers";
import { OffsetPaginationInput } from "../../api/graphql";

// NOTE: "Reagent" no longer exists in the current backend schema (no
// useListReagentsQuery / ReagentCard remain, and grepping graphql.ts for
// "Reagent" turns up nothing at all). Nothing in the app currently renders
// this component. Rather than invent a replacement concept or fabricate a
// card for a removed backend type, this is left as an inert placeholder that
// renders nothing, keeping the file compiling until the concept either comes
// back under a new name or this component is removed for good.
export type Props = {
  pagination?: OffsetPaginationInput;
};

const List = (_props: Props) => {
  return (
    <ListRender<never>
      array={undefined}
      title={
        <KraphReagent.ListLink className="flex-0">
          Reagents
        </KraphReagent.ListLink>
      }
    >
      {() => null}
    </ListRender>
  );
};

export default List;
