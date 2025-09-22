import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetLinkedExpressionQuery,
  usePinLinkedExpressionMutation,
} from "@/kraph/api/graphql";
import { KraphNode } from "@/linkers";

export const EntityKindCard = ({ id }: { id: string }) => {
  const { data } = useGetLinkedExpressionQuery({
    variables: {
      id: id,
    },
  });

  const [link] = usePinLinkedExpressionMutation({});

  return (
    <Card className="p-3">
      <CardContent>
        <CardTitle>{data?.linkedExpression?.expression.label}</CardTitle>

        <CardDescription>{data?.linkedExpression?.graph.id}</CardDescription>

        <CardDescription>
          {data?.linkedExpression?.entities.map((field, i) => (
            <Card key={i}>
              <KraphNode.DetailLink object={field.id}>
                {field.name}
              </KraphNode.DetailLink>
            </Card>
          ))}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
