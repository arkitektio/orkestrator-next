import { asDetailQueryRoute } from "@/app/routes/DetailQueryRoute";
import { useGetRelationQuery } from "../api/graphql";

import { MikroEntityRelation } from "@/linkers";

export default asDetailQueryRoute(
  useGetRelationQuery,
  ({ data }) => {
    return (
      <MikroEntityRelation.ModelPage
        title={data.relation.category?.label ?? data.relation.label}
        object={{ id: data.relation.id }}
      >
        <div className="font-bold text-xl"> Measurements </div>
        <div className="grid grid-cols-2 gap-2">
          Not implemented
        </div>
      </MikroEntityRelation.ModelPage>
    );
  },
);
