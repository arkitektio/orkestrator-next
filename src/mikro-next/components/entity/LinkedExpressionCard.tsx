import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { MikroEntity } from "@/linkers";
import {
  useGetLinkedExpressionQuery,
  usePinLinkedExpressionMutation,
} from "@/mikro-next/api/graphql";

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
              <MikroEntity.DetailLink object={field.id}>
                {field.name}
              </MikroEntity.DetailLink>
            </Card>
          ))}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
