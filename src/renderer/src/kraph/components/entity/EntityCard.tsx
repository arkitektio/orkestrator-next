import {
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useGetEntityQuery } from "@/kraph/api/graphql";
import { useGraphScope } from "@/kraph/providers/GraphScopeProvider";
import { KraphNode } from "@/linkers";

export const EntityCard = ({ id }: { id: string }) => {
  // An entity is one graph's drawing of a claim, so without a graph in scope
  // there is nothing to draw. Renders nothing rather than throwing.
  const scope = useGraphScope();
  const { data } = useGetEntityQuery({
    variables: { id, graph: scope?.graphId ?? "" },
    skip: !scope,
  });

  return (
    <CardContent>
      {data?.entity?.id && (
        <KraphNode.DetailLink object={{ id: data.entity.id }} scope={scope?.graphId}>
          <CardTitle>{data?.entity?.category?.label}</CardTitle>
        </KraphNode.DetailLink>
      )}

      <CardDescription>{data?.entity?.label}</CardDescription>
    </CardContent>
  );
};
