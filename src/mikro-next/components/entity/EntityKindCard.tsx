import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { MikroEntity } from "@/linkers";
import { useGetEntityKindQuery } from "@/mikro-next/api/graphql";

export const EntityKindCard = ({ id }: { id: string }) => {
  const { data } = useGetEntityKindQuery({
    variables: {
      id: id,
    },
  });

  return (
    <Card className="p-3">
      <CardContent>
        <CardTitle>{data?.entityKind?.label}</CardTitle>

        <CardDescription>{data?.entityKind?.description}</CardDescription>

        <CardDescription>
          {data?.entityKind?.entities.map((field, i) => (
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
