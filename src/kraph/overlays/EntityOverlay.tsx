import { Card } from "@/components/ui/card";
import {
  KraphEntity,
  MikroEntityMetric,
  MikroEntityRelation,
  MikroROI,
} from "@/linkers";
import { useGetEntityQuery } from "../api/graphql";

export const EntityOverlay = (props: { entity: string }) => {
  const { data } = useGetEntityQuery({
    variables: {
      id: props.entity,
    },
  });

  return (
    <div>
      <KraphEntity.DetailLink object={props.entity}>
        {data?.entity?.linkedExpression.expression.label}
      </KraphEntity.DetailLink>

      <div className="grid grid-cols-2 gap-2">
        {data?.entity?.relations.slice(0, 20).map((relation, i) => (
          <Card className="p-2 truncate">
            <MikroEntityRelation.DetailLink
              object={relation.id}
              className={"max-w-[80px] truncate "}
            >
              {relation.linkedExpression.label}
            </MikroEntityRelation.DetailLink>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {data?.entity?.metrics.map((metric, i) => (
          <Card className="p-2 truncate">
            <MikroEntityMetric.DetailLink
              object={metric.id}
              className={"max-w-[80px] truncate "}
            >
              {metric.linkedExpression.label}: {metric.value}
            </MikroEntityMetric.DetailLink>
          </Card>
        ))}
      </div>
    </div>
  );
};
